import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import ResumeOrRestartDialog from "@/components/planningmysaas/ResumeOrRestartDialog";
import { useReportData } from "@/hooks/useReportData";
import { useReport } from "@/hooks/useReport";
import { supabase } from "@/integrations/supabase/client";

// Parse step number from status string
const parseStepNumber = (status: string | undefined): number | null => {
  if (!status) return null;
  const match = status.match(/Step (\d+)/i);
  return match ? parseInt(match[1]) : null;
};

// Check if status indicates failure
const isFailureStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  return status.toLowerCase().includes("fail");
};

// Check if status indicates in-progress
const isInProgressStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const normalized = status.trim().toLowerCase();
  return normalized.includes("in progress") || 
         (normalized.startsWith("step") && !normalized.includes("fail") && !normalized.includes("completed"));
};

// Extract failed step info
const parseFailedStep = (status: string | undefined): { stepNumber: number; stepName: string } | null => {
  if (!status) return null;
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
  
  // UI States
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasDecided, setHasDecided] = useState(false);
  
  // Get wizard data for project name
  const { data: wizardData } = useReport(wizardId);
  const projectName = wizardData?.saas_name || "Your SaaS";
  
  // Get report data with polling (every 5 seconds)
  const { data: reportData, refetch } = useReportData(wizardId);
  
  // Track if initial check has been done
  const hasCheckedInitialStatus = useRef(false);
  
  // Current status
  const status = reportData?.status;
  const normalizedStatus = status?.trim().toLowerCase() || "";
  const currentStepNumber = parseStepNumber(status);
  const isFailed = isFailureStatus(status);
  const isCompleted = normalizedStatus === "completed";
  const isInProgress = isInProgressStatus(status);
  const failedStepInfo = parseFailedStep(status);
  
  // Trigger orchestrator with optional resume step
  const triggerOrchestrator = useCallback(async (resumeFromStep?: number) => {
    if (!wizardId) return;
    
    console.log("[PmsLoading] Triggering orchestrator:", { wizardId, resumeFromStep });
    
    try {
      const result = await supabase.functions.invoke('pms-orchestrate-report', {
        body: { 
          wizard_id: wizardId,
          resume_from_step: resumeFromStep 
        }
      });
      console.log('[PmsLoading] Orchestrator response:', result);
    } catch (err) {
      console.error('[PmsLoading] Orchestrator error:', err);
    }
  }, [wizardId]);
  
  // Initial status check on mount
  useEffect(() => {
    if (hasCheckedInitialStatus.current || hasDecided) return;
    
    // Wait for first data fetch (reportData can be null for brand new reports)
    // But we need at least one query to complete
    if (reportData === undefined) return;
    
    hasCheckedInitialStatus.current = true;
    console.log("[PmsLoading] Initial status check:", status);
    
    // Case 1: No status, null, or "preparing" → Start fresh generation
    if (!status || normalizedStatus === "preparing") {
      console.log("[PmsLoading] Status is preparing/empty, starting generation");
      setHasDecided(true);
      triggerOrchestrator();
      return;
    }
    
    // Case 2: Completed → Go to dashboard
    if (isCompleted) {
      console.log("[PmsLoading] Already completed, navigating to dashboard");
      navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
      return;
    }
    
    // Case 3: Failed → Show error UI (will be handled by render)
    if (isFailed) {
      console.log("[PmsLoading] Found failed status");
      setHasDecided(true);
      return;
    }
    
    // Case 4: In Progress → Show dialog asking Resume or Restart
    if (isInProgress && currentStepNumber) {
      console.log("[PmsLoading] Found in-progress status, showing dialog");
      setShowResumeDialog(true);
      return;
    }
    
    // Default: Start fresh (unknown status)
    console.log("[PmsLoading] Unknown status, starting fresh:", status);
    setHasDecided(true);
    triggerOrchestrator();
  }, [reportData, status, normalizedStatus, isCompleted, isFailed, isInProgress, currentStepNumber, wizardId, navigate, triggerOrchestrator, hasDecided]);
  
  // Watch for completion during generation
  useEffect(() => {
    if (hasDecided && isCompleted) {
      console.log("[PmsLoading] Generation completed! Navigating to dashboard...");
      navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
    }
  }, [hasDecided, isCompleted, wizardId, navigate]);
  
  // Handle resume choice
  const handleResume = useCallback(() => {
    setShowResumeDialog(false);
    setHasDecided(true);
    if (currentStepNumber) {
      triggerOrchestrator(currentStepNumber);
    }
  }, [currentStepNumber, triggerOrchestrator]);
  
  // Handle restart choice
  const handleRestart = useCallback(() => {
    setShowResumeDialog(false);
    setHasDecided(true);
    triggerOrchestrator(); // No resume_from_step = start from 1
  }, [triggerOrchestrator]);
  
  // Handle retry failed step - update status to "preparing" before retrying
  const handleRetryFailedStep = useCallback(async () => {
    if (!wizardId) return;
    
    setIsRetrying(true);
    
    // Update status to "preparing" before reloading
    const { error } = await supabase
      .from("tb_pms_reports")
      .update({ status: "preparing" })
      .eq("wizard_id", wizardId);
    
    // Reset state before reload
    setIsRetrying(false);
    
    if (!error) {
      console.log("[PmsLoading] Status reset to 'preparing' for retry, reloading...");
      window.location.reload();
    } else {
      console.error("[PmsLoading] Failed to update status for retry:", error);
    }
  }, [wizardId]);
  
  // Handle back to wizard
  const handleBackToWizard = useCallback(() => {
    navigate(`/planningmysaas/wizard?edit=${wizardId}`, { replace: true });
  }, [wizardId, navigate]);
  
  // Show Resume/Restart dialog
  if (showResumeDialog && currentStepNumber) {
    return (
      <div className="fixed inset-0 z-[100] bg-background">
        <GeneratingReportSkeleton 
          projectName={projectName}
          currentStatus={status}
        />
        <ResumeOrRestartDialog
          open={true}
          currentStep={currentStepNumber}
          projectName={projectName}
          onResume={handleResume}
          onRestart={handleRestart}
        />
      </div>
    );
  }
  
  // Show error UI for failed status
  if (hasDecided && isFailed) {
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
              The AI analysis could not complete this step. You can retry from this step or go back to review your inputs.
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
              onClick={handleRetryFailedStep}
              disabled={isRetrying}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? "Preparing..." : `Retry Step ${failedStepInfo?.stepNumber || ''}`}
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
  
  // Default: show loading skeleton
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
