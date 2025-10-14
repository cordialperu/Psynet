import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Therapy } from "@shared/schema";
import { useState } from "react";

export default function HomeNatural() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Plants - Left Side */}
      <div className="fixed left-0 top-0 h-full w-32 pointer-events-none z-10">
        <svg className="absolute bottom-0 left-0 w-full h-auto animate-sway" viewBox="0 0 100 400" fill="none">
          <path d="M20 400 Q30 350 25 300 Q20 250 30 200 Q35 150 25 100 Q20 50 25 0" 
                stroke="#10b981" strokeWidth="3" fill="none" opacity="0.3"/>
          <ellipse cx="25" cy="80" rx="15" ry="25" fill="#34d399" opacity="0.4" className="animate-leaf"/>
          <ellipse cx="30" cy="150" rx="18" ry="28" fill="#10b981" opacity="0.5" className="animate-leaf-delayed"/>
          <ellipse cx="22" cy="220" rx="16" ry="26" fill="#059669" opacity="0.4" className="animate-leaf"/>
          <ellipse cx="28" cy="290" rx="17" ry="27" fill="#34d399" opacity="0.5" className="animate-leaf-delayed"/>
        </svg>
        <svg className="absolute bottom-0 left-8 w-full h-auto animate-sway-delayed" viewBox="0 0 100 350" fill="none">
          <path d="M40 350 Q35 300 40 250 Q45 200 38 150 Q35 100 40 50 Q42 25 40 0" 
                stroke="#14b8a6" strokeWidth="2.5" fill="none" opacity="0.3"/>
          <ellipse cx="40" cy="60" rx="14" ry="24" fill="#5eead4" opacity="0.4" className="animate-leaf"/>
          <ellipse cx="38" cy="130" rx="16" ry="26" fill="#2dd4bf" opacity="0.5" className="animate-leaf-delayed"/>
          <ellipse cx="42" cy="200" rx="15" ry="25" fill="#14b8a6" opacity="0.4" className="animate-leaf"/>
        </svg>
      </div>

      {/* Animated Plants - Right Side */}
      <div className="fixed right-0 top-0 h-full w-32 pointer-events-none z-10">
        <svg className="absolute bottom-0 right-0 w-full h-auto animate-sway-reverse" viewBox="0 0 100 400" fill="none">
          <path d="M80 400 Q70 350 75 300 Q80 250 70 200 Q65 150 75 100 Q80 50 75 0" 
                stroke="#10b981" strokeWidth="3" fill="none" opacity="0.3"/>
          <ellipse cx="75" cy="80" rx="15" ry="25" fill="#34d399" opacity="0.4" className="animate-leaf"/>
          <ellipse cx="70" cy="150" rx="18" ry="28" fill="#10b981" opacity="0.5" className="animate-leaf-delayed"/>
          <ellipse cx="78" cy="220" rx="16" ry="26" fill="#059669" opacity="0.4" className="animate-leaf"/>
          <ellipse cx="72" cy="290" rx="17" ry="27" fill="#34d399" opacity="0.5" className="animate-leaf-delayed"/>
        </svg>
        <svg className="absolute bottom-0 right-8 w-full h-auto animate-sway-delayed-reverse" viewBox="0 0 100 350" fill="none">
          <path d="M60 350 Q65 300 60 250 Q55 200 62 150 Q65 100 60 50 Q58 25 60 0" 
                stroke="#14b8a6" strokeWidth="2.5" fill="none" opacity="0.3"/>
          <ellipse cx="60" cy="60" rx="14" ry="24" fill="#5eead4" opacity="0.4" className="animate-leaf"/>
          <ellipse cx="62" cy="130" rx="16" ry="26" fill="#2dd4bf" opacity="0.5" className="animate-leaf-delayed"/>
          <ellipse cx="58" cy="200" rx="15" ry="25" fill="#14b8a6" opacity="0.4" className="animate-leaf"/>
        </svg>
      </div>

      {/* Floating leaves decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-leaf"
            style={{
              left: `${10 + i * 12}%`,
              top: `${-10 + Math.random() * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <ellipse cx="15" cy="15" rx="12" ry="18" fill="#10b981" opacity="0.2" />
            </svg>
          </div>
        ))}
      </div>

      {/* Simple Header */}
      <header className="relative z-20 bg-white/80 backdrop-blur-sm border-b border-emerald-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-emerald-900">PsycheConecta</h1>
                <p className="text-xs text-emerald-600">Medicina Ancestral</p>
              </div>
            </a>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/"><a className="text-emerald-700 hover:text-emerald-900 font-medium">Inicio</a></Link>
            <Link href="/how-it-works"><a className="text-emerald-700 hover:text-emerald-900 font-medium">Cómo Funciona</a></Link>
            <Link href="/admin/login"><a className="text-emerald-700 hover:text-emerald-900 font-medium">Guías</a></Link>
          </nav>
        </div>
      </header>

      {/* Main Content - Ceremonies First */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-emerald-900 mb-4">
            Ceremonias Disponibles
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Conecta con la sabiduría ancestral a través de nuestras ceremonias auténticas
          </p>
        </div>

        {/* Ceremonies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {therapies.map((therapy) => (
              <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                <a
                  onMouseEnter={() => setHoveredCard(therapy.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="block group"
                >
                  <div className={`
                    bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden 
                    border-2 border-emerald-200 hover:border-emerald-400
                    shadow-lg hover:shadow-2xl
                    transform transition-all duration-500
                    ${hoveredCard === therapy.id ? 'scale-105 -rotate-1' : 'scale-100'}
                  `}>
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={therapy.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600`}
                        alt={therapy.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent" />
                      
                      {/* Price Badge */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-emerald-900 font-bold text-lg">
                          {therapy.currency} {therapy.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-serif font-bold text-emerald-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {therapy.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-emerald-700 mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{therapy.location}</span>
                      </div>

                      {/* Available Dates */}
                      <div className="flex items-start gap-2 text-emerald-600">
                        <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          {therapy.availableDates && therapy.availableDates.length > 0 ? (
                            <div className="space-y-1">
                              {therapy.availableDates.slice(0, 2).map((date, idx) => (
                                <div key={idx} className="font-medium">{date}</div>
                              ))}
                              {therapy.availableDates.length > 2 && (
                                <div className="text-emerald-500">+{therapy.availableDates.length - 2} más</div>
                              )}
                            </div>
                          ) : (
                            <span className="italic">Consultar fechas disponibles</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}

        {therapies.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-2xl text-emerald-700">No hay ceremonias disponibles en este momento</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 mt-20 bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif font-bold mb-4">PsycheConecta</h3>
          <p className="text-emerald-200 mb-6">Conectando con la medicina ancestral</p>
          <p className="text-emerald-300 text-sm">© 2025 PsycheConecta. Todos los derechos reservados.</p>
        </div>
      </footer>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(10px) rotate(2deg); }
        }
        @keyframes sway-delayed {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(-8px) rotate(-2deg); }
        }
        @keyframes sway-reverse {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(-10px) rotate(-2deg); }
        }
        @keyframes sway-delayed-reverse {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(8px) rotate(2deg); }
        }
        @keyframes leaf {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        @keyframes leaf-delayed {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(-5deg); }
        }
        @keyframes float-leaf {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-sway {
          animation: sway 8s ease-in-out infinite;
        }
        .animate-sway-delayed {
          animation: sway-delayed 10s ease-in-out infinite;
        }
        .animate-sway-reverse {
          animation: sway-reverse 8s ease-in-out infinite;
        }
        .animate-sway-delayed-reverse {
          animation: sway-delayed-reverse 10s ease-in-out infinite;
        }
        .animate-leaf {
          animation: leaf 4s ease-in-out infinite;
        }
        .animate-leaf-delayed {
          animation: leaf-delayed 5s ease-in-out infinite;
        }
        .animate-float-leaf {
          animation: float-leaf linear infinite;
        }
      `}</style>
    </div>
  );
}
