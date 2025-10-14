import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Search, Menu, X } from "lucide-react";
import { Link } from "wouter";
import type { Therapy } from "@shared/schema";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function HomeElegant() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  const filteredTherapies = therapies.filter(therapy =>
    !searchQuery || 
    therapy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapy.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50">
      {/* Elegant Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold text-stone-900">PsycheConecta</h1>
                  <p className="text-xs text-stone-500 -mt-0.5">Medicina Ancestral</p>
                </div>
              </a>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/"><a className="text-stone-700 hover:text-emerald-600 font-medium transition-colors">Inicio</a></Link>
              <Link href="/how-it-works"><a className="text-stone-700 hover:text-emerald-600 font-medium transition-colors">Cómo Funciona</a></Link>
              <Link href="/admin/login"><a className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-lg transition-all font-medium">Portal Guías</a></Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-stone-200">
              <nav className="flex flex-col gap-4">
                <Link href="/"><a className="text-stone-700 hover:text-emerald-600 font-medium">Inicio</a></Link>
                <Link href="/how-it-works"><a className="text-stone-700 hover:text-emerald-600 font-medium">Cómo Funciona</a></Link>
                <Link href="/admin/login"><a className="text-center px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-medium">Portal Guías</a></Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Minimal & Elegant */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              Ceremonias Sagradas
              <span className="block text-emerald-600">en Perú</span>
            </h2>
            <p className="text-lg md:text-xl text-stone-600 mb-8 leading-relaxed">
              Conecta con la sabiduría ancestral a través de ceremonias auténticas guiadas por maestros experimentados
            </p>

            {/* Search Bar - Elegant */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Buscar ceremonia o ubicación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 text-lg bg-white border-2 border-stone-200 rounded-2xl focus:border-emerald-500 focus:ring-0 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center mb-16">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">{therapies.length}+</div>
              <div className="text-sm text-stone-600 mt-1">Ceremonias</div>
            </div>
            <div className="w-px h-12 bg-stone-200" />
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">50+</div>
              <div className="text-sm text-stone-600 mt-1">Guías Verificados</div>
            </div>
            <div className="w-px h-12 bg-stone-200" />
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">100%</div>
              <div className="text-sm text-stone-600 mt-1">Auténtico</div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapies Grid - Elegant Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredTherapies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTherapies.map((therapy) => (
                <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                  <a
                    onMouseEnter={() => setHoveredCard(therapy.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="block group"
                  >
                    <div className={`
                      bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl
                      transition-all duration-500 h-full
                      ${hoveredCard === therapy.id ? 'scale-[1.02] -translate-y-1' : 'scale-100'}
                    `}>
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                        <img
                          src={therapy.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600`}
                          alt={therapy.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Price Badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-emerald-700 font-bold text-sm">
                            ${therapy.price}
                          </span>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-white text-xs font-medium uppercase tracking-wide">
                            {therapy.type.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-serif font-bold text-stone-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                          {therapy.title}
                        </h3>

                        <div className="space-y-2 text-sm text-stone-600">
                          {/* Location */}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                            <span className="line-clamp-1">{therapy.location}</span>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                            <span>{therapy.duration}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 pt-4 border-t border-stone-100">
                          <div className="text-emerald-600 font-medium text-sm group-hover:text-emerald-700 flex items-center gap-2">
                            Ver detalles
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
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
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-xl text-stone-600">No se encontraron ceremonias</p>
              <p className="text-stone-500 mt-2">Intenta con otra búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold mb-2">PsycheConecta</h3>
            <p className="text-stone-400 mb-6">Conectando con la medicina ancestral</p>
            <div className="flex justify-center gap-6 text-sm text-stone-400">
              <Link href="/"><a className="hover:text-white transition-colors">Inicio</a></Link>
              <Link href="/how-it-works"><a className="hover:text-white transition-colors">Cómo Funciona</a></Link>
              <Link href="/admin/login"><a className="hover:text-white transition-colors">Guías</a></Link>
            </div>
            <p className="text-stone-500 text-sm mt-6">© 2025 PsycheConecta. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
