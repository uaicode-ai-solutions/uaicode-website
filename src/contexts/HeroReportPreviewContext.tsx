import React, { ReactNode } from "react";
import { SharedReportContext } from "@/contexts/SharedReportContext";
import { useHeroReportPreview } from "@/hooks/useHeroReportPreview";
import { ReportData, ReportRow } from "@/types/report";
import { MarketingTotals } from "@/hooks/useMarketingTiers";

const defaultMarketingTotals: MarketingTotals = {
  uaicodeTotal: 0,
  traditionalMinTotal: 0,
  traditionalMaxTotal: 0,
  savingsMinCents: 0,
  savingsMaxCents: 0,
  savingsPercentMin: 0,
  savingsPercentMax: 0,
  annualSavingsMin: 0,
  annualSavingsMax: 0,
};

interface HeroReportPreviewProviderProps {
  reportId: string;
  children: ReactNode;
}

/**
 * Provider for hero report preview pages.
 * Fetches report data by ID and provides it via SharedReportContext
 * so all existing components (BusinessPlanTab, etc.) work seamlessly.
 */
export const HeroReportPreviewProvider = ({ reportId, children }: HeroReportPreviewProviderProps) => {
  const { data, isLoading, error } = useHeroReportPreview(reportId);

  const wizardSnapshot = data?.wizard_snapshot as Record<string, unknown> | null;
  const report: ReportRow | null = wizardSnapshot ? {
    id: String(wizardSnapshot.id || data?.wizard_id || ""),
    saas_name: String(wizardSnapshot.saas_name || ""),
    market_type: String(wizardSnapshot.market_type || ""),
    industry: String(wizardSnapshot.industry || ""),
    description: String(wizardSnapshot.description || ""),
    budget: wizardSnapshot.budget ? String(wizardSnapshot.budget) : null,
    geographic_region: wizardSnapshot.geographic_region ? String(wizardSnapshot.geographic_region) : null,
    status: "completed",
    created_at: "",
    updated_at: "",
    user_id: "",
  } as ReportRow : null;

  const reportData: ReportData | null = data ? {
    id: data.id,
    wizard_id: data.wizard_id,
    status: data.status,
    business_plan_section: data.business_plan_section,
    opportunity_section: data.opportunity_section,
    competitive_analysis_section: data.competitive_analysis_section,
    icp_intelligence_section: data.icp_intelligence_section,
    price_intelligence_section: data.price_intelligence_section,
    growth_intelligence_section: data.growth_intelligence_section,
    section_investment: data.section_investment,
    hero_score_section: data.hero_score_section,
    icp_avatar_url: data.icp_avatar_url,
  } as ReportData : null;

  const marketingSnapshot = data?.marketing_snapshot as unknown as MarketingTotals | null;
  const marketingTotals: MarketingTotals = marketingSnapshot &&
    typeof marketingSnapshot === 'object' &&
    'uaicodeTotal' in marketingSnapshot
      ? marketingSnapshot
      : defaultMarketingTotals;

  const value = {
    report,
    reportData,
    isLoading,
    error: error as Error | null,
    wizardId: data?.wizard_id,
    pmsReportId: data?.id,
    selectedMarketingIds: [],
    setSelectedMarketingIds: () => {},
    marketingTotals,
    setMarketingTotals: () => {},
    isSharedView: true,
  };

  return (
    <SharedReportContext.Provider value={value}>
      {children}
    </SharedReportContext.Provider>
  );
};
