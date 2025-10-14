import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function addDisplayOrder() {
  console.log("🔄 Adding display_order field to therapies table...\n");

  try {
    // Add display_order field with default 0
    await sql`
      ALTER TABLE therapies 
      ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0
    `;
    console.log("✅ Added display_order field");
    
    // Set initial order based on creation date (oldest = higher number)
    await sql`
      UPDATE therapies 
      SET display_order = (
        SELECT COUNT(*) 
        FROM therapies t2 
        WHERE t2.created_at <= therapies.created_at
      )
      WHERE display_order = 0
    `;
    console.log("✅ Initialized display_order for existing therapies");
    
    console.log("\n✅ Successfully added manual ordering capability!");
    console.log("\n📋 Super Admin can now:");
    console.log("   - Reorder listings manually");
    console.log("   - Move important listings to the top");
    console.log("   - Customize the display order");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

addDisplayOrder()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
