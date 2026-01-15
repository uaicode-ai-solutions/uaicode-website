import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Download, 
  FileText, 
  Palette,
  ChevronLeft,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Share2,
  Link,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { BackToTopButton } from "@/components/blog/BackToTopButton";
import DashboardSkeleton from "@/components/planningmysaas/skeletons/DashboardSkeleton";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import { ReportProvider } from "@/contexts/ReportContext";
import { useReport } from "@/hooks/useReport";

// Section Components
import ReportHero from "@/components/planningmysaas/dashboard/sections/ReportHero";
import ExecutiveVerdict from "@/components/planningmysaas/dashboard/sections/ExecutiveVerdict";
import BusinessModelSection from "@/components/planningmysaas/dashboard/sections/BusinessModelSection";
import MarketOpportunitySection from "@/components/planningmysaas/dashboard/sections/MarketOpportunitySection";
import DemandValidationSection from "@/components/planningmysaas/dashboard/sections/DemandValidationSection";
import TimingAnalysisSection from "@/components/planningmysaas/dashboard/sections/TimingAnalysisSection";
import MarketBenchmarksSection from "@/components/planningmysaas/dashboard/sections/MarketBenchmarksSection";
import CompetitorsDifferentiationSection from "@/components/planningmysaas/dashboard/sections/CompetitorsDifferentiationSection";
import GoToMarketPreviewSection from "@/components/planningmysaas/dashboard/sections/GoToMarketPreviewSection";
import MarketingIntelligenceSection from "@/components/planningmysaas/dashboard/sections/MarketingIntelligenceSection";
import InvestmentSection from "@/components/planningmysaas/dashboard/sections/InvestmentSection";
import ResourceRequirementsSection from "@/components/planningmysaas/dashboard/sections/ResourceRequirementsSection";
import FinancialReturnSection from "@/components/planningmysaas/dashboard/sections/FinancialReturnSection";
import PivotScenariosSection from "@/components/planningmysaas/dashboard/sections/PivotScenariosSection";
import ExecutionPlanSection from "@/components/planningmysaas/dashboard/sections/ExecutionPlanSection";
import SuccessMetricsSection from "@/components/planningmysaas/dashboard/sections/SuccessMetricsSection";
import WhyUaicodeSection from "@/components/planningmysaas/dashboard/sections/WhyUaicodeSection";
import NextStepsSection from "@/components/planningmysaas/dashboard/sections/NextStepsSection";
import ScheduleCallSection from "@/components/planningmysaas/dashboard/sections/ScheduleCallSection";
import DirectContactSection from "@/components/planningmysaas/dashboard/sections/DirectContactSection";
import BrandAssetsTab from "@/components/planningmysaas/dashboard/sections/BrandAssetsTab";
import MarketingAnalysisTab from "@/components/planningmysaas/dashboard/sections/MarketingAnalysisTab";
import ShareReportDialog from "@/components/planningmysaas/dashboard/ShareReportDialog";
import { Skeleton } from "@/components/ui/skeleton";

const PmsDashboardContent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("report");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Use database data
  const { data: report, isLoading, error } = useReport(id);

  const handleLogout = () => {
    navigate("/planningmysaas/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Report link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  // Redirect if no report found after loading
  useEffect(() => {
    if (!isLoading && !report && id) {
      navigate("/planningmysaas/reports");
    }
  }, [isLoading, report, id, navigate]);

  // Get project name from database
  const projectName = report?.saas_name || "Untitled Project";

  const handleDownloadPDF = () => {
    console.log("Downloading Launch Plan PDF...");
  };

  const handleScheduleCall = () => {
    const scheduleSection = document.getElementById('schedule-call');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show loading skeleton while fetching
  if (isLoading) {
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

  // Show fullscreen generating animation if report is pending - NO navigation allowed
  if (report?.status === "pending") {
    return (
      <div className="fixed inset-0 z-[100] bg-background">
        <GeneratingReportSkeleton projectName={projectName} />
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
              <Button
                onClick={handleDownloadPDF}
                className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all duration-300"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download PDF</span>
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
                { id: "marketing", label: "Marketing", icon: TrendingUp },
                { id: "assets", label: "Branding", icon: Palette },
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

          {/* Tab Content */}
          <div 
            key={activeTab} 
            className="py-6 animate-tab-enter"
          >
            {activeTab === "report" && (
                <div className="space-y-16">
                  <ReportHero projectName={projectName} onScheduleCall={handleScheduleCall} />
                <ExecutiveVerdict />
                <BusinessModelSection />
                <MarketOpportunitySection />
                <DemandValidationSection />
                <TimingAnalysisSection />
                <MarketBenchmarksSection />
                <CompetitorsDifferentiationSection />
                <GoToMarketPreviewSection onNavigateToMarketing={() => setActiveTab("marketing")} />
                <MarketingIntelligenceSection onExploreMarketing={() => setActiveTab("marketing")} />
                <InvestmentSection />
                <ResourceRequirementsSection />
                <FinancialReturnSection />
                <PivotScenariosSection />
                <ExecutionPlanSection />
                <SuccessMetricsSection />
                <WhyUaicodeSection />
                <NextStepsSection onScheduleCall={handleScheduleCall} onDownloadPDF={handleDownloadPDF} />
                <ScheduleCallSection projectName={projectName} />
                <DirectContactSection />
                </div>
            )}

            {activeTab === "marketing" && (
              <MarketingAnalysisTab 
                projectName={projectName}
                onScheduleCall={handleScheduleCall}
                onDownloadPDF={handleDownloadPDF}
              />
            )}

            {activeTab === "assets" && (
              <BrandAssetsTab />
            )}

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
    <ReportProvider reportId={id}>
      <PmsDashboardContent />
    </ReportProvider>
  );
};

export default PmsDashboard;
