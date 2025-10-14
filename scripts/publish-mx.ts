import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  console.log("🔄 Publicando registros de México (country='MX')...");
  const res = await sql`
    UPDATE therapies
    SET is_published = true,
        approval_status = 'approved'
    WHERE country = 'MX'
  `;
  console.log("✅ Listo. Registros afectados:", (res as any).count ?? "desconocido");
}

run().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
