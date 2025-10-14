import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("=== CATEGORÍAS DISPONIBLES EN MX ===");
  const categories = await sql`SELECT DISTINCT category FROM therapies WHERE country = 'MX' ORDER BY category`;
  console.log(categories);
  
  console.log("\n=== PRODUCTOS POR CATEGORÍA ===");
  for (const cat of categories) {
    const count = await sql`SELECT COUNT(*)::int AS c FROM therapies WHERE country = 'MX' AND category = ${(cat as any).category}`;
    console.log(`${(cat as any).category}: ${(count[0] as any).c} productos`);
  }

  console.log("\n=== MUESTRA DE PRODUCTOS POR CATEGORÍA ===");
  for (const cat of categories) {
    console.log(`\n--- ${(cat as any).category} ---`);
    const products = await sql`SELECT title, location, price FROM therapies WHERE country = 'MX' AND category = ${(cat as any).category} LIMIT 3`;
    products.forEach((p: any) => console.log(`• ${p.title} - ${p.location} - $${p.price}`));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });