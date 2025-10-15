import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CountryProvider } from "@/contexts/country-context";
import { ProtectedRoute } from "@/components/protected-route";
import { useEffect } from "react";
import Home from "@/pages/home";
import HomeV2 from "@/pages/home-v2";
import HomePsychedelic from "@/pages/home-psychedelic";
import HomeNatural from "@/pages/home-natural";
import HomeElegant from "@/pages/home-elegant";
import HomeDirectory from "@/pages/home-directory";
import HomeProfessionals from "@/pages/home-professionals";
import HomeFinal from "@/pages/home-final";
import HomeApple from "@/pages/home-apple";
import HomeAppleV2 from "@/pages/home-apple-v2";
import HomeAppleV3 from "@/pages/home-apple-v3";
import Terms from "@/pages/terms";
import HomeSimple from "@/pages/home-simple";
import HomeMinimal from "@/pages/home-minimal";
import Explore from "@/pages/explore";
import TherapyDetail from "@/pages/therapy-detail";
import TherapyDetailNew from "@/pages/therapy-detail-new";
import HowItWorks from "@/pages/how-it-works";
import AdminLogin from "@/pages/admin/login";
import AdminRegister from "@/pages/admin/register";
import AdminDashboard from "@/pages/admin/dashboard";
import TherapyForm from "@/pages/admin/therapy-form";
import MasterLogin from "@/pages/admin/master-login";
import MasterDashboard from "@/pages/admin/master-dashboard";
import MasterDashboardV2 from "@/pages/admin/master-dashboard-v2";
import MasterTherapyEdit from "@/pages/admin/master-therapy-edit";
import GuidesList from "@/pages/admin/guides-list";
import AdminSettings from "@/pages/admin/admin-settings";
import GuiaDashboard from "@/pages/guia/dashboard";
import PaymentSuccess from "@/pages/payment-success";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeAppleV3} />
      <Route path="/minimal" component={HomeMinimal} />
      <Route path="/simple" component={HomeSimple} />
      <Route path="/v1" component={Home} />
      <Route path="/v2" component={HomeV2} />
      <Route path="/v3" component={HomePsychedelic} />
      <Route path="/v4" component={HomeNatural} />
      <Route path="/v5" component={HomeElegant} />
      <Route path="/v6" component={HomeDirectory} />
      <Route path="/v7" component={HomeProfessionals} />
      <Route path="/v8" component={HomeFinal} />
      <Route path="/v9" component={HomeAppleV2} />
      <Route path="/v10" component={HomeApple} />
      <Route path="/explore" component={Explore} />
      <Route path="/therapy/:slug" component={TherapyDetailNew} />
      <Route path="/therapy-old/:slug" component={TherapyDetail} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/terms" component={Terms} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/register" component={AdminRegister} />
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/therapies/new">
        <ProtectedRoute>
          <TherapyForm />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/therapies/edit/:id">
        <ProtectedRoute>
          <TherapyForm />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/master/login" component={MasterLogin} />
      <Route path="/admin/master/dashboard" component={MasterDashboardV2} />
      <Route path="/admin/master/dashboard/old" component={MasterDashboard} />
      <Route path="/admin/master/guides" component={GuidesList} />
      <Route path="/admin/master/settings" component={AdminSettings} />
      <Route path="/admin/master/therapies/edit/:id" component={MasterTherapyEdit} />
      <Route path="/guia/dashboard">
        <ProtectedRoute>
          <GuiaDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/guia/perfil">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/guia/ceremonias/nueva">
        <ProtectedRoute>
          <TherapyForm />
        </ProtectedRoute>
      </Route>
      <Route path="/guia/ceremonias/editar/:id">
        <ProtectedRoute>
          <TherapyForm />
        </ProtectedRoute>
      </Route>
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Log when App mounts
  useEffect(() => {
    console.log('App mounted successfully');
    console.log('Current route:', window.location.pathname);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="psynet-theme">
        <CountryProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CountryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
