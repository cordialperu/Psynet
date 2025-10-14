import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Save, 
  CreditCard, 
  LogOut, 
  ArrowLeft,
  User,
  Bell,
  Settings,
  Menu,
  LayoutGrid,
  Users
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminSettings {
  adminName: string;
  adminWhatsapp: string;
  adminWhatsappMexico?: string | null;
  paypalEmail?: string | null;
}

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [adminName, setAdminName] = useState("");
  const [adminWhatsapp, setAdminWhatsapp] = useState("");
  const [adminWhatsappMexico, setAdminWhatsappMexico] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  // Check if master session exists
  useEffect(() => {
    const isMaster = localStorage.getItem("isMaster");
    const sessionId = localStorage.getItem("sessionId");
    
    if (!isMaster || !sessionId) {
      setLocation("/admin/master/login");
    }
  }, [setLocation]);

  const { data: settings, isLoading } = useQuery<AdminSettings>({
    queryKey: ["/api/admin/master/settings"],
  });

  // Update form when data loads
  useEffect(() => {
    if (settings) {
      setAdminName(settings.adminName || "");
      setAdminWhatsapp(settings.adminWhatsapp || "");
      setAdminWhatsappMexico(settings.adminWhatsappMexico || "");
      setPaypalEmail(settings.paypalEmail || "");
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: AdminSettings) => {
      return await apiRequest("POST", "/api/admin/master/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente",
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

  const handleSave = () => {
    if (!adminName || !adminWhatsapp) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({ adminName, adminWhatsapp, adminWhatsappMexico, paypalEmail });
  };

  const handleLogout = () => {
    localStorage.removeItem("isMaster");
    localStorage.removeItem("sessionId");
    setLocation("/admin/master/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin/master/dashboard")}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
              <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                Configuración
              </h1>
            </div>

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
                    className="justify-start h-10 text-sm bg-gray-100 dark:bg-gray-700"
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
      </header>

      <main className="p-3">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-3.5 space-y-3.5">
            {/* Admin Name */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre del Administrador
              </Label>
              <Input
                placeholder="Juan Pérez"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* WhatsApp Numbers */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                WhatsApp para Notificaciones
              </Label>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Perú</Label>
                <Input
                  type="tel"
                  placeholder="+51 987 654 321"
                  value={adminWhatsapp}
                  onChange={(e) => setAdminWhatsapp(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500 dark:text-gray-400">México</Label>
                <Input
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  value={adminWhatsappMexico}
                  onChange={(e) => setAdminWhatsappMexico(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-2.5 rounded-md">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Los mensajes se envían simultáneamente a ambos números para una gestión más eficiente
                </p>
              </div>
            </div>

            {/* PayPal Email */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Email de PayPal
              </Label>
              <Input
                type="email"
                placeholder="pagos@tunegocio.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="w-full h-10 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium mt-4"
            >
              <Save className="w-3.5 h-3.5 mr-2" />
              {saveMutation.isPending ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
