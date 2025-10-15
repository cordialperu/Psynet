// Vercel Serverless Function for API
// This file needs to be self-contained with all dependencies bundled

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory demo data for when DB is unavailable
const DEMO_THERAPIES = [
  {
    id: 1,
    title: "Ceremonia de Ayahuasca en Valle Sagrado",
    description: "Experiencia transformadora de 3 días en el Valle Sagrado de Perú",
    type: "ayahuasca",
    location: "Cusco",
    country: "PE",
    price: 450,
    duration: "3 días",
    status: "published",
    guideId: "demo-guide-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Retiro de San Pedro en Desierto",
    description: "Ceremonia de cactus sagrado en un entorno desértico tranquilo",
    type: "san_pedro",
    location: "Lima",
    country: "PE",
    price: 300,
    duration: "2 días",
    status: "published",
    guideId: "demo-guide-2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Ceremonia de Temazcal en Teotihuacán",
    description: "Ritual ancestral de purificación con vapor y plantas medicinales",
    type: "temazcal",
    location: "Ciudad de México",
    country: "MX",
    price: 120,
    duration: "1 día",
    status: "published",
    guideId: "demo-guide-3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "Retiro de Hongos en Oaxaca",
    description: "Experiencia con hongos sagrados guiada por curanderos tradicionales",
    type: "psilocybin",
    location: "Oaxaca",
    country: "MX",
    price: 250,
    duration: "2 días",
    status: "published",
    guideId: "demo-guide-4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    title: "Ceremonia de Kambo en Amazonía",
    description: "Medicina de la rana para limpieza física y energética",
    type: "kambo",
    location: "Iquitos",
    country: "PE",
    price: 180,
    duration: "1 día",
    status: "published",
    guideId: "demo-guide-5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req;
  
  console.log(`${method} ${url}`);

  // Health check
  if (url === '/api/health') {
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production",
      database: process.env.DATABASE_URL ? "configured" : "missing",
    });
  }

  // Get published therapies
  if (url?.startsWith('/api/therapies/published')) {
    try {
      const urlParams = new URL(url, `http://${req.headers.host}`).searchParams;
      const country = urlParams.get('country');
      const type = urlParams.get('type');
      const search = urlParams.get('search');

      console.log('Filters:', { country, type, search });

      let filtered = DEMO_THERAPIES.filter(t => t.status === 'published');

      if (country) {
        filtered = filtered.filter(t => t.country === country);
      }

      if (type) {
        filtered = filtered.filter(t => t.type === type);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.location.toLowerCase().includes(searchLower)
        );
      }

      console.log(`Returning ${filtered.length} therapies`);
      return res.status(200).json(filtered);
    } catch (error: any) {
      console.error('Error in /api/therapies/published:', error);
      return res.status(500).json({
        message: "Failed to fetch therapies",
        error: error.message,
      });
    }
  }

  // Get single therapy
  if (url?.match(/^\/api\/therapies\/\d+$/)) {
    const id = parseInt(url.split('/').pop() || '0');
    const therapy = DEMO_THERAPIES.find(t => t.id === id);
    
    if (!therapy) {
      return res.status(404).json({ message: "Therapy not found" });
    }
    
    return res.status(200).json(therapy);
  }

  // Get all guides
  if (url === '/api/guides') {
    return res.status(200).json([
      {
        id: "demo-guide-1",
        email: "guide1@example.com",
        fullName: "María Fernandez",
        whatsapp: "51987654321",
        createdAt: new Date(),
      },
      {
        id: "demo-guide-2",
        email: "guide2@example.com",
        fullName: "Carlos Mendoza",
        whatsapp: "51987654322",
        createdAt: new Date(),
      },
    ]);
  }

  // Default 404
  return res.status(404).json({
    message: "Not found",
    url,
    method,
  });
}
