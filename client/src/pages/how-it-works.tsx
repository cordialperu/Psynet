import { Search, MessageCircle, Sparkles, Shield, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              How PsycheConecta Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Your journey to authentic healing experiences in Peru, simplified
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="space-y-20">
              {/* Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl font-bold mb-4">1. Browse & Filter</h2>
                    <p className="text-muted-foreground mb-6">
                      Explore our curated selection of authentic healing ceremonies and alternative therapies. 
                      Use our powerful filters to find experiences that match your needs - filter by therapy type, 
                      location, price, and available dates.
                    </p>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>All guides are carefully vetted for authenticity and safety</span>
                      </li>
                      <li className="flex items-start">
                        <Heart className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Detailed profiles with guide backgrounds and specialties</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl" />
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-secondary/20 rounded-xl md:order-first" />
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl font-bold mb-4">2. Connect via WhatsApp</h2>
                    <p className="text-muted-foreground mb-6">
                      Once you find the perfect experience, connect directly with the guide through WhatsApp. 
                      Ask questions, discuss your intentions, and get personalized guidance before booking.
                    </p>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <MessageCircle className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Direct communication with your chosen guide</span>
                      </li>
                      <li className="flex items-start">
                        <Users className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Get answers to all your questions before committing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl font-bold mb-4">3. Begin Your Transformation</h2>
                    <p className="text-muted-foreground mb-6">
                      After confirming your booking with the guide, prepare for your transformative journey. 
                      Your guide will provide all necessary information about preparation, what to bring, 
                      and what to expect during the ceremony.
                    </p>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <Sparkles className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Experience authentic indigenous healing traditions</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Safe, respectful, and culturally appropriate ceremonies</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our curated selection of authentic healing experiences
            </p>
            <Link href="/explore">
              <a>
                <Button size="lg" className="py-6 px-8 text-lg" data-testid="button-explore">
                  Explore Therapies
                </Button>
              </a>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
