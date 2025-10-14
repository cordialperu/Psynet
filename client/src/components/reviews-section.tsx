import { useState } from "react";
import { Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

interface ReviewsSectionProps {
  therapyId: string;
}

export function ReviewsSection({ therapyId }: ReviewsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch reviews
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/therapies/${therapyId}/reviews`],
  });

  // Fetch rating summary
  const { data: ratingSummary } = useQuery<{ average: number; count: number }>({
    queryKey: [`/api/therapies/${therapyId}/rating`],
  });

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem("sessionId");
      const response = await fetch(`/api/therapies/${therapyId}/reviews`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sessionId}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/therapies/${therapyId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/therapies/${therapyId}/rating`] });
      
      setRating(0);
      setComment("");
      
      toast({
        title: "Reseña enviada",
        description: "Gracias por tu opinión",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Inicia sesión para continuar.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Calificación requerida",
        description: "Por favor selecciona una calificación",
        variant: "destructive",
      });
      return;
    }
    submitReview.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {ratingSummary && ratingSummary.count > 0 && (
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{ratingSummary.average.toFixed(1)}</div>
          <div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(ratingSummary.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {ratingSummary.count} {ratingSummary.count === 1 ? "reseña" : "reseñas"}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Escribe una reseña</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tu calificación</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tu comentario (opcional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {comment.length}/500
            </div>
          </div>

          <LoadingButton
            type="submit"
            loading={submitReview.isPending}
            loadingText="Enviando..."
            disabled={rating === 0}
          >
            Enviar Reseña
          </LoadingButton>
        </form>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reseñas de usuarios</h3>
        {reviews.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No hay reseñas todavía. ¡Sé el primero en dejar una!
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              )}
              {review.verified && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  ✓ Compra verificada
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
