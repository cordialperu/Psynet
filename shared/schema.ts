import { sql } from "drizzle-orm";
import { pgTable, text, varchar, uuid, timestamp, numeric, boolean, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Guides table - stores therapeutic guide profiles
export const guides = pgTable("guides", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  whatsapp: varchar("whatsapp", { length: 50 }).notNull(), // Main contact number
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Therapies table - stores therapy/ceremony offerings
export const therapies = pgTable("therapies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "cascade" }),
  guideName: varchar("guide_name", { length: 255 }),
  guidePhotoUrl: text("guide_photo_url"),
  
  // País
  country: varchar("country", { length: 2 }).default("PE"), // PE = Peru, MX = Mexico
  
  // Categoría principal
  category: varchar("category", { length: 50 }).default("ceremonias"),
  
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // Subcategoría (para ceremonias)
  
  // Precios con comisión 25%
  basePrice: numeric("base_price", { precision: 10, scale: 2 }), // Precio base del guía
  platformFee: numeric("platform_fee", { precision: 10, scale: 2 }), // 25% comisión
  price: numeric("price", { precision: 10, scale: 2 }), // Precio final (base + fee)
  currency: varchar("currency", { length: 3 }).default("USD"),
  
  // Campos opcionales según categoría
  duration: varchar("duration", { length: 100 }),
  location: varchar("location", { length: 255 }),
  googleMapsUrl: text("google_maps_url"), // Para terapias
  videoUrl: text("video_url"),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  availableDates: text("available_dates").array(), // Para ceremonias, terapias, eventos
  availableTimes: json("available_times"), // Array de { date: string, times: string[] } para terapias
  fixedTime: varchar("fixed_time", { length: 10 }), // Hora fija para eventos (formato HH:mm)
  
  // Campos para productos/medicina/microdosis
  shippingOptions: json("shipping_options"), // { envio: true, recojo: true, address: "" }
  inventory: integer("inventory"), // Stock disponible
  
  // Campos para ceremonias/terapias/eventos (capacidad y reservas)
  capacity: integer("capacity"), // Capacidad máxima de personas
  bookedSlots: integer("booked_slots").default(0), // Cupos reservados
  
  // Campos específicos por categoría (JSON flexible)
  specificFields: json("specific_fields"), // { componentes: [], beneficios: [], etc }
  
  published: boolean("is_published").default(false),
  approvalStatus: varchar("approval_status", { length: 20 }).default("pending"),
  displayOrder: integer("display_order").default(0), // Orden manual de visualización
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  viewsCount: integer("views_count").default(0),
  whatsappClicks: integer("whatsapp_clicks").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Admin Settings table
export const adminSettings = pgTable("admin_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  adminName: varchar("admin_name", { length: 255 }).notNull(),
  adminWhatsapp: varchar("admin_whatsapp", { length: 50 }).notNull(),
  adminWhatsappMexico: varchar("admin_whatsapp_mexico", { length: 50 }),
  paypalEmail: varchar("paypal_email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas
export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTherapySchema = createInsertSchema(therapies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Guide = typeof guides.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;

export type AdminSettings = typeof adminSettings.$inferSelect;

export type Therapy = typeof therapies.$inferSelect & {
  category?: string;
  basePrice?: string;
  platformFee?: string;
  googleMapsUrl?: string;
  shippingOptions?: {
    envio?: boolean;
    recojo?: boolean;
    address?: string;
  };
  inventory?: number;
  specificFields?: Record<string, any>;
  availableTimes?: Array<{
    date: string; // ISO date format (YYYY-MM-DD)
    times: string[]; // Array of time strings (HH:mm)
  }>;
  fixedTime?: string; // Fixed time for events (HH:mm)
};
export type InsertTherapy = z.infer<typeof insertTherapySchema>;

// Categories for listings
export const categories = [
  "ceremonias",
  "terapias",
  "microdosis",
  "medicina",
  "eventos",
  "productos",
] as const;

export type Category = typeof categories[number];

// Subcategories for ceremonias
export const ceremonyTypes = [
  "ayahuasca",
  "san-pedro",
  "wachuma",
  "kambo",
  "rapé",
  "cacao-ceremony",
  "temazcal",
  "plant-medicine",
] as const;

export type CeremonyType = typeof ceremonyTypes[number];

// Legacy export for backwards compatibility
export const therapyTypes = ceremonyTypes;
export type TherapyType = CeremonyType;

// Sessions table - persistent authentication
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "cascade" }),
  isMaster: boolean("is_master").default(false),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastActivity: timestamp("last_activity", { withTimezone: true }).defaultNow(),
});

// Favorites table
export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "cascade" }),
  therapyId: uuid("therapy_id").references(() => therapies.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  therapyId: uuid("therapy_id").references(() => therapies.id, { onDelete: "cascade" }),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "set null" }),
  changes: json("changes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// App configuration table
export const appConfig = pgTable("app_config", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: json("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Types for new tables
export type Session = typeof sessions.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type AppConfig = typeof appConfig.$inferSelect;
