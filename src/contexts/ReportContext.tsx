import React, { createContext, useContext, ReactNode } from "react";
import { useReport } from "@/hooks/useReport";
import { useReportData } from "@/hooks/useReportData";
import { ReportRow, ReportData } from "@/types/report";

interface ReportContextType {
  report: ReportRow | null | undefined;
  reportData: ReportData | null | undefined;
  isLoading: boolean;
  error: Error | null;
  reportId: string | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  reportId: string | undefined;
  children: ReactNode;
}

export const ReportProvider = ({ reportId, children }: ReportProviderProps) => {
  const { data: report, isLoading: isLoadingWizard, error: wizardError } = useReport(reportId);
  const { data: reportData, isLoading: isLoadingReport, error: reportError } = useReportData(reportId);

  return (
    <ReportContext.Provider
      value={{
        report,
        reportData,
        isLoading: isLoadingWizard || isLoadingReport,
        error: (wizardError || reportError) as Error | null,
        reportId,
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
