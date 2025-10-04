import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

// Simple session store using Map (in production, use Redis or a database)
interface Session {
  id: string;
  guideId: string;
  email: string;
  createdAt: Date;
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
  return sessions.get(sessionId);
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
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
