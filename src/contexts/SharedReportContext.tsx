import React, { createContext, useContext, ReactNode } from "react";
import { useSharedReport, SharedReportData } from "@/hooks/useSharedReport";
import { ReportData, ReportRow } from "@/types/report";
import { MarketingTotals } from "@/hooks/useMarketingTiers";

/**
 * Default marketing totals for shared reports when snapshot is unavailable
 */
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

/**
 * Context type matching ReportContext for component compatibility
 */
interface SharedReportContextType {
  report: ReportRow | null | undefined;
  reportData: ReportData | null | undefined;
  isLoading: boolean;
  error: Error | null;
  wizardId: string | undefined;
  pmsReportId: string | undefined;
  selectedMarketingIds: string[];
  setSelectedMarketingIds: (ids: string[]) => void;
  marketingTotals: MarketingTotals;
  setMarketingTotals: (totals: MarketingTotals) => void;
  isSharedView: boolean;
}

export const SharedReportContext = createContext<SharedReportContextType | undefined>(undefined);

interface SharedReportProviderProps {
  shareToken: string;
  children: ReactNode;
}

/**
 * Provider for public shared report pages.
 * Fetches report data by share_token and provides it in the same shape as ReportContext.
 */
export const SharedReportProvider = ({ shareToken, children }: SharedReportProviderProps) => {
  const { data, isLoading, error } = useSharedReport(shareToken);

  // Transform wizard_snapshot into ReportRow-compatible format
  const wizardSnapshot = data?.wizard_snapshot as Record<string, unknown> | null;
  const report: ReportRow | null = wizardSnapshot ? {
    id: String(wizardSnapshot.id || data?.wizard_id || ""),
    saas_name: String(wizardSnapshot.saas_name || ""),
    market_type: String(wizardSnapshot.market_type || ""),
    industry: String(wizardSnapshot.industry || ""),
    description: String(wizardSnapshot.description || ""),
    budget: wizardSnapshot.budget ? String(wizardSnapshot.budget) : null,
    status: "completed",
    created_at: "",
    updated_at: "",
    user_id: "",
  } as ReportRow : null;

  // Transform fetched data into ReportData format
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

  // Use marketing snapshot or fallback to defaults
  // Cast through unknown for safety since JSONB can be various types
  const marketingSnapshot = data?.marketing_snapshot as unknown as MarketingTotals | null;
  const marketingTotals: MarketingTotals = marketingSnapshot && 
    typeof marketingSnapshot === 'object' && 
    'uaicodeTotal' in marketingSnapshot
      ? marketingSnapshot 
      : defaultMarketingTotals;

  const value: SharedReportContextType = {
    report,
    reportData,
    isLoading,
    error: error as Error | null,
    wizardId: data?.wizard_id,
    pmsReportId: data?.id,
    selectedMarketingIds: [],
    setSelectedMarketingIds: () => {}, // Read-only in shared view
    marketingTotals,
    setMarketingTotals: () => {}, // Read-only in shared view
    isSharedView: true,
  };

  return (
    <SharedReportContext.Provider value={value}>
      {children}
    </SharedReportContext.Provider>
  );
};

/**
 * Hook to access shared report context.
 * Use useReportContext() instead - it falls back to this automatically.
 */
export const useSharedReportContext = (): SharedReportContextType => {
  const context = useContext(SharedReportContext);
  if (context === undefined) {
    throw new Error("useSharedReportContext must be used within a SharedReportProvider");
  }
  return context;
};

export default SharedReportContext;
