import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const sessionId = localStorage.getItem("sessionId");
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
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
