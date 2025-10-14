import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

// Simple detector: use YouTube oEmbed to verify if a YouTube URL exists/public
async function isYouTubeUrlValid(url?: string | null): Promise<boolean> {
  if (!url || url.trim() === "") return false;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isYouTube = host.includes("youtube.com") || host.includes("youtu.be");

    if (!isYouTube) {
      // For non-YouTube links, do a simple HEAD request
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    }

    // YouTube: hit oEmbed, which returns 200 for valid/embeddable videos
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembed, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

// Curated lists (more topic-relevant) adapted from scripts/update-unique-videos.ts
const topicVideos = {
  ceremonias: {
    ayahuasca: "https://www.youtube.com/watch?v=P0pjAp7hRzE",
    "san pedro": "https://www.youtube.com/watch?v=YVg6CtmVOr0",
    "san-pedro": "https://www.youtube.com/watch?v=YVg6CtmVOr0",
    kambo: "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    wachuma: "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    rapé: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    rape: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    cacao: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    temazcal: "https://www.youtube.com/watch?v=xLb9jPym-OM",
    default: "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
  },
  terapias: {
    reiki: "https://www.youtube.com/watch?v=9fInAjUA4Hs",
    masaje: "https://www.youtube.com/watch?v=6v5VahaEL7s",
    acupuntura: "https://www.youtube.com/watch?v=nM-ySWyID9o",
    sonido: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    breathwork: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    ayurveda: "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    craniosacral: "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
    eft: "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    reflexologia: "https://www.youtube.com/watch?v=zzWr4WG8UKQ",
    hipnosis: "https://www.youtube.com/watch?v=xLb9jPym-OM",
    aromaterapia: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    default: "https://www.youtube.com/watch?v=C5-jxJq5FZk",
  },
  microdosis: {
    psilocibina: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
    lsd: "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "melena de leon": "https://www.youtube.com/watch?v=zzWr4WG8UKQ",
    "lion": "https://www.youtube.com/watch?v=zzWr4WG8UKQ",
    default: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
  },
  medicina: {
    rape: "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    sananga: "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    "palo santo": "https://www.youtube.com/watch?v=xLb9jPym-OM",
    cacao: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    default: "https://www.youtube.com/watch?v=wCcLWC72-MQ",
  },
  eventos: {
    concierto: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    festival: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    taller: "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
    kirtan: "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    default: "https://www.youtube.com/watch?v=nM-ySWyID9o",
  },
  productos: {
    tambor: "https://www.youtube.com/watch?v=xLb9jPym-OM",
    cuenco: "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    cacao: "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    default: "https://www.youtube.com/watch?v=bQzLyRhKAYs",
  },
} as const;

function pickRelevantVideo(title: string, category?: string | null, type?: string | null): string {
  const cat = (category || "").toLowerCase() as keyof typeof topicVideos;
  const dict = topicVideos[cat] || topicVideos.ceremonias;
  const haystack = `${title} ${type || ""}`.toLowerCase();

  // Try exact keyword match
  for (const [k, url] of Object.entries(dict)) {
    if (k === "default") continue;
    if (haystack.includes(k)) return url as string;
  }
  return (dict as any).default as string;
}

async function main() {
  console.log("🎥 Buscando videos rotos y reemplazando solo esos...\n");

  // Fetch all therapies with current video_url
  const result = await db.execute(sql`
    SELECT id, title, category, type, video_url
    FROM therapies
    ORDER BY updated_at DESC
  `);

  const rows = result.rows as Array<{
    id: string;
    title: string;
    category: string | null;
    type: string | null;
    video_url: string | null;
  }>;

  let total = rows.length;
  let broken = 0;
  let fixed = 0;
  let skipped = 0;

  for (const t of rows) {
    const ok = await isYouTubeUrlValid(t.video_url);
    if (!ok) {
      broken++;
      const replacement = pickRelevantVideo(t.title, t.category, t.type);
      // Double-check replacement is valid to avoid writing another broken link
      const replacementOk = await isYouTubeUrlValid(replacement);
      if (!replacementOk) {
        console.warn(`⚠️ Reemplazo inválido para '${t.title}'. Saltando.`);
        skipped++;
        continue;
      }

      console.log(`🔁 ${t.title}`);
      console.log(`   Antiguo: ${t.video_url || "(vacío/roto)"}`);
      console.log(`   Nuevo:   ${replacement}`);

      await db.execute(sql`
        UPDATE therapies
        SET video_url = ${replacement}
        WHERE id = ${t.id}
      `);
      fixed++;
    } else {
      skipped++;
    }
  }

  console.log("\n📊 Resumen");
  console.log(`   Total:   ${total}`);
  console.log(`   Rotos:   ${broken}`);
  console.log(`   Fixes:   ${fixed}`);
  console.log(`   Skipped: ${skipped}`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
