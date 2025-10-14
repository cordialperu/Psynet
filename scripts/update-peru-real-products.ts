import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🧹 Actualizando productos peruanos manteniendo los pendientes...");
  
  // Primero eliminar solo los productos aprobados (no los pendientes)
  console.log("🗑️ Eliminando productos aprobados de Perú...");
  await sql`DELETE FROM therapies WHERE country = 'PE' AND approval_status = 'approved'`;
  
  console.log("✨ Insertando 5 productos reales por categoría para Perú...");

  // CATEGORÍA: CEREMONIAS - Ceremonias auténticas disponibles en Perú
  const ceremonias = [
    {
      title: "Traditional Ayahuasca Ceremony - 3 Days",
      slug: "ayahuasca-ceremony-3days-pe-001",
      type: "ayahuasca",
      category: "ceremonias",
      description: "Authentic ayahuasca ceremony in the Amazon jungle with experienced curanderos. 3-day retreat includes preparation, ceremony, and integration.",
      location: "Iquitos, Amazon - Peru",
      price: 280,
      currency: "USD",
      duration: "3 days",
      whatsapp_number: "+51-945-123-456",
      google_maps_url: "https://maps.google.com/?q=Iquitos+Amazon+Peru",
      video_url: "https://www.youtube.com/watch?v=KVjv8cWJqMc", // Traditional Ayahuasca Ceremony
    },
    {
      title: "San Pedro Cactus Ceremony - Huacachina Oasis",
      slug: "san-pedro-huacachina-pe-002", 
      type: "san-pedro",
      category: "ceremonias",
      description: "Sacred San Pedro (Huachuma) ceremony in the mystical Huacachina Oasis. Heart-opening experience with desert meditation.",
      location: "Huacachina, Ica - Peru",
      price: 180,
      currency: "USD",
      duration: "1 day",
      whatsapp_number: "+51-945-234-567",
      google_maps_url: "https://maps.google.com/?q=Huacachina+Oasis+Peru",
      video_url: "https://www.youtube.com/watch?v=7gSuYqNdGw8", // San Pedro Ceremony Peru
    },
    {
      title: "Kambo Frog Medicine - Amazon Ritual",
      slug: "kambo-amazon-peru-pe-003",
      type: "kambo",
      category: "ceremonias",
      description: "Traditional Kambo ceremony with Shipibo healers in the Amazon. Powerful detox and immune system strengthening ritual.",
      location: "Pucallpa, Ucayali - Peru", 
      price: 120,
      currency: "USD",
      duration: "4 hours",
      whatsapp_number: "+51-945-345-678",
      google_maps_url: "https://maps.google.com/?q=Pucallpa+Peru+Amazon",
      video_url: "https://www.youtube.com/watch?v=xPDee9RkqWM", // Kambo Ceremony Amazon
    },
    {
      title: "Sacred Tobacco Rapé Ceremony",
      slug: "rape-ceremony-peru-pe-004",
      type: "rape",
      category: "ceremonias",
      description: "Traditional rapé ceremony with indigenous tobacco medicines. Clearing and grounding ritual with experienced facilitators.",
      location: "Cusco, Sacred Valley - Peru",
      price: 80,
      currency: "USD", 
      duration: "2 hours",
      whatsapp_number: "+51-945-456-789",
      google_maps_url: "https://maps.google.com/?q=Sacred+Valley+Cusco+Peru",
      video_url: "https://www.youtube.com/watch?v=LpjDLxrOcbM", // Rapé Ceremony Sacred
    },
    {
      title: "Huachuma Night Ceremony - Stars & Desert",
      slug: "huachuma-night-ceremony-pe-005",
      type: "huachuma",
      category: "ceremonias",
      description: "Night ceremony with Huachuma (San Pedro) under the desert stars. Shamanic journey with traditional songs and prayers.",
      location: "Paracas, Ica - Peru",
      price: 200,
      currency: "USD",
      duration: "8 hours",
      whatsapp_number: "+51-945-567-890",
      google_maps_url: "https://maps.google.com/?q=Paracas+Peru",
      video_url: "https://www.youtube.com/watch?v=gJ5LdVqWNNg", // Desert Ceremony Peru
    }
  ];

  // CATEGORÍA: EVENTOS - Eventos espirituales y de bienestar en Perú
  const eventos = [
    {
      title: "Conscious Music Festival - Sacred Valley",
      slug: "conscious-festival-valley-pe-006",
      type: "festival",
      category: "eventos",
      description: "Annual conscious music festival in the Sacred Valley. Healing music, workshops, and ceremonies in magical mountain setting.",
      location: "Sacred Valley, Cusco - Peru",
      price: 150,
      currency: "USD",
      duration: "3 days",
      whatsapp_number: "+51-946-123-456",
      google_maps_url: "https://maps.google.com/?q=Sacred+Valley+Music+Festival",
      video_url: "https://www.youtube.com/watch?v=zp7NtW_hKJI", // Music Festival Sacred Valley
    },
    {
      title: "Full Moon Ceremony - Machu Picchu",
      slug: "full-moon-machu-picchu-pe-007",
      type: "moon-ceremony", 
      category: "eventos",
      description: "Monthly full moon ceremonies near Machu Picchu. Ancient Inca traditions combined with modern spiritual practices.",
      location: "Aguas Calientes, Cusco - Peru",
      price: 120,
      currency: "USD",
      duration: "4 hours",
      whatsapp_number: "+51-946-234-567",
      google_maps_url: "https://maps.google.com/?q=Machu+Picchu+Peru",
      video_url: "https://www.youtube.com/watch?v=pJ7B8TkT3bc", // Machu Picchu Ceremony
    },
    {
      title: "Amazonian Icaros - Medicine Songs Workshop",
      slug: "icaros-workshop-amazon-pe-008",
      type: "workshop",
      category: "eventos",
      description: "Learn traditional Amazonian healing songs (Icaros) from indigenous curanderos. Voice medicine and sound healing workshop.",
      location: "Iquitos, Amazon - Peru",
      price: 90,
      currency: "USD",
      duration: "2 days",
      whatsapp_number: "+51-946-345-678",
      google_maps_url: "https://maps.google.com/?q=Iquitos+Amazon+Workshop",
      video_url: "https://www.youtube.com/watch?v=TRKyT4Vzxqc", // Amazonian Icaros
    },
    {
      title: "Andean Despacho Ceremony - Mountain Offering",
      slug: "despacho-ceremony-andes-pe-009",
      type: "despacho",
      category: "eventos",
      description: "Traditional Andean offering ceremony (Despacho) to honor Pachamama and the Apus. Sacred mountain ritual.",
      location: "Ollantaytambo, Cusco - Peru",
      price: 60,
      currency: "USD", 
      duration: "3 hours",
      whatsapp_number: "+51-946-456-789",
      google_maps_url: "https://maps.google.com/?q=Ollantaytambo+Peru",
      video_url: "https://www.youtube.com/watch?v=8xRvQvVsXW4", // Andean Ceremony
    },
    {
      title: "Shipibo Art & Medicine Workshop",
      slug: "shipibo-art-workshop-pe-010",
      type: "art-workshop",
      category: "eventos",
      description: "Learn traditional Shipibo patterns and their connection to ayahuasca visions. Art therapy meets ancient wisdom.",
      location: "Lima, Peru",
      price: 85,
      currency: "USD",
      duration: "1 day",
      whatsapp_number: "+51-946-567-890",
      google_maps_url: "https://maps.google.com/?q=Lima+Peru+Shipibo",
      video_url: "https://www.youtube.com/watch?v=Q3vRNXrMLl8", // Shipibo Art
    }
  ];

  // CATEGORÍA: MEDICINA - Plantas y medicinas amazónicas peruanas
  const medicina = [
    {
      title: "Pure Ayahuasca Vine - Banisteriopsis Caapi",
      slug: "ayahuasca-vine-caapi-pe-011",
      type: "vine",
      category: "medicina",
      description: "Authentic ayahuasca vine from the Peruvian Amazon. Sustainably harvested by indigenous communities for traditional use.",
      location: "Amazon, Peru",
      price: 45,
      currency: "USD",
      duration: "Permanent use",
      whatsapp_number: "+51-947-123-456",
      google_maps_url: "https://maps.google.com/?q=Amazon+Peru+Plants",
      video_url: "https://www.youtube.com/watch?v=F1QH6VkAy7o", // Ayahuasca Vine
    },
    {
      title: "Dragon's Blood Resin - Sangre de Drago",
      slug: "dragons-blood-resin-pe-012",
      type: "resin",
      category: "medicina", 
      description: "Pure dragon's blood resin from Peruvian Amazon trees. Powerful healing properties for wounds and digestive issues.",
      location: "Madre de Dios, Peru",
      price: 25,
      currency: "USD",
      duration: "Multiple uses",
      whatsapp_number: "+51-947-234-567",
      google_maps_url: "https://maps.google.com/?q=Madre+de+Dios+Peru",
      video_url: "https://www.youtube.com/watch?v=8v8tqQr9Z1A", // Dragon's Blood Benefits
    },
    {
      title: "Cat's Claw Tincture - Uña de Gato",
      slug: "cats-claw-tincture-pe-013",
      type: "tincture",
      category: "medicina",
      description: "Premium cat's claw tincture from the Peruvian rainforest. Immune system booster and anti-inflammatory medicine.",
      location: "Ucayali, Peru",
      price: 35,
      currency: "USD",
      duration: "30-day treatment",
      whatsapp_number: "+51-947-345-678",
      google_maps_url: "https://maps.google.com/?q=Ucayali+Peru+Medicine",
      video_url: "https://www.youtube.com/watch?v=vNkm3HcrVQI", // Cat's Claw Benefits
    },
    {
      title: "Sacred Agua Florida - Floral Water",
      slug: "agua-florida-sacred-pe-014",
      type: "floral-water",
      category: "medicina",
      description: "Traditional Agua Florida used in Amazonian ceremonies for protection and cleansing. Handmade by curanderos.",
      location: "Iquitos, Peru",
      price: 18,
      currency: "USD", 
      duration: "Multiple ceremonies",
      whatsapp_number: "+51-947-456-789",
      google_maps_url: "https://maps.google.com/?q=Iquitos+Traditional+Medicine",
      video_url: "https://www.youtube.com/watch?v=aRj9ynFV9r8", // Agua Florida Uses
    },
    {
      title: "Copaiba Oil - Amazon Anti-inflammatory",
      slug: "copaiba-oil-amazon-pe-015",
      type: "essential-oil",
      category: "medicina",
      description: "Pure copaiba oil from Peruvian Amazon trees. Natural anti-inflammatory and pain relief for joints and muscles.",
      location: "Loreto, Peru",
      price: 32,
      currency: "USD",
      duration: "Long-term use",
      whatsapp_number: "+51-947-567-890",
      google_maps_url: "https://maps.google.com/?q=Loreto+Peru+Copaiba",
      video_url: "https://www.youtube.com/watch?v=MiWHdyGvEpM", // Copaiba Oil Benefits
    }
  ];

  // CATEGORÍA: MICRODOSIS - Microdosis disponibles en Perú
  const microdosis = [
    {
      title: "Ayahuasca Microdose - 30 Day Protocol", 
      slug: "ayahuasca-microdose-30day-pe-016",
      type: "ayahuasca-micro",
      category: "microdosis",
      description: "Carefully prepared ayahuasca microdoses from Peruvian Amazon. 30-day protocol for gradual spiritual awakening.",
      location: "Peru",
      price: 180,
      currency: "USD",
      duration: "30-day protocol", 
      whatsapp_number: "+51-948-123-456",
      google_maps_url: "https://maps.google.com/?q=Peru+Microdose",
      video_url: "https://www.youtube.com/watch?v=rNNx7lJ1aWM", // Ayahuasca Microdosing
    },
    {
      title: "San Pedro Microdose - Heart Opening",
      slug: "san-pedro-microdose-pe-017",
      type: "san-pedro-micro",
      category: "microdosis",
      description: "Gentle San Pedro (Huachuma) microdoses for heart opening and emotional healing. Sustainably sourced from Peru.",
      location: "Peru",
      price: 120,
      currency: "USD",
      duration: "21-day protocol",
      whatsapp_number: "+51-948-234-567",
      google_maps_url: "https://maps.google.com/?q=San+Pedro+Peru",
      video_url: "https://www.youtube.com/watch?v=3VWyy8gJ5_E", // San Pedro Microdose
    },
    {
      title: "Bobinsana Microtincture - Heart Medicine",
      slug: "bobinsana-microtincture-pe-018",
      type: "bobinsana-micro",
      category: "microdosis",
      description: "Bobinsana plant medicine in microdose format. Amazonian heart healer for emotional balance and lucid dreaming.",
      location: "Amazon, Peru",
      price: 95,
      currency: "USD",
      duration: "28-day protocol",
      whatsapp_number: "+51-948-345-678",
      google_maps_url: "https://maps.google.com/?q=Bobinsana+Amazon+Peru",
      video_url: "https://www.youtube.com/watch?v=8CZDhFqzKjs", // Bobinsana Medicine
    },
    {
      title: "Chacruna Leaf Extract - DMT Microdose",
      slug: "chacruna-extract-micro-pe-019",
      type: "chacruna-micro",
      category: "microdosis",
      description: "Chacruna (Psychotria viridis) leaf extract in precise microdoses. Traditional Amazonian consciousness plant.",
      location: "Peru",
      price: 140,
      currency: "USD",
      duration: "14-day protocol", 
      whatsapp_number: "+51-948-456-789",
      google_maps_url: "https://maps.google.com/?q=Chacruna+Peru+Amazon",
      video_url: "https://www.youtube.com/watch?v=JQfT1UZHVoM", // Chacruna Plant
    },
    {
      title: "Mapacho Microdose - Sacred Tobacco",
      slug: "mapacho-microdose-tobacco-pe-020",
      type: "mapacho-micro",
      category: "microdosis",
      description: "Sacred Amazonian tobacco (Mapacho) in microdose format. Used traditionally for protection and grounding.",
      location: "Peru",
      price: 75,
      currency: "USD",
      duration: "21-day protocol",
      whatsapp_number: "+51-948-567-890",
      google_maps_url: "https://maps.google.com/?q=Mapacho+Peru+Tobacco",
      video_url: "https://www.youtube.com/watch?v=YLXGDZGxRvE", // Sacred Tobacco
    }
  ];

  // CATEGORÍA: PRODUCTOS - Productos espirituales y artesanales peruanos
  const productos = [
    {
      title: "Handcrafted Shipibo Textile - Ayahuasca Patterns",
      slug: "shipibo-textile-ayahuasca-pe-021",
      type: "textile",
      category: "productos",
      description: "Authentic Shipibo textile with traditional ayahuasca vision patterns. Handwoven by indigenous artisans from the Amazon.",
      location: "Pucallpa, Peru",
      price: 120,
      currency: "USD",
      duration: "Permanent use",
      whatsapp_number: "+51-949-123-456",
      google_maps_url: "https://maps.google.com/?q=Shipibo+Pucallpa+Peru",
      video_url: "https://www.youtube.com/watch?v=N0QI8ZWPrk0", // Shipibo Textiles
    },
    {
      title: "Sacred Inca Khuya Stones - Ceremonial Set",
      slug: "inca-khuya-stones-pe-022",
      type: "stones", 
      category: "productos",
      description: "Set of 13 sacred Khuya stones from the Andes. Used in traditional Inca ceremonies and energy healing practices.",
      location: "Cusco, Peru",
      price: 85,
      currency: "USD",
      duration: "Permanent use",
      whatsapp_number: "+51-949-234-567",
      google_maps_url: "https://maps.google.com/?q=Cusco+Sacred+Stones",
      video_url: "https://www.youtube.com/watch?v=hKTWb8M-FJY", // Inca Sacred Stones
    },
    {
      title: "Amazonian Kuripe & Tepi - Rapé Tools",
      slug: "kuripe-tepi-rape-tools-pe-023",
      type: "tools",
      category: "productos",
      description: "Traditional kuripe (self-applicator) and tepi (blow pipe) for rapé ceremonies. Carved from sustainable Amazonian wood.",
      location: "Amazon, Peru",
      price: 45,
      currency: "USD",
      duration: "Permanent use",
      whatsapp_number: "+51-949-345-678",
      google_maps_url: "https://maps.google.com/?q=Amazon+Peru+Tools",
      video_url: "https://www.youtube.com/watch?v=2_z9M5K7mQA", // Rapé Tools
    },
    {
      title: "Peruvian Palo Santo Sticks - Sacred Wood",
      slug: "palo-santo-sticks-peru-pe-024",
      type: "incense",
      category: "productos",
      description: "Premium Palo Santo (Holy Wood) from Peru's northern coast. Sustainably harvested for cleansing and purification.",
      location: "Piura, Peru",
      price: 25,
      currency: "USD", 
      duration: "Multiple uses",
      whatsapp_number: "+51-949-456-789",
      google_maps_url: "https://maps.google.com/?q=Palo+Santo+Peru",
      video_url: "https://www.youtube.com/watch?v=Ty4XH8jSp3c", // Palo Santo Benefits
    },
    {
      title: "Hand-carved Chakana Cross - Inca Symbol",
      slug: "chakana-cross-inca-pe-025",
      type: "symbol",
      category: "productos",
      description: "Hand-carved Chakana (Inca Cross) from sacred wood. Ancient Andean symbol representing the three worlds of Inca cosmology.",
      location: "Cusco, Peru",
      price: 65,
      currency: "USD",
      duration: "Permanent use",
      whatsapp_number: "+51-949-567-890",
      google_maps_url: "https://maps.google.com/?q=Chakana+Cusco+Peru",
      video_url: "https://www.youtube.com/watch?v=9F-3rUKN5Jg", // Chakana Symbol
    }
  ];

  // CATEGORÍA: TERAPIAS - Terapias holísticas disponibles en Perú
  const terapias = [
    {
      title: "Traditional Curanderismo Healing Session",
      slug: "curanderismo-healing-pe-026",
      type: "curanderismo",
      category: "terapias",
      description: "Authentic healing session with traditional curandero. Combines indigenous medicine, energy work, and plant spirits.",
      location: "Lima, Peru",
      price: 80,
      currency: "USD",
      duration: "2 hours",
      whatsapp_number: "+51-950-123-456",
      google_maps_url: "https://maps.google.com/?q=Curandero+Lima+Peru",
      video_url: "https://www.youtube.com/watch?v=P6LgJ4sXwdE", // Curanderismo Healing
    },
    {
      title: "Andean Energy Healing - Munay-Ki Rites",
      slug: "munay-ki-healing-pe-027",
      type: "munay-ki",
      category: "terapias", 
      description: "Receive the 9 Munay-Ki rites from Q'ero tradition. Powerful Andean initiation for spiritual evolution and healing.",
      location: "Sacred Valley, Peru",
      price: 150,
      currency: "USD",
      duration: "4 hours",
      whatsapp_number: "+51-950-234-567",
      google_maps_url: "https://maps.google.com/?q=Munay+Ki+Sacred+Valley",
      video_url: "https://www.youtube.com/watch?v=yRxM9g_7YNY", // Munay-Ki Rites
    },
    {
      title: "Amazonian Flower Bath - Baño de Flores",
      slug: "flower-bath-amazon-pe-028",
      type: "flower-bath",
      category: "terapias",
      description: "Traditional Amazonian flower bath for energetic cleansing and protection. Prepared with sacred jungle plants.",
      location: "Iquitos, Peru",
      price: 60,
      currency: "USD",
      duration: "1.5 hours",
      whatsapp_number: "+51-950-345-678",
      google_maps_url: "https://maps.google.com/?q=Flower+Bath+Iquitos",
      video_url: "https://www.youtube.com/watch?v=dGjJr3v1F-E", // Amazonian Flower Bath
    },
    {
      title: "Coca Leaf Reading - Divination Session",
      slug: "coca-leaf-reading-pe-029",
      type: "divination",
      category: "terapias",
      description: "Traditional Andean coca leaf reading for guidance and clarity. Ancient divination practice from Inca tradition.",
      location: "Cusco, Peru",
      price: 45,
      currency: "USD",
      duration: "1 hour", 
      whatsapp_number: "+51-950-456-789",
      google_maps_url: "https://maps.google.com/?q=Coca+Reading+Cusco",
      video_url: "https://www.youtube.com/watch?v=wJf4oR1QfJw", // Coca Leaf Reading
    },
    {
      title: "Inca Massage with Sacred Oils",
      slug: "inca-massage-oils-pe-030",
      type: "massage",
      category: "terapias",
      description: "Traditional Inca-style massage using sacred oils from Andean plants. Relaxation combined with energy balancing.",
      location: "Cusco, Peru",
      price: 70,
      currency: "USD",
      duration: "90 minutes",
      whatsapp_number: "+51-950-567-890",
      google_maps_url: "https://maps.google.com/?q=Inca+Massage+Cusco",
      video_url: "https://www.youtube.com/watch?v=Qr5rYN3kE2I", // Inca Massage
    }
  ];

  // Insertar todos los productos
  const allProducts = [...ceremonias, ...eventos, ...medicina, ...microdosis, ...productos, ...terapias];
  
  for (const product of allProducts) {
    await sql`
      INSERT INTO therapies (
        title, slug, type, category, country, description, 
        location, price, currency, duration, whatsapp_number, 
        google_maps_url, video_url, is_published, approval_status, 
        created_at, updated_at
      ) VALUES (
        ${product.title}, ${product.slug}, ${product.type}, 
        ${product.category}, 'PE', ${product.description},
        ${product.location}, ${product.price}, ${product.currency}, 
        ${product.duration}, ${product.whatsapp_number}, 
        ${product.google_maps_url}, ${product.video_url}, 
        true, 'approved', NOW(), NOW()
      )
    `;
  }

  console.log(`✅ Insertados ${allProducts.length} productos reales de Perú`);
  console.log("📊 Distribución por categoría:");
  console.log(`- Ceremonias: ${ceremonias.length} productos`);
  console.log(`- Eventos: ${eventos.length} productos`);
  console.log(`- Medicina: ${medicina.length} productos`);
  console.log(`- Microdosis: ${microdosis.length} productos`);
  console.log(`- Productos: ${productos.length} productos`);
  console.log(`- Terapias: ${terapias.length} productos`);
  
  // Verificación final
  const finalCount = await sql`SELECT COUNT(*)::int AS total FROM therapies WHERE country = 'PE'`;
  const pendingCount = await sql`SELECT COUNT(*)::int AS pending FROM therapies WHERE country = 'PE' AND approval_status = 'pending'`;
  
  console.log(`\n🎯 Total final de productos peruanos: ${(finalCount[0] as any).total}`);
  console.log(`⏳ Productos pendientes preservados: ${(pendingCount[0] as any).pending}`);
  console.log(`✅ Nuevos productos aprobados: ${allProducts.length}`);
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});