import "dotenv/config";
import { db } from "../server/db";
import { therapies } from "@shared/schema";
import { eq } from "drizzle-orm";

// Translation mappings for common Spanish to English
const translations: Record<string, { title: string; description: string; location?: string; duration?: string }> = {
  // Ayahuasca ceremonies
  "Retiro de Ayahuasca de 3 días": {
    title: "3-Day Ayahuasca Retreat",
    description: "Immerse yourself in a transformative 3-day ayahuasca ceremony in the Sacred Valley. Includes preparation, 2 ceremonies, integration, and accommodation.",
    location: "Sacred Valley, Cusco, Peru",
    duration: "3 days, 2 nights"
  },
  "Ceremonia de Ayahuasca Individual": {
    title: "Individual Ayahuasca Ceremony",
    description: "Personalized ayahuasca ceremony with experienced shaman. Includes pre-ceremony consultation, ceremony, and post-integration session.",
    location: "Cusco, Peru",
    duration: "1 night"
  },
  "Retiro San Pedro Machu Picchu": {
    title: "San Pedro Retreat at Machu Picchu",
    description: "Sacred journey combining San Pedro medicine with a visit to Machu Picchu. Includes ceremony, guided tour, and integration.",
    location: "Machu Picchu, Cusco, Peru",
    duration: "2 days, 1 night"
  },
  
  // Therapies
  "Terapia Holística Integral": {
    title: "Integral Holistic Therapy",
    description: "Comprehensive holistic therapy combining energy work, meditation, and natural healing techniques for physical and emotional well-being.",
    location: "Lima, Peru",
    duration: "90 minutes"
  },
  "Sesión de Reiki": {
    title: "Reiki Session",
    description: "Energy healing session using Reiki techniques to balance chakras and promote deep relaxation and healing.",
    location: "Miraflores, Lima, Peru",
    duration: "60 minutes"
  },
  
  // Microdosing
  "Protocolo Microdosis Psilocibina": {
    title: "Psilocybin Microdosing Protocol",
    description: "30-day psilocybin microdosing protocol following the Fadiman method. Includes consultation, dosage guide, and follow-up support.",
    duration: "30 days"
  },
  "Stack Stamets - Microdosis": {
    title: "Stamets Stack - Microdosing",
    description: "Paul Stamets protocol combining psilocybin, lion's mane, and niacin for cognitive enhancement and neurogenesis.",
    duration: "4 weeks"
  },
  
  // Medicine
  "Rapé Ceremonial": {
    title: "Ceremonial Rapé",
    description: "Traditional Amazonian tobacco snuff used for grounding, cleansing, and spiritual connection. Includes application and guidance.",
    duration: "30 minutes"
  },
  "Kambo Detox": {
    title: "Kambo Detox",
    description: "Traditional Amazonian frog medicine for deep physical and energetic cleansing. Includes preparation, application, and integration.",
    duration: "2 hours"
  },
  
  // Events
  "Círculo de Cacao": {
    title: "Cacao Circle",
    description: "Heart-opening ceremonial cacao circle with meditation, sharing, and community connection.",
    location: "Barranco, Lima, Peru",
    duration: "3 hours"
  },
  "Temazcal - Ceremonia de Sudor": {
    title: "Temazcal - Sweat Lodge Ceremony",
    description: "Traditional sweat lodge ceremony for purification, healing, and spiritual renewal.",
    location: "Sacred Valley, Peru",
    duration: "4 hours"
  },
  
  // Products
  "Incienso Palo Santo": {
    title: "Palo Santo Incense",
    description: "Sacred wood from Peru used for cleansing spaces, meditation, and spiritual practices. 100% natural and sustainably sourced.",
  },
  "Mapacho Ceremonial": {
    title: "Ceremonial Mapacho",
    description: "Traditional Amazonian tobacco used in ceremonies and healing rituals. Organic and wildcrafted.",
  }
};

async function translateContent() {
  console.log("🌍 Starting content translation to English...\n");

  try {
    // Get all therapies
    const allTherapies = await db.select().from(therapies);
    console.log(`Found ${allTherapies.length} listings to translate\n`);

    let translated = 0;
    let skipped = 0;

    for (const therapy of allTherapies) {
      const translation = translations[therapy.title];
      
      if (translation) {
        await db.update(therapies)
          .set({
            title: translation.title,
            description: translation.description,
            location: translation.location || therapy.location,
            duration: translation.duration || therapy.duration,
          })
          .where(eq(therapies.id, therapy.id));
        
        console.log(`✅ Translated: ${therapy.title} → ${translation.title}`);
        translated++;
      } else {
        console.log(`⏭️  Skipped: ${therapy.title} (no translation available)`);
        skipped++;
      }
    }

    console.log(`\n📊 Translation Summary:`);
    console.log(`   ✅ Translated: ${translated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total: ${allTherapies.length}`);
    console.log(`\n🎉 Translation complete!`);

  } catch (error) {
    console.error("❌ Error translating content:", error);
    throw error;
  }
}

// Run the translation
translateContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
