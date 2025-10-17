import pg from 'pg';
const { Pool } = pg;

// Check if DATABASE_URL indicates SSL is needed
const needsSSL = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(needsSSL && { ssl: { rejectUnauthorized: false } })
});

async function checkTherapy() {
  try {
    const therapyResult = await pool.query(
      'SELECT id, title, guide_id, guide_name FROM therapies WHERE id = $1',
      ['e4b06fcc-b0fa-4697-9138-f7d20a978a74']
    );
    
    console.log('\n=== THERAPY INFO ===');
    console.log('Therapy:', therapyResult.rows[0]);
    
    const guideResult = await pool.query(
      'SELECT id, full_name, email FROM guides WHERE id = $1',
      [therapyResult.rows[0].guide_id]
    );
    
    console.log('\n=== OWNER INFO ===');
    console.log('Owner:', guideResult.rows[0]);
    
    const currentGuideResult = await pool.query(
      'SELECT id, full_name, email FROM guides WHERE id = $1',
      ['fc00f507-a4e5-48dd-b9e1-850677b5fc76']
    );
    
    console.log('\n=== LOGGED IN GUIDE ===');
    console.log('Current Guide:', currentGuideResult.rows[0]);
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

checkTherapy();
