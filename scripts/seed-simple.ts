import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const therapies = [
  {
    title: "Ceremonia de Ayahuasca en el Valle Sagrado",
    slug: "ceremonia-ayahuasca-valle-sagrado",
    type: "ayahuasca",
    description: "Experimenta una profunda transformación espiritual con nuestra ceremonia tradicional de Ayahuasca.",
    location: "Valle Sagrado, Cusco",
    duration: "8 horas",
    price: "250",
    currency: "USD",
    guide_name: "Maestro Agustín Rivas",
    guide_experience: "30 años de práctica chamánica",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    whatsapp_number: "+51987654321",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de San Pedro en Machu Picchu",
    slug: "retiro-san-pedro-machu-picchu",
    type: "san-pedro",
    description: "Conecta con la sabiduría ancestral andina a través del sagrado cactus San Pedro.",
    location: "Machu Picchu, Cusco",
    duration: "12 horas",
    price: "180",
    currency: "USD",
    guide_name: "Don Carlos Quispe",
    guide_experience: "25 años como curandero andino",
    image_url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200",
    whatsapp_number: "+51987654322",
    featured: true,
    published: true,
  },
  {
    title: "Ceremonia de Kambo - Medicina de la Rana",
    slug: "ceremonia-kambo-medicina-rana",
    type: "kambo",
    description: "Purificación profunda del cuerpo y mente con la poderosa medicina Kambo.",
    location: "Iquitos, Loreto",
    duration: "3 horas",
    price: "80",
    currency: "USD",
    guide_name: "Facilitadora María Gonzales",
    guide_experience: "10 años aplicando Kambo",
    image_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200",
    whatsapp_number: "+51987654323",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de Rapé y Sananga",
    slug: "retiro-rape-sananga",
    type: "rape",
    description: "Limpieza energética profunda con medicinas sagradas del Amazonas.",
    location: "Lima, Barranco",
    duration: "3 horas",
    price: "60",
    currency: "USD",
    guide_name: "Facilitador Pedro Navarro",
    guide_experience: "8 años trabajando con medicinas amazónicas",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200",
    whatsapp_number: "+51987654324",
    featured: false,
    published: true,
  },
  {
    title: "Ceremonia de Cacao Sagrado",
    slug: "ceremonia-cacao-sagrado",
    type: "cacao-ceremony",
    description: "Abre tu corazón con la medicina suave del Cacao ceremonial.",
    location: "Cusco Centro",
    duration: "3 horas",
    price: "45",
    currency: "USD",
    guide_name: "Facilitadora Luna Martínez",
    guide_experience: "5 años facilitando ceremonias de cacao",
    image_url: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200",
    whatsapp_number: "+51987654325",
    featured: false,
    published: true,
  },
  {
    title: "Temazcal - Ceremonia de Sudoración",
    slug: "temazcal-ceremonia-sudoracion",
    type: "temazcal",
    description: "Renacimiento a través del calor y la oscuridad del vientre de la Madre Tierra.",
    location: "Valle Sagrado, Pisac",
    duration: "4 horas",
    price: "70",
    currency: "USD",
    guide_name: "Guardián del Fuego: Javier Huamán",
    guide_experience: "15 años conduciendo temazcales",
    image_url: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200",
    whatsapp_number: "+51987654326",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de Bufo Alvarius (5-MeO-DMT)",
    slug: "retiro-bufo-alvarius",
    type: "bufo",
    description: "La experiencia más profunda de unidad y disolución del ego.",
    location: "Cusco, Espacio Privado",
    duration: "4 horas",
    price: "350",
    currency: "USD",
    guide_name: "Facilitador Marco Silva",
    guide_experience: "12 años facilitando Bufo, 200+ ceremonias",
    image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
    whatsapp_number: "+51987654327",
    featured: true,
    published: true,
  },
  {
    title: "Dieta Amazónica con Plantas Maestras",
    slug: "dieta-amazonica-plantas-maestras",
    type: "plant-dieta",
    description: "Inmersión profunda de 7 días en la selva amazónica, trabajando con plantas maestras.",
    location: "Pucallpa, Ucayali",
    duration: "7 días / 6 noches",
    price: "800",
    currency: "USD",
    guide_name: "Maestro Shipibo: Don Alberto",
    guide_experience: "40 años de práctica chamánica",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
    whatsapp_number: "+51987654328",
    featured: false,
    published: true,
  },
  {
    title: "Ceremonia de Hongos Psilocibios",
    slug: "ceremonia-hongos-psilocibios",
    type: "psilocybin",
    description: "Viaje introspectivo y sanador con hongos sagrados en un entorno seguro.",
    location: "Cusco, Centro Ceremonial",
    duration: "8 horas",
    price: "150",
    currency: "USD",
    guide_name: "Facilitadora Sofía Ramírez",
    guide_experience: "7 años facilitando ceremonias de hongos",
    image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200",
    whatsapp_number: "+51987654329",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de Respiración Holotrópica",
    slug: "retiro-respiracion-holotropica",
    type: "breathwork",
    description: "Alcanza estados alterados de consciencia sin sustancias, solo con respiración.",
    location: "Lima, San Isidro",
    duration: "5 horas",
    price: "90",
    currency: "USD",
    guide_name: "Facilitador Diego Torres",
    guide_experience: "Certificado Grof Training, 6 años",
    image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200",
    whatsapp_number: "+51987654330",
    featured: false,
    published: true,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding therapies...");
    
    for (const therapy of therapies) {
      await sql`
        INSERT INTO therapies (
          title, slug, type, description, location, duration,
          price, currency, guide_name, guide_experience, image_url,
          whatsapp_number, featured, published
        ) VALUES (
          ${therapy.title},
          ${therapy.slug},
          ${therapy.type},
          ${therapy.description},
          ${therapy.location},
          ${therapy.duration},
          ${therapy.price},
          ${therapy.currency},
          ${therapy.guide_name},
          ${therapy.guide_experience},
          ${therapy.image_url},
          ${therapy.whatsapp_number},
          ${therapy.featured},
          ${therapy.published}
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          updated_at = NOW()
      `;
      console.log(`✅ ${therapy.title}`);
    }
    
    console.log("\n🎉 Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
