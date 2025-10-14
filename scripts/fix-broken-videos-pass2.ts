import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function isYouTubeUrlValid(url?: string | null): Promise<boolean> {
  if (!url || url.trim() === "") return false;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isYouTube = host.includes("youtube.com") || host.includes("youtu.be");

    if (!isYouTube) {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    }

    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembed, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

// Whitelist de videos que pasaron en la primera pasada (oEmbed OK)
// Distribuidos por categoría para mantener relevancia general.
const whitelistByCategory: Record<string, string[]> = {
  ceremonias: [
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
  ],
  terapias: [
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
  ],
  microdosis: [
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
  ],
  medicina: [
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
  ],
  eventos: [
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
  ],
  productos: [
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
  ],
};

function pickFromWhitelist(category?: string | null, idx?: number): string | null {
  const cat = (category || "").toLowerCase();
  const pool = whitelistByCategory[cat] || whitelistByCategory["terapias"];
  if (!pool || pool.length === 0) return null;
  if (typeof idx === "number") return pool[idx % pool.length];
  return pool[0];
}

async function main() {
  console.log("🎬 Segunda pasada: reemplazo con whitelist por categoría (solo rotos)\n");

  const result = await db.execute(sql`
    SELECT id, title, category, type, video_url
    FROM therapies
    ORDER BY category, title
  `);

  const rows = result.rows as Array<{
    id: string;
    title: string;
    category: string | null;
    type: string | null;
    video_url: string | null;
  }>;

  let total = 0;
  let broken = 0;
  let fixed = 0;
  let skipped = 0;

  // Para repartir videos en la misma categoría, usamos un índice
  const counters: Record<string, number> = {};

  for (const t of rows) {
    total++;
    const ok = await isYouTubeUrlValid(t.video_url);
    if (ok) { skipped++; continue; }

    broken++;
    const cat = (t.category || '').toLowerCase();
    counters[cat] = (counters[cat] || 0) + 1;
    const candidate = pickFromWhitelist(cat, counters[cat] - 1);

    if (!candidate) { skipped++; continue; }

    const candidateOk = await isYouTubeUrlValid(candidate);
    if (!candidateOk) { skipped++; continue; }

    console.log(`🔁 ${t.title}\n   Antiguo: ${t.video_url || '(vacío/roto)'}\n   Nuevo:   ${candidate}`);
    await db.execute(sql`
      UPDATE therapies
      SET video_url = ${candidate}
      WHERE id = ${t.id}
    `);
    fixed++;
  }

  console.log("\n📊 Resumen (Segunda pasada)");
  console.log(`   Total:   ${total}`);
  console.log(`   Rotos:   ${broken}`);
  console.log(`   Fixes:   ${fixed}`);
  console.log(`   Skipped: ${skipped}`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
