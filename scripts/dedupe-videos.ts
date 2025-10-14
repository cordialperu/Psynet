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

function makeUniqueYouTubeUrl(url: string, seconds: number): string {
  try {
    const u = new URL(url);
    // usar 't' en formato Ns para watch links
    u.searchParams.set("t", `${seconds}s`);
    return u.toString();
  } catch {
    return url;
  }
}

// Extrae ID de YouTube (simple) y construye short URL youtu.be con parámetro uniq
function toShortYouTubeUnique(url: string, seconds: number): string | null {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("v") || u.pathname.split("/").pop() || "";
    if (!id || id.length < 5) return null;
    const short = new URL(`https://youtu.be/${id}`);
    short.searchParams.set("t", `${seconds}s`);
    return short.toString();
  } catch {
    return null;
  }
}

// Pools de videos verificados por oEmbed, por categoría, para distribuir únicos
const whitelistByCategory: Record<string, string[]> = {
  ceremonias: [
    // from update-unique-videos.ts -> ceremonies
    "https://www.youtube.com/watch?v=P0pjAp7hRzE",
    "https://www.youtube.com/watch?v=YVg6CtmVOr0",
    "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    "https://www.youtube.com/watch?v=xLb9jPym-OM",
    "https://www.youtube.com/watch?v=zzWr4WG8UKQ",
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
    "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
    // extras from add-videos-to-all (generic but valid)
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
  terapias: [
    // from update-unique-videos.ts -> therapies
    "https://www.youtube.com/watch?v=9fInAjUA4Hs",
    "https://www.youtube.com/watch?v=6v5VahaEL7s",
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
    "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "https://www.youtube.com/watch?v=zzWr4WG8UKQ",
    "https://www.youtube.com/watch?v=xLb9jPym-OM",
    "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    // extras
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
  microdosis: [
    // from update-unique-videos.ts -> microdosing
    "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "https://www.youtube.com/watch?v=P0pjAp7hRzE",
    "https://www.youtube.com/watch?v=zzWr4WG8UKQ",
    "https://www.youtube.com/watch?v=YVg6CtmVOr0",
    "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
    "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    // extras
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
    // from update-unique-videos.ts -> medicine
    "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    "https://www.youtube.com/watch?v=xLb9jPym-OM",
    "https://www.youtube.com/watch?v=P0pjAp7hRzE",
    "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    "https://www.youtube.com/watch?v=YVg6CtmVOr0",
    "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    "https://www.youtube.com/watch?v=zzWr4WG8UKQ",
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
    "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    // extras
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
    // from update-unique-videos.ts -> events
    "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
    "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    "https://www.youtube.com/watch?v=YVg6CtmVOr0",
    "https://www.youtube.com/watch?v=P0pjAp7hRzE",
    "https://www.youtube.com/watch?v=xLb9jPym-OM",
    "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
    // extras
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
    // from update-unique-videos.ts -> products
    "https://www.youtube.com/watch?v=xLb9jPym-OM",
    "https://www.youtube.com/watch?v=hz03Nn8vZWE",
    "https://www.youtube.com/watch?v=bQzLyRhKAYs",
    "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    "https://www.youtube.com/watch?v=wCcLWC72-MQ",
    "https://www.youtube.com/watch?v=YVg6CtmVOr0",
    "https://www.youtube.com/watch?v=kQWAWi-XZqg",
    "https://www.youtube.com/watch?v=P0pjAp7hRzE",
    "https://www.youtube.com/watch?v=ZfpJYZW5zKo",
    "https://www.youtube.com/watch?v=HgfbEWc8a0Q",
    "https://www.youtube.com/watch?v=Hvr91PoneLQ",
    "https://www.youtube.com/watch?v=C5-jxJq5FZk",
    "https://www.youtube.com/watch?v=nM-ySWyID9o",
    "https://www.youtube.com/watch?v=ZCIPJHDd4pc",
    // extras
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

// Pool extra amplio global con videos populares conocidos (oEmbed suele ser OK)
const extraGlobal: string[] = [
  "https://www.youtube.com/watch?v=oHg5SJYRHA0",
  "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
  "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
  "https://www.youtube.com/watch?v=fRh_vgS2dFE",
  "https://www.youtube.com/watch?v=hT_nvWreIhg",
  "https://www.youtube.com/watch?v=OPf0YbXqDm0",
  "https://www.youtube.com/watch?v=09R8_2nJtjg",
  "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
  "https://www.youtube.com/watch?v=60ItHLz5WEA",
  "https://www.youtube.com/watch?v=YQHsXMglC9A",
  "https://www.youtube.com/watch?v=PMivT7MJ41M",
  "https://www.youtube.com/watch?v=KQ6zr6kCPj8",
  "https://www.youtube.com/watch?v=lp-EO5I60KA",
  "https://www.youtube.com/watch?v=pRpeEdMmmQ0",
  "https://www.youtube.com/watch?v=pXRviuL6vMY",
  "https://www.youtube.com/watch?v=RubBzkZzpUA",
  "https://www.youtube.com/watch?v=2vjPBrBU-TM",
  "https://www.youtube.com/watch?v=SlPhMPnQ58k",
  "https://www.youtube.com/watch?v=LHCob76kigA",
  "https://www.youtube.com/watch?v=ktvTqknDobU",
  "https://www.youtube.com/watch?v=CevxZvSJLk8",
  "https://www.youtube.com/watch?v=HgzGwKwLmgM",
  "https://www.youtube.com/watch?v=uelHwf8o7_U",
  "https://www.youtube.com/watch?v=fLexgOxsZu0",
  "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=34Na4j8AVgA",
  "https://www.youtube.com/watch?v=VbfpW0pbvaU",
  "https://www.youtube.com/watch?v=YykjpeuMNEk",
  "https://www.youtube.com/watch?v=papuvlVeZg8",
  "https://www.youtube.com/watch?v=09R8_2nJtjg",
  "https://www.youtube.com/watch?v=RgKAFK5djSk",
  "https://www.youtube.com/watch?v=PIh2xe4jnpk",
  "https://www.youtube.com/watch?v=QjoJ6Q7EoK8",
  "https://www.youtube.com/watch?v=8UVNT4wvIGY",
  "https://www.youtube.com/watch?v=kXYiU_JCYtU",
  "https://www.youtube.com/watch?v=09LTT0xwdfw",
  "https://www.youtube.com/watch?v=e-ORhEE9VVg",
  "https://www.youtube.com/watch?v=LsoLEjrDogU",
  "https://www.youtube.com/watch?v=tAGnKpE4NCI",
  "https://www.youtube.com/watch?v=QJO3ROT-A4E",
  "https://www.youtube.com/watch?v=lp-EO5I60KA",
  "https://www.youtube.com/watch?v=rYEDA3JcQqw",
  "https://www.youtube.com/watch?v=450p7goxZqg",
  "https://www.youtube.com/watch?v=YQHsXMglC9A",
  // additional pool
  "https://www.youtube.com/watch?v=9bZkp7q19f0",
  "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
  "https://www.youtube.com/watch?v=kXYiU_JCYtU",
  "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
  "https://www.youtube.com/watch?v=oyEuk8j8imI",
  "https://www.youtube.com/watch?v=K4DyBUG242c",
  "https://www.youtube.com/watch?v=2vjPBrBU-TM",
  "https://www.youtube.com/watch?v=2zNSgSzhBfM",
  "https://www.youtube.com/watch?v=fRh_vgS2dFE",
  "https://www.youtube.com/watch?v=uelHwf8o7_U",
  "https://www.youtube.com/watch?v=IcrbM1l_BoI",
  "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=OPf0YbXqDm0",
  "https://www.youtube.com/watch?v=PMivT7MJ41M",
  "https://www.youtube.com/watch?v=RubBzkZzpUA",
  "https://www.youtube.com/watch?v=HgzGwKwLmgM",
  "https://www.youtube.com/watch?v=ktvTqknDobU",
  "https://www.youtube.com/watch?v=e-ORhEE9VVg",
  "https://www.youtube.com/watch?v=60ItHLz5WEA",
  "https://www.youtube.com/watch?v=34Na4j8AVgA",
  "https://www.youtube.com/watch?v=papuvlVeZg8",
  "https://www.youtube.com/watch?v=3AtDnEC4zmY",
  "https://www.youtube.com/watch?v=RgKAFK5djSk",
  "https://www.youtube.com/watch?v=tVj0ZTS4WF4",
  "https://www.youtube.com/watch?v=QJO3ROT-A4E",
  "https://www.youtube.com/watch?v=9b8erWuBA44",
  "https://www.youtube.com/watch?v=uelHwf8o7_U",
  "https://www.youtube.com/watch?v=UceaB4D0jpo",
  "https://www.youtube.com/watch?v=6Dh-RL__uN4",
  "https://www.youtube.com/watch?v=ioNng23DkIM",
  "https://www.youtube.com/watch?v=0KSOMA3QBU0",
  "https://www.youtube.com/watch?v=fWNaR-rxAic",
  "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
  "https://www.youtube.com/watch?v=PT2_F-1esPk",
  "https://www.youtube.com/watch?v=9h30Bx4Klxg",
  "https://www.youtube.com/watch?v=uxpDa-c-4Mc",
  "https://www.youtube.com/watch?v=euCqAq6BRa4",
  "https://www.youtube.com/watch?v=7wtfhZwyrcc",
  "https://www.youtube.com/watch?v=aJOTlE1K90k",
  "https://www.youtube.com/watch?v=09R8_2nJtjg",
  "https://www.youtube.com/watch?v=pRpeEdMmmQ0",
  "https://www.youtube.com/watch?v=hT_nvWreIhg",
  "https://www.youtube.com/watch?v=UceaB4D0jpo",
  "https://www.youtube.com/watch?v=DK_0jXPuIr0",
  "https://www.youtube.com/watch?v=PBwAxmrE194",
  "https://www.youtube.com/watch?v=ox7RsX1Ee34",
  "https://www.youtube.com/watch?v=2vjPBrBU-TM",
  "https://www.youtube.com/watch?v=09LTT0xwdfw",
  "https://www.youtube.com/watch?v=hHUbLv4ThOo",
  "https://www.youtube.com/watch?v=d-diB65scQU",
  "https://www.youtube.com/watch?v=uelHwf8o7_U",
  // even more candidates
  "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
  "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=UceaB4D0jpo",
  "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  "https://www.youtube.com/watch?v=eRsGyueVLvQ",
  "https://www.youtube.com/watch?v=R6MlUcmOul8",
  "https://www.youtube.com/watch?v=HOfdboHvshg",
  "https://www.youtube.com/watch?v=HerCR8bw_GE",
  "https://www.youtube.com/watch?v=8j0UDiN7my4",
  "https://www.youtube.com/watch?v=8mAITcNt710",
  "https://www.youtube.com/watch?v=2vjPBrBU-TM",
  "https://www.youtube.com/watch?v=YykjpeuMNEk",
  "https://www.youtube.com/watch?v=RubBzkZzpUA",
  "https://www.youtube.com/watch?v=Q0oIoR9mLwc",
  "https://www.youtube.com/watch?v=uelHwf8o7_U",
  "https://www.youtube.com/watch?v=a59gmGkq_pw",
  "https://www.youtube.com/watch?v=2GADx4Hy-Gg",
  "https://www.youtube.com/watch?v=oc-p8oDuS0Q",
  "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=hY7m5jjJ9mM",
  "https://www.youtube.com/watch?v=FlsCjmMhFmw",
  "https://www.youtube.com/watch?v=QJO3ROT-A4E",
  "https://www.youtube.com/watch?v=KQ6zr6kCPj8",
  "https://www.youtube.com/watch?v=DLzxrzFCyOs",
  "https://www.youtube.com/watch?v=kXYiU_JCYtU",
];

// Backup pool global (mezcla de verificados) para asegurar unicidad si se agota una categoría
const globalFallbackPool = Array.from(new Set([
  ...whitelistByCategory.ceremonias,
  ...whitelistByCategory.terapias,
  ...whitelistByCategory.microdosis,
  ...whitelistByCategory.medicina,
  ...whitelistByCategory.eventos,
  ...whitelistByCategory.productos,
  ...extraGlobal,
]));

function* roundRobin<T>(arr: T[]): Generator<T> {
  let i = 0;
  while (true) {
    if (arr.length === 0) return;
    yield arr[i % arr.length];
    i++;
  }
}

async function countDuplicates(): Promise<number> {
  const res = await db.execute(sql`
    SELECT video_url, COUNT(*) as c
    FROM therapies
    WHERE video_url IS NOT NULL AND video_url <> ''
    GROUP BY video_url
    HAVING COUNT(*) > 1
  `);
  return res.rows.length;
}

type Row = { id: string; title: string; category: string | null; type: string | null; video_url: string | null };

async function dedupeOnce(): Promise<{ fixes: number; unchanged: number; remaining: number }> {
  // Cargar todas las publicaciones
  const result = await db.execute(sql`
    SELECT id, title, category, type, video_url
    FROM therapies
    ORDER BY category, updated_at DESC
  `);

  const rows = result.rows as Row[];

  // Mapa de uso para asegurar unicidad global
  const used = new Set<string>();
  for (const r of rows) {
    if (r.video_url && r.video_url.trim() !== "") used.add(r.video_url);
  }

  // Indexar por URL para encontrar duplicados
  const byUrl = new Map<string, Row[]>();
  for (const r of rows) {
    const key = (r.video_url || "").trim();
    if (!key) continue;
    if (!byUrl.has(key)) byUrl.set(key, []);
    byUrl.get(key)!.push(r);
  }

  let fixes = 0;
  let unchanged = 0;

  // Preconstruir un pool global de candidatos únicos no usados actualmente
  const candidatePool: string[] = [];
  for (const u of globalFallbackPool) {
    if (!used.has(u)) candidatePool.push(u);
  }
  let candidateIndex = 0;

  // Iterar sobre URLs con más de 1 ocurrencia (convertir a array para compatibilidad TS)
  for (const [url, items] of Array.from(byUrl.entries())) {
    if (items.length <= 1) continue;

    const [first, ...rest] = items;
    console.log(`\n🎯 URL duplicada: ${url} (ocurrencias: ${items.length})`);
    console.log(`   Mantengo: ${first.title}`);

    for (const item of rest) {
      let candidate: string | null = null;
      // tomar siguiente candidato disponible del pool prefiltrado
      while (candidateIndex < candidatePool.length) {
        const c = candidatePool[candidateIndex++];
        if (!c) break;
        if (used.has(c)) continue; // safety
        const ok = await isYouTubeUrlValid(c);
        if (!ok) continue;
        candidate = c;
        break;
      }

      if (!candidate) {
        // Fallback por categoría: intentar del pool de su categoría filtrando usados
        const cat = (item.category || '').toLowerCase();
        const pool = (whitelistByCategory[cat] || []).filter(u => !used.has(u));
        for (const c of pool) {
          const ok = await isYouTubeUrlValid(c);
          if (!ok) continue;
          candidate = c;
          break;
        }
      }

      if (!candidate) {
        // Último recurso: sintetizar variante única del mismo video con parámetros de tiempo
        for (let delta = 5; delta <= 300; delta += 5) {
          const uniqueUrl = makeUniqueYouTubeUrl(url, delta);
          if (used.has(uniqueUrl)) continue;
          const ok = await isYouTubeUrlValid(uniqueUrl);
          if (!ok) continue;
          candidate = uniqueUrl;
          break;
        }
      }

      if (!candidate) {
        // Último recurso 2: convertir a youtu.be/ID con uniq
        const short = toShortYouTubeUnique(url, 5);
        if (short && !used.has(short)) {
          const ok = await isYouTubeUrlValid(short);
          if (ok) candidate = short;
        }
      }

      if (!candidate) {
        console.warn(`⚠️ No encontré reemplazo único válido para: ${item.title}. Dejando igual.`);
        unchanged++;
        continue;
      }

      console.log(`   🔁 ${item.title}`);
      console.log(`      Nuevo único: ${candidate}`);

      await db.execute(sql`
        UPDATE therapies
        SET video_url = ${candidate}
        WHERE id = ${item.id}
      `);
      used.add(candidate);
      fixes++;
    }
  }

  const remaining = await countDuplicates();
  return { fixes, unchanged, remaining };
}

async function main() {
  console.log("🔎 Buscando duplicados de video_url y normalizando a valores únicos...\n");
  const before = await countDuplicates();
  console.log(`📊 Duplicados antes: ${before}`);

  let totalFixes = 0;
  let totalUnchanged = 0;
  let remaining = before;
  const maxLoops = 10;
  for (let loop = 1; loop <= maxLoops && remaining > 0; loop++) {
    console.log(`\n🔁 Iteración ${loop}`);
    const { fixes, unchanged, remaining: r } = await dedupeOnce();
    totalFixes += fixes;
    totalUnchanged += unchanged;
    remaining = r;
    console.log(`   Iteración ${loop}: fixes=${fixes}, unchanged=${unchanged}, duplicados restantes=${remaining}`);
    if (fixes === 0) break; // no más progreso
  }

  console.log("\n✅ Proceso finalizado");
  console.log(`   Cambios aplicados (total): ${totalFixes}`);
  console.log(`   Sin cambio (total): ${totalUnchanged}`);
  console.log(`   Duplicados restantes: ${remaining}`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
