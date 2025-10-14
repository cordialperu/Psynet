import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function migrateGuidesFields() {
  try {
    console.log("🚀 Iniciando migración de campos de guías...\n");

    // Leer el archivo SQL
    const migrationPath = path.join(__dirname, "../migrations/ADD_PHONE_INSTAGRAM_TO_GUIDES.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Dividir en comandos individuales
    const commands = migrationSQL
      .split(";")
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith("--"));

    console.log(`📝 Ejecutando ${commands.length} comandos SQL...\n`);

    // Ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`[${i + 1}/${commands.length}] Ejecutando: ${command.substring(0, 60)}...`);
      
      try {
        await db.execute(sql.raw(command));
        console.log(`✅ Comando ${i + 1} ejecutado exitosamente\n`);
      } catch (error) {
        console.error(`❌ Error en comando ${i + 1}:`, error);
        throw error;
      }
    }

    // Verificar los cambios
    console.log("\n🔍 Verificando cambios...");
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'guides'
      AND column_name IN ('phone', 'instagram')
      ORDER BY column_name;
    `);

    console.log("\n📊 Columnas agregadas:");
    console.table(result.rows);

    // Contar guías
    const countResult = await db.execute(sql`SELECT COUNT(*) as total FROM guides;`);
    const totalGuides = countResult.rows[0]?.total || 0;
    console.log(`\n✅ Total de guías en la base de datos: ${totalGuides}`);

    console.log("\n🎉 ¡Migración completada exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error durante la migración:", error);
    process.exit(1);
  }
}

migrateGuidesFields();
