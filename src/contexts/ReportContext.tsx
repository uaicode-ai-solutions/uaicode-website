import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { useReport } from "@/hooks/useReport";
import { useReportData } from "@/hooks/useReportData";
import { ReportRow, ReportData } from "@/types/report";
import { MarketingTotals } from "@/hooks/useMarketingTiers";
import { useFallbackAgent, UseFallbackAgentReturn } from "@/hooks/useFallbackAgent";
import { useQueryClient } from "@tanstack/react-query";

/**
 * NOMENCLATURA PADRÃO:
 * 
 * wizardId - UUID do registro em tb_pms_wizard (PK)
 *            É o ID usado na URL: /dashboard/:wizardId
 * 
 * pmsReportId - UUID do registro em tb_pms_reports (PK)
 *               Derivado de reportData.id após o fetch
 */
interface ReportContextType {
  report: ReportRow | null | undefined;
  reportData: ReportData | null | undefined;
  isLoading: boolean;
  error: Error | null;
  /** UUID from tb_pms_wizard - used in URL */
  wizardId: string | undefined;
  /** UUID from tb_pms_reports - use for polling status */
  pmsReportId: string | undefined;
  // Marketing selection state (shared between InvestmentSection and NextStepsSection)
  selectedMarketingIds: string[];
  setSelectedMarketingIds: (ids: string[]) => void;
  marketingTotals: MarketingTotals;
  setMarketingTotals: (totals: MarketingTotals) => void;
  // Fallback agent for intelligent data fetching
  fallbackAgent: UseFallbackAgentReturn | null;
  // Refresh report data after fallback updates
  refreshReportData: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  wizardId: string | undefined;
  children: ReactNode;
}

export const ReportProvider = ({ wizardId, children }: ReportProviderProps) => {
  const queryClient = useQueryClient();
  const { data: report, isLoading: isLoadingWizard, error: wizardError } = useReport(wizardId);
  const { data: reportData, isLoading: isLoadingReport, error: reportError } = useReportData(wizardId);

  // Extract the actual tb_pms_reports.id for polling/status checks
  const pmsReportId = reportData?.id;

  // Initialize fallback agent
  const fallbackAgent = useFallbackAgent();

  // Marketing selection state (shared between sections)
  const [selectedMarketingIds, setSelectedMarketingIds] = useState<string[]>([]);
  const [marketingTotals, setMarketingTotals] = useState<MarketingTotals>({
    uaicodeTotal: 0,
    traditionalMinTotal: 0,
    traditionalMaxTotal: 0,
    savingsMinCents: 0,
    savingsMaxCents: 0,
    savingsPercentMin: 0,
    savingsPercentMax: 0,
    annualSavingsMin: 0,
    annualSavingsMax: 0,
  });

  // Function to refresh report data after fallback agent updates
  const refreshReportData = useCallback(async () => {
    if (wizardId) {
      // Invalidate both queries with the new standardized keys
      await queryClient.invalidateQueries({ queryKey: ["wizard", wizardId] });
      await queryClient.invalidateQueries({ queryKey: ["pms-report-data", wizardId] });
    }
  }, [wizardId, queryClient]);

  return (
    <ReportContext.Provider
      value={{
        report,
        reportData,
        isLoading: isLoadingWizard || isLoadingReport,
        error: (wizardError || reportError) as Error | null,
        wizardId,
        pmsReportId,
        selectedMarketingIds,
        setSelectedMarketingIds,
        marketingTotals,
        setMarketingTotals,
        fallbackAgent,
        refreshReportData,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    // More descriptive error with debugging info
    console.error("[ReportContext] Context is undefined. This component must be rendered inside <ReportProvider>.");
    console.error("[ReportContext] Current URL:", typeof window !== 'undefined' ? window.location.href : 'SSR');
    throw new Error("useReportContext must be used within a ReportProvider. Check that PmsDashboard wraps PmsDashboardContent with ReportProvider.");
  }
  return context;
};

export default ReportContext;
