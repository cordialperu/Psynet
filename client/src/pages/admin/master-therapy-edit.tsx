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
import { ArrowLeft, Shield } from "lucide-react";
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
  videoUrl: z.string().optional(),
  whatsappNumber: z.string().optional(),
  inventory: z.number().optional(),
  shippingOptions: z.any().optional(),
  specificFields: z.any().optional(),
  published: z.boolean().default(false),
  approvalStatus: z.string().optional(),
});

type TherapyFormData = z.infer<typeof therapySchema>;

export default function MasterTherapyEdit() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/master/therapies/edit/:id");
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ceremonias");

  const therapyId = params?.id;

  // Check if master session exists
  useEffect(() => {
    const isMaster = localStorage.getItem("isMaster");
    const sessionId = localStorage.getItem("sessionId");
    
    if (!isMaster || !sessionId) {
      setLocation("/admin/master/login");
    }
  }, [setLocation]);

  const { data: therapy, isLoading } = useQuery<Therapy>({
    queryKey: [`/api/master/therapies/${therapyId}`],
    enabled: !!therapyId,
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
      whatsappNumber: "",
      inventory: undefined,
      shippingOptions: undefined,
      specificFields: undefined,
      published: false,
      approvalStatus: "pending",
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
        whatsappNumber: therapy.whatsappNumber || "",
        inventory: therapy.inventory || undefined,
        shippingOptions: therapy.shippingOptions || undefined,
        specificFields: therapy.specificFields || undefined,
        published: therapy.published || false,
        approvalStatus: therapy.approvalStatus || "pending",
      });

      if (therapy.category) {
        setSelectedCategory(therapy.category);
      }

      if (therapy.availableDates && therapy.availableDates.length > 0) {
        // Parse dates correctly - they come as strings "YYYY-MM-DD"
        const parsedDates = therapy.availableDates
          .map(dateStr => {
            try {
              // Parse the date string
              const [year, month, day] = dateStr.split('-').map(Number);
              return new Date(year, month - 1, day); // month is 0-indexed
            } catch (error) {
              console.error("Error parsing date:", dateStr, error);
              return null;
            }
          })
          .filter((date): date is Date => date !== null && !isNaN(date.getTime()));
        
        setSelectedDates(parsedDates);
      }
    }
  }, [therapy, isLoading, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: TherapyFormData & { availableDates: string[] }) => {
      const response = await apiRequest("PATCH", `/api/master/therapies/${therapyId}`, data);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/master/therapies"] });
      queryClient.invalidateQueries({ queryKey: [`/api/master/therapies/${therapyId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/therapies/published"] });
      queryClient.invalidateQueries({ queryKey: ["/api/therapies/featured"] });
      toast({
        title: "Listing updated",
        description: "Changes have been saved successfully.",
      });
      setLocation("/admin/master/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TherapyFormData) => {
    console.log("🔵 Form submitted with data:", data);
    const availableDates = selectedDates.map(date => format(date, 'yyyy-MM-dd'));
    const payload = { ...data, availableDates };
    console.log("🔵 Payload to send:", payload);
    saveMutation.mutate(payload);
  };

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Listing not found</p>
          <Link href="/admin/master/dashboard">
            <a>
              <Button className="mt-4">Back to Dashboard</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Master Edition</h1>
              <p className="text-xs text-gray-400">Super Admin Panel</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/admin/master/dashboard">
            <a className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </a>
          </Link>
          <h1 className="font-serif text-4xl font-bold text-white">Edit Listing</h1>
        </div>

        {/* Guide Info Card */}
        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Guide Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {therapy.guidePhotoUrl && (
                <img
                  src={therapy.guidePhotoUrl}
                  alt={therapy.guideName || ""}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-white">{therapy.guideName || "No name"}</p>
                <p className="text-sm text-gray-400">ID: {therapy.guideId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription className="text-gray-400">Listing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selector de Categoría */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Category *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
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
                      <FormDescription className="text-gray-400">
                        Listing category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Título */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3-Day Ayahuasca Retreat" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Status and Publication</CardTitle>
                <CardDescription className="text-gray-400">Approval and visibility control (Super Admin only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="approvalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Approval Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">⏳ Pending (Under Review)</SelectItem>
                          <SelectItem value="approved">✅ Approved</SelectItem>
                          <SelectItem value="rejected">❌ Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400">
                        Change the approval status of this listing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-200">Publish Listing</FormLabel>
                        <FormDescription className="text-gray-400">
                          Control if this listing is visible to the public
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/admin/master/dashboard">
                <a>
                  <Button type="button" variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">Cancel</Button>
                </a>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
