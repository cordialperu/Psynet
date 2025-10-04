import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Plus, Edit, Trash2, LogOut, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Guide, Therapy } from "@shared/schema";
import { useState } from "react";
import { GuideProfileForm } from "@/components/admin/guide-profile-form";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<"profile" | "therapies">("profile");

  const { data: guide, isLoading: guideLoading } = useQuery<Guide>({
    queryKey: ["/api/auth/me"],
  });

  const { data: therapies = [], isLoading: therapiesLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/my-therapies"],
    enabled: !!guide,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      localStorage.removeItem("sessionId");
      queryClient.clear();
      setLocation("/admin/login");
    },
  });

  const deleteTherapyMutation = useMutation({
    mutationFn: async (therapyId: string) => {
      return await apiRequest("DELETE", `/api/therapies/${therapyId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/therapies/my-therapies"] });
      toast({
        title: "Therapy deleted",
        description: "The therapy has been removed successfully.",
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

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (guideLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="font-serif text-xl">
                PsycheConecta
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-6">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("profile")}
                      isActive={activeSection === "profile"}
                      data-testid="nav-profile"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("therapies")}
                      isActive={activeSection === "therapies"}
                      data-testid="nav-therapies"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Therapies</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => logoutMutation.mutate()}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {activeSection === "profile" && (
              <div>
                <div className="mb-8">
                  <h1 className="font-serif text-4xl font-bold mb-2">Your Profile</h1>
                  <p className="text-muted-foreground">
                    Manage your guide profile and upload media
                  </p>
                </div>
                <GuideProfileForm guide={guide} />
              </div>
            )}

            {activeSection === "therapies" && (
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-4xl font-bold mb-2">Your Therapies</h1>
                    <p className="text-muted-foreground">
                      Manage your therapy offerings
                    </p>
                  </div>
                  <Link href="/admin/therapies/new">
                    <a>
                      <Button data-testid="button-add-therapy">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Therapy
                      </Button>
                    </a>
                  </Link>
                </div>

                {therapiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : therapies.length > 0 ? (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {therapies.map((therapy) => (
                          <TableRow key={therapy.id} data-testid={`row-therapy-${therapy.id}`}>
                            <TableCell className="font-medium">{therapy.title}</TableCell>
                            <TableCell>{formatType(therapy.type)}</TableCell>
                            <TableCell>{therapy.location || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={therapy.isPublished ? "default" : "secondary"}>
                                {therapy.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Link href={`/admin/therapies/edit/${therapy.id}`}>
                                  <a>
                                    <Button variant="ghost" size="icon" data-testid={`button-edit-${therapy.id}`}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </a>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteTherapyMutation.mutate(therapy.id)}
                                  data-testid={`button-delete-${therapy.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">You haven't created any therapies yet.</p>
                    <Link href="/admin/therapies/new">
                      <a>
                        <Button>Create Your First Therapy</Button>
                      </a>
                    </Link>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
