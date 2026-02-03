import React, { createContext, useContext, ReactNode, useState } from "react";
import { useReport } from "@/hooks/useReport";
import { useReportData } from "@/hooks/useReportData";
import { ReportRow, ReportData } from "@/types/report";
import { MarketingTotals } from "@/hooks/useMarketingTiers";
import { SharedReportContext } from "@/contexts/SharedReportContext";

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
  /** True when rendering in public shared view (read-only) */
  isSharedView?: boolean;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  wizardId: string | undefined;
  children: ReactNode;
}

export const ReportProvider = ({ wizardId, children }: ReportProviderProps) => {
  const { data: report, isLoading: isLoadingWizard, error: wizardError } = useReport(wizardId);
  const { data: reportData, isLoading: isLoadingReport, error: reportError } = useReportData(wizardId);

  // Extract the actual tb_pms_reports.id for polling/status checks
  const pmsReportId = reportData?.id;

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
        wizardId,
        pmsReportId,
        selectedMarketingIds,
        setSelectedMarketingIds,
        marketingTotals,
        setMarketingTotals,
        isSharedView: false,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

/**
 * Hook to access report context.
 * Works with both ReportProvider (authenticated dashboard) and SharedReportProvider (public shared page).
 */
export const useReportContext = (): ReportContextType => {
  const reportContext = useContext(ReportContext);
  const sharedContext = useContext(SharedReportContext);

  // Prefer authenticated context, fallback to shared context
  if (reportContext !== undefined) {
    return reportContext;
  }

  if (sharedContext !== undefined) {
    return sharedContext;
  }

  // Neither context available
  console.error("[ReportContext] Context is undefined. This component must be rendered inside <ReportProvider> or <SharedReportProvider>.");
  console.error("[ReportContext] Current URL:", typeof window !== 'undefined' ? window.location.href : 'SSR');
  throw new Error("useReportContext must be used within a ReportProvider or SharedReportProvider.");
};

export default ReportContext;
