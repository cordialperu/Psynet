import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TherapyCard } from "@/components/therapy-card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { Therapy } from "@shared/schema";
import { therapyTypes } from "@shared/schema";

export default function Explore() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/published"],
  });

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredTherapies = therapies.filter(therapy => {
    const matchesSearch = 
      !searchQuery || 
      therapy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapy.guideName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapy.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      selectedTypes.length === 0 || 
      selectedTypes.includes(therapy.type);
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar />
      
      <div className="flex-1">
        {/* Filter Bar */}
        <div className="sticky top-16 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search therapies, guides, or locations..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>

            {/* Type Filters */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-200">Filter by type:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {therapyTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer hover-elevate"
                    onClick={() => toggleType(type)}
                    data-testid={`filter-${type}`}
                  >
                    {formatType(type)}
                  </Badge>
                ))}
                {selectedTypes.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTypes([])}
                    data-testid="button-clear-filters"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <p className="text-gray-400" data-testid="text-results-count">
              Showing {filteredTherapies.length} {filteredTherapies.length === 1 ? 'listing' : 'listings'}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
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
              <p className="text-muted-foreground mb-4">No therapies found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTypes([]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
