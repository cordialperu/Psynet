import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const queryClient = postgres(process.env.DATABASE_URL, {
  ssl: 'prefer',
});

export const db = drizzle(queryClient);
