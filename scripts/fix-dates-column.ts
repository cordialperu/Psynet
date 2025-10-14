import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function fixDatesColumn() {
  try {
    console.log("🔧 Fixing available_dates column...");
    
    // Eliminar la columna vieja y crear una nueva de tipo text[]
    await sql`
      ALTER TABLE therapies 
      DROP COLUMN IF EXISTS available_dates
    `;
    
    await sql`
      ALTER TABLE therapies 
      ADD COLUMN available_dates TEXT[]
    `;
    
    console.log("✅ Column fixed to TEXT[]");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixDatesColumn();
