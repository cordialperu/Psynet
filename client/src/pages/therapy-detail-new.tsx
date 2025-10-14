import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { MapPin, Clock, Calendar, MessageCircle, ShoppingCart, Ticket } from "lucide-react";
import type { Therapy } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { MainNavbar } from "@/components/main-navbar";
import { useSwipe } from "@/hooks/use-swipe";
import { improveIOSScrolling } from "@/lib/mobile-utils";
import { useCountry } from "@/contexts/country-context";
import { GuideInfoModal } from "@/components/guide-info-modal";
import type { Guide } from "@shared/schema";

// Función para extraer el ID del video de YouTube
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function TherapyDetailNew() {
  const [, params] = useRoute("/therapy/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug;
  const { selectedCountry } = useCountry();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [swipeDownFeedback, setSwipeDownFeedback] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Optimize mobile experience
  useEffect(() => {
    improveIOSScrolling();
  }, []);

  // Cargar terapia actual
  const { data: therapy, isLoading, isError } = useQuery<Therapy>({
    queryKey: [`/api/therapies/slug/${slug}`],
    enabled: !!slug,
  });

  // Cargar todas las terapias para navegación
  const { data: allTherapies = [] } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published", selectedCountry],
    queryFn: async () => {
      const response = await fetch(`/api/therapies/published?country=${selectedCountry}`);
      if (!response.ok) throw new Error('Failed to fetch therapies');
      return response.json();
    },
    staleTime: 60000,
  });

  // Filtrar terapias de la misma categoría
  const categoryTherapies = useMemo(() => {
    if (!therapy) return [];
    const category = therapy.category || 'ceremonias';
    const filtered = allTherapies.filter(t => (t.category || 'ceremonias') === category);
    console.log('Category Therapies:', {
      category,
      totalTherapies: allTherapies.length,
      filteredCount: filtered.length,
      currentTherapy: therapy.title
    });
    return filtered;
  }, [therapy, allTherapies]);

  // Encontrar índice actual
  const currentIndex = useMemo(() => {
    if (!therapy) return -1;
    return categoryTherapies.findIndex(t => t.id === therapy.id);
  }, [therapy, categoryTherapies]);

  // Actualizar categoría en navbar cuando se carga la terapia
  useEffect(() => {
    if (therapy) {
      const category = therapy.category || 'ceremonias';
      window.dispatchEvent(new CustomEvent('psynet:therapy-category', { 
        detail: { category } 
      }));
    }
  }, [therapy]);

  // Scroll al top cuando cambia el slug de la publicación
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Funciones de navegación entre publicaciones
  const navigateToTherapy = (direction: 'next' | 'prev') => {
    if (currentIndex === -1 || categoryTherapies.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % categoryTherapies.length;
      setSwipeDirection('left');
    } else {
      newIndex = currentIndex === 0 ? categoryTherapies.length - 1 : currentIndex - 1;
      setSwipeDirection('right');
    }
    
    const nextTherapy = categoryTherapies[newIndex];
    if (nextTherapy) {
      // Scroll inmediato al top ANTES de cambiar de página
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      setLocation(`/therapy/${nextTherapy.slug}`);
      
      // Asegurar scroll al top después del cambio de ubicación
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 100);
      
      // Actualizar el selector de categoría en el navbar
      const category = nextTherapy.category || 'ceremonias';
      window.dispatchEvent(new CustomEvent('psynet:therapy-category', { 
        detail: { category } 
      }));
    }
    
    setTimeout(() => setSwipeDirection(null), 300);
  };

  // Configuración del hook useSwipe para navegación
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      // Swipe left para siguiente publicación
      console.log('Swipe LEFT detected. Total therapies:', categoryTherapies.length);
      if (categoryTherapies.length > 1) {
        console.log('Navigating to next therapy...');
        navigateToTherapy('next');
      } else {
        console.log('Not enough therapies to navigate');
      }
    },
    onSwipeRight: () => {
      // Swipe right para publicación anterior
      console.log('Swipe RIGHT detected. Total therapies:', categoryTherapies.length);
      if (categoryTherapies.length > 1) {
        console.log('Navigating to previous therapy...');
        navigateToTherapy('prev');
      } else {
        console.log('Not enough therapies to navigate');
      }
    },
    onSwipeDown: () => {
      // Swipe down para ir a la categoría de la publicación
      console.log('Swipe DOWN detected');
      setSwipeDownFeedback(true);
      setTimeout(() => {
        if (therapy) {
          const category = therapy.category || 'ceremonias';
          window.location.href = `/?category=${category}`;
        } else {
          window.history.back();
        }
      }, 200);
      setTimeout(() => setSwipeDownFeedback(false), 800);
    },
  }, {
    minDistance: 50, // Reducido para mayor sensibilidad
    preventDefaultMove: false, // Permitir scroll vertical
    velocityThreshold: 0.3, // Reducido para detectar swipes más lentos
    maxTime: 800, // Aumentado para permitir movimientos más lentos
    enableHaptic: true,
    hapticIntensity: 'light',
  });

  // Config pública (PayPal y contacto admin)
  const { data: publicConfig } = useQuery<{ paypalEmail: string | null }>({
    queryKey: ["/api/public/config"],
  });

  // Cargar info del guía cuando se necesite
  const { data: guideData } = useQuery<Guide>({
    queryKey: ["/api/guides", therapy?.guideId],
    enabled: !!therapy?.guideId && isGuideModalOpen,
  });

  const handleAction = () => {
    if (!therapy || !publicConfig) return;
    
    const category = therapy.category || 'ceremonias';
    let mensaje = '';
    
    // Mensaje según tipo de publicación
    if (category === 'productos' || category === 'microdosis' || category === 'medicina') {
      // Productos, Microdosis y Medicina no requieren fecha
      const tipo = category === 'productos' ? 'Product' : category === 'microdosis' ? 'Microdosis' : 'Medicine';
      mensaje = `*PURCHASE REQUEST*\n\n` +
        `${tipo}: ${therapy.title}\n` +
        `Price: $${therapy.price} ${therapy.currency}\n` +
        `Seller: ${therapy.guideName}\n` +
        `Location: ${therapy.location}\n\n` +
        `I am interested in purchasing this ${tipo.toLowerCase()}.`;
    } else if (category === 'eventos') {
      // Eventos requieren fecha
      if (!selectedDate) return;
      mensaje = `*EVENT REGISTRATION*\n\n` +
        `Event: ${therapy.title}\n` +
        `Selected Date: ${selectedDate}\n` +
        `Price: $${therapy.price} ${therapy.currency}\n` +
        `Organizer: ${therapy.guideName}\n` +
        `Location: ${therapy.location}\n\n` +
        `I would like to register for this event.`;
    } else {
      // Ceremonias y terapias requieren fecha
      if (!selectedDate) return;
      const tipoServicio = category === 'ceremonias' ? 'Ceremony' : 'Therapy';
      mensaje = `*${tipoServicio.toUpperCase()} BOOKING*\n\n` +
        `Service: ${therapy.title}\n` +
        `Requested Date: ${selectedDate}\n` +
        `Price: $${therapy.price} ${therapy.currency}\n` +
        `Guide: ${therapy.guideName}\n` +
        `Location: ${therapy.location}\n` +
        `Duration: ${therapy.duration}\n\n` +
        `I would like to make a reservation for the indicated date.`;
    }
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = (publicConfig as any).adminWhatsapp
      ? String((publicConfig as any).adminWhatsapp).replace(/[^0-9]/g, '')
      : '';
    if (!numeroWhatsApp) return;
    
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`, '_blank');
  };

  const getButtonText = () => {
    const category = therapy?.category || 'ceremonias';
    if (category === 'productos') return 'Buy Product';
    if (category === 'microdosis') return 'Buy Microdosis';
    if (category === 'medicina') return 'Buy Medicine';
    if (category === 'eventos') return 'Register for Event';
    if (category === 'ceremonias') return 'Book Ceremony';
    if (category === 'terapias') return 'Book Therapy';
    return 'Book via WhatsApp';
  };

  const getButtonIcon = () => {
    const category = therapy?.category || 'ceremonias';
    if (category === 'productos') return ShoppingCart;
    if (category === 'eventos') return Ticket;
    return MessageCircle;
  };

  // Border color mapping by category (elegant thin borders)
  const borderByCategory = (cat?: string | null) => {
    const c = (cat || 'ceremonias').toLowerCase();
    if (c === 'ceremonias') return 'border-purple-300 dark:border-purple-500';
    if (c === 'terapias') return 'border-blue-300 dark:border-blue-500';
    if (c === 'microdosis') return 'border-green-300 dark:border-green-500';
    if (c === 'medicina') return 'border-amber-300 dark:border-amber-500';
    if (c === 'eventos') return 'border-pink-300 dark:border-pink-500';
    if (c === 'productos') return 'border-cyan-300 dark:border-cyan-500';
    return 'border-gray-300 dark:border-gray-600';
  };

  const handlePayPalClick = () => {
    if (!therapy) return;
    const business = publicConfig?.paypalEmail;
    if (!business) {
      alert("PayPal is not configured yet. Please contact the administrator.");
      return;
    }
    
    // Preparar información para el mensaje de WhatsApp al admin
    const category = therapy.category || 'ceremonias';
    const tipoServicio = category === 'ceremonias' ? 'Ceremony' : 
                        category === 'terapias' ? 'Therapy' : 
                        category === 'eventos' ? 'Event' : 
                        category === 'productos' ? 'Product' : 'Service';
    
    const paymentInfo = {
      type: tipoServicio,
      title: therapy.title,
      price: therapy.price,
      currency: therapy.currency || 'USD',
      guide: therapy.guideName,
      location: therapy.location,
      date: selectedDate || 'N/A',
      duration: therapy.duration || 'N/A'
    };
    
    // Guardar info en localStorage para enviar después del pago
    localStorage.setItem('pendingPayPalPayment', JSON.stringify(paymentInfo));
    localStorage.setItem('adminWhatsApp', (publicConfig as any).adminWhatsapp || '');
    
    const amount = therapy.price ? Number(therapy.price).toFixed(2) : undefined;
    const currency = therapy.currency || "USD";
    const itemName = encodeURIComponent(`${therapy.title} - ${therapy.guideName || "Guide"}`);
    const returnUrl = window.location.origin + "/payment/success";
    const cancelUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      cmd: "_xclick",
      business,
      item_name: itemName,
      currency_code: currency,
      return: returnUrl,
      cancel_return: cancelUrl,
    });
    if (amount) params.set("amount", amount);
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
    window.location.href = paypalUrl;
  };

  if (isLoading) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
          <div className="animate-spin w-12 h-12 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full"></div>
        </div>
      </>
    );
  }

  if (isError || !therapy) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
              Ceremony not found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
              The ceremony you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Back to home
            </Button>
          </div>
        </div>
      </>
    );
  }

  const videoId = therapy.videoUrl ? getYouTubeVideoId(therapy.videoUrl) : null;

  // Función para manejar click en el nombre del guía
  const handleGuideClick = async () => {
    if (!therapy?.guideId) return;
    setIsGuideModalOpen(true);
  };

  return (
    <div 
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchMove={swipeHandlers.onTouchMove}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      <MainNavbar />

      {/* Swipe Feedback - minimalista */}
      {swipeDownFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200">
          <div className="w-16 h-1.5 rounded-full bg-gray-900/40 dark:bg-white/40 animate-pulse"></div>
        </div>
      )}
      
      {/* Swipe Horizontal Feedback */}
      {swipeDirection && (
        <div className={`fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none transition-all duration-150 ${
          swipeDirection === 'left' ? 'right-6' : 'left-6'
        }`}>
          <div className="w-2 h-12 rounded-full bg-gray-900/40 dark:bg-white/40 animate-pulse"></div>
        </div>
      )}
      
      {/* Navigation Indicators - solo móvil */}
      {categoryTherapies.length > 1 && therapy && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {currentIndex + 1} / {categoryTherapies.length}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-3 md:px-4 pt-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Title */}
            <div>
              <div className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] md:text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                {therapy.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 leading-tight transition-colors duration-300">
                {therapy.title}
              </h1>
            </div>

            {/* Video Player */}
            {videoId ? (
              <div className={`rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 transition-colors duration-300 border ${borderByCategory(therapy.category)}`}>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Ceremony video"
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className={`rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 transition-colors duration-300 border ${borderByCategory(therapy.category)}`}>
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-4xl mb-3">🎥</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Video not available</p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Compacta */}
            <div className={`flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 pb-3 border-b transition-colors duration-300 ${borderByCategory(therapy.category)}`}>
              {therapy.guideName && (
                <button
                  onClick={() => {
                    setSelectedGuide(guideData || null);
                    setIsGuideModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group"
                >
                  {therapy.guidePhotoUrl && (
                    <img
                      src={therapy.guidePhotoUrl}
                      alt={therapy.guideName}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover ring-2 ring-transparent group-hover:ring-gray-400 dark:group-hover:ring-gray-500 transition-all"
                    />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300 group-hover:underline">{therapy.guideName}</span>
                </button>
              )}
              {therapy.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 dark:text-gray-400" />
                  <span>{therapy.location}</span>
                </div>
              )}
              {therapy.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 dark:text-gray-400" />
                  <span>{therapy.duration}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line transition-colors duration-300">
              {therapy.description}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className={`bg-white dark:bg-gray-800 border rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm transition-colors duration-300 ${borderByCategory(therapy.category)}`}>
                {/* Price destacado arriba */}
                <div className={`mb-4 pb-4 border-b ${borderByCategory(therapy.category)}`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price per person</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    ${therapy.price}
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-1">{therapy.currency}</span>
                  </p>
                </div>
                
                {/* Date Selector - Para ceremonias, terapias y eventos */}
                {(therapy.category === 'ceremonias' || therapy.category === 'terapias' || therapy.category === 'eventos') && therapy.availableDates && therapy.availableDates.length > 0 && (
                  <div className="mb-4">
                    <label className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 dark:text-gray-400" />
                      {therapy.category === 'eventos' ? 'Select event date' : 'Select a date'}
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl focus:border-gray-900 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
                    >
                      <option value="">{therapy.category === 'eventos' ? 'Choose event date' : 'Choose a date'}</option>
                      {therapy.availableDates.map((date, idx) => (
                        <option key={idx} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* CTA Button - Dynamic by category */}
                <Button 
                  onClick={handleAction}
                  disabled={
                    (therapy.category === 'ceremonias' || therapy.category === 'terapias' || therapy.category === 'eventos') && !selectedDate
                  }
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {(() => {
                    const Icon = getButtonIcon();
                    return <Icon className="w-4 h-4 md:w-5 md:h-5 mr-2" />;
                  })()}
                  {getButtonText()}
                </Button>

                {therapy.price && (
                  <Button
                    onClick={handlePayPalClick}
                    disabled={!publicConfig?.paypalEmail}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium"
                    data-testid="button-paypal"
                  >
                    Pay with PayPal
                  </Button>
                )}

                {!((publicConfig as any)?.adminWhatsapp) && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    Admin WhatsApp not configured
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Info Modal */}
      <GuideInfoModal
        guide={guideData || null}
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
