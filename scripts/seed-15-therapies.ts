import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  try {
    console.log("🌱 Starting seed with 15 therapies...");
    
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
        description: "Experimenta una profunda transformación espiritual con nuestra ceremonia tradicional de Ayahuasca guiada por un chamán shipibo con más de 30 años de experiencia.",
        location: "Valle Sagrado, Cusco",
        duration: "8 horas",
        price: "250",
        guide_name: "Maestro Agustín Rivas",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      },
      {
        title: "Retiro de San Pedro en Machu Picchu",
        slug: "retiro-san-pedro-machu-picchu",
        type: "san-pedro",
        description: "Conecta con la sabiduría ancestral andina a través del sagrado cactus San Pedro en un retiro de día completo con vistas impresionantes.",
        location: "Machu Picchu, Cusco",
        duration: "12 horas",
        price: "180",
        guide_name: "Don Carlos Quispe",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      },
      {
        title: "Ceremonia de Kambo - Medicina de la Rana",
        slug: "ceremonia-kambo-medicina-rana",
        type: "kambo",
        description: "Purificación profunda del cuerpo y mente con la poderosa medicina Kambo de la selva amazónica.",
        location: "Iquitos, Loreto",
        duration: "3 horas",
        price: "80",
        guide_name: "Facilitadora María Gonzales",
        image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800",
      },
      {
        title: "Retiro de Rapé y Sananga",
        slug: "retiro-rape-sananga",
        type: "rape",
        description: "Limpieza energética profunda con medicinas sagradas del Amazonas que abren los canales energéticos.",
        location: "Lima, Barranco",
        duration: "3 horas",
        price: "60",
        guide_name: "Facilitador Pedro Navarro",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
      },
      {
        title: "Ceremonia de Cacao Sagrado",
        slug: "ceremonia-cacao-sagrado",
        type: "cacao-ceremony",
        description: "Abre tu corazón con la medicina suave del Cacao ceremonial combinado con meditación y música en vivo.",
        location: "Cusco Centro",
        duration: "3 horas",
        price: "45",
        guide_name: "Facilitadora Luna Martínez",
        image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800",
      },
      {
        title: "Temazcal - Ceremonia de Sudoración",
        slug: "temazcal-ceremonia-sudoracion",
        type: "temazcal",
        description: "Renacimiento a través del calor y la oscuridad del vientre de la Madre Tierra en esta ceremonia ancestral.",
        location: "Valle Sagrado, Pisac",
        duration: "4 horas",
        price: "70",
        guide_name: "Guardián del Fuego: Javier Huamán",
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800",
      },
      {
        title: "Retiro de Bufo Alvarius (5-MeO-DMT)",
        slug: "retiro-bufo-alvarius",
        type: "plant-medicine",
        description: "La experiencia más profunda de unidad y disolución del ego con la medicina sagrada del sapo del desierto.",
        location: "Cusco, Espacio Privado",
        duration: "4 horas",
        price: "350",
        guide_name: "Facilitador Marco Silva",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      },
      {
        title: "Dieta Amazónica con Plantas Maestras",
        slug: "dieta-amazonica-plantas-maestras",
        type: "plant-medicine",
        description: "Inmersión profunda de 7 días en la selva amazónica trabajando con plantas maestras específicas.",
        location: "Pucallpa, Ucayali",
        duration: "7 días / 6 noches",
        price: "800",
        guide_name: "Maestro Shipibo: Don Alberto",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      },
      {
        title: "Ceremonia de Hongos Psilocibios",
        slug: "ceremonia-hongos-psilocibios",
        type: "plant-medicine",
        description: "Viaje introspectivo y sanador con hongos sagrados en un entorno seguro y ceremonial.",
        location: "Cusco, Centro Ceremonial",
        duration: "8 horas",
        price: "150",
        guide_name: "Facilitadora Sofía Ramírez",
        image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800",
      },
      {
        title: "Retiro de Respiración Holotrópica",
        slug: "retiro-respiracion-holotropica",
        type: "plant-medicine",
        description: "Alcanza estados alterados de consciencia sin sustancias, solo con el poder de la respiración.",
        location: "Lima, San Isidro",
        duration: "5 horas",
        price: "90",
        guide_name: "Facilitador Diego Torres",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      },
      {
        title: "Ceremonia de Tabaco Sagrado",
        slug: "ceremonia-tabaco-sagrado",
        type: "rape",
        description: "Conexión profunda con el espíritu del tabaco en una ceremonia tradicional amazónica de limpieza.",
        location: "Tarapoto, San Martín",
        duration: "4 horas",
        price: "75",
        guide_name: "Curandero José Pinedo",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      },
      {
        title: "Retiro de Meditación Vipassana",
        slug: "retiro-meditacion-vipassana",
        type: "plant-medicine",
        description: "Retiro silencioso de 3 días para observar la realidad tal como es a través de la meditación profunda.",
        location: "Arequipa, Colca",
        duration: "3 días / 2 noches",
        price: "200",
        guide_name: "Maestra Carla Mendoza",
        image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800",
      },
      {
        title: "Ceremonia de Wachuma (San Pedro)",
        slug: "ceremonia-wachuma-san-pedro",
        type: "wachuma",
        description: "Ceremonia tradicional con el cactus sagrado Wachuma para apertura del corazón y conexión con la Pachamama.",
        location: "Huaraz, Ancash",
        duration: "10 horas",
        price: "160",
        guide_name: "Paqo Miguel Flores",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      },
      {
        title: "Baño de Flores y Limpieza Energética",
        slug: "bano-flores-limpieza-energetica",
        type: "plant-medicine",
        description: "Limpieza profunda con baños de flores amazónicas y hierbas medicinales para renovar tu energía.",
        location: "Iquitos, Loreto",
        duration: "2 horas",
        price: "50",
        guide_name: "Curandera Rosa Sánchez",
        image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800",
      },
      {
        title: "Ceremonia de Luna Llena con Cacao",
        slug: "ceremonia-luna-llena-cacao",
        type: "cacao-ceremony",
        description: "Celebra la energía de la Luna Llena con cacao ceremonial, danza y música bajo las estrellas.",
        location: "Cusco, Valle Sagrado",
        duration: "4 horas",
        price: "55",
        guide_name: "Facilitadora Amaru Luna",
        image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800",
      },
    ];
    
    for (const therapy of therapies) {
      await sql`
        INSERT INTO therapies (
          guide_id, title, slug, type, description, location, duration,
          price, currency, guide_name, is_published
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
          true
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          updated_at = NOW()
      `;
      console.log(`✅ ${therapy.title}`);
    }
    
    console.log(`\n🎉 Done! Created ${therapies.length} therapies`);
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
