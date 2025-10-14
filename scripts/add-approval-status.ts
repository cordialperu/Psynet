import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function addApprovalStatus() {
  try {
    console.log("Adding approval_status column...");
    
    // Add column
    await db.execute(sql`
      ALTER TABLE therapies 
      ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'approved'
    `);
    
    console.log("Column added successfully");
    
    // Update existing therapies
    await db.execute(sql`
      UPDATE therapies 
      SET approval_status = 'approved' 
      WHERE approval_status IS NULL
    `);
    
    console.log("Existing therapies updated to 'approved'");
    console.log("Migration completed successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

addApprovalStatus();
