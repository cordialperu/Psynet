import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';

async function run() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  const sql = neon(process.env.DATABASE_URL);

  const file = join(process.cwd(), 'migrations', 'add_mexican_providers.sql');
  let content = readFileSync(file, 'utf-8');

  // Corrige nombre de columna: published -> is_published
  content = content.replace(/\bis_published\b/g, 'is_published'); // idempotente
  content = content.replace(/\bpublished\b/g, 'is_published');

  // Divide por ; y ejecuta cada comando no vacío
  const commands = content
    .split(';')
    .map((c) => c.trim())
    .filter((c) => c && !c.startsWith('--'));

  console.log(`🚀 Ejecutando ${commands.length} comandos para proveedores MX...`);
  for (const cmd of commands) {
    await sql(cmd);
  }
  console.log('✅ Proveedores de México insertados/actualizados.');
}

run().catch((e) => {
  console.error('❌ Error ejecutando proveedores MX:', e);
  process.exit(1);
});
