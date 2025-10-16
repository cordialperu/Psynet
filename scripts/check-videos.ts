import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,  // Neon pooler doesn't need SSL in connection string
  max: 1
});

async function checkVideos() {
  try {
    console.log('🔍 Checking for therapies with video URLs...\n');
    
    const result = await pool.query(
      `SELECT title, video_url, category, country 
       FROM therapies 
       WHERE video_url IS NOT NULL AND video_url != '' 
       ORDER BY updated_at DESC 
       LIMIT 10`
    );
    
    if (result.rows.length === 0) {
      console.log('❌ No therapies found with video URLs');
      console.log('\n🔍 Checking total therapies...');
      const total = await pool.query('SELECT COUNT(*) FROM therapies');
      console.log(`Total therapies in database: ${total.rows[0].count}`);
    } else {
      console.log(`✅ Found ${result.rows.length} therapies with videos:\n`);
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.title}`);
        console.log(`   Category: ${row.category}`);
        console.log(`   Country: ${row.country}`);
        console.log(`   Video URL: ${row.video_url}\n`);
      });
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkVideos();
