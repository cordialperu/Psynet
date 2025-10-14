import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, Star, Play } from "lucide-react";
import { Link } from "wouter";
import type { Therapy } from "@shared/schema";
import { useState } from "react";

export default function HomeApple() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  const filteredTherapies = selectedType === 'all' 
    ? therapies 
    : therapies.filter(t => t.type === selectedType);

  const types = Array.from(new Set(therapies.map(t => t.type)));

  // Función para extraer el ID del video de YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Apple Style */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-[980px] mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.05]">
            Ceremonias
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 font-normal leading-snug max-w-3xl mx-auto">
            Experiencias auténticas de medicina ancestral en Perú
          </p>
        </div>
      </section>

      {/* Filters - Apple Style Pills */}
      <section className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedType === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedType === type
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Therapies Grid - Apple Style */}
      <section className="py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredTherapies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTherapies.map((therapy) => {
                const videoId = therapy.videoUrl ? getYouTubeVideoId(therapy.videoUrl) : null;
                return (
                  <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                    <a 
                      className="block group"
                      onMouseEnter={() => setHoveredId(therapy.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="relative">
                        {/* Video Thumbnail */}
                        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-gray-100 mb-4">
                          {videoId ? (
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                              alt={therapy.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                              }}
                            />
                          ) : (
                            <img
                              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
                              alt={therapy.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          )}
                          
                          {/* Play Button Overlay */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                            hoveredId === therapy.id ? 'opacity-100' : 'opacity-0'
                          }`}>
                            <div className="w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                            </div>
                          </div>

                          {/* Type Badge */}
                          <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full">
                            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                              {therapy.type.replace('-', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-2">
                          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 leading-tight">
                            {therapy.title}
                          </h3>
                          
                          <p className="text-base text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                            {therapy.description}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            {therapy.guideName && (
                              <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span>{therapy.guideName}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              <span>{therapy.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{therapy.duration}</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-semibold text-gray-900">
                              ${therapy.price}
                            </span>
                            <span className="text-sm text-gray-500">USD</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No hay ceremonias disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Apple Style */}
      <footer className="border-t border-gray-200 py-12 px-4 mt-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-500">
              © 2025 PsycheConecta. Todos los derechos reservados.
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/"><a className="text-gray-500 hover:text-gray-900 transition-colors">Ceremonias</a></Link>
              <Link href="/how-it-works"><a className="text-gray-500 hover:text-gray-900 transition-colors">Cómo Funciona</a></Link>
              <Link href="/admin/login"><a className="text-gray-500 hover:text-gray-900 transition-colors">Portal Guías</a></Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
