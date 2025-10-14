import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🔍 Revisando todas las categorías en el sistema...\n");
  
  // Obtener todas las categorías que existen en el sistema (de todos los países)
  const allCategories = await sql`
    SELECT DISTINCT category 
    FROM therapies 
    ORDER BY category
  `;
  
  console.log("📋 TODAS LAS CATEGORÍAS EN EL SISTEMA:");
  allCategories.forEach((cat: any) => console.log(`- ${cat.category}`));
  
  // Ver distribución por país
  const distributionByCountry = await sql`
    SELECT 
      country,
      category, 
      COUNT(*)::int as count
    FROM therapies 
    GROUP BY country, category
    ORDER BY country, category
  `;
  
  console.log("\n🌍 DISTRIBUCIÓN POR PAÍS Y CATEGORÍA:");
  let currentCountry = '';
  distributionByCountry.forEach((row: any) => {
    if (row.country !== currentCountry) {
      currentCountry = row.country;
      console.log(`\n🏃 ${row.country}:`);
    }
    console.log(`  - ${row.category}: ${row.count} productos`);
  });
  
  // Identificar categorías que solo existen en PE pero no en MX
  const peCategories = await sql`
    SELECT DISTINCT category 
    FROM therapies 
    WHERE country = 'PE'
  `;
  
  const mxCategories = await sql`
    SELECT DISTINCT category 
    FROM therapies 
    WHERE country = 'MX'
  `;
  
  const mxCategoryList = mxCategories.map((cat: any) => cat.category);
  const missingInMX = peCategories.filter((peCat: any) => 
    !mxCategoryList.includes(peCat.category)
  );
  
  console.log("\n❌ CATEGORÍAS QUE FALTAN EN MÉXICO:");
  if (missingInMX.length === 0) {
    console.log("✅ No hay categorías faltantes en México");
  } else {
    missingInMX.forEach((cat: any) => console.log(`- ${cat.category}`));
  }
  
  // Mostrar algunas muestras de productos de PE para referencia
  console.log("\n📘 MUESTRA DE PRODUCTOS DE PERÚ POR CATEGORÍA:");
  for (const cat of missingInMX) {
    const samples = await sql`
      SELECT title, category, type 
      FROM therapies 
      WHERE country = 'PE' AND category = ${cat.category}
      LIMIT 3
    `;
    
    console.log(`\n🇵🇪 ${cat.category}:`);
    samples.forEach((sample: any) => {
      console.log(`  • ${sample.title} (${sample.type})`);
    });
  }
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});