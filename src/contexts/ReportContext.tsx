import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { useReport } from "@/hooks/useReport";
import { useReportData } from "@/hooks/useReportData";
import { ReportRow, ReportData } from "@/types/report";
import { MarketingTotals } from "@/hooks/useMarketingTiers";
import { useFallbackAgent, UseFallbackAgentReturn } from "@/hooks/useFallbackAgent";
import { useQueryClient } from "@tanstack/react-query";

interface ReportContextType {
  report: ReportRow | null | undefined;
  reportData: ReportData | null | undefined;
  isLoading: boolean;
  error: Error | null;
  reportId: string | undefined;
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
  reportId: string | undefined;
  children: ReactNode;
}

export const ReportProvider = ({ reportId, children }: ReportProviderProps) => {
  const queryClient = useQueryClient();
  const { data: report, isLoading: isLoadingWizard, error: wizardError } = useReport(reportId);
  const { data: reportData, isLoading: isLoadingReport, error: reportError } = useReportData(reportId);

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
    if (reportId) {
      // Invalidate both report queries to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      await queryClient.invalidateQueries({ queryKey: ["reportData", reportId] });
    }
  }, [reportId, queryClient]);

  return (
    <ReportContext.Provider
      value={{
        report,
        reportData,
        isLoading: isLoadingWizard || isLoadingReport,
        error: (wizardError || reportError) as Error | null,
        reportId,
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
    throw new Error("useReportContext must be used within a ReportProvider");
  }
  return context;
};

export default ReportContext;
