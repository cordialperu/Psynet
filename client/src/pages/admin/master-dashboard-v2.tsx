import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Edit, LogOut, Shield, Search, Package, Users, TrendingUp, CheckCircle, XCircle, Clock, Pause, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Therapy } from "@shared/schema";
import { categories } from "@shared/schema";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MasterDashboardV2() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [newInventory, setNewInventory] = useState<number>(0);
  const [newCapacity, setNewCapacity] = useState<number>(0);
  const [newBookedSlots, setNewBookedSlots] = useState<number>(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if master session exists
  useEffect(() => {
    const isMaster = localStorage.getItem("isMaster");
    const sessionId = localStorage.getItem("sessionId");
    
    if (!isMaster || !sessionId) {
      setLocation("/admin/master/login");
    }
  }, [setLocation]);

  const [adminCountry, setAdminCountry] = useState<'PE' | 'MX'>(() => {
    const saved = localStorage.getItem('adminCountry');
    return (saved === 'MX' || saved === 'PE') ? (saved as 'PE' | 'MX') : 'PE';
  });

  useEffect(() => {
    localStorage.setItem('adminCountry', adminCountry);
  }, [adminCountry]);

  const { data: therapies = [], isLoading } = useQuery<Therapy[]>({
    queryKey: [
      `/api/master/therapies?country=${adminCountry}`,
    ],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Therapy> }) => {
      const res = await apiRequest("PATCH", `/api/master/therapies/${data.id}`, data.updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/master/therapies"] });
      toast({
        title: "Updated successfully",
        description: "The listing has been updated",
      });
      setIsManageDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("isMaster");
    localStorage.removeItem("sessionId");
    setLocation("/admin/master/login");
  };

  const openManageDialog = (therapy: Therapy) => {
    setSelectedTherapy(therapy);
    setNewInventory(therapy.inventory || 0);
    setNewCapacity(therapy.capacity || 0);
    setNewBookedSlots(therapy.bookedSlots || 0);
    setIsManageDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedTherapy) return;
    
    const updates: Partial<Therapy> = {};
    const category = selectedTherapy.category || 'ceremonias';
    
    if (category === 'productos' || category === 'medicina' || category === 'microdosis') {
      updates.inventory = newInventory;
    } else {
      updates.capacity = newCapacity;
      updates.bookedSlots = newBookedSlots;
    }
    
    updateMutation.mutate({ id: selectedTherapy.id, updates });
  };

  const handleStatusChange = (therapyId: string, newStatus: string) => {
    const updates: Partial<Therapy> = {};
    
    switch (newStatus) {
      case 'published':
        updates.published = true;
        updates.approvalStatus = 'approved';
        break;
      case 'pending':
        updates.published = false;
        updates.approvalStatus = 'pending';
        break;
      case 'paused':
        updates.published = false;
        updates.approvalStatus = 'approved'; // Aprobado pero no publicado
        break;
    }
    
    updateMutation.mutate({ id: therapyId, updates });
  };

  const moveUp = (therapy: Therapy, index: number) => {
    if (index === 0) return; // Ya está en la cima
    
    const prevTherapy = filteredTherapies[index - 1];
    const currentOrder = therapy.displayOrder || 0;
    const prevOrder = prevTherapy.displayOrder || 0;
    
    // Intercambiar órdenes
    updateMutation.mutate({ 
      id: therapy.id, 
      updates: { displayOrder: prevOrder + 1 } 
    });
  };

  const moveDown = (therapy: Therapy, index: number) => {
    if (index === filteredTherapies.length - 1) return; // Ya está al final
    
    const nextTherapy = filteredTherapies[index + 1];
    const currentOrder = therapy.displayOrder || 0;
    const nextOrder = nextTherapy.displayOrder || 0;
    
    // Intercambiar órdenes
    updateMutation.mutate({ 
      id: therapy.id, 
      updates: { displayOrder: nextOrder - 1 } 
    });
  };

  const getStatusValue = (therapy: Therapy): string => {
    if (therapy.published) return 'published';
    if (therapy.approvalStatus === 'pending') return 'pending';
    return 'paused';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'paused':
        return <Badge variant="secondary"><Pause className="w-3 h-3 mr-1" />Paused</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    switch (category) {
      case 'ceremonias':
        return <Badge className="bg-purple-600 text-white hover:bg-purple-700">{categoryName}</Badge>;
      case 'terapias':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">{categoryName}</Badge>;
      case 'microdosis':
        return <Badge className="bg-pink-600 text-white hover:bg-pink-700">{categoryName}</Badge>;
      case 'medicina':
        return <Badge className="bg-green-600 text-white hover:bg-green-700">{categoryName}</Badge>;
      case 'eventos':
        return <Badge className="bg-orange-600 text-white hover:bg-orange-700">{categoryName}</Badge>;
      case 'productos':
        return <Badge className="bg-cyan-600 text-white hover:bg-cyan-700">{categoryName}</Badge>;
      default:
        return <Badge variant="secondary">{categoryName}</Badge>;
    }
  };

  // Filtrar y ordenar terapias (pendientes primero)
  const filteredTherapies = therapies
    .filter(therapy => {
      const matchesSearch = searchTerm === "" || 
        therapy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapy.guideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapy.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || (therapy.category || "ceremonias") === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Prioridad 1: Pendientes primero
      const aStatus = getStatusValue(a);
      const bStatus = getStatusValue(b);
      
      if (aStatus === 'pending' && bStatus !== 'pending') return -1;
      if (aStatus !== 'pending' && bStatus === 'pending') return 1;
      
      // Prioridad 2: Publicados antes que pausados
      if (aStatus === 'published' && bStatus === 'paused') return -1;
      if (aStatus === 'paused' && bStatus === 'published') return 1;
      
      // Prioridad 3: Orden manual (displayOrder descendente = más arriba)
      const aOrder = a.displayOrder || 0;
      const bOrder = b.displayOrder || 0;
      if (aOrder !== bOrder) return bOrder - aOrder;
      
      // Prioridad 4: Más recientes primero
      return new Date(b.updatedAt || b.createdAt || 0).getTime() - 
             new Date(a.updatedAt || a.createdAt || 0).getTime();
    });

  // Estadísticas
  const stats = {
    total: therapies.length,
    published: therapies.filter(t => t.published).length,
    pending: therapies.filter(t => t.approvalStatus === 'pending').length,
    lowStock: therapies.filter(t => {
      const cat = t.category || 'ceremonias';
      if (cat === 'productos' || cat === 'medicina' || cat === 'microdosis') {
        return (t.inventory || 0) < 5;
      } else {
        const available = (t.capacity || 0) - (t.bookedSlots || 0);
        return available < 3 && available > 0;
      }
    }).length,
  };

  const getAvailabilityBadge = (therapy: Therapy) => {
    const category = therapy.category || 'ceremonias';
    
    if (category === 'productos' || category === 'medicina' || category === 'microdosis') {
      const stock = therapy.inventory || 0;
      if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
      if (stock < 5) return <Badge className="bg-orange-500">Low Stock ({stock})</Badge>;
      return <Badge className="bg-green-600">In Stock ({stock})</Badge>;
    } else {
      const capacity = therapy.capacity || 0;
      const booked = therapy.bookedSlots || 0;
      const available = capacity - booked;
      
      if (capacity === 0) return <Badge variant="secondary">No Capacity Set</Badge>;
      if (available === 0) return <Badge variant="destructive">Full ({booked}/{capacity})</Badge>;
      if (available < 3) return <Badge className="bg-orange-500">Almost Full ({booked}/{capacity})</Badge>;
      return <Badge className="bg-green-600">Available ({booked}/{capacity})</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Super Admin</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Inventory & Bookings Manager</p>
                </div>
              </div>
              
              {/* Country Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <span className="text-lg">
                      {adminCountry === 'PE' ? '🇵🇪' : '🇲🇽'}
                    </span>
                    <span className="text-sm font-medium">
                      {adminCountry === 'PE' ? 'Perú' : 'México'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setAdminCountry('PE')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇵🇪</span>
                      <span className="text-sm">Perú</span>
                    </div>
                    {adminCountry === 'PE' && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setAdminCountry('MX')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇲🇽</span>
                      <span className="text-sm">México</span>
                    </div>
                    {adminCountry === 'MX' && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <nav className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/admin/master/dashboard")}
                  className="text-sm"
                >
                  Listings
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/admin/master/guides")}
                  className="text-sm"
                >
                  Guides
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/admin/master/settings")}
                  className="text-sm"
                >
                  Settings
                </Button>
              </nav>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Country Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {adminCountry === 'PE' ? '🇵🇪' : '🇲🇽'}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {adminCountry === 'PE' ? 'Administrando Perú' : 'Administrando México'}
              </h2>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestión de inventario y reservas para {adminCountry === 'PE' ? 'Perú' : 'México'}
          </p>
        </div>
        
        {/* Stats - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Published</div>
                <div className="text-xl font-bold text-green-600">{stats.published}</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</div>
                <div className="text-xl font-bold text-orange-600">{stats.pending}</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Low Stock</div>
                <div className="text-xl font-bold text-red-600">{stats.lowStock}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by title, guide or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-white">Order</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Title</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Category</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Guide</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Price</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Availability</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTherapies.length > 0 ? (
                  filteredTherapies.map((therapy, index) => {
                    const isPending = getStatusValue(therapy) === 'pending';
                    return (
                    <TableRow 
                      key={therapy.id} 
                      className={`border-gray-200 dark:border-gray-700 ${isPending ? 'bg-orange-50 dark:bg-orange-950/20' : ''}`}
                    >
                      <TableCell className="text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveUp(therapy, index)}
                            disabled={index === 0 || updateMutation.isPending}
                            title="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveDown(therapy, index)}
                            disabled={index === filteredTherapies.length - 1 || updateMutation.isPending}
                            title="Move down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {isPending && <span className="text-orange-500 font-bold">⚠️</span>}
                          <div className="truncate">{therapy.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(therapy.category || "ceremonias")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {therapy.guidePhotoUrl && (
                            <img
                              src={therapy.guidePhotoUrl}
                              alt={therapy.guideName || ""}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm text-gray-900 dark:text-white">{therapy.guideName || "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-white">
                        {therapy.price ? `${therapy.currency} ${therapy.price}` : "—"}
                      </TableCell>
                      <TableCell>
                        {getAvailabilityBadge(therapy)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={getStatusValue(therapy)}
                          onValueChange={(value) => handleStatusChange(therapy.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                            <SelectValue>
                              {getStatusBadge(getStatusValue(therapy))}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Published
                              </div>
                            </SelectItem>
                            <SelectItem value="pending">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="paused">
                              <div className="flex items-center">
                                <Pause className="w-4 h-4 mr-2 text-gray-500" />
                                Paused
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openManageDialog(therapy)}
                            title="Manage Inventory/Capacity"
                          >
                            {(therapy.category === 'productos' || therapy.category === 'medicina' || therapy.category === 'microdosis') ? (
                              <Package className="w-4 h-4" />
                            ) : (
                              <Users className="w-4 h-4" />
                            )}
                          </Button>
                          <a href={`/admin/master/therapies/edit/${therapy.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No listings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Results count */}
        {filteredTherapies.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Showing {filteredTherapies.length} of {therapies.length} listings
          </div>
        )}
      </main>

      {/* Manage Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {selectedTherapy && (selectedTherapy.category === 'productos' || selectedTherapy.category === 'medicina' || selectedTherapy.category === 'microdosis') 
                ? 'Manage Inventory' 
                : 'Manage Capacity & Bookings'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {selectedTherapy?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTherapy && (
            <div className="space-y-4">
              {(selectedTherapy.category === 'productos' || selectedTherapy.category === 'medicina' || selectedTherapy.category === 'microdosis') ? (
                <div className="space-y-2">
                  <Label htmlFor="inventory" className="text-gray-900 dark:text-white">Stock Available</Label>
                  <Input
                    id="inventory"
                    type="number"
                    min="0"
                    value={newInventory}
                    onChange={(e) => setNewInventory(parseInt(e.target.value) || 0)}
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update this after receiving payment confirmations
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-gray-900 dark:text-white">Total Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="0"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(parseInt(e.target.value) || 0)}
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Maximum number of participants
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booked" className="text-gray-900 dark:text-white">Booked Slots</Label>
                    <Input
                      id="booked"
                      type="number"
                      min="0"
                      max={newCapacity}
                      value={newBookedSlots}
                      onChange={(e) => setNewBookedSlots(Math.min(parseInt(e.target.value) || 0, newCapacity))}
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Update this after confirming reservations
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      Available Slots: {newCapacity - newBookedSlots}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsManageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
