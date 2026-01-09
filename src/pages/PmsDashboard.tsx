import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReportById, getProjectDisplayName, StoredReport } from "@/lib/reportsStorage";
import { 
  Download, 
  FileText, 
  Palette, 
  BarChart3, 
  Target, 
  Users, 
  DollarSign,
  Cpu,
  TrendingUp,
  Layout,
  MessageSquare,
  Image,
  Globe,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { projectInfoData } from "@/lib/dashboardMockData";

// Dashboard section components
import DashboardHero from "@/components/planningmysaas/dashboard/DashboardHero";
import DashboardExecutiveSummary from "@/components/planningmysaas/dashboard/ExecutiveSummary";
import DashboardMarketOpportunity from "@/components/planningmysaas/dashboard/MarketOpportunity";
import DashboardMarketAnalysis from "@/components/planningmysaas/dashboard/MarketAnalysis";
import DashboardCompetitiveAnalysis from "@/components/planningmysaas/dashboard/CompetitiveAnalysis";
import DashboardPricingIntelligence from "@/components/planningmysaas/dashboard/PricingIntelligence";
import DashboardInvestmentRecommendations from "@/components/planningmysaas/dashboard/InvestmentRecommendations";
import DashboardUnitEconomics from "@/components/planningmysaas/dashboard/UnitEconomics";
import DashboardMarketTrends from "@/components/planningmysaas/dashboard/MarketTrends";
import DashboardTechnicalFeasibility from "@/components/planningmysaas/dashboard/TechnicalFeasibility";
import DashboardTechnicalChallenges from "@/components/planningmysaas/dashboard/TechnicalChallenges";
import DashboardFinancialProjections from "@/components/planningmysaas/dashboard/FinancialProjections";
import DashboardROICharts from "@/components/planningmysaas/dashboard/ROICharts";
import DashboardUserJourney from "@/components/planningmysaas/dashboard/UserJourneyChart";
import DashboardEngagementLoops from "@/components/planningmysaas/dashboard/EngagementLoops";
import DashboardScreenMockups from "@/components/planningmysaas/dashboard/ScreenMockups";
import DashboardBrandCopyManual from "@/components/planningmysaas/dashboard/BrandCopyManual";
import DashboardBrandIdentityManual from "@/components/planningmysaas/dashboard/BrandIdentityManual";
import DashboardLogosSuggestions from "@/components/planningmysaas/dashboard/LogosSuggestions";
import DashboardLandingPagePreview from "@/components/planningmysaas/dashboard/LandingPagePreview";

const sections = [
  { id: "executive-summary", label: "Executive Summary", icon: FileText },
  { id: "market-opportunity", label: "Market Opportunity", icon: Target },
  { id: "market-analysis", label: "Market Analysis", icon: BarChart3 },
  { id: "competitive-analysis", label: "Competitive Analysis", icon: Users },
  { id: "pricing-intelligence", label: "Pricing Intelligence", icon: DollarSign },
  { id: "investment", label: "Investment Recommendations", icon: TrendingUp },
  { id: "unit-economics", label: "Unit Economics", icon: DollarSign },
  { id: "market-trends", label: "Market Trends", icon: TrendingUp },
  { id: "technical-feasibility", label: "Technical Feasibility", icon: Cpu },
  { id: "technical-challenges", label: "Technical Challenges", icon: Cpu },
  { id: "financial-projections", label: "Financial Projections", icon: BarChart3 },
  { id: "roi-charts", label: "ROI & Break-Even", icon: TrendingUp },
  { id: "user-journey", label: "User Journey", icon: Users },
  { id: "engagement-loops", label: "Engagement Loops", icon: Target },
  { id: "screen-mockups", label: "Screen Mockups", icon: Layout },
  { id: "brand-copy", label: "Brand Copy Manual", icon: MessageSquare },
  { id: "brand-identity", label: "Brand Identity", icon: Palette },
  { id: "logos", label: "Logo Suggestions", icon: Image },
  { id: "landing-page", label: "Landing Page", icon: Globe },
];

const PmsDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState("executive-summary");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [report, setReport] = useState<StoredReport | null>(null);

  // Load report by ID
  useEffect(() => {
    if (!id) {
      navigate("/planningmysaas/reports");
      return;
    }
    
    const loadedReport = getReportById(id);
    if (!loadedReport) {
      navigate("/planningmysaas/reports");
      return;
    }
    
    setReport(loadedReport);
  }, [id, navigate]);

  // Get project name from report or fallback to mock data
  const projectName = report ? getProjectDisplayName(report) : projectInfoData.projectName;

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));

      for (const section of sectionElements) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const handleDownloadPDF = () => {
    // PDF generation would go here
    console.log("Downloading Launch Plan PDF...");
  };

  const handleDownloadAssets = () => {
    // Assets download would go here
    console.log("Downloading brand assets...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/planningmysaas/reports")}
              className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/10"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">My Reports</span>
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{projectName}</h1>
              <p className="text-xs text-muted-foreground">Launch Plan Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAssets}
              className="hidden md:flex gap-2"
            >
              <Palette className="h-4 w-4" />
              Download Assets
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download Launch Plan</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <aside className={cn(
          "fixed left-0 top-16 bottom-0 w-64 bg-card/50 border-r border-border/50 transition-transform duration-300 z-40",
          "hidden lg:block",
          !sidebarOpen && "-translate-x-full"
        )}>
          <ScrollArea className="h-full py-4">
            <nav className="px-3 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                      "hover:bg-accent/10 hover:text-accent",
                      isActive 
                        ? "bg-accent/15 text-accent font-medium border-l-2 border-accent" 
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 lg:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border/50 overflow-y-auto">
              <nav className="p-4 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                        isActive 
                          ? "bg-accent/15 text-accent font-medium" 
                          : "text-muted-foreground hover:bg-accent/10"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          "lg:ml-64"
        )}>
          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-16">
            {/* Project Hero Section */}
            <section id="project-overview">
              <DashboardHero />
            </section>

            <section id="executive-summary">
              <DashboardExecutiveSummary />
            </section>

            <section id="market-opportunity">
              <DashboardMarketOpportunity />
            </section>

            <section id="market-analysis">
              <DashboardMarketAnalysis />
            </section>

            <section id="competitive-analysis">
              <DashboardCompetitiveAnalysis />
            </section>

            <section id="pricing-intelligence">
              <DashboardPricingIntelligence />
            </section>

            <section id="investment">
              <DashboardInvestmentRecommendations />
            </section>

            <section id="unit-economics">
              <DashboardUnitEconomics />
            </section>

            <section id="market-trends">
              <DashboardMarketTrends />
            </section>

            <section id="technical-feasibility">
              <DashboardTechnicalFeasibility />
            </section>

            <section id="technical-challenges">
              <DashboardTechnicalChallenges />
            </section>

            <section id="financial-projections">
              <DashboardFinancialProjections />
            </section>

            <section id="roi-charts">
              <DashboardROICharts />
            </section>

            <section id="user-journey">
              <DashboardUserJourney />
            </section>

            <section id="engagement-loops">
              <DashboardEngagementLoops />
            </section>

            <section id="screen-mockups">
              <DashboardScreenMockups />
            </section>

            <section id="brand-copy">
              <DashboardBrandCopyManual />
            </section>

            <section id="brand-identity">
              <DashboardBrandIdentityManual />
            </section>

            <section id="logos">
              <DashboardLogosSuggestions />
            </section>

            <section id="landing-page">
              <DashboardLandingPagePreview />
            </section>

            {/* Footer spacing */}
            <div className="h-20" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PmsDashboard;
