import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Plus, Edit, Trash2, LogOut, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import type { Guide, Therapy } from "@shared/schema";
import { useState } from "react";
import { GuideProfileForm } from "@/components/admin/guide-profile-form";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<"profile" | "therapies">("therapies");

  const { data: guide, isLoading: guideLoading } = useQuery<Guide>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn<Guide>({ on401: "returnNull" }),
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
        title: "Listing deleted",
        description: "The listing has been removed successfully.",
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading...</p>
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
      <div className="flex h-screen w-full bg-white dark:bg-gray-900 transition-colors duration-300">
        <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="font-serif text-xl text-gray-900 dark:text-white transition-colors duration-300">
                🌿 PsycheConecta
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
                      <span>My Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("therapies")}
                      isActive={activeSection === "therapies"}
                      data-testid="nav-therapies"
                    >
                      <FileText className="w-4 h-4" />
                      <span>My Listings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                onClick={() => logoutMutation.mutate()}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="p-8">
            {activeSection === "profile" && (
              <div>
                <div className="mb-8">
                  <h1 className="font-serif text-4xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-300">Your Profile</h1>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Manage your guide profile and upload media
                  </p>
                </div>
                <GuideProfileForm guide={guide} />
              </div>
            )}

            {activeSection === "therapies" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">My Listings</h2>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Manage your published offerings</p>
                  </div>
                  <Link href="/admin/therapies/new">
                    <Button data-testid="button-new-therapy" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl transition-colors duration-300">
                      <Plus className="w-4 h-4 mr-2" />
                      New Listing
                    </Button>
                  </Link>
                </div>

                {therapiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
                  </div>
                ) : therapies.length > 0 ? (
                  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200 dark:border-gray-700">
                          <TableHead className="text-gray-900 dark:text-white">Title</TableHead>
                          <TableHead className="text-gray-900 dark:text-white">Type</TableHead>
                          <TableHead className="text-gray-900 dark:text-white">Location</TableHead>
                          <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                          <TableHead className="text-right text-gray-900 dark:text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {therapies.map((therapy) => (
                          <TableRow key={therapy.id} data-testid={`row-therapy-${therapy.id}`} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                            <TableCell className="font-medium text-gray-900 dark:text-white">{therapy.title}</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{formatType(therapy.type)}</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{therapy.location || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={therapy.published ? "default" : "secondary"} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                {therapy.published ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Link href={`/admin/therapies/edit/${therapy.id}`}>
                                  <Button variant="ghost" size="icon" data-testid={`button-edit-${therapy.id}`} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteTherapyMutation.mutate(therapy.id)}
                                  data-testid={`button-delete-${therapy.id}`}
                                  className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-300"
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
                  <Card className="p-12 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">You haven't created any listings yet.</p>
                    <Link href="/admin/therapies/new">
                      <Button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl transition-colors duration-300">Create Your First Listing</Button>
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
