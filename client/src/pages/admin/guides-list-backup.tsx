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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Guide, Therapy } from "@shared/schema";
import { useState } from "react";

export default function GuidesList() {
  const { toast } = useToast();
  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set());

  const { data: guides = [], isLoading, error } = useQuery<Guide[]>({
    queryKey: ["/api/admin/master/guides"],
  });

  const { data: therapies = [] } = useQuery<Therapy[]>({
    queryKey: ["/api/master/therapies"],
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registered Guides & Brands</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: {guides.length} guides registered
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Social Media</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guides.map((guide) => (
                  <TableRow key={guide.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{guide.fullName}</p>
                        {guide.primarySpecialty && (
                          <p className="text-xs text-muted-foreground">
                            {guide.primarySpecialty}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <a href={`mailto:${guide.email}`} className="hover:underline">
                            {guide.email}
                          </a>
                        </div>
                        {guide.whatsapp && (
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-3 h-3 text-green-600" />
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {guide.instagram && (
                          <div className="flex items-center gap-2">
                            <Instagram className="w-3 h-3 text-pink-600" />
                            <a
                              href={`https://instagram.com/${guide.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:underline"
                            >
                              {guide.instagram}
                            </a>
                          </div>
                        )}
                        {guide.tiktok && (
                          <div className="flex items-center gap-2">
                            <Music2 className="w-3 h-3 text-black dark:text-white" />
                            <a
                              href={`https://tiktok.com/@${guide.tiktok.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:underline"
                            >
                              {guide.tiktok}
                            </a>
                          </div>
                        )}
                        {!guide.instagram && !guide.tiktok && (
                          <span className="text-xs text-muted-foreground">No social media</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
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
                        {guide.verificationStatus && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {guide.verificationStatus}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {guide.createdAt ? new Date(guide.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
