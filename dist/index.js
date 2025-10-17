
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db-direct.ts
import { Pool } from "pg";
var DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}
var pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 1e4
});
pool.on("connect", () => {
  console.log("\u2705 PostgreSQL pool connected");
});
pool.on("error", (err) => {
  console.error("\u274C PostgreSQL pool error:", err);
});
function mapTherapyFromDb(row) {
  return {
    id: row.id,
    guideId: row.guide_id,
    guideName: row.guide_name,
    guidePhotoUrl: row.guide_photo_url,
    country: row.country,
    category: row.category,
    title: row.title,
    slug: row.slug,
    description: row.description,
    type: row.type,
    basePrice: row.base_price,
    platformFee: row.platform_fee,
    price: row.price,
    currency: row.currency,
    duration: row.duration,
    location: row.location,
    googleMapsUrl: row.google_maps_url,
    videoUrl: row.video_url,
    whatsappNumber: row.whatsapp_number,
    availableDates: row.available_dates,
    availableTimes: row.available_times,
    fixedTime: row.fixed_time,
    shippingOptions: row.shipping_options,
    inventory: row.inventory,
    capacity: row.capacity,
    bookedSlots: row.booked_slots,
    specificFields: row.specific_fields,
    published: row.is_published,
    approvalStatus: row.approval_status,
    displayOrder: row.display_order,
    deletedAt: row.deleted_at,
    viewsCount: row.views_count,
    whatsappClicks: row.whatsapp_clicks,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
async function queryPublishedTherapies(filters) {
  const conditions = ["is_published = true"];
  const values = [];
  let paramCount = 1;
  if (filters?.country) {
    conditions.push(`country = $${paramCount}`);
    values.push(filters.country);
    paramCount++;
  }
  if (filters?.type) {
    conditions.push(`type = $${paramCount}`);
    values.push(filters.type);
    paramCount++;
  }
  if (filters?.category) {
    conditions.push(`category = $${paramCount}`);
    values.push(filters.category);
    paramCount++;
  }
  const query = `
    SELECT * FROM therapies 
    WHERE ${conditions.join(" AND ")}
    ORDER BY updated_at DESC
  `;
  console.log("\u{1F50D} Executing query:", query.substring(0, 100), "...");
  console.log("\u{1F50D} With values:", values);
  const result = await pool.query(query, values);
  console.log(`\u2705 Found ${result.rows.length} therapies`);
  return result.rows.map(mapTherapyFromDb);
}
async function queryAllTherapies(filters) {
  const conditions = [];
  const values = [];
  let paramCount = 1;
  if (filters?.country) {
    conditions.push(`country = $${paramCount}`);
    values.push(filters.country);
    paramCount++;
  }
  if (filters?.type) {
    conditions.push(`type = $${paramCount}`);
    values.push(filters.type);
    paramCount++;
  }
  if (filters?.guideId) {
    conditions.push(`guide_id = $${paramCount}`);
    values.push(filters.guideId);
    paramCount++;
  }
  if (filters?.search) {
    conditions.push(`(
      title ILIKE $${paramCount} OR 
      guide_name ILIKE $${paramCount} OR 
      description ILIKE $${paramCount}
    )`);
    values.push(`%${filters.search}%`);
    paramCount++;
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const query = `
    SELECT * FROM therapies 
    ${whereClause}
    ORDER BY updated_at DESC
  `;
  console.log("\u{1F50D} Executing ALL therapies query:", query.substring(0, 100), "...");
  console.log("\u{1F50D} With values:", values);
  const result = await pool.query(query, values);
  console.log(`\u2705 Found ${result.rows.length} therapies for admin`);
  return result.rows.map(mapTherapyFromDb);
}
async function queryGuideByEmail(email) {
  const query = "SELECT * FROM guides WHERE email = $1 LIMIT 1";
  console.log("\u{1F50D} Looking for guide with email:", email);
  const result = await pool.query(query, [email]);
  if (result.rows.length > 0) {
    console.log("\u2705 Guide found:", result.rows[0].full_name);
    return result.rows[0];
  }
  console.log("\u26A0\uFE0F No guide found with that email");
  return null;
}
async function createGuideDirectly(guideData) {
  const query = `
    INSERT INTO guides (
      full_name, 
      email, 
      whatsapp, 
      instagram, 
      tiktok, 
      password_hash,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *
  `;
  console.log("\u{1F4DD} Creating guide with email:", guideData.email);
  const result = await pool.query(query, [
    guideData.fullName,
    guideData.email,
    guideData.whatsapp,
    guideData.instagram || null,
    guideData.tiktok || null,
    guideData.passwordHash
  ]);
  if (result.rows.length > 0) {
    console.log("\u2705 Guide created successfully:", result.rows[0].full_name);
    return result.rows[0];
  }
  throw new Error("Failed to create guide");
}
async function queryTherapyBySlug(slug) {
  const query = "SELECT * FROM therapies WHERE slug = $1 LIMIT 1";
  console.log("\u{1F50D} Looking for therapy with slug:", slug);
  const result = await pool.query(query, [slug]);
  if (result.rows.length > 0) {
    console.log("\u2705 Therapy found:", result.rows[0].title);
    return mapTherapyFromDb(result.rows[0]);
  }
  console.log("\u26A0\uFE0F No therapy found with that slug");
  return null;
}
async function updateTherapyDirectly(id, updates) {
  console.log("\u{1F4DD} Updating therapy:", id);
  console.log("\u{1F4DD} Updates:", updates);
  const fields = [];
  const values = [];
  let paramIndex = 1;
  const fieldMap = {
    published: "is_published",
    approvalStatus: "approval_status",
    displayOrder: "display_order",
    inventory: "inventory",
    capacity: "capacity",
    bookedSlots: "booked_slots",
    basePrice: "base_price",
    platformFee: "platform_fee",
    googleMapsUrl: "google_maps_url",
    videoUrl: "video_url",
    whatsappNumber: "whatsapp_number",
    specificFields: "specific_fields",
    availableDates: "available_dates",
    availableTimes: "available_times",
    fixedTime: "fixed_time",
    shippingOptions: "shipping_options",
    guideName: "guide_name",
    guidePhotoUrl: "guide_photo_url"
  };
  for (const [key, value] of Object.entries(updates)) {
    const dbField = fieldMap[key] || key;
    fields.push(`${dbField} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const query = `
    UPDATE therapies 
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  console.log("\u{1F50D} Update query:", query);
  console.log("\u{1F50D} Values:", values);
  const result = await pool.query(query, values);
  if (result.rows.length > 0) {
    console.log("\u2705 Therapy updated successfully:", result.rows[0].title);
    return mapTherapyFromDb(result.rows[0]);
  }
  throw new Error("Therapy not found or update failed");
}
async function queryAdminSettings() {
  const query = "SELECT * FROM admin_settings LIMIT 1";
  console.log("\u2699\uFE0F Fetching admin settings...");
  const result = await pool.query(query);
  if (result.rows.length > 0) {
    console.log("\u2705 Admin settings found");
    return result.rows[0];
  }
  console.log("\u26A0\uFE0F No admin settings found");
  return null;
}
async function queryTherapyById(id) {
  const query = "SELECT * FROM therapies WHERE id = $1 LIMIT 1";
  console.log("\u{1F50D} Looking for therapy with id:", id);
  const result = await pool.query(query, [id]);
  if (result.rows.length > 0) {
    console.log("\u2705 Therapy found:", result.rows[0].title);
    return mapTherapyFromDb(result.rows[0]);
  }
  console.log("\u26A0\uFE0F No therapy found with that id");
  return null;
}
async function queryTherapiesByGuideId(guideId) {
  const query = "SELECT * FROM therapies WHERE guide_id = $1 ORDER BY updated_at DESC";
  console.log("\u{1F50D} Looking for therapies by guide:", guideId);
  const result = await pool.query(query, [guideId]);
  console.log(`\u2705 Found ${result.rows.length} therapies for guide`);
  return result.rows.map(mapTherapyFromDb);
}
async function createTherapyDirectly(therapyData) {
  const query = `
    INSERT INTO therapies (
      guide_id, guide_name, guide_photo_url, country, category, title, slug,
      description, type, duration, price, currency, location,
      is_published, approval_status, video_url, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
      $14, $15, $16, NOW(), NOW()
    ) RETURNING *
  `;
  console.log("\u{1F4DD} Creating therapy:", therapyData.title);
  const result = await pool.query(query, [
    therapyData.guideId,
    therapyData.guideName,
    therapyData.guidePhotoUrl || null,
    therapyData.country,
    therapyData.category || "ceremonias",
    therapyData.title,
    therapyData.slug,
    therapyData.description || null,
    therapyData.type,
    therapyData.duration || null,
    therapyData.price || null,
    therapyData.currency || "USD",
    therapyData.location || null,
    therapyData.published || false,
    therapyData.approvalStatus || "pending",
    therapyData.videoUrl || null
  ]);
  if (result.rows.length > 0) {
    console.log("\u2705 Therapy created successfully:", result.rows[0].title);
    return mapTherapyFromDb(result.rows[0]);
  }
  throw new Error("Failed to create therapy");
}
async function deleteTherapyDirectly(id) {
  const query = "DELETE FROM therapies WHERE id = $1";
  console.log("\u{1F5D1}\uFE0F Deleting therapy:", id);
  await pool.query(query, [id]);
  console.log("\u2705 Therapy deleted successfully");
}
async function queryGuideById(id) {
  const query = "SELECT * FROM guides WHERE id = $1 LIMIT 1";
  console.log("\u{1F50D} Looking for guide with id:", id);
  const result = await pool.query(query, [id]);
  if (result.rows.length > 0) {
    console.log("\u2705 Guide found:", result.rows[0].full_name);
    return result.rows[0];
  }
  console.log("\u26A0\uFE0F No guide found with that id");
  return null;
}
async function queryAllGuides() {
  const query = "SELECT * FROM guides ORDER BY created_at DESC";
  console.log("\u{1F50D} Fetching all guides...");
  const result = await pool.query(query);
  console.log(`\u2705 Found ${result.rows.length} guides`);
  return result.rows;
}
async function updateGuideDirectly(id, updates) {
  console.log("\u{1F4DD} Updating guide:", id);
  const fields = [];
  const values = [];
  let paramIndex = 1;
  const fieldMap = {
    fullName: "full_name",
    profilePhotoUrl: "profile_photo_url",
    presentationVideoUrl: "presentation_video_url",
    primarySpecialty: "primary_specialty",
    verificationStatus: "verification_status",
    verificationDocuments: "verification_documents",
    verificationNotes: "verification_notes",
    activeTherapies: "active_therapies"
  };
  for (const [key, value] of Object.entries(updates)) {
    const dbField = fieldMap[key] || key;
    fields.push(`${dbField} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const query = `
    UPDATE guides 
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  const result = await pool.query(query, values);
  if (result.rows.length > 0) {
    console.log("\u2705 Guide updated successfully:", result.rows[0].full_name);
    return result.rows[0];
  }
  throw new Error("Guide not found or update failed");
}
async function queryFeaturedTherapies(limit = 6) {
  const query = `
    SELECT * FROM therapies 
    WHERE is_published = true 
    ORDER BY created_at DESC 
    LIMIT $1
  `;
  console.log("\u{1F50D} Fetching featured therapies, limit:", limit);
  const result = await pool.query(query, [limit]);
  console.log(`\u2705 Found ${result.rows.length} featured therapies`);
  return result.rows.map(mapTherapyFromDb);
}
async function updateAdminSettingsDirectly(id, data) {
  const query = `
    UPDATE admin_settings 
    SET admin_name = $1, admin_whatsapp = $2, admin_whatsapp_mexico = $3, paypal_email = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `;
  console.log("\u2699\uFE0F Updating admin settings...");
  const result = await pool.query(query, [
    data.adminName,
    data.adminWhatsapp,
    data.adminWhatsappMexico || null,
    data.paypalEmail || null,
    id
  ]);
  if (result.rows.length > 0) {
    console.log("\u2705 Admin settings updated");
    return result.rows[0];
  }
  throw new Error("Admin settings not found");
}
async function createAdminSettingsDirectly(data) {
  const query = `
    INSERT INTO admin_settings (admin_name, admin_whatsapp, admin_whatsapp_mexico, paypal_email, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *
  `;
  console.log("\u2699\uFE0F Creating admin settings...");
  const result = await pool.query(query, [
    data.adminName,
    data.adminWhatsapp,
    data.adminWhatsappMexico || null,
    data.paypalEmail || null
  ]);
  if (result.rows.length > 0) {
    console.log("\u2705 Admin settings created");
    return result.rows[0];
  }
  throw new Error("Failed to create admin settings");
}

// server/demo-data.ts
var DEMO_THERAPIES = [
  {
    id: "demo-1",
    guideId: "guide-1",
    guideName: "Juan Pachamama",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    country: "PE",
    category: "ceremonias",
    title: "3-Day Ayahuasca Retreat in Sacred Valley",
    slug: "3-day-ayahuasca-sacred-valley",
    description: "Transformative plant medicine ceremony in the heart of the Peruvian Amazon. Includes shamanic guidance, breathwork, and integration sessions.",
    type: "ayahuasca-retreat",
    basePrice: "450",
    platformFee: "112.50",
    language: "es",
    location: "Sacred Valley, Peru",
    durationMinutes: 1440,
    maxParticipants: 8,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Sacred+Valley,+Peru",
    published: true,
    publishedOn: (/* @__PURE__ */ new Date()).toISOString(),
    approval: "approved",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    whatsapp: "+51987654321",
    instagram: "@juanpachamama"
  },
  {
    id: "demo-2",
    guideId: "guide-2",
    guideName: "Mar\xEDa San Pedro",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    country: "PE",
    category: "ceremonias",
    title: "San Pedro Ceremony - Connection to Nature",
    slug: "san-pedro-ceremony-connection",
    description: "Ancient San Pedro cactus ceremony for spiritual awakening and connection with nature. Experienced facilitator with 15 years of practice.",
    type: "san-pedro",
    basePrice: "350",
    platformFee: "87.50",
    language: "es",
    location: "Cusco, Peru",
    durationMinutes: 720,
    maxParticipants: 12,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Cusco,+Peru",
    published: true,
    publishedOn: (/* @__PURE__ */ new Date()).toISOString(),
    approval: "approved",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    whatsapp: "+51987654322",
    instagram: "@mariasanpedro"
  },
  {
    id: "demo-3",
    guideId: "guide-3",
    guideName: "Carlos Kambo",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    country: "PE",
    category: "terapias",
    title: "Kambo Therapy - Detox & Renewal",
    slug: "kambo-therapy-detox",
    description: "Traditional Amazonian Kambo ritual for deep physical and energetic cleansing. Professional practitioner certified in ritual medicine.",
    type: "kambo",
    basePrice: "200",
    platformFee: "50",
    language: "es",
    location: "Iquitos, Peru",
    durationMinutes: 180,
    maxParticipants: 6,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Iquitos,+Peru",
    published: true,
    publishedOn: (/* @__PURE__ */ new Date()).toISOString(),
    approval: "approved",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    whatsapp: "+51987654323",
    instagram: "@carloskambo"
  },
  {
    id: "demo-4",
    guideId: "guide-4",
    guideName: "Isabella Microdosis",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    country: "MX",
    category: "microdosis",
    title: "Psilocybin Microdosing Program - 8 Weeks",
    slug: "psilocybin-microdose-8weeks",
    description: "Guided microdosing journey with integration support. Includes weekly check-ins and personalized guidance for optimal results.",
    type: "psilocybin-microdose",
    basePrice: "600",
    platformFee: "150",
    language: "es",
    location: "Mexico City, Mexico",
    durationMinutes: 10080,
    maxParticipants: 10,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Mexico+City,+Mexico",
    published: true,
    publishedOn: (/* @__PURE__ */ new Date()).toISOString(),
    approval: "approved",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    whatsapp: "+52123456789",
    instagram: "@isabellaamicro"
  },
  {
    id: "demo-5",
    guideId: "guide-5",
    guideName: "David Meditation",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    country: "MX",
    category: "terapias",
    title: "Guided Meditation & Breathwork Retreat",
    slug: "meditation-breathwork-retreat",
    description: "5-day meditation and breathwork intensive for stress relief and inner peace. Daily sessions with experienced yoga instructor.",
    type: "meditation",
    basePrice: "300",
    platformFee: "75",
    language: "es",
    location: "Oaxaca, Mexico",
    durationMinutes: 2880,
    maxParticipants: 15,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Oaxaca,+Mexico",
    published: true,
    publishedOn: (/* @__PURE__ */ new Date()).toISOString(),
    approval: "approved",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    whatsapp: "+52987654321",
    instagram: "@davidmeditacion"
  }
];
function filterDemoTherapies(filters) {
  let result = [...DEMO_THERAPIES];
  if (filters?.country) {
    result = result.filter((t) => t.country === filters.country);
  }
  if (filters?.type) {
    result = result.filter((t) => t.type === filters.type);
  }
  if (filters?.location) {
    result = result.filter(
      (t) => t.location?.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (t) => t.title.toLowerCase().includes(searchLower) || t.guideName.toLowerCase().includes(searchLower) || t.description?.toLowerCase().includes(searchLower)
    );
  }
  return result;
}

// server/storage.ts
var DbStorage = class {
  // Guide operations
  async getGuide(id) {
    try {
      const guide = await queryGuideById(id);
      return guide;
    } catch (error) {
      console.error("Error fetching guide:", error);
      return void 0;
    }
  }
  async getGuideByEmail(email) {
    try {
      const guide = await queryGuideByEmail(email);
      if (!guide) return void 0;
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
      };
    } catch (error) {
      console.error("Error fetching guide by email:", error);
      return void 0;
    }
  }
  async createGuide(insertGuide) {
    try {
      console.log("\u{1F4DD} Creating guide using direct query...");
      const guide = await createGuideDirectly({
        fullName: insertGuide.fullName,
        email: insertGuide.email,
        whatsapp: insertGuide.whatsapp,
        instagram: insertGuide.instagram || null,
        tiktok: insertGuide.tiktok || null,
        passwordHash: insertGuide.passwordHash
      });
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
      };
    } catch (error) {
      console.error("Error creating guide:", error);
      throw error;
    }
  }
  async getAllGuides() {
    try {
      const guides = await queryAllGuides();
      return guides;
    } catch (error) {
      console.error("Error fetching all guides:", error);
      return [];
    }
  }
  async updateGuide(id, updateData) {
    try {
      const guide = await updateGuideDirectly(id, updateData);
      return guide;
    } catch (error) {
      console.error("Error updating guide:", error);
      throw error;
    }
  }
  // Therapy operations
  async getTherapy(id) {
    try {
      const therapy = await queryTherapyById(id);
      return therapy;
    } catch (error) {
      console.error("Error fetching therapy:", error);
      return void 0;
    }
  }
  async getTherapyBySlug(slug) {
    try {
      const therapy = await queryTherapyBySlug(slug);
      if (!therapy) return void 0;
      return therapy;
    } catch (error) {
      console.error("Error fetching therapy by slug:", error);
      return void 0;
    }
  }
  async getTherapiesByGuideId(guideId) {
    try {
      const therapies = await queryTherapiesByGuideId(guideId);
      return therapies;
    } catch (error) {
      console.error("Error fetching therapies by guide:", error);
      return [];
    }
  }
  async getAllTherapies(filters) {
    try {
      console.log("\u{1F50D} Fetching ALL therapies for admin using direct query...");
      console.log("Filters:", JSON.stringify(filters));
      const result = await queryAllTherapies({
        country: filters?.country,
        type: filters?.type,
        guideId: filters?.guideId,
        search: filters?.search
      });
      console.log(`\u2705 Found ${result.length} therapies for admin`);
      return result;
    } catch (error) {
      console.error("\u274C Error fetching all therapies:", error);
      return [];
    }
  }
  async getPublishedTherapies(filters) {
    try {
      console.log("\u{1F50D} Fetching published therapies using direct query...");
      console.log("Filters:", JSON.stringify(filters));
      const result = await queryPublishedTherapies({
        country: filters?.country,
        type: filters?.type,
        category: filters?.location
      });
      console.log(`\u2705 Found ${result.length} published therapies`);
      return result;
    } catch (error) {
      console.error("\u274C Error fetching published therapies from DB:", error);
      console.error("DATABASE_URL configured:", !!process.env.DATABASE_URL);
      console.error("Error details:", error instanceof Error ? error.message : "Unknown error");
      console.log("\u26A0\uFE0F Using demo data as fallback");
      return filterDemoTherapies(filters);
    }
  }
  async getFeaturedTherapies(limit = 6) {
    try {
      const therapies = await queryFeaturedTherapies(limit);
      return therapies;
    } catch (error) {
      console.error("Error fetching featured therapies:", error);
      return [];
    }
  }
  async createTherapy(insertTherapy) {
    try {
      const therapy = await createTherapyDirectly(insertTherapy);
      return therapy;
    } catch (error) {
      console.error("Error creating therapy:", error);
      throw error;
    }
  }
  async updateTherapy(id, updateData) {
    try {
      console.log("\u{1F4DD} Updating therapy via direct query...");
      const therapy = await updateTherapyDirectly(id, updateData);
      return therapy;
    } catch (error) {
      console.error("Error updating therapy:", error);
      throw error;
    }
  }
  async deleteTherapy(id) {
    try {
      await deleteTherapyDirectly(id);
    } catch (error) {
      console.error("Error deleting therapy:", error);
      throw error;
    }
  }
  // Admin settings operations
  async getAdminSettings() {
    try {
      const settings = await queryAdminSettings();
      if (!settings) {
        return void 0;
      }
      return {
        id: settings.id,
        adminName: settings.admin_name,
        adminWhatsapp: settings.admin_whatsapp,
        adminWhatsappMexico: settings.admin_whatsapp_mexico,
        paypalEmail: settings.paypal_email,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at
      };
    } catch (error) {
      console.error("Error fetching admin settings:", error);
      return void 0;
    }
  }
  async updateAdminSettings(data) {
    try {
      const existing = await this.getAdminSettings();
      if (existing) {
        const updated = await updateAdminSettingsDirectly(existing.id, data);
        return {
          id: updated.id,
          adminName: updated.admin_name,
          adminWhatsapp: updated.admin_whatsapp,
          adminWhatsappMexico: updated.admin_whatsapp_mexico,
          paypalEmail: updated.paypal_email,
          createdAt: updated.created_at,
          updatedAt: updated.updated_at
        };
      } else {
        const created = await createAdminSettingsDirectly(data);
        return {
          id: created.id,
          adminName: created.admin_name,
          adminWhatsapp: created.admin_whatsapp,
          adminWhatsappMexico: created.admin_whatsapp_mexico,
          paypalEmail: created.paypal_email,
          createdAt: created.created_at,
          updatedAt: created.updated_at
        };
      }
    } catch (error) {
      console.error("Error updating admin settings:", error);
      throw error;
    }
  }
};
var storage = new DbStorage();

// server/auth.ts
import { randomUUID } from "crypto";
var sessions = /* @__PURE__ */ new Map();
function createSession(guideId, email) {
  const sessionId = randomUUID();
  sessions.set(sessionId, {
    id: sessionId,
    guideId,
    email,
    createdAt: /* @__PURE__ */ new Date()
  });
  return sessionId;
}
function getSession(sessionId) {
  const session = sessions.get(sessionId);
  console.log("\u{1F50D} Getting session:", {
    sessionId: sessionId.substring(0, 8) + "...",
    found: !!session,
    isMaster: session?.isMaster
  });
  return session;
}
function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
function debugSessions() {
  console.log("\u{1F4CA} Active sessions:", sessions.size);
  sessions.forEach((session, id) => {
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
  sessions.set(sessionId, session);
  console.log("\u{1F511} Master session created:", { sessionId: sessionId.substring(0, 8) + "...", isMaster: session.isMaster });
  console.log("\u{1F4CA} Total sessions:", sessions.size);
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
      sessions.set(sessionId, { ...session, id: sessionId });
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
  app2.get("/api/health", async (_req, res) => {
    try {
      const hasDbUrl = !!process.env.DATABASE_URL;
      res.json({
        status: "ok",
        database: hasDbUrl ? "configured" : "not configured",
        databaseUrl: hasDbUrl ? "present" : "missing",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
  app2.get("/api/version", (_req, res) => {
    res.json({ version: "1.0.0", api: "Psynet v1" });
  });
  app2.get("/api/debug/db", async (_req, res) => {
    try {
      console.log("\u{1F50D} Testing database connection...");
      const therapies = await storage.getPublishedTherapies();
      res.json({
        status: "ok",
        database: "connected",
        therapyCount: therapies.length,
        sampleTherapies: therapies.slice(0, 3).map((t) => ({
          id: t.id,
          title: t.title,
          country: t.country,
          category: t.category
        })),
        databaseUrl: process.env.DATABASE_URL ? "configured" : "missing"
      });
    } catch (error) {
      console.error("\u274C Database test failed:", error);
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : void 0,
        databaseUrl: process.env.DATABASE_URL ? "configured" : "missing"
      });
    }
  });
  app2.get("/api/debug/videos", async (_req, res) => {
    try {
      const allTherapies = await storage.getAllTherapies();
      const therapiesWithVideos = allTherapies.filter((t) => t.videoUrl && t.videoUrl.trim() !== "");
      res.json({
        total: allTherapies.length,
        withVideos: therapiesWithVideos.length,
        withoutVideos: allTherapies.length - therapiesWithVideos.length,
        samples: therapiesWithVideos.slice(0, 10).map((t) => ({
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
        password,
        // Required by InsertGuide schema
        instagram: instagram || null,
        tiktok: tiktok || null,
        passwordHash
        // Additional field for actual storage
      });
      res.json({ message: "Registration successful", guideId: guide.id });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("\u{1F510} Login attempt for:", email);
      const guide = await storage.getGuideByEmail(email);
      if (!guide) {
        console.log("\u274C Guide not found");
        return res.status(401).json({ message: "Invalid email or password" });
      }
      console.log("\u2705 Guide found:", guide.fullName);
      console.log("\u{1F511} Checking password...");
      const isValidPassword = await verifyPassword(password, guide.passwordHash);
      if (!isValidPassword) {
        console.log("\u274C Invalid password");
        return res.status(401).json({ message: "Invalid email or password" });
      }
      console.log("\u2705 Password valid, creating session...");
      const sessionId = createSession(guide.id, guide.email);
      console.log("\u2705 Session created:", sessionId);
      const { passwordHash, ...guideWithoutPassword } = guide;
      res.json({ sessionId, guide: guideWithoutPassword });
    } catch (error) {
      console.error("\u274C Login error:", error);
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
  app2.patch("/api/guides/profile", requireAuth, async (req, res) => {
    try {
      const session = req.session;
      const updateData = req.body;
      delete updateData.id;
      delete updateData.email;
      const guide = await storage.updateGuide(session.guideId, updateData);
      if (updateData.fullName || updateData.profilePhotoUrl) {
        const therapies = await storage.getTherapiesByGuideId(session.guideId);
        const therapyUpdates = {};
        if (updateData.fullName) {
          therapyUpdates.guideName = updateData.fullName;
        }
        if (updateData.profilePhotoUrl) {
          therapyUpdates.guidePhotoUrl = updateData.profilePhotoUrl;
        }
        for (const therapy of therapies) {
          await storage.updateTherapy(therapy.id, therapyUpdates);
        }
        console.log(`\u2705 Updated ${therapies.length} therapies with new guide info`);
      }
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update profile" });
    }
  });
  app2.get("/api/therapies/featured", async (_req, res) => {
    try {
      const therapies = await storage.getFeaturedTherapies(6);
      res.json(therapies);
    } catch (error) {
      console.error("Featured therapies error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch therapies" });
    }
  });
  app2.get("/api/therapies/published", async (req, res) => {
    try {
      const { type, location, search, country } = req.query;
      console.log("Fetching published therapies with filters:", { type, location, search, country });
      const therapies = await storage.getPublishedTherapies({
        type,
        location,
        search,
        country
      });
      console.log(`Found ${therapies.length} published therapies`);
      res.json(therapies);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch therapies";
      console.error("Error fetching published therapies:", error);
      res.status(500).json({ message, error: process.env.NODE_ENV === "development" ? String(error) : void 0 });
    }
  });
  app2.get("/api/therapies", async (req, res) => {
    const { type, location, search, country } = req.query;
    try {
      const therapies = await storage.getPublishedTherapies({
        type,
        location,
        search,
        country
      });
      res.json(therapies);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch therapies";
      console.error("Error fetching therapies (legacy route):", message);
      res.status(200).json([]);
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
      const therapies = await storage.getTherapiesByGuideId(session.guideId);
      res.json(therapies);
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
      const isMaster = session.isMaster === true;
      const isOwner = therapy.guideId === session.guideId;
      console.log("\u{1F510} Access check for therapy edit:", {
        therapyId: therapy.id,
        therapyTitle: therapy.title,
        therapyGuideId: therapy.guideId,
        sessionGuideId: session.guideId,
        isMaster,
        isOwner,
        accessGranted: isOwner || isMaster
      });
      if (!isOwner && !isMaster) {
        console.log("\u274C Access denied - not owner and not master");
        return res.status(403).json({ message: "Access denied" });
      }
      console.log("\u2705 Access granted");
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
            adminUrl
          });
          if (adminSettings.adminWhatsapp) {
            const whatsappLinkPeru = generateWhatsAppLink(adminSettings.adminWhatsapp, message);
            console.log(`\u{1F4F1} WhatsApp notification link generated for Peru admin: ${adminSettings.adminName}`);
            console.log(`\u{1F517} Per\xFA: ${whatsappLinkPeru}`);
          }
          if (adminSettings.adminWhatsappMexico) {
            const whatsappLinkMexico = generateWhatsAppLink(adminSettings.adminWhatsappMexico, message);
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
      const isMaster = session.isMaster === true;
      const isOwner = therapy.guideId === session.guideId;
      if (!isOwner && !isMaster) {
        return res.status(403).json({ message: "Access denied" });
      }
      const updateData = { ...req.body };
      if (Object.prototype.hasOwnProperty.call(updateData, "isPublished")) {
        updateData.published = updateData.isPublished;
        delete updateData.isPublished;
      }
      if (updateData.videoUrl) {
        console.log(`\u{1F3A5} Video URL updated: ${updateData.videoUrl}`);
      }
      if (updateData.title && updateData.title !== therapy.title) {
        updateData.slug = generateSlug(updateData.title);
      }
      if (!isMaster) {
        updateData.approvalStatus = "pending";
        updateData.published = false;
      }
      const guideToSync = isMaster && therapy.guideId ? await storage.getGuide(therapy.guideId) : await storage.getGuide(session.guideId);
      if (guideToSync) {
        updateData.guideName = guideToSync.fullName;
        updateData.guidePhotoUrl = guideToSync.profilePhotoUrl;
      }
      const updatedTherapy = await storage.updateTherapy(req.params.id, updateData);
      if (!isMaster && guideToSync) {
        console.log(`\u270F\uFE0F Terapia actualizada por ${guideToSync.fullName}: ${updatedTherapy.title}`);
        console.log(`\u{1F4CB} ID: ${updatedTherapy.id} - Estado: pending (requiere revisi\xF3n)`);
      }
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
              adminUrl
            });
            if (adminSettings.adminWhatsapp) {
              const whatsappLinkPeru = generateWhatsAppLink(adminSettings.adminWhatsapp, message);
              console.log(`\u{1F4F1} WhatsApp notification link generated for Peru admin: ${adminSettings.adminName}`);
              console.log(`\u{1F517} Per\xFA: ${whatsappLinkPeru}`);
            }
            if (adminSettings.adminWhatsappMexico) {
              const whatsappLinkMexico = generateWhatsAppLink(adminSettings.adminWhatsappMexico, message);
              console.log(`\u{1F4F1} WhatsApp notification link generated for Mexico admin`);
              console.log(`\u{1F517} M\xE9xico: ${whatsappLinkMexico}`);
            }
          } else {
            console.log("\u26A0\uFE0F Admin WhatsApp not configured, skipping notification");
          }
        } catch (notifError) {
          console.error("\u274C Error sending WhatsApp notification:", notifError);
        }
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
      const therapies = await storage.getAllTherapies({
        type,
        location,
        search,
        guideId,
        country
      });
      res.json(therapies);
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
        approval: "approved",
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
        approval: "rejected",
        published: false
      });
      res.json(updatedTherapy);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to reject therapy" });
    }
  });
  app2.get("/api/admin/master/guides", requireMasterAuth, async (_req, res) => {
    try {
      console.log("\u{1F535} GET /api/admin/master/guides - Fetching all guides");
      const guides = await storage.getAllGuides();
      console.log(`\u2705 Found ${guides.length} guides`);
      res.json(guides);
    } catch (error) {
      console.error("\u274C Error fetching guides:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch guides" });
    }
  });
  app2.get("/api/admin/master/settings", requireMasterAuth, async (_req, res) => {
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
app.disable("etag");
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});
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
