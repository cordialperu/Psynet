import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function check() {
  const result = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'therapies'
    ORDER BY column_name
  `;
  
  console.log("Therapies table columns:");
  result.forEach(col => {
    console.log(`  ${col.column_name}: ${col.data_type}`);
  });
  
  process.exit(0);
}

check();
