import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function checkStructure() {
  try {
    console.log("🔍 Checking therapies table structure...\n");

    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'therapies'
      ORDER BY ordinal_position
    `);

    console.log("Columns in therapies table:");
    console.log("─".repeat(60));
    result.rows.forEach((row: any) => {
      console.log(`${row.column_name.padEnd(30)} ${row.data_type.padEnd(20)} ${row.is_nullable}`);
    });
    console.log("─".repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkStructure();
