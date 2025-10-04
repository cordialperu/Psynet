import { sql } from "drizzle-orm";
import { pgTable, text, varchar, uuid, timestamp, numeric, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Guides table - stores therapeutic guide profiles
export const guides = pgTable("guides", {
  id: uuid("id").primaryKey().notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  primarySpecialty: varchar("primary_specialty", { length: 255 }),
  bio: text("bio"),
  profilePhotoUrl: text("profile_photo_url"),
  presentationVideoUrl: text("presentation_video_url"),
  activeTherapies: text("active_therapies").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Therapies table - stores therapy/ceremony offerings
export const therapies = pgTable("therapies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  guideId: uuid("guide_id").notNull().references(() => guides.id, { onDelete: "cascade" }),
  guideName: varchar("guide_name", { length: 255 }),
  guidePhotoUrl: text("guide_photo_url"),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  duration: varchar("duration", { length: 100 }),
  location: varchar("location", { length: 255 }),
  availableDates: date("available_dates").array(),
  isPublished: boolean("is_published").default(false),
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
  guideName: true,
  guidePhotoUrl: true,
});

// Types
export type Guide = typeof guides.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;

export type Therapy = typeof therapies.$inferSelect;
export type InsertTherapy = z.infer<typeof insertTherapySchema>;

// Therapy types for filtering
export const therapyTypes = [
  "ayahuasca",
  "san-pedro",
  "wachuma",
  "kambo",
  "rapé",
  "cacao-ceremony",
  "temazcal",
  "plant-medicine",
] as const;

export type TherapyType = typeof therapyTypes[number];
