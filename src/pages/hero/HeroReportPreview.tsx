import { useParams } from "react-router-dom";
import { HeroReportPreviewProvider } from "@/contexts/HeroReportPreviewContext";
import { useReportContext } from "@/contexts/ReportContext";
import SharedReportHeader from "@/components/planningmysaas/public/SharedReportHeader";
import SharedReportHero from "@/components/planningmysaas/public/SharedReportHero";
import SharedReportFooter from "@/components/planningmysaas/public/SharedReportFooter";
import SharedReportSkeleton from "@/components/planningmysaas/public/SharedReportSkeleton";
import SharedReportError from "@/components/planningmysaas/public/SharedReportError";
import BusinessPlanTab from "@/components/planningmysaas/dashboard/sections/BusinessPlanTab";

const HeroReportContent = () => {
  const { reportData, isLoading, error } = useReportContext();

  if (isLoading) return <SharedReportSkeleton />;
  if (error || !reportData) return <SharedReportError />;

  return (
    <div className="min-h-screen bg-background">
      <SharedReportHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <SharedReportHero />
          <BusinessPlanTab />
          <div className="mt-12">
            <SharedReportFooter />
          </div>
        </div>
      </main>
    </div>
  );
};

const HeroReportPreview = () => {
  const { reportId } = useParams<{ reportId: string }>();

  if (!reportId) return <SharedReportError />;

  return (
    <HeroReportPreviewProvider reportId={reportId}>
      <HeroReportContent />
    </HeroReportPreviewProvider>
  );
};

export default HeroReportPreview;
