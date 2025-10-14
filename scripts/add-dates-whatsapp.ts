import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function addDatesAndWhatsApp() {
  try {
    console.log("📅 Adding dates and WhatsApp numbers...");
    
    // Agregar columna whatsapp_number si no existe
    await sql`
      ALTER TABLE therapies 
      ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50)
    `;
    console.log("✅ Column whatsapp_number added");
    
    // Datos de fechas y WhatsApp para cada terapia
    const updates = [
      { 
        slug: 'ceremonia-ayahuasca-valle-sagrado', 
        dates: ['15 Nov 2025', '22 Nov 2025', '29 Nov 2025', '6 Dic 2025', '13 Dic 2025'],
        whatsapp: '+51987654321'
      },
      { 
        slug: 'retiro-san-pedro-machu-picchu', 
        dates: ['18 Nov 2025', '25 Nov 2025', '2 Dic 2025', '9 Dic 2025'],
        whatsapp: '+51987654322'
      },
      { 
        slug: 'ceremonia-kambo-medicina-rana', 
        dates: ['Sábados 10:00', 'Domingos 10:00'],
        whatsapp: '+51987654323'
      },
      { 
        slug: 'retiro-rape-sananga', 
        dates: ['Viernes 20:00', 'Sábados 18:00', 'Domingos 18:00'],
        whatsapp: '+51987654324'
      },
      { 
        slug: 'ceremonia-cacao-sagrado', 
        dates: ['Luna Nueva: 1 Dic', 'Luna Llena: 15 Dic', 'Luna Nueva: 30 Dic'],
        whatsapp: '+51987654325'
      },
      { 
        slug: 'temazcal-ceremonia-sudoracion', 
        dates: ['Sábados 16:00', 'Domingos 10:00'],
        whatsapp: '+51987654326'
      },
      { 
        slug: 'retiro-bufo-alvarius', 
        dates: ['Por cita previa', 'Consultar disponibilidad'],
        whatsapp: '+51987654327'
      },
      { 
        slug: 'dieta-amazonica-plantas-maestras', 
        dates: ['1-7 Dic 2025', '15-21 Dic 2025', '5-11 Ene 2026'],
        whatsapp: '+51987654328'
      },
      { 
        slug: 'ceremonia-hongos-psilocibios', 
        dates: ['20 Nov 2025', '27 Nov 2025', '4 Dic 2025', '11 Dic 2025'],
        whatsapp: '+51987654329'
      },
      { 
        slug: 'retiro-respiracion-holotropica', 
        dates: ['Primer sábado de cada mes', '7 Dic 2025', '4 Ene 2026'],
        whatsapp: '+51987654330'
      },
      { 
        slug: 'ceremonia-tabaco-sagrado', 
        dates: ['16 Nov 2025', '23 Nov 2025', '30 Nov 2025'],
        whatsapp: '+51987654331'
      },
      { 
        slug: 'retiro-meditacion-vipassana', 
        dates: ['6-8 Dic 2025', '13-15 Dic 2025', '3-5 Ene 2026'],
        whatsapp: '+51987654332'
      },
      { 
        slug: 'ceremonia-wachuma-san-pedro', 
        dates: ['17 Nov 2025', '24 Nov 2025', '1 Dic 2025', '8 Dic 2025'],
        whatsapp: '+51987654333'
      },
      { 
        slug: 'bano-flores-limpieza-energetica', 
        dates: ['Lunes a Viernes', 'Consultar horarios'],
        whatsapp: '+51987654334'
      },
      { 
        slug: 'ceremonia-luna-llena-cacao', 
        dates: ['Luna Llena: 15 Dic', 'Luna Llena: 13 Ene 2026'],
        whatsapp: '+51987654335'
      },
    ];
    
    for (const item of updates) {
      await sql`
        UPDATE therapies 
        SET 
          available_dates = ${item.dates},
          whatsapp_number = ${item.whatsapp}
        WHERE slug = ${item.slug}
      `;
      console.log(`✅ Updated ${item.slug}`);
    }
    
    console.log("\n🎉 Done! All therapies have dates and WhatsApp");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addDatesAndWhatsApp();
