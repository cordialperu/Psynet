import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormDescription } from "@/components/ui/form";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
}

export function VideoUploadField({ value, onChange, placeholder, description }: VideoUploadFieldProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        onChange(data.secure_url);
        toast({
          title: "Upload successful",
          description: "Your video has been uploaded.",
        });
        setSelectedFile(null);
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">YouTube URL</label>
        <Input
          type="url"
          value={value?.includes('youtube') || value?.includes('youtu.be') ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "https://www.youtube.com/watch?v=..."}
        />
        {description && (
          <FormDescription className="mt-1">
            {description}
          </FormDescription>
        )}
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
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />
          {selectedFile && (
            <Button
              type="button"
              onClick={() => handleFileUpload(selectedFile)}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
        <FormDescription className="mt-1">
          Max 50MB. Formats: MP4, WebM, MOV. Max 60 seconds recommended.
        </FormDescription>
      </div>

      {value && !value.includes('youtube') && !value.includes('youtu.be') && (
        <div className="mt-2">
          <video
            src={value}
            controls
            className="w-full max-w-md aspect-video rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
