import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration() {
  try {
    console.log("🚀 Running migration...");
    
    const migrationSQL = readFileSync(
      join(process.cwd(), "migrations/0001_add_sessions_favorites_reviews.sql"),
      "utf-8"
    );

    await db.execute(sql.raw(migrationSQL));
    
    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
