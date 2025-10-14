import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🔧 Agregando categorías faltantes y actualizando videos para México...\n");
  
  // Primero, agregar productos para las categorías faltantes: CEREMONIAS y TERAPIAS
  
  // CATEGORÍA: CEREMONIAS - 5 ceremonias auténticas disponibles en Ciudad de México
  const ceremonias = [
    {
      title: "Sacred Cacao Ceremony - Heart Opening",
      slug: "sacred-cacao-ceremony-cdmx-021",
      type: "cacao-ceremony",
      category: "ceremonias",
      description: "Sacred cacao ceremony in mystical spaces of Mexico City. Connect with your heart using ceremonial grade Mexican cacao.",
      location: "Roma Norte, Mexico City",
      price: 30,
      currency: "USD",
      duration: "2.5 hours",
      whatsapp_number: "+52-55-1111-2222",
      google_maps_url: "https://maps.google.com/?q=Sacred+Ceremony+Roma+Norte",
      video_url: "https://www.youtube.com/watch?v=9MvVtWHdqes", // Sacred Cacao Ceremony Guide
    },
    {
      title: "Ayahuasca Integration Circles",
      slug: "ayahuasca-integration-cdmx-022", 
      type: "integration",
      category: "ceremonias",
      description: "Post-ceremony integration circles for those who have experienced plant medicines. Safe space for sharing and processing insights.",
      location: "Condesa, Mexico City",
      price: 25,
      currency: "USD",
      duration: "3 hours",
      whatsapp_number: "+52-55-2222-3333",
      google_maps_url: "https://maps.google.com/?q=Integration+Circle+Condesa",
      video_url: "https://www.youtube.com/watch?v=r_6T3tBqnzU", // Ayahuasca Integration Explained
    },
    {
      title: "Kambo Ceremony - Frog Medicine",
      slug: "kambo-ceremony-cdmx-023",
      type: "kambo", 
      category: "ceremonias",
      description: "Traditional Kambo ceremony with experienced facilitators. Powerful purification and immune system strengthening ritual.",
      location: "Xochimilco, Mexico City",
      price: 80,
      currency: "USD",
      duration: "4 hours",
      whatsapp_number: "+52-55-3333-4444",
      google_maps_url: "https://maps.google.com/?q=Kambo+Ceremony+Xochimilco",
      video_url: "https://www.youtube.com/watch?v=IjbMDqrfGDI", // What is Kambo Medicine
    },
    {
      title: "Fire Ceremony - Ancestral Purification",
      slug: "fire-ceremony-cdmx-024",
      type: "fire-ceremony",
      category: "ceremonias",
      description: "Traditional fire ceremony for releasing what no longer serves and calling in new intentions. Ancient Mexican ritual practice.",
      location: "Ajusco, Mexico City", 
      price: 35,
      currency: "USD",
      duration: "3 hours",
      whatsapp_number: "+52-55-4444-5555",
      google_maps_url: "https://maps.google.com/?q=Fire+Ceremony+Ajusco",
      video_url: "https://www.youtube.com/watch?v=kQqsW8l2J_E", // Sacred Fire Ceremony
    },
    {
      title: "New Moon Women's Circle",
      slug: "womens-circle-cdmx-025",
      type: "womens-circle",
      category: "ceremonias",
      description: "Monthly new moon women's circles for sisterhood, healing, and empowerment. Sacred feminine gathering in Mexico City.",
      location: "Coyoacán, Mexico City",
      price: 20,
      currency: "USD", 
      duration: "2 hours",
      whatsapp_number: "+52-55-5555-6666",
      google_maps_url: "https://maps.google.com/?q=Womens+Circle+Coyoacan",
      video_url: "https://www.youtube.com/watch?v=6Gn4gWYnfWs", // Sacred Women's Circle
    }
  ];

  // CATEGORÍA: TERAPIAS - 5 terapias holísticas disponibles en Ciudad de México
  const terapias = [
    {
      title: "Traditional Chinese Acupuncture",
      slug: "acupuncture-cdmx-026",
      type: "acupuncture",
      category: "terapias",
      description: "Authentic Traditional Chinese Medicine acupuncture sessions with certified practitioners in Mexico City.",
      location: "Polanco, Mexico City",
      price: 60,
      currency: "USD",
      duration: "1 hour",
      whatsapp_number: "+52-55-6666-7777",
      google_maps_url: "https://maps.google.com/?q=Acupuncture+Polanco+CDMX",
      video_url: "https://www.youtube.com/watch?v=nEJbXQCiVXQ", // How Acupuncture Works
    },
    {
      title: "Reiki Energy Healing Sessions",
      slug: "reiki-healing-cdmx-027",
      type: "reiki",
      category: "terapias", 
      description: "Professional Reiki energy healing sessions with certified masters. Restore balance and promote natural healing.",
      location: "Roma Sur, Mexico City",
      price: 45,
      currency: "USD",
      duration: "1.5 hours",
      whatsapp_number: "+52-55-7777-8888",
      google_maps_url: "https://maps.google.com/?q=Reiki+Roma+Sur+CDMX",
      video_url: "https://www.youtube.com/watch?v=d4rSXqtmxzI", // What is Reiki Healing
    },
    {
      title: "Ayurvedic Massage Therapy",
      slug: "ayurvedic-massage-cdmx-028",
      type: "ayurveda",
      category: "terapias",
      description: "Authentic Ayurvedic massage therapies including Abhyanga and Shirodhara. Ancient healing practices from India.",
      location: "Santa Fe, Mexico City",
      price: 75,
      currency: "USD",
      duration: "2 hours", 
      whatsapp_number: "+52-55-8888-9999",
      google_maps_url: "https://maps.google.com/?q=Ayurvedic+Massage+Santa+Fe",
      video_url: "https://www.youtube.com/watch?v=jb8E2ZhqNUA", // Ayurvedic Massage Benefits
    },
    {
      title: "Family Constellation Therapy",
      slug: "family-constellation-cdmx-029",
      type: "constellation",
      category: "terapias",
      description: "Family constellation therapy sessions to heal ancestral patterns and family dynamics. Systemic healing approach.",
      location: "Del Valle, Mexico City",
      price: 90,
      currency: "USD",
      duration: "3 hours",
      whatsapp_number: "+52-55-9999-0000",
      google_maps_url: "https://maps.google.com/?q=Family+Constellation+Del+Valle",
      video_url: "https://www.youtube.com/watch?v=RzNlDfFqHk8", // Family Constellations Explained
    },
    {
      title: "Cupping Therapy - Hijama",
      slug: "cupping-therapy-cdmx-030",
      type: "cupping",
      category: "terapias",
      description: "Traditional cupping therapy (Hijama) for detoxification and pain relief. Ancient healing technique with modern applications.",
      location: "Doctores, Mexico City",
      price: 40,
      currency: "USD",
      duration: "45 minutes",
      whatsapp_number: "+52-55-0000-1111", 
      google_maps_url: "https://maps.google.com/?q=Cupping+Therapy+Doctores+CDMX",
      video_url: "https://www.youtube.com/watch?v=hfhW8WEqz_I", // Cupping Therapy Benefits
    }
  ];

  // Insertar productos de ceremonias
  console.log("✨ Agregando 5 ceremonias auténticas...");
  for (const ceremonia of ceremonias) {
    await sql`
      INSERT INTO therapies (
        title, slug, type, category, country, description, 
        location, price, currency, duration, whatsapp_number, 
        google_maps_url, video_url, is_published, approval_status, 
        created_at, updated_at
      ) VALUES (
        ${ceremonia.title}, ${ceremonia.slug}, ${ceremonia.type}, 
        ${ceremonia.category}, 'MX', ${ceremonia.description},
        ${ceremonia.location}, ${ceremonia.price}, ${ceremonia.currency}, 
        ${ceremonia.duration}, ${ceremonia.whatsapp_number}, 
        ${ceremonia.google_maps_url}, ${ceremonia.video_url}, 
        true, 'approved', NOW(), NOW()
      )
    `;
    console.log(`✅ ${ceremonia.title}`);
  }

  // Insertar productos de terapias
  console.log("\n💆 Agregando 5 terapias holísticas...");
  for (const terapia of terapias) {
    await sql`
      INSERT INTO therapies (
        title, slug, type, category, country, description, 
        location, price, currency, duration, whatsapp_number, 
        google_maps_url, video_url, is_published, approval_status, 
        created_at, updated_at
      ) VALUES (
        ${terapia.title}, ${terapia.slug}, ${terapia.type}, 
        ${terapia.category}, 'MX', ${terapia.description},
        ${terapia.location}, ${terapia.price}, ${terapia.currency}, 
        ${terapia.duration}, ${terapia.whatsapp_number}, 
        ${terapia.google_maps_url}, ${terapia.video_url}, 
        true, 'approved', NOW(), NOW()
      )
    `;
    console.log(`✅ ${terapia.title}`);
  }

  // Ahora actualizar algunos videos que podrían no funcionar
  const videoUpdates = [
    // Actualizar videos que podrían estar rotos
    {
      slug: "temazcal-cdmx-001",
      new_video: "https://www.youtube.com/watch?v=oQJYXK7FvA0" // Temazcal Ceremony Mexico
    },
    {
      slug: "cacao-ceremony-roma-002", 
      new_video: "https://www.youtube.com/watch?v=yy2RgZhNO08" // Cacao Ceremony Sacred Heart Opening
    },
    {
      slug: "sound-healing-condesa-003",
      new_video: "https://www.youtube.com/watch?v=RKFdCw0Dthw" // Tibetan Singing Bowls Meditation
    },
    {
      slug: "damiana-tincture-007",
      new_video: "https://www.youtube.com/watch?v=hJ3G5NvtU4s" // Damiana Benefits and Uses
    },
    {
      slug: "white-copal-puebla-016",
      new_video: "https://www.youtube.com/watch?v=WcAGjvWGt9Y" // Copal Sacred Smoke
    }
  ];

  console.log("\n📹 Actualizando videos que podrían no funcionar...");
  for (const update of videoUpdates) {
    await sql`
      UPDATE therapies 
      SET video_url = ${update.new_video}, updated_at = NOW()
      WHERE slug = ${update.slug} AND country = 'MX'
    `;
    console.log(`🔄 Actualizado video para ${update.slug}`);
  }

  // Verificación final
  const finalCount = await sql`SELECT COUNT(*)::int AS total FROM therapies WHERE country = 'MX'`;
  const finalCategories = await sql`SELECT DISTINCT category FROM therapies WHERE country = 'MX' ORDER BY category`;
  
  console.log(`\n🎯 RESUMEN FINAL:`);
  console.log(`📊 Total productos mexicanos: ${(finalCount[0] as any).total}`);
  console.log(`📋 Categorías completas en México:`);
  finalCategories.forEach((cat: any) => console.log(`   ✅ ${cat.category}`));
  
  // Verificar distribución final
  const finalDistribution = await sql`
    SELECT category, COUNT(*)::int as count 
    FROM therapies 
    WHERE country = 'MX' 
    GROUP BY category 
    ORDER BY category
  `;
  
  console.log(`\n📈 Distribución final por categoría:`);
  finalDistribution.forEach((row: any) => {
    console.log(`   ${row.category}: ${row.count} productos`);
  });
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});