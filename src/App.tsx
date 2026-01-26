import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Newsletter from "./pages/Newsletter";
import BlogPost from "./pages/BlogPost";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PlanningMySaas from "./pages/PlanningMySaas";
import PmsLogin from "./pages/PmsLogin";
import PmsResetPassword from "./pages/PmsResetPassword";
import PmsWizard from "./pages/PmsWizard";
import PmsLoading from "./pages/PmsLoading";
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
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/planningmysaas" element={<PlanningMySaas />} />
            <Route path="/planningmysaas/login" element={<PmsLogin />} />
            <Route path="/planningmysaas/reset-password" element={<PmsResetPassword />} />
            
            {/* Protected routes */}
            <Route path="/planningmysaas/wizard" element={
              <ProtectedRoute><PmsWizard /></ProtectedRoute>
            } />
            <Route path="/planningmysaas/loading/:id" element={
              <ProtectedRoute><PmsLoading /></ProtectedRoute>
            } />
            <Route path="/planningmysaas/reports" element={
              <ProtectedRoute><PmsReports /></ProtectedRoute>
            } />
            <Route path="/planningmysaas/dashboard/:id" element={
              <ProtectedRoute><PmsDashboard /></ProtectedRoute>
            } />
            <Route path="/planningmysaas/profile" element={
              <ProtectedRoute><PmsProfile /></ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
