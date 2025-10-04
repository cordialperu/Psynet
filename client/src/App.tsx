import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import TherapyDetail from "@/pages/therapy-detail";
import HowItWorks from "@/pages/how-it-works";
import AdminLogin from "@/pages/admin/login";
import AdminRegister from "@/pages/admin/register";
import AdminDashboard from "@/pages/admin/dashboard";
import TherapyForm from "@/pages/admin/therapy-form";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/therapy/:slug" component={TherapyDetail} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/register" component={AdminRegister} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/therapies/new" component={TherapyForm} />
      <Route path="/admin/therapies/edit/:id" component={TherapyForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
