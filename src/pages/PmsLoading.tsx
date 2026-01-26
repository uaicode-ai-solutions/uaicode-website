import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import { useReportData } from "@/hooks/useReportData";
import { useReport } from "@/hooks/useReport";

const PmsLoading = () => {
  const navigate = useNavigate();
  const { id: wizardId } = useParams<{ id: string }>();
  
  // Get wizard data for project name
  const { data: wizardData } = useReport(wizardId);
  const projectName = wizardData?.saas_name || "Your SaaS";
  
  // Get report data with polling (every 5 seconds)
  const { data: reportData } = useReportData(wizardId);
  
  // Track if we've already navigated to avoid double navigation
  const hasNavigated = useRef(false);
  
  // Monitor status and navigate when complete
  useEffect(() => {
    if (hasNavigated.current) return;
    
    const status = reportData?.status;
    
    // Terminal statuses - report is ready
    if (status === "Created" || status === "completed") {
      hasNavigated.current = true;
      navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
    }
    
    // Error statuses - redirect back to reports with error
    if (status === "failed" || status === "error") {
      hasNavigated.current = true;
      navigate("/planningmysaas/reports", { replace: true });
    }
  }, [reportData?.status, wizardId, navigate]);
  
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton 
        projectName={projectName}
        currentStatus={reportData?.status}
      />
    </div>
  );
};

export default PmsLoading;
