import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

// Videos de YouTube de ~1 minuto para cada categoría
const videosByCategory = {
  terapias: [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - reemplazar con videos reales
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=y6120QOlsfU",
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    "https://www.youtube.com/watch?v=hT_nvWreIhg",
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "https://www.youtube.com/watch?v=Uj1ykZWtPYI",
    "https://www.youtube.com/watch?v=FTQbiNvZqaY",
  ],
  microdosis: [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=y6120QOlsfU",
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    "https://www.youtube.com/watch?v=hT_nvWreIhg",
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "https://www.youtube.com/watch?v=Uj1ykZWtPYI",
    "https://www.youtube.com/watch?v=FTQbiNvZqaY",
  ],
  medicina: [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=y6120QOlsfU",
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    "https://www.youtube.com/watch?v=hT_nvWreIhg",
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "https://www.youtube.com/watch?v=Uj1ykZWtPYI",
    "https://www.youtube.com/watch?v=FTQbiNvZqaY",
  ],
  eventos: [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=y6120QOlsfU",
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    "https://www.youtube.com/watch?v=hT_nvWreIhg",
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "https://www.youtube.com/watch?v=Uj1ykZWtPYI",
    "https://www.youtube.com/watch?v=FTQbiNvZqaY",
  ],
  productos: [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=y6120QOlsfU",
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    "https://www.youtube.com/watch?v=hT_nvWreIhg",
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "https://www.youtube.com/watch?v=Uj1ykZWtPYI",
    "https://www.youtube.com/watch?v=FTQbiNvZqaY",
  ],
};

async function addVideosToAll() {
  try {
    console.log("🎥 Agregando videos a todos los elementos...\n");

    // Obtener todas las terapias sin video por categoría
    for (const [category, videos] of Object.entries(videosByCategory)) {
      console.log(`📹 Procesando categoría: ${category}`);
      
      const result = await db.execute(sql`
        SELECT id, title 
        FROM therapies 
        WHERE category = ${category}
        AND (video_url IS NULL OR video_url = '')
        ORDER BY created_at DESC
        LIMIT 10
      `);

      const items = result.rows;
      console.log(`   Encontrados: ${items.length} elementos sin video`);

      for (let i = 0; i < items.length && i < videos.length; i++) {
        const item = items[i];
        const videoUrl = videos[i];

        await db.execute(sql`
          UPDATE therapies
          SET video_url = ${videoUrl}
          WHERE id = ${item.id}
        `);

        console.log(`   ✅ Video agregado a: ${item.title}`);
      }

      console.log(`✅ Categoría ${category} completada\n`);
    }

    // Estadísticas finales
    console.log("📊 Verificando videos agregados:");
    const stats = await db.execute(sql`
      SELECT 
        category,
        COUNT(*) as total,
        COUNT(video_url) as con_video,
        COUNT(*) - COUNT(video_url) as sin_video
      FROM therapies
      WHERE is_published = true
      GROUP BY category
      ORDER BY category
    `);

    console.table(stats.rows);

    console.log("\n✅ Videos agregados exitosamente!");
    console.log("\n📝 Nota importante:");
    console.log("   Los videos son placeholders. Debes reemplazarlos con videos reales de YouTube");
    console.log("   de máximo 1 minuto que expliquen cada servicio/producto.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error agregando videos:", error);
    process.exit(1);
  }
}

addVideosToAll();
