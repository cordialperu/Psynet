import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

// Create a connection pool for direct queries
export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ PostgreSQL pool connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err);
});

export async function queryPublishedTherapies(filters?: { country?: string; type?: string; category?: string }) {
  const conditions: string[] = ['is_published = true'];
  const values: any[] = [];
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
    WHERE ${conditions.join(' AND ')}
    ORDER BY updated_at DESC
  `;

  console.log('🔍 Executing query:', query.substring(0, 100), '...');
  console.log('🔍 With values:', values);

  const result = await pool.query(query, values);
  console.log(`✅ Found ${result.rows.length} therapies`);
  
  return result.rows;
}

export async function queryAllTherapies(filters?: { country?: string; type?: string; guideId?: string; search?: string }) {
  const conditions: string[] = [];
  const values: any[] = [];
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

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  const query = `
    SELECT * FROM therapies 
    ${whereClause}
    ORDER BY updated_at DESC
  `;

  console.log('🔍 Executing ALL therapies query:', query.substring(0, 100), '...');
  console.log('🔍 With values:', values);

  const result = await pool.query(query, values);
  console.log(`✅ Found ${result.rows.length} therapies for admin`);
  
  return result.rows;
}

export async function queryGuideByEmail(email: string) {
  const query = 'SELECT * FROM guides WHERE email = $1 LIMIT 1';
  
  console.log('🔍 Looking for guide with email:', email);
  
  const result = await pool.query(query, [email]);
  
  if (result.rows.length > 0) {
    console.log('✅ Guide found:', result.rows[0].full_name);
    return result.rows[0];
  }
  
  console.log('⚠️ No guide found with that email');
  return null;
}

export async function createGuideDirectly(guideData: {
  fullName: string;
  email: string;
  whatsapp: string;
  instagram?: string | null;
  tiktok?: string | null;
  passwordHash: string;
}) {
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
  
  console.log('📝 Creating guide with email:', guideData.email);
  
  const result = await pool.query(query, [
    guideData.fullName,
    guideData.email,
    guideData.whatsapp,
    guideData.instagram || null,
    guideData.tiktok || null,
    guideData.passwordHash
  ]);
  
  if (result.rows.length > 0) {
    console.log('✅ Guide created successfully:', result.rows[0].full_name);
    return result.rows[0];
  }
  
  throw new Error('Failed to create guide');
}

export async function queryTherapyBySlug(slug: string) {
  const query = 'SELECT * FROM therapies WHERE slug = $1 LIMIT 1';
  
  console.log('🔍 Looking for therapy with slug:', slug);
  
  const result = await pool.query(query, [slug]);
  
  if (result.rows.length > 0) {
    console.log('✅ Therapy found:', result.rows[0].title);
    return result.rows[0];
  }
  
  console.log('⚠️ No therapy found with that slug');
  return null;
}

export async function updateTherapyDirectly(id: string, updates: Record<string, any>) {
  console.log('📝 Updating therapy:', id);
  console.log('📝 Updates:', updates);
  
  // Construir la consulta UPDATE dinámicamente
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;
  
  // Mapeo de campos camelCase a snake_case
  const fieldMap: Record<string, string> = {
    published: 'is_published',
    approvalStatus: 'approval_status',
    displayOrder: 'display_order',
    inventory: 'inventory',
    capacity: 'capacity',
    bookedSlots: 'booked_slots',
    // Agregar más campos según necesites
  };
  
  for (const [key, value] of Object.entries(updates)) {
    const dbField = fieldMap[key] || key;
    fields.push(`${dbField} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }
  
  // Siempre actualizar updated_at
  fields.push(`updated_at = NOW()`);
  
  // Agregar el ID al final
  values.push(id);
  
  const query = `
    UPDATE therapies 
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  
  console.log('🔍 Update query:', query);
  console.log('🔍 Values:', values);
  
  const result = await pool.query(query, values);
  
  if (result.rows.length > 0) {
    console.log('✅ Therapy updated successfully:', result.rows[0].title);
    return result.rows[0];
  }
  
  throw new Error('Therapy not found or update failed');
}

export async function queryAdminSettings() {
  const query = 'SELECT * FROM admin_settings LIMIT 1';
  
  console.log('⚙️ Fetching admin settings...');
  
  const result = await pool.query(query);
  
  if (result.rows.length > 0) {
    console.log('✅ Admin settings found');
    return result.rows[0];
  }
  
  console.log('⚠️ No admin settings found');
  return null;
}

// ==================== THERAPY QUERIES ====================

export async function queryTherapyById(id: string) {
  const query = 'SELECT * FROM therapies WHERE id = $1 LIMIT 1';
  console.log('🔍 Looking for therapy with id:', id);
  const result = await pool.query(query, [id]);
  if (result.rows.length > 0) {
    console.log('✅ Therapy found:', result.rows[0].title);
    return result.rows[0];
  }
  console.log('⚠️ No therapy found with that id');
  return null;
}

export async function queryTherapiesByGuideId(guideId: string) {
  const query = 'SELECT * FROM therapies WHERE guide_id = $1 ORDER BY updated_at DESC';
  console.log('🔍 Looking for therapies by guide:', guideId);
  const result = await pool.query(query, [guideId]);
  console.log(`✅ Found ${result.rows.length} therapies for guide`);
  return result.rows;
}

export async function createTherapyDirectly(therapyData: any) {
  const query = `
    INSERT INTO therapies (
      guide_id, guide_name, guide_photo_url, country, category, title, slug,
      description, type, duration, price, currency, location, language,
      is_published, approval_status, video_url, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW()
    ) RETURNING *
  `;
  
  console.log('📝 Creating therapy:', therapyData.title);
  
  const result = await pool.query(query, [
    therapyData.guideId,
    therapyData.guideName,
    therapyData.guidePhotoUrl || null,
    therapyData.country,
    therapyData.category || 'ceremonias',
    therapyData.title,
    therapyData.slug,
    therapyData.description || null,
    therapyData.type,
    therapyData.duration || null,
    therapyData.price || null,
    therapyData.currency || 'USD',
    therapyData.location || null,
    therapyData.language || 'es',
    therapyData.published || false,
    therapyData.approvalStatus || 'pending',
    therapyData.videoUrl || null
  ]);
  
  if (result.rows.length > 0) {
    console.log('✅ Therapy created successfully:', result.rows[0].title);
    return result.rows[0];
  }
  
  throw new Error('Failed to create therapy');
}

export async function deleteTherapyDirectly(id: string) {
  const query = 'DELETE FROM therapies WHERE id = $1';
  console.log('🗑️ Deleting therapy:', id);
  await pool.query(query, [id]);
  console.log('✅ Therapy deleted successfully');
}

// ==================== GUIDE QUERIES ====================

export async function queryGuideById(id: string) {
  const query = 'SELECT * FROM guides WHERE id = $1 LIMIT 1';
  console.log('🔍 Looking for guide with id:', id);
  const result = await pool.query(query, [id]);
  if (result.rows.length > 0) {
    console.log('✅ Guide found:', result.rows[0].full_name);
    return result.rows[0];
  }
  console.log('⚠️ No guide found with that id');
  return null;
}

export async function queryAllGuides() {
  const query = 'SELECT * FROM guides ORDER BY created_at DESC';
  console.log('🔍 Fetching all guides...');
  const result = await pool.query(query);
  console.log(`✅ Found ${result.rows.length} guides`);
  return result.rows;
}

export async function updateGuideDirectly(id: string, updates: Record<string, any>) {
  console.log('📝 Updating guide:', id);
  
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;
  
  const fieldMap: Record<string, string> = {
    fullName: 'full_name',
    profilePhotoUrl: 'profile_photo_url',
    presentationVideoUrl: 'presentation_video_url',
    primarySpecialty: 'primary_specialty',
    verificationStatus: 'verification_status',
    verificationDocuments: 'verification_documents',
    verificationNotes: 'verification_notes',
    activeTherapies: 'active_therapies',
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
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  
  const result = await pool.query(query, values);
  
  if (result.rows.length > 0) {
    console.log('✅ Guide updated successfully:', result.rows[0].full_name);
    return result.rows[0];
  }
  
  throw new Error('Guide not found or update failed');
}

export async function queryFeaturedTherapies(limit: number = 6) {
  const query = `
    SELECT * FROM therapies 
    WHERE is_published = true 
    ORDER BY created_at DESC 
    LIMIT $1
  `;
  console.log('🔍 Fetching featured therapies, limit:', limit);
  const result = await pool.query(query, [limit]);
  console.log(`✅ Found ${result.rows.length} featured therapies`);
  return result.rows;
}

// ==================== ADMIN SETTINGS ====================

export async function updateAdminSettingsDirectly(id: string, data: Record<string, any>) {
  const query = `
    UPDATE admin_settings 
    SET admin_name = $1, admin_whatsapp = $2, admin_whatsapp_mexico = $3, paypal_email = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `;
  console.log('⚙️ Updating admin settings...');
  const result = await pool.query(query, [
    data.adminName,
    data.adminWhatsapp,
    data.adminWhatsappMexico || null,
    data.paypalEmail || null,
    id
  ]);
  
  if (result.rows.length > 0) {
    console.log('✅ Admin settings updated');
    return result.rows[0];
  }
  
  throw new Error('Admin settings not found');
}

export async function createAdminSettingsDirectly(data: Record<string, any>) {
  const query = `
    INSERT INTO admin_settings (admin_name, admin_whatsapp, admin_whatsapp_mexico, paypal_email, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *
  `;
  console.log('⚙️ Creating admin settings...');
  const result = await pool.query(query, [
    data.adminName,
    data.adminWhatsapp,
    data.adminWhatsappMexico || null,
    data.paypalEmail || null
  ]);
  
  if (result.rows.length > 0) {
    console.log('✅ Admin settings created');
    return result.rows[0];
  }
  
  throw new Error('Failed to create admin settings');
}
