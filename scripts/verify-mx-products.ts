import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🔍 Verificando productos mexicanos en la base de datos...");
  
  // Verificar el total de productos mexicanos
  const totalMX = await sql`SELECT COUNT(*)::int AS total FROM therapies WHERE country = 'MX'`;
  console.log(`\n📊 Total productos mexicanos: ${(totalMX[0] as any).total}`);
  
  // Verificar productos por país
  const byCountry = await sql`SELECT country, COUNT(*)::int AS count FROM therapies GROUP BY country ORDER BY country`;
  console.log("\n🌍 Productos por país:");
  byCountry.forEach((row: any) => console.log(`- ${row.country}: ${row.count} productos`));
  
  // Verificar algunos productos mexicanos específicos
  const sampleMX = await sql`
    SELECT title, location, price, currency, is_published, approval_status 
    FROM therapies 
    WHERE country = 'MX' 
    ORDER BY created_at DESC 
    LIMIT 5
  `;
  
  console.log("\n🇲🇽 Muestra de productos mexicanos:");
  sampleMX.forEach((product: any) => {
    console.log(`- ${product.title}`);
    console.log(`  📍 ${product.location}`);
    console.log(`  💰 $${product.price} ${product.currency}`);
    console.log(`  📋 Published: ${product.is_published}, Status: ${product.approval_status}`);
    console.log("");
  });
  
  // Verificar productos publicados específicamente
  const publishedMX = await sql`
    SELECT COUNT(*)::int AS count 
    FROM therapies 
    WHERE country = 'MX' AND is_published = true AND approval_status = 'approved'
  `;
  console.log(`✅ Productos mexicanos publicados y aprobados: ${(publishedMX[0] as any).count}`);
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});