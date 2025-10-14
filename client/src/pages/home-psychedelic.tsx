import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles, Heart, Leaf, Moon, Sun, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar-psychedelic";
import { Footer } from "@/components/footer";
import type { Therapy } from "@shared/schema";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

export default function HomePsychedelic() {
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

  const therapyTypes = Array.from(new Set(therapies.map(t => t.type)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '60%',
            right: '10%',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            left: '50%',
            animation: 'float 30s ease-in-out infinite',
          }}
        />
        
        {/* Mystical particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Navbar />
      
      {/* Hero Section - Immersive & Psychedelic */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Mystical Icons */}
          <div className="flex justify-center gap-8 mb-8 animate-bounce-slow">
            <Moon className="w-8 h-8 text-purple-300 animate-pulse" />
            <Star className="w-10 h-10 text-yellow-300 animate-spin-slow" />
            <Sun className="w-8 h-8 text-orange-300 animate-pulse" />
          </div>

          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-gradient">
            Despierta Tu Consciencia
          </h1>
          
          <p className="text-2xl md:text-3xl text-purple-200 mb-4 font-light">
            🌿 Medicina Ancestral • Sanación Profunda • Transformación Espiritual 🌿
          </p>
          
          <p className="text-lg md:text-xl text-purple-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Conecta con la sabiduría milenaria de las plantas maestras y ceremonias sagradas. 
            Tu viaje hacia la iluminación comienza aquí. ✨
          </p>

          {/* Search Bar - Glowing & Mystical */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-full p-2 border-2 border-purple-300/50">
                <Search className="w-6 h-6 text-purple-300 ml-4" />
                <Input
                  type="text"
                  placeholder="Busca tu medicina sagrada..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white placeholder-purple-300 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a href="#therapies">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explorar Ceremonias
              </Button>
            </a>
            <Link href="/how-it-works">
              <a>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-100 hover:bg-purple-500/20 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Cómo Funciona
                </Button>
              </a>
            </Link>
          </div>

          {/* Trust Indicators - Glowing */}
          <div className="flex flex-wrap justify-center gap-8 text-purple-200">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-300/30">
              <Leaf className="w-5 h-5 text-green-300" />
              <span className="font-medium">100% Auténtico</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-300/30">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="font-medium">Guías Experimentados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-300/30">
              <Heart className="w-5 h-5 text-pink-300" />
              <span className="font-medium">Espacio Seguro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          <Badge
            variant={selectedType === null ? "default" : "outline"}
            className={`cursor-pointer px-6 py-3 text-base rounded-full transition-all duration-300 ${
              selectedType === null 
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-110" 
                : "bg-white/10 text-purple-200 border-purple-300/50 hover:bg-white/20"
            }`}
            onClick={() => setSelectedType(null)}
          >
            ✨ Todas
          </Badge>
          {therapyTypes.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              className={`cursor-pointer px-6 py-3 text-base rounded-full transition-all duration-300 ${
                selectedType === type
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-110"
                  : "bg-white/10 text-purple-200 border-purple-300/50 hover:bg-white/20"
              }`}
              onClick={() => setSelectedType(type)}
            >
              {formatType(type)}
            </Badge>
          ))}
        </div>
      </section>

      {/* Therapies Grid - Psychedelic Cards */}
      <section id="therapies" className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-white/10 backdrop-blur-sm animate-pulse rounded-3xl border border-purple-300/30" />
            ))}
          </div>
        ) : filteredTherapies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTherapies.map((therapy) => (
              <Link key={therapy.id} href={`/therapy/${therapy.slug}`}>
                <a>
                  <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border-2 border-purple-300/30 hover:border-pink-400/60 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50">
                    {/* Glowing effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-pink-500/10 group-hover:via-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
                    
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={therapy.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800`}
                        alt={therapy.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/50 to-transparent" />
                      
                      {/* Type Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none px-4 py-2 text-sm font-medium shadow-lg">
                          {formatType(therapy.type)}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 relative">
                      <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                        {therapy.title}
                      </h3>
                      
                      <p className="text-purple-200 mb-4 line-clamp-2">
                        {therapy.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-purple-300 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{therapy.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{therapy.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-purple-300/20">
                        <div>
                          <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text">
                            {therapy.currency} {therapy.price}
                          </div>
                          <div className="text-xs text-purple-400">por persona</div>
                        </div>
                        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-6 shadow-lg">
                          Ver Detalles →
                        </Button>
                      </div>
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4 animate-pulse" />
            <p className="text-2xl text-purple-200">No encontramos ceremonias con ese criterio</p>
            <p className="text-purple-300 mt-2">Intenta con otra búsqueda 🌿</p>
          </div>
        )}
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
