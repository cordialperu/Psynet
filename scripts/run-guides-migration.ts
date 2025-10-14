import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log("🔄 Running guides migration...\n");

  try {
    // Read the SQL file
    const migrationPath = join(process.cwd(), "migrations", "add_whatsapp_tiktok_to_guides.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");
    
    // Remove comments and split by semicolon
    const cleanSQL = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = cleanSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("COMMENT"));
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        await sql(statement);
        console.log("✅ Done\n");
      }
    }

    console.log("🎉 Migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
