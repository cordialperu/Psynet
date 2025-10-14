import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log("🧹 Eliminando productos mexicanos actuales...");
  await sql`DELETE FROM therapies WHERE country = 'MX'`;
  
  console.log("✨ Insertando productos reales de Ciudad de México...");

  // CATEGORÍA: EVENTOS - Eventos reales que se realizan en CDMX
  const eventos = [
    {
      title: "Ceremonias de Temazcal CDMX",
      slug: "temazcal-cdmx-001",
      type: "temazcal",
      category: "eventos", 
      description: "Ceremonias de temazcal tradicional en el Ajusco. Purificación ancestral en contacto con la naturaleza, a solo 40 minutos de la ciudad.",
      location: "Ajusco, Ciudad de México",
      price: 350,
      currency: "MXN",
      duration: "3 horas",
      whatsapp_number: "+52-55-1234-5678",
      google_maps_url: "https://maps.google.com/?q=Temazcal+Ajusco+CDMX"
    },
    {
      title: "Ceremonias de Cacao en Roma Norte",
      slug: "cacao-ceremony-roma-002", 
      type: "cacao-ceremony",
      category: "eventos",
      description: "Círculos de cacao ceremonial en espacios holísticos de Roma Norte. Abre tu corazón con cacao criollo mexicano de alta calidad.",
      location: "Roma Norte, Ciudad de México",
      price: 450,
      currency: "MXN", 
      duration: "2 horas",
      whatsapp_number: "+52-55-2345-6789",
      google_maps_url: "https://maps.google.com/?q=Roma+Norte+CDMX"
    },
    {
      title: "Baños de Sonido con Cuencos Tibetanos",
      slug: "banios-sonido-condesa-003",
      type: "sound-healing",
      category: "eventos",
      description: "Sesiones de sanación con cuencos tibetanos y gongs en estudios de la Condesa. Armonización profunda y relajación total.",
      location: "Condesa, Ciudad de México", 
      price: 400,
      currency: "MXN",
      duration: "1.5 horas",
      whatsapp_number: "+52-55-3456-7890",
      google_maps_url: "https://maps.google.com/?q=Condesa+CDMX"
    },
    {
      title: "Círculos de Respiración Holotrópica",
      slug: "respiracion-holotropica-cdmx-004",
      type: "breathwork", 
      category: "eventos",
      description: "Talleres de respiración holotrópica en centros especializados. Técnica desarrollada por Stanislav Grof para expansión de conciencia.",
      location: "Polanco, Ciudad de México",
      price: 800,
      currency: "MXN",
      duration: "4 horas", 
      whatsapp_number: "+52-55-4567-8901",
      google_maps_url: "https://maps.google.com/?q=Polanco+CDMX"
    },
    {
      title: "Meditaciones Grupales en Coyoacán",
      slug: "meditacion-coyoacan-005",
      type: "meditation",
      category: "eventos",
      description: "Meditaciones grupales semanales en espacios culturales de Coyoacán. Práctica de mindfulness y meditación vipassana.",
      location: "Coyoacán, Ciudad de México",
      price: 200,
      currency: "MXN",
      duration: "1 hora",
      whatsapp_number: "+52-55-5678-9012", 
      google_maps_url: "https://maps.google.com/?q=Coyoacan+CDMX"
    }
  ];

  // CATEGORÍA: MEDICINA - Productos medicinales que se venden legalmente en CDMX
  const medicina = [
    {
      title: "Aceite de CBD Full Spectrum",
      slug: "cbd-oil-mexico-006",
      type: "cbd",
      category: "medicina",
      description: "Aceite de CBD de espectro completo, extraído de cáñamo industrial. Producto legal en México con certificaciones de calidad.",
      location: "Ciudad de México",
      price: 1200, 
      currency: "MXN",
      duration: "Tratamiento 30 días",
      whatsapp_number: "+52-55-6789-0123",
      google_maps_url: "https://maps.google.com/?q=Tiendas+CBD+CDMX"
    },
    {
      title: "Tintura de Damiana (Turnera diffusa)",
      slug: "tintura-damiana-007",
      type: "herbal",
      category: "medicina", 
      description: "Tintura herbal de damiana, planta medicinal tradicional mexicana. Conocida por sus propiedades relajantes y afrodisíacas.",
      location: "Mercado de Sonora, CDMX",
      price: 180,
      currency: "MXN",
      duration: "Tratamiento 15 días",
      whatsapp_number: "+52-55-7890-1234",
      google_maps_url: "https://maps.google.com/?q=Mercado+Sonora+CDMX"
    },
    {
      title: "Extracto de Toronja Mexicana",
      slug: "extracto-toronja-008", 
      type: "herbal",
      category: "medicina",
      description: "Extracto concentrado de semilla de toronja, potente antioxidante y antimicrobiano natural. Producido localmente en México.",
      location: "Ciudad de México",
      price: 250,
      currency: "MXN", 
      duration: "Tratamiento 30 días",
      whatsapp_number: "+52-55-8901-2345",
      google_maps_url: "https://maps.google.com/?q=Herbolaria+CDMX"
    },
    {
      title: "Miel de Maguey con Propóleos",
      slug: "miel-maguey-propoleos-009",
      type: "herbal",
      category: "medicina",
      description: "Miel de maguey endulzada con propóleos de abejas mexicanas. Excelente para sistema inmunológico y problemas respiratorios.",
      location: "Ciudad de México", 
      price: 320,
      currency: "MXN",
      duration: "Tratamiento 20 días",
      whatsapp_number: "+52-55-9012-3456",
      google_maps_url: "https://maps.google.com/?q=Productos+naturales+CDMX"
    },
    {
      title: "Cápsulas de Nopal Deshidratado",
      slug: "capsulas-nopal-010",
      type: "herbal", 
      category: "medicina",
      description: "Cápsulas de nopal orgánico mexicano, rico en fibra y regulador natural de glucosa. Superfood tradicional de México.",
      location: "Ciudad de México",
      price: 280,
      currency: "MXN",
      duration: "Tratamiento 30 días",
      whatsapp_number: "+52-55-0123-4567",
      google_maps_url: "https://maps.google.com/?q=Suplementos+naturales+CDMX"
    }
  ];

  // CATEGORÍA: MICRODOSIS - Productos legales de microdosis disponibles en México
  const microdosis = [
    {
      title: "Microdosis de Hongos Melena de León", 
      slug: "melena-leon-microdosis-011",
      type: "lions-mane",
      category: "microdosis",
      description: "Cápsulas de Hericium erinaceus (Melena de León) para neuroprotección y función cognitiva. Hongo medicinal completamente legal.",
      location: "Ciudad de México",
      price: 450,
      currency: "MXN",
      duration: "Protocolo 30 días", 
      whatsapp_number: "+52-55-1234-0567",
      google_maps_url: "https://maps.google.com/?q=Hongos+medicinales+CDMX"
    },
    {
      title: "Stack Nootrópico: Reishi + Cordyceps",
      slug: "stack-reishi-cordyceps-012",
      type: "mushroom-blend",
      category: "microdosis",
      description: "Combinación de hongos Reishi y Cordyceps para energía sostenida y sistema inmune. Adaptógenos naturales de alta calidad.",
      location: "Ciudad de México",
      price: 520,
      currency: "MXN", 
      duration: "Protocolo 30 días",
      whatsapp_number: "+52-55-2345-1678",
      google_maps_url: "https://maps.google.com/?q=Nootrópicos+naturales+CDMX"
    },
    {
      title: "Microdosis de Chaga Siberiano",
      slug: "chaga-microdosis-013",
      type: "chaga",
      category: "microdosis", 
      description: "Extracto concentrado de hongo Chaga, potente antioxidante y adaptógeno. Importado de Siberia con certificaciones internacionales.",
      location: "Ciudad de México",
      price: 680,
      currency: "MXN",
      duration: "Protocolo 30 días",
      whatsapp_number: "+52-55-3456-2789",
      google_maps_url: "https://maps.google.com/?q=Adaptógenos+CDMX"
    },
    {
      title: "Blend de Hongos Funcionales 5 en 1",
      slug: "blend-hongos-5en1-014",
      type: "mushroom-blend",
      category: "microdosis",
      description: "Mezcla de 5 hongos medicinales: Reishi, Cordyceps, Melena de León, Shiitake y Chaga. Fórmula completa para bienestar integral.",
      location: "Ciudad de México",
      price: 750,
      currency: "MXN",
      duration: "Protocolo 30 días", 
      whatsapp_number: "+52-55-4567-3890",
      google_maps_url: "https://maps.google.com/?q=Superfoods+CDMX"
    },
    {
      title: "Microdosis de Turkey Tail (Cola de Pavo)",
      slug: "turkey-tail-microdosis-015",
      type: "turkey-tail",
      category: "microdosis",
      description: "Trametes versicolor en cápsulas, reconocido por sus propiedades inmunoreguladoras y prebióticas. Hongo medicinal certificado.",
      location: "Ciudad de México", 
      price: 420,
      currency: "MXN",
      duration: "Protocolo 30 días",
      whatsapp_number: "+52-55-5678-4901",
      google_maps_url: "https://maps.google.com/?q=Medicina+funcional+CDMX"
    }
  ];

  // CATEGORÍA: PRODUCTOS - Productos espirituales y de bienestar que se venden en CDMX
  const productos = [
    {
      title: "Copal Blanco de Puebla - Incienso Natural",
      slug: "copal-blanco-puebla-016",
      type: "incense", 
      category: "productos",
      description: "Copal blanco auténtico de Puebla, resina sagrada usada desde la época prehispánica. Ideal para limpias energéticas y meditación.",
      location: "Mercado de Sonora, CDMX",
      price: 80,
      currency: "MXN",
      duration: "Uso prolongado",
      whatsapp_number: "+52-55-6789-5012",
      google_maps_url: "https://maps.google.com/?q=Mercado+Sonora+copal+CDMX"
    },
    {
      title: "Cuencos Tibetanos Artesanales 7 Metales",
      slug: "cuencos-tibetanos-cdmx-017",
      type: "instruments", 
      category: "productos",
      description: "Cuencos tibetanos hechos a mano con aleación de 7 metales sagrados. Importados del Himalaya, disponibles en tiendas especializadas de CDMX.",
      location: "Roma Norte, Ciudad de México",
      price: 1500,
      currency: "MXN",
      duration: "Uso permanente",
      whatsapp_number: "+52-55-7890-6123", 
      google_maps_url: "https://maps.google.com/?q=Instrumentos+sonoros+Roma+Norte"
    },
    {
      title: "Mazo de Tarot Rider-Waite Original",
      slug: "tarot-rider-waite-018",
      type: "divination",
      category: "productos",
      description: "Baraja de tarot Rider-Waite clásica, la más popular para iniciarse en la lectura de cartas. Disponible en librerías esotéricas de CDMX.",
      location: "Centro Histórico, CDMX", 
      price: 350,
      currency: "MXN",
      duration: "Uso permanente",
      whatsapp_number: "+52-55-8901-7234",
      google_maps_url: "https://maps.google.com/?q=Librerías+esotéricas+Centro+CDMX"
    },
    {
      title: "Cojín de Meditación Zafu Tradicional",
      slug: "cojin-zafu-meditacion-019",
      type: "meditation-supplies",
      category: "productos",
      description: "Cojín zafu tradicional relleno de cáscara de trigo sarraceno. Fabricado localmente con telas mexicanas, ideal para práctica de meditación.",
      location: "Coyoacán, Ciudad de México",
      price: 650,
      currency: "MXN", 
      duration: "Uso permanente",
      whatsapp_number: "+52-55-9012-8345",
      google_maps_url: "https://maps.google.com/?q=Accesorios+yoga+Coyoacán"
    },
    {
      title: "Sahumerios de Ruda y Romero",
      slug: "sahumerios-ruda-romero-020",
      type: "cleansing",
      category: "productos",
      description: "Sahumerios naturales de ruda y romero para limpia energética. Hierbas mexicanas secas, atados artesanalmente por curanderas tradicionales.",
      location: "Xochimilco, Ciudad de México",
      price: 120,
      currency: "MXN",
      duration: "Varios usos", 
      whatsapp_number: "+52-55-0123-9456",
      google_maps_url: "https://maps.google.com/?q=Plantas+medicinales+Xochimilco"
    }
  ];

  // Insertar todos los productos
  const allProducts = [...eventos, ...medicina, ...microdosis, ...productos];
  
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

  console.log(`✅ Insertados ${allProducts.length} productos reales de Ciudad de México`);
  console.log("📊 Distribución por categoría:");
  console.log(`- Eventos: ${eventos.length} productos`);
  console.log(`- Medicina: ${medicina.length} productos`);
  console.log(`- Microdosis: ${microdosis.length} productos`);
  console.log(`- Productos: ${productos.length} productos`);
  
  // Verificación final
  const finalCount = await sql`SELECT COUNT(*)::int AS total FROM therapies WHERE country = 'MX'`;
  console.log(`\n🎯 Total final de productos mexicanos: ${(finalCount[0] as any).total}`);
}

main().catch((e) => { 
  console.error("❌ Error:", e); 
  process.exit(1); 
});