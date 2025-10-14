import "dotenv/config";
import { db } from "../server/db";
import { therapies } from "../shared/schema";
import { sql } from "drizzle-orm";

// Función para generar slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedAllCategories() {
  try {
    console.log("🌱 Iniciando seed de todas las categorías...\n");

    // ID de guía de ejemplo (usar el primero que exista)
    const guideResult = await db.execute(sql`SELECT id, full_name, profile_photo_url FROM guides LIMIT 1`);
    const guide = guideResult.rows[0];
    
    if (!guide) {
      console.log("⚠️  No hay guías en la base de datos. Creando uno de ejemplo...");
      // Aquí podrías crear un guía de ejemplo si no existe
    }

    const guideId = guide?.id || null;
    const guideName = guide?.full_name || "Guía de Ejemplo";
    const guidePhotoUrl = guide?.profile_photo_url || null;

    // ==================== TERAPIAS ====================
    console.log("💆 Creando 10 terapias...");
    const terapias = [
      {
        title: "Terapia Holística Integral",
        description: "Sesión de terapia holística que integra cuerpo, mente y espíritu. Trabajamos con técnicas de respiración, meditación guiada y sanación energética.",
        type: "holistica",
        basePrice: "60",
        location: "Av. La Paz 456, Miraflores, Lima",
        googleMapsUrl: "https://maps.google.com/?q=Miraflores+Lima",
        duration: "90 minutos",
      },
      {
        title: "Reiki Nivel 1 y 2",
        description: "Sesión de Reiki tradicional japonés. Sanación energética a través de la imposición de manos. Ideal para reducir estrés y ansiedad.",
        type: "reiki",
        basePrice: "50",
        location: "Centro Holístico Luz, San Isidro",
        googleMapsUrl: "https://maps.google.com/?q=San+Isidro+Lima",
        duration: "60 minutos",
      },
      {
        title: "Terapia de Sonido con Cuencos Tibetanos",
        description: "Viaje sonoro con cuencos tibetanos, gongs y otros instrumentos ancestrales. Profunda relajación y armonización de chakras.",
        type: "sonido",
        basePrice: "70",
        location: "Espacio Sonoro, Barranco",
        googleMapsUrl: "https://maps.google.com/?q=Barranco+Lima",
        duration: "75 minutos",
      },
      {
        title: "Acupuntura Tradicional China",
        description: "Tratamiento de acupuntura con especialista certificado. Ideal para dolores crónicos, estrés y desequilibrios energéticos.",
        type: "acupuntura",
        basePrice: "80",
        location: "Clínica de Medicina China, Surco",
        googleMapsUrl: "https://maps.google.com/?q=Surco+Lima",
        duration: "60 minutos",
      },
      {
        title: "Masaje Ayurvédico Abhyanga",
        description: "Masaje tradicional ayurvédico con aceites medicinales. Desintoxica, relaja y equilibra los doshas.",
        type: "ayurveda",
        basePrice: "90",
        location: "Centro Ayurveda Perú, San Borja",
        googleMapsUrl: "https://maps.google.com/?q=San+Borja+Lima",
        duration: "90 minutos",
      },
      {
        title: "Terapia de Regresión a Vidas Pasadas",
        description: "Sesión de hipnosis regresiva para explorar vidas pasadas y sanar traumas del alma. Con terapeuta certificado.",
        type: "regresion",
        basePrice: "100",
        location: "Consultorio Privado, Miraflores",
        googleMapsUrl: "https://maps.google.com/?q=Miraflores+Lima",
        duration: "2 horas",
      },
      {
        title: "Constelaciones Familiares",
        description: "Sesión grupal de constelaciones familiares. Sana patrones transgeneracionales y libera cargas familiares.",
        type: "constelaciones",
        basePrice: "45",
        location: "Centro Sistémico, Jesús María",
        googleMapsUrl: "https://maps.google.com/?q=Jesus+Maria+Lima",
        duration: "3 horas",
      },
      {
        title: "Terapia Gestalt Individual",
        description: "Sesión individual de terapia Gestalt. Trabajo en el aquí y ahora para integrar aspectos de tu personalidad.",
        type: "gestalt",
        basePrice: "75",
        location: "Consultorio Gestalt, San Isidro",
        googleMapsUrl: "https://maps.google.com/?q=San+Isidro+Lima",
        duration: "60 minutos",
      },
      {
        title: "Aromaterapia y Reflexología",
        description: "Combinación de aromaterapia con aceites esenciales y reflexología podal. Profunda relajación y equilibrio.",
        type: "aromaterapia",
        basePrice: "55",
        location: "Spa Natural, Barranco",
        googleMapsUrl: "https://maps.google.com/?q=Barranco+Lima",
        duration: "75 minutos",
      },
      {
        title: "Terapia Floral de Bach",
        description: "Consulta y preparación personalizada de esencias florales de Bach. Equilibra emociones y estados mentales.",
        type: "flores-bach",
        basePrice: "40",
        location: "Consultorio Natural, Surco",
        googleMapsUrl: "https://maps.google.com/?q=Surco+Lima",
        duration: "45 minutos",
      },
    ];

    for (const terapia of terapias) {
      const basePrice = parseFloat(terapia.basePrice);
      const platformFee = basePrice * 0.25;
      const finalPrice = basePrice + platformFee;

      await db.insert(therapies).values({
        guideId: guideId,
        guideName: guideName,
        guidePhotoUrl: guidePhotoUrl,
        category: "terapias",
        title: terapia.title,
        slug: generateSlug(terapia.title),
        description: terapia.description,
        type: terapia.type,
        basePrice: basePrice.toString(),
        platformFee: platformFee.toString(),
        price: finalPrice.toString(),
        currency: "USD",
        location: terapia.location,
        googleMapsUrl: terapia.googleMapsUrl,
        duration: terapia.duration,
        whatsappNumber: "+51987654321",
        published: true,
        approvalStatus: "approved",
      });
    }
    console.log("✅ 10 terapias creadas\n");

    // ==================== MICRODOSIS ====================
    console.log("💊 Creando 10 microdosis...");
    const microdosis = [
      {
        title: "Microdosis de Psilocibina - 30 días",
        description: "Protocolo de microdosis de psilocibina para 30 días. Mejora creatividad, enfoque y bienestar emocional. Incluye guía de uso y seguimiento.",
        type: "psilocibina",
        basePrice: "120",
        duration: "30 días",
        inventory: 50,
      },
      {
        title: "Microdosis de Psilocibina - 90 días",
        description: "Protocolo extendido de 90 días. Ideal para procesos profundos de transformación personal. Incluye asesoría personalizada.",
        type: "psilocibina",
        basePrice: "300",
        duration: "90 días",
        inventory: 30,
      },
      {
        title: "Microdosis LSD - Protocolo Fadiman",
        description: "Protocolo Fadiman clásico: 1 día on, 2 días off. Para 30 días. Aumenta creatividad y productividad.",
        type: "lsd",
        basePrice: "150",
        duration: "30 días",
        inventory: 25,
      },
      {
        title: "Microdosis de Hongos Melena de León",
        description: "Microdosis de Lion's Mane para salud cerebral y cognitiva. Sin efectos psicoactivos. 60 cápsulas.",
        type: "lions-mane",
        basePrice: "80",
        duration: "60 días",
        inventory: 100,
      },
      {
        title: "Stack Completo: Psilocibina + Melena de León + Niacina",
        description: "El stack Stamets completo. Psilocibina, Lion's Mane y Niacina para neurogénesis y salud cerebral óptima.",
        type: "stack-stamets",
        basePrice: "180",
        duration: "30 días",
        inventory: 40,
      },
      {
        title: "Microdosis de Trufas Psilocibina",
        description: "Trufas de psilocibina en microdosis. Más suave que los hongos, ideal para principiantes. Protocolo de 30 días.",
        type: "trufas",
        basePrice: "140",
        duration: "30 días",
        inventory: 35,
      },
      {
        title: "Microdosis Psilocibina + Cacao Ceremonial",
        description: "Combinación de microdosis con cacao ceremonial. Potencia los efectos y abre el corazón. 30 días.",
        type: "psilocibina-cacao",
        basePrice: "160",
        duration: "30 días",
        inventory: 45,
      },
      {
        title: "Microdosis para Creatividad - Artistas",
        description: "Protocolo especial diseñado para artistas y creativos. Dosis optimizadas para flow creativo.",
        type: "creatividad",
        basePrice: "130",
        duration: "30 días",
        inventory: 30,
      },
      {
        title: "Microdosis para Meditación y Mindfulness",
        description: "Protocolo que combina microdosis con práctica meditativa. Incluye guías de meditación diarias.",
        type: "meditacion",
        basePrice: "140",
        duration: "30 días",
        inventory: 40,
      },
      {
        title: "Microdosis Starter Kit - Principiantes",
        description: "Kit completo para principiantes. Incluye báscula, diario de seguimiento, guía completa y 15 días de microdosis.",
        type: "starter-kit",
        basePrice: "90",
        duration: "15 días",
        inventory: 60,
      },
    ];

    for (const micro of microdosis) {
      const basePrice = parseFloat(micro.basePrice);
      const platformFee = basePrice * 0.25;
      const finalPrice = basePrice + platformFee;

      await db.insert(therapies).values({
        guideId: guideId,
        guideName: guideName,
        guidePhotoUrl: guidePhotoUrl,
        category: "microdosis",
        title: micro.title,
        slug: generateSlug(micro.title),
        description: micro.description,
        type: micro.type,
        basePrice: basePrice.toString(),
        platformFee: platformFee.toString(),
        price: finalPrice.toString(),
        currency: "USD",
        duration: micro.duration,
        inventory: micro.inventory,
        shippingOptions: { envio: true, recojo: true },
        whatsappNumber: "+51987654321",
        published: true,
        approvalStatus: "approved",
      });
    }
    console.log("✅ 10 microdosis creadas\n");

    // ==================== MEDICINA ====================
    console.log("🌱 Creando 10 medicinas...");
    const medicinas = [
      {
        title: "Rapé Sagrado - Tribu Yawanawá",
        description: "Rapé tradicional de la tribu Yawanawá. Limpia energías, centra la mente y abre los canales espirituales. 10g de medicina pura.",
        type: "rape",
        basePrice: "35",
        inventory: 80,
        componentes: ["Tabaco sagrado", "Cenizas de Tsunu", "Plantas medicinales"],
      },
      {
        title: "Sananga - Gotas para los Ojos",
        description: "Medicina amazónica para limpiar la visión física y espiritual. Fortalece la vista y limpia el campo energético. 5ml.",
        type: "sananga",
        basePrice: "30",
        inventory: 60,
        componentes: ["Extracto de Tabernaemontana", "Agua purificada"],
      },
      {
        title: "Aceite de Copaiba Medicinal",
        description: "Aceite puro de copaiba amazónica. Antiinflamatorio natural, cicatrizante y analgésico. Uso tópico e interno. 30ml.",
        type: "copaiba",
        basePrice: "45",
        inventory: 100,
        componentes: ["Aceite de Copaiba 100% puro"],
      },
      {
        title: "Cacao Ceremonial Premium - 500g",
        description: "Cacao ceremonial de origen peruano. 100% puro, sin azúcar ni aditivos. Para ceremonias y uso diario. Abre el corazón.",
        type: "cacao",
        basePrice: "40",
        inventory: 120,
        componentes: ["Cacao criollo 100% puro"],
      },
      {
        title: "Palo Santo Premium - 10 varitas",
        description: "Palo Santo de Ecuador, cosechado éticamente. Para limpias energéticas y meditación. Aroma dulce y purificador.",
        type: "palo-santo",
        basePrice: "25",
        inventory: 200,
        componentes: ["Bursera graveolens"],
      },
      {
        title: "Agua Florida Tradicional",
        description: "Agua Florida artesanal para limpias energéticas. Receta tradicional amazónica con hierbas y flores medicinales. 250ml.",
        type: "agua-florida",
        basePrice: "20",
        inventory: 150,
        componentes: ["Alcohol de caña", "Esencias florales", "Hierbas amazónicas"],
      },
      {
        title: "Tabaco Mapacho Orgánico",
        description: "Tabaco sagrado mapacho de la Amazonía peruana. Sin químicos ni aditivos. Para ceremonias y uso ritual. 50g.",
        type: "mapacho",
        basePrice: "30",
        inventory: 90,
        componentes: ["Nicotiana rustica orgánica"],
      },
      {
        title: "Aceite de Sangre de Drago",
        description: "Resina medicinal de la Amazonía. Cicatrizante potente, antiinflamatorio y protector gástrico. 15ml.",
        type: "sangre-drago",
        basePrice: "35",
        inventory: 70,
        componentes: ["Resina de Croton lechleri"],
      },
      {
        title: "Té de Ayahuasca Microdosis",
        description: "Té suave de ayahuasca para microdosis. Conexión espiritual sin viaje intenso. 10 sobres individuales.",
        type: "te-ayahuasca",
        basePrice: "60",
        inventory: 50,
        componentes: ["Banisteriopsis caapi", "Psychotria viridis"],
      },
      {
        title: "Kit de Limpieza Energética Completo",
        description: "Kit completo: Palo Santo, Agua Florida, Sahumerio, Rapé y guía de uso. Todo lo necesario para limpias energéticas.",
        type: "kit-limpieza",
        basePrice: "85",
        inventory: 40,
        componentes: ["Palo Santo", "Agua Florida", "Sahumerio", "Rapé", "Guía"],
      },
    ];

    for (const medicina of medicinas) {
      const basePrice = parseFloat(medicina.basePrice);
      const platformFee = basePrice * 0.25;
      const finalPrice = basePrice + platformFee;

      await db.insert(therapies).values({
        guideId: guideId,
        guideName: guideName,
        guidePhotoUrl: guidePhotoUrl,
        category: "medicina",
        title: medicina.title,
        slug: generateSlug(medicina.title),
        description: medicina.description,
        type: medicina.type,
        basePrice: basePrice.toString(),
        platformFee: platformFee.toString(),
        price: finalPrice.toString(),
        currency: "USD",
        inventory: medicina.inventory,
        shippingOptions: { envio: true, recojo: true, address: "Av. Arequipa 2345, Lince, Lima" },
        specificFields: { componentes: medicina.componentes },
        whatsappNumber: "+51987654321",
        published: true,
        approvalStatus: "approved",
      });
    }
    console.log("✅ 10 medicinas creadas\n");

    // ==================== EVENTOS ====================
    console.log("🎵 Creando 10 eventos...");
    const eventos = [
      {
        title: "Concierto de Música Medicina",
        description: "Noche de música medicina en vivo. Artistas internacionales con instrumentos ancestrales y electrónica orgánica.",
        type: "concierto",
        basePrice: "40",
        location: "Centro Cultural Barranco",
        date: "2025-02-15",
      },
      {
        title: "Café Concierto: Poesía y Música",
        description: "Tarde de poesía, música acústica y cacao ceremonial. Ambiente íntimo y acogedor.",
        type: "cafe-concierto",
        basePrice: "25",
        location: "Café Cultural La Noche, Barranco",
        date: "2025-02-20",
      },
      {
        title: "Festival de Música Consciente",
        description: "Festival de 2 días con artistas nacionales e internacionales. Música, talleres, ceremonias y más.",
        type: "festival",
        basePrice: "150",
        location: "Valle Sagrado, Cusco",
        date: "2025-03-10",
      },
      {
        title: "Ecstatic Dance - Danza Libre",
        description: "Sesión de danza libre y consciente. Sin alcohol, sin drogas, solo música y movimiento. Todos los viernes.",
        type: "danza",
        basePrice: "20",
        location: "Espacio Movimiento, Miraflores",
        date: "2025-02-16",
      },
      {
        title: "Kirtan - Canto Devocional",
        description: "Noche de mantras y cantos devocionales. Música en vivo con instrumentos tradicionales de India.",
        type: "kirtan",
        basePrice: "15",
        location: "Centro de Yoga Ananda, San Isidro",
        date: "2025-02-18",
      },
      {
        title: "Taller de Tambores Chamánicos",
        description: "Aprende a tocar el tambor chamánico. Incluye ceremonia de activación del tambor y viaje sonoro.",
        type: "taller",
        basePrice: "60",
        location: "Espacio Sonoro, Barranco",
        date: "2025-02-22",
      },
      {
        title: "Retiro de Silencio y Meditación Vipassana",
        description: "Retiro de 3 días en silencio. Meditación Vipassana, comida vegetariana y alojamiento incluido.",
        type: "retiro",
        basePrice: "200",
        location: "Centro Vipassana, Pachacamac",
        date: "2025-03-01",
      },
      {
        title: "Concierto de Cuencos Tibetanos",
        description: "Concierto inmersivo de cuencos tibetanos. 90 minutos de viaje sonoro profundo. Trae tu mat.",
        type: "concierto",
        basePrice: "35",
        location: "Sala de Yoga Prana, San Borja",
        date: "2025-02-25",
      },
      {
        title: "Música al Aire Libre - Full Moon",
        description: "Celebración de luna llena con música en vivo, fogata y cacao ceremonial. En la naturaleza.",
        type: "musica-aire-libre",
        basePrice: "30",
        location: "Lomas de Lúcumo, Pachacamac",
        date: "2025-02-28",
      },
      {
        title: "Taller de Cantos Icaros Amazónicos",
        description: "Aprende los icaros tradicionales de la Amazonía. Taller de 4 horas con maestro curandero.",
        type: "taller",
        basePrice: "50",
        location: "Casa Medicina, Barranco",
        date: "2025-03-05",
      },
    ];

    for (const evento of eventos) {
      const basePrice = parseFloat(evento.basePrice);
      const platformFee = basePrice * 0.25;
      const finalPrice = basePrice + platformFee;

      await db.insert(therapies).values({
        guideId: guideId,
        guideName: guideName,
        guidePhotoUrl: guidePhotoUrl,
        category: "eventos",
        title: evento.title,
        slug: generateSlug(evento.title),
        description: evento.description,
        type: evento.type,
        basePrice: basePrice.toString(),
        platformFee: platformFee.toString(),
        price: finalPrice.toString(),
        currency: "USD",
        location: evento.location,
        availableDates: [evento.date],
        whatsappNumber: "+51987654321",
        published: true,
        approvalStatus: "approved",
      });
    }
    console.log("✅ 10 eventos creados\n");

    // ==================== PRODUCTOS ====================
    console.log("🛍️ Creando 10 productos...");
    const productos = [
      {
        title: "Tambor Chamánico Artesanal",
        description: "Tambor chamánico hecho a mano con cuero natural y madera de cedro. Sonido profundo y resonante. Incluye baqueta.",
        type: "instrumento",
        basePrice: "180",
        inventory: 15,
      },
      {
        title: "Mala de 108 Cuentas - Rudraksha",
        description: "Mala tradicional de 108 cuentas de Rudraksha. Para meditación y mantras. Energía poderosa y protectora.",
        type: "mala",
        basePrice: "45",
        inventory: 50,
      },
      {
        title: "Libro: El Camino del Chamán",
        description: "Guía completa sobre chamanismo moderno. Incluye prácticas, rituales y enseñanzas ancestrales. 350 páginas.",
        type: "libro",
        basePrice: "30",
        inventory: 100,
      },
      {
        title: "Cuenco Tibetano Cantado a Mano - 7 Metales",
        description: "Cuenco tibetano auténtico de 7 metales. Hecho a mano en Nepal. Incluye cojín y baqueta. Sonido cristalino.",
        type: "cuenco",
        basePrice: "120",
        inventory: 25,
      },
      {
        title: "Tapete de Meditación Artesanal",
        description: "Tapete tejido a mano con fibras naturales. Diseño mandala. Perfecto para meditación y yoga. 80x80cm.",
        type: "tapete",
        basePrice: "60",
        inventory: 40,
      },
      {
        title: "Incienso Natural Palo Santo - 50 varitas",
        description: "Caja de 50 varitas de incienso de Palo Santo. Aroma dulce y purificador. Duración aproximada: 3 meses.",
        type: "incienso",
        basePrice: "35",
        inventory: 80,
      },
      {
        title: "Péndulo de Cuarzo para Radiestesia",
        description: "Péndulo de cuarzo transparente con cadena de plata. Para radiestesia, sanación y trabajo energético.",
        type: "pendulo",
        basePrice: "40",
        inventory: 60,
      },
      {
        title: "Baraja de Tarot Rider-Waite",
        description: "Baraja clásica Rider-Waite. 78 cartas con guía de interpretación en español. Ideal para principiantes.",
        type: "tarot",
        basePrice: "35",
        inventory: 70,
      },
      {
        title: "Cojín de Meditación Zafu",
        description: "Cojín de meditación tradicional relleno de trigo sarraceno. Funda de algodón orgánico. Altura ajustable.",
        type: "cojin",
        basePrice: "55",
        inventory: 45,
      },
      {
        title: "Difusor Ultrasónico + Set de Aceites",
        description: "Difusor de aromas ultrasónico con luz LED. Incluye set de 6 aceites esenciales puros. Perfecto para meditación.",
        type: "difusor",
        basePrice: "70",
        inventory: 35,
      },
    ];

    for (const producto of productos) {
      const basePrice = parseFloat(producto.basePrice);
      const platformFee = basePrice * 0.25;
      const finalPrice = basePrice + platformFee;

      await db.insert(therapies).values({
        guideId: guideId,
        guideName: guideName,
        guidePhotoUrl: guidePhotoUrl,
        category: "productos",
        title: producto.title,
        slug: generateSlug(producto.title),
        description: producto.description,
        type: producto.type,
        basePrice: basePrice.toString(),
        platformFee: platformFee.toString(),
        price: finalPrice.toString(),
        currency: "USD",
        inventory: producto.inventory,
        shippingOptions: { envio: true, recojo: true, address: "Av. Arequipa 2345, Lince, Lima" },
        specificFields: producto.componentes ? { componentes: producto.componentes } : {},
        whatsappNumber: "+51987654321",
        published: true,
        approvalStatus: "approved",
      });
    }
    console.log("✅ 10 productos creados\n");

    // ==================== ESTADÍSTICAS FINALES ====================
    console.log("📊 Estadísticas finales por categoría:");
    const finalStats = await db.execute(sql`
      SELECT 
        category,
        COUNT(*) as total,
        AVG(base_price::numeric) as avg_base_price,
        AVG(price::numeric) as avg_final_price,
        SUM(CASE WHEN inventory IS NOT NULL THEN inventory ELSE 0 END) as total_inventory
      FROM therapies
      WHERE is_published = true
      GROUP BY category
      ORDER BY category
    `);

    console.table(finalStats.rows);

    console.log("\n✅ Seed completado exitosamente!");
    console.log("\n📝 Resumen:");
    console.log("   - Ceremonias: Ya existían (15)");
    console.log("   - Terapias: 10 nuevas");
    console.log("   - Microdosis: 10 nuevas");
    console.log("   - Medicina: 10 nuevas");
    console.log("   - Eventos: 10 nuevas");
    console.log("   - Productos: 10 nuevas");
    console.log("\n   Total: ~55 elementos en la plataforma 🎉");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  }
}

seedAllCategories();
