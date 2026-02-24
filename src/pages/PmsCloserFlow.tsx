import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import CloserWelcome from "@/components/planningmysaas/closer/CloserWelcome";
import CloserLoadingPrompts from "@/components/planningmysaas/closer/CloserLoadingPrompts";
import CloserFollowUp from "@/components/planningmysaas/closer/CloserFollowUp";
import PmsWizardCloser from "@/components/planningmysaas/closer/PmsWizardCloser";
import PmsDashboardCloser from "@/components/planningmysaas/closer/PmsDashboardCloser";

export type CloserStage = "welcome" | "interview" | "generating" | "presenting" | "closing";

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
}

const PmsCloserFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pmsUser } = useAuthContext();
  const { isAdmin, isContributor } = useUserRoles();
  
  const [stage, setStage] = useState<CloserStage>("welcome");
  const [wizardId, setWizardId] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    linkedin: searchParams.get("linkedin") || "",
  });

  // Redirect if not admin/contributor
  useEffect(() => {
    if (pmsUser && !isAdmin && !isContributor) {
      navigate("/planningmysaas/reports");
    }
  }, [pmsUser, isAdmin, isContributor, navigate]);

  const handleStartInterview = () => {
    setStage("interview");
  };

  const handleWizardComplete = useCallback((newWizardId: string) => {
    setWizardId(newWizardId);
    setStage("generating");
  }, []);

  const handleReportReady = useCallback(() => {
    setStage("presenting");
  }, []);

  const handleGoToClosing = useCallback(() => {
    setStage("closing");
  }, []);

  if (!pmsUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {stage === "welcome" && (
        <CloserWelcome
          clientInfo={clientInfo}
          onClientInfoChange={setClientInfo}
          onStart={handleStartInterview}
        />
      )}

      {stage === "interview" && (
        <PmsWizardCloser
          clientInfo={clientInfo}
          onComplete={handleWizardComplete}
        />
      )}

      {stage === "generating" && wizardId && (
        <CloserLoadingPrompts
          wizardId={wizardId}
          onReportReady={handleReportReady}
        />
      )}

      {stage === "presenting" && wizardId && (
        <PmsDashboardCloser
          wizardId={wizardId}
          onGoToClosing={handleGoToClosing}
        />
      )}

      {stage === "closing" && wizardId && (
        <CloserFollowUp
          wizardId={wizardId}
          clientInfo={clientInfo}
          onBack={() => setStage("presenting")}
        />
      )}
    </>
  );
};

export default PmsCloserFlow;
