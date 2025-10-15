import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  whatsapp: z.string()
    .min(9, "WhatsApp must be at least 9 digits")
    .regex(/^[+]?[\d\s-()]+$/, "Invalid WhatsApp format"),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.instagram || data.tiktok, {
  message: "You must provide at least Instagram or TikTok",
  path: ["instagram"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function AdminRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      instagram: "",
      tiktok: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword, ...registerData } = data;
      return await apiRequest("POST", "/api/auth/register", registerData);
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "You can now log in to your account.",
      });
      setLocation("/admin/login");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300 px-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl transition-colors duration-300">
        <CardHeader className="text-center space-y-2 pt-8 pb-6">
          <div className="text-5xl mb-2">🌿</div>
          <CardTitle className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white transition-colors duration-300">Guide Register</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Create an account to publish your ceremonies, therapies, products and events
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        id="full-name"
                        placeholder="John Doe" 
                        {...field} 
                        data-testid="input-full-name"
                        className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Email *</FormLabel>
                    <FormControl>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="your@email.com" 
                        {...field} 
                        data-testid="input-email"
                        autoComplete="email"
                        className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                      />
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
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">WhatsApp *</FormLabel>
                    <FormControl>
                      <Input 
                        id="whatsapp"
                        type="tel" 
                        placeholder="+51 987 654 321" 
                        {...field} 
                        data-testid="input-whatsapp"
                        autoComplete="tel"
                        className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Social Media * (at least one required)</p>
                
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Instagram</FormLabel>
                      <FormControl>
                        <Input 
                          id="instagram"
                          placeholder="@yourusername" 
                          {...field} 
                          data-testid="input-instagram"
                          autoComplete="off"
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
                          id="tiktok"
                          placeholder="@yourusername" 
                          {...field} 
                          data-testid="input-tiktok"
                          autoComplete="off"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Password *</FormLabel>
                    <FormControl>
                      <Input 
                        id="password"
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        data-testid="input-password"
                        autoComplete="new-password"
                        className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Confirm Password *</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        data-testid="input-confirm-password"
                        className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl py-6 text-base font-medium transition-colors duration-300" 
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Already have an account?{" "}
              <Link href="/admin/login" className="text-gray-900 dark:text-white hover:underline font-medium transition-colors duration-300" data-testid="link-login">
                Sign in here
              </Link>
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
