import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🔍 Revisando publicaciones de Perú...\n");
  
  // Ver estadísticas generales
  const totalPE = await sql`SELECT COUNT(*)::int AS total FROM therapies WHERE country = 'PE'`;
  console.log(`📊 Total productos peruanos: ${(totalPE[0] as any).total}`);
  
  // Ver por categoría
  const byCategory = await sql`
    SELECT 
      category, 
      COUNT(*)::int as total,
      COUNT(CASE WHEN approval_status = 'pending' THEN 1 END)::int as pending,
      COUNT(CASE WHEN approval_status = 'approved' THEN 1 END)::int as approved
    FROM therapies 
    WHERE country = 'PE' 
    GROUP BY category 
    ORDER BY category
  `;
  
  console.log("\n📋 Por categoría:");
  byCategory.forEach((cat: any) => {
    console.log(`  ${cat.category}: ${cat.total} total (${cat.pending} pendientes, ${cat.approved} aprobadas)`);
  });
  
  // Ver productos pendientes (no los tocaremos)
  const pending = await sql`
    SELECT title, category, approval_status 
    FROM therapies 
    WHERE country = 'PE' AND approval_status = 'pending' 
    ORDER BY category, title
  `;
  
  console.log(`\n⏳ Productos pendientes (${pending.length}) - NO los modificaremos:`);
  pending.forEach((p: any) => {
    console.log(`  • ${p.title} (${p.category})`);
  });
  
  // Ver productos aprobados por categoría (estos los actualizaremos)
  console.log("\n✅ Productos aprobados por categoría (estos se actualizarán):");
  for (const cat of byCategory) {
    const approved = await sql`
      SELECT title, id
      FROM therapies 
      WHERE country = 'PE' AND category = ${cat.category} AND approval_status = 'approved'
      ORDER BY title
      LIMIT 10
    `;
    
    console.log(`\n--- ${cat.category} (${cat.approved} aprobados) ---`);
    approved.forEach((p: any) => {
      console.log(`  • ${p.title}`);
    });
  }
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});