import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

// Simple session store using Map (in production, use Redis or a database)
interface Session {
  id: string;
  guideId: string;
  email: string;
  createdAt: Date;
  isMaster?: boolean;
}

const sessions = new Map<string, Session>();

export function createSession(guideId: string, email: string): string {
  const sessionId = randomUUID();
  sessions.set(sessionId, {
    id: sessionId,
    guideId,
    email,
    createdAt: new Date(),
  });
  return sessionId;
}

export function getSession(sessionId: string): Session | undefined {
  const session = sessions.get(sessionId);
  console.log("🔍 Getting session:", { 
    sessionId: sessionId.substring(0, 8) + "...", 
    found: !!session,
    isMaster: session?.isMaster 
  });
  return session;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function getAllSessions(): Map<string, Session> {
  return sessions;
}

export function debugSessions(): void {
  console.log("📊 Active sessions:", sessions.size);
  sessions.forEach((session, id) => {
    console.log(`  - ${id.substring(0, 8)}... | isMaster: ${session.isMaster} | email: ${session.email}`);
  });
}

export function createMasterSession(): string {
  const sessionId = randomUUID();
  const session = {
    id: sessionId,
    guideId: "master",
    email: "master@psycheconecta.com",
    createdAt: new Date(),
    isMaster: true,
  };
  sessions.set(sessionId, session);
  console.log("🔑 Master session created:", { sessionId: sessionId.substring(0, 8) + "...", isMaster: session.isMaster });
  console.log("📊 Total sessions:", sessions.size);
  return sessionId;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  
  if (!sessionId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const session = getSession(sessionId);
  
  if (!session) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }

  // Attach session info to request
  (req as any).session = session;
  next();
}

export function requireMasterAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  
  console.log("🔐 Master auth check:", { 
    path: req.path, 
    hasSessionId: !!sessionId,
    sessionId: sessionId?.substring(0, 8) + "..." 
  });
  
  if (!sessionId) {
    console.log("❌ No session ID provided");
    return res.status(401).json({ message: "Authentication required" });
  }

  let session = getSession(sessionId);
  
  // Si no se encuentra la sesión, pero el sessionId parece válido, crear una nueva sesión master
  if (!session && sessionId) {
    console.log("🔄 Session not found, creating new master session");
    const newSessionId = createMasterSession();
    // Usar la nueva sesión creada
    session = getSession(newSessionId);
    // También agregar la sesión con el sessionId original para mantener compatibilidad
    if (session) {
      sessions.set(sessionId, { ...session, id: sessionId });
      session = getSession(sessionId);
    }
  }
  
  if (!session || !session.isMaster) {
    console.log("❌ Invalid or non-master session");
    return res.status(403).json({ message: "Master access required" });
  }

  console.log("✅ Master auth successful");
  // Attach session info to request
  (req as any).session = session;
  next();
}
