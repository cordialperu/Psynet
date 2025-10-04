import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Therapy } from "@shared/schema";
import { therapyTypes } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const therapySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.string().min(1, "Please select a therapy type"),
  price: z.string().optional(),
  currency: z.string().default("USD"),
  duration: z.string().optional(),
  location: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type TherapyFormData = z.infer<typeof therapySchema>;

export default function TherapyForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/therapies/edit/:id");
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const isEditing = !!params?.id;

  const { data: therapy, isLoading } = useQuery<Therapy>({
    queryKey: ["/api/therapies", params?.id],
    enabled: isEditing,
  });

  const form = useForm<TherapyFormData>({
    resolver: zodResolver(therapySchema),
    defaultValues: {
      title: therapy?.title || "",
      description: therapy?.description || "",
      type: therapy?.type || "",
      price: therapy?.price || "",
      currency: therapy?.currency || "USD",
      duration: therapy?.duration || "",
      location: therapy?.location || "",
      isPublished: therapy?.isPublished || false,
    },
  });

  // Update form when therapy data loads
  if (therapy && !isLoading) {
    form.reset({
      title: therapy.title,
      description: therapy.description || "",
      type: therapy.type,
      price: therapy.price || "",
      currency: therapy.currency || "USD",
      duration: therapy.duration || "",
      location: therapy.location || "",
      isPublished: therapy.isPublished || false,
    });

    if (therapy.availableDates && selectedDates.length === 0) {
      setSelectedDates(therapy.availableDates.map(d => new Date(d)));
    }
  }

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
        title: isEditing ? "Therapy updated" : "Therapy created",
        description: `Your therapy has been ${isEditing ? "updated" : "created"} successfully.`,
      });
      setLocation("/admin/dashboard");
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
    saveMutation.mutate({ ...data, availableDates });
  };

  const formatType = (type: string) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading therapy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </a>
          </Link>
          <h1 className="font-serif text-4xl font-bold">
            {isEditing ? "Edit Therapy" : "Create New Therapy"}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about your therapy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 3-Day Ayahuasca Retreat in Sacred Valley" 
                          {...field} 
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Therapy Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue placeholder="Select therapy type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {therapyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {formatType(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the therapy, what participants can expect, and any special preparations..."
                          className="min-h-32"
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Logistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="250" 
                            {...field} 
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-currency">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="PEN">PEN</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 3 days, 5 hours" 
                          {...field} 
                          data-testid="input-duration"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Cusco, Peru" 
                          {...field} 
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Dates</CardTitle>
                <CardDescription>Select the dates when this therapy is available</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                  data-testid="calendar-available-dates"
                />
                {selectedDates.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Publish Therapy</FormLabel>
                        <FormDescription>
                          Make this therapy visible to the public
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
              >
                {saveMutation.isPending ? "Saving..." : isEditing ? "Update Therapy" : "Create Therapy"}
              </Button>
              <Link href="/admin/dashboard">
                <a>
                  <Button type="button" variant="outline">Cancel</Button>
                </a>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
