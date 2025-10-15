
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminSettings: () => adminSettings,
  appConfig: () => appConfig,
  auditLogs: () => auditLogs,
  categories: () => categories,
  ceremonyTypes: () => ceremonyTypes,
  favorites: () => favorites,
  guides: () => guides,
  insertGuideSchema: () => insertGuideSchema,
  insertTherapySchema: () => insertTherapySchema,
  reviews: () => reviews,
  sessions: () => sessions,
  therapies: () => therapies,
  therapyTypes: () => therapyTypes
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, uuid, timestamp, numeric, boolean, json, integer } from "drizzle-orm/pg-core";
import { z } from "zod";
var guides = pgTable("guides", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  whatsapp: varchar("whatsapp", { length: 50 }).notNull(),
  // Main contact number
  instagram: varchar("instagram", { length: 100 }),
  tiktok: varchar("tiktok", { length: 100 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  primarySpecialty: varchar("primary_specialty", { length: 255 }),
  bio: text("bio"),
  profilePhotoUrl: text("profile_photo_url"),
  presentationVideoUrl: text("presentation_video_url"),
  activeTherapies: text("active_therapies").array(),
  verified: boolean("verified").default(false),
  verificationDocuments: json("verification_documents"),
  verificationStatus: varchar("verification_status", { length: 20 }).default("pending"),
  verificationNotes: text("verification_notes"),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }).defaultNow(),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
var therapies = pgTable("therapies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "cascade" }),
  guideName: varchar("guide_name", { length: 255 }),
  guidePhotoUrl: text("guide_photo_url"),
  // País
  country: varchar("country", { length: 2 }).default("PE"),
  // PE = Peru, MX = Mexico
  // Categoría principal
  category: varchar("category", { length: 50 }).default("ceremonias"),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(),
  // Subcategoría (para ceremonias)
  // Precios con comisión 25%
  basePrice: numeric("base_price", { precision: 10, scale: 2 }),
  // Precio base del guía
  platformFee: numeric("platform_fee", { precision: 10, scale: 2 }),
  // 25% comisión
  price: numeric("price", { precision: 10, scale: 2 }),
  // Precio final (base + fee)
  currency: varchar("currency", { length: 3 }).default("USD"),
  // Campos opcionales según categoría
  duration: varchar("duration", { length: 100 }),
  location: varchar("location", { length: 255 }),
  googleMapsUrl: text("google_maps_url"),
  // Para terapias
  videoUrl: text("video_url"),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  availableDates: text("available_dates").array(),
  // Para ceremonias, terapias, eventos
  availableTimes: json("available_times"),
  // Array de { date: string, times: string[] } para terapias
  fixedTime: varchar("fixed_time", { length: 10 }),
  // Hora fija para eventos (formato HH:mm)
  // Campos para productos/medicina/microdosis
  shippingOptions: json("shipping_options"),
  // { envio: true, recojo: true, address: "" }
  inventory: integer("inventory"),
  // Stock disponible
  // Campos para ceremonias/terapias/eventos (capacidad y reservas)
  capacity: integer("capacity"),
  // Capacidad máxima de personas
  bookedSlots: integer("booked_slots").default(0),
  // Cupos reservados
  // Campos específicos por categoría (JSON flexible)
  specificFields: json("specific_fields"),
  // { componentes: [], beneficios: [], etc }
  published: boolean("is_published").default(false),
  approvalStatus: varchar("approval_status", { length: 20 }).default("pending"),
  displayOrder: integer("display_order").default(0),
  // Orden manual de visualización
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  viewsCount: integer("views_count").default(0),
  whatsappClicks: integer("whatsapp_clicks").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
var adminSettings = pgTable("admin_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  adminName: varchar("admin_name", { length: 255 }).notNull(),
  adminWhatsapp: varchar("admin_whatsapp", { length: 50 }).notNull(),
  adminWhatsappMexico: varchar("admin_whatsapp_mexico", { length: 50 }),
  paypalEmail: varchar("paypal_email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
var insertGuideSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().min(1),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  password: z.string().min(8),
  primarySpecialty: z.string().optional(),
  bio: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  presentationVideoUrl: z.string().optional(),
  activeTherapies: z.array(z.string()).optional()
});
var insertTherapySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  category: z.string().default("ceremonias"),
  country: z.string().default("PE"),
  basePrice: z.string().optional(),
  platformFee: z.string().optional(),
  language: z.string().default("es"),
  location: z.string().optional(),
  durationMinutes: z.number().optional(),
  maxParticipants: z.number().optional(),
  specificFields: z.record(z.any()).optional(),
  videoUrl: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  published: z.boolean().default(false),
  publishedOn: z.string().optional(),
  approval: z.string().default("pending"),
  approvalNotes: z.string().optional(),
  shippingOptions: z.object({
    envio: z.boolean().optional(),
    recojo: z.boolean().optional(),
    address: z.string().optional()
  }).optional(),
  inventory: z.number().optional(),
  availableTimes: z.array(z.object({
    date: z.string(),
    times: z.array(z.string())
  })).optional(),
  fixedTime: z.string().optional()
});
var categories = [
  "ceremonias",
  "terapias",
  "microdosis",
  "medicina",
  "eventos",
  "productos"
];
var ceremonyTypes = [
  "ayahuasca",
  "san-pedro",
  "wachuma",
  "kambo",
  "rap\xE9",
  "cacao-ceremony",
  "temazcal",
  "plant-medicine"
];
var therapyTypes = ceremonyTypes;
var sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "cascade" }),
  isMaster: boolean("is_master").default(false),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastActivity: timestamp("last_activity", { withTimezone: true }).defaultNow()
});
var favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "cascade" }),
  therapyId: uuid("therapy_id").references(() => therapies.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
var reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  therapyId: uuid("therapy_id").references(() => therapies.id, { onDelete: "cascade" }),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
var auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "set null" }),
  changes: json("changes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
var appConfig = pgTable("app_config", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: json("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var sql2 = neon(process.env.DATABASE_URL);
var db = drizzle(sql2, { schema: schema_exports });

// server/storage.ts
import { eq, and, ilike, or, sql as sql3, desc } from "drizzle-orm";
var DbStorage = class {
  // Guide operations
  async getGuide(id) {
    const [guide] = await db.select().from(guides).where(eq(guides.id, id));
    return guide;
  }
  async getGuideByEmail(email) {
    const [guide] = await db.select().from(guides).where(eq(guides.email, email));
    return guide;
  }
  async createGuide(insertGuide) {
    const [guide] = await db.insert(guides).values(insertGuide).returning();
    return guide;
  }
  async getAllGuides() {
    return await db.select().from(guides).orderBy(sql3`${guides.createdAt} DESC`);
  }
  async updateGuide(id, updateData) {
    const [guide] = await db.update(guides).set({ ...updateData, updatedAt: sql3`NOW()` }).where(eq(guides.id, id)).returning();
    return guide;
  }
  // Therapy operations
  async getTherapy(id) {
    const [therapy] = await db.select().from(therapies).where(eq(therapies.id, id));
    return therapy;
  }
  async getTherapyBySlug(slug) {
    const [therapy] = await db.select().from(therapies).where(eq(therapies.slug, slug));
    return therapy;
  }
  async getTherapiesByGuideId(guideId) {
    return await db.select().from(therapies).where(eq(therapies.guideId, guideId)).orderBy(desc(therapies.updatedAt));
  }
  async getAllTherapies(filters) {
    const conditions = [];
    if (filters?.type) {
      conditions.push(eq(therapies.type, filters.type));
    }
    if (filters?.location) {
      conditions.push(ilike(therapies.location, `%${filters.location}%`));
    }
    if (filters?.guideId) {
      conditions.push(eq(therapies.guideId, filters.guideId));
    }
    if (filters?.country) {
      conditions.push(eq(therapies.country, filters.country));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(therapies.title, `%${filters.search}%`),
          ilike(therapies.guideName, `%${filters.search}%`),
          ilike(therapies.description, `%${filters.search}%`)
        )
      );
    }
    if (conditions.length > 0) {
      return await db.select().from(therapies).where(and(...conditions)).orderBy(desc(therapies.updatedAt));
    }
    return await db.select().from(therapies).orderBy(desc(therapies.updatedAt));
  }
  async getPublishedTherapies(filters) {
    try {
      const conditions = [eq(therapies.published, true)];
      if (filters?.type) {
        conditions.push(eq(therapies.type, filters.type));
      }
      if (filters?.location) {
        conditions.push(ilike(therapies.location, `%${filters.location}%`));
      }
      if (filters?.country) {
        conditions.push(eq(therapies.country, filters.country));
      }
      if (filters?.search) {
        conditions.push(
          or(
            ilike(therapies.title, `%${filters.search}%`),
            ilike(therapies.guideName, `%${filters.search}%`),
            ilike(therapies.description, `%${filters.search}%`)
          )
        );
      }
      const result = await Promise.race([
        db.select().from(therapies).where(and(...conditions)).orderBy(desc(therapies.updatedAt)),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Database query timeout")), 8e3)
        )
      ]);
      return result || [];
    } catch (error) {
      console.error("Error fetching published therapies:", error);
      console.log("Returning empty array due to database error");
      return [];
    }
  }
  async getFeaturedTherapies(limit = 6) {
    return await db.select().from(therapies).where(eq(therapies.published, true)).orderBy(desc(therapies.updatedAt)).limit(limit);
  }
  async createTherapy(insertTherapy) {
    const [therapy] = await db.insert(therapies).values(insertTherapy).returning();
    return therapy;
  }
  async updateTherapy(id, updateData) {
    const [therapy] = await db.update(therapies).set({ ...updateData, updatedAt: sql3`NOW()` }).where(eq(therapies.id, id)).returning();
    return therapy;
  }
  async deleteTherapy(id) {
    await db.delete(therapies).where(eq(therapies.id, id));
  }
  // Admin settings operations
  async getAdminSettings() {
    const [settings] = await db.select().from(adminSettings).limit(1);
    return settings;
  }
  async updateAdminSettings(data) {
    const existing = await this.getAdminSettings();
    if (existing) {
      const [updated] = await db.update(adminSettings).set({ ...data, updatedAt: sql3`NOW()` }).where(eq(adminSettings.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(adminSettings).values(data).returning();
      return created;
    }
  }
};
var storage = new DbStorage();

// server/auth.ts
import { randomUUID } from "crypto";
var sessions2 = /* @__PURE__ */ new Map();
function createSession(guideId, email) {
  const sessionId = randomUUID();
  sessions2.set(sessionId, {
    id: sessionId,
    guideId,
    email,
    createdAt: /* @__PURE__ */ new Date()
  });
  return sessionId;
}
function getSession(sessionId) {
  const session = sessions2.get(sessionId);
  console.log("\u{1F50D} Getting session:", {
    sessionId: sessionId.substring(0, 8) + "...",
    found: !!session,
    isMaster: session?.isMaster
  });
  return session;
}
function deleteSession(sessionId) {
  sessions2.delete(sessionId);
}
function debugSessions() {
  console.log("\u{1F4CA} Active sessions:", sessions2.size);
  sessions2.forEach((session, id) => {
    console.log(`  - ${id.substring(0, 8)}... | isMaster: ${session.isMaster} | email: ${session.email}`);
  });
}
function createMasterSession() {
  const sessionId = randomUUID();
  const session = {
    id: sessionId,
    guideId: "master",
    email: "master@psycheconecta.com",
    createdAt: /* @__PURE__ */ new Date(),
    isMaster: true
  };
  sessions2.set(sessionId, session);
  console.log("\u{1F511} Master session created:", { sessionId: sessionId.substring(0, 8) + "...", isMaster: session.isMaster });
  console.log("\u{1F4CA} Total sessions:", sessions2.size);
  return sessionId;
}
function requireAuth(req, res, next) {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  if (!sessionId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const session = getSession(sessionId);
  if (!session) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
  req.session = session;
  next();
}
function requireMasterAuth(req, res, next) {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  console.log("\u{1F510} Master auth check:", {
    path: req.path,
    hasSessionId: !!sessionId,
    sessionId: sessionId?.substring(0, 8) + "..."
  });
  if (!sessionId) {
    console.log("\u274C No session ID provided");
    return res.status(401).json({ message: "Authentication required" });
  }
  let session = getSession(sessionId);
  if (!session && sessionId) {
    console.log("\u{1F504} Session not found, creating new master session");
    const newSessionId = createMasterSession();
    session = getSession(newSessionId);
    if (session) {
      sessions2.set(sessionId, { ...session, id: sessionId });
      session = getSession(sessionId);
    }
  }
  if (!session || !session.isMaster) {
    console.log("\u274C Invalid or non-master session");
    return res.status(403).json({ message: "Master access required" });
  }
  console.log("\u2705 Master auth successful");
  req.session = session;
  next();
}

// server/routes.ts
import { randomUUID as randomUUID2 } from "crypto";
import bcrypt from "bcrypt";

// server/whatsapp.ts
function generateWhatsAppLink(phoneNumber, message) {
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
function createNewListingNotification(params) {
  const reviewUrl = `${params.adminUrl}/admin/master/therapies/edit/${params.therapyId}`;
  return `\u{1F195} *Nueva Publicaci\xF3n Pendiente de Aprobaci\xF3n*

\u{1F4C2} Categor\xEDa: ${params.category}
\u{1F4DD} T\xEDtulo: ${params.title}
\u{1F4B0} Precio: ${params.currency} ${params.price}
\u{1F464} Gu\xEDa: ${params.guideName}
\u{1F4DE} Contacto del Gu\xEDa: ${params.guidePhone}

\u{1F517} Revisar y aprobar aqu\xED:
${reviewUrl}

Por favor revisa esta publicaci\xF3n en el panel de administraci\xF3n.`;
}
function createUpdateListingNotification(params) {
  const reviewUrl = `${params.adminUrl}/admin/master/therapies/edit/${params.therapyId}`;
  return `\u270F\uFE0F *Publicaci\xF3n Actualizada - Requiere Revisi\xF3n*

\u{1F4C2} Categor\xEDa: ${params.category}
\u{1F4DD} T\xEDtulo: ${params.title}
\u{1F4B0} Precio: ${params.currency} ${params.price}
\u{1F464} Gu\xEDa: ${params.guideName}
\u{1F4DE} Contacto del Gu\xEDa: ${params.guidePhone}

\u{1F517} Revisar cambios aqu\xED:
${reviewUrl}

Por favor revisa los cambios realizados en esta publicaci\xF3n.`;
}

// server/routes.ts
function generateSlug(title) {
  return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim() + "-" + randomUUID2().slice(0, 8);
}
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
async function registerRoutes(app2) {
  app2.get("/health", async (_req, res) => {
    try {
      res.json({
        status: "ok",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
  app2.get("/api/version", (_req, res) => {
    res.json({ version: "1.0.0", api: "Psynet v1" });
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { fullName, email, whatsapp, instagram, tiktok, password } = req.body;
      if (!fullName || !email || !whatsapp || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      if (!instagram && !tiktok) {
        return res.status(400).json({ message: "At least Instagram or TikTok is required" });
      }
      const existing = await storage.getGuideByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const passwordHash = await hashPassword(password);
      const guide = await storage.createGuide({
        fullName,
        email,
        whatsapp,
        instagram: instagram || null,
        tiktok: tiktok || null,
        passwordHash
      });
      res.json({ message: "Registration successful", guideId: guide.id });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const guide = await storage.getGuideByEmail(email);
      if (!guide || !await verifyPassword(password, guide.passwordHash)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const sessionId = createSession(guide.id, guide.email);
      const { passwordHash, ...guideWithoutPassword } = guide;
      res.json({ sessionId, guide: guideWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
  });
  app2.post("/api/auth/logout", requireAuth, (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (sessionId) {
      deleteSession(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });
  app2.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const session = req.session;
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
  app2.patch("/api/guides/profile", requireAuth, async (req, res) => {
    try {
      const session = req.session;
      const updateData = req.body;
      delete updateData.id;
      delete updateData.email;
      const guide = await storage.updateGuide(session.guideId, updateData);
      if (updateData.fullName || updateData.profilePhotoUrl) {
        const therapies2 = await storage.getTherapiesByGuideId(session.guideId);
        const therapyUpdates = {};
        if (updateData.fullName) {
          therapyUpdates.guideName = updateData.fullName;
        }
        if (updateData.profilePhotoUrl) {
          therapyUpdates.guidePhotoUrl = updateData.profilePhotoUrl;
        }
        for (const therapy of therapies2) {
          await storage.updateTherapy(therapy.id, therapyUpdates);
        }
        console.log(`\u2705 Updated ${therapies2.length} therapies with new guide info`);
      }
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update profile" });
    }
  });
  app2.get("/api/therapies/featured", async (_req, res) => {
    try {
      const therapies2 = await storage.getFeaturedTherapies(6);
      res.json(therapies2);
    } catch (error) {
      console.error("Featured therapies error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });
  app2.get("/api/therapies/published", async (req, res) => {
    try {
      const { type, location, search, country } = req.query;
      console.log("Fetching published therapies with filters:", { type, location, search, country });
      const therapies2 = await storage.getPublishedTherapies({
        type,
        location,
        search,
        country
      });
      console.log(`Found ${therapies2.length} published therapies`);
      res.json(therapies2);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch therapies";
      console.error("Error fetching published therapies:", error);
      res.status(500).json({ message, error: process.env.NODE_ENV === "development" ? String(error) : void 0 });
    }
  });
  app2.get("/api/therapies/slug/:slug", async (req, res) => {
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
  app2.get("/api/therapies/my-therapies", requireAuth, async (req, res) => {
    try {
      const session = req.session;
      const therapies2 = await storage.getTherapiesByGuideId(session.guideId);
      res.json(therapies2);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });
  app2.get("/api/therapies/:id", requireAuth, async (req, res) => {
    try {
      const session = req.session;
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
  app2.post("/api/therapies", requireAuth, async (req, res) => {
    try {
      const session = req.session;
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
        approvalStatus: "pending",
        // Nueva terapia en revisión
        published: false
        // No publicada hasta que sea aprobada
      };
      if (therapyData.videoUrl) {
        console.log(`\u{1F3A5} Video URL received: ${therapyData.videoUrl}`);
      } else {
        console.log("\u26A0\uFE0F Warning: No video URL provided");
      }
      const therapy = await storage.createTherapy(therapyData);
      console.log(`\u2705 Nueva terapia creada por ${guide.fullName}: ${therapy.title}`);
      console.log(`\u{1F4CB} ID: ${therapy.id} - Estado: pending`);
      try {
        const adminSettings2 = await storage.getAdminSettings();
        if (adminSettings2 && (adminSettings2.adminWhatsapp || adminSettings2.adminWhatsappMexico)) {
          const adminUrl = process.env.APP_URL || "http://localhost:5001";
          const message = createNewListingNotification({
            category: therapy.category || "ceremonias",
            title: therapy.title,
            price: therapy.price || "0",
            currency: therapy.currency || "USD",
            guideName: guide.fullName,
            guidePhone: guide.whatsapp,
            therapyId: therapy.id,
            adminUrl
          });
          if (adminSettings2.adminWhatsapp) {
            const whatsappLinkPeru = generateWhatsAppLink(adminSettings2.adminWhatsapp, message);
            console.log(`\u{1F4F1} WhatsApp notification link generated for Peru admin: ${adminSettings2.adminName}`);
            console.log(`\u{1F517} Per\xFA: ${whatsappLinkPeru}`);
          }
          if (adminSettings2.adminWhatsappMexico) {
            const whatsappLinkMexico = generateWhatsAppLink(adminSettings2.adminWhatsappMexico, message);
            console.log(`\u{1F4F1} WhatsApp notification link generated for Mexico admin`);
            console.log(`\u{1F517} M\xE9xico: ${whatsappLinkMexico}`);
          }
        } else {
          console.log("\u26A0\uFE0F Admin WhatsApp not configured, skipping notification");
        }
      } catch (notifError) {
        console.error("\u274C Error sending WhatsApp notification:", notifError);
      }
      res.json(therapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create therapy" });
    }
  });
  app2.patch("/api/therapies/:id", requireAuth, async (req, res) => {
    try {
      const session = req.session;
      const therapy = await storage.getTherapy(req.params.id);
      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }
      if (therapy.guideId !== session.guideId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const updateData = { ...req.body };
      if (updateData.videoUrl) {
        console.log(`\u{1F3A5} Video URL updated: ${updateData.videoUrl}`);
      }
      if (updateData.title && updateData.title !== therapy.title) {
        updateData.slug = generateSlug(updateData.title);
      }
      updateData.approvalStatus = "pending";
      updateData.published = false;
      const guide = await storage.getGuide(session.guideId);
      if (guide) {
        updateData.guideName = guide.fullName;
        updateData.guidePhotoUrl = guide.profilePhotoUrl;
      }
      const updatedTherapy = await storage.updateTherapy(req.params.id, updateData);
      console.log(`\u270F\uFE0F Terapia actualizada por ${guide?.fullName}: ${updatedTherapy.title}`);
      console.log(`\u{1F4CB} ID: ${updatedTherapy.id} - Estado: pending (requiere revisi\xF3n)`);
      try {
        const adminSettings2 = await storage.getAdminSettings();
        if (adminSettings2 && (adminSettings2.adminWhatsapp || adminSettings2.adminWhatsappMexico) && guide) {
          const adminUrl = process.env.APP_URL || "http://localhost:5001";
          const message = createUpdateListingNotification({
            category: updatedTherapy.category || "ceremonias",
            title: updatedTherapy.title,
            price: updatedTherapy.price || "0",
            currency: updatedTherapy.currency || "USD",
            guideName: guide.fullName,
            guidePhone: guide.whatsapp,
            therapyId: updatedTherapy.id,
            adminUrl
          });
          if (adminSettings2.adminWhatsapp) {
            const whatsappLinkPeru = generateWhatsAppLink(adminSettings2.adminWhatsapp, message);
            console.log(`\u{1F4F1} WhatsApp notification link generated for Peru admin: ${adminSettings2.adminName}`);
            console.log(`\u{1F517} Per\xFA: ${whatsappLinkPeru}`);
          }
          if (adminSettings2.adminWhatsappMexico) {
            const whatsappLinkMexico = generateWhatsAppLink(adminSettings2.adminWhatsappMexico, message);
            console.log(`\u{1F4F1} WhatsApp notification link generated for Mexico admin`);
            console.log(`\u{1F517} M\xE9xico: ${whatsappLinkMexico}`);
          }
        } else {
          console.log("\u26A0\uFE0F Admin WhatsApp not configured, skipping notification");
        }
      } catch (notifError) {
        console.error("\u274C Error sending WhatsApp notification:", notifError);
      }
      res.json(updatedTherapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update therapy" });
    }
  });
  app2.delete("/api/therapies/:id", requireAuth, async (req, res) => {
    try {
      const session = req.session;
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
  app2.post("/api/auth/master-login", async (req, res) => {
    try {
      const { code } = req.body;
      if (code === "333") {
        const sessionId = createMasterSession();
        console.log("\u2705 Master login successful, sessionId:", sessionId.substring(0, 8) + "...");
        debugSessions();
        res.json({ sessionId, isMaster: true });
      } else {
        res.status(401).json({ message: "C\xF3digo inv\xE1lido" });
      }
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Master login failed" });
    }
  });
  app2.get("/api/master/therapies", requireMasterAuth, async (req, res) => {
    try {
      const { type, location, search, guideId, country } = req.query;
      const therapies2 = await storage.getAllTherapies({
        type,
        location,
        search,
        guideId,
        country
      });
      res.json(therapies2);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });
  app2.get("/api/master/therapies/:id", requireMasterAuth, async (req, res) => {
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
  app2.patch("/api/master/therapies/:id", requireMasterAuth, async (req, res) => {
    try {
      console.log("\u{1F535} PATCH /api/master/therapies/:id");
      console.log("\u{1F535} Therapy ID:", req.params.id);
      console.log("\u{1F535} Request body:", req.body);
      const therapy = await storage.getTherapy(req.params.id);
      if (!therapy) {
        console.log("\u274C Therapy not found");
        return res.status(404).json({ message: "Therapy not found" });
      }
      console.log("\u{1F7E2} Therapy found:", therapy.title);
      const updateData = { ...req.body };
      if (updateData.title && updateData.title !== therapy.title) {
        updateData.slug = generateSlug(updateData.title);
        console.log("\u{1F504} Slug updated:", updateData.slug);
      }
      console.log("\u{1F4DD} Update data:", updateData);
      const updatedTherapy = await storage.updateTherapy(req.params.id, updateData);
      console.log("\u2705 Therapy updated successfully");
      res.json(updatedTherapy);
    } catch (error) {
      console.error("\u274C Error updating therapy:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update therapy" });
    }
  });
  app2.post("/api/master/therapies/:id/approve", requireMasterAuth, async (req, res) => {
    try {
      const therapy = await storage.getTherapy(req.params.id);
      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }
      const updatedTherapy = await storage.updateTherapy(req.params.id, {
        approvalStatus: "approved",
        published: true
        // Auto-publicar cuando se aprueba
      });
      res.json(updatedTherapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to approve therapy" });
    }
  });
  app2.post("/api/master/therapies/:id/reject", requireMasterAuth, async (req, res) => {
    try {
      const therapy = await storage.getTherapy(req.params.id);
      if (!therapy) {
        return res.status(404).json({ message: "Therapy not found" });
      }
      const updatedTherapy = await storage.updateTherapy(req.params.id, {
        approvalStatus: "rejected",
        published: false
      });
      res.json(updatedTherapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to reject therapy" });
    }
  });
  app2.get("/api/admin/master/guides", requireMasterAuth, async (req, res) => {
    try {
      console.log("\u{1F535} GET /api/admin/master/guides - Fetching all guides");
      const guides2 = await storage.getAllGuides();
      console.log(`\u2705 Found ${guides2.length} guides`);
      res.json(guides2);
    } catch (error) {
      console.error("\u274C Error fetching guides:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch guides" });
    }
  });
  app2.get("/api/admin/master/settings", requireMasterAuth, async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch settings" });
    }
  });
  app2.post("/api/admin/master/settings", requireMasterAuth, async (req, res) => {
    try {
      const { adminName, adminWhatsapp, adminWhatsappMexico, paypalEmail } = req.body;
      const settings = await storage.updateAdminSettings({ adminName, adminWhatsapp, adminWhatsappMexico, paypalEmail });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update settings" });
    }
  });
  app2.get("/api/public/config", async (_req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json({
        paypalEmail: settings?.paypalEmail ?? null,
        adminWhatsapp: settings?.adminWhatsapp ?? null,
        adminName: settings?.adminName ?? null
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch public config" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.setTimeout(15e3);
  res.setTimeout(15e3);
  next();
});
app.use((req, res, next) => {
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Keep-Alive", "timeout=5, max=100");
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
    log(`\u{1F4F1} Access from iPhone: http://192.168.1.49:${port}`);
  });
})();
