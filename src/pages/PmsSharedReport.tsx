import { useParams } from "react-router-dom";
import { SharedReportProvider } from "@/contexts/SharedReportContext";
import { useReportContext } from "@/contexts/ReportContext";
import SharedReportHeader from "@/components/planningmysaas/public/SharedReportHeader";
import SharedReportFooter from "@/components/planningmysaas/public/SharedReportFooter";
import SharedReportSkeleton from "@/components/planningmysaas/public/SharedReportSkeleton";
import SharedReportError from "@/components/planningmysaas/public/SharedReportError";
import BusinessPlanTab from "@/components/planningmysaas/dashboard/sections/BusinessPlanTab";

/**
 * Content component that uses the shared report context.
 */
const SharedReportContent = () => {
  const { report, reportData, isLoading, error } = useReportContext();

  // Loading state
  if (isLoading) {
    return <SharedReportSkeleton />;
  }

  // Error state or no data
  if (error || !reportData) {
    return <SharedReportError />;
  }

  // Extract project name from wizard snapshot
  const projectName = report?.saas_name || "Business Plan";

  return (
    <div className="min-h-screen bg-background">
      <SharedReportHeader />
      
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          {/* Reuse the exact same BusinessPlanTab component */}
          <BusinessPlanTab />
        </div>
      </main>
      
      <SharedReportFooter />
    </div>
  );
};

/**
 * Public shared report page.
 * Wraps content with SharedReportProvider to fetch data by share_token.
 */
const PmsSharedReport = () => {
  const { shareToken } = useParams<{ shareToken: string }>();

  // No token provided
  if (!shareToken) {
    return <SharedReportError />;
  }

  return (
    <SharedReportProvider shareToken={shareToken}>
      <SharedReportContent />
    </SharedReportProvider>
  );
};

export default PmsSharedReport;
