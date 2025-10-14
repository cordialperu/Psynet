import { db } from "../server/db";
import { guides } from "../shared/schema";

async function checkGuides() {
  try {
    console.log("🔍 Checking guides in database...");
    
    const allGuides = await db.select().from(guides);
    
    console.log(`\n📊 Total guides found: ${allGuides.length}\n`);
    
    if (allGuides.length > 0) {
      console.log("Guides:");
      allGuides.forEach((guide, index) => {
        console.log(`\n${index + 1}. ${guide.fullName}`);
        console.log(`   Email: ${guide.email}`);
        console.log(`   WhatsApp: ${guide.whatsapp}`);
        console.log(`   Instagram: ${guide.instagram || 'N/A'}`);
        console.log(`   TikTok: ${guide.tiktok || 'N/A'}`);
        console.log(`   Verified: ${guide.verified}`);
        console.log(`   Created: ${guide.createdAt}`);
      });
    } else {
      console.log("❌ No guides found in database");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkGuides();
