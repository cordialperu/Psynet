import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, Phone, Filter, Grid, List } from "lucide-react";
import { Link } from "wouter";
import type { Therapy } from "@shared/schema";
import { useState } from "react";

export default function HomeDirectory() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  const publishedTherapies = therapies;
  
  const filteredTherapies = filterType === 'all' 
    ? publishedTherapies 
    : publishedTherapies.filter(t => t.type === filterType);

  const types = Array.from(new Set(publishedTherapies.map(t => t.type)));

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">PsycheConecta</h1>
              <p className="text-sm text-stone-600">Directorio de Ceremonias</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/login">
                <a className="text-sm text-stone-600 hover:text-stone-900">Portal Guías</a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-stone-900 mb-2">
            {publishedTherapies.length} Ceremonias Disponibles
          </h2>
          <p className="text-lg text-stone-600">
            Encuentra la ceremonia perfecta para tu viaje de sanación
          </p>
        </div>

        {/* Filters & View Toggle */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-stone-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-stone-400" />
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Todas ({publishedTherapies.length})
              </button>
              {types.map(type => {
                const count = publishedTherapies.filter(t => t.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {type.replace('-', ' ')} ({count})
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-stone-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-stone-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Therapies List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-stone-600">Cargando ceremonias...</p>
          </div>
        ) : filteredTherapies.length > 0 ? (
          viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapies.map((therapy) => (
                <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                  <a className="block group">
                    <div className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden bg-stone-100">
                        <img
                          src={therapy.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600`}
                          alt={therapy.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ${therapy.price}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                          {therapy.type.replace('-', ' ')}
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {therapy.title}
                        </h3>
                        <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                          {therapy.description}
                        </p>

                        <div className="space-y-2 text-sm text-stone-600">
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
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredTherapies.map((therapy) => (
                <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                  <a className="block group">
                    <div className="bg-white rounded-xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                          <img
                            src={therapy.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400`}
                            alt={therapy.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                                {therapy.type.replace('-', ' ')}
                              </div>
                              <h3 className="text-2xl font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">
                                {therapy.title}
                              </h3>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-3xl font-bold text-emerald-600">
                                ${therapy.price}
                              </div>
                              <div className="text-xs text-stone-500">{therapy.currency}</div>
                            </div>
                          </div>

                          <p className="text-stone-600 mb-4 line-clamp-2">
                            {therapy.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                              <span>{therapy.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-emerald-600" />
                              <span>{therapy.duration}</span>
                            </div>
                            {therapy.guideName && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-600" />
                                <span>{therapy.guideName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-stone-600">No hay ceremonias disponibles</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-stone-400">© 2025 PsycheConecta - Medicina Ancestral</p>
        </div>
      </footer>
    </div>
  );
}
