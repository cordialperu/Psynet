import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function run() {
  const sql = neon(process.env.DATABASE_URL!);
  console.log("🔁 Duplicando items publicados de PE a MX...");

  // Traer hasta 40 items publicados de Perú
  const rows = await sql/* sql */`
    SELECT id, title, slug, type, description, location, duration, price, currency,
           guide_id, guide_name, guide_photo_url, available_dates, video_url,
           category, base_price, platform_fee, shipping_options, inventory,
           specific_fields, google_maps_url, whatsapp_number
    FROM therapies
    WHERE country = 'PE' AND is_published = true
    ORDER BY updated_at DESC
    LIMIT 40
  ` as any[];

  if (!rows.length) {
    console.log("⚠️ No hay items publicados en PE para duplicar.");
    return;
  }

  let inserted = 0;
  for (const r of rows) {
    try {
      const newSlug = `${r.slug}-mx`;
      await sql/* sql */`
        INSERT INTO therapies (
          guide_id, guide_name, guide_photo_url,
          country, category, title, slug, description, type,
          base_price, platform_fee, price, currency,
          duration, location, google_maps_url, video_url,
          whatsapp_number, available_dates, shipping_options, inventory,
          specific_fields, is_published, approval_status
        ) VALUES (
          ${r.guide_id}, ${r.guide_name}, ${r.guide_photo_url},
          'MX', ${r.category}, ${r.title}, ${newSlug}, ${r.description}, ${r.type},
          ${r.base_price}, ${r.platform_fee}, ${r.price}, ${r.currency},
          ${r.duration}, ${r.location}, ${r.google_maps_url}, ${r.video_url},
          ${r.whatsapp_number}, ${r.available_dates}, ${r.shipping_options}, ${r.inventory},
          ${r.specific_fields}, true, 'approved'
        )
        ON CONFLICT (slug) DO NOTHING
      `;
      inserted++;
    } catch (e) {
      console.warn("Saltando por conflicto u error en:", r.slug, e);
    }
  }

  console.log(`✅ Insertados en MX: ${inserted}`);
}

run().catch((e) => { console.error("❌ Error:", e); process.exit(1); });
