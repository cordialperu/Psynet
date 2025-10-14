import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration() {
  console.log("🌍 Running English translation migration...\n");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);
  
  try {
    // Read the SQL file
    const migrationPath = join(process.cwd(), "migrations", "TRANSLATE_ALL_CONTENT_TO_ENGLISH.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    let executed = 0;
    for (const statement of statements) {
      if (statement.trim()) {
        await sql(statement);
        executed++;
        if (executed % 10 === 0) {
          console.log(`✅ Executed ${executed}/${statements.length} statements...`);
        }
      }
    }
    
    console.log(`\n✅ All ${executed} statements executed successfully!`);
    console.log(`🎉 Translation migration complete!\n`);
    
  } catch (error) {
    console.error("❌ Error running migration:", error);
    throw error;
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
