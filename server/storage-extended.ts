import { db } from "./db";
import { 
  guides, therapies, favorites, reviews, auditLogs, appConfig,
  type Guide, type Therapy, type InsertGuide, type InsertTherapy,
  type Favorite, type Review, type AuditLog
} from "@shared/schema";
import { eq, and, ilike, or, sql, isNull, desc, gte, lte, inArray } from "drizzle-orm";
import { logger, logError } from "./logger";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TherapyFilters {
  type?: string;
  category?: string;
  location?: string;
  search?: string;
  guideId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'date' | 'views' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ExtendedStorage {
  // ========== THERAPIES WITH PAGINATION ==========
  
  async getPublishedTherapiesPaginated(
    filters: TherapyFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResult<Therapy>> {
    try {
      const page = pagination.page || 1;
      const limit = pagination.limit || 20;
      const offset = (page - 1) * limit;

      const conditions = [
        eq(therapies.published, true),
        isNull(therapies.deletedAt)
      ];

      // Apply filters
      if (filters.category) {
        conditions.push(eq(therapies.category, filters.category));
      }
      if (filters.type) {
        conditions.push(eq(therapies.type, filters.type));
      }
      if (filters.location) {
        conditions.push(ilike(therapies.location, `%${filters.location}%`));
      }
      if (filters.minPrice) {
        conditions.push(gte(therapies.price, filters.minPrice.toString()));
      }
      if (filters.maxPrice) {
        conditions.push(lte(therapies.price, filters.maxPrice.toString()));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(therapies.title, `%${filters.search}%`),
            ilike(therapies.guideName, `%${filters.search}%`),
            ilike(therapies.description, `%${filters.search}%`)
          )!
        );
      }

      // Get total count
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(therapies)
        .where(and(...conditions));

      // Get paginated data with sorting
      let orderBy;
      const order = filters.sortOrder === 'asc' ? sql`ASC` : sql`DESC`;
      
      switch (filters.sortBy) {
        case 'price':
          orderBy = sql`${therapies.price} ${order}`;
          break;
        case 'views':
          orderBy = sql`${therapies.viewsCount} ${order}`;
          break;
        case 'date':
        default:
          orderBy = sql`${therapies.createdAt} ${order}`;
          break;
      }

      const data = await db
        .select()
        .from(therapies)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      return {
        data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      logError("Failed to get paginated therapies", error as Error, filters);
      throw error;
    }
  }

  // ========== SOFT DELETE ==========
  
  async softDeleteTherapy(id: string): Promise<void> {
    try {
      await db
        .update(therapies)
        .set({ deletedAt: new Date() })
        .where(eq(therapies.id, id));
      
      logger.info(`Therapy soft deleted: ${id}`);
    } catch (error) {
      logError("Failed to soft delete therapy", error as Error, { id });
      throw error;
    }
  }

  async restoreTherapy(id: string): Promise<void> {
    try {
      await db
        .update(therapies)
        .set({ deletedAt: null })
        .where(eq(therapies.id, id));
      
      logger.info(`Therapy restored: ${id}`);
    } catch (error) {
      logError("Failed to restore therapy", error as Error, { id });
      throw error;
    }
  }

  // ========== ANALYTICS ==========
  
  async incrementTherapyViews(id: string): Promise<void> {
    try {
      await db
        .update(therapies)
        .set({ viewsCount: sql`${therapies.viewsCount} + 1` })
        .where(eq(therapies.id, id));
    } catch (error) {
      logError("Failed to increment therapy views", error as Error, { id });
    }
  }

  async incrementWhatsAppClicks(id: string): Promise<void> {
    try {
      await db
        .update(therapies)
        .set({ whatsappClicks: sql`${therapies.whatsappClicks} + 1` })
        .where(eq(therapies.id, id));
    } catch (error) {
      logError("Failed to increment WhatsApp clicks", error as Error, { id });
    }
  }

  async getGuideAnalytics(guideId: string) {
    try {
      const therapiesList = await db
        .select()
        .from(therapies)
        .where(and(
          eq(therapies.guideId, guideId),
          isNull(therapies.deletedAt)
        ));

      const totalViews = therapiesList.reduce((sum, t) => sum + (t.viewsCount || 0), 0);
      const totalClicks = therapiesList.reduce((sum, t) => sum + (t.whatsappClicks || 0), 0);
      const published = therapiesList.filter(t => t.published).length;
      const draft = therapiesList.filter(t => !t.published).length;

      return {
        totalTherapies: therapiesList.length,
        published,
        draft,
        totalViews,
        totalClicks,
        conversionRate: totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(2) : 0,
      };
    } catch (error) {
      logError("Failed to get guide analytics", error as Error, { guideId });
      throw error;
    }
  }

  // ========== FAVORITES ==========
  
  async addFavorite(guideId: string, therapyId: string): Promise<Favorite> {
    try {
      const [favorite] = await db
        .insert(favorites)
        .values({ guideId, therapyId })
        .onConflictDoNothing()
        .returning();
      
      logger.info(`Favorite added`, { guideId, therapyId });
      return favorite;
    } catch (error) {
      logError("Failed to add favorite", error as Error, { guideId, therapyId });
      throw error;
    }
  }

  async removeFavorite(guideId: string, therapyId: string): Promise<void> {
    try {
      await db
        .delete(favorites)
        .where(and(
          eq(favorites.guideId, guideId),
          eq(favorites.therapyId, therapyId)
        ));
      
      logger.info(`Favorite removed`, { guideId, therapyId });
    } catch (error) {
      logError("Failed to remove favorite", error as Error, { guideId, therapyId });
      throw error;
    }
  }

  async getFavorites(guideId: string): Promise<Therapy[]> {
    try {
      const result = await db
        .select({
          therapy: therapies,
        })
        .from(favorites)
        .innerJoin(therapies, eq(favorites.therapyId, therapies.id))
        .where(and(
          eq(favorites.guideId, guideId),
          isNull(therapies.deletedAt)
        ));

      return result.map(r => r.therapy);
    } catch (error) {
      logError("Failed to get favorites", error as Error, { guideId });
      throw error;
    }
  }

  async isFavorite(guideId: string, therapyId: string): Promise<boolean> {
    try {
      const [favorite] = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.guideId, guideId),
          eq(favorites.therapyId, therapyId)
        ));

      return !!favorite;
    } catch (error) {
      logError("Failed to check favorite", error as Error, { guideId, therapyId });
      return false;
    }
  }

  // ========== REVIEWS ==========
  
  async createReview(data: {
    therapyId: string;
    guideId?: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    try {
      const [review] = await db
        .insert(reviews)
        .values(data)
        .returning();
      
      logger.info(`Review created`, { therapyId: data.therapyId, rating: data.rating });
      return review;
    } catch (error) {
      logError("Failed to create review", error as Error, data);
      throw error;
    }
  }

  async getTherapyReviews(therapyId: string): Promise<Review[]> {
    try {
      return await db
        .select()
        .from(reviews)
        .where(eq(reviews.therapyId, therapyId))
        .orderBy(desc(reviews.createdAt));
    } catch (error) {
      logError("Failed to get therapy reviews", error as Error, { therapyId });
      throw error;
    }
  }

  async getTherapyRating(therapyId: string): Promise<{ average: number; count: number }> {
    try {
      const [result] = await db
        .select({
          average: sql<number>`AVG(${reviews.rating})::numeric(3,2)`,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(reviews)
        .where(eq(reviews.therapyId, therapyId));

      return {
        average: result?.average || 0,
        count: result?.count || 0,
      };
    } catch (error) {
      logError("Failed to get therapy rating", error as Error, { therapyId });
      return { average: 0, count: 0 };
    }
  }

  // ========== AUDIT LOGS ==========
  
  async createAuditLog(data: {
    entityType: string;
    entityId: string;
    action: string;
    guideId?: string;
    changes?: any;
  }): Promise<void> {
    try {
      await db.insert(auditLogs).values(data);
    } catch (error) {
      logError("Failed to create audit log", error as Error, data);
    }
  }

  async getAuditLogs(entityType: string, entityId: string): Promise<AuditLog[]> {
    try {
      return await db
        .select()
        .from(auditLogs)
        .where(and(
          eq(auditLogs.entityType, entityType),
          eq(auditLogs.entityId, entityId)
        ))
        .orderBy(desc(auditLogs.createdAt));
    } catch (error) {
      logError("Failed to get audit logs", error as Error, { entityType, entityId });
      return [];
    }
  }

  // ========== APP CONFIG ==========
  
  async getConfig(key: string): Promise<any> {
    try {
      const [config] = await db
        .select()
        .from(appConfig)
        .where(eq(appConfig.key, key));

      return config?.value;
    } catch (error) {
      logError("Failed to get config", error as Error, { key });
      return null;
    }
  }

  async setConfig(key: string, value: any, description?: string): Promise<void> {
    try {
      await db
        .insert(appConfig)
        .values({ key, value, description })
        .onConflictDoUpdate({
          target: appConfig.key,
          set: { value, updatedAt: new Date() },
        });
      
      logger.info(`Config updated: ${key}`);
    } catch (error) {
      logError("Failed to set config", error as Error, { key, value });
      throw error;
    }
  }
}

export const extendedStorage = new ExtendedStorage();
