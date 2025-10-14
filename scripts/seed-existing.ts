import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const therapies = [
  {
    title: "Ceremonia de Ayahuasca en el Valle Sagrado",
    slug: "ceremonia-ayahuasca-valle-sagrado",
    type: "ayahuasca",
    description: "Experimenta una profunda transformación espiritual con nuestra ceremonia tradicional de Ayahuasca. Guiada por un chamán shipibo con más de 30 años de experiencia.",
    location: "Valle Sagrado, Cusco",
    duration: "8 horas",
    price: "250",
    currency: "USD",
    guide_name: "Maestro Agustín Rivas",
    is_published: true,
  },
  {
    title: "Retiro de San Pedro en Machu Picchu",
    slug: "retiro-san-pedro-machu-picchu",
    type: "san-pedro",
    description: "Conecta con la sabiduría ancestral andina a través del sagrado cactus San Pedro. Este retiro de día completo combina la medicina con caminatas meditativas.",
    location: "Machu Picchu, Cusco",
    duration: "12 horas",
    price: "180",
    currency: "USD",
    guide_name: "Don Carlos Quispe",
    is_published: true,
  },
  {
    title: "Ceremonia de Kambo - Medicina de la Rana",
    slug: "ceremonia-kambo-medicina-rana",
    type: "kambo",
    description: "Purificación profunda del cuerpo y mente con la poderosa medicina Kambo. Esta secreción de rana amazónica es conocida por sus propiedades de limpieza física y energética.",
    location: "Iquitos, Loreto",
    duration: "3 horas",
    price: "80",
    currency: "USD",
    guide_name: "Facilitadora María Gonzales",
    is_published: true,
  },
  {
    title: "Retiro de Rapé y Sananga",
    slug: "retiro-rape-sananga",
    type: "rape",
    description: "Limpieza energética profunda con medicinas sagradas del Amazonas. El Rapé abre los canales energéticos mientras la Sananga limpia la visión física y espiritual.",
    location: "Lima, Barranco",
    duration: "3 horas",
    price: "60",
    currency: "USD",
    guide_name: "Facilitador Pedro Navarro",
    is_published: true,
  },
  {
    title: "Ceremonia de Cacao Sagrado",
    slug: "ceremonia-cacao-sagrado",
    type: "cacao-ceremony",
    description: "Abre tu corazón con la medicina suave del Cacao ceremonial. Combinado con meditación, música y movimiento consciente para una experiencia de amor propio y conexión.",
    location: "Cusco Centro",
    duration: "3 horas",
    price: "45",
    currency: "USD",
    guide_name: "Facilitadora Luna Martínez",
    is_published: true,
  },
  {
    title: "Temazcal - Ceremonia de Sudoración",
    slug: "temazcal-ceremonia-sudoracion",
    type: "temazcal",
    description: "Renacimiento a través del calor y la oscuridad del vientre de la Madre Tierra. Ceremonia ancestral de purificación física, mental y espiritual.",
    location: "Valle Sagrado, Pisac",
    duration: "4 horas",
    price: "70",
    currency: "USD",
    guide_name: "Guardián del Fuego: Javier Huamán",
    is_published: true,
  },
  {
    title: "Retiro de Bufo Alvarius (5-MeO-DMT)",
    slug: "retiro-bufo-alvarius",
    type: "bufo",
    description: "La experiencia más profunda de unidad y disolución del ego. Medicina sagrada del sapo del desierto de Sonora, conocida como 'la molécula de Dios'.",
    location: "Cusco, Espacio Privado",
    duration: "4 horas",
    price: "350",
    currency: "USD",
    guide_name: "Facilitador Marco Silva",
    is_published: true,
  },
  {
    title: "Dieta Amazónica con Plantas Maestras",
    slug: "dieta-amazonica-plantas-maestras",
    type: "plant-medicine",
    description: "Inmersión profunda de 7 días en la selva amazónica, trabajando con plantas maestras específicas. Aislamiento, dieta estricta y ceremonias nocturnas de Ayahuasca.",
    location: "Pucallpa, Ucayali (Selva Amazónica)",
    duration: "7 días / 6 noches",
    price: "800",
    currency: "USD",
    guide_name: "Maestro Shipibo: Don Alberto",
    is_published: true,
  },
  {
    title: "Ceremonia de Hongos Psilocibios",
    slug: "ceremonia-hongos-psilocibios",
    type: "plant-medicine",
    description: "Viaje introspectivo y sanador con hongos sagrados en un entorno seguro y ceremonial. Ideal para trabajo emocional profundo y expansión de consciencia.",
    location: "Cusco, Centro Ceremonial Privado",
    duration: "8 horas",
    price: "150",
    currency: "USD",
    guide_name: "Facilitadora Sofía Ramírez",
    is_published: true,
  },
  {
    title: "Retiro de Respiración Holotrópica",
    slug: "retiro-respiracion-holotropica",
    type: "plant-medicine",
    description: "Alcanza estados alterados de consciencia sin sustancias, solo con el poder de la respiración. Técnica desarrollada por Stanislav Grof para sanación profunda.",
    location: "Lima, San Isidro",
    duration: "5 horas",
    price: "90",
    currency: "USD",
    guide_name: "Facilitador Diego Torres",
    is_published: true,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding therapies...");
    
    // First, let's check what columns exist
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'therapies'
    `;
    console.log("Available columns:", columns.map(c => c.column_name).join(", "));
    
    for (const therapy of therapies) {
      await sql`
        INSERT INTO therapies (
          title, slug, type, description, location, duration,
          price, currency, guide_name, is_published
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
          ${therapy.is_published}
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          updated_at = NOW()
      `;
      console.log(`✅ ${therapy.title}`);
    }
    
    console.log("\n🎉 Done! Created 10 therapies");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
