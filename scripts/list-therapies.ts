import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function list() {
  const therapies = await sql`
    SELECT id, title, slug, location, price, is_published
    FROM therapies
    ORDER BY created_at DESC
    LIMIT 20
  `;
  
  console.log(`Found ${therapies.length} therapies:\n`);
  therapies.forEach((t, i) => {
    console.log(`${i + 1}. ${t.title}`);
    console.log(`   Location: ${t.location}`);
    console.log(`   Price: $${t.price}`);
    console.log(`   Published: ${t.is_published}`);
    console.log(`   Slug: ${t.slug}\n`);
  });
  
  process.exit(0);
}

list();
