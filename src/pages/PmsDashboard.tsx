import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReportById, getReports, getProjectDisplayName, StoredReport } from "@/lib/reportsStorage";
import { 
  Download, 
  FileText, 
  Palette,
  ChevronLeft,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reportData } from "@/lib/reportMockData";

// Section Components
import ReportHero from "@/components/planningmysaas/dashboard/sections/ReportHero";
import ExecutiveVerdict from "@/components/planningmysaas/dashboard/sections/ExecutiveVerdict";
import MarketOpportunitySection from "@/components/planningmysaas/dashboard/sections/MarketOpportunitySection";
import CompetitorsDifferentiationSection from "@/components/planningmysaas/dashboard/sections/CompetitorsDifferentiationSection";
import MarketingIntelligenceSection from "@/components/planningmysaas/dashboard/sections/MarketingIntelligenceSection";
import InvestmentSection from "@/components/planningmysaas/dashboard/sections/InvestmentSection";
import FinancialReturnSection from "@/components/planningmysaas/dashboard/sections/FinancialReturnSection";
import ExecutionPlanSection from "@/components/planningmysaas/dashboard/sections/ExecutionPlanSection";
import WhyUaicodeSection from "@/components/planningmysaas/dashboard/sections/WhyUaicodeSection";
import NextStepsSection from "@/components/planningmysaas/dashboard/sections/NextStepsSection";
import ScheduleCallSection from "@/components/planningmysaas/dashboard/sections/ScheduleCallSection";
import DirectContactSection from "@/components/planningmysaas/dashboard/sections/DirectContactSection";
import BrandAssetsTab from "@/components/planningmysaas/dashboard/sections/BrandAssetsTab";
import MarketingAnalysisTab from "@/components/planningmysaas/dashboard/sections/MarketingAnalysisTab";

const PmsDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("report");
  const [report, setReport] = useState<StoredReport | null>(null);
  const [reportsCount, setReportsCount] = useState(0);

  // Load reports count
  useEffect(() => {
    setReportsCount(getReports().length);
  }, []);

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
  const projectName = report ? getProjectDisplayName(report) : reportData.projectName;

  const handleDownloadPDF = () => {
    console.log("Downloading Launch Plan PDF...");
  };

  const handleScheduleCall = () => {
    const scheduleSection = document.getElementById('schedule-call');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate("/planningmysaas/reports")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  My Reports
                </p>
                <p className="text-xs text-muted-foreground">
                  {reportsCount} {reportsCount === 1 ? 'report' : 'reports'}
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-base font-bold text-foreground">{projectName}</h1>
              <p className="text-xs text-muted-foreground">Viability Report</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground h-8"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-sm">Download PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          {/* Tabs */}
          <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-md py-3 border-b border-border/30">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-card/50 border border-border/30 h-9">
                <TabsTrigger value="report" className="gap-1.5 text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  Report
                </TabsTrigger>
                <TabsTrigger value="marketing" className="gap-1.5 text-sm">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Marketing
                </TabsTrigger>
                <TabsTrigger value="assets" className="gap-1.5 text-sm">
                  <Palette className="h-3.5 w-3.5" />
                  Brand Assets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          {activeTab === "report" ? (
            <div className="py-6 space-y-16">
              {/* Report Hero */}
              <ReportHero 
                projectName={projectName}
                onScheduleCall={handleScheduleCall}
              />

              {/* Executive Verdict */}
              <ExecutiveVerdict />

              {/* Market Opportunity */}
              <MarketOpportunitySection />

              {/* Competitors & Differentiation */}
              <CompetitorsDifferentiationSection />

              {/* Marketing Intelligence */}
              <MarketingIntelligenceSection onExploreMarketing={() => setActiveTab("marketing")} />

              {/* Investment */}
              <InvestmentSection />

              {/* Financial Return */}
              <FinancialReturnSection />

              {/* Execution Plan */}
              <ExecutionPlanSection />

              {/* Why Uaicode */}
              <WhyUaicodeSection />

              {/* Next Steps */}
              <NextStepsSection 
                onScheduleCall={handleScheduleCall}
                onDownloadPDF={handleDownloadPDF}
              />

              {/* Schedule Call Section */}
              <ScheduleCallSection projectName={projectName} />

              {/* Direct Contact Section */}
              <DirectContactSection />

              {/* Footer spacing */}
              <div className="h-16" />
            </div>
          ) : activeTab === "marketing" ? (
            <div className="py-6">
              <MarketingAnalysisTab 
                projectName={projectName}
                onScheduleCall={handleScheduleCall}
                onDownloadPDF={handleDownloadPDF}
              />
              <div className="h-16" />
            </div>
          ) : (
            <div className="py-6">
              <BrandAssetsTab />
              <div className="h-16" />
            </div>
          )}
        </div>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={handleScheduleCall}
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg gap-2 h-10 px-4"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Schedule a Call</span>
        </Button>
      </div>
    </div>
  );
};

export default PmsDashboard;
