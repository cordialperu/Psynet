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

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
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

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: guide.fullName || "",
      primarySpecialty: guide.primarySpecialty || "",
      bio: guide.bio || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      return await apiRequest("PATCH", "/api/guides/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
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
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-full-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primarySpecialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Specialty</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Ayahuasca Ceremonies, Plant Medicine" 
                        {...field} 
                        data-testid="input-specialty"
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
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell people about your experience and approach..."
                        className="min-h-32"
                        {...field}
                        data-testid="textarea-bio"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload your profile photo (JPG or PNG)</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Presentation Video</CardTitle>
          <CardDescription>Upload a video introducing yourself and your practice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guide.presentationVideoUrl && (
            <video
              src={guide.presentationVideoUrl}
              controls
              className="w-full max-w-md aspect-video rounded-lg"
            />
          )}
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
        </CardContent>
      </Card>
    </div>
  );
}
