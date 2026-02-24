import { useState, useEffect } from "react";
import WizardLayout from "@/components/planningmysaas/wizard/WizardLayout";
import StepYourInfo from "@/components/planningmysaas/wizard/StepYourInfo";
import StepYourIdea from "@/components/planningmysaas/wizard/StepYourIdea";
import StepTargetMarket from "@/components/planningmysaas/wizard/StepTargetMarket";
import StepFeatures from "@/components/planningmysaas/wizard/StepFeatures";
import StepGoals from "@/components/planningmysaas/wizard/StepGoals";
import CloserSidebar from "./CloserSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateReportId, saveReport, StoredReport } from "@/lib/reportsStorage";
import { determineMvpTier } from "@/types/report";
import { ClientInfo } from "@/pages/PmsCloserFlow";

interface PmsWizardCloserProps {
  clientInfo: ClientInfo;
  onComplete: (wizardId: string) => void;
}

interface WizardData {
  fullName: string;
  email: string;
  linkedinProfile: string;
  phone: string;
  userRole: string;
  userRoleOther: string;
  isAuthenticated: boolean;
  productStage: string;
  saasType: string;
  saasTypeOther: string;
  industry: string;
  industryOther: string;
  description: string;
  saasName: string;
  saasLogo: string;
  customerTypes: string[];
  marketSize: string;
  targetAudience: string;
  marketType: string;
  geographicRegion: string;
  selectedFeatures: string[];
  selectedTier: string;
  goal: string;
  goalOther: string;
  challenge: string;
  budget: string;
  timeline: string;
}

const PmsWizardCloser = ({ clientInfo, onComplete }: PmsWizardCloserProps) => {
  const { pmsUser } = useAuthContext();
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState<WizardData>({
    fullName: clientInfo.name,
    email: clientInfo.email,
    linkedinProfile: clientInfo.linkedin,
    phone: clientInfo.phone,
    userRole: "",
    userRoleOther: "",
    isAuthenticated: true,
    productStage: "",
    saasType: "",
    saasTypeOther: "",
    industry: "",
    industryOther: "",
    description: "",
    saasName: "",
    saasLogo: "",
    customerTypes: [],
    marketSize: "",
    targetAudience: "",
    marketType: "",
    geographicRegion: "",
    selectedFeatures: [],
    selectedTier: "",
    goal: "",
    goalOther: "",
    challenge: "",
    budget: "",
    timeline: "",
  });

  const handleChange = (field: string, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const userRoleValid = data.userRole !== "" && (data.userRole !== "other" || data.userRoleOther.trim().length >= 2);
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
        return userRoleValid && emailValid && data.fullName.trim().length >= 2 && data.phone.length >= 8;
      case 2:
        const saasTypeValid = data.saasType !== "" && (data.saasType !== "other" || data.saasTypeOther.trim().length >= 2);
        const industryValid = data.industry !== "" && (data.industry !== "other" || data.industryOther.trim().length >= 2);
        return data.productStage !== "" && saasTypeValid && industryValid && data.description.trim().length >= 20 && data.saasName.trim().length >= 3;
      case 3:
        return data.customerTypes.length > 0 && data.marketSize !== "" && data.targetAudience !== "" && data.marketType !== "" && data.geographicRegion !== "";
      case 4:
        return data.selectedFeatures.length > 0;
      case 5:
        const goalValid = data.goal !== "" && (data.goal !== "other" || data.goalOther.trim().length >= 2);
        return data.challenge !== "" && goalValid && data.budget !== "" && data.timeline !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) setCurrentStep(stepId);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || isSubmitting || !pmsUser) return;
    setIsSubmitting(true);

    const reportId = generateReportId();
    const correctTier = determineMvpTier(data.selectedFeatures);

    try {
      const { error: insertError } = await supabase.from("tb_pms_wizard").insert({
        id: reportId,
        user_id: pmsUser.id,
        status: "pending",
        saas_name: data.saasName,
        saas_logo_url: data.saasLogo || null,
        product_stage: data.productStage,
        saas_type: data.saasType,
        saas_type_other: data.saasType === "other" ? data.saasTypeOther : null,
        industry: data.industry,
        industry_other: data.industry === "other" ? data.industryOther : null,
        description: data.description,
        customer_types: data.customerTypes,
        market_size: data.marketSize,
        target_audience: data.targetAudience,
        market_type: data.marketType,
        geographic_region: data.geographicRegion,
        selected_features: data.selectedFeatures,
        selected_tier: correctTier,
        client_role: data.userRole,
        client_role_other: data.userRole === "other" ? data.userRoleOther : null,
        goal: data.goal,
        goal_other: data.goal === "other" ? data.goalOther : null,
        challenge: data.challenge,
        budget: data.budget,
        timeline: data.timeline,
        client_email: data.email,
        client_full_name: data.fullName,
        client_phone: data.phone || null,
        client_linkedin: data.linkedinProfile || null,
      } as any);

      if (insertError) {
        console.error("Error saving wizard:", insertError);
        setIsSubmitting(false);
        return;
      }

      await supabase.from("tb_pms_reports").insert({
        wizard_id: reportId,
        status: "preparing",
      });

      // Save to localStorage backup
      const now = new Date().toISOString();
      saveReport({
        id: reportId,
        createdAt: now,
        updatedAt: now,
        planType: "starter",
        wizardData: { ...data },
        reportData: {
          projectName: data.saasName,
          viabilityScore: 0,
          complexityScore: 0,
        },
      });

      onComplete(reportId);
    } catch (err) {
      console.error("Error during submission:", err);
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepYourInfo data={{ fullName: data.fullName, email: data.email, linkedinProfile: data.linkedinProfile, phone: data.phone, userRole: data.userRole, userRoleOther: data.userRoleOther }} onChange={handleChange} />;
      case 2:
        return <StepYourIdea data={{ productStage: data.productStage, saasType: data.saasType, saasTypeOther: data.saasTypeOther, industry: data.industry, industryOther: data.industryOther, description: data.description, saasName: data.saasName, saasLogo: data.saasLogo }} onChange={handleChange} />;
      case 3:
        return <StepTargetMarket data={{ customerTypes: data.customerTypes, marketSize: data.marketSize, targetAudience: data.targetAudience, marketType: data.marketType, geographicRegion: data.geographicRegion }} onChange={handleChange} />;
      case 4:
        return <StepFeatures data={{ selectedFeatures: data.selectedFeatures, selectedTier: data.selectedTier }} onChange={handleChange} selectedPlan="starter" />;
      case 5:
        return <StepGoals data={{ goal: data.goal, goalOther: data.goalOther, challenge: data.challenge, budget: data.budget, timeline: data.timeline }} onChange={handleChange} selectedFeatures={data.selectedFeatures} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Wizard */}
      <div className="flex-1">
        <WizardLayout
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
          onStepClick={handleStepClick}
          canGoNext={validateStep(currentStep)}
          isLastStep={currentStep === totalSteps}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          closerMode
        >
          {renderStep()}
        </WizardLayout>
      </div>

      {/* Closer Sidebar */}
      <CloserSidebar currentStep={currentStep} />
    </div>
  );
};

export default PmsWizardCloser;
