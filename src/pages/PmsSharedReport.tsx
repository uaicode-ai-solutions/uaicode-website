import { useParams } from "react-router-dom";
import { useSharedReport } from "@/hooks/useSharedReport";
import SharedReportHeader from "@/components/planningmysaas/public/SharedReportHeader";
import SharedReportFooter from "@/components/planningmysaas/public/SharedReportFooter";
import SharedReportSkeleton from "@/components/planningmysaas/public/SharedReportSkeleton";
import SharedReportError from "@/components/planningmysaas/public/SharedReportError";

const PmsSharedReport = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data: html, isLoading, error } = useSharedReport(shareToken);

  // Loading state
  if (isLoading) {
    return <SharedReportSkeleton />;
  }

  // Error state or no data
  if (error || !html) {
    return <SharedReportError />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedReportHeader />
      
      <main className="pt-24 pb-16">
        {/* Render the pre-generated static HTML */}
        <div 
          className="shared-report-content max-w-4xl mx-auto px-4 lg:px-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      
      {/* Footer with CTAs - no PDF for now since we use static HTML */}
      <SharedReportFooter />
    </div>
  );
};

export default PmsSharedReport;
