import { useQuery } from "@tanstack/react-query";
import { Search, Leaf, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { TherapyCard } from "@/components/therapy-card-v2";
import { Navbar } from "@/components/navbar-v2";
import { Footer } from "@/components/footer";
import type { Therapy } from "@shared/schema";
import { useState } from "react";
import { therapyTypes } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function HomeV2() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const filteredTherapies = therapies.filter(therapy => {
    const matchesSearch = 
      !searchQuery || 
      therapy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapy.guideName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || therapy.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 via-moss-50 to-earth-50">
      <Navbar />
      
      {/* Hero Section with Integrated Search */}
      <section className="relative overflow-hidden">
        {/* Organic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-moss-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-earth-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100/80 backdrop-blur-sm rounded-full mb-6">
              <Leaf className="w-4 h-4 text-sage-700" />
              <span className="text-sm font-medium text-sage-800">Sanación Auténtica en Perú</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-earth-900 leading-tight">
              Conecta con tu
              <span className="block text-sage-700">Esencia Natural</span>
            </h1>
            
            <p className="text-lg md:text-xl text-earth-700 max-w-3xl mx-auto mb-8">
              Descubre ceremonias de medicina ancestral y terapias holísticas 
              guiadas por maestros experimentados en el corazón de los Andes
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-600" />
                <Input
                  type="search"
                  placeholder="Busca tu camino de sanación..."
                  className="pl-12 pr-4 py-6 text-lg bg-white/90 backdrop-blur-sm border-2 border-sage-200 focus:border-sage-400 rounded-2xl shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge
                variant={selectedType === null ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                  selectedType === null 
                    ? "bg-sage-600 hover:bg-sage-700 text-white" 
                    : "bg-white/80 hover:bg-sage-100 text-sage-700 border-sage-300"
                }`}
                onClick={() => setSelectedType(null)}
              >
                Todas
              </Badge>
              {therapyTypes.slice(0, 6).map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                    selectedType === type 
                      ? "bg-sage-600 hover:bg-sage-700 text-white" 
                      : "bg-white/80 hover:bg-sage-100 text-sage-700 border-sage-300"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {formatType(type)}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-earth-600">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-sage-600" />
                <span>50+ Guías Certificados</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sage-600" />
                <span>200+ Ceremonias Realizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-sage-600" />
                <span>100% Medicina Ancestral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapies Grid - Main Content */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-earth-900 mb-2">
              {selectedType ? `${formatType(selectedType)}` : 'Todas las Experiencias'}
            </h2>
            <p className="text-earth-600">
              {filteredTherapies.length} {filteredTherapies.length === 1 ? 'experiencia disponible' : 'experiencias disponibles'}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[420px] bg-white/60 backdrop-blur-sm animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : filteredTherapies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapies.map((therapy) => (
                <TherapyCard key={therapy.id} therapy={therapy} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-100 rounded-full mb-6">
                <Leaf className="w-10 h-10 text-sage-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-earth-900 mb-3">
                No encontramos experiencias
              </h3>
              <p className="text-earth-600 mb-6">
                Intenta con otros términos de búsqueda o filtros
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType(null);
                }}
                className="bg-sage-600 hover:bg-sage-700 text-white rounded-full px-8"
              >
                Ver todas las experiencias
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-20 bg-gradient-to-br from-sage-100/50 to-moss-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-earth-700 max-w-2xl mx-auto">
              Conectamos buscadores con experiencias auténticas de sanación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-sage-200 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-sage-700" />
              </div>
              <h3 className="font-serif text-xl font-bold text-earth-900 mb-3">
                Guías Verificados
              </h3>
              <p className="text-earth-700">
                Todos nuestros guías son cuidadosamente revisados para garantizar experiencias auténticas y seguras
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-sage-200 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-moss-100 rounded-2xl flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7 text-moss-700" />
              </div>
              <h3 className="font-serif text-xl font-bold text-earth-900 mb-3">
                Medicina Ancestral
              </h3>
              <p className="text-earth-700">
                Honramos las tradiciones indígenas y prácticas ancestrales con profundo respeto
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-sage-200 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-earth-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-earth-700" />
              </div>
              <h3 className="font-serif text-xl font-bold text-earth-900 mb-3">
                Conexión Directa
              </h3>
              <p className="text-earth-700">
                Comunícate directamente con los guías vía WhatsApp para una experiencia personalizada
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
