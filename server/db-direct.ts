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
