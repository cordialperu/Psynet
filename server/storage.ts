import { db } from "@db";
import { guides, therapies, type Guide, type Therapy, type InsertGuide, type InsertTherapy } from "@shared/schema";
import { eq, and, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  // Guide operations
  getGuide(id: string): Promise<Guide | undefined>;
  getGuideByEmail(email: string): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide & { passwordHash: string }): Promise<Guide>;
  updateGuide(id: string, guide: Partial<InsertGuide>): Promise<Guide>;

  // Therapy operations
  getTherapy(id: string): Promise<Therapy | undefined>;
  getTherapyBySlug(slug: string): Promise<Therapy | undefined>;
  getTherapiesByGuideId(guideId: string): Promise<Therapy[]>;
  getPublishedTherapies(filters?: { type?: string; location?: string; search?: string }): Promise<Therapy[]>;
  getFeaturedTherapies(limit?: number): Promise<Therapy[]>;
  createTherapy(therapy: InsertTherapy): Promise<Therapy>;
  updateTherapy(id: string, therapy: Partial<InsertTherapy>): Promise<Therapy>;
  deleteTherapy(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Guide operations
  async getGuide(id: string): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.id, id));
    return guide;
  }

  async getGuideByEmail(email: string): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.email, email));
    return guide;
  }

  async createGuide(insertGuide: InsertGuide & { passwordHash: string }): Promise<Guide> {
    const [guide] = await db.insert(guides).values(insertGuide).returning();
    return guide;
  }

  async updateGuide(id: string, updateData: Partial<InsertGuide>): Promise<Guide> {
    const [guide] = await db
      .update(guides)
      .set({ ...updateData, updatedAt: sql`NOW()` })
      .where(eq(guides.id, id))
      .returning();
    return guide;
  }

  // Therapy operations
  async getTherapy(id: string): Promise<Therapy | undefined> {
    const [therapy] = await db.select().from(therapies).where(eq(therapies.id, id));
    return therapy;
  }

  async getTherapyBySlug(slug: string): Promise<Therapy | undefined> {
    const [therapy] = await db.select().from(therapies).where(eq(therapies.slug, slug));
    return therapy;
  }

  async getTherapiesByGuideId(guideId: string): Promise<Therapy[]> {
    return await db.select().from(therapies).where(eq(therapies.guideId, guideId));
  }

  async getPublishedTherapies(filters?: { type?: string; location?: string; search?: string }): Promise<Therapy[]> {
    let query = db.select().from(therapies).where(eq(therapies.isPublished, true));

    const conditions = [eq(therapies.isPublished, true)];

    if (filters?.type) {
      conditions.push(eq(therapies.type, filters.type));
    }

    if (filters?.location) {
      conditions.push(ilike(therapies.location, `%${filters.location}%`));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(therapies.title, `%${filters.search}%`),
          ilike(therapies.guideName, `%${filters.search}%`),
          ilike(therapies.description, `%${filters.search}%`)
        )!
      );
    }

    return await db.select().from(therapies).where(and(...conditions));
  }

  async getFeaturedTherapies(limit: number = 6): Promise<Therapy[]> {
    return await db
      .select()
      .from(therapies)
      .where(eq(therapies.isPublished, true))
      .limit(limit);
  }

  async createTherapy(insertTherapy: InsertTherapy): Promise<Therapy> {
    const [therapy] = await db.insert(therapies).values(insertTherapy).returning();
    return therapy;
  }

  async updateTherapy(id: string, updateData: Partial<InsertTherapy>): Promise<Therapy> {
    const [therapy] = await db
      .update(therapies)
      .set({ ...updateData, updatedAt: sql`NOW()` })
      .where(eq(therapies.id, id))
      .returning();
    return therapy;
  }

  async deleteTherapy(id: string): Promise<void> {
    await db.delete(therapies).where(eq(therapies.id, id));
  }
}

export const storage = new DbStorage();
