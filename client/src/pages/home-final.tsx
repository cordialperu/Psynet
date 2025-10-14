import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, Star, CheckCircle, Leaf } from "lucide-react";
import { Link } from "wouter";
import type { Therapy } from "@shared/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HomeFinal() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 relative overflow-hidden">
      {/* Mystical Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Stars/Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/40 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Filters */}
      <section className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mb-8">
        <div className="bg-teal-900/40 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-teal-500/30">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white shadow-lg shadow-teal-500/50 scale-105'
                  : 'bg-teal-800/50 text-teal-200 hover:bg-teal-700/50 border border-teal-500/30'
              }`}
            >
              Todas ({therapies.length})
            </button>
            {types.map(type => {
              const count = therapies.filter(t => t.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white shadow-lg shadow-teal-500/50 scale-105'
                      : 'bg-teal-800/50 text-teal-200 hover:bg-teal-700/50 border border-teal-500/30'
                  }`}
                >
                  {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Therapies List */}
      <section className="relative pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-3xl h-64 animate-pulse" />
              ))}
            </div>
          ) : filteredTherapies.length > 0 ? (
            <div className="space-y-6">
              {filteredTherapies.map((therapy) => (
                <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                  <a className="block group">
                    <div className="bg-teal-900/40 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-teal-500/30 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 transform hover:-translate-y-1">
                      <div className="flex flex-col md:flex-row">
                        {/* YouTube Thumbnail */}
                        <div className="relative md:w-96 h-64 md:h-auto flex-shrink-0 overflow-hidden">
                          {therapy.videoUrl && getYouTubeVideoId(therapy.videoUrl) ? (
                            <>
                              <img
                                src={`https://img.youtube.com/vi/${getYouTubeVideoId(therapy.videoUrl)}/maxresdefault.jpg`}
                                alt={therapy.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  e.currentTarget.src = `https://img.youtube.com/vi/${getYouTubeVideoId(therapy.videoUrl!)}/hqdefault.jpg`;
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 to-emerald-600/30" />
                            </>
                          ) : (
                            <>
                              <img
                                src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`}
                                alt={therapy.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 to-emerald-600/30" />
                            </>
                          )}
                          {/* Verified Badge */}
                          <div className="absolute top-4 right-4 bg-teal-900/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-teal-400/50">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-200">Verificado</span>
                          </div>
                          {/* Type Badge */}
                          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                            <span className="text-sm font-bold uppercase tracking-wide">
                              {therapy.type.replace('-', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 md:p-10">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1">
                              {/* Title */}
                              <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors leading-tight">
                                {therapy.title}
                              </h3>

                              {/* Guide Name */}
                              {therapy.guideName && (
                                <div className="flex items-center gap-2 mb-4">
                                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                  <span className="text-lg font-medium text-teal-200">{therapy.guideName}</span>
                                </div>
                              )}

                              {/* Description */}
                              <p className="text-lg text-teal-200 mb-6 line-clamp-2 leading-relaxed">
                                {therapy.description}
                              </p>

                              {/* Info */}
                              <div className="flex flex-wrap gap-6 text-teal-300">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-5 h-5 text-emerald-400" />
                                  <span className="font-medium">{therapy.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-emerald-400" />
                                  <span className="font-medium">{therapy.duration}</span>
                                </div>
                              </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-4 md:min-w-[200px]">
                              <div className="text-left md:text-right">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                  ${therapy.price}
                                </div>
                                <div className="text-sm text-teal-300 font-medium">por persona</div>
                              </div>
                              <Button className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-teal-500/50 hover:shadow-xl hover:shadow-emerald-500/50 transform hover:scale-105 transition-all">
                                Ver ceremonia
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">No hay ceremonias disponibles en esta categoría</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-950 to-teal-950 text-white py-16 border-t border-teal-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-emerald-400" />
              <h3 className="text-3xl font-heading font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">PsycheConecta</h3>
            </div>
            <p className="text-teal-300 text-lg mb-8">Conectando con la medicina ancestral</p>
            <div className="flex justify-center gap-8 text-teal-300">
              <Link href="/"><a className="hover:text-emerald-300 transition-colors">Ceremonias</a></Link>
              <Link href="/how-it-works"><a className="hover:text-emerald-300 transition-colors">Cómo Funciona</a></Link>
              <Link href="/admin/login"><a className="hover:text-emerald-300 transition-colors">Guías</a></Link>
            </div>
            <p className="text-teal-400 text-sm mt-8">© 2025 PsycheConecta. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
