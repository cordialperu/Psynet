import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function applyMigration() {
  try {
    console.log("🚀 Applying migration step by step...\n");

    // Add deleted_at and tracking fields to therapies
    console.log("1. Adding deleted_at column...");
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE`);
    
    console.log("2. Adding views_count column...");
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0`);
    
    console.log("3. Adding whatsapp_clicks column...");
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS whatsapp_clicks INTEGER DEFAULT 0`);
    
    console.log("4. Creating indexes on therapies...");
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_therapies_published ON therapies(published) WHERE deleted_at IS NULL`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_therapies_category ON therapies(category) WHERE deleted_at IS NULL`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_therapies_type ON therapies(type) WHERE deleted_at IS NULL`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_therapies_deleted_at ON therapies(deleted_at)`);
    
    console.log("\n✅ Migration applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
