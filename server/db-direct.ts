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
