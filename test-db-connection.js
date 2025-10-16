// Test database connection
import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = "postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Database connected successfully!\n');

    // Check therapies table
    const result = await client.query('SELECT COUNT(*) as count FROM therapies');
    const count = result.rows[0].count;
    console.log(`📊 Total therapies in database: ${count}\n`);

    // Get sample therapies
    const therapies = await client.query('SELECT id, title, country, category FROM therapies LIMIT 5');
    console.log('📋 Sample therapies:');
    therapies.rows.forEach(t => {
      console.log(`  - ${t.title} (${t.country}, ${t.category})`);
    });

    await client.end();
    console.log('\n✅ Test completed successfully!');
    console.log('\n🚀 Your database has data! Now add DATABASE_URL to Render.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    await client.end();
  }
}

testConnection();
