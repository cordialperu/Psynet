import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function addCapacityFields() {
  console.log("🔄 Adding capacity and booked_slots fields to therapies table...\n");

  try {
    // Add capacity field
    await sql`
      ALTER TABLE therapies 
      ADD COLUMN IF NOT EXISTS capacity integer
    `;
    console.log("✅ Added capacity field");
    
    // Add booked_slots field with default 0
    await sql`
      ALTER TABLE therapies 
      ADD COLUMN IF NOT EXISTS booked_slots integer DEFAULT 0
    `;
    console.log("✅ Added booked_slots field");
    
    console.log("\n✅ Successfully added capacity management fields!");
    console.log("\n📋 You can now manage:");
    console.log("   - Product inventory (existing)");
    console.log("   - Ceremony/Event capacity");
    console.log("   - Booked slots tracking");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

addCapacityFields()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
