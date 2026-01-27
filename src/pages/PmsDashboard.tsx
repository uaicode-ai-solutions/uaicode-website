import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  FileText, 
  Palette,
  ChevronLeft,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Share2,
  Link,
  Mail,
  RefreshCw,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfetti } from "@/hooks/useConfetti";
import { BackToTopButton } from "@/components/blog/BackToTopButton";
import DashboardSkeleton from "@/components/planningmysaas/skeletons/DashboardSkeleton";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import { ReportProvider, useReportContext } from "@/contexts/ReportContext";
import { checkDataQuality } from "@/lib/dataQualityUtils";
import DataQualityBanner from "@/components/planningmysaas/dashboard/ui/DataQualityBanner";

// Section Components
import ReportHero from "@/components/planningmysaas/dashboard/sections/ReportHero";
import ExecutiveVerdict from "@/components/planningmysaas/dashboard/sections/ExecutiveVerdict";
import MarketOpportunitySection from "@/components/planningmysaas/dashboard/sections/MarketOpportunitySection";
import MarketTimingSection from "@/components/planningmysaas/dashboard/sections/MarketTimingSection";
import CustomerPainPointsSection from "@/components/planningmysaas/dashboard/sections/CustomerPainPointsSection";
import MacroTrendsSection from "@/components/planningmysaas/dashboard/sections/MacroTrendsSection";
import RiskFactorsSection from "@/components/planningmysaas/dashboard/sections/RiskFactorsSection";
import DemandSignalsSection from "@/components/planningmysaas/dashboard/sections/DemandSignalsSection";
import CompetitorsDifferentiationSection from "@/components/planningmysaas/dashboard/sections/CompetitorsDifferentiationSection";
import MarketingIntelligenceSection from "@/components/planningmysaas/dashboard/sections/MarketingIntelligenceSection";
import InvestmentSection from "@/components/planningmysaas/dashboard/sections/InvestmentSection";
import FinancialReturnSection from "@/components/planningmysaas/dashboard/sections/FinancialReturnSection";
import GrowthPotentialSection from "@/components/planningmysaas/dashboard/sections/GrowthPotentialSection";
import ComparableSuccessesSection from "@/components/planningmysaas/dashboard/sections/ComparableSuccessesSection";
import ExecutionPlanSection from "@/components/planningmysaas/dashboard/sections/ExecutionPlanSection";
import WhyUaicodeSection from "@/components/planningmysaas/dashboard/sections/WhyUaicodeSection";
import NextStepsSection from "@/components/planningmysaas/dashboard/sections/NextStepsSection";
import ScheduleCallSection from "@/components/planningmysaas/dashboard/sections/ScheduleCallSection";
import BrandAssetsTab from "@/components/planningmysaas/dashboard/sections/BrandAssetsTab";
import MarketingAnalysisTab from "@/components/planningmysaas/dashboard/sections/MarketingAnalysisTab";
import ShareReportDialog from "@/components/planningmysaas/dashboard/ShareReportDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRoles } from "@/hooks/useUserRoles";

const PmsDashboardContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // URL param is the wizard_id (tb_pms_wizard.id), not tb_pms_reports.id
  const { id: wizardId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("report");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Confetti for celebrating completed reports
  const { fireConfetti } = useConfetti();
  const hasShownConfetti = useRef(false);
  
  // Check if user is admin for showing Admin Panel link
  const { isAdmin, isContributor } = useUserRoles();
  
  // Get ALL data from context - unified loading state ensures no race conditions
  const { report, reportData, pmsReportId, isLoading, error } = useReportContext();
  
  // Check data quality (memoized to avoid recalculating on every render)
  const dataQualityIssues = useMemo(() => {
    return checkDataQuality(reportData);
  }, [reportData]);

  // Regenerate report handler - uses new orchestrator Edge Function
  const handleRegenerateReport = async () => {
    if (!wizardId) return;
    
    try {
      // 1. Invalidar cache para forçar dados frescos
      await queryClient.invalidateQueries({ 
        queryKey: ["pms-report-data", wizardId] 
      });
      
      // 2. Chamar nova Edge Function orquestradora (fire-and-forget)
      supabase.functions.invoke('pms-orchestrate-report', {
        body: { wizard_id: wizardId }
      });
      
      // 3. Navegar para loading page
      navigate(`/planningmysaas/loading/${wizardId}`);
    } catch (err) {
      console.error("Error triggering regeneration:", err);
    }
  };

  // report, isLoading, and error now come from ReportContext (unified loading)

  const handleLogout = () => {
    navigate("/planningmysaas/login");
    console.log("Logged out");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.log("Link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  // Redirect if no report found after loading
  useEffect(() => {
    if (!isLoading && !report && wizardId) {
      navigate("/planningmysaas/reports");
    }
  }, [isLoading, report, wizardId, navigate]);

  // Fire confetti when dashboard loads with a completed report (first time only)
  useEffect(() => {
    // Only fire once per mount and only for completed reports
    if (!hasShownConfetti.current && reportData?.status === "Created") {
      hasShownConfetti.current = true;
      // Small delay for UI to render
      setTimeout(() => {
        fireConfetti();
      }, 300);
    }
  }, [reportData?.status, fireConfetti]);

  // Get project name from database
  const projectName = report?.saas_name || "Untitled Project";

  const handleNewReport = () => {
    // Clear saved wizard data to ensure all fields are empty
    localStorage.removeItem("pms-wizard-data");
    // Navigate to wizard step 1
    navigate("/planningmysaas/wizard");
  };

  const handleScheduleCall = () => {
    const scheduleSection = document.getElementById('schedule-call');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show loading skeleton while fetching - wait for status to be "completed"
  if (isLoading || !reportData || reportData?.status !== "completed") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header skeleton */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-accent/10">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </header>

        {/* Tabs skeleton */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-5xl mx-auto flex justify-center py-2">
            <div className="flex gap-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        <main className="pt-32 pb-16">
          <div className="max-w-5xl mx-auto px-4 lg:px-6">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }


  // Normal dashboard layout for completed reports
  return (
    <div className="min-h-screen bg-background">
      {/* Header Premium */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back + Logo + Project Name */}
            <div className="flex items-center gap-3">
              {/* Back to Reports */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/planningmysaas/reports")}
                className="h-9 w-9 rounded-full border border-border/50 hover:bg-accent/10 hover:border-accent/30 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Logo + Brand */}
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/planningmysaas/reports")}
              >
                <img 
                  src={uaicodeLogo} 
                  alt="Uaicode" 
                  className="h-9 w-9 rounded-lg"
                />
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-foreground">
                    Planning<span className="text-accent">My</span>SaaS
                  </span>
                </div>
              </div>

              {/* Separator + Project Name */}
              <div className="hidden md:flex items-center gap-3">
                <div className="w-px h-6 bg-border/50" />
                <div>
                  <p className="text-sm font-medium text-foreground">{projectName}</p>
                  <p className="text-xs text-muted-foreground">Viability Report</p>
                </div>
              </div>
            </div>

            {/* Right side - Download Button + Share + User Dropdown */}
            <div className="flex items-center gap-2">
              {/* Regenerate Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateReport}
                className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Regenerate</span>
              </Button>

              <Button
                onClick={handleNewReport}
                className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Report</span>
              </Button>

              {/* Share Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-full border border-border/50 hover:bg-accent/10 hover:border-accent/30 transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 glass-premium border-accent/20"
                >
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                    <Link className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShareDialogOpen(true)} 
                    className="cursor-pointer"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:bg-accent/10 border border-border/50 rounded-full transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 glass-premium border-accent/20"
                >
                  <DropdownMenuItem 
                    onClick={() => navigate("/planningmysaas/profile")}
                    className="cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem 
                      onClick={() => navigate("/planningmysaas/admin")}
                      className="cursor-pointer"
                    >
                      <Shield className="h-4 w-4 mr-2 text-accent" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border/30" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-400 focus:text-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
        {/* Tabs */}
        <div className="sticky top-16 z-40 glass-premium border-b border-accent/10">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center">
              {[
                { id: "report", label: "Report", icon: FileText },
                // { id: "marketing", label: "Marketing", icon: TrendingUp }, // HIDDEN v1.0 - will return in future version
                // { id: "assets", label: "Branding", icon: Palette }, // HIDDEN v1.0 - will return in future version
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center justify-center gap-1.5 sm:gap-2.5 
                      px-3 sm:px-6 py-3 sm:py-4 
                      text-xs sm:text-sm font-medium 
                      transition-all duration-300 whitespace-nowrap relative
                      flex-1 sm:flex-initial
                      ${activeTab === tab.id
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-colors duration-300 ${
                      activeTab === tab.id ? "text-accent" : ""
                    }`} />
                    {tab.label}
                    
                    {/* Animated indicator for active tab */}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

          {/* Data Quality Banner */}
          {!bannerDismissed && dataQualityIssues.length > 0 && (isAdmin || isContributor) && (
            <div className="py-4">
              <DataQualityBanner
                issues={dataQualityIssues}
                onRegenerate={handleRegenerateReport}
                onDismiss={() => setBannerDismissed(true)}
              />
            </div>
          )}

          {/* Tab Content */}
          <div 
            key={activeTab} 
            className="py-6 animate-tab-enter"
          >
            {activeTab === "report" && (
                <div className="space-y-16">
                  <ReportHero projectName={projectName} onScheduleCall={handleScheduleCall} />
                  <ExecutiveVerdict />
                  <MarketOpportunitySection />
                  <DemandSignalsSection />
                  <MarketTimingSection />
                  <CustomerPainPointsSection />
                  <MacroTrendsSection />
                  <RiskFactorsSection />
                  <CompetitorsDifferentiationSection />
                  <MarketingIntelligenceSection />
                  <InvestmentSection />
                  <FinancialReturnSection />
                  <GrowthPotentialSection />
                  <ComparableSuccessesSection />
                  <ExecutionPlanSection />
                  <WhyUaicodeSection />
                  <NextStepsSection onScheduleCall={handleScheduleCall} onNewReport={handleNewReport} />
                  <ScheduleCallSection projectName={projectName} />
                </div>
            )}

            {/* HIDDEN v1.0 - Marketing tab will return in future version
            {activeTab === "marketing" && (
              <MarketingAnalysisTab 
                projectName={projectName}
                onScheduleCall={handleScheduleCall}
                onDownloadPDF={handleDownloadPDF}
              />
            )}
            */}

            {/* HIDDEN v1.0 - Branding tab will return in future version
            {activeTab === "assets" && (
              <BrandAssetsTab />
            )}
            */}

            {/* Footer spacing */}
            <div className="h-16" />
          </div>
        </div>
      </main>

      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Share Report Dialog */}
      <ShareReportDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        reportUrl={window.location.href}
        projectName={projectName}
      />
    </div>
  );
};

// Main component with ReportProvider wrapper
const PmsDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Redirect if no ID provided
  useEffect(() => {
    if (!id) {
      navigate("/planningmysaas/reports");
    }
  }, [id, navigate]);

  if (!id) return null;

  return (
    <ReportProvider wizardId={id}>
      <PmsDashboardContent />
    </ReportProvider>
  );
};

export default PmsDashboard;
