import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { AuthDialog } from "./auth-dialog";
import { useQuery } from "@tanstack/react-query";
import type { Guide } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Reemplazamos el selector de país por un dropdown activado desde la marca Psynet
import { useCountry } from "@/contexts/country-context";
import { Input } from "@/components/ui/input";

export function MainNavbar() {
  const [, setLocation] = useLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { selectedCountry, setSelectedCountry } = useCountry();
  const [search, setSearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'ceremonias' | 'terapias' | 'microdosis' | 'medicina' | 'eventos' | 'productos'>("all");
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Leer parámetro de categoría de la URL al cargar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && allCategories.some(cat => cat.value === categoryParam)) {
      setSelectedType(categoryParam as any);
    }
  }, []);

  // Cargar dark mode del localStorage y aplicarlo
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved === null ? true : saved === 'true';
    setDarkMode(isDark);
    
    // Aplicar inmediatamente al documentElement
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Aplicar dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    console.log('Cambiando modo:', newDarkMode ? 'Oscuro' : 'Claro');
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Disparar evento global para que otras páginas lo detecten
    window.dispatchEvent(new CustomEvent('psynet:darkmode-change', { 
      detail: { darkMode: newDarkMode } 
    }));
  };

  // Escuchar cambios de URL para actualizar la categoría
  useEffect(() => {
    const handleLocationChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam && allCategories.some(cat => cat.value === categoryParam)) {
        setSelectedType(categoryParam as any);
      } else {
        setSelectedType('all');
      }
    };

    // Escuchar cambios en el historial del navegador
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Escuchar evento de cambio de categoría desde página de detalle
  useEffect(() => {
    const handleTherapyCategory = (e: Event) => {
      const detail = (e as CustomEvent).detail as { category?: string } | undefined;
      if (detail?.category && allCategories.some(cat => cat.value === detail.category)) {
        setSelectedType(detail.category as any);
      }
    };

    window.addEventListener('psynet:therapy-category', handleTherapyCategory as EventListener);
    return () => {
      window.removeEventListener('psynet:therapy-category', handleTherapyCategory as EventListener);
    };
  }, []);

  // Escuchar evento de cambio de categoría por swipe en home
  useEffect(() => {
    const handleCategorySwipe = (e: Event) => {
      const detail = (e as CustomEvent).detail as { value?: string } | undefined;
      if (detail?.value && allCategories.some(cat => cat.value === detail.value)) {
        setSelectedType(detail.value as any);
      }
    };

    window.addEventListener('psynet:category-swipe', handleCategorySwipe as EventListener);
    return () => {
      window.removeEventListener('psynet:category-swipe', handleCategorySwipe as EventListener);
    };
  }, []);

  const allCategories = [
    { value: 'all', label: 'Categories' },
    { value: 'ceremonias', label: 'Ceremonies' },
    { value: 'terapias', label: 'Therapies' },
    { value: 'microdosis', label: 'Microdosing' },
    { value: 'medicina', label: 'Medicine' },
    { value: 'eventos', label: 'Events' },
    { value: 'productos', label: 'Products' },
  ] as const;

  const currentCategory = allCategories.find(c => c.value === selectedType) || allCategories[0];

  // Función para obtener el color del borde según la categoría
  const getBorderColor = (categoryValue: string) => {
    switch (categoryValue) {
      case 'ceremonias': return 'border-purple-400 text-purple-600 dark:border-purple-500 dark:text-purple-400';
      case 'terapias': return 'border-blue-400 text-blue-600 dark:border-blue-500 dark:text-blue-400';
      case 'microdosis': return 'border-green-400 text-green-600 dark:border-green-500 dark:text-green-400';
      case 'medicina': return 'border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400';
      case 'eventos': return 'border-pink-400 text-pink-600 dark:border-pink-500 dark:text-pink-400';
      case 'productos': return 'border-cyan-400 text-cyan-600 dark:border-cyan-500 dark:text-cyan-400';
      default: return 'border-gray-400 text-gray-900 dark:border-gray-400 dark:text-white';
    }
  };

  const dispatchSearch = (q: string) => {
    window.dispatchEvent(new CustomEvent('psynet:search', { detail: { q } }));
  };

  const dispatchCategory = (value: typeof selectedType) => {
    // Navegar a la página principal con el filtro de categoría
    if (value === 'all') {
      setLocation('/');
    } else {
      setLocation(`/?category=${value}`);
    }
    // También disparar el evento para componentes que puedan estar escuchando
    window.dispatchEvent(new CustomEvent('psynet:category', { detail: { value } }));
  };

  const { data: guide } = useQuery<Guide>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn<Guide>({ on401: "returnNull" }),
    retry: false,
    enabled: !!localStorage.getItem("sessionId"),
  });

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    setLocation("/");
    window.location.reload();
  };

  const getInitials = (name?: string | null) => {
    if (!name) {
      return "";
    }

    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <style>{`
        #main-navbar {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          z-index: 99999 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          transform: translate3d(0, 0, 0) !important;
          -webkit-transform: translate3d(0, 0, 0) !important;
        }
        
        body {
          padding-top: 64px !important;
        }
      `}</style>
      <nav id="main-navbar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 99999,
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)'
      }} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-700/70 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo: Click simple = home, Presión larga = menú país */}
            <div className="flex items-center gap-0">
              <DropdownMenu open={countryMenuOpen} onOpenChange={setCountryMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="text-xl font-serif font-bold text-gray-900 dark:text-white transition-colors duration-300">
                      Psynet
                    </span>
                    <span className="text-xs text-gray-500">{selectedCountry}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Country</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      setSelectedCountry("PE");
                      setCountryMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">PE</span>
                      <span className="text-sm text-gray-700">Perú</span>
                    </div>
                    {selectedCountry === "PE" && (
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      setSelectedCountry("MX");
                      setCountryMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">MX</span>
                      <span className="text-sm text-gray-700">México</span>
                    </div>
                    {selectedCountry === "MX" && (
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Theme</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      toggleDarkMode();
                      setCountryMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {darkMode ? (
                        <>
                          <span className="text-sm">🌙</span>
                          <span className="text-sm text-gray-700">Dark Mode</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm">☀️</span>
                          <span className="text-sm text-gray-700">Light Mode</span>
                        </>
                      )}
                    </div>
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search + Category (centrado/responsive) */}
            <div className="flex items-center gap-3 flex-1 justify-center max-w-xl px-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    dispatchSearch(e.target.value);
                  }}
                  className="h-9 rounded-full bg-gray-100 dark:bg-gray-800 border-none pl-3 pr-3 text-sm"
                />
              </div>
              <DropdownMenu open={categoryOpen} onOpenChange={setCategoryOpen}>
                <DropdownMenuTrigger asChild>
                  <button className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm ${
                    selectedType === 'all' 
                      ? 'border-gray-400 text-gray-900 dark:border-gray-400 dark:text-white'
                      : getBorderColor(selectedType)
                  }`}>
                    {currentCategory.label}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {allCategories.map(cat => {
                    const getCategoryColorClass = (value: string) => {
                      switch (value) {
                        case 'ceremonias': return 'text-purple-600 dark:text-purple-400';
                        case 'terapias': return 'text-blue-600 dark:text-blue-400';
                        case 'microdosis': return 'text-green-600 dark:text-green-400';
                        case 'medicina': return 'text-amber-600 dark:text-amber-400';
                        case 'eventos': return 'text-pink-600 dark:text-pink-400';
                        case 'productos': return 'text-cyan-600 dark:text-cyan-400';
                        default: return 'text-gray-900 dark:text-white';
                      }
                    };
                    
                    return (
                      <DropdownMenuItem
                        key={cat.value}
                        onClick={() => {
                          setSelectedType(cat.value);
                          setCategoryOpen(false);
                          dispatchCategory(cat.value);
                        }}
                        className={`cursor-pointer ${selectedType === cat.value ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''}`}
                      >
                        <span className={`${cat.value !== 'all' ? getCategoryColorClass(cat.value) : ''} font-medium`}>
                          {cat.label}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Auth Section - Solo avatar si está logueado */}
            <div className="flex items-center">
              {guide && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={guide.profilePhotoUrl || undefined} alt={guide.fullName} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {getInitials(guide.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{guide.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {guide.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation("/guia/dashboard")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Panel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/guia/perfil")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
