import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import WizardLayout from "@/components/planningmysaas/wizard/WizardLayout";
import StepYourInfo from "@/components/planningmysaas/wizard/StepYourInfo";
import StepYourIdea from "@/components/planningmysaas/wizard/StepYourIdea";
import StepTargetMarket from "@/components/planningmysaas/wizard/StepTargetMarket";
import StepFeatures from "@/components/planningmysaas/wizard/StepFeatures";
import StepGoals from "@/components/planningmysaas/wizard/StepGoals";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import { saveReport, generateReportId, StoredReport } from "@/lib/reportsStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

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
  
  const { pmsUser } = useAuthContext();
  
  const savedState = getSavedData();
  const [currentStep, setCurrentStep] = useState(savedState.currentStep);
  const [data, setData] = useState<WizardData>(savedState.data);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();

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
          phone: pmsUser.phone || "",
          linkedinProfile: pmsUser.linkedin_profile || "",
          userRole: pmsUser.user_role || "",
          userRoleOther: pmsUser.user_role_other || "",
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
        return (
          userRoleValid &&
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
        return data.customerTypes.length > 0 && data.marketSize !== "" && data.targetAudience !== "" && data.marketType !== "";
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
    if (!validateStep(currentStep)) return;
    
    if (!pmsUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate your report.",
        variant: "destructive",
      });
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
      // 1. Update user data with Step 1 information (so webhook gets fresh data)
      const { error: userUpdateError } = await supabase
        .from('tb_pms_users')
        .update({
          full_name: data.fullName,
          phone: data.phone || null,
          linkedin_profile: data.linkedinProfile || null,
          user_role: data.userRole || null,
          user_role_other: data.userRole === 'other' ? data.userRoleOther : null,
        })
        .eq('id', pmsUser.id);

      if (userUpdateError) {
        console.error("Error updating user data:", userUpdateError);
        // Continue anyway - user data update is not critical for report creation
      } else {
        console.log("User data updated successfully for user:", pmsUser.id);
      }

      // 2. Save report to Supabase database
      const { error: insertError } = await supabase
        .from('tb_pms_reports')
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
          selected_features: data.selectedFeatures,
          selected_tier: data.selectedTier || selectedPlan,
          goal: data.goal,
          goal_other: data.goal === 'other' ? data.goalOther : null,
          challenge: data.challenge,
          budget: data.budget,
          timeline: data.timeline,
          viability_score: viabilityScore,
          complexity_score: complexityScore,
        });

      if (insertError) {
        console.error("Error saving report to database:", insertError);
        toast({
          title: "Error",
          description: "Failed to save your report. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Report saved to database:", reportId);
      // Note: Webhook is now called automatically via database trigger (on_pms_report_created)

      // 2. Also save to localStorage as backup
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

      // Clear wizard draft data
      localStorage.removeItem(STORAGE_KEY);

      // Log data for debugging
      console.log("Wizard submission complete:", {
        reportId,
        selectedPlan,
        ...data,
      });

      // Send report ready email notification
      try {
        const industryDisplay = data.industry === "other" ? data.industryOther : data.industry;
        await supabase.functions.invoke('pms-send-report-ready', {
          body: {
            email: data.email,
            fullName: data.fullName,
            reportId: reportId,
            projectName: projectName,
            viabilityScore: viabilityScore,
            complexityScore: complexityScore,
            planType: selectedPlan,
            industry: industryDisplay || "Technology"
          }
        });
        console.log("Report ready email sent successfully");
      } catch (emailError) {
        console.error("Failed to send report ready email:", emailError);
        // Don't block user flow if email fails
      }

      // Fire confetti
      fireConfetti();

      // Show success toast
      toast({
        title: "🎉 Submission Successful!",
        description: "Your SaaS validation report is ready! Redirecting...",
      });

      // Navigate to dashboard with the new report ID
      setTimeout(() => {
        navigate(`/planningmysaas/dashboard/${reportId}`);
      }, 1500);

    } catch (error) {
      console.error("Error during submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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
    >
      {renderStep()}
    </WizardLayout>
  );
};

export default PmsWizard;
