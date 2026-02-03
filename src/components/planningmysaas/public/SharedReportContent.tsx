import React from "react";
import { 
  BusinessPlanSection,
  OpportunitySection,
  GrowthIntelligenceSection,
  ICPIntelligenceSection,
  PriceIntelligenceSection,
} from "@/types/report";
import { CompetitiveAnalysisSectionData } from "@/lib/competitiveAnalysisUtils";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";

// Import the same cards used in Dashboard BusinessPlanTab
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
} from "../dashboard/businessplan";

// ==========================================
// Main SharedReportContent Component
// Uses the same cards as the Dashboard BusinessPlanTab
// ==========================================
interface SharedReportContentProps {
  businessPlan: BusinessPlanSection;
  opportunity: OpportunitySection | null;
  competitive: CompetitiveAnalysisSectionData | null;
  icp: ICPIntelligenceSection | null;
  pricing: PriceIntelligenceSection | null;
  growth: GrowthIntelligenceSection | null;
  investment: Record<string, unknown> | null;
}

const SharedReportContent = ({ 
  businessPlan,
  opportunity,
  competitive,
  icp,
  pricing,
  growth,
  investment,
}: SharedReportContentProps) => {
  // Build a minimal reportData object for useFinancialMetrics
  // Cast to ReportData with required fields filled with defaults
  const reportData = {
    id: "",
    wizard_id: "",
    status: "completed",
    created_at: "",
    updated_at: "",
    hero_score_section: null,
    summary_section: null,
    benchmark_section: null,
    business_plan_section: null,
    icp_avatar_url: null,
    paid_media_intelligence_section: null,
    share_enabled: true,
    share_token: null,
    share_url: null,
    share_created_at: null,
    opportunity_section: opportunity,
    growth_intelligence_section: growth,
    section_investment: investment,
    price_intelligence_section: pricing,
    icp_intelligence_section: icp,
    competitive_analysis_section: competitive,
  } as const;
  
  const financialMetrics = useFinancialMetrics(reportData as Parameters<typeof useFinancialMetrics>[0]);

  // Extract AI insights from business plan section
  const aiInsights = businessPlan?.ai_section_insights;
  
  // Viability data
  const viabilityScore = businessPlan?.viability_score || 0;
  const viabilityLabel = businessPlan?.viability_label || "Pending";

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
    </div>
  );
};

export default SharedReportContent;
