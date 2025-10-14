import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  try {
    console.log("🌱 Starting seed...");
    
    // Create a default guide first
    const passwordHash = await bcrypt.hash("password123", 10);
    
    const [guide] = await sql`
      INSERT INTO guides (
        id, full_name, email, password_hash, primary_specialty, bio
      ) VALUES (
        gen_random_uuid(),
        'PsycheConecta Team',
        'admin@psycheconecta.com',
        ${passwordHash},
        'Medicina Ancestral',
        'Equipo de facilitadores experimentados en medicina plant y terapias alternativas'
      )
      ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name
      RETURNING id
    `;
    
    console.log(`✅ Created guide: ${guide.id}`);
    
    const therapies = [
      {
        title: "Ceremonia de Ayahuasca en el Valle Sagrado",
        slug: "ceremonia-ayahuasca-valle-sagrado",
        type: "ayahuasca",
        description: "Experimenta una profunda transformación espiritual con nuestra ceremonia tradicional de Ayahuasca. Guiada por un chamán shipibo con más de 30 años de experiencia.",
        location: "Valle Sagrado, Cusco",
        duration: "8 horas",
        price: "250",
        guide_name: "Maestro Agustín Rivas",
        available_dates: ["15 Nov 2025", "22 Nov 2025", "29 Nov 2025", "6 Dic 2025"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Retiro de San Pedro en Machu Picchu",
        slug: "retiro-san-pedro-machu-picchu",
        type: "san-pedro",
        description: "Conecta con la sabiduría ancestral andina a través del sagrado cactus San Pedro. Este retiro de día completo combina la medicina con caminatas meditativas.",
        location: "Machu Picchu, Cusco",
        duration: "12 horas",
        price: "180",
        guide_name: "Don Carlos Quispe",
        available_dates: ["18 Nov 2025", "25 Nov 2025", "2 Dic 2025"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Ceremonia de Kambo - Medicina de la Rana",
        slug: "ceremonia-kambo-medicina-rana",
        type: "kambo",
        description: "Purificación profunda del cuerpo y mente con la poderosa medicina Kambo. Esta secreción de rana amazónica es conocida por sus propiedades de limpieza física y energética.",
        location: "Iquitos, Loreto",
        duration: "3 horas",
        price: "80",
        guide_name: "Facilitadora María Gonzales",
        available_dates: ["Todos los sábados", "Consultar disponibilidad"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Retiro de Rapé y Sananga",
        slug: "retiro-rape-sananga",
        type: "rape",
        description: "Limpieza energética profunda con medicinas sagradas del Amazonas. El Rapé abre los canales energéticos mientras la Sananga limpia la visión física y espiritual.",
        location: "Lima, Barranco",
        duration: "3 horas",
        price: "60",
        guide_name: "Facilitador Pedro Navarro",
        available_dates: ["Viernes 20:00", "Domingos 18:00"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Ceremonia de Cacao Sagrado",
        slug: "ceremonia-cacao-sagrado",
        type: "cacao-ceremony",
        description: "Abre tu corazón con la medicina suave del Cacao ceremonial. Combinado con meditación, música y movimiento consciente para una experiencia de amor propio y conexión.",
        location: "Cusco Centro",
        duration: "3 horas",
        price: "45",
        guide_name: "Facilitadora Luna Martínez",
        available_dates: ["Cada Luna Nueva", "Cada Luna Llena"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Temazcal - Ceremonia de Sudoración",
        slug: "temazcal-ceremonia-sudoracion",
        type: "temazcal",
        description: "Renacimiento a través del calor y la oscuridad del vientre de la Madre Tierra. Ceremonia ancestral de purificación física, mental y espiritual.",
        location: "Valle Sagrado, Pisac",
        duration: "4 horas",
        price: "70",
        guide_name: "Guardián del Fuego: Javier Huamán",
        available_dates: ["Sábados 16:00", "Domingos 10:00"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Retiro de Bufo Alvarius (5-MeO-DMT)",
        slug: "retiro-bufo-alvarius",
        type: "plant-medicine",
        description: "La experiencia más profunda de unidad y disolución del ego. Medicina sagrada del sapo del desierto de Sonora, conocida como 'la molécula de Dios'.",
        location: "Cusco, Espacio Privado",
        duration: "4 horas",
        price: "350",
        guide_name: "Facilitador Marco Silva",
        available_dates: ["Por cita previa", "Sesiones privadas"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Dieta Amazónica con Plantas Maestras",
        slug: "dieta-amazonica-plantas-maestras",
        type: "plant-medicine",
        description: "Inmersión profunda de 7 días en la selva amazónica, trabajando con plantas maestras específicas. Aislamiento, dieta estricta y ceremonias nocturnas de Ayahuasca.",
        location: "Pucallpa, Ucayali (Selva Amazónica)",
        duration: "7 días / 6 noches",
        price: "800",
        guide_name: "Maestro Shipibo: Don Alberto",
        available_dates: ["1-7 Dic 2025", "15-21 Dic 2025", "5-11 Ene 2026"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Ceremonia de Hongos Psilocibios",
        slug: "ceremonia-hongos-psilocibios",
        type: "plant-medicine",
        description: "Viaje introspectivo y sanador con hongos sagrados en un entorno seguro y ceremonial. Ideal para trabajo emocional profundo y expansión de consciencia.",
        location: "Cusco, Centro Ceremonial Privado",
        duration: "8 horas",
        price: "150",
        guide_name: "Facilitadora Sofía Ramírez",
        available_dates: ["20 Nov 2025", "27 Nov 2025", "4 Dic 2025"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        title: "Retiro de Respiración Holotrópica",
        slug: "retiro-respiracion-holotropica",
        type: "plant-medicine",
        description: "Alcanza estados alterados de consciencia sin sustancias, solo con el poder de la respiración. Técnica desarrollada por Stanislav Grof para sanación profunda.",
        location: "Lima, San Isidro",
        duration: "5 horas",
        price: "90",
        guide_name: "Facilitador Diego Torres",
        available_dates: ["Primer sábado de cada mes", "Consultar fechas"],
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ];
    
    for (const therapy of therapies) {
      await sql`
        INSERT INTO therapies (
          guide_id, title, slug, type, description, location, duration,
          price, currency, guide_name, available_dates, is_published
        ) VALUES (
          ${guide.id},
          ${therapy.title},
          ${therapy.slug},
          ${therapy.type},
          ${therapy.description},
          ${therapy.location},
          ${therapy.duration},
          ${therapy.price},
          'USD',
          ${therapy.guide_name},
          ${therapy.available_dates},
          true
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          available_dates = EXCLUDED.available_dates,
          updated_at = NOW()
      `;
      console.log(`✅ ${therapy.title}`);
    }
    
    console.log("\n🎉 Done! Created 10 therapies");
    console.log("\n📝 Admin credentials:");
    console.log("   Email: admin@psycheconecta.com");
    console.log("   Password: password123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
