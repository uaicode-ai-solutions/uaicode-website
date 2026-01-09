import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReportById, getProjectDisplayName, StoredReport } from "@/lib/reportsStorage";
import { 
  Download, 
  FileText, 
  Palette,
  ChevronLeft,
  Menu,
  X,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { reportData } from "@/lib/reportMockData";

// New Section Components
import ReportHero from "@/components/planningmysaas/dashboard/sections/ReportHero";
import ExecutiveVerdict from "@/components/planningmysaas/dashboard/sections/ExecutiveVerdict";
import MarketOpportunitySection from "@/components/planningmysaas/dashboard/sections/MarketOpportunitySection";
import InvestmentSection from "@/components/planningmysaas/dashboard/sections/InvestmentSection";
import FinancialReturnSection from "@/components/planningmysaas/dashboard/sections/FinancialReturnSection";
import ExecutionPlanSection from "@/components/planningmysaas/dashboard/sections/ExecutionPlanSection";
import WhyUaicodeSection from "@/components/planningmysaas/dashboard/sections/WhyUaicodeSection";
import NextStepsSection from "@/components/planningmysaas/dashboard/sections/NextStepsSection";
import BrandAssetsTab from "@/components/planningmysaas/dashboard/sections/BrandAssetsTab";

const PmsDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("report");
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
  const projectName = report ? getProjectDisplayName(report) : reportData.projectName;

  const handleDownloadPDF = () => {
    console.log("Downloading Launch Plan PDF...");
  };

  const handleScheduleCall = () => {
    window.open(reportData.nextSteps.contact.calendly, '_blank');
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
              <span className="hidden sm:inline">Meus Relatórios</span>
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{projectName}</h1>
              <p className="text-xs text-muted-foreground">Relatório de Viabilidade</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          {/* Tabs */}
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md py-4 border-b border-border/30">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card/50 border border-border/30">
                <TabsTrigger value="report" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Relatório
                </TabsTrigger>
                <TabsTrigger value="assets" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Brand Assets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          {activeTab === "report" ? (
            <div className="py-8 space-y-24">
              {/* Report Hero */}
              <ReportHero 
                projectName={projectName}
                onScheduleCall={handleScheduleCall}
              />

              {/* Executive Verdict */}
              <ExecutiveVerdict />

              {/* Market Opportunity */}
              <MarketOpportunitySection />

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

              {/* Footer spacing */}
              <div className="h-20" />
            </div>
          ) : (
            <div className="py-8">
              <BrandAssetsTab />
              <div className="h-20" />
            </div>
          )}
        </div>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handleScheduleCall}
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg gap-2 h-12 px-6"
        >
          <Calendar className="h-5 w-5" />
          <span className="hidden sm:inline">Agendar Conversa</span>
        </Button>
      </div>
    </div>
  );
};

export default PmsDashboard;
