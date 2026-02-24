import { useState, useRef, useEffect, useMemo } from "react";
import { 
  FileText, Briefcase, Rocket, ArrowRight, ChevronDown, ChevronUp,
  TrendingUp, Target, AlertTriangle, DollarSign, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportProvider, useReportContext } from "@/contexts/ReportContext";
import uaicodeLogo from "@/assets/uaicode-logo.png";

// Section Components
import ReportHero from "@/components/planningmysaas/dashboard/sections/ReportHero";
import ExecutiveVerdict from "@/components/planningmysaas/dashboard/sections/ExecutiveVerdict";
import MarketOpportunitySection from "@/components/planningmysaas/dashboard/sections/MarketOpportunitySection";
import DemandSignalsSection from "@/components/planningmysaas/dashboard/sections/DemandSignalsSection";
import CompetitorsDifferentiationSection from "@/components/planningmysaas/dashboard/sections/CompetitorsDifferentiationSection";
import InvestmentSection from "@/components/planningmysaas/dashboard/sections/InvestmentSection";
import FinancialReturnSection from "@/components/planningmysaas/dashboard/sections/FinancialReturnSection";
import GrowthPotentialSection from "@/components/planningmysaas/dashboard/sections/GrowthPotentialSection";
import WhyUaicodeSection from "@/components/planningmysaas/dashboard/sections/WhyUaicodeSection";
import NextStepsSection from "@/components/planningmysaas/dashboard/sections/NextStepsSection";
import BusinessPlanTab from "@/components/planningmysaas/dashboard/sections/BusinessPlanTab";
import ExecutiveSummaryTab from "@/components/planningmysaas/dashboard/sections/ExecutiveSummaryTab";
import DashboardSkeleton from "@/components/planningmysaas/skeletons/DashboardSkeleton";

import { HeroScoreSection, OpportunitySection, safeNumber } from "@/types/report";
import { getSectionInvestment, getDiscountStrategy } from "@/lib/sectionInvestmentUtils";

interface PmsDashboardCloserProps {
  wizardId: string;
  onGoToClosing: () => void;
}

const DashboardContent = ({ onGoToClosing }: { onGoToClosing: () => void }) => {
  const { report, reportData, isLoading } = useReportContext();
  const [activeTab, setActiveTab] = useState("executive");

  const projectName = report?.saas_name || "Untitled Project";

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  if (isLoading || !reportData) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-5xl mx-auto px-4">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const handleScheduleCall = () => {
    onGoToClosing();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Presenter Header - Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <img src={uaicodeLogo} alt="Uaicode" className="h-8 w-8 rounded-lg" />
              <span className="text-base font-bold text-foreground">
                {projectName}
              </span>
              <Badge variant="outline" className="border-accent/30 text-accent text-xs hidden sm:flex">
                Viability Analysis
              </Badge>
            </div>

            <Button
              onClick={onGoToClosing}
              size="sm"
              className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
            >
              Close the Deal
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-14 z-40 glass-premium border-b border-accent/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            {[
              { id: "executive", label: "Executive Summary", icon: Award },
              { id: "deepdive", label: "Deep Dive", icon: FileText },
              { id: "investment", label: "Investment", icon: DollarSign },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap relative flex-1 sm:flex-initial ${
                    activeTab === tab.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${activeTab === tab.id ? "text-accent" : ""}`} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="pt-[7.5rem]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div key={activeTab} className="py-6 animate-tab-enter">
            {activeTab === "executive" && (
              <ExecutiveSummaryTab
                projectName={projectName}
                onViewInvestment={() => setActiveTab("investment")}
              />
            )}

            {activeTab === "deepdive" && (
              <div className="space-y-16">
                <ReportHero projectName={projectName} onScheduleCall={handleScheduleCall} />
                <ExecutiveVerdict />
                <MarketOpportunitySection />
                <DemandSignalsSection />
                <CompetitorsDifferentiationSection />
                <InvestmentSection />
                <FinancialReturnSection />
                <GrowthPotentialSection />
                <WhyUaicodeSection />
                <BusinessPlanTab />
              </div>
            )}

            {activeTab === "investment" && (
              <div className="space-y-16">
                <NextStepsSection onScheduleCall={handleScheduleCall} />

                {/* CTA to Closing */}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={onGoToClosing}
                    className="gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg px-10 py-6 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105"
                  >
                    <Rocket className="h-5 w-5" />
                    Proceed to Closing
                  </Button>
                </div>
              </div>
            )}

            <div className="h-16" />
          </div>
        </div>
      </main>
    </div>
  );
};

const PmsDashboardCloser = ({ wizardId, onGoToClosing }: PmsDashboardCloserProps) => {
  return (
    <ReportProvider wizardId={wizardId}>
      <DashboardContent onGoToClosing={onGoToClosing} />
    </ReportProvider>
  );
};

export default PmsDashboardCloser;
