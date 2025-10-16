import {
  queryPublishedTherapies,
  queryAllTherapies,
  queryGuideByEmail,
  createGuideDirectly,
  queryTherapyBySlug,
  updateTherapyDirectly,
  queryAdminSettings,
  queryTherapyById,
  queryTherapiesByGuideId,
  createTherapyDirectly,
  deleteTherapyDirectly,
  queryGuideById,
  queryAllGuides,
  updateGuideDirectly,
  queryFeaturedTherapies,
  updateAdminSettingsDirectly,
  createAdminSettingsDirectly,
} from './db-direct';
import { type Guide, type Therapy, type InsertGuide, type InsertTherapy, type AdminSettings } from "@shared/schema";
import { filterDemoTherapies } from "./demo-data";

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
    try {
      const guide = await queryGuideById(id);
      return guide as any;
    } catch (error) {
      console.error('Error fetching guide:', error);
      return undefined;
    }
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
    try {
      const guides = await queryAllGuides();
      return guides as any[];
    } catch (error) {
      console.error('Error fetching all guides:', error);
      return [];
    }
  }

  async updateGuide(id: string, updateData: Partial<InsertGuide>): Promise<Guide> {
    try {
      const guide = await updateGuideDirectly(id, updateData);
      return guide as any;
    } catch (error) {
      console.error('Error updating guide:', error);
      throw error;
    }
  }

  // Therapy operations
  async getTherapy(id: string): Promise<Therapy | undefined> {
    try {
      const therapy = await queryTherapyById(id);
      return therapy as any;
    } catch (error) {
      console.error('Error fetching therapy:', error);
      return undefined;
    }
  }

  async getTherapyBySlug(slug: string): Promise<Therapy | undefined> {
    try {
      const therapy = await queryTherapyBySlug(slug);
      if (!therapy) return undefined;
      
      // Return as is (already compatible format from database)
      return therapy as any;
    } catch (error) {
      console.error('Error fetching therapy by slug:', error);
      return undefined;
    }
  }

  async getTherapiesByGuideId(guideId: string): Promise<Therapy[]> {
    try {
      const therapies = await queryTherapiesByGuideId(guideId);
      return therapies as any[];
    } catch (error) {
      console.error('Error fetching therapies by guide:', error);
      return [];
    }
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
    try {
      const therapies = await queryFeaturedTherapies(limit);
      return therapies as any[];
    } catch (error) {
      console.error('Error fetching featured therapies:', error);
      return [];
    }
  }

  async createTherapy(insertTherapy: InsertTherapy): Promise<Therapy> {
    try {
      const therapy = await createTherapyDirectly(insertTherapy as any);
      return therapy as any;
    } catch (error) {
      console.error('Error creating therapy:', error);
      throw error;
    }
  }

  async updateTherapy(id: string, updateData: Partial<InsertTherapy>): Promise<Therapy> {
    try {
      console.log('📝 Updating therapy via direct query...');
      const therapy = await updateTherapyDirectly(id, updateData);
      return therapy as any;
    } catch (error) {
      console.error('Error updating therapy:', error);
      throw error;
    }
  }

  async deleteTherapy(id: string): Promise<void> {
    try {
      await deleteTherapyDirectly(id);
    } catch (error) {
      console.error('Error deleting therapy:', error);
      throw error;
    }
  }

  // Admin settings operations
  async getAdminSettings(): Promise<AdminSettings | undefined> {
    try {
      const settings = await queryAdminSettings();
      return settings as any;
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      return undefined;
    }
  }

  async updateAdminSettings(data: { adminName: string; adminWhatsapp: string; adminWhatsappMexico?: string | null; paypalEmail?: string | null }): Promise<AdminSettings> {
    try {
      // Get existing settings
      const existing = await this.getAdminSettings();
      
      if (existing) {
        // Update existing
        const updated = await updateAdminSettingsDirectly(existing.id, data);
        return updated as any;
      } else {
        // Create new
        const created = await createAdminSettingsDirectly(data);
        return created as any;
      }
    } catch (error) {
      console.error('Error updating admin settings:', error);
      throw error;
    }
  }
}

export const storage = new DbStorage();
