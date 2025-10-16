// Publish all therapies
import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = "postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function publishAll() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('🔍 Checking current status...\n');
    
    const before = await client.query(`
      SELECT 
        COUNT(*) FILTER (WHERE is_published = true) as published_count,
        COUNT(*) FILTER (WHERE is_published = false OR is_published IS NULL) as unpublished_count,
        COUNT(*) as total_count
      FROM therapies
    `);
    
    console.log(`📊 Before:`);
    console.log(`  Published: ${before.rows[0].published_count}`);
    console.log(`  Unpublished: ${before.rows[0].unpublished_count}`);
    console.log(`  Total: ${before.rows[0].total_count}\n`);
    
    console.log('🚀 Publishing all therapies...\n');
    
    const result = await client.query(`
      UPDATE therapies 
      SET is_published = true, updated_at = NOW()
      WHERE is_published = false OR is_published IS NULL
      RETURNING id, title, is_published
    `);
    
    console.log(`✅ Updated ${result.rows.length} therapies!\n`);
    
    if (result.rows.length > 0) {
      console.log('Updated therapies:');
      result.rows.slice(0, 5).forEach(t => {
        console.log(`  ✅ ${t.title}`);
      });
      if (result.rows.length > 5) {
        console.log(`  ... and ${result.rows.length - 5} more`);
      }
    }
    
    const after = await client.query(`
      SELECT COUNT(*) as count FROM therapies WHERE is_published = true
    `);
    
    console.log(`\n🎉 Now ${after.rows[0].count} therapies are published!`);

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
  }
}

publishAll();
