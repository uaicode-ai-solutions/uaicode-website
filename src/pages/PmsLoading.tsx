import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import { useReportData } from "@/hooks/useReportData";
import { useReport } from "@/hooks/useReport";
import { supabase } from "@/integrations/supabase/client";

// Single source of truth: This page triggers the orchestrator webhook on mount

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
  
  // Guard to ensure webhook is only triggered once (handles StrictMode)
  const hasTriggeredWebhook = useRef(false);
  
  // Guard to prevent navigation on stale cache: only navigate after observing non-completed status
  const hasSeenNonCompleted = useRef(false);
  
  // Track aggressive refetch interval
  const aggressiveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const status = reportData?.status;
  const normalizedStatus = status?.trim().toLowerCase() || "";
  const isFailed = isFailureStatus(status);
  const failedStepInfo = parseFailedStep(status);
  
  // SINGLE SOURCE OF TRUTH: Trigger orchestrator webhook on mount
  useEffect(() => {
    if (!wizardId || hasTriggeredWebhook.current) return;
    
    // Mark as triggered BEFORE calling (prevents race condition)
    hasTriggeredWebhook.current = true;
    
    console.log("[PmsLoading] Triggering orchestrator for:", wizardId);
    
    supabase.functions.invoke('pms-orchestrate-report', {
      body: { wizard_id: wizardId }
    }).then(result => {
      console.log('[PmsLoading] Orchestrator response:', result);
      
      // Start aggressive refetch to catch status transition quickly
      // This helps when cache has old "completed" status
      if (!aggressiveIntervalRef.current) {
        console.log('[PmsLoading] Starting aggressive refetch (every 800ms for 15s)');
        aggressiveIntervalRef.current = setInterval(() => {
          refetch();
        }, 800);
        
        // Stop after 15 seconds
        setTimeout(() => {
          if (aggressiveIntervalRef.current) {
            clearInterval(aggressiveIntervalRef.current);
            aggressiveIntervalRef.current = null;
            console.log('[PmsLoading] Stopped aggressive refetch');
          }
        }, 15000);
      }
    }).catch(err => {
      console.error('[PmsLoading] Orchestrator error:', err);
    });
    
    // Cleanup on unmount
    return () => {
      if (aggressiveIntervalRef.current) {
        clearInterval(aggressiveIntervalRef.current);
        aggressiveIntervalRef.current = null;
      }
    };
  }, [wizardId, refetch]);
  
  // Track when we see a non-completed status (proves this is a fresh generation cycle)
  useEffect(() => {
    if (normalizedStatus && normalizedStatus !== "completed") {
      if (!hasSeenNonCompleted.current) {
        console.log("[PmsLoading] Observed non-completed status:", status);
      }
      hasSeenNonCompleted.current = true;
      
      // Stop aggressive refetch once we see progress
      if (aggressiveIntervalRef.current) {
        clearInterval(aggressiveIntervalRef.current);
        aggressiveIntervalRef.current = null;
        console.log('[PmsLoading] Stopped aggressive refetch (progress detected)');
      }
    }
  }, [normalizedStatus, status]);
  
  // Debug logging
  useEffect(() => {
    console.log("[PmsLoading] Status update:", {
      wizardId,
      rawStatus: status,
      normalizedStatus,
      hasSeenNonCompleted: hasSeenNonCompleted.current,
      isFailed
    });
  }, [wizardId, status, normalizedStatus, isFailed]);
  
  // Monitor status and navigate when complete (only after seeing non-completed)
  useEffect(() => {
    // Only navigate if:
    // 1. Status is "completed"
    // 2. We have observed a non-completed status during this session
    if (normalizedStatus === "completed" && hasSeenNonCompleted.current) {
      console.log("[PmsLoading] Report completed! Navigating to dashboard...");
      navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
    }
  }, [normalizedStatus, wizardId, navigate]);
  
  // Handle retry - just reload: the mount effect will trigger the webhook
  const handleRetry = () => {
    setIsRetrying(true);
    // Reset the guard so useEffect will trigger again after reload
    hasTriggeredWebhook.current = false;
    hasSeenNonCompleted.current = false;
    // Reload forces re-mount, which triggers the orchestrator webhook
    window.location.reload();
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
