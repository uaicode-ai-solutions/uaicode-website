import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Newsletter from "./pages/Newsletter";
import BlogPost from "./pages/BlogPost";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PlanningMySaas from "./pages/PlanningMySaas";
import PmsLogin from "./pages/PmsLogin";
import PmsWizard from "./pages/PmsWizard";
import PmsReports from "./pages/PmsReports";
import PmsDashboard from "./pages/PmsDashboard";
import PmsProfile from "./pages/PmsProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/planningmysaas" element={<PlanningMySaas />} />
          <Route path="/planningmysaas/login" element={<PmsLogin />} />
          <Route path="/planningmysaas/wizard" element={<PmsWizard />} />
          <Route path="/planningmysaas/reports" element={<PmsReports />} />
          <Route path="/planningmysaas/dashboard/:id" element={<PmsDashboard />} />
          <Route path="/planningmysaas/profile" element={<PmsProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
