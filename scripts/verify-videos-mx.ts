import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🔍 Verificando videos de YouTube en productos mexicanos...\n");
  
  const products = await sql`
    SELECT title, slug, video_url, category
    FROM therapies 
    WHERE country = 'MX' 
    ORDER BY category, title
  `;
  
  console.log(`📊 Total productos verificados: ${products.length}\n`);
  
  let currentCategory = '';
  products.forEach((product: any, index) => {
    if (product.category !== currentCategory) {
      currentCategory = product.category;
      console.log(`\n🎯 === ${currentCategory.toUpperCase()} ===`);
    }
    
    const videoIcon = product.video_url ? '🎥' : '❌';
    console.log(`${videoIcon} ${product.title}`);
    if (product.video_url) {
      console.log(`   🔗 ${product.video_url}`);
    }
  });
  
  // Estadísticas por categoría
  const stats = await sql`
    SELECT 
      category,
      COUNT(*)::int as total,
      COUNT(video_url)::int as with_videos
    FROM therapies 
    WHERE country = 'MX' 
    GROUP BY category
    ORDER BY category
  `;
  
  console.log("\n📈 ESTADÍSTICAS POR CATEGORÍA:");
  stats.forEach((stat: any) => {
    const percentage = Math.round((stat.with_videos / stat.total) * 100);
    console.log(`${stat.category}: ${stat.with_videos}/${stat.total} productos (${percentage}%)`);
  });
  
  const totalWithVideos = await sql`
    SELECT COUNT(*)::int as count 
    FROM therapies 
    WHERE country = 'MX' AND video_url IS NOT NULL AND video_url != ''
  `;
  
  console.log(`\n✅ RESUMEN FINAL: ${(totalWithVideos[0] as any).count}/20 productos mexicanos tienen videos de YouTube`);
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});