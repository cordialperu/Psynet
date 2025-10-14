import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield } from "lucide-react";

export default function MasterLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [code, setCode] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/auth/master-login", { code });
      return await res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("sessionId", data.sessionId);
      localStorage.setItem("isMaster", "true");
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido, Super Admin",
      });
      setLocation("/admin/master/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Acceso denegado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      loginMutation.mutate(code);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <Card className="w-full max-w-md border-gray-700 bg-gray-800/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="font-serif text-3xl text-white">Super Admin</CardTitle>
          <CardDescription className="text-gray-400">
            Ingresa el código de acceso maestro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-300">
                Código de Acceso
              </label>
              <Input
                id="code"
                type="password"
                placeholder="•••"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 text-center text-2xl tracking-widest"
                maxLength={3}
                autoFocus
                data-testid="input-master-code"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
              disabled={loginMutation.isPending || !code.trim()}
              data-testid="button-master-login"
            >
              {loginMutation.isPending ? "Verificando..." : "Acceder"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
