import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Guide, Therapy } from "@shared/schema";
import { MainNavbar } from "@/components/main-navbar";

export default function GuiaDashboard() {
  const { data: guide, isLoading: guideLoading } = useQuery<Guide>({
    queryKey: ["/api/auth/me"],
  });

  const { data: therapies = [], isLoading: therapiesLoading } = useQuery<Therapy[]>({
    queryKey: ["/api/therapies/my-therapies"],
    enabled: !!guide,
  });

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const getStatusBadge = (therapy: Therapy) => {
    if (therapy.approvalStatus === "pending") {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ En Revisión</Badge>;
    }
    if (therapy.approvalStatus === "rejected") {
      return <Badge variant="destructive">❌ Rechazada</Badge>;
    }
    if (therapy.published) {
      return <Badge variant="default" className="bg-green-600">✅ Publicada</Badge>;
    }
    return <Badge variant="secondary">📝 Borrador</Badge>;
  };

  if (guideLoading) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </>
    );
  }

  if (!guide) {
    return (
      <>
        <MainNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Acceso Restringido</CardTitle>
              <CardDescription>
                Debes iniciar sesión para acceder a esta página
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="w-full">Volver al Inicio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 mt-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
              Welcome, {guide.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Manage your listings (ceremonies, therapies, products, etc.)
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{therapies.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Total Listings</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                  {therapies.filter(t => t.published).length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Published</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-300">
                  {therapies.filter(t => t.approvalStatus === "pending").length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Under Review</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {therapies.filter(t => !t.published).length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Drafts</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white transition-colors duration-300">
              My Listings
            </h2>
            <Link href="/guia/ceremonias/nueva">
              <Button size="lg" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                New Listing
              </Button>
            </Link>
          </div>

          {/* Therapies Table */}
          {therapiesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : therapies.length > 0 ? (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-colors duration-300">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-900 dark:text-white font-semibold">Title</TableHead>
                    <TableHead className="text-gray-900 dark:text-white font-semibold">Category</TableHead>
                    <TableHead className="text-gray-900 dark:text-white font-semibold">Location</TableHead>
                    <TableHead className="text-gray-900 dark:text-white font-semibold">Status</TableHead>
                    <TableHead className="text-right text-gray-900 dark:text-white font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {therapies.map((therapy) => (
                    <TableRow key={therapy.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <TableCell className="font-medium text-gray-900 dark:text-white">{therapy.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-semibold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-0">
                          {(therapy.category || "ceremonias").charAt(0).toUpperCase() + (therapy.category || "ceremonias").slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{therapy.location || "—"}</TableCell>
                      <TableCell>{getStatusBadge(therapy)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {therapy.published && (
                            <Link href={`/therapy/${therapy.slug}`}>
                              <Button variant="ghost" size="icon" title="Ver en página pública">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/guia/ceremonias/editar/${therapy.id}`}>
                            <Button variant="ghost" size="icon" title="Editar">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="p-12 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-2xl font-serif font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">No listings yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
                  Create your first listing (ceremony, therapy, product, etc.)
                </p>
                <Link href="/guia/ceremonias/nueva">
                  <Button size="lg" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 rounded-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Create My First Listing
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
