import "dotenv/config";
import { db } from "../server/db";
import { therapies } from "@shared/schema";
import { eq } from "drizzle-orm";

// Comprehensive translation dictionary
const translations: Record<string, { title: string; description: string; location?: string; duration?: string }> = {
  // San Pedro
  "Retiro de San Pedro en Machu Picchu": {
    title: "San Pedro Retreat at Machu Picchu",
    description: "Connect with ancient Andean wisdom through the sacred San Pedro cactus in a full-day retreat with breathtaking views.",
    location: "Machu Picchu, Cusco, Peru",
    duration: "1 day"
  },
  
  // Bufo Alvarius
  "Retiro de Bufo Alvarius (5-MeO-DMT)": {
    title: "Bufo Alvarius Retreat (5-MeO-DMT)",
    description: "The most profound experience of unity and ego dissolution with the sacred medicine of the desert toad.",
    location: "Sacred Valley, Peru",
    duration: "1 day"
  },
  
  // Holotropic Breathwork
  "Retiro de Respiración Holotrópica": {
    title: "Holotropic Breathwork Retreat",
    description: "Reach altered states of consciousness without substances, only with the power of breath.",
    location: "Lima, Peru",
    duration: "4 hours"
  },
  
  // Palo Santo
  "Incienso Natural Palo Santo - 50 varitas": {
    title: "Natural Palo Santo Incense - 50 Sticks",
    description: "Natural palo santo incense sticks from Peru. Sustainably harvested for cleansing and meditation. Pack of 50 sticks.",
    location: "Lima, Peru"
  },
};

// Function to translate text using MyMemory API (free, no key required)
async function translateText(text: string, fromLang = "es", toLang = "en"): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
    );
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    
    return text; // Return original if translation fails
  } catch (error) {
    console.error("Translation API error:", error);
    return text;
  }
}

// Detect if text is in Spanish
function isSpanish(text: string): boolean {
  const spanishIndicators = [
    'ción', 'día', 'días', 'año', 'años', 'español', 'ceremonia', 'retiro',
    'terapia', 'medicina', 'sagrado', 'ancestral', 'tradicional', 'perú',
    'cusco', 'valle', 'horas', 'minutos', 'noches'
  ];
  
  const lowerText = text.toLowerCase();
  return spanishIndicators.some(indicator => lowerText.includes(indicator));
}

async function translateAllContent() {
  console.log("🌍 Starting comprehensive translation...\n");

  try {
    const allTherapies = await db.select().from(therapies);
    console.log(`Found ${allTherapies.length} total listings\n`);

    let translated = 0;
    let skipped = 0;
    let apiTranslated = 0;

    for (const therapy of allTherapies) {
      // Check if already in English
      if (!isSpanish(therapy.title) && !isSpanish(therapy.description || "")) {
        console.log(`✅ Already in English: ${therapy.title}`);
        skipped++;
        continue;
      }

      // Try dictionary first
      const dictTranslation = translations[therapy.title];
      
      if (dictTranslation) {
        await db.update(therapies)
          .set({
            title: dictTranslation.title,
            description: dictTranslation.description,
            location: dictTranslation.location || therapy.location,
            duration: dictTranslation.duration || therapy.duration,
          })
          .where(eq(therapies.id, therapy.id));
        
        console.log(`📖 Dict: ${therapy.title} → ${dictTranslation.title}`);
        translated++;
      } else {
        // Use API translation
        console.log(`🔄 Translating via API: ${therapy.title}...`);
        
        const [translatedTitle, translatedDesc, translatedLoc, translatedDur] = await Promise.all([
          translateText(therapy.title),
          therapy.description ? translateText(therapy.description) : Promise.resolve(""),
          therapy.location && isSpanish(therapy.location) ? translateText(therapy.location) : Promise.resolve(therapy.location),
          therapy.duration && isSpanish(therapy.duration) ? translateText(therapy.duration) : Promise.resolve(therapy.duration),
        ]);

        await db.update(therapies)
          .set({
            title: translatedTitle,
            description: translatedDesc || therapy.description,
            location: translatedLoc || therapy.location,
            duration: translatedDur || therapy.duration,
          })
          .where(eq(therapies.id, therapy.id));
        
        console.log(`🤖 API: ${therapy.title} → ${translatedTitle}`);
        apiTranslated++;
        
        // Rate limit: wait 500ms between API calls
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`\n📊 Translation Summary:`);
    console.log(`   📖 Dictionary: ${translated}`);
    console.log(`   🤖 API: ${apiTranslated}`);
    console.log(`   ✅ Already English: ${skipped}`);
    console.log(`   📝 Total: ${allTherapies.length}`);
    console.log(`\n🎉 Translation complete!`);

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

translateAllContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
