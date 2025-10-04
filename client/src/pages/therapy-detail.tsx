import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { MapPin, Clock, Calendar, DollarSign, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { Therapy } from "@shared/schema";
import { useState } from "react";
import { format } from "date-fns";

export default function TherapyDetail() {
  const [, params] = useRoute("/therapy/:slug");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { data: therapy, isLoading } = useQuery<Therapy>({
    queryKey: ["/api/therapies/slug", params?.slug],
    enabled: !!params?.slug,
  });

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatPrice = (price: string | null, currency: string | null) => {
    if (!price) return "Price on request";
    return `${currency || "USD"} ${parseFloat(price).toFixed(0)}`;
  };

  const handleWhatsAppClick = () => {
    if (!therapy) return;
    
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || "";
    const dateText = selectedDate ? ` for ${format(selectedDate, 'MMMM d, yyyy')}` : '';
    const message = `Hello, I'm interested in the therapy "${therapy.title}" with ${therapy.guideName}${dateText}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading therapy details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Therapy not found</h2>
            <p className="text-muted-foreground mb-6">The therapy you're looking for doesn't exist.</p>
            <Link href="/explore">
              <a>
                <Button>Explore Therapies</Button>
              </a>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const availableDates = therapy.availableDates?.map(d => new Date(d)) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Video/Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              {therapy.presentationVideoUrl ? (
                <video
                  src={therapy.presentationVideoUrl}
                  controls
                  className="w-full h-full object-cover"
                  data-testid="video-presentation"
                />
              ) : (
                <img
                  src={therapy.guidePhotoUrl || "/placeholder.jpg"}
                  alt={therapy.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-4" data-testid={`badge-type-${therapy.type}`}>
                  {formatType(therapy.type)}
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-therapy-title">
                  {therapy.title}
                </h1>
              </div>

              {/* Guide Profile */}
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={therapy.guidePhotoUrl || undefined} />
                    <AvatarFallback>{therapy.guideName?.charAt(0) || "G"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Your guide</p>
                    <p className="font-semibold text-lg" data-testid="text-guide-name">
                      {therapy.guideName}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {therapy.price && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold" data-testid="text-price">
                        {formatPrice(therapy.price, therapy.currency)}
                      </p>
                    </div>
                  </div>
                )}

                {therapy.duration && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold" data-testid="text-duration">{therapy.duration}</p>
                    </div>
                  </div>
                )}

                {therapy.location && (
                  <div className="flex items-center space-x-3 col-span-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold" data-testid="text-location">{therapy.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <h2 className="font-serif text-3xl font-bold mb-6">About This Experience</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-description">
              {therapy.description || "No description available."}
            </p>
          </div>
        </section>

        {/* Calendar & Booking */}
        <section className="bg-card py-12">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h3 className="font-serif text-3xl font-bold mb-8" data-testid="text-available-dates">
              Available Dates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                    const isAvailable = availableDates.some(
                      available => format(available, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    );
                    return isPast || !isAvailable;
                  }}
                  className="rounded-md border"
                  data-testid="calendar-dates"
                />
              </div>

              <div className="space-y-6">
                {selectedDate && (
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="w-5 h-5 text-primary" />
                      <p className="font-semibold">Selected Date</p>
                    </div>
                    <p className="text-2xl font-bold mb-2" data-testid="text-selected-date">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                  </Card>
                )}

                <Button 
                  size="lg" 
                  className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
                  onClick={handleWhatsAppClick}
                  data-testid="button-whatsapp-booking"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Reserve Your Spot - Consult via WhatsApp
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Click to send a WhatsApp message to the guide and confirm your booking
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
