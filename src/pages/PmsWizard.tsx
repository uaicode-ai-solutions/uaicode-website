import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import WizardLayout from "@/components/planningmysaas/wizard/WizardLayout";
import StepYourInfo from "@/components/planningmysaas/wizard/StepYourInfo";
import StepYourIdea from "@/components/planningmysaas/wizard/StepYourIdea";
import StepTargetMarket from "@/components/planningmysaas/wizard/StepTargetMarket";
import StepFeatures from "@/components/planningmysaas/wizard/StepFeatures";
import StepGoals from "@/components/planningmysaas/wizard/StepGoals";
import { saveReport, generateReportId, StoredReport } from "@/lib/reportsStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { determineMvpTier } from "@/types/report";

interface WizardData {
  // User Info (from login or step 1)
  fullName: string;
  email: string;
  linkedinProfile: string;
  phone: string;
  userRole: string;
  userRoleOther: string;
  isAuthenticated: boolean;
  
  // Step 2: Your Idea
  productStage: string;
  saasType: string;
  saasTypeOther: string;
  industry: string;
  industryOther: string;
  description: string;
  saasName: string;
  saasLogo: string;
  
  // Step 3: Target Market
  customerTypes: string[];
  marketSize: string;
  targetAudience: string;
  marketType: string;
  geographicRegion: string;
  
  // Step 4: Features
  selectedFeatures: string[];
  selectedTier: string;
  
  // Step 5: Goals
  goal: string;
  goalOther: string;
  challenge: string;
  budget: string;
  timeline: string;
}

const initialData: WizardData = {
  fullName: "",
  email: "",
  linkedinProfile: "",
  phone: "",
  userRole: "",
  userRoleOther: "",
  isAuthenticated: false,
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
};

const STORAGE_KEY = "pms-wizard-data";

const getSavedData = (): { data: WizardData; currentStep: number } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        data: { ...initialData, ...parsed.data },
        currentStep: parsed.currentStep || 1,
      };
    }
  } catch (e) {
    console.error("Error loading saved wizard data:", e);
  }
  return { data: initialData, currentStep: 1 };
};

const PmsWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "starter";
  const totalSteps = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { pmsUser } = useAuthContext();
  
  const savedState = getSavedData();
  const [currentStep, setCurrentStep] = useState(savedState.currentStep);
  const [data, setData] = useState<WizardData>(savedState.data);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // Load authenticated user data into wizard (only if no localStorage draft exists)
  useEffect(() => {
    if (pmsUser && !userDataLoaded) {
      const hasSavedDraft = localStorage.getItem(STORAGE_KEY);
      
      // Only auto-fill if there's no saved draft
      if (!hasSavedDraft) {
        setData(prev => ({
          ...prev,
          email: pmsUser.email || "",
          fullName: pmsUser.full_name || "",
          isAuthenticated: true,
        }));
      } else {
        // Always update email and fullName (if exists in DB) from authenticated user
        setData(prev => ({
          ...prev,
          email: pmsUser.email || prev.email,
          fullName: pmsUser.full_name || prev.fullName,
          isAuthenticated: true,
        }));
      }
      setUserDataLoaded(true);
    }
  }, [pmsUser, userDataLoaded]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentStep,
      data,
      savedAt: new Date().toISOString()
    }));
  }, [currentStep, data]);

  const handleChange = (field: string, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Your Info
        const userRoleValid = (data.userRole || "") !== "" && 
          (data.userRole !== "other" || (data.userRoleOther || "").trim().length >= 2);
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((data.email || "").trim());
        return (
          userRoleValid &&
          emailValid &&
          (data.fullName || "").trim().length >= 2 &&
          (data.phone || "").length >= 8
        );
      case 2: // Your Idea
        const productStageValid = (data.productStage || "") !== "";
        const saasTypeValid = data.saasType !== "" && 
          (data.saasType !== "other" || data.saasTypeOther.trim().length >= 2);
        const industryValid = data.industry !== "" && 
          (data.industry !== "other" || data.industryOther.trim().length >= 2);
        const saasNameValid = (data.saasName || "").trim().length >= 3;
        return productStageValid && saasTypeValid && industryValid && data.description.trim().length >= 20 && saasNameValid;
      case 3: // Market
        return data.customerTypes.length > 0 && data.marketSize !== "" && data.targetAudience !== "" && data.marketType !== "" && data.geographicRegion !== "";
      case 4: // Features
        return data.selectedFeatures.length > 0;
      case 5: // Goals
        const challengeValid = (data.challenge || "") !== "";
        const goalValid = data.goal !== "" && 
          (data.goal !== "other" || (data.goalOther || "").trim().length >= 2);
        return challengeValid && goalValid && data.budget !== "" && data.timeline !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Only allow going to completed steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || isSubmitting) return;
    
    setIsSubmitting(true);
    
    if (!pmsUser) {
      console.error("Authentication required");
      setIsSubmitting(false);
      return;
    }

    // Generate unique ID for this report
    const reportId = generateReportId();
    const now = new Date().toISOString();

    // Use saasName as the project name
    const projectName = data.saasName.trim() || "Untitled Project";

    // Calculate scores
    const viabilityScore = Math.floor(Math.random() * 20) + 75; // 75-95 mock score
    const complexityScore = Math.floor(Math.random() * 30) + 50; // 50-80 mock score

    try {
      // 1. Save wizard data to Supabase database
      // Calculate the correct tier based on selected features
      const correctTier = determineMvpTier(data.selectedFeatures);
      
      const { error: insertError } = await supabase
        .from('tb_pms_wizard')
        .insert({
          id: reportId,
          user_id: pmsUser.id,
          status: 'pending',
          saas_name: data.saasName,
          saas_logo_url: data.saasLogo || null,
          product_stage: data.productStage,
          saas_type: data.saasType,
          saas_type_other: data.saasType === 'other' ? data.saasTypeOther : null,
          industry: data.industry,
          industry_other: data.industry === 'other' ? data.industryOther : null,
          description: data.description,
          customer_types: data.customerTypes,
          market_size: data.marketSize,
          target_audience: data.targetAudience,
          market_type: data.marketType,
          geographic_region: data.geographicRegion,
          selected_features: data.selectedFeatures,
          selected_tier: correctTier,
          client_role: data.userRole,
          client_role_other: data.userRole === 'other' ? data.userRoleOther : null,
          goal: data.goal,
          goal_other: data.goal === 'other' ? data.goalOther : null,
          challenge: data.challenge,
          budget: data.budget,
          timeline: data.timeline,
          client_email: data.email,
          client_full_name: data.fullName,
          client_phone: data.phone || null,
          client_linkedin: data.linkedinProfile || null,
        } as any);

      if (insertError) {
        console.error("Error saving report to database:", insertError);
        setIsSubmitting(false);
        return;
      }

      console.log("Wizard saved to database:", reportId);

      // 2. Create tb_pms_reports row with status "preparing" BEFORE navigating
      const { error: reportRowError } = await supabase
        .from('tb_pms_reports')
        .insert({
          wizard_id: reportId,
          status: 'preparing'
        });

      if (reportRowError) {
        console.error("Error creating report row:", reportRowError);
        // Not critical - orchestrator can create if needed, but log for debugging
      } else {
        console.log("Report row created with status 'preparing':", reportId);
      }

      // 3. Also save to localStorage as backup
      const newReport: StoredReport = {
        id: reportId,
        createdAt: now,
        updatedAt: now,
        planType: selectedPlan as "starter" | "pro" | "enterprise",
        wizardData: { ...data },
        reportData: {
          projectName,
          viabilityScore,
          complexityScore,
        },
      };
      saveReport(newReport);

      // Note: localStorage is NOT cleared here anymore
      // It will be cleared when user clicks "New Report" in dashboard/reports

      // Log data for debugging
      console.log("Wizard submission complete:", {
        reportId,
        selectedPlan,
        ...data,
      });

      // Navigate to loading screen - Loading page will trigger orchestrator
      navigate(`/planningmysaas/loading/${reportId}`);

    } catch (error) {
      console.error("Error during submission:", error);
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepYourInfo
            data={{
              fullName: data.fullName,
              email: data.email,
              linkedinProfile: data.linkedinProfile,
              phone: data.phone,
              userRole: data.userRole,
              userRoleOther: data.userRoleOther,
            }}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <StepYourIdea
            data={{
              productStage: data.productStage,
              saasType: data.saasType,
              saasTypeOther: data.saasTypeOther,
              industry: data.industry,
              industryOther: data.industryOther,
              description: data.description,
              saasName: data.saasName,
              saasLogo: data.saasLogo,
            }}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <StepTargetMarket
            data={{
              customerTypes: data.customerTypes,
              marketSize: data.marketSize,
              targetAudience: data.targetAudience,
              marketType: data.marketType,
              geographicRegion: data.geographicRegion,
            }}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <StepFeatures
            data={{
              selectedFeatures: data.selectedFeatures,
              selectedTier: data.selectedTier,
            }}
            onChange={handleChange}
            selectedPlan={selectedPlan}
          />
        );
      case 5:
        return (
          <StepGoals
            data={{
              goal: data.goal,
              goalOther: data.goalOther,
              challenge: data.challenge,
              budget: data.budget,
              timeline: data.timeline,
            }}
            onChange={handleChange}
            selectedFeatures={data.selectedFeatures}
          />
        );
      default:
        return null;
    }
  };

  return (
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
    >
      {renderStep()}
    </WizardLayout>
  );
};

export default PmsWizard;
