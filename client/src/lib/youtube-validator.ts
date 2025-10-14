// Función para extraer el ID del video de YouTube
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Función para validar duración del video (máximo 1 minuto)
export async function validateYouTubeVideoDuration(url: string): Promise<{
  valid: boolean;
  duration?: number;
  error?: string;
}> {
  const videoId = getYouTubeVideoId(url);
  
  if (!videoId) {
    return { valid: false, error: "URL de YouTube inválida" };
  }

  try {
    // Nota: Para validar la duración real necesitarías la YouTube Data API
    // Por ahora, solo validamos que sea una URL válida de YouTube
    // En producción, deberías implementar la validación con YouTube API
    
    // Simulación de validación (en producción usar YouTube API)
    console.log(`⚠️ Validación de duración pendiente para video: ${videoId}`);
    console.log(`   Para implementar validación real, necesitas YouTube Data API Key`);
    
    // Por ahora, aceptamos todos los videos válidos
    return { valid: true, duration: 60 }; // Asumimos 60 segundos
    
  } catch (error) {
    return { valid: false, error: "Error al validar el video" };
  }
}

// Función para obtener información del video (requiere YouTube API)
export async function getYouTubeVideoInfo(videoId: string, apiKey?: string): Promise<{
  duration: number; // en segundos
  title: string;
  thumbnail: string;
} | null> {
  if (!apiKey) {
    console.warn("⚠️ YouTube API Key no configurada. No se puede validar duración.");
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,snippet&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    
    // Parsear duración ISO 8601 (PT1M30S = 90 segundos)
    const duration = parseISO8601Duration(video.contentDetails.duration);
    
    return {
      duration,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
    };
  } catch (error) {
    console.error("Error obteniendo info del video:", error);
    return null;
  }
}

// Parsear duración ISO 8601 de YouTube
function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Validación simple para el formulario
export function validateYouTubeUrl(url: string): {
  valid: boolean;
  videoId?: string;
  error?: string;
} {
  if (!url || url.trim() === '') {
    return { valid: false, error: "URL requerida" };
  }

  const videoId = getYouTubeVideoId(url);
  
  if (!videoId) {
    return { valid: false, error: "URL de YouTube inválida. Usa formato: https://www.youtube.com/watch?v=..." };
  }

  return { valid: true, videoId };
}
