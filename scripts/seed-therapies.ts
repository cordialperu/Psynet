import "dotenv/config";
import { db } from "../server/db";
import { therapies } from "../shared/schema";
import { nanoid } from "nanoid";

const sampleTherapies = [
  {
    title: "Ceremonia de Ayahuasca en el Valle Sagrado",
    slug: "ceremonia-ayahuasca-valle-sagrado",
    type: "ayahuasca",
    description: "Experimenta una profunda transformación espiritual con nuestra ceremonia tradicional de Ayahuasca. Guiada por un chamán shipibo con más de 30 años de experiencia, esta ceremonia de 8 horas te llevará a un viaje interior de sanación y autodescubrimiento.",
    longDescription: `
# Sobre la Ceremonia

Esta ceremonia ancestral de Ayahuasca se realiza en un espacio sagrado en el corazón del Valle Sagrado de los Incas. La medicina es preparada siguiendo protocolos tradicionales shipibo, garantizando una experiencia auténtica y segura.

## Qué Incluye

- Consulta pre-ceremonia con el chamán
- Ceremonia de 8 horas con música tradicional (ícaros)
- Espacio ceremonial privado y cómodo
- Integración post-ceremonia
- Alojamiento opcional en tambo tradicional

## Preparación Requerida

Se requiere dieta de 3 días antes de la ceremonia (sin carnes rojas, lácteos, alcohol, picante). Proporcionamos guía detallada de preparación.

## Beneficios Reportados

- Sanación emocional profunda
- Claridad mental y propósito de vida
- Conexión espiritual
- Liberación de traumas
- Expansión de consciencia
    `,
    location: "Valle Sagrado, Cusco",
    duration: "8 horas",
    price: "250",
    currency: "USD",
    guideName: "Maestro Agustín Rivas",
    guideExperience: "30 años de práctica chamánica",
    guidePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    whatsappNumber: "+51987654321",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de San Pedro en Machu Picchu",
    slug: "retiro-san-pedro-machu-picchu",
    type: "san-pedro",
    description: "Conecta con la sabiduría ancestral andina a través del sagrado cactus San Pedro. Este retiro de día completo combina la medicina con caminatas meditativas y vistas impresionantes de los Andes.",
    longDescription: `
# Retiro de San Pedro

El San Pedro (Huachuma) es una medicina sagrada utilizada por culturas andinas durante milenios. Esta experiencia te conecta con la Pachamama y tu esencia más profunda.

## Experiencia del Día

- 6:00 AM: Recepción y preparación
- 7:00 AM: Toma de medicina
- 8:00 AM - 4:00 PM: Caminata guiada y contemplación
- 5:00 PM: Círculo de cierre e integración

## Incluye

- Medicina preparada tradicionalmente
- Guía experimentado durante todo el día
- Desayuno ligero y almuerzo vegetariano
- Transporte desde Cusco
- Mantas y cojines para meditación

## Ideal Para

Personas buscando claridad, conexión con la naturaleza, y apertura del corazón. Excelente para primera experiencia con medicina plant.
    `,
    location: "Machu Picchu, Cusco",
    duration: "12 horas",
    price: "180",
    currency: "USD",
    guideName: "Don Carlos Quispe",
    guideExperience: "25 años como curandero andino",
    guidePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200",
    whatsappNumber: "+51987654322",
    featured: true,
    published: true,
  },
  {
    title: "Ceremonia de Kambo - Medicina de la Rana",
    slug: "ceremonia-kambo-medicina-rana",
    type: "kambo",
    description: "Purificación profunda del cuerpo y mente con la poderosa medicina Kambo. Esta secreción de rana amazónica es conocida por sus propiedades de limpieza física y energética.",
    longDescription: `
# Kambo: La Vacuna del Bosque

El Kambo es una medicina de purificación utilizada por tribus amazónicas. Fortalece el sistema inmune y limpia toxinas físicas y energéticas.

## Proceso de la Ceremonia

1. Consulta inicial y establecimiento de intenciones
2. Pequeñas quemaduras superficiales (puntos)
3. Aplicación de la medicina
4. Proceso de purga (15-40 minutos)
5. Descanso y recuperación
6. Integración

## Beneficios

- Fortalecimiento del sistema inmune
- Limpieza de toxinas
- Claridad mental
- Aumento de energía vital
- Liberación emocional

## Contraindicaciones

No apto para personas con problemas cardíacos, embarazo, o ciertas condiciones médicas. Evaluación previa requerida.
    `,
    location: "Iquitos, Loreto",
    duration: "3 horas",
    price: "80",
    currency: "USD",
    guideName: "Facilitadora María Gonzales",
    guideExperience: "10 años aplicando Kambo",
    guidePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200",
    whatsappNumber: "+51987654323",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de Rapé y Sananga",
    slug: "retiro-rape-sananga",
    type: "rape",
    description: "Limpieza energética profunda con medicinas sagradas del Amazonas. El Rapé abre los canales energéticos mientras la Sananga limpia la visión física y espiritual.",
    longDescription: `
# Medicinas Sagradas Amazónicas

Combinación poderosa de dos medicinas tradicionales para limpieza y claridad.

## Rapé (Tabaco Sagrado)

Mezcla de tabaco y plantas medicinales que se sopla por la nariz. Limpia la mente, abre los chakras superiores y conecta con el momento presente.

## Sananga (Gotas Oculares)

Extracto de raíz amazónica que se aplica en los ojos. Limpia la visión física y espiritual, libera bloqueos energéticos.

## Estructura del Retiro

- Círculo de apertura y limpieza con Palo Santo
- Aplicación de Rapé (3 rondas)
- Meditación guiada
- Aplicación de Sananga
- Integración y cierre

## Duración

2-3 horas

## Preparación

Venir con estómago vacío (4 horas sin comer)
    `,
    location: "Lima, Barranco",
    duration: "3 horas",
    price: "60",
    currency: "USD",
    guideName: "Facilitador Pedro Navarro",
    guideExperience: "8 años trabajando con medicinas amazónicas",
    guidePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200",
    whatsappNumber: "+51987654324",
    featured: false,
    published: true,
  },
  {
    title: "Ceremonia de Cacao Sagrado",
    slug: "ceremonia-cacao-sagrado",
    type: "cacao-ceremony",
    description: "Abre tu corazón con la medicina suave del Cacao ceremonial. Combinado con meditación, música y movimiento consciente para una experiencia de amor propio y conexión.",
    longDescription: `
# Ceremonia de Cacao

El cacao ceremonial es una medicina del corazón que abre, sana y conecta. Perfecto para principiantes en medicinas plant.

## Qué Esperar

- Bebida de cacao ceremonial preparado con intención
- Meditación guiada de apertura del corazón
- Música en vivo (cuencos tibetanos, tambor)
- Movimiento consciente y danza libre
- Círculo de compartir

## Beneficios

- Apertura del chakra del corazón
- Liberación emocional suave
- Conexión con otros
- Claridad y creatividad
- Sensación de amor y gratitud

## Ideal Para

Personas nuevas en ceremonias, quienes buscan sanación emocional suave, o complemento a otras prácticas espirituales.

## Incluye

- Cacao ceremonial de alta calidad
- Espacio acogedor con cojines y mantas
- Música en vivo
- Snacks saludables post-ceremonia
    `,
    location: "Cusco Centro",
    duration: "3 horas",
    price: "45",
    currency: "USD",
    guideName: "Facilitadora Luna Martínez",
    guideExperience: "5 años facilitando ceremonias de cacao",
    guidePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    imageUrl: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200",
    whatsappNumber: "+51987654325",
    featured: false,
    published: true,
  },
  {
    title: "Temazcal - Ceremonia de Sudoración",
    slug: "temazcal-ceremonia-sudoracion",
    type: "temazcal",
    description: "Renacimiento a través del calor y la oscuridad del vientre de la Madre Tierra. Ceremonia ancestral de purificación física, mental y espiritual.",
    longDescription: `
# Temazcal: El Vientre de la Madre Tierra

Ceremonia mesoamericana de purificación en un domo de tierra donde piedras volcánicas calientes crean vapor sagrado.

## Las 4 Puertas

La ceremonia se divide en 4 rondas (puertas), cada una representando una dirección y elemento:

1. **Este**: Nacimiento, aire, claridad mental
2. **Sur**: Inocencia, agua, purificación emocional
3. **Oeste**: Introspección, tierra, transformación
4. **Norte**: Sabiduría, fuego, integración

## Proceso

- Preparación y establecimiento de intenciones
- Entrada al temazcal
- 4 rondas de calor, cantos y oraciones
- Salida y enfriamiento
- Círculo de cierre

## Beneficios

- Desintoxicación profunda
- Liberación emocional
- Fortalecimiento del sistema inmune
- Claridad mental
- Conexión espiritual

## Qué Traer

Traje de baño, toalla, agua, ropa cómoda para después
    `,
    location: "Valle Sagrado, Pisac",
    duration: "4 horas",
    price: "70",
    currency: "USD",
    guideName: "Guardián del Fuego: Javier Huamán",
    guideExperience: "15 años conduciendo temazcales",
    guidePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200",
    whatsappNumber: "+51987654326",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de Bufo Alvarius (5-MeO-DMT)",
    slug: "retiro-bufo-alvarius",
    type: "bufo",
    description: "La experiencia más profunda de unidad y disolución del ego. Medicina sagrada del sapo del desierto de Sonora, conocida como 'la molécula de Dios'.",
    longDescription: `
# Bufo Alvarius: La Molécula de Dios

Experiencia de no-dualidad y unidad absoluta. Esta medicina es la más potente y rápida, durando 15-30 minutos pero con efectos transformadores duraderos.

## Qué Es

Secreción natural del sapo Bufo Alvarius del desierto de Sonora, contiene 5-MeO-DMT, uno de los psicodélicos más potentes conocidos.

## La Experiencia

- Preparación con meditación y respiración
- Inhalación de la medicina vaporizada
- 15-30 minutos de experiencia profunda
- Disolución del ego y sensación de unidad total
- Integración inmediata post-experiencia
- Sesión de integración al día siguiente

## Para Quién

Personas con experiencia previa en medicinas psicodélicas, buscando la experiencia más profunda de consciencia no-dual.

## Preparación Requerida

- Experiencia previa con psicodélicos
- Entrevista previa obligatoria
- Preparación mental y emocional
- Ayuno de 6 horas

## Incluye

- Sesión preparatoria
- Ceremonia privada (1:1)
- Sesión de integración
- Seguimiento post-ceremonia
    `,
    location: "Cusco, Espacio Privado",
    duration: "4 horas (ceremonia + integración)",
    price: "350",
    currency: "USD",
    guideName: "Facilitador Experimentado: Marco Silva",
    guideExperience: "12 años facilitando Bufo, 200+ ceremonias",
    guidePhoto: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
    whatsappNumber: "+51987654327",
    featured: true,
    published: true,
  },
  {
    title: "Dieta Amazónica con Plantas Maestras",
    slug: "dieta-amazonica-plantas-maestras",
    type: "plant-dieta",
    description: "Inmersión profunda de 7 días en la selva amazónica, trabajando con plantas maestras específicas. Aislamiento, dieta estricta y ceremonias nocturnas de Ayahuasca.",
    longDescription: `
# Dieta Amazónica Tradicional

La forma más profunda de trabajar con medicina plant. Retiro de aislamiento donde te conectas íntimamente con una planta maestra específica.

## Qué Es Una Dieta

Práctica tradicional shipibo donde te aislas en la selva, sigues una dieta estricta, y trabajas con una planta maestra específica que te enseña y sana.

## Estructura de 7 Días

- Día 1: Llegada, preparación, primera ceremonia
- Días 2-6: Aislamiento en tambo privado, dieta, ceremonias nocturnas
- Día 7: Cierre de dieta, integración

## Plantas Maestras Disponibles

- **Bobinsana**: Amor propio, corazón
- **Ajo Sacha**: Protección, fuerza
- **Chiric Sanango**: Artritis, dolor, poder personal
- **Marosa**: Sueños lúcidos, visión

## Incluye

- 7 noches en tambo privado en la selva
- 3 ceremonias de Ayahuasca
- Preparación diaria de planta maestra
- Comidas de dieta (arroz, plátano, pescado sin sal)
- Consultas con chamán
- Baños de plantas

## Preparación

Dieta de 1 semana antes (sin sal, azúcar, aceite, carnes rojas, lácteos, alcohol, sexo)
    `,
    location: "Pucallpa, Ucayali (Selva Amazónica)",
    duration: "7 días / 6 noches",
    price: "800",
    currency: "USD",
    guideName: "Maestro Shipibo: Don Alberto Manqueriapa",
    guideExperience: "40 años de práctica chamánica, linaje shipibo",
    guidePhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
    whatsappNumber: "+51987654328",
    featured: false,
    published: true,
  },
  {
    title: "Ceremonia de Hongos Psilocibios",
    slug: "ceremonia-hongos-psilocibios",
    type: "psilocybin",
    description: "Viaje introspectivo y sanador con hongos sagrados en un entorno seguro y ceremonial. Ideal para trabajo emocional profundo y expansión de consciencia.",
    longDescription: `
# Ceremonia de Hongos Sagrados

Los hongos psilocibios han sido usados ceremonialmente por miles de años. Esta experiencia ofrece sanación emocional, insights profundos y conexión espiritual.

## La Experiencia

Duración: 6-8 horas de experiencia activa

- Preparación y establecimiento de intenciones
- Toma de hongos en forma de té
- Fase de subida (30-60 min)
- Experiencia pico (3-4 horas)
- Integración y descenso
- Círculo de cierre

## Qué Incluye

- Dosis apropiada de hongos orgánicos
- Espacio ceremonial cómodo y seguro
- Música curativa durante la experiencia
- Facilitador presente todo el tiempo
- Comida ligera post-ceremonia
- Sesión de integración al día siguiente

## Beneficios Reportados

- Sanación de depresión y ansiedad
- Procesamiento de traumas
- Insights sobre patrones de vida
- Conexión con la naturaleza
- Experiencias místicas
- Creatividad aumentada

## Preparación

- Ayuno de 4 horas
- Intención clara
- Mente abierta y corazón dispuesto

## Contraindicaciones

No apto para personas con historial de psicosis o esquizofrenia
    `,
    location: "Cusco, Centro Ceremonial Privado",
    duration: "8 horas",
    price: "150",
    currency: "USD",
    guideName: "Facilitadora: Sofía Ramírez",
    guideExperience: "7 años facilitando ceremonias de hongos",
    guidePhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200",
    whatsappNumber: "+51987654329",
    featured: true,
    published: true,
  },
  {
    title: "Retiro de Respiración Holotrópica",
    slug: "retiro-respiracion-holotropica",
    type: "breathwork",
    description: "Alcanza estados alterados de consciencia sin sustancias, solo con el poder de la respiración. Técnica desarrollada por Stanislav Grof para sanación profunda.",
    longDescription: `
# Respiración Holotrópica

Técnica poderosa de respiración que induce estados no-ordinarios de consciencia, similares a experiencias psicodélicas, pero sin sustancias.

## Qué Es

Desarrollada por el Dr. Stanislav Grof, esta técnica combina respiración acelerada, música evocativa, y trabajo corporal para acceder a sanación profunda.

## Proceso de la Sesión

1. **Introducción**: Teoría y preparación (30 min)
2. **Respiración**: 2-3 horas de respiración guiada con música
3. **Mandala**: Expresión artística de la experiencia
4. **Compartir**: Círculo de integración grupal

## Qué Experimentar

- Estados alterados de consciencia
- Revivir memorias reprimidas
- Experiencias transpersonales
- Liberación emocional catártica
- Insights profundos
- Sanación de traumas

## Beneficios

- Procesamiento de traumas
- Liberación emocional
- Claridad mental
- Conexión espiritual
- Autoconocimiento profundo

## Ventajas

- Sin sustancias
- Completamente legal
- Control sobre la intensidad
- Seguro para la mayoría de personas

## Incluye

- Sesión de 4 horas
- Colchonetas y mantas
- Música curada especialmente
- Materiales para mandala
- Snacks y té post-sesión

## Contraindicaciones

No apto para embarazo, problemas cardiovasculares, o ciertos problemas psiquiátricos
    `,
    location: "Lima, San Isidro",
    duration: "5 horas",
    price: "90",
    currency: "USD",
    guideName: "Facilitador Certificado: Diego Torres",
    guideExperience: "Certificado por Grof Transpersonal Training, 6 años facilitando",
    guidePhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200",
    whatsappNumber: "+51987654330",
    featured: false,
    published: true,
  },
];

async function seedTherapies() {
  try {
    console.log("🌱 Starting to seed therapies...");

    // Clear existing therapies (optional - comment out if you want to keep existing data)
    // await db.delete(therapies);
    // console.log("🗑️  Cleared existing therapies");

    // Insert new therapies
    for (const therapy of sampleTherapies) {
      await db.insert(therapies).values({
        id: nanoid(),
        ...therapy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Created: ${therapy.title}`);
    }

    console.log("\n🎉 Successfully seeded all therapies!");
    console.log(`📊 Total therapies created: ${sampleTherapies.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding therapies:", error);
    process.exit(1);
  }
}

seedTherapies();
