// Vercel Serverless Function for API with Database Connection
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize database connection with inline imports
let db: any = null;
let dbError: string | null = null;

async function initDB() {
  if (db) return db;
  
  try {
    if (!process.env.DATABASE_URL) {
      dbError = "DATABASE_URL not configured";
      console.warn("⚠️ DATABASE_URL not configured");
      return null;
    }

    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    const { eq, and, desc } = await import("drizzle-orm");
    const schema = await import("../shared/schema");
    
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema: { therapies: schema.therapies, guides: schema.guides } });
    
    console.log("✅ Database connected successfully");
    return db;
  } catch (error: any) {
    dbError = error.message;
    console.error("❌ Database connection failed:", error.message);
    return null;
  }
}

// Demo data fallback
const DEMO_THERAPIES = [
  {
    id: 1,
    title: "Ceremonia de Ayahuasca en Valle Sagrado",
    description: "Experiencia transformadora de 3 días en el Valle Sagrado de Perú",
    type: "ayahuasca",
    location: "Cusco",
    country: "PE",
    price: 450,
    duration: "3 días",
    status: "published",
    guideId: "demo-guide-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Retiro de San Pedro en Desierto",
    description: "Ceremonia de cactus sagrado en un entorno desértico tranquilo",
    type: "san_pedro",
    location: "Lima",
    country: "PE",
    price: 300,
    duration: "2 días",
    status: "published",
    guideId: "demo-guide-2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Ceremonia de Temazcal en Teotihuacán",
    description: "Ritual ancestral de purificación con vapor y plantas medicinales",
    type: "temazcal",
    location: "Ciudad de México",
    country: "MX",
    price: 120,
    duration: "1 día",
    status: "published",
    guideId: "demo-guide-3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "Retiro de Hongos en Oaxaca",
    description: "Experiencia con hongos sagrados guiada por curanderos tradicionales",
    type: "psilocybin",
    location: "Oaxaca",
    country: "MX",
    price: 250,
    duration: "2 días",
    status: "published",
    guideId: "demo-guide-4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    title: "Ceremonia de Kambo en Amazonía",
    description: "Medicina de la rana para limpieza física y energética",
    type: "kambo",
    location: "Iquitos",
    country: "PE",
    price: 180,
    duration: "1 día",
    status: "published",
    guideId: "demo-guide-5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper function to fetch therapies from database
async function fetchTherapiesFromDB(filters: { country?: string; type?: string; search?: string }) {
  if (!db) {
    console.log("📦 DB not available, using demo data");
    return null;
  }

  try {
    console.log("🔍 Fetching from database with filters:", filters);
    
    const conditions = [eq(therapies.published, true)];

    if (filters.country) {
      conditions.push(eq(therapies.country, filters.country));
    }

    if (filters.type) {
      conditions.push(eq(therapies.type, filters.type));
    }

    let query = db
      .select()
      .from(therapies)
      .where(and(...conditions))
      .orderBy(desc(therapies.createdAt));

    const results = await query;

    // Apply search filter in memory (easier for complex text search)
    let filtered = results;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = results.filter((t: any) =>
        t.title?.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.location?.toLowerCase().includes(searchLower)
      );
    }

    console.log(`✅ Found ${filtered.length} therapies in database`);
    return filtered;
  } catch (error: any) {
    console.error("❌ Database query failed:", error.message);
    return null;
  }
}

// Helper function to get filtered demo therapies
function getFilteredDemoTherapies(filters: { country?: string; type?: string; search?: string }) {
  let filtered = DEMO_THERAPIES.filter(t => t.status === 'published');

  if (filters.country) {
    filtered = filtered.filter(t => t.country === filters.country);
  }

  if (filters.type) {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.location.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req;
  
  console.log(`${method} ${url}`);

  // Health check
  if (url === '/api/health') {
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production",
      database: db ? "connected" : (dbError || "not configured"),
    });
  }

  // Get published therapies
  if (url?.startsWith('/api/therapies/published')) {
    try {
      const urlParams = new URL(url, `http://${req.headers.host}`).searchParams;
      const filters = {
        country: urlParams.get('country') || undefined,
        type: urlParams.get('type') || undefined,
        search: urlParams.get('search') || undefined,
      };

      console.log('📋 Request filters:', filters);

      // Try database first
      const dbResults = await fetchTherapiesFromDB(filters);
      
      if (dbResults !== null) {
        console.log(`✅ Returning ${dbResults.length} therapies from DATABASE`);
        return res.status(200).json(dbResults);
      }

      // Fallback to demo data
      const demoResults = getFilteredDemoTherapies(filters);
      console.log(`📦 Returning ${demoResults.length} therapies from DEMO DATA (DB unavailable)`);
      return res.status(200).json(demoResults);

    } catch (error: any) {
      console.error('❌ Error in /api/therapies/published:', error);
      // Still return demo data on error
      const demoResults = getFilteredDemoTherapies({});
      return res.status(200).json(demoResults);
    }
  }

  // Get single therapy
  if (url?.match(/^\/api\/therapies\/.+$/)) {
    try {
      const therapyId = url.split('/').pop() || '';
      
      // Try database first
      if (db) {
        try {
          const result = await db
            .select()
            .from(therapies)
            .where(eq(therapies.id, therapyId))
            .limit(1);
          
          if (result.length > 0) {
            console.log(`✅ Found therapy ${therapyId} in DATABASE`);
            return res.status(200).json(result[0]);
          }
        } catch (error: any) {
          console.error("❌ DB query failed, trying demo:", error.message);
        }
      }

      // Fallback to demo (for demo therapies with numeric IDs)
      const numericId = parseInt(therapyId);
      if (!isNaN(numericId)) {
        const therapy = DEMO_THERAPIES.find(t => t.id === numericId);
        if (therapy) {
          console.log(`📦 Found therapy ${numericId} in DEMO DATA`);
          return res.status(200).json(therapy);
        }
      }
      
      return res.status(404).json({ message: "Therapy not found" });

    } catch (error: any) {
      console.error('❌ Error fetching therapy:', error);
      return res.status(500).json({ message: "Failed to fetch therapy" });
    }
  }

  // Get all guides
  if (url === '/api/guides') {
    try {
      // Try database first
      if (db) {
        try {
          const results = await db
            .select()
            .from(guides)
            .orderBy(desc(guides.createdAt));
          
          if (results.length > 0) {
            console.log(`✅ Found ${results.length} guides in DATABASE`);
            return res.status(200).json(results);
          }
        } catch (error: any) {
          console.error("❌ DB query failed, using demo:", error.message);
        }
      }

      // Fallback to demo
      console.log("📦 Returning demo guides");
      return res.status(200).json([
        {
          id: "demo-guide-1",
          email: "guide1@example.com",
          fullName: "María Fernandez",
          whatsapp: "51987654321",
          createdAt: new Date(),
        },
        {
          id: "demo-guide-2",
          email: "guide2@example.com",
          fullName: "Carlos Mendoza",
          whatsapp: "51987654322",
          createdAt: new Date(),
        },
      ]);
    } catch (error: any) {
      console.error('❌ Error fetching guides:', error);
      return res.status(500).json({ message: "Failed to fetch guides" });
    }
  }

  // Default 404
  return res.status(404).json({
    message: "Not found",
    url,
    method,
  });
}
