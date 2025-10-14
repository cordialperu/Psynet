import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function addMexicoAdminWhatsapp() {
  console.log("🚀 Adding Mexico admin WhatsApp column...");
  
  try {
    // Add the column
    await db.execute(sql`
      ALTER TABLE admin_settings 
      ADD COLUMN IF NOT EXISTS admin_whatsapp_mexico VARCHAR(50);
    `);
    
    console.log("✅ Successfully added admin_whatsapp_mexico column");
    
    // Add comment
    await db.execute(sql`
      COMMENT ON COLUMN admin_settings.admin_whatsapp_mexico IS 'WhatsApp number for Mexico administrator to receive order notifications';
    `);
    
    console.log("✅ Added column comment");
    console.log("🎉 Migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Error running migration:", error);
    throw error;
  }
}

addMexicoAdminWhatsapp()
  .then(() => {
    console.log("✅ Migration script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
