import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import HeroRoute from "./components/hero/HeroRoute";
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
import PmsAdmin from "./pages/PmsAdmin";
import PmsSharedReport from "./pages/PmsSharedReport";
import Booking from "./pages/Booking";
import HeroLogin from "./pages/hero/HeroLogin";
import HeroHome from "./pages/hero/HeroHome";
import HeroDash from "./pages/hero/HeroDash";
import HeroResetPassword from "./pages/hero/HeroResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
            <Route path="/booking" element={<Booking />} />
            <Route path="/planningmysaas" element={<PlanningMySaas />} />
            <Route path="/planningmysaas/login" element={<PmsLogin />} />
            <Route path="/planningmysaas/reset-password" element={<PmsResetPassword />} />
            <Route path="/planningmysaas/shared/:shareToken" element={<PmsSharedReport />} />
            
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
            <Route path="/planningmysaas/admin" element={
              <AdminRoute><PmsAdmin /></AdminRoute>
            } />
            
            {/* Hero Ecosystem routes */}
            <Route path="/hero" element={<HeroLogin />} />
            <Route path="/hero/reset-password" element={<HeroResetPassword />} />
            <Route path="/hero/home" element={
              <HeroRoute><HeroHome /></HeroRoute>
            } />
            <Route path="/hero/dash" element={
              <HeroRoute><HeroDash /></HeroRoute>
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
