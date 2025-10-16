import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { therapies } from "./shared/schema.ts";
import { eq } from "drizzle-orm";

const DATABASE_URL = "postgresql://neondb_owner:npg_CFmlMPLAz1p0@ep-round-river-adsros8v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function test() {
  try {
    console.log('Testing direct query...');
    const result = await db.select().from(therapies).where(eq(therapies.published, true)).limit(5);
    console.log('Success! Found', result.length, 'therapies');
    console.log('First therapy:', result[0]?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
