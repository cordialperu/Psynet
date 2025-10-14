import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Edit,
  LogOut,
  Search,
  Settings,
  Users,
  LayoutGrid,
  Menu,
  Filter,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Therapy } from "@shared/schema";
import { categories } from "@shared/schema";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MasterDashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Check if master session exists
  useEffect(() => {
    const isMaster = localStorage.getItem("isMaster");
    const sessionId = localStorage.getItem("sessionId");

    if (!isMaster || !sessionId) {
      setLocation("/admin/master/login");
    }
  }, [setLocation]);

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/master/therapies"],
  });

  const handleLogout = () => {
    localStorage.removeItem("isMaster");
    localStorage.removeItem("sessionId");
    setLocation("/admin/master/login");
  };

  // Filtrar terapias
  const filteredTherapies = therapies.filter(therapy => {
    const matchesSearch = searchTerm === "" ||
      therapy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapy.guideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapy.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || (therapy.category || "ceremonias") === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Estadísticas
  const stats = {
    total: therapies.length,
    published: therapies.filter(t => t.published).length,
    draft: therapies.filter(t => !t.published).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Compact Fixed Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                Super Admin
              </h1>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 px-2.5 text-xs"
              >
                <Search className="w-3.5 h-3.5 mr-1.5" />
                Buscar
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-1.5 mt-6">
                    <Button
                      variant="ghost"
                      onClick={() => setLocation("/admin/master/dashboard")}
                      className="justify-start h-10 text-sm"
                    >
                      <LayoutGrid className="w-4 h-4 mr-2.5" />
                      Publicaciones
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setLocation("/admin/master/guides")}
                      className="justify-start h-10 text-sm"
                    >
                      <Users className="w-4 h-4 mr-2.5" />
                      Guías
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setLocation("/admin/master/settings")}
                      className="justify-start h-10 text-sm"
                    >
                      <Settings className="w-4 h-4 mr-2.5" />
                      Configuración
                    </Button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start h-10 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Cerrar Sesión
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input
                    placeholder="Buscar publicaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-28 h-9 text-xs">
                    <Filter className="w-3.5 h-3.5 mr-1.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">Todas</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-9 px-2.5"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="p-3">
        {/* Stats Cards - Vertical Layout */}
        <div className="grid gap-2.5 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total Publicaciones</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <LayoutGrid className="w-7 h-7 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Publicadas</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.published}</p>
              </div>
              <Eye className="w-7 h-7 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Borradores</p>
                <p className="text-xl font-bold text-gray-400">{stats.draft}</p>
              </div>
              <EyeOff className="w-7 h-7 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Listings - Large Touch-Friendly Cards */}
        <div className="space-y-3">
          {filteredTherapies.length > 0 ? (
            filteredTherapies.map((therapy) => (
              <div key={therapy.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3.5 shadow-sm">
                <div className="flex gap-3">
                  {/* Guide Photo */}
                  {therapy.guidePhotoUrl && (
                    <img
                      src={therapy.guidePhotoUrl}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 pr-2">
                        {therapy.title}
                      </h3>
                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                        {therapy.published ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" title="Publicada" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" title="Borrador" />
                        )}
                        <a href={`/admin/master/therapies/edit/${therapy.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Editar
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                          {therapy.category || "ceremonias"}
                        </span>
                        {therapy.guideName && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {therapy.guideName}
                          </span>
                        )}
                      </div>

                      {therapy.price && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {therapy.currency} {therapy.price}
                          </span>
                          {therapy.location && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 dark:text-gray-400">{therapy.location}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-10 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No se encontraron publicaciones
              </p>
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredTherapies.length > 0 && (
          <div className="mt-5 text-xs text-gray-500 dark:text-gray-400 text-center">
            Mostrando {filteredTherapies.length} de {therapies.length} publicaciones
          </div>
        )}
      </main>
    </div>
  );
}
