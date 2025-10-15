// Demo data for when database is not available
export const DEMO_THERAPIES = [
  {
    id: "demo-1",
    guideId: "guide-1",
    guideName: "Juan Pachamama",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    country: "PE",
    category: "ceremonias",
    title: "3-Day Ayahuasca Retreat in Sacred Valley",
    slug: "3-day-ayahuasca-sacred-valley",
    description: "Transformative plant medicine ceremony in the heart of the Peruvian Amazon. Includes shamanic guidance, breathwork, and integration sessions.",
    type: "ayahuasca-retreat",
    basePrice: "450",
    platformFee: "112.50",
    language: "es",
    location: "Sacred Valley, Peru",
    durationMinutes: 1440,
    maxParticipants: 8,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Sacred+Valley,+Peru",
    published: true,
    publishedOn: new Date().toISOString(),
    approval: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
    whatsapp: "+51987654321",
    instagram: "@juanpachamama",
  },
  {
    id: "demo-2",
    guideId: "guide-2",
    guideName: "María San Pedro",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    country: "PE",
    category: "ceremonias",
    title: "San Pedro Ceremony - Connection to Nature",
    slug: "san-pedro-ceremony-connection",
    description: "Ancient San Pedro cactus ceremony for spiritual awakening and connection with nature. Experienced facilitator with 15 years of practice.",
    type: "san-pedro",
    basePrice: "350",
    platformFee: "87.50",
    language: "es",
    location: "Cusco, Peru",
    durationMinutes: 720,
    maxParticipants: 12,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Cusco,+Peru",
    published: true,
    publishedOn: new Date().toISOString(),
    approval: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
    whatsapp: "+51987654322",
    instagram: "@mariasanpedro",
  },
  {
    id: "demo-3",
    guideId: "guide-3",
    guideName: "Carlos Kambo",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    country: "PE",
    category: "terapias",
    title: "Kambo Therapy - Detox & Renewal",
    slug: "kambo-therapy-detox",
    description: "Traditional Amazonian Kambo ritual for deep physical and energetic cleansing. Professional practitioner certified in ritual medicine.",
    type: "kambo",
    basePrice: "200",
    platformFee: "50",
    language: "es",
    location: "Iquitos, Peru",
    durationMinutes: 180,
    maxParticipants: 6,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Iquitos,+Peru",
    published: true,
    publishedOn: new Date().toISOString(),
    approval: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
    whatsapp: "+51987654323",
    instagram: "@carloskambo",
  },
  {
    id: "demo-4",
    guideId: "guide-4",
    guideName: "Isabella Microdosis",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    country: "MX",
    category: "microdosis",
    title: "Psilocybin Microdosing Program - 8 Weeks",
    slug: "psilocybin-microdose-8weeks",
    description: "Guided microdosing journey with integration support. Includes weekly check-ins and personalized guidance for optimal results.",
    type: "psilocybin-microdose",
    basePrice: "600",
    platformFee: "150",
    language: "es",
    location: "Mexico City, Mexico",
    durationMinutes: 10080,
    maxParticipants: 10,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Mexico+City,+Mexico",
    published: true,
    publishedOn: new Date().toISOString(),
    approval: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
    whatsapp: "+52123456789",
    instagram: "@isabellaamicro",
  },
  {
    id: "demo-5",
    guideId: "guide-5",
    guideName: "David Meditation",
    guidePhotoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    country: "MX",
    category: "terapias",
    title: "Guided Meditation & Breathwork Retreat",
    slug: "meditation-breathwork-retreat",
    description: "5-day meditation and breathwork intensive for stress relief and inner peace. Daily sessions with experienced yoga instructor.",
    type: "meditation",
    basePrice: "300",
    platformFee: "75",
    language: "es",
    location: "Oaxaca, Mexico",
    durationMinutes: 2880,
    maxParticipants: 15,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    googleMapsUrl: "https://maps.google.com/?q=Oaxaca,+Mexico",
    published: true,
    publishedOn: new Date().toISOString(),
    approval: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
    whatsapp: "+52987654321",
    instagram: "@davidmeditacion",
  },
];

export function filterDemoTherapies(filters?: {
  type?: string;
  location?: string;
  search?: string;
  country?: string;
}) {
  let result = [...DEMO_THERAPIES];

  if (filters?.country) {
    result = result.filter((t) => t.country === filters.country);
  }

  if (filters?.type) {
    result = result.filter((t) => t.type === filters.type);
  }

  if (filters?.location) {
    result = result.filter((t) =>
      t.location?.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(searchLower) ||
        t.guideName.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
    );
  }

  return result;
}
