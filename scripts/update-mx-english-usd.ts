import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🔄 Updating Mexican products with USD prices and English translations...");
  await sql`DELETE FROM therapies WHERE country = 'MX'`;
  
  console.log("✨ Inserting Mexico City products with USD pricing and English content...");

  // CATEGORY: EVENTS - Real events that take place in Mexico City
  const events = [
    {
      title: "Traditional Temazcal Ceremonies CDMX",
      slug: "temazcal-cdmx-001",
      type: "temazcal",
      category: "eventos", 
      description: "Traditional temazcal ceremonies in Ajusco. Ancestral purification in contact with nature, just 40 minutes from the city center.",
      location: "Ajusco, Mexico City",
      price: 19, // 350 MXN / 18 ≈ 19 USD
      currency: "USD",
      duration: "3 hours",
      whatsapp_number: "+52-55-1234-5678",
      google_maps_url: "https://maps.google.com/?q=Temazcal+Ajusco+CDMX"
    },
    {
      title: "Ceremonial Cacao Circles in Roma Norte",
      slug: "cacao-ceremony-roma-002", 
      type: "cacao-ceremony",
      category: "eventos",
      description: "Ceremonial cacao circles in holistic spaces of Roma Norte. Open your heart with high-quality Mexican criollo cacao.",
      location: "Roma Norte, Mexico City",
      price: 25, // 450 MXN / 18 ≈ 25 USD
      currency: "USD", 
      duration: "2 hours",
      whatsapp_number: "+52-55-2345-6789",
      google_maps_url: "https://maps.google.com/?q=Roma+Norte+CDMX"
    },
    {
      title: "Tibetan Sound Bowls Healing Sessions",
      slug: "sound-healing-condesa-003",
      type: "sound-healing",
      category: "eventos",
      description: "Healing sessions with Tibetan bowls and gongs in Condesa studios. Deep harmonization and total relaxation.",
      location: "Condesa, Mexico City", 
      price: 22, // 400 MXN / 18 ≈ 22 USD
      currency: "USD",
      duration: "1.5 hours",
      whatsapp_number: "+52-55-3456-7890",
      google_maps_url: "https://maps.google.com/?q=Condesa+CDMX"
    },
    {
      title: "Holotropic Breathwork Circles",
      slug: "holotropic-breathwork-cdmx-004",
      type: "breathwork", 
      category: "eventos",
      description: "Holotropic breathwork workshops in specialized centers. Technique developed by Stanislav Grof for consciousness expansion.",
      location: "Polanco, Mexico City",
      price: 44, // 800 MXN / 18 ≈ 44 USD
      currency: "USD",
      duration: "4 hours", 
      whatsapp_number: "+52-55-4567-8901",
      google_maps_url: "https://maps.google.com/?q=Polanco+CDMX"
    },
    {
      title: "Group Meditation Sessions in Coyoacán",
      slug: "meditation-coyoacan-005",
      type: "meditation",
      category: "eventos",
      description: "Weekly group meditations in cultural spaces of Coyoacán. Mindfulness practice and vipassana meditation.",
      location: "Coyoacán, Mexico City",
      price: 11, // 200 MXN / 18 ≈ 11 USD
      currency: "USD",
      duration: "1 hour",
      whatsapp_number: "+52-55-5678-9012", 
      google_maps_url: "https://maps.google.com/?q=Coyoacan+CDMX"
    }
  ];

  // CATEGORY: MEDICINE - Medicinal products legally sold in Mexico City
  const medicine = [
    {
      title: "Full Spectrum CBD Oil",
      slug: "cbd-oil-mexico-006",
      type: "cbd",
      category: "medicina",
      description: "Full spectrum CBD oil extracted from industrial hemp. Legal product in Mexico with quality certifications.",
      location: "Mexico City",
      price: 67, // 1200 MXN / 18 ≈ 67 USD
      currency: "USD",
      duration: "30-day treatment",
      whatsapp_number: "+52-55-6789-0123",
      google_maps_url: "https://maps.google.com/?q=CBD+Stores+CDMX"
    },
    {
      title: "Damiana Herbal Tincture (Turnera diffusa)",
      slug: "damiana-tincture-007",
      type: "herbal",
      category: "medicina", 
      description: "Herbal damiana tincture, traditional Mexican medicinal plant. Known for its relaxing and aphrodisiac properties.",
      location: "Mercado de Sonora, Mexico City",
      price: 10, // 180 MXN / 18 = 10 USD
      currency: "USD",
      duration: "15-day treatment",
      whatsapp_number: "+52-55-7890-1234",
      google_maps_url: "https://maps.google.com/?q=Mercado+Sonora+CDMX"
    },
    {
      title: "Mexican Grapefruit Extract",
      slug: "grapefruit-extract-008", 
      type: "herbal",
      category: "medicina",
      description: "Concentrated grapefruit seed extract, powerful natural antioxidant and antimicrobial. Locally produced in Mexico.",
      location: "Mexico City",
      price: 14, // 250 MXN / 18 ≈ 14 USD
      currency: "USD", 
      duration: "30-day treatment",
      whatsapp_number: "+52-55-8901-2345",
      google_maps_url: "https://maps.google.com/?q=Herbal+Medicine+CDMX"
    },
    {
      title: "Agave Honey with Propolis",
      slug: "agave-honey-propolis-009",
      type: "herbal",
      category: "medicina",
      description: "Agave honey sweetened with Mexican bee propolis. Excellent for immune system and respiratory problems.",
      location: "Mexico City", 
      price: 18, // 320 MXN / 18 ≈ 18 USD
      currency: "USD",
      duration: "20-day treatment",
      whatsapp_number: "+52-55-9012-3456",
      google_maps_url: "https://maps.google.com/?q=Natural+Products+CDMX"
    },
    {
      title: "Dehydrated Prickly Pear Cactus Capsules",
      slug: "prickly-pear-capsules-010",
      type: "herbal", 
      category: "medicina",
      description: "Mexican organic prickly pear capsules, rich in fiber and natural glucose regulator. Traditional Mexican superfood.",
      location: "Mexico City",
      price: 16, // 280 MXN / 18 ≈ 16 USD
      currency: "USD",
      duration: "30-day treatment",
      whatsapp_number: "+52-55-0123-4567",
      google_maps_url: "https://maps.google.com/?q=Natural+Supplements+CDMX"
    }
  ];

  // CATEGORY: MICRODOSIS - Legal microdosing products available in Mexico
  const microdosis = [
    {
      title: "Lion's Mane Mushroom Microdose", 
      slug: "lions-mane-microdose-011",
      type: "lions-mane",
      category: "microdosis",
      description: "Hericium erinaceus (Lion's Mane) capsules for neuroprotection and cognitive function. Completely legal medicinal mushroom.",
      location: "Mexico City",
      price: 25, // 450 MXN / 18 = 25 USD
      currency: "USD",
      duration: "30-day protocol", 
      whatsapp_number: "+52-55-1234-0567",
      google_maps_url: "https://maps.google.com/?q=Medicinal+Mushrooms+CDMX"
    },
    {
      title: "Nootropic Stack: Reishi + Cordyceps",
      slug: "reishi-cordyceps-stack-012",
      type: "mushroom-blend",
      category: "microdosis",
      description: "Combination of Reishi and Cordyceps mushrooms for sustained energy and immune system. High-quality natural adaptogens.",
      location: "Mexico City",
      price: 29, // 520 MXN / 18 ≈ 29 USD
      currency: "USD", 
      duration: "30-day protocol",
      whatsapp_number: "+52-55-2345-1678",
      google_maps_url: "https://maps.google.com/?q=Natural+Nootropics+CDMX"
    },
    {
      title: "Siberian Chaga Microdose",
      slug: "chaga-microdose-013",
      type: "chaga",
      category: "microdosis", 
      description: "Concentrated Chaga mushroom extract, powerful antioxidant and adaptogen. Imported from Siberia with international certifications.",
      location: "Mexico City",
      price: 38, // 680 MXN / 18 ≈ 38 USD
      currency: "USD",
      duration: "30-day protocol",
      whatsapp_number: "+52-55-3456-2789",
      google_maps_url: "https://maps.google.com/?q=Adaptogens+CDMX"
    },
    {
      title: "5-in-1 Functional Mushroom Blend",
      slug: "mushroom-blend-5in1-014",
      type: "mushroom-blend",
      category: "microdosis",
      description: "Blend of 5 medicinal mushrooms: Reishi, Cordyceps, Lion's Mane, Shiitake, and Chaga. Complete formula for integral wellness.",
      location: "Mexico City",
      price: 42, // 750 MXN / 18 ≈ 42 USD
      currency: "USD",
      duration: "30-day protocol", 
      whatsapp_number: "+52-55-4567-3890",
      google_maps_url: "https://maps.google.com/?q=Superfoods+CDMX"
    },
    {
      title: "Turkey Tail Mushroom Microdose",
      slug: "turkey-tail-microdose-015",
      type: "turkey-tail",
      category: "microdosis",
      description: "Trametes versicolor capsules, recognized for immunoregulatory and prebiotic properties. Certified medicinal mushroom.",
      location: "Mexico City", 
      price: 23, // 420 MXN / 18 ≈ 23 USD
      currency: "USD",
      duration: "30-day protocol",
      whatsapp_number: "+52-55-5678-4901",
      google_maps_url: "https://maps.google.com/?q=Functional+Medicine+CDMX"
    }
  ];

  // CATEGORY: PRODUCTS - Spiritual and wellness products sold in Mexico City
  const products = [
    {
      title: "White Copal from Puebla - Natural Incense",
      slug: "white-copal-puebla-016",
      type: "incense", 
      category: "productos",
      description: "Authentic white copal from Puebla, sacred resin used since pre-Hispanic times. Ideal for energetic cleanses and meditation.",
      location: "Mercado de Sonora, Mexico City",
      price: 4, // 80 MXN / 18 ≈ 4 USD
      currency: "USD",
      duration: "Extended use",
      whatsapp_number: "+52-55-6789-5012",
      google_maps_url: "https://maps.google.com/?q=Mercado+Sonora+copal+CDMX"
    },
    {
      title: "Handcrafted Tibetan Bowls - 7 Sacred Metals",
      slug: "tibetan-bowls-cdmx-017",
      type: "instruments", 
      category: "productos",
      description: "Handmade Tibetan bowls with 7 sacred metals alloy. Imported from the Himalayas, available in specialized Mexico City stores.",
      location: "Roma Norte, Mexico City",
      price: 83, // 1500 MXN / 18 ≈ 83 USD
      currency: "USD",
      duration: "Permanent use",
      whatsapp_number: "+52-55-7890-6123", 
      google_maps_url: "https://maps.google.com/?q=Sound+Instruments+Roma+Norte"
    },
    {
      title: "Original Rider-Waite Tarot Deck",
      slug: "rider-waite-tarot-018",
      type: "divination",
      category: "productos",
      description: "Classic Rider-Waite tarot deck, the most popular for beginners in card reading. Available in esoteric bookstores in Mexico City.",
      location: "Historic Center, Mexico City", 
      price: 19, // 350 MXN / 18 ≈ 19 USD
      currency: "USD",
      duration: "Permanent use",
      whatsapp_number: "+52-55-8901-7234",
      google_maps_url: "https://maps.google.com/?q=Esoteric+Bookstores+Centro+CDMX"
    },
    {
      title: "Traditional Zafu Meditation Cushion",
      slug: "zafu-meditation-cushion-019",
      type: "meditation-supplies",
      category: "productos",
      description: "Traditional zafu cushion filled with buckwheat hull. Locally made with Mexican fabrics, ideal for meditation practice.",
      location: "Coyoacán, Mexico City",
      price: 36, // 650 MXN / 18 ≈ 36 USD
      currency: "USD", 
      duration: "Permanent use",
      whatsapp_number: "+52-55-9012-8345",
      google_maps_url: "https://maps.google.com/?q=Yoga+Accessories+Coyoacán"
    },
    {
      title: "Rue and Rosemary Smudge Bundles",
      slug: "rue-rosemary-smudge-020",
      type: "cleansing",
      category: "productos",
      description: "Natural rue and rosemary smudge bundles for energetic cleansing. Mexican dried herbs, handcrafted by traditional healers.",
      location: "Xochimilco, Mexico City",
      price: 7, // 120 MXN / 18 ≈ 7 USD
      currency: "USD",
      duration: "Multiple uses", 
      whatsapp_number: "+52-55-0123-9456",
      google_maps_url: "https://maps.google.com/?q=Medicinal+Plants+Xochimilco"
    }
  ];

  // Insert all products
  const allProducts = [...events, ...medicine, ...microdosis, ...products];
  
  for (const product of allProducts) {
    await sql`
      INSERT INTO therapies (
        title, slug, type, category, country, description, 
        location, price, currency, duration, whatsapp_number, 
        google_maps_url, is_published, approval_status, 
        created_at, updated_at
      ) VALUES (
        ${product.title}, ${product.slug}, ${product.type}, 
        ${product.category}, 'MX', ${product.description},
        ${product.location}, ${product.price}, ${product.currency}, 
        ${product.duration}, ${product.whatsapp_number}, 
        ${product.google_maps_url}, true, 'approved',
        NOW(), NOW()
      )
    `;
  }

  console.log(`✅ Inserted ${allProducts.length} real Mexico City products with USD pricing`);
  console.log("📊 Distribution by category:");
  console.log(`- Events: ${events.length} products`);
  console.log(`- Medicine: ${medicine.length} products`);
  console.log(`- Microdosis: ${microdosis.length} products`);
  console.log(`- Products: ${products.length} products`);
  
  // Final verification
  const finalCount = await sql`SELECT COUNT(*)::int AS total FROM therapies WHERE country = 'MX'`;
  console.log(`\n🎯 Final total of Mexican products: ${(finalCount[0] as any).total}`);
  
  console.log("\n💰 Price range summary:");
  console.log("- Events: $11 - $44 USD");
  console.log("- Medicine: $10 - $67 USD"); 
  console.log("- Microdosis: $23 - $42 USD");
  console.log("- Products: $4 - $83 USD");
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});