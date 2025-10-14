import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Instagram as InstagramIcon, Phone } from "lucide-react";
import type { Guide } from "@shared/schema";

interface GuideInfoModalProps {
  guide: Guide | null;
  isOpen: boolean;
  onClose: () => void;
}

// Función para extraer el ID del video de YouTube
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function GuideInfoModal({ guide, isOpen, onClose }: GuideInfoModalProps) {
  if (!guide) return null;

  const videoId = guide.presentationVideoUrl ? getYouTubeVideoId(guide.presentationVideoUrl) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-gray-900 dark:text-white">
            {guide.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Photo */}
          {guide.profilePhotoUrl && (
            <div className="flex justify-center">
              <img
                src={guide.profilePhotoUrl}
                alt={guide.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.whatsapp && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                <a
                  href={`https://wa.me/${guide.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                >
                  {guide.whatsapp}
                </a>
              </div>
            )}

            {guide.instagram && (
              <div className="flex items-center gap-2 text-sm">
                <InstagramIcon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <a
                  href={`https://instagram.com/${guide.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
                >
                  {guide.instagram}
                </a>
              </div>
            )}

            {guide.tiktok && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <a
                  href={`https://tiktok.com/@${guide.tiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {guide.tiktok}
                </a>
              </div>
            )}
          </div>

          {/* Specialty */}
          {guide.primarySpecialty && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Specialty</h3>
              <Badge variant="secondary" className="text-sm">
                {guide.primarySpecialty}
              </Badge>
            </div>
          )}

          {/* Bio */}
          {guide.bio && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {guide.bio}
              </p>
            </div>
          )}

          {/* Presentation Video */}
          {videoId && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Presentation Video</h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Guide presentation video"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
