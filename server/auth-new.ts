import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { sessions, guides, appConfig } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import { logger, logError, logWarn } from "./logger";
import bcrypt from "bcrypt";

const SESSION_DURATION_HOURS = 24 * 7; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Create session in database
export async function createSession(guideId: string, email: string): Promise<string> {
  try {
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);

    await db.insert(sessions).values({
      sessionId,
      guideId,
      email,
      isMaster: false,
      expiresAt,
    });

    logger.info(`Session created for guide ${guideId}`);
    return sessionId;
  } catch (error) {
    logError("Failed to create session", error as Error, { guideId, email });
    throw error;
  }
}

// Create master session
export async function createMasterSession(): Promise<string> {
  try {
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);

    await db.insert(sessions).values({
      sessionId,
      guideId: "master",
      email: "master@psycheconecta.com",
      isMaster: true,
      expiresAt,
    });

    logger.info("Master session created");
    return sessionId;
  } catch (error) {
    logError("Failed to create master session", error as Error);
    throw error;
  }
}

// Get session from database
export async function getSession(sessionId: string) {
  try {
    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.sessionId, sessionId),
          gt(sessions.expiresAt, new Date())
        )
      );

    if (session) {
      // Update last activity
      await db
        .update(sessions)
        .set({ lastActivity: new Date() })
        .where(eq(sessions.sessionId, sessionId));
    }

    return session;
  } catch (error) {
    logError("Failed to get session", error as Error, { sessionId });
    return undefined;
  }
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await db.delete(sessions).where(eq(sessions.sessionId, sessionId));
    logger.info(`Session deleted: ${sessionId}`);
  } catch (error) {
    logError("Failed to delete session", error as Error, { sessionId });
  }
}

// Clean expired sessions (should be run periodically)
export async function cleanExpiredSessions(): Promise<void> {
  try {
    const result = await db
      .delete(sessions)
      .where(gt(new Date(), sessions.expiresAt));
    
    logger.info(`Cleaned expired sessions`);
  } catch (error) {
    logError("Failed to clean expired sessions", error as Error);
  }
}

// Get master code from config
export async function getMasterCode(): Promise<string> {
  try {
    const [config] = await db
      .select()
      .from(appConfig)
      .where(eq(appConfig.key, "master_code"));
    
    return config?.value as string || "333";
  } catch (error) {
    logError("Failed to get master code from config", error as Error);
    return "333"; // Fallback
  }
}

// Check if guide is locked
export async function isGuideLocked(guideId: string): Promise<boolean> {
  try {
    const [guide] = await db
      .select()
      .from(guides)
      .where(eq(guides.id, guideId));
    
    if (!guide) return false;
    
    if (guide.lockedUntil && guide.lockedUntil > new Date()) {
      return true;
    }
    
    // Reset lock if expired
    if (guide.lockedUntil && guide.lockedUntil <= new Date()) {
      await db
        .update(guides)
        .set({ 
          lockedUntil: null, 
          failedLoginAttempts: 0 
        })
        .where(eq(guides.id, guideId));
    }
    
    return false;
  } catch (error) {
    logError("Failed to check guide lock status", error as Error, { guideId });
    return false;
  }
}

// Record failed login attempt
export async function recordFailedLogin(guideId: string): Promise<void> {
  try {
    const [guide] = await db
      .select()
      .from(guides)
      .where(eq(guides.id, guideId));
    
    if (!guide) return;
    
    const attempts = (guide.failedLoginAttempts || 0) + 1;
    
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + LOCKOUT_DURATION_MINUTES);
      
      await db
        .update(guides)
        .set({ 
          failedLoginAttempts: attempts,
          lockedUntil 
        })
        .where(eq(guides.id, guideId));
      
      logWarn(`Guide locked due to failed login attempts`, { guideId, attempts });
    } else {
      await db
        .update(guides)
        .set({ failedLoginAttempts: attempts })
        .where(eq(guides.id, guideId));
    }
  } catch (error) {
    logError("Failed to record failed login", error as Error, { guideId });
  }
}

// Reset failed login attempts
export async function resetFailedLogins(guideId: string): Promise<void> {
  try {
    await db
      .update(guides)
      .set({ 
        failedLoginAttempts: 0,
        lockedUntil: null 
      })
      .where(eq(guides.id, guideId));
  } catch (error) {
    logError("Failed to reset failed logins", error as Error, { guideId });
  }
}

// Middleware: Require authentication
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Try to get session from cookie first, then from Authorization header
    const sessionId = req.cookies?.sessionId || req.headers.authorization?.replace("Bearer ", "");
    
    if (!sessionId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const session = await getSession(sessionId);
    
    if (!session) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    // Attach session info to request
    (req as any).session = session;
    next();
  } catch (error) {
    logError("Authentication middleware error", error as Error);
    return res.status(500).json({ message: "Authentication error" });
  }
}

// Middleware: Require master authentication
export async function requireMasterAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies?.sessionId || req.headers.authorization?.replace("Bearer ", "");
    
    if (!sessionId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const session = await getSession(sessionId);
    
    if (!session || !session.isMaster) {
      return res.status(403).json({ message: "Master access required" });
    }

    // Attach session info to request
    (req as any).session = session;
    next();
  } catch (error) {
    logError("Master authentication middleware error", error as Error);
    return res.status(500).json({ message: "Authentication error" });
  }
}

// Generate CSRF token
export function generateCsrfToken(): string {
  return randomUUID();
}

// Validate CSRF token
export function validateCsrfToken(req: Request): boolean {
  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.cookies?.csrfToken;
  
  return token && sessionToken && token === sessionToken;
}
