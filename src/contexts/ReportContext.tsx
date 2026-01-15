import React, { createContext, useContext, ReactNode, useState } from "react";
import { useReport } from "@/hooks/useReport";
import { useReportData } from "@/hooks/useReportData";
import { ReportRow, ReportData } from "@/types/report";
import { MarketingTotals } from "@/hooks/useMarketingTiers";

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
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  reportId: string | undefined;
  children: ReactNode;
}

export const ReportProvider = ({ reportId, children }: ReportProviderProps) => {
  const { data: report, isLoading: isLoadingWizard, error: wizardError } = useReport(reportId);
  const { data: reportData, isLoading: isLoadingReport, error: reportError } = useReportData(reportId);

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
