import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const sessionId = localStorage.getItem("sessionId");
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!sessionId,
    retry: false,
  });

  const isAuthenticated = !!sessionId && !!user && !error;

  const logout = () => {
    localStorage.removeItem("sessionId");
    window.location.href = "/admin/login";
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    sessionId,
  };
}
