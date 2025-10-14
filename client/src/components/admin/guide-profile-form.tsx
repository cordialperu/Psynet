import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Guide } from "@shared/schema";
import { Upload } from "lucide-react";
import { useState } from "react";
import { AutoTranslator } from "@/components/auto-translator";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  whatsapp: z.string().min(9, "WhatsApp must be at least 9 digits").regex(/^[+]?[\d\s-()]+$/, "Invalid WhatsApp format"),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  primarySpecialty: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface GuideProfileFormProps {
  guide: Guide;
}

export function GuideProfileForm({ guide }: GuideProfileFormProps) {
  const { toast } = useToast();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [presentationVideo, setPresentationVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isBioTranslated, setIsBioTranslated] = useState(true); // Start as true to allow saving
  const [originalBio, setOriginalBio] = useState(guide.bio || "");

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: guide.fullName || "",
      whatsapp: guide.whatsapp || "",
      instagram: guide.instagram || "",
      tiktok: guide.tiktok || "",
      primarySpecialty: guide.primarySpecialty || "",
      bio: guide.bio || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      return await apiRequest("PATCH", "/api/guides/profile", data);
    },
    onSuccess: () => {
      // Only invalidate the current user's queries, not master queries
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/therapies/my-therapies"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
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

  const handleFileUpload = async (file: File, type: "photo" | "video") => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${type === "video" ? "video" : "image"}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        const updateData = type === "photo" 
          ? { profilePhotoUrl: data.secure_url }
          : { presentationVideoUrl: data.secure_url };
        
        await apiRequest("PATCH", "/api/guides/profile", updateData);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        
        toast({
          title: "Upload successful",
          description: `Your ${type === "photo" ? "photo" : "video"} has been uploaded.`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (type === "photo") setProfilePhoto(null);
      if (type === "video") setPresentationVideo(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">Basic Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Full Name / Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-full-name" className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">WhatsApp Number *</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="+51 987 654 321" 
                        {...field} 
                        data-testid="input-whatsapp"
                        className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Instagram</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="@yourusername" 
                          {...field} 
                          data-testid="input-instagram"
                          className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">TikTok</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="@yourusername" 
                          {...field} 
                          data-testid="input-tiktok"
                          className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <FormField
                control={form.control}
                name="primarySpecialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Primary Specialty</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Ayahuasca Ceremonies, Plant Medicine" 
                        {...field} 
                        data-testid="input-specialty"
                        className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell people about your experience and approach..."
                        className="min-h-32 rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // If bio changed from original, require translation
                          if (e.target.value !== originalBio && e.target.value.length > 0) {
                            setIsBioTranslated(false);
                          } else if (e.target.value.length === 0) {
                            setIsBioTranslated(true); // Empty bio doesn't need translation
                          }
                        }}
                        data-testid="textarea-bio"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Auto Translator for Bio */}
              {form.watch("bio") && form.watch("bio") !== originalBio && !isBioTranslated && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <AutoTranslator
                    spanishTitle=""
                    spanishDescription={form.watch("bio") || ""}
                    onTranslationComplete={(translations) => {
                      form.setValue("bio", translations.description);
                      setOriginalBio(translations.description);
                      setIsBioTranslated(true);
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending || (!isBioTranslated && form.watch("bio") !== originalBio && form.watch("bio")?.length > 0)}
                  data-testid="button-save-profile"
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!isBioTranslated && form.watch("bio") !== originalBio ? "Please translate your bio before saving" : ""}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
                {!isBioTranslated && form.watch("bio") !== originalBio && form.watch("bio")?.length > 0 && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    ⚠️ Please translate your bio to English before saving (write in Spanish first)
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">Profile Photo</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Upload your profile photo (JPG or PNG)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guide.profilePhotoUrl && (
            <div className="aspect-square w-32 rounded-lg overflow-hidden">
              <img 
                src={guide.profilePhotoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setProfilePhoto(file);
              }}
              data-testid="input-profile-photo"
            />
            {profilePhoto && (
              <Button
                onClick={() => handleFileUpload(profilePhoto, "photo")}
                disabled={uploading}
                data-testid="button-upload-photo"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">Presentation Video</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Add a YouTube URL or upload a video file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guide.presentationVideoUrl && (
            <div className="w-full max-w-md">
              {guide.presentationVideoUrl.includes('youtube.com') || guide.presentationVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={guide.presentationVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full aspect-video rounded-lg"
                  allowFullScreen
                />
              ) : (
                <video
                  src={guide.presentationVideoUrl}
                  controls
                  className="w-full aspect-video rounded-lg"
                />
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">YouTube URL</label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  defaultValue={guide.presentationVideoUrl?.includes('youtube') || guide.presentationVideoUrl?.includes('youtu.be') ? guide.presentationVideoUrl : ''}
                  onBlur={async (e) => {
                    const url = e.target.value;
                    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                      try {
                        await apiRequest("PATCH", "/api/guides/profile", { presentationVideoUrl: url });
                        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                        toast({
                          title: "Video URL saved",
                          description: "Your YouTube video has been linked.",
                        });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: error instanceof Error ? error.message : "Failed to save video URL",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                  data-testid="input-youtube-url"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paste a YouTube link and press Enter or click outside to save
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or upload a file</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Upload Video File</label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPresentationVideo(file);
                  }}
                  data-testid="input-presentation-video"
                />
                {presentationVideo && (
                  <Button
                    onClick={() => handleFileUpload(presentationVideo, "video")}
                    disabled={uploading}
                    data-testid="button-upload-video"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Max file size: 50MB. Supported formats: MP4, WebM, MOV
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
