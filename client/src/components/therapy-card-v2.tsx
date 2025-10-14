import { Link } from "wouter";
import { MapPin, Clock, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Therapy } from "@shared/schema";

interface TherapyCardProps {
  therapy: Therapy;
}

export function TherapyCardV2({ therapy }: TherapyCardProps) {
  const formatPrice = (price: string | null, currency: string | null) => {
    if (!price) return "Consultar precio";
    return `${currency || "USD"} ${parseFloat(price).toFixed(0)}`;
  };

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <Link href={`/therapy/${therapy.slug}`}>
      <a>
        <Card className="group overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-sage-200 hover:border-sage-400 hover:shadow-2xl transition-all duration-500 rounded-3xl">
          {/* Image Container with Organic Overlay */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Organic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-earth-900/30 to-transparent z-10" />
            
            {/* Decorative organic shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage-400/20 rounded-full blur-2xl z-10" />
            
            <img
              src={therapy.guidePhotoUrl || "/placeholder-therapy.jpg"}
              alt={therapy.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Type Badge - Organic Style */}
            <div className="absolute top-4 left-4 z-20">
              <Badge className="bg-sage-600/90 backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full shadow-lg">
                <Leaf className="w-3 h-3 mr-1.5" />
                {formatType(therapy.type)}
              </Badge>
            </div>

            {/* Guide Avatar - Bottom Left */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <Avatar className="w-12 h-12 border-3 border-white shadow-lg">
                <AvatarImage src={therapy.guidePhotoUrl || undefined} alt={therapy.guideName || ""} />
                <AvatarFallback className="bg-sage-600 text-white">
                  {therapy.guideName?.charAt(0) || "G"}
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="text-sm font-medium drop-shadow-lg">
                  {therapy.guideName}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold line-clamp-2 min-h-[3.5rem] text-earth-900 group-hover:text-sage-700 transition-colors">
              {therapy.title}
            </h3>
            
            {/* Info Grid */}
            <div className="space-y-2">
              {therapy.location && (
                <div className="flex items-center text-sm text-earth-600">
                  <MapPin className="w-4 h-4 mr-2 text-sage-600 flex-shrink-0" />
                  <span className="line-clamp-1">{therapy.location}</span>
                </div>
              )}
              
              {therapy.duration && (
                <div className="flex items-center text-sm text-earth-600">
                  <Clock className="w-4 h-4 mr-2 text-sage-600 flex-shrink-0" />
                  <span>{therapy.duration}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-sage-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-earth-600">Desde</span>
                <span className="text-2xl font-bold text-sage-700">
                  {formatPrice(therapy.price, therapy.currency)}
                </span>
              </div>
            </div>

            {/* Hover Effect - Call to Action */}
            <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full py-2 text-center text-sm font-medium text-sage-700 bg-sage-50 rounded-full">
                Ver detalles →
              </div>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}

// Export as both TherapyCardV2 and TherapyCard for compatibility
export { TherapyCardV2 as TherapyCard };
