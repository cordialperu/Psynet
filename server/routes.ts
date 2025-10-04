import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createSession, deleteSession, requireAuth } from "./auth";
import { insertGuideSchema, insertTherapySchema } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + randomUUID().slice(0, 8);
}

// Helper to hash passwords using bcrypt
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { fullName, email, password } = req.body;
      
      // Check if guide already exists
      const existing = await storage.getGuideByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create guide with hashed password
      const guideId = randomUUID();
      const passwordHash = await hashPassword(password);
      
      const guide = await storage.createGuide({
        id: guideId,
        fullName,
        email,
        passwordHash,
      });

      res.json({ message: "Registration successful", guideId: guide.id });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const guide = await storage.getGuideByEmail(email);
      if (!guide || !(await verifyPassword(password, guide.passwordHash))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const sessionId = createSession(guide.id, guide.email);
      const { passwordHash, ...guideWithoutPassword } = guide;
      res.json({ sessionId, guide: guideWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req: Request, res: Response) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (sessionId) {
      deleteSession(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const guide = await storage.getGuide(session.guideId);
      
      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }

      const { passwordHash, ...guideWithoutPassword } = guide;
      res.json(guideWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch profile" });
    }
  });

  // Guide profile routes
  app.patch("/api/guides/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const updateData = req.body;

      // Don't allow updating email or id
      delete updateData.id;
      delete updateData.email;

      const guide = await storage.updateGuide(session.guideId, updateData);
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update profile" });
    }
  });

  // Therapy routes
  app.get("/api/therapies/featured", async (_req: Request, res: Response) => {
    try {
      const therapies = await storage.getFeaturedTherapies(6);
      res.json(therapies);
    } catch (error) {
      console.error("Featured therapies error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });

  app.get("/api/therapies/published", async (req: Request, res: Response) => {
    try {
      const { type, location, search } = req.query;
      const therapies = await storage.getPublishedTherapies({
        type: type as string,
        location: location as string,
        search: search as string,
      });
      res.json(therapies);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });

  app.get("/api/therapies/slug/:slug", async (req: Request, res: Response) => {
    try {
      const therapy = await storage.getTherapyBySlug(req.params.slug);
      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }
      res.json(therapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapy" });
    }
  });

  app.get("/api/therapies/my-therapies", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const therapies = await storage.getTherapiesByGuideId(session.guideId);
      res.json(therapies);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });

  app.get("/api/therapies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const therapy = await storage.getTherapy(req.params.id);
      
      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }

      if (therapy.guideId !== session.guideId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(therapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapy" });
    }
  });

  app.post("/api/therapies", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const guide = await storage.getGuide(session.guideId);

      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }

      const therapyData = {
        ...req.body,
        guideId: session.guideId,
        guideName: guide.fullName,
        guidePhotoUrl: guide.profilePhotoUrl,
        slug: generateSlug(req.body.title),
      };

      const therapy = await storage.createTherapy(therapyData);
      res.json(therapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create therapy" });
    }
  });

  app.patch("/api/therapies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const therapy = await storage.getTherapy(req.params.id);

      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }

      if (therapy.guideId !== session.guideId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updateData = { ...req.body };

      // Update slug if title changed
      if (updateData.title && updateData.title !== therapy.title) {
        updateData.slug = generateSlug(updateData.title);
      }

      // Update guide info if available
      const guide = await storage.getGuide(session.guideId);
      if (guide) {
        updateData.guideName = guide.fullName;
        updateData.guidePhotoUrl = guide.profilePhotoUrl;
      }

      const updatedTherapy = await storage.updateTherapy(req.params.id, updateData);
      res.json(updatedTherapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update therapy" });
    }
  });

  app.delete("/api/therapies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const therapy = await storage.getTherapy(req.params.id);

      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }

      if (therapy.guideId !== session.guideId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteTherapy(req.params.id);
      res.json({ message: "Therapy deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to delete therapy" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
