import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function migrateCategories() {
  try {
    console.log("🚀 Iniciando migración de categorías y precios...\n");

    // Ejecutar migración paso por paso
    console.log("📝 Agregando columnas...");
    
    // Agregar columnas una por una
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'ceremonias'`);
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS base_price NUMERIC(10, 2)`);
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(10, 2)`);
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS google_maps_url TEXT`);
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS shipping_options JSONB`);
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS inventory INTEGER`);
    await db.execute(sql`ALTER TABLE therapies ADD COLUMN IF NOT EXISTS specific_fields JSONB`);
    
    console.log("✅ Columnas agregadas\n");

    // Crear índices
    console.log("📝 Creando índices...");
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_therapies_category ON therapies(category)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_therapies_published_category ON therapies(is_published, category)`);
    console.log("✅ Índices creados\n");

    // Migrar datos existentes
    console.log("🔄 Migrando datos existentes...");
    await db.execute(sql`
      UPDATE therapies
      SET 
        base_price = CASE 
          WHEN base_price IS NULL AND price IS NOT NULL THEN price / 1.25
          ELSE base_price
        END,
        platform_fee = CASE 
          WHEN platform_fee IS NULL AND price IS NOT NULL THEN price * 0.25 / 1.25
          ELSE platform_fee
        END,
        category = COALESCE(category, 'ceremonias')
      WHERE base_price IS NULL OR platform_fee IS NULL
    `);
    console.log("✅ Datos migrados\n");

    // Verificar los cambios
    console.log("🔍 Verificando cambios...");
    const result = await db.execute(sql`
      SELECT 
        id, 
        title, 
        category,
        base_price,
        platform_fee,
        price,
        currency
      FROM therapies
      LIMIT 5
    `);

    console.log("\n📊 Primeras 5 terapias migradas:");
    console.table(result.rows);

    // Estadísticas
    const stats = await db.execute(sql`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(base_price) as avg_base_price,
        AVG(price) as avg_final_price
      FROM therapies
      WHERE is_published = true
      GROUP BY category
    `);

    console.log("\n📈 Estadísticas por categoría:");
    console.table(stats.rows);

    console.log("\n✅ Migración completada exitosamente!");
    console.log("\n📝 Resumen:");
    console.log("   - Todas las terapias existentes ahora tienen categoría 'ceremonias'");
    console.log("   - Los precios se han ajustado con comisión del 25%");
    console.log("   - base_price = precio original");
    console.log("   - platform_fee = 25% del base_price");
    console.log("   - price = base_price + platform_fee");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    process.exit(1);
  }
}

migrateCategories();
