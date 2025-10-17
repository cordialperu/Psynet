import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Therapy } from "@shared/schema";
import { categories } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DynamicCategoryForm } from "@/components/forms/dynamic-category-form";

const therapySchema = z.object({
  category: z.string().min(1, "Select a category"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.string().min(1, "Select a type"),
  basePrice: z.string().optional(),
  price: z.string().optional(),
  platformFee: z.string().optional(),
  currency: z.string().default("USD"),
  duration: z.string().optional(),
  location: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  videoUrl: z.string()
    .min(1, "YouTube video is required")
    .url("Must be a valid URL")
    .refine((url) => url.includes("youtube.com") || url.includes("youtu.be"), {
      message: "Must be a valid YouTube URL",
    }),
  inventory: z.number().optional(),
  isPublished: z.boolean().default(false),
});

type TherapyFormData = z.infer<typeof therapySchema>;

interface TimeSlot {
  date: string;
  times: string[];
}

export default function TherapyForm() {
  const [, setLocation] = useLocation();
  const [, adminParams] = useRoute("/admin/therapies/edit/:id");
  const [, guiaParams] = useRoute("/guia/ceremonias/editar/:id");
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<TimeSlot[]>([]);
  const [fixedTime, setFixedTime] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ceremonias");

  // Support both admin and guia routes
  const params = adminParams || guiaParams;
  const isEditing = !!params?.id;

  const { data: therapy, isLoading } = useQuery<Therapy>({
    queryKey: [`/api/therapies/${params?.id}`],
    enabled: isEditing,
  });

  const form = useForm<TherapyFormData>({
    resolver: zodResolver(therapySchema),
    defaultValues: {
      category: "ceremonias",
      title: "",
      description: "",
      type: "",
      basePrice: "",
      price: "",
      platformFee: "",
      currency: "USD",
      duration: "",
      location: "",
      googleMapsUrl: "",
      videoUrl: "",
      inventory: undefined,
      isPublished: false,
    },
  });

  // Update form when therapy data loads
  useEffect(() => {
    if (therapy && !isLoading) {
      form.reset({
        category: therapy.category || "ceremonias",
        title: therapy.title,
        description: therapy.description || "",
        type: therapy.type,
        basePrice: therapy.basePrice || "",
        price: therapy.price || "",
        platformFee: therapy.platformFee || "",
        currency: therapy.currency || "USD",
        duration: therapy.duration || "",
        location: therapy.location || "",
        googleMapsUrl: therapy.googleMapsUrl || "",
        videoUrl: therapy.videoUrl || "",
        inventory: therapy.inventory || undefined,
        isPublished: therapy.published || false,
      });

      if (therapy.category) {
        setSelectedCategory(therapy.category);
      }

      if (therapy.availableDates && selectedDates.length === 0) {
        setSelectedDates(therapy.availableDates.map(d => new Date(d)));
      }

      if (therapy.availableTimes && selectedTimes.length === 0) {
        setSelectedTimes(therapy.availableTimes);
      }

      if (therapy.fixedTime && !fixedTime) {
        setFixedTime(therapy.fixedTime);
      }
    }
  }, [therapy, isLoading]);

  const saveMutation = useMutation({
    mutationFn: async (data: TherapyFormData & { availableDates: string[] }) => {
      if (isEditing) {
        return await apiRequest("PATCH", `/api/therapies/${params.id}`, data);
      } else {
        return await apiRequest("POST", "/api/therapies", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/therapies/my-therapies"] });
      toast({
        title: isEditing ? "Listing updated" : "Listing created",
        description: `Your listing has been ${isEditing ? "updated" : "created"} successfully.`,
      });
      setLocation("/guia/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TherapyFormData) => {
    const availableDates = selectedDates.map(date => format(date, 'yyyy-MM-dd'));
    
    // Preparar datos adicionales según categoría
    const additionalData: any = { availableDates };
    
    // Solo para terapias: agregar availableTimes si hay
    if (selectedCategory === 'terapias' && selectedTimes.length > 0) {
      additionalData.availableTimes = selectedTimes;
    }
    
    // Solo para eventos: agregar fixedTime si hay
    if (selectedCategory === 'eventos' && fixedTime) {
      additionalData.fixedTime = fixedTime;
    }
    
    saveMutation.mutate({ ...data, ...additionalData });
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 mt-4">
          <Link href="/guia/dashboard" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors duration-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {isEditing ? "Edit Listing" : "New Listing"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
            Create your ceremony, therapy, product, event or medicine
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">Basic Information</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Essential details of your listing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Category *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Choose the category that best describes your listing. Write content in Spanish, it will be auto-translated.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Escribe en español - Se auto-traducirá al inglés" 
                          {...field} 
                          data-testid="input-title"
                          className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Formulario Dinámico según Categoría */}
                <DynamicCategoryForm
                  category={selectedCategory}
                  form={form}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  selectedTimes={selectedTimes}
                  setSelectedTimes={setSelectedTimes}
                  fixedTime={fixedTime}
                  setFixedTime={setFixedTime}
                />
              </CardContent>
            </Card>


            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-colors duration-300">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Publish Listing</FormLabel>
                        <FormDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          Make this listing visible to the public
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-published"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                data-testid="button-save-therapy"
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 rounded-xl"
              >
                {saveMutation.isPending ? "Saving..." : isEditing ? "Update Listing" : "Create Listing"}
              </Button>
              <Link href="/guia/dashboard">
                <Button type="button" variant="outline" className="rounded-xl border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">Cancel</Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
