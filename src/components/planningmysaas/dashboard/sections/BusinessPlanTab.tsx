import React from "react";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import { 
  BusinessPlanSection,
  OpportunitySection,
  GrowthIntelligenceSection,
  ICPIntelligenceSection,
  PriceIntelligenceSection,
} from "@/types/report";
import { CompetitiveAnalysisSectionData } from "@/lib/competitiveAnalysisUtils";
import { AlertCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Import structured Business Plan components
import {
  ExecutiveSnapshotCard,
  ExecutiveNarrativeCard,
  MarketAnalysisCard,
  CompetitiveLandscapeCard,
  TargetCustomerCard,
  BusinessModelCard,
  FinancialProjectionsCard,
  InvestmentAskCard,
  StrategicVerdictCard,
} from "../businessplan";

// ==========================================
// Main BusinessPlanTab Component
// ==========================================

const BusinessPlanTab = () => {
  const { reportData, report } = useReportContext();
  const financialMetrics = useFinancialMetrics(reportData, report?.market_type);

  // Extract all JSONB sections
  const businessPlan = reportData?.business_plan_section as BusinessPlanSection | null;
  const opportunity = reportData?.opportunity_section as OpportunitySection | null;
  const competitive = reportData?.competitive_analysis_section as CompetitiveAnalysisSectionData | null;
  const icp = reportData?.icp_intelligence_section as ICPIntelligenceSection | null;
  const pricing = reportData?.price_intelligence_section as PriceIntelligenceSection | null;
  const growth = reportData?.growth_intelligence_section as GrowthIntelligenceSection | null;
  const investment = reportData?.section_investment as Record<string, unknown> | null;

  // Extract AI insights from business plan section
  const aiInsights = businessPlan?.ai_section_insights;
  
  // Viability data
  const viabilityScore = businessPlan?.viability_score || 0;
  const viabilityLabel = businessPlan?.viability_label || "Pending";

  // Check if we have any data
  const hasData = opportunity || competitive || icp || pricing || growth || investment;

  if (!hasData && !businessPlan) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Business Plan Not Available
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          The Business Plan will be generated once the analysis is complete.
          Please wait for all sections to finish processing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Executive Snapshot - KPI Grid */}
      <ExecutiveSnapshotCard
        opportunity={opportunity}
        growth={growth}
        investment={investment}
        financialMetrics={financialMetrics}
        viabilityScore={viabilityScore}
        viabilityLabel={viabilityLabel}
      />

      {/* 2. Executive Narrative - AI Generated */}
      <ExecutiveNarrativeCard
        narrative={businessPlan?.ai_executive_narrative}
        marketInsight={aiInsights?.market_insight}
      />

      {/* 3. Market Analysis - Data from DB */}
      <MarketAnalysisCard
        opportunity={opportunity}
        insight={aiInsights?.market_insight}
      />

      {/* 4. Competitive Landscape */}
      <CompetitiveLandscapeCard
        competitors={competitive?.competitors}
        insight={aiInsights?.competition_insight}
      />

      {/* 5. Target Customer - ICP Card */}
      <TargetCustomerCard
        icp={icp}
        insight={aiInsights?.customer_insight}
      />

      {/* 6. Business Model - Pricing */}
      <BusinessModelCard
        pricing={pricing}
      />

      {/* 7. Financial Projections - J-Curve + Metrics */}
      <FinancialProjectionsCard
        growth={growth}
        investment={investment}
        financialMetrics={financialMetrics}
        insight={aiInsights?.financial_insight}
      />

      {/* 8. Investment Ask */}
      <InvestmentAskCard
        investment={investment}
      />

      {/* 9. Strategic Verdict - AI Generated */}
      <StrategicVerdictCard
        verdict={businessPlan?.ai_strategic_verdict}
        recommendations={businessPlan?.ai_key_recommendations}
        viabilityScore={viabilityScore}
        viabilityLabel={viabilityLabel}
      />

      {/* Legacy: Show markdown content if new AI fields not available */}
      {businessPlan?.markdown_content && !businessPlan?.ai_executive_narrative && (
        <Card className="glass-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Legacy content (will be replaced)</span>
            </div>
            <div className="prose prose-invert max-w-none text-sm text-muted-foreground line-clamp-6">
              {businessPlan.markdown_content.slice(0, 500)}...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessPlanTab;
