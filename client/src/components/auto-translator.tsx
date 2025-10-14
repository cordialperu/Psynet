import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Loader2, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AutoTranslatorProps {
  spanishTitle: string;
  spanishDescription: string;
  spanishLocation?: string;
  spanishDuration?: string;
  onTranslationComplete: (translations: {
    title: string;
    description: string;
    location?: string;
    duration?: string;
  }) => void;
}

export function AutoTranslator({
  spanishTitle,
  spanishDescription,
  spanishLocation,
  spanishDuration,
  onTranslationComplete
}: AutoTranslatorProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<{
    title: string;
    description: string;
    location?: string;
    duration?: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Simple translation function using Google Translate API or similar
  const translateText = async (text: string): Promise<string> => {
    // For now, using a simple translation API
    // In production, you'd use Google Translate API, DeepL, or similar
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`
      );
      const data = await response.json();
      return data.responseData.translatedText || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original if translation fails
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    
    try {
      // Translate all fields in parallel
      const [translatedTitle, translatedDescription, translatedLocation, translatedDuration] = await Promise.all([
        translateText(spanishTitle),
        translateText(spanishDescription),
        spanishLocation ? translateText(spanishLocation) : Promise.resolve(undefined),
        spanishDuration ? translateText(spanishDuration) : Promise.resolve(undefined),
      ]);

      const result = {
        title: translatedTitle,
        description: translatedDescription,
        location: translatedLocation,
        duration: translatedDuration,
      };

      setTranslations(result);
      setShowPreview(true);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleApplyTranslation = () => {
    if (translations) {
      onTranslationComplete(translations);
      setShowPreview(false);
    }
  };

  const handleEditTranslation = (field: 'title' | 'description' | 'location' | 'duration', value: string) => {
    if (translations) {
      setTranslations({
        ...translations,
        [field]: value,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Translation Button */}
      {!showPreview && (
        <Button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating || !spanishTitle || !spanishDescription}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Translating to English...
            </>
          ) : (
            <>
              <Languages className="w-4 h-4 mr-2" />
              Translate to English
            </>
          )}
        </Button>
      )}

      {/* Translation Preview */}
      {showPreview && translations && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              English Translation Preview
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review and edit the translation before applying
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Translated Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Title (English)
              </label>
              <Input
                value={translations.title}
                onChange={(e) => handleEditTranslation('title', e.target.value)}
                className="bg-white dark:bg-gray-800"
              />
            </div>

            {/* Translated Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Description (English)
              </label>
              <Textarea
                value={translations.description}
                onChange={(e) => handleEditTranslation('description', e.target.value)}
                className="min-h-32 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Translated Location */}
            {translations.location && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Location (English)
                </label>
                <Input
                  value={translations.location}
                  onChange={(e) => handleEditTranslation('location', e.target.value)}
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            )}

            {/* Translated Duration */}
            {translations.duration && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Duration (English)
                </label>
                <Input
                  value={translations.duration}
                  onChange={(e) => handleEditTranslation('duration', e.target.value)}
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleApplyTranslation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Translation
              </Button>
              <Button
                type="button"
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helper Text */}
      {!showPreview && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> Write your content in Spanish and it will be automatically translated to English before publishing.
          </p>
        </div>
      )}
    </div>
  );
}
