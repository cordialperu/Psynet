import { db } from "./index";
import { guides, therapies } from "@shared/schema";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

async function seed() {
  console.log("Seeding database...");

  // Create sample guides
  const guide1Id = randomUUID();
  const guide2Id = randomUUID();
  const guide3Id = randomUUID();

  const passwordHash = await bcrypt.hash("password123", 10);

  const sampleGuides = [
    {
      id: guide1Id,
      fullName: "Maria Quispe",
      email: "maria@psycheconecta.com",
      passwordHash,
      primarySpecialty: "Ayahuasca Ceremonies",
      bio: "Traditional healer with 15 years of experience in ayahuasca ceremonies. Trained by indigenous shamans in the Amazon rainforest.",
      profilePhotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      activeTherapies: ["ayahuasca", "san-pedro"],
    },
    {
      id: guide2Id,
      fullName: "Carlos Mendoza",
      email: "carlos@psycheconecta.com",
      passwordHash,
      primarySpecialty: "San Pedro & Wachuma",
      bio: "Expert in Andean plant medicine with deep roots in Peruvian indigenous traditions. Specializes in San Pedro and Wachuma ceremonies.",
      profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      activeTherapies: ["san-pedro", "wachuma"],
    },
    {
      id: guide3Id,
      fullName: "Sofia Ramirez",
      email: "sofia@psycheconecta.com",
      passwordHash,
      primarySpecialty: "Holistic Healing",
      bio: "Integrative healer combining traditional Amazonian practices with modern therapeutic approaches. Specializes in Kambo and Rapé.",
      profilePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      activeTherapies: ["kambo", "rapé", "cacao-ceremony"],
    },
  ];

  await db.insert(guides).values(sampleGuides);
  console.log("✓ Created 3 sample guides");

  // Create sample therapies
  const sampleTherapies = [
    {
      guideId: guide1Id,
      guideName: "Maria Quispe",
      guidePhotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      title: "3-Day Ayahuasca Retreat in Sacred Valley",
      slug: "3-day-ayahuasca-retreat-sacred-valley-" + randomUUID().slice(0, 8),
      description: "Experience a transformative 3-day ayahuasca retreat in the heart of Peru's Sacred Valley. Includes 2 ceremonies, integration sessions, and traditional shamanic practices.",
      type: "ayahuasca",
      price: "450.00",
      currency: "USD",
      duration: "3 days",
      location: "Sacred Valley, Cusco",
      availableDates: ["2025-11-15", "2025-11-22", "2025-12-01"],
      isPublished: true,
    },
    {
      guideId: guide1Id,
      guideName: "Maria Quispe",
      guidePhotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      title: "Single Ayahuasca Ceremony",
      slug: "single-ayahuasca-ceremony-" + randomUUID().slice(0, 8),
      description: "A powerful one-night ayahuasca ceremony with experienced shamanic guidance. Perfect for first-timers or those seeking a focused healing experience.",
      type: "ayahuasca",
      price: "120.00",
      currency: "USD",
      duration: "1 night",
      location: "Pisac, Sacred Valley",
      availableDates: ["2025-11-10", "2025-11-17", "2025-11-24"],
      isPublished: true,
    },
    {
      guideId: guide2Id,
      guideName: "Carlos Mendoza",
      guidePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      title: "San Pedro Mountain Ceremony",
      slug: "san-pedro-mountain-ceremony-" + randomUUID().slice(0, 8),
      description: "Join us for a sacred San Pedro ceremony in the Andean mountains. Experience the healing power of this ancient cactus medicine while surrounded by breathtaking mountain views.",
      type: "san-pedro",
      price: "180.00",
      currency: "USD",
      duration: "Full day",
      location: "Machu Picchu region",
      availableDates: ["2025-11-12", "2025-11-19", "2025-11-26"],
      isPublished: true,
    },
    {
      guideId: guide2Id,
      guideName: "Carlos Mendoza",
      guidePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      title: "Wachuma Healing Journey",
      slug: "wachuma-healing-journey-" + randomUUID().slice(0, 8),
      description: "A deeply transformative Wachuma (San Pedro) ceremony combining traditional Andean practices with personal healing work. Includes preparation and integration support.",
      type: "wachuma",
      price: "200.00",
      currency: "USD",
      duration: "Full day",
      location: "Ollantaytambo",
      availableDates: ["2025-11-14", "2025-11-21", "2025-11-28"],
      isPublished: true,
    },
    {
      guideId: guide3Id,
      guideName: "Sofia Ramirez",
      guidePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      title: "Kambo Purification Ceremony",
      slug: "kambo-purification-ceremony-" + randomUUID().slice(0, 8),
      description: "Experience the powerful cleansing effects of Kambo medicine. This traditional Amazonian frog medicine ceremony helps release physical and emotional blockages.",
      type: "kambo",
      price: "90.00",
      currency: "USD",
      duration: "2-3 hours",
      location: "Cusco City",
      availableDates: ["2025-11-11", "2025-11-18", "2025-11-25"],
      isPublished: true,
    },
    {
      guideId: guide3Id,
      guideName: "Sofia Ramirez",
      guidePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      title: "Sacred Cacao Ceremony",
      slug: "sacred-cacao-ceremony-" + randomUUID().slice(0, 8),
      description: "Open your heart with ceremonial-grade cacao in a sacred setting. This gentle yet powerful ceremony promotes emotional healing and spiritual connection.",
      type: "cacao-ceremony",
      price: "60.00",
      currency: "USD",
      duration: "2 hours",
      location: "Cusco City",
      availableDates: ["2025-11-13", "2025-11-20", "2025-11-27"],
      isPublished: true,
    },
  ];

  await db.insert(therapies).values(sampleTherapies);
  console.log("✓ Created 6 sample therapies");

  console.log("\n✅ Database seeded successfully!");
  console.log("\nSample credentials:");
  console.log("- maria@psycheconecta.com / password123");
  console.log("- carlos@psycheconecta.com / password123");
  console.log("- sofia@psycheconecta.com / password123");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
