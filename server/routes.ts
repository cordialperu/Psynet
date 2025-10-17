import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createSession, deleteSession, requireAuth, createMasterSession, requireMasterAuth, debugSessions } from "./auth";
import { insertGuideSchema, insertTherapySchema } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { createNewListingNotification, createUpdateListingNotification, generateWhatsAppLink } from "./whatsapp";

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
  
  // Health check endpoint
  app.get("/health", async (_req: Request, res: Response) => {
    try {
      // Simple database health check
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(503).json({
        status: "error",
        message: error instanceof Error ? error.message : "Health check failed"
      });
    }
  });

  // API health check endpoint (for Render and monitoring)
  app.get("/api/health", async (_req: Request, res: Response) => {
    try {
      // Simple health check without database query to avoid timeouts
      const hasDbUrl = !!process.env.DATABASE_URL;
      
      res.json({
        status: "ok",
        database: hasDbUrl ? "configured" : "not configured",
        databaseUrl: hasDbUrl ? "present" : "missing",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(503).json({
        status: "error",
        database: "error",
        message: error instanceof Error ? error.message : "Health check failed"
      });
    }
  });

  // API version endpoint
  app.get("/api/version", (_req: Request, res: Response) => {
    res.json({ version: "1.0.0", api: "Psynet v1" });
  });

  // Database diagnostic endpoint
  app.get("/api/debug/db", async (_req: Request, res: Response) => {
    try {
      console.log('🔍 Testing database connection...');
      const therapies = await storage.getPublishedTherapies();
      
      res.json({
        status: "ok",
        database: "connected",
        therapyCount: therapies.length,
        sampleTherapies: therapies.slice(0, 3).map(t => ({
          id: t.id,
          title: t.title,
          country: t.country,
          category: t.category
        })),
        databaseUrl: process.env.DATABASE_URL ? "configured" : "missing"
      });
    } catch (error) {
      console.error('❌ Database test failed:', error);
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        databaseUrl: process.env.DATABASE_URL ? "configured" : "missing"
      });
    }
  });

  // Check videos endpoint
  app.get("/api/debug/videos", async (_req: Request, res: Response) => {
    try {
      const allTherapies = await storage.getAllTherapies();
      const therapiesWithVideos = allTherapies.filter(t => t.videoUrl && t.videoUrl.trim() !== '');
      
      res.json({
        total: allTherapies.length,
        withVideos: therapiesWithVideos.length,
        withoutVideos: allTherapies.length - therapiesWithVideos.length,
        samples: therapiesWithVideos.slice(0, 10).map(t => ({
          title: t.title,
          videoUrl: t.videoUrl,
          category: t.category,
          country: t.country
        }))
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { fullName, email, whatsapp, instagram, tiktok, password } = req.body;
      
      // Validate required fields
      if (!fullName || !email || !whatsapp || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate at least one social media
      if (!instagram && !tiktok) {
        return res.status(400).json({ message: "At least Instagram or TikTok is required" });
      }
      
      // Check if guide already exists
      const existing = await storage.getGuideByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create guide with hashed password
      const passwordHash = await hashPassword(password);
      
      // Pass all required fields including passwordHash
      const guide = await storage.createGuide({
        fullName,
        email,
        whatsapp,
        password, // Required by InsertGuide schema
        instagram: instagram || null,
        tiktok: tiktok || null,
        passwordHash, // Additional field for actual storage
      } as any);

      res.json({ message: "Registration successful", guideId: guide.id });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      console.log('🔐 Login attempt for:', email);
      
      const guide = await storage.getGuideByEmail(email);
      
      if (!guide) {
        console.log('❌ Guide not found');
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      console.log('✅ Guide found:', guide.fullName);
      console.log('🔑 Checking password...');
      
      const isValidPassword = await verifyPassword(password, guide.passwordHash);
      
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      console.log('✅ Password valid, creating session...');
      const sessionId = createSession(guide.id, guide.email);
      console.log('✅ Session created:', sessionId);
      
      const { passwordHash, ...guideWithoutPassword } = guide;
      res.json({ sessionId, guide: guideWithoutPassword });
    } catch (error) {
      console.error('❌ Login error:', error);
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
      
      // Si es master, devolver perfil master
      if (session.isMaster) {
        return res.json({
          id: "master",
          email: session.email || "master@psycheconecta.com",
          fullName: "Super Administrador",
          isMaster: true
        });
      }
      
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
      
      // If fullName or profilePhotoUrl changed, update all therapies
      if (updateData.fullName || updateData.profilePhotoUrl) {
        const therapies = await storage.getTherapiesByGuideId(session.guideId);
        const therapyUpdates: any = {};
        
        if (updateData.fullName) {
          therapyUpdates.guideName = updateData.fullName;
        }
        if (updateData.profilePhotoUrl) {
          therapyUpdates.guidePhotoUrl = updateData.profilePhotoUrl;
        }
        
        // Update all therapies with new guide info
        for (const therapy of therapies) {
          await storage.updateTherapy(therapy.id, therapyUpdates);
        }
        
        console.log(`✅ Updated ${therapies.length} therapies with new guide info`);
      }
      
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
      const { type, location, search, country } = req.query;
      
      // Add logging for debugging
      console.log("Fetching published therapies with filters:", { type, location, search, country });
      
      const therapies = await storage.getPublishedTherapies({
        type: type as string,
        location: location as string,
        search: search as string,
        country: country as string,
      });
      
      console.log(`Found ${therapies.length} published therapies`);
      res.json(therapies);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch therapies";
      console.error("Error fetching published therapies:", error);
      res.status(500).json({ message, error: process.env.NODE_ENV === "development" ? String(error) : undefined });
    }
  });

  // Legacy support: allow older clients to hit /api/therapies and receive published listings
  app.get("/api/therapies", async (req: Request, res: Response) => {
    const { type, location, search, country } = req.query;

    try {
      const therapies = await storage.getPublishedTherapies({
        type: type as string,
        location: location as string,
        search: search as string,
        country: country as string,
      });

      res.json(therapies);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch therapies";
      console.error("Error fetching therapies (legacy route):", message);

      // Return empty array to avoid breaking legacy clients; errors are logged above.
      res.status(200).json([]);
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

      const isMaster = session.isMaster === true;
      const isOwner = therapy.guideId === session.guideId;

      console.log('🔐 Access check for therapy edit:', {
        therapyId: therapy.id,
        therapyTitle: therapy.title,
        therapyGuideId: therapy.guideId,
        sessionGuideId: session.guideId,
        isMaster,
        isOwner,
        accessGranted: isOwner || isMaster
      });

      if (!isOwner && !isMaster) {
        console.log('❌ Access denied - not owner and not master');
        return res.status(403).json({ message: "Access denied" });
      }

      console.log('✅ Access granted');
      res.json(therapy);
    } catch (error) {
      console.error('❌ Error fetching therapy:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch therapy",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      });
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
        approvalStatus: "pending", // Nueva terapia en revisión
        published: false, // No publicada hasta que sea aprobada
      };

      // Log video URL for debugging
      if (therapyData.videoUrl) {
        console.log(`🎥 Video URL received: ${therapyData.videoUrl}`);
      } else {
        console.log("⚠️ Warning: No video URL provided");
      }

      const therapy = await storage.createTherapy(therapyData);
      
      console.log(`✅ Nueva terapia creada por ${guide.fullName}: ${therapy.title}`);
      console.log(`📋 ID: ${therapy.id} - Estado: pending`);
      
      // Enviar notificación por WhatsApp a ambos administradores (Perú y México) en paralelo
      try {
        const adminSettings = await storage.getAdminSettings();
        if (adminSettings && (adminSettings.adminWhatsapp || adminSettings.adminWhatsappMexico)) {
          const adminUrl = process.env.APP_URL || "http://localhost:5001";
          const message = createNewListingNotification({
            category: therapy.category || "ceremonias",
            title: therapy.title,
            price: therapy.price || "0",
            currency: therapy.currency || "USD",
            guideName: guide.fullName,
            guidePhone: guide.whatsapp,
            therapyId: therapy.id,
            adminUrl,
          });
          
          // Enviar a administrador de Perú
          if (adminSettings.adminWhatsapp) {
            const whatsappLinkPeru = generateWhatsAppLink(adminSettings.adminWhatsapp, message);
            console.log(`📱 WhatsApp notification link generated for Peru admin: ${adminSettings.adminName}`);
            console.log(`🔗 Perú: ${whatsappLinkPeru}`);
          }
          
          // Enviar a administrador de México
          if (adminSettings.adminWhatsappMexico) {
            const whatsappLinkMexico = generateWhatsAppLink(adminSettings.adminWhatsappMexico, message);
            console.log(`📱 WhatsApp notification link generated for Mexico admin`);
            console.log(`🔗 México: ${whatsappLinkMexico}`);
          }
          
          // In production, you would send this via WhatsApp API
          // For now, we just log it so the admin can manually open it
        } else {
          console.log("⚠️ Admin WhatsApp not configured, skipping notification");
        }
      } catch (notifError) {
        console.error("❌ Error sending WhatsApp notification:", notifError);
        // Don't fail the request if notification fails
      }
      
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

      const isMaster = session.isMaster === true;
      const isOwner = therapy.guideId === session.guideId;

      if (!isOwner && !isMaster) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updateData: Record<string, any> = { ...req.body };

      // Normalise publication flag from the form
      if (Object.prototype.hasOwnProperty.call(updateData, "isPublished")) {
        updateData.published = updateData.isPublished;
        delete updateData.isPublished;
      }

      // Log video URL for debugging
      if (updateData.videoUrl) {
        console.log(`🎥 Video URL updated: ${updateData.videoUrl}`);
      }

      // Update slug if title changed
      if (updateData.title && updateData.title !== therapy.title) {
        updateData.slug = generateSlug(updateData.title);
      }

      if (!isMaster) {
        // Guides trigger a review cycle on edits
        updateData.approvalStatus = "pending";
        updateData.published = false;
      }

      // Update guide info based on who performs the action
      const guideToSync = isMaster && therapy.guideId
        ? await storage.getGuide(therapy.guideId)
        : await storage.getGuide(session.guideId);

      if (guideToSync) {
        updateData.guideName = guideToSync.fullName;
        updateData.guidePhotoUrl = guideToSync.profilePhotoUrl;
      }

      const updatedTherapy = await storage.updateTherapy(req.params.id, updateData);

      if (!isMaster && guideToSync) {
        console.log(`✏️ Terapia actualizada por ${guideToSync.fullName}: ${updatedTherapy.title}`);
        console.log(`📋 ID: ${updatedTherapy.id} - Estado: pending (requiere revisión)`);
      }

      // Enviar notificación por WhatsApp solo cuando un guía actualiza su propia terapia
      if (!isMaster && guideToSync) {
        try {
          const adminSettings = await storage.getAdminSettings();
          if (adminSettings && (adminSettings.adminWhatsapp || adminSettings.adminWhatsappMexico)) {
            const adminUrl = process.env.APP_URL || "http://localhost:5001";
            const message = createUpdateListingNotification({
              category: updatedTherapy.category || "ceremonias",
              title: updatedTherapy.title,
              price: updatedTherapy.price || "0",
              currency: updatedTherapy.currency || "USD",
              guideName: guideToSync.fullName,
              guidePhone: guideToSync.whatsapp,
              therapyId: updatedTherapy.id,
              adminUrl,
            });

            if (adminSettings.adminWhatsapp) {
              const whatsappLinkPeru = generateWhatsAppLink(adminSettings.adminWhatsapp, message);
              console.log(`📱 WhatsApp notification link generated for Peru admin: ${adminSettings.adminName}`);
              console.log(`🔗 Perú: ${whatsappLinkPeru}`);
            }

            if (adminSettings.adminWhatsappMexico) {
              const whatsappLinkMexico = generateWhatsAppLink(adminSettings.adminWhatsappMexico, message);
              console.log(`📱 WhatsApp notification link generated for Mexico admin`);
              console.log(`🔗 México: ${whatsappLinkMexico}`);
            }
          } else {
            console.log("⚠️ Admin WhatsApp not configured, skipping notification");
          }
        } catch (notifError) {
          console.error("❌ Error sending WhatsApp notification:", notifError);
          // Don't fail the request if notification fails
        }
      }

      res.json(updatedTherapy);
    } catch (error) {
      console.error('❌ Error updating therapy:', error);
      console.error('Request body:', req.body);
      console.error('Therapy ID:', req.params.id);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to update therapy",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      });
    }
  });

  app.delete("/api/therapies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const session = (req as any).session;
      const therapy = await storage.getTherapy(req.params.id);

      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }

      const isMaster = session.isMaster === true;
      const isOwner = therapy.guideId === session.guideId;

      if (!isOwner && !isMaster) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteTherapy(req.params.id);
      res.json({ message: "Therapy deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to delete therapy" });
    }
  });

  // Master Admin routes
  app.post("/api/auth/master-login", async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      
      if (code === "333") {
        const sessionId = createMasterSession();
        console.log("✅ Master login successful, sessionId:", sessionId.substring(0, 8) + "...");
        debugSessions();
        res.json({ sessionId, isMaster: true });
      } else {
        res.status(401).json({ message: "Código inválido" });
      }
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Master login failed" });
    }
  });

  app.get("/api/master/therapies", requireMasterAuth, async (req: Request, res: Response) => {
    try {
      const { type, location, search, guideId, country } = req.query;
      const therapies = await storage.getAllTherapies({
        type: type as string,
        location: location as string,
        search: search as string,
        guideId: guideId as string,
        country: country as string,
      });
      res.json(therapies);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });

  app.get("/api/master/therapies/:id", requireMasterAuth, async (req: Request, res: Response) => {
    try {
      const therapy = await storage.getTherapy(req.params.id);
      
      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }

      res.json(therapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapy" });
    }
  });

  

  app.patch("/api/master/therapies/:id", requireMasterAuth, async (req: Request, res: Response) => {
    try {
      console.log("🔵 PATCH /api/master/therapies/:id");
      console.log("🔵 Therapy ID:", req.params.id);
      console.log("🔵 Request body:", req.body);
      
      const therapy = await storage.getTherapy(req.params.id);

      if (!therapy) {
        console.log("❌ Therapy not found");
        return res.status(404).json({ message: "Therapy not found" });
      }

      console.log("🟢 Therapy found:", therapy.title);

      const updateData = { ...req.body };

      // Update slug if title changed
      if (updateData.title && updateData.title !== therapy.title) {
        updateData.slug = generateSlug(updateData.title);
        console.log("🔄 Slug updated:", updateData.slug);
      }

      console.log("📝 Update data:", updateData);
      const updatedTherapy = await storage.updateTherapy(req.params.id, updateData);
      console.log("✅ Therapy updated successfully");
      
      res.json(updatedTherapy);
    } catch (error) {
      console.error("❌ Error updating therapy:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update therapy" });
    }
  });

  app.post("/api/master/therapies/:id/approve", requireMasterAuth, async (req: Request, res: Response) => {
    try {
      const therapy = await storage.getTherapy(req.params.id);

      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }

      const updatedTherapy = await storage.updateTherapy(req.params.id, {
        approval: "approved",
        published: true, // Auto-publicar cuando se aprueba
      });

      res.json(updatedTherapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to approve therapy" });
    }
  });

  app.post("/api/master/therapies/:id/reject", requireMasterAuth, async (req: Request, res: Response) => {
    try {
      const therapy = await storage.getTherapy(req.params.id);

      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }

      const updatedTherapy = await storage.updateTherapy(req.params.id, {
        approval: "rejected",
        published: false,
      });

      res.json(updatedTherapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to reject therapy" });
    }
  });

  // Get all guides (master admin only)
  app.get("/api/admin/master/guides", requireMasterAuth, async (_req: Request, res: Response) => {
    try {
      console.log("🔵 GET /api/admin/master/guides - Fetching all guides");
      const guides = await storage.getAllGuides();
      console.log(`✅ Found ${guides.length} guides`);
      res.json(guides);
    } catch (error) {
      console.error("❌ Error fetching guides:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch guides" });
    }
  });

  // Admin settings routes
  app.get("/api/admin/master/settings", requireMasterAuth, async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/master/settings", requireMasterAuth, async (req: Request, res: Response) => {
    try {
      const { adminName, adminWhatsapp, adminWhatsappMexico, paypalEmail } = req.body;
      const settings = await storage.updateAdminSettings({ adminName, adminWhatsapp, adminWhatsappMexico, paypalEmail });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update settings" });
    }
  });

  // Public config endpoint (no auth): expose only non-sensitive config for client
  app.get("/api/public/config", async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json({
        paypalEmail: settings?.paypalEmail ?? null,
        adminWhatsapp: settings?.adminWhatsapp ?? null,
        adminName: settings?.adminName ?? null,
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch public config" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
