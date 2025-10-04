import { Link } from "wouter";
import { MapPin, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Therapy } from "@shared/schema";

interface TherapyCardProps {
  therapy: Therapy;
}

export function TherapyCard({ therapy }: TherapyCardProps) {
  const formatPrice = (price: string | null, currency: string | null) => {
    if (!price) return "Price on request";
    return `${currency || "USD"} ${parseFloat(price).toFixed(0)}`;
  };

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <Link href={`/therapy/${therapy.slug}`}>
      <a data-testid={`card-therapy-${therapy.id}`}>
        <Card className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            <img
              src={therapy.guidePhotoUrl || "/placeholder-therapy.jpg"}
              alt={therapy.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Type Badge */}
            <div className="absolute top-4 right-4 z-20">
              <Badge className="bg-background/80 backdrop-blur-sm" data-testid={`badge-type-${therapy.type}`}>
                {formatType(therapy.type)}
              </Badge>
            </div>

            {/* Guide Avatar */}
            <div className="absolute bottom-4 left-4 z-20">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src={therapy.guidePhotoUrl || undefined} alt={therapy.guideName || ""} />
                <AvatarFallback>{therapy.guideName?.charAt(0) || "G"}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            <h3 className="font-serif text-xl font-semibold line-clamp-2 min-h-[3.5rem]" data-testid={`text-title-${therapy.id}`}>
              {therapy.title}
            </h3>
            
            <p className="text-sm text-muted-foreground" data-testid={`text-guide-${therapy.id}`}>
              with {therapy.guideName}
            </p>

            <div className="flex items-center justify-between pt-2">
              {therapy.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span data-testid={`text-location-${therapy.id}`}>{therapy.location}</span>
                </div>
              )}
              
              <div className="flex items-center font-bold text-lg" data-testid={`text-price-${therapy.id}`}>
                <DollarSign className="w-4 h-4" />
                {formatPrice(therapy.price, therapy.currency)}
              </div>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}
