import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  therapyId: string;
  className?: string;
}

export function FavoriteButton({ therapyId, className }: FavoriteButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if therapy is favorited
  const { data: isFavorite = false } = useQuery<boolean>({
    queryKey: [`/api/favorites/check/${therapyId}`],
  });

  // Toggle favorite mutation
  const toggleFavorite = useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem("sessionId");
      const response = await fetch(`/api/favorites/${therapyId}`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Authorization": `Bearer ${sessionId}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/check/${therapyId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      
      toast({
        title: isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
        description: isFavorite 
          ? "La terapia se eliminó de tus favoritos" 
          : "La terapia se agregó a tus favoritos",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar favoritos. Inicia sesión para continuar.",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full hover:bg-red-50 dark:hover:bg-red-900/20",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite.mutate();
      }}
      disabled={toggleFavorite.isPending}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all",
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400",
          isAnimating && "scale-125"
        )}
      />
    </Button>
  );
}
