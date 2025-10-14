import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, Star, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import type { Therapy } from "@shared/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HomeProfessionals() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  const filteredTherapies = selectedType === 'all' 
    ? therapies 
    : therapies.filter(t => t.type === selectedType);

  const types = Array.from(new Set(therapies.map(t => t.type)));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">PsycheConecta</span>
              </a>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/"><a className="text-gray-700 hover:text-emerald-600">Inicio</a></Link>
              <Link href="/how-it-works"><a className="text-gray-700 hover:text-emerald-600">Cómo Funciona</a></Link>
              <Link href="/admin/login"><a className="text-emerald-600 font-medium">Iniciar sesión</a></Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Solo trabajamos con guías certificados
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              En PsycheConecta, contamos con un equipo de facilitadores altamente capacitados para brindarte ceremonias auténticas y seguras. Cada guía tiene experiencia comprobada en medicina ancestral y está disponible para acompañarte en tu viaje de sanación.
            </p>
            <p className="text-lg text-gray-600 mt-4">
              Conecta con el profesional que mejor se ajuste a tu caso y recibe el apoyo que necesitas.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas las ceremonias ({therapies.length})
            </button>
            {types.map(type => {
              const count = therapies.filter(t => t.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedType === type
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Therapies Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : filteredTherapies.length > 0 ? (
            <div className="space-y-4">
              {filteredTherapies.map((therapy) => (
                <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                  <a className="block group">
                    <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative md:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
                          <img
                            src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80`}
                            alt={therapy.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Verified Badge */}
                          <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-lg">
                            <CheckCircle className="w-4 h-4" />
                            Verificado
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 md:p-8">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              {/* Type Badge */}
                              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                                {therapy.type.replace('-', ' ')}
                              </div>

                              {/* Title */}
                              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors leading-tight">
                                {therapy.title}
                              </h3>

                              {/* Guide Name */}
                              {therapy.guideName && (
                                <div className="flex items-center gap-2 mb-4">
                                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                  <span className="text-base font-medium text-gray-700">{therapy.guideName}</span>
                                </div>
                              )}

                              {/* Description */}
                              <p className="text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {therapy.description}
                              </p>

                              {/* Info */}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-emerald-600" />
                                  <span>{therapy.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-emerald-600" />
                                  <span>{therapy.duration}</span>
                                </div>
                              </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-3 md:min-w-[180px]">
                              <div className="text-left md:text-right">
                                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                                  ${therapy.price}
                                </div>
                                <div className="text-sm text-gray-500">por persona</div>
                              </div>
                              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-3 font-medium whitespace-nowrap">
                                Ver detalles
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
              <p className="text-xl text-gray-600">No hay ceremonias disponibles en esta categoría</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Eres facilitador de ceremonias?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Únete a nuestra plataforma y conecta con personas que buscan tu experiencia
          </p>
          <Link href="/admin/register">
            <a>
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8 py-6 rounded-full font-semibold">
                Registrarme como guía
              </Button>
            </a>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold">PsycheConecta</span>
              </div>
              <p className="text-gray-400 mb-4">
                Conectando con la medicina ancestral de forma segura y auténtica
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">Contenido</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/"><a className="hover:text-white">Inicio</a></Link></li>
                <li><Link href="/how-it-works"><a className="hover:text-white">Cómo Funciona</a></Link></li>
                <li><Link href="/admin/login"><a className="hover:text-white">Iniciar sesión</a></Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+51 987 654 321</li>
                <li>Atención: L-V | 9 a 18 hrs</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 PsycheConecta. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
