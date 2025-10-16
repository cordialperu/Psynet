import { db } from "./db";
import { queryPublishedTherapies, queryAllTherapies, queryGuideByEmail, createGuideDirectly } from "./db-direct";
import { guides, therapies, adminSettings, type Guide, type Therapy, type InsertGuide, type InsertTherapy, type AdminSettings } from "@shared/schema";
import { eq, and, ilike, or, sql, desc } from "drizzle-orm";
import { DEMO_THERAPIES, filterDemoTherapies } from "./demo-data";

export interface IStorage {
  // Guide operations
  getGuide(id: string): Promise<Guide | undefined>;
  getGuideByEmail(email: string): Promise<Guide | undefined>;
  getAllGuides(): Promise<Guide[]>;
  createGuide(guide: InsertGuide & { passwordHash: string }): Promise<Guide>;
  updateGuide(id: string, guide: Partial<InsertGuide>): Promise<Guide>;

  // Admin settings operations
  getAdminSettings(): Promise<AdminSettings | undefined>;
  updateAdminSettings(settings: { adminName: string; adminWhatsapp: string; adminWhatsappMexico?: string | null; paypalEmail?: string | null }): Promise<AdminSettings>;

  // Therapy operations
  getTherapy(id: string): Promise<Therapy | undefined>;
  getTherapyBySlug(slug: string): Promise<Therapy | undefined>;
  getTherapiesByGuideId(guideId: string): Promise<Therapy[]>;
  getAllTherapies(filters?: { type?: string; location?: string; search?: string; guideId?: string; country?: string }): Promise<Therapy[]>;
  getPublishedTherapies(filters?: { type?: string; location?: string; search?: string; country?: string }): Promise<Therapy[]>;
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
    try {
      const guide = await queryGuideByEmail(email);
      if (!guide) return undefined;
      
      // Convert snake_case to camelCase
      return {
        id: guide.id,
        fullName: guide.full_name,
        email: guide.email,
        whatsapp: guide.whatsapp,
        instagram: guide.instagram,
        tiktok: guide.tiktok,
        passwordHash: guide.password_hash,
        primarySpecialty: guide.primary_specialty,
        bio: guide.bio,
        profilePhotoUrl: guide.profile_photo_url,
        presentationVideoUrl: guide.presentation_video_url,
        activeTherapies: guide.active_therapies,
        verified: guide.verified,
        verificationDocuments: guide.verification_documents,
        verificationStatus: guide.verification_status,
        verificationNotes: guide.verification_notes,
        passwordChangedAt: guide.password_changed_at,
        failedLoginAttempts: guide.failed_login_attempts,
        lockedUntil: guide.locked_until,
        createdAt: guide.created_at,
        updatedAt: guide.updated_at
      } as Guide;
    } catch (error) {
      console.error('Error fetching guide by email:', error);
      return undefined;
    }
  }

  async createGuide(insertGuide: InsertGuide & { passwordHash: string }): Promise<Guide> {
    try {
      console.log('📝 Creating guide using direct query...');
      const guide = await createGuideDirectly({
        fullName: insertGuide.fullName,
        email: insertGuide.email,
        whatsapp: insertGuide.whatsapp,
        instagram: insertGuide.instagram || null,
        tiktok: insertGuide.tiktok || null,
        passwordHash: insertGuide.passwordHash
      });
      
      // Convert snake_case to camelCase
      return {
        id: guide.id,
        fullName: guide.full_name,
        email: guide.email,
        whatsapp: guide.whatsapp,
        instagram: guide.instagram,
        tiktok: guide.tiktok,
        passwordHash: guide.password_hash,
        primarySpecialty: guide.primary_specialty,
        bio: guide.bio,
        profilePhotoUrl: guide.profile_photo_url,
        presentationVideoUrl: guide.presentation_video_url,
        activeTherapies: guide.active_therapies,
        verified: guide.verified,
        verificationDocuments: guide.verification_documents,
        verificationStatus: guide.verification_status,
        verificationNotes: guide.verification_notes,
        passwordChangedAt: guide.password_changed_at,
        failedLoginAttempts: guide.failed_login_attempts,
        lockedUntil: guide.locked_until,
        createdAt: guide.created_at,
        updatedAt: guide.updated_at
      } as Guide;
    } catch (error) {
      console.error('Error creating guide:', error);
      throw error;
    }
  }

  async getAllGuides(): Promise<Guide[]> {
    return await db.select().from(guides).orderBy(sql`${guides.createdAt} DESC`);
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
    return await db.select().from(therapies).where(eq(therapies.guideId, guideId)).orderBy(desc(therapies.updatedAt));
  }

  async getAllTherapies(filters?: { type?: string; location?: string; search?: string; guideId?: string; country?: string }): Promise<Therapy[]> {
    try {
      console.log('🔍 Fetching ALL therapies for admin using direct query...');
      console.log('Filters:', JSON.stringify(filters));
      
      // Use direct PostgreSQL query
      const result = await queryAllTherapies({
        country: filters?.country,
        type: filters?.type,
        guideId: filters?.guideId,
        search: filters?.search
      });

      console.log(`✅ Found ${result.length} therapies for admin`);
      return result as any[];
    } catch (error) {
      console.error('❌ Error fetching all therapies:', error);
      return [];
    }
  }

  async getPublishedTherapies(filters?: { type?: string; location?: string; search?: string; country?: string }): Promise<Therapy[]> {
    try {
      console.log('🔍 Fetching published therapies using direct query...');
      console.log('Filters:', JSON.stringify(filters));
      
      // Use direct PostgreSQL query to bypass Drizzle issues
      const result = await queryPublishedTherapies({
        country: filters?.country,
        type: filters?.type,
        category: filters?.location
      });

      console.log(`✅ Found ${result.length} published therapies`);
      return result as any[];
    } catch (error) {
      console.error('❌ Error fetching published therapies from DB:', error);
      console.error('DATABASE_URL configured:', !!process.env.DATABASE_URL);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      // Fallback to demo data when database is unavailable
      console.log('⚠️ Using demo data as fallback');
      return filterDemoTherapies(filters) as any[];
    }
  }

  async getFeaturedTherapies(limit: number = 6): Promise<Therapy[]> {
    return await db
      .select()
      .from(therapies)
      .where(eq(therapies.published, true))
      .orderBy(desc(therapies.updatedAt))
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

  // Admin settings operations
  async getAdminSettings(): Promise<AdminSettings | undefined> {
    const [settings] = await db.select().from(adminSettings).limit(1);
    return settings;
  }

  async updateAdminSettings(data: { adminName: string; adminWhatsapp: string; adminWhatsappMexico?: string | null; paypalEmail?: string | null }): Promise<AdminSettings> {
    // Get existing settings
    const existing = await this.getAdminSettings();
    
    if (existing) {
      // Update existing
      const [updated] = await db
        .update(adminSettings)
        .set({ ...data, updatedAt: sql`NOW()` })
        .where(eq(adminSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db.insert(adminSettings).values(data).returning();
      return created;
    }
  }
}

export const storage = new DbStorage();
