import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Mail, 
  Instagram, 
  MessageCircle,
  CheckCircle,
  Clock,
  Music2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Guide, Therapy } from "@shared/schema";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

export default function GuidesList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set());
  const [adminCountry, setAdminCountry] = useState<'PE' | 'MX'>(() => {
    const saved = localStorage.getItem('adminCountry');
    return (saved === 'MX' || saved === 'PE') ? (saved as 'PE' | 'MX') : 'PE';
  });

  useEffect(() => {
    localStorage.setItem('adminCountry', adminCountry);
  }, [adminCountry]);

  const { data: guides = [], isLoading, error } = useQuery<Guide[]>({
    queryKey: ["/api/admin/master/guides"],
  });

  const { data: therapies = [] } = useQuery<Therapy[]>({
    queryKey: [
      `/api/master/therapies?country=${adminCountry}`,
    ],
  });

  console.log("Guides query:", { guides, isLoading, error });

  const toggleGuide = (guideId: string) => {
    setExpandedGuides(prev => {
      const newSet = new Set(prev);
      if (newSet.has(guideId)) {
        newSet.delete(guideId);
      } else {
        newSet.add(guideId);
      }
      return newSet;
    });
  };

  const approveMutation = useMutation({
    mutationFn: async (therapyId: string) => {
      return await apiRequest("PATCH", `/api/master/therapies/${therapyId}`, {
        approvalStatus: "approved",
        published: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/master/therapies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/therapies/published"] });
      toast({
        title: "Publicación aprobada",
        description: "La publicación ahora está visible para el público",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (therapyId: string) => {
      return await apiRequest("PATCH", `/api/master/therapies/${therapyId}`, {
        approvalStatus: "rejected",
        published: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/master/therapies"] });
      toast({
        title: "Publicación rechazada",
        description: "La publicación ha sido rechazada",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getGuideTherapies = (guideId: string) => {
    return therapies.filter(t => t.guideId === guideId);
  };

  const getStatusBadge = (therapy: Therapy) => {
    if (therapy.approvalStatus === "rejected") {
      return <Badge variant="destructive" className="text-xs">❌ Rechazada</Badge>;
    }
    if (therapy.approvalStatus === "pending") {
      return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">⏳ Pendiente</Badge>;
    }
    if (therapy.published) {
      return <Badge variant="default" className="text-xs bg-green-600">✅ Publicada</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">📝 Borrador</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading guides...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading guides: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with Country Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setLocation('/admin/master/dashboard')}>
            Volver
          </Button>
          <h2 className="text-xl font-semibold">Guides</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800">
              <span className="text-xs">Country:</span>
              <span className="inline-flex items-center justify-center h-5 w-8 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">
                {adminCountry}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setAdminCountry('PE')} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">PE</span>
                <span className="text-sm text-gray-700">Perú</span>
              </div>
              {adminCountry === 'PE' && <span className="h-2 w-2 rounded-full bg-gray-400" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAdminCountry('MX')} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">MX</span>
                <span className="text-sm text-gray-700">México</span>
              </div>
              {adminCountry === 'MX' && <span className="h-2 w-2 rounded-full bg-gray-400" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registered Guides & Brands</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: {guides.length} guides registered
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guides.map((guide) => {
              const guideTherapies = getGuideTherapies(guide.id);
              const isExpanded = expandedGuides.has(guide.id);
              const pendingCount = guideTherapies.filter(t => t.approvalStatus === "pending").length;
              
              return (
                <Card key={guide.id} className="border-2">
                  <CardContent className="pt-6">
                    {/* Guide Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {guide.profilePhotoUrl && (
                          <img
                            src={guide.profilePhotoUrl}
                            alt={guide.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{guide.fullName}</h3>
                            {guide.verified ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          {guide.primarySpecialty && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {guide.primarySpecialty}
                            </p>
                          )}
                          
                          {/* Contact Info */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <a href={`mailto:${guide.email}`} className="hover:underline">
                                {guide.email}
                              </a>
                            </div>
                            {guide.whatsapp && (
                              <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-green-600" />
                                <a 
                                  href={`https://wa.me/${guide.whatsapp.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline text-green-600"
                                >
                                  {guide.whatsapp}
                                </a>
                              </div>
                            )}
                            {guide.instagram && (
                              <div className="flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-600" />
                                <a 
                                  href={`https://instagram.com/${guide.instagram.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {guide.instagram}
                                </a>
                              </div>
                            )}
                            {guide.tiktok && (
                              <div className="flex items-center gap-2">
                                <Music2 className="w-4 h-4" />
                                <a 
                                  href={`https://tiktok.com/@${guide.tiktok.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {guide.tiktok}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-2">
                          Registered: {guide.createdAt ? new Date(guide.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Badge variant="outline">{guideTherapies.length} publicaciones</Badge>
                          {pendingCount > 0 && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              {pendingCount} pendientes
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    {guideTherapies.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleGuide(guide.id)}
                        className="w-full"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Ocultar publicaciones
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Ver {guideTherapies.length} publicaciones
                            {pendingCount > 0 && ` (${pendingCount} pendientes)`}
                          </>
                        )}
                      </Button>
                    )}

                    {/* Therapies List */}
                    {isExpanded && guideTherapies.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Título</TableHead>
                              <TableHead>Categoría</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {guideTherapies.map((therapy) => (
                              <TableRow key={therapy.id}>
                                <TableCell className="font-medium">
                                  {therapy.title}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs">
                                    {(therapy.category || "ceremonias").charAt(0).toUpperCase() + 
                                     (therapy.category || "ceremonias").slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {therapy.price ? `${therapy.currency} ${therapy.price}` : "—"}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(therapy)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    {therapy.approvalStatus === "pending" && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="default"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => approveMutation.mutate(therapy.id)}
                                          disabled={approveMutation.isPending}
                                        >
                                          <Check className="w-4 h-4 mr-1" />
                                          Aprobar
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => rejectMutation.mutate(therapy.id)}
                                          disabled={rejectMutation.isPending}
                                        >
                                          <X className="w-4 h-4 mr-1" />
                                          Rechazar
                                        </Button>
                                      </>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.location.href = `/admin/master/therapies/edit/${therapy.id}`}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-1" />
                                      Ver
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {guideTherapies.length === 0 && (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Este guía aún no tiene publicaciones
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {guides.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No guides registered yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
