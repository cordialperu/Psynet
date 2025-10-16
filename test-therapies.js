// Test therapies query
import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = "postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function testTherapies() {
  console.log('🔍 Testing therapies query...\n');
  
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Database connected!\n');

    // Query published therapies
    const result = await client.query(`
      SELECT id, title, country, category, published, language 
      FROM therapies 
      WHERE published = true 
      ORDER BY updated_at DESC 
      LIMIT 10
    `);

    console.log(`📊 Published therapies: ${result.rows.length}\n`);
    
    if (result.rows.length > 0) {
      console.log('✅ Sample published therapies:');
      result.rows.forEach((t, i) => {
        console.log(`  ${i+1}. ${t.title}`);
        console.log(`     Country: ${t.country}, Category: ${t.category}, Language: ${t.language}`);
      });
    } else {
      console.log('⚠️ No published therapies found!');
      console.log('Checking all therapies...\n');
      
      const allResult = await client.query(`
        SELECT id, title, country, category, published, language 
        FROM therapies 
        ORDER BY updated_at DESC 
        LIMIT 10
      `);
      
      console.log(`📊 Total therapies (any status): ${allResult.rows.length}\n`);
      allResult.rows.forEach((t, i) => {
        console.log(`  ${i+1}. ${t.title}`);
        console.log(`     Published: ${t.published}, Country: ${t.country}, Language: ${t.language}`);
      });
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
  }
}

testTherapies();
