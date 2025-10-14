import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function addPayPalColumn() {
  console.log("🔄 Adding paypal_email column to admin_settings...\n");

  try {
    await sql`
      ALTER TABLE admin_settings 
      ADD COLUMN IF NOT EXISTS paypal_email varchar(255)
    `;
    
    console.log("✅ Successfully added paypal_email column!");
    console.log("\n📋 You can now configure PayPal email in Admin Settings");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

addPayPalColumn()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
