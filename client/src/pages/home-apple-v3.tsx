import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, Infinity, Play } from "lucide-react";
import type { Therapy } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { AuthDialog } from "@/components/auth-dialog";
import { useCountry } from "@/contexts/country-context";
import { MainNavbar } from "@/components/main-navbar";
import { useSwipe } from "@/hooks/use-swipe";
import { improveIOSScrolling } from "@/lib/mobile-utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function formatAvailableDate(dateString: string): string {
  if (!dateString) return "";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }
  return dateFormatter.format(parsed);
}

export default function HomeAppleV3() {
  const { selectedCountry } = useCountry();
  const [selectedType, setSelectedType] = useState<string>('all'); // Inicia en 'all' mostrando todas
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Define all possible categories (order for swipe) - Con 'all' al inicio
  const allCategories = [
    { value: 'all', label: 'Categories' },
    { value: 'ceremonias', label: 'Ceremonies' },
    { value: 'terapias', label: 'Therapies' },
    { value: 'microdosis', label: 'Microdosing' },
    { value: 'medicina', label: 'Medicine' },
    { value: 'eventos', label: 'Events' },
    { value: 'productos', label: 'Products' },
  ];

  // Estado para feedback visual del swipe
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Optimize mobile experience
  useEffect(() => {
    improveIOSScrolling();
  }, []);

  // Read category parameter from URL on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && allCategories.some(cat => cat.value === categoryParam)) {
      setSelectedType(categoryParam);
    }
  }, []);

  // Listen to global navbar events for search and category changes
  useEffect(() => {
    const onSearch = (e: Event) => {
      const detail = (e as CustomEvent).detail as { q?: string } | undefined;
      if (typeof detail?.q === 'string') setSearchTerm(detail.q);
    };
    const onCategory = (e: Event) => {
      const detail = (e as CustomEvent).detail as { value?: string } | undefined;
      if (typeof detail?.value === 'string') setSelectedType(detail.value as any);
    };
    window.addEventListener('psynet:search', onSearch as EventListener);
    window.addEventListener('psynet:category', onCategory as EventListener);
    return () => {
      window.removeEventListener('psynet:search', onSearch as EventListener);
      window.removeEventListener('psynet:category', onCategory as EventListener);
    };
  }, []);

  const { data: therapies = [], isLoading, isError } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published", { country: selectedCountry }],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/therapies/published?country=${selectedCountry}`);
        if (!response.ok) {
          console.error('API error:', response.status, response.statusText);
          return []; // Return empty array on error
        }
        const data = await response.json();
        console.log('Fetched therapies:', data.length);
        return data;
      } catch (error) {
        console.error('Fetch error:', error);
        return []; // Return empty array on network error
      }
    },
    retry: 0, // No retry to avoid hanging
    staleTime: 60000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Filtrar por categoría y búsqueda
  const filteredTherapies = therapies
    .filter(t => selectedType === 'all' || (t.category || 'ceremonias') === selectedType)
    .filter(t => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search) ||
        t.guideName?.toLowerCase().includes(search)
      );
    });
  
  // Mapeo de color de borde por categoría para cada tarjeta
  const cardBorderByCategory = (cat?: string | null) => {
    const c = (cat || 'ceremonias').toLowerCase();
    if (c === 'ceremonias') return 'border-purple-300 dark:border-purple-500';
    if (c === 'terapias') return 'border-blue-300 dark:border-blue-500';
    if (c === 'microdosis') return 'border-green-300 dark:border-green-500';
    if (c === 'medicina') return 'border-amber-300 dark:border-amber-500';
    if (c === 'eventos') return 'border-pink-300 dark:border-pink-500';
    if (c === 'productos') return 'border-cyan-300 dark:border-cyan-500';
    return 'border-gray-300 dark:border-gray-600';
  };

  // Función para extraer el ID del video de YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Configuración del hook useSwipe para navegación entre categorías
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      const currentIndex = allCategories.findIndex(cat => cat.value === selectedType);
      const nextIndex = (currentIndex + 1) % allCategories.length;
      const nextCategory = allCategories[nextIndex].value;
      setSelectedType(nextCategory);
      
      // Notificar al navbar del cambio de categoría
      window.dispatchEvent(new CustomEvent('psynet:category-swipe', { 
        detail: { value: nextCategory } 
      }));
      
      // Scroll al top cuando cambias de categoría
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Feedback visual simple
      setSwipeDirection('left');
      setTimeout(() => setSwipeDirection(null), 300);
    },
    onSwipeRight: () => {
      const currentIndex = allCategories.findIndex(cat => cat.value === selectedType);
      const prevIndex = currentIndex === 0 ? allCategories.length - 1 : currentIndex - 1;
      const prevCategory = allCategories[prevIndex].value;
      setSelectedType(prevCategory);
      
      // Notificar al navbar del cambio de categoría
      window.dispatchEvent(new CustomEvent('psynet:category-swipe', { 
        detail: { value: prevCategory } 
      }));
      
      // Scroll al top cuando cambias de categoría
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Feedback visual simple
      setSwipeDirection('right');
      setTimeout(() => setSwipeDirection(null), 300);
    },
    // onSwipeDown desactivado en home - solo funciona en publicaciones
  }, {
    minDistance: 50, // Reducido para mayor sensibilidad
    preventDefaultMove: false, // Permitir scroll vertical
    velocityThreshold: 0.3, // Reducido para detectar swipes más lentos
    maxTime: 800, // Aumentado para permitir movimientos más lentos
    enableHaptic: true,
    hapticIntensity: 'light',
  });


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Main Navbar with Country Selector */}
      <MainNavbar />
      
      {/* Secondary navbar removed: search and category now live in MainNavbar */}

      {/* Therapies Grid - With Shadows & Animations */}
      <section
        className="pt-4 pb-8 px-3 md:px-4 relative"
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchMove={swipeHandlers.onTouchMove}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        {/* Indicador visual de swipe - minimalista */}
        {swipeDirection && (
          <div className={`fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none transition-all duration-150 ${
            swipeDirection === 'left' ? 'right-6' : 'left-6'
          }`}>
            <div className={`w-2 h-12 rounded-full bg-gray-900/40 dark:bg-white/40 ${
              swipeDirection === 'left' ? 'animate-pulse' : 'animate-pulse'
            }`}></div>
          </div>
        )}
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connection Error</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Unable to load content. Please check your internet connection.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredTherapies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {filteredTherapies.map((therapy, index) => {
                const videoId = therapy.videoUrl ? getYouTubeVideoId(therapy.videoUrl) : null;
                const showDates = ["ceremonias", "eventos"].includes((therapy.category || "ceremonias").toLowerCase());
                const rawDates = (therapy as unknown as { availableDates?: unknown; available_dates?: unknown }).availableDates
                  ?? (therapy as unknown as { available_dates?: unknown }).available_dates;
                const availableDates = Array.isArray(rawDates) ? rawDates as string[] : [];
                return (
                  <a 
                    key={therapy.id}
                    href={`/therapy/${therapy.slug}`}
                    className="block group"
                    onMouseEnter={() => setHoveredId(therapy.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                      <div 
                        className="relative transition-all duration-500 animate-fadeIn"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                        }}
                      >
                        {/* Shadow Card - Subtle separation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl transform translate-y-1 opacity-50" />
                        
                        <div className={`relative bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-500 transform hover:-translate-y-2 border ${cardBorderByCategory(therapy.category)}`}>
                          {/* Video Thumbnail */}
                          <div className="relative aspect-[16/10] rounded-t-2xl md:rounded-t-3xl overflow-hidden bg-gray-100">
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
                              <div className="w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                                <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                              </div>
                            </div>

                            {/* Type Badge */}
                            <div className="absolute top-2 md:top-4 left-2 md:left-4 px-2 md:px-3 py-0.5 md:py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full shadow-lg">
                              <span className="text-[10px] md:text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                                {therapy.type.replace('-', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-3 md:p-6">
                            <h3 className="text-base md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                              {therapy.title}
                            </h3>
                            
                            <p className="text-xs md:text-base text-gray-600 dark:text-gray-300 mb-2 md:mb-3 line-clamp-2 leading-relaxed">
                              {therapy.description}
                            </p>

                            {showDates && availableDates.length > 0 && (
                              <div className="mb-3 flex flex-wrap gap-2">
                                {availableDates.slice(0, 3).map((date, idx) => (
                                  <span
                                    key={`${therapy.id}-date-${idx}`}
                                    className="inline-flex items-center rounded-full bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white px-3 py-1 text-xs font-medium"
                                  >
                                    {formatAvailableDate(date)}
                                  </span>
                                ))}
                                {availableDates.length > 3 && (
                                  <span className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1 text-xs">
                                    +{availableDates.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                              {therapy.guideName && (
                                <div className="flex items-center gap-1.5">
                                  <Infinity className="w-4 h-4 text-gray-900 dark:text-white" />
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
                          </div>
                        </div>
                      </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 transition-opacity duration-300">
              <p className="text-xl text-gray-500">No ceremonies available</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Apple Style */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-12 px-4 mt-20 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <a 
                href="/admin/master/login" 
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                title="Admin Access"
              >
                ©
              </a> 2025 Psynet. All rights reserved.
            </div>
            <div className="flex gap-8 text-xs">
              <a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Use</a>
              {/* <a href="/how-it-works" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</a> */}
              <a 
                href="/admin/login"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Guides Portal
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
