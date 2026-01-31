import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSharedReport } from "@/hooks/useSharedReport";
import { generateBusinessPlanPDF } from "@/lib/businessPlanPdfExport";
import SharedReportHeader from "@/components/planningmysaas/public/SharedReportHeader";
import SharedReportContent from "@/components/planningmysaas/public/SharedReportContent";
import SharedReportFooter from "@/components/planningmysaas/public/SharedReportFooter";
import SharedReportSkeleton from "@/components/planningmysaas/public/SharedReportSkeleton";
import SharedReportError from "@/components/planningmysaas/public/SharedReportError";

const PmsSharedReport = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data, isLoading, error } = useSharedReport(shareToken);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!data?.business_plan_section) return;
    
    setIsDownloading(true);
    try {
      await generateBusinessPlanPDF(
        data.business_plan_section, 
        data.saas_name
      );
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <SharedReportSkeleton />;
  }

  // Error state or no data
  if (error || !data) {
    return <SharedReportError />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedReportHeader />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 space-y-8">
          {/* Business Plan Content */}
          <SharedReportContent businessPlan={data.business_plan_section} />
          
          {/* Footer with CTAs */}
          <SharedReportFooter 
            onDownloadPdf={handleDownloadPdf}
            isDownloading={isDownloading}
          />
        </div>
      </main>
    </div>
  );
};

export default PmsSharedReport;
