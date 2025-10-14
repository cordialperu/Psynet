import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function addVideoUrls() {
  try {
    console.log("🎥 Adding video URLs to therapies...");
    
    // Primero agregar la columna si no existe
    await sql`
      ALTER TABLE therapies 
      ADD COLUMN IF NOT EXISTS video_url TEXT
    `;
    console.log("✅ Column video_url added");
    
    // Agregar videos de YouTube a cada terapia
    const videoUrls = [
      { slug: 'ceremonia-ayahuasca-valle-sagrado', video: 'https://www.youtube.com/watch?v=P0pjIz2QSYE' },
      { slug: 'retiro-san-pedro-machu-picchu', video: 'https://www.youtube.com/watch?v=gDDQ2rAWLAc' },
      { slug: 'ceremonia-kambo-medicina-rana', video: 'https://www.youtube.com/watch?v=C_ijc7A5oAc' },
      { slug: 'retiro-rape-sananga', video: 'https://www.youtube.com/watch?v=nqiVvOXv5AA' },
      { slug: 'ceremonia-cacao-sagrado', video: 'https://www.youtube.com/watch?v=kELDEdMbkyg' },
      { slug: 'temazcal-ceremonia-sudoracion', video: 'https://www.youtube.com/watch?v=_bVT3ul349A' },
      { slug: 'retiro-bufo-alvarius', video: 'https://www.youtube.com/watch?v=DXHaCEhOiWU' },
      { slug: 'dieta-amazonica-plantas-maestras', video: 'https://www.youtube.com/watch?v=QLjJGUOqMRE' },
      { slug: 'ceremonia-hongos-psilocibios', video: 'https://www.youtube.com/watch?v=81-v8ePXPd4' },
      { slug: 'retiro-respiracion-holotropica', video: 'https://www.youtube.com/watch?v=nzCaZQqAs9I' },
      { slug: 'ceremonia-tabaco-sagrado', video: 'https://www.youtube.com/watch?v=P0pjIz2QSYE' },
      { slug: 'retiro-meditacion-vipassana', video: 'https://www.youtube.com/watch?v=cz7QHNvNFfA' },
      { slug: 'ceremonia-wachuma-san-pedro', video: 'https://www.youtube.com/watch?v=gDDQ2rAWLAc' },
      { slug: 'bano-flores-limpieza-energetica', video: 'https://www.youtube.com/watch?v=nqiVvOXv5AA' },
      { slug: 'ceremonia-luna-llena-cacao', video: 'https://www.youtube.com/watch?v=kELDEdMbkyg' },
    ];
    
    for (const item of videoUrls) {
      await sql`
        UPDATE therapies 
        SET video_url = ${item.video}
        WHERE slug = ${item.slug}
      `;
      console.log(`✅ Updated ${item.slug}`);
    }
    
    console.log("\n🎉 Done! All therapies now have video URLs");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addVideoUrls();
