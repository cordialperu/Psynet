import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT id, title, country, is_published, approval_status FROM therapies WHERE country = 'MX' ORDER BY created_at DESC LIMIT 5`;
  const count = await sql`SELECT COUNT(*)::int AS c FROM therapies WHERE country = 'MX'`;
  console.log("MX count:", (count[0] as any).c);
  console.log(rows);
}

main().catch((e) => { console.error(e); process.exit(1); });
