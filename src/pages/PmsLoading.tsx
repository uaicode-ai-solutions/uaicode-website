import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import { useReportData } from "@/hooks/useReportData";
import { useReport } from "@/hooks/useReport";
import { supabase } from "@/integrations/supabase/client";

// Helper to detect failure status
const isFailureStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  return status.toLowerCase().includes("fail");
};

// Helper to extract failed step from status
const parseFailedStep = (status: string | undefined): { stepNumber: number; stepName: string } | null => {
  if (!status) return null;
  // Pattern: "Step X Name - Fail" or "Step X - Fail"
  const match = status.match(/Step (\d+)\s*([^-]*)?-?\s*Fail/i);
  if (match) {
    return {
      stepNumber: parseInt(match[1]),
      stepName: match[2]?.trim() || `Step ${match[1]}`
    };
  }
  return null;
};

const PmsLoading = () => {
  const navigate = useNavigate();
  const { id: wizardId } = useParams<{ id: string }>();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Get wizard data for project name
  const { data: wizardData } = useReport(wizardId);
  const projectName = wizardData?.saas_name || "Your SaaS";
  
  // Get report data with polling (every 5 seconds)
  const { data: reportData, refetch } = useReportData(wizardId);
  
  // Track if we've already navigated to avoid double navigation
  const hasNavigated = useRef(false);
  
  const status = reportData?.status;
  const isFailed = isFailureStatus(status);
  const failedStepInfo = parseFailedStep(status);
  
  // Debug logging
  useEffect(() => {
    console.log("[PmsLoading] Polling status:", {
      wizardId,
      reportStatus: status,
      hasData: !!reportData,
      isFailed
    });
  }, [wizardId, status, reportData, isFailed]);
  
  // Monitor status and navigate when complete
  useEffect(() => {
    if (hasNavigated.current) return;
    
    // Terminal success status - report is ready
    if (status === "completed") {
      hasNavigated.current = true;
      navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
    }
  }, [status, wizardId, navigate]);
  
  // Handle retry using new orchestrator Edge Function
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Chamar nova Edge Function orquestradora
      supabase.functions.invoke('pms-orchestrate-report', {
        body: { wizard_id: wizardId }
      });
      // Refetch to get new status
      await refetch();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };
  
  // Handle back to wizard
  const handleBackToWizard = () => {
    navigate(`/planningmysaas/wizard?edit=${wizardId}`, { replace: true });
  };
  
  // Show error UI if failed
  if (isFailed) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          
          {/* Error Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Report Generation Failed
            </h2>
            <p className="text-muted-foreground">
              We encountered an issue while analyzing <span className="font-semibold text-accent">{projectName}</span>
            </p>
          </div>
          
          {/* Failed Step Details */}
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {failedStepInfo 
                ? `Failed at Step ${failedStepInfo.stepNumber}: ${failedStepInfo.stepName}`
                : "Processing Error"
              }
            </AlertTitle>
            <AlertDescription>
              The AI analysis could not complete this step. You can try again or go back to review your inputs.
            </AlertDescription>
          </Alert>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleBackToWizard}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wizard
            </Button>
            <Button
              className="flex-1"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
          </div>
          
          {/* Help Text */}
          <p className="text-xs text-muted-foreground text-center">
            If the problem persists, please contact support with your report ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{wizardId}</code>
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton 
        projectName={projectName}
        currentStatus={status}
      />
    </div>
  );
};

export default PmsLoading;
