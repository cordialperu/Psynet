import { useQuery } from "@tanstack/react-query";
import { Search, Shield, MessageCircle, Sparkles, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TherapyCard } from "@/components/therapy-card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { Therapy } from "@shared/schema";
import heroImage from "@assets/generated_images/Sacred_Valley_Peru_hero_image_e5c09f4b.png";
import trustImage from "@assets/generated_images/Guide_preparing_ceremony_space_e49f6c57.png";

export default function Home() {
  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/featured"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6" data-testid="text-hero-title">
            Authentic Healing Experiences in Peru
          </h1>
          <p className="text-lg md:text-xl mb-12 text-white/90 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Connect with experienced guides for transformative plant medicine ceremonies and alternative therapies
          </p>
          
          <Link href="/explore">
            <a>
              <Button size="lg" className="py-4 px-8 text-lg" data-testid="button-explore-therapies">
                <Search className="w-5 h-5 mr-2" />
                Explore Therapies
              </Button>
            </a>
          </Link>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>50+ Verified Guides</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>200+ Ceremonies</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Safe & Respectful</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Therapies */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold" data-testid="text-featured-title">
              Featured Experiences
            </h2>
            <Link href="/explore">
              <a className="text-primary hover:underline font-medium" data-testid="link-explore-all">
                Explore All →
              </a>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapies.slice(0, 6).map((therapy) => (
                <TherapyCard key={therapy.id} therapy={therapy} />
              ))}
            </div>
          )}

          {therapies.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured therapies available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">
            Your Journey to Healing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Browse & Filter</h3>
              <p className="text-muted-foreground">
                Explore authentic ceremonies and find the perfect guide for your healing journey
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Connect via WhatsApp</h3>
              <p className="text-muted-foreground">
                Reach out directly to guides to ask questions and book your experience
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Begin Your Transformation</h3>
              <p className="text-muted-foreground">
                Experience authentic healing ceremonies led by experienced guides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Why Choose PsycheConecta
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Vetted Guides</h3>
                    <p className="text-muted-foreground">
                      All guides are carefully reviewed to ensure authentic, safe experiences
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Transparent Pricing</h3>
                    <p className="text-muted-foreground">
                      Clear pricing and no hidden fees, know exactly what to expect
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Cultural Respect</h3>
                    <p className="text-muted-foreground">
                      Honoring indigenous traditions and practices with deep respect
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={trustImage}
                alt="Authentic healing ceremony"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
