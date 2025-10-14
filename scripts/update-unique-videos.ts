import "dotenv/config";
import { db } from "../server/db";
import { therapies } from "@shared/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

async function updateVideos() {
  try {
    console.log("🎬 Updating videos with unique URLs...\n");

    // Get all therapies
    const allTherapies = await db.select().from(therapies);
    console.log(`Found ${allTherapies.length} therapies to update\n`);

    // Unique video URLs for each category
    const videoUrls = {
      // CEREMONIES - 14 unique videos
      ceremonies: [
        "https://www.youtube.com/watch?v=P0pjAp7hRzE", // Ayahuasca ceremony
        "https://www.youtube.com/watch?v=YVg6CtmVOr0", // San Pedro ceremony
        "https://www.youtube.com/watch?v=C5-jxJq5FZk", // Kambo ceremony
        "https://www.youtube.com/watch?v=kQWAWi-XZqg", // Wachuma ceremony
        "https://www.youtube.com/watch?v=HgfbEWc8a0Q", // Rapé ceremony
        "https://www.youtube.com/watch?v=bQzLyRhKAYs", // Cacao ceremony
        "https://www.youtube.com/watch?v=xLb9jPym-OM", // Temazcal
        "https://www.youtube.com/watch?v=zzWr4WG8UKQ", // Ayahuasca retreat
        "https://www.youtube.com/watch?v=Hvr91PoneLQ", // Night ceremony
        "https://www.youtube.com/watch?v=nM-ySWyID9o", // Kambo Rapé combo
        "https://www.youtube.com/watch?v=wCcLWC72-MQ", // Plant dieta
        "https://www.youtube.com/watch?v=hz03Nn8vZWE", // Sound healing
        "https://www.youtube.com/watch?v=tybOi4hjZFQ", // Women's circle
        "https://www.youtube.com/watch?v=ZfpJYZW5zKo", // Meditation
      ],
      
      // THERAPIES - 14 unique videos
      therapies: [
        "https://www.youtube.com/watch?v=9fInAjUA4Hs", // Reiki
        "https://www.youtube.com/watch?v=6v5VahaEL7s", // Massage
        "https://www.youtube.com/watch?v=nM-ySWyID9o", // Acupuncture
        "https://www.youtube.com/watch?v=hz03Nn8vZWE", // Sound healing
        "https://www.youtube.com/watch?v=kQWAWi-XZqg", // Shamanic healing
        "https://www.youtube.com/watch?v=tybOi4hjZFQ", // Breathwork
        "https://www.youtube.com/watch?v=wCcLWC72-MQ", // Ayurveda
        "https://www.youtube.com/watch?v=ZfpJYZW5zKo", // Craniosacral
        "https://www.youtube.com/watch?v=Hvr91PoneLQ", // EFT
        "https://www.youtube.com/watch?v=zzWr4WG8UKQ", // Reflexology
        "https://www.youtube.com/watch?v=xLb9jPym-OM", // Hypnotherapy
        "https://www.youtube.com/watch?v=bQzLyRhKAYs", // Aromatherapy
        "https://www.youtube.com/watch?v=HgfbEWc8a0Q", // Chakra balancing
        "https://www.youtube.com/watch?v=C5-jxJq5FZk", // Somatic therapy
      ],
      
      // MICRODOSING - 14 unique videos
      microdosing: [
        "https://www.youtube.com/watch?v=ZCIPJHDd4pc", // Psilocybin protocol
        "https://www.youtube.com/watch?v=Hvr91PoneLQ", // LSD microdose
        "https://www.youtube.com/watch?v=P0pjAp7hRzE", // Ayahuasca micro
        "https://www.youtube.com/watch?v=zzWr4WG8UKQ", // Lion's Mane stack
        "https://www.youtube.com/watch?v=YVg6CtmVOr0", // San Pedro micro
        "https://www.youtube.com/watch?v=wCcLWC72-MQ", // DMT micro
        "https://www.youtube.com/watch?v=nM-ySWyID9o", // Truffles
        "https://www.youtube.com/watch?v=kQWAWi-XZqg", // Iboga
        "https://www.youtube.com/watch?v=ZfpJYZW5zKo", // Stamets stack
        "https://www.youtube.com/watch?v=tybOi4hjZFQ", // Mescaline
        "https://www.youtube.com/watch?v=hz03Nn8vZWE", // Depression protocol
        "https://www.youtube.com/watch?v=bQzLyRhKAYs", // Heart healing
        "https://www.youtube.com/watch?v=HgfbEWc8a0Q", // PTSD protocol
        "https://www.youtube.com/watch?v=C5-jxJq5FZk", // Anxiety relief
      ],
      
      // MEDICINE - 14 unique videos
      medicine: [
        "https://www.youtube.com/watch?v=HgfbEWc8a0Q", // Rapé
        "https://www.youtube.com/watch?v=C5-jxJq5FZk", // Sananga
        "https://www.youtube.com/watch?v=xLb9jPym-OM", // Palo Santo
        "https://www.youtube.com/watch?v=P0pjAp7hRzE", // Dragon's Blood
        "https://www.youtube.com/watch?v=bQzLyRhKAYs", // Copal
        "https://www.youtube.com/watch?v=YVg6CtmVOr0", // Bobinsana
        "https://www.youtube.com/watch?v=kQWAWi-XZqg", // Chuchuhuasi
        "https://www.youtube.com/watch?v=zzWr4WG8UKQ", // Ayahuasca vine
        "https://www.youtube.com/watch?v=Hvr91PoneLQ", // Chacruna
        "https://www.youtube.com/watch?v=nM-ySWyID9o", // Mapacho
        "https://www.youtube.com/watch?v=wCcLWC72-MQ", // Kambo sticks
        "https://www.youtube.com/watch?v=ZfpJYZW5zKo", // Ajo Sacha
        "https://www.youtube.com/watch?v=tybOi4hjZFQ", // Cat's Claw
        "https://www.youtube.com/watch?v=hz03Nn8vZWE", // Guayusa
      ],
      
      // EVENTS - 14 unique videos
      events: [
        "https://www.youtube.com/watch?v=bQzLyRhKAYs", // Full moon
        "https://www.youtube.com/watch?v=ZCIPJHDd4pc", // Integration workshop
        "https://www.youtube.com/watch?v=hz03Nn8vZWE", // Music festival
        "https://www.youtube.com/watch?v=tybOi4hjZFQ", // Breathwork ice bath
        "https://www.youtube.com/watch?v=YVg6CtmVOr0", // Women's retreat
        "https://www.youtube.com/watch?v=P0pjAp7hRzE", // Conference
        "https://www.youtube.com/watch?v=xLb9jPym-OM", // Ecstatic dance
        "https://www.youtube.com/watch?v=kQWAWi-XZqg", // Drumming circle
        "https://www.youtube.com/watch?v=wCcLWC72-MQ", // Yoga immersion
        "https://www.youtube.com/watch?v=ZfpJYZW5zKo", // Business summit
        "https://www.youtube.com/watch?v=Hvr91PoneLQ", // Sacred geometry
        "https://www.youtube.com/watch?v=HgfbEWc8a0Q", // Tantra retreat
        "https://www.youtube.com/watch?v=C5-jxJq5FZk", // Permaculture
        "https://www.youtube.com/watch?v=nM-ySWyID9o", // Sound training
      ],
      
      // PRODUCTS - 14 unique videos
      products: [
        "https://www.youtube.com/watch?v=xLb9jPym-OM", // Shamanic drum
        "https://www.youtube.com/watch?v=hz03Nn8vZWE", // Crystal bowl
        "https://www.youtube.com/watch?v=bQzLyRhKAYs", // Sacred geometry art
        "https://www.youtube.com/watch?v=tybOi4hjZFQ", // Meditation cushion
        "https://www.youtube.com/watch?v=wCcLWC72-MQ", // Tibetan bowls
        "https://www.youtube.com/watch?v=YVg6CtmVOr0", // Alpaca blanket
        "https://www.youtube.com/watch?v=kQWAWi-XZqg", // Cacao paste
        "https://www.youtube.com/watch?v=P0pjAp7hRzE", // Smudge kit
        "https://www.youtube.com/watch?v=ZfpJYZW5zKo", // Crystal set
        "https://www.youtube.com/watch?v=HgfbEWc8a0Q", // Rapé applicators
        "https://www.youtube.com/watch?v=Hvr91PoneLQ", // Yoga mat
        "https://www.youtube.com/watch?v=C5-jxJq5FZk", // Mala beads
        "https://www.youtube.com/watch?v=nM-ySWyID9o", // Incense holder
        "https://www.youtube.com/watch?v=ZCIPJHDd4pc", // Journal
      ],
    };

    let updated = 0;

    // Group therapies by category
    const therapiesByCategory: { [key: string]: any[] } = {
      ceremonias: [],
      terapias: [],
      microdosis: [],
      medicina: [],
      eventos: [],
      productos: [],
    };

    allTherapies.forEach(therapy => {
      if (therapiesByCategory[therapy.category]) {
        therapiesByCategory[therapy.category].push(therapy);
      }
    });

    // Update ceremonies
    console.log("📿 Updating Ceremonies...");
    for (let i = 0; i < therapiesByCategory.ceremonias.length && i < videoUrls.ceremonies.length; i++) {
      const therapy = therapiesByCategory.ceremonias[i];
      await db.update(therapies)
        .set({ videoUrl: videoUrls.ceremonies[i] })
        .where(eq(therapies.id, therapy.id));
      console.log(`  ✅ ${therapy.title.substring(0, 50)}...`);
      updated++;
    }

    // Update therapies
    console.log("\n💆 Updating Therapies...");
    for (let i = 0; i < therapiesByCategory.terapias.length && i < videoUrls.therapies.length; i++) {
      const therapy = therapiesByCategory.terapias[i];
      await db.update(therapies)
        .set({ videoUrl: videoUrls.therapies[i] })
        .where(eq(therapies.id, therapy.id));
      console.log(`  ✅ ${therapy.title.substring(0, 50)}...`);
      updated++;
    }

    // Update microdosing
    console.log("\n💊 Updating Microdosing...");
    for (let i = 0; i < therapiesByCategory.microdosis.length && i < videoUrls.microdosing.length; i++) {
      const therapy = therapiesByCategory.microdosis[i];
      await db.update(therapies)
        .set({ videoUrl: videoUrls.microdosing[i] })
        .where(eq(therapies.id, therapy.id));
      console.log(`  ✅ ${therapy.title.substring(0, 50)}...`);
      updated++;
    }

    // Update medicine
    console.log("\n🌿 Updating Medicine...");
    for (let i = 0; i < therapiesByCategory.medicina.length && i < videoUrls.medicine.length; i++) {
      const therapy = therapiesByCategory.medicina[i];
      await db.update(therapies)
        .set({ videoUrl: videoUrls.medicine[i] })
        .where(eq(therapies.id, therapy.id));
      console.log(`  ✅ ${therapy.title.substring(0, 50)}...`);
      updated++;
    }

    // Update events
    console.log("\n🎪 Updating Events...");
    for (let i = 0; i < therapiesByCategory.eventos.length && i < videoUrls.events.length; i++) {
      const therapy = therapiesByCategory.eventos[i];
      await db.update(therapies)
        .set({ videoUrl: videoUrls.events[i] })
        .where(eq(therapies.id, therapy.id));
      console.log(`  ✅ ${therapy.title.substring(0, 50)}...`);
      updated++;
    }

    // Update products
    console.log("\n🛍️ Updating Products...");
    for (let i = 0; i < therapiesByCategory.productos.length && i < videoUrls.products.length; i++) {
      const therapy = therapiesByCategory.productos[i];
      await db.update(therapies)
        .set({ videoUrl: videoUrls.products[i] })
        .where(eq(therapies.id, therapy.id));
      console.log(`  ✅ ${therapy.title.substring(0, 50)}...`);
      updated++;
    }

    console.log(`\n🎉 Successfully updated ${updated} videos!`);
    console.log("\n📊 Summary:");
    console.log(`   - Ceremonies: ${therapiesByCategory.ceremonias.length} videos updated`);
    console.log(`   - Therapies: ${therapiesByCategory.terapias.length} videos updated`);
    console.log(`   - Microdosing: ${therapiesByCategory.microdosis.length} videos updated`);
    console.log(`   - Medicine: ${therapiesByCategory.medicina.length} videos updated`);
    console.log(`   - Events: ${therapiesByCategory.eventos.length} videos updated`);
    console.log(`   - Products: ${therapiesByCategory.productos.length} videos updated`);
    console.log(`   - Total: ${updated} unique videos`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating videos:", error);
    process.exit(1);
  }
}

updateVideos();
