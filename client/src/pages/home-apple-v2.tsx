import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, Star, Play } from "lucide-react";
import { Link } from "wouter";
import type { Therapy } from "@shared/schema";
import { useState } from "react";

export default function HomeAppleV2() {
  const [selectedType, setSelectedType] = useState<string>('all');

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
      {/* Filters - Mobile First, Sticky */}
      <section className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                selectedType === 'all'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-900 active:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  selectedType === type
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-900 active:bg-gray-200'
                }`}
              >
                {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Therapies List - Horizontal Layout */}
      <section className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredTherapies.length > 0 ? (
          <div className="space-y-3">
            {filteredTherapies.map((therapy) => {
              const videoId = therapy.videoUrl ? getYouTubeVideoId(therapy.videoUrl) : null;
              return (
                <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                  <a className="block">
                    <div className="flex gap-3 bg-white rounded-2xl overflow-hidden border border-gray-200 active:bg-gray-50 transition-colors">
                      {/* Video Thumbnail - Compact */}
                      <div className="relative w-40 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                        {videoId ? (
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                            alt={therapy.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
                            alt={therapy.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        
                        {/* Play Button - Small */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
                          </div>
                        </div>

                        {/* Type Badge - Small */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 rounded-md">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                            {therapy.type.split('-')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Content - Compact */}
                      <div className="flex-1 py-3 pr-3 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1 leading-tight">
                          {therapy.title}
                        </h3>
                        
                        {/* Guide Name with Star */}
                        {therapy.guideName && (
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600 line-clamp-1">{therapy.guideName}</span>
                          </div>
                        )}

                        {/* Meta Info - Compact */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="line-clamp-1">{therapy.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">{therapy.duration}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-gray-900">
                            ${therapy.price}
                          </span>
                          <span className="text-xs text-gray-500">USD</span>
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
            <p className="text-lg text-gray-500">No hay ceremonias disponibles</p>
          </div>
        )}
      </section>

      {/* Footer - Minimal Mobile */}
      <footer className="border-t border-gray-200 py-8 px-4 mt-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/"><a className="text-gray-500 active:text-gray-900">Ceremonias</a></Link>
            <Link href="/how-it-works"><a className="text-gray-500 active:text-gray-900">Cómo Funciona</a></Link>
            <Link href="/admin/login"><a className="text-gray-500 active:text-gray-900">Guías</a></Link>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 PsycheConecta
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
