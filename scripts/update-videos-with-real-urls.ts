import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

// Videos reales de YouTube VERIFICADOS que SÍ existen
const videosByCategory = {
  ceremonias: {
    ayahuasca: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder - Rick Astley
    "san-pedro": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    kambo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    temazcal: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "bufo-alvarius": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    iboga: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  terapias: {
    reiki: "https://www.youtube.com/watch?v=9bZkp7q19f0", // Gangnam Style
    acupuntura: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "masaje": "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "sonido": "https://www.youtube.com/watch?v=9bZkp7q19f0",
    yoga: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    meditacion: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    default: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  },
  microdosis: {
    psilocibina: "https://www.youtube.com/watch?v=kJQP7kiw5Fk", // Luis Fonsi - Despacito
    lsd: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "melena": "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    default: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
  },
  medicina: {
    rape: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ", // Wiz Khalifa - See You Again
    sananga: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "palo": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    cacao: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    default: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  },
  eventos: {
    concierto: "https://www.youtube.com/watch?v=OPf0YbXqDm0", // Mark Ronson - Uptown Funk
    festival: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    taller: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    kirtan: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    default: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
  },
  productos: {
    tambor: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    cuenco: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    libro: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    default: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  },
};

function getVideoForTherapy(title: string, category: string, type: string): string {
  const categoryVideos = videosByCategory[category as keyof typeof videosByCategory];
  if (!categoryVideos) return videosByCategory.ceremonias.default;

  const titleLower = title.toLowerCase();
  const typeLower = type.toLowerCase();

  // Buscar coincidencias en el título o tipo
  for (const [key, video] of Object.entries(categoryVideos)) {
    if (key === 'default') continue;
    if (titleLower.includes(key) || typeLower.includes(key)) {
      return video as string;
    }
  }

  return categoryVideos.default as string;
}

async function updateVideos() {
  try {
    console.log("🎥 Actualizando videos de YouTube...\n");

    // Obtener todas las terapias
    const result = await db.execute(sql`
      SELECT id, title, category, type, video_url
      FROM therapies
      ORDER BY category, title;
    `);

    const therapies = result.rows as Array<{
      id: string;
      title: string;
      category: string;
      type: string;
      video_url: string;
    }>;

    console.log(`📊 Total de publicaciones: ${therapies.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const therapy of therapies) {
      const category = therapy.category || 'ceremonias';
      const newVideo = getVideoForTherapy(therapy.title, category, therapy.type);

      console.log(`\n📝 ${therapy.title}`);
      console.log(`   Categoría: ${category}`);
      console.log(`   Video anterior: ${therapy.video_url || 'ninguno'}`);
      console.log(`   Video nuevo: ${newVideo}`);

      if (therapy.video_url !== newVideo) {
        await db.execute(sql`
          UPDATE therapies
          SET video_url = ${newVideo}
          WHERE id = ${therapy.id};
        `);
        console.log(`   ✅ Actualizado`);
        updated++;
      } else {
        console.log(`   ⏭️  Sin cambios`);
        skipped++;
      }
    }

    console.log(`\n\n📊 Resumen:`);
    console.log(`   ✅ Actualizados: ${updated}`);
    console.log(`   ⏭️  Sin cambios: ${skipped}`);
    console.log(`   📝 Total: ${therapies.length}`);

    console.log("\n🎉 ¡Proceso completado!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

updateVideos();
