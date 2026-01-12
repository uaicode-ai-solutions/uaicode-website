import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import WizardLayout from "@/components/planningmysaas/wizard/WizardLayout";
import StepLogin from "@/components/planningmysaas/wizard/StepLogin";
import StepYourInfo from "@/components/planningmysaas/wizard/StepYourInfo";
import StepYourIdea from "@/components/planningmysaas/wizard/StepYourIdea";
import StepTargetMarket from "@/components/planningmysaas/wizard/StepTargetMarket";
import StepFeatures from "@/components/planningmysaas/wizard/StepFeatures";
import StepGoals from "@/components/planningmysaas/wizard/StepGoals";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import { saveReport, generateReportId, StoredReport } from "@/lib/reportsStorage";

interface WizardData {
  // Step 1: Login
  password: string;
  isAuthenticated: boolean;
  
  // Step 2: Your Info
  fullName: string;
  email: string;
  linkedinProfile: string;
  phone: string;
  
  // Step 3: Your Idea
  saasType: string;
  saasTypeOther: string;
  industry: string;
  industryOther: string;
  description: string;
  saasName: string;
  saasLogo: string;
  
  // Step 4: Target Market
  customerTypes: string[];
  marketSize: string;
  targetAudience: string;
  marketType: string;
  
  // Step 5: Features
  selectedFeatures: string[];
  selectedTier: string;
  
  // Step 6: Goals
  goal: string;
  goalOther: string;
  budget: string;
  timeline: string;
}

const initialData: WizardData = {
  password: "",
  isAuthenticated: false,
  fullName: "",
  email: "",
  linkedinProfile: "",
  phone: "",
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
  const totalSteps = 6;
  
  const savedState = getSavedData();
  const [currentStep, setCurrentStep] = useState(savedState.currentStep);
  const [data, setData] = useState<WizardData>(savedState.data);
  
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();

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
      case 1: // Login
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(data.email) && data.password.length >= 6;
      case 2: // Your Info
        return (
          data.fullName.trim().length >= 2 &&
          data.phone.length >= 8
        );
      case 3: // Your Idea
        const saasTypeValid = data.saasType !== "" && 
          (data.saasType !== "other" || data.saasTypeOther.trim().length >= 2);
        const industryValid = data.industry !== "" && 
          (data.industry !== "other" || data.industryOther.trim().length >= 2);
        const saasNameValid = (data.saasName || "").trim().length >= 3;
        return saasTypeValid && industryValid && data.description.trim().length >= 20 && saasNameValid;
      case 4: // Market
        return data.customerTypes.length > 0 && data.marketSize !== "" && data.targetAudience !== "" && data.marketType !== "";
      case 5: // Features
        return data.selectedFeatures.length > 0;
      case 6: // Goals
        const goalValid = data.goal !== "" && 
          (data.goal !== "other" || (data.goalOther || "").trim().length >= 2);
        return goalValid && data.budget !== "" && data.timeline !== "";
      default:
        return false;
    }
  };

  const handleEmailLogin = () => {
    if (validateStep(1)) {
      setData((prev) => ({ ...prev, isAuthenticated: true }));
      setCurrentStep(2);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login - set mock data and proceed
    setData((prev) => ({
      ...prev,
      email: "user@gmail.com",
      fullName: "Google User",
      isAuthenticated: true,
    }));
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // Don't allow going back to login step once authenticated
    if (currentStep > 1 && !(currentStep === 2 && data.isAuthenticated)) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Only allow going to completed steps or current step
    // Don't allow going back to login step once authenticated
    if (stepId <= currentStep && !(stepId === 1 && data.isAuthenticated)) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    // Generate unique ID for this report
    const reportId = generateReportId();
    const now = new Date().toISOString();

    // Use saasName as the project name
    const projectName = data.saasName.trim() || "Untitled Project";

    // Create the report object
    const newReport: StoredReport = {
      id: reportId,
      createdAt: now,
      updatedAt: now,
      planType: selectedPlan as "starter" | "pro" | "enterprise",
      wizardData: { ...data },
      reportData: {
        projectName,
        viabilityScore: Math.floor(Math.random() * 20) + 75, // 75-95 mock score
        complexityScore: Math.floor(Math.random() * 30) + 50, // 50-80 mock score
      },
    };

    // Save to localStorage
    saveReport(newReport);

    // Clear wizard draft data
    localStorage.removeItem(STORAGE_KEY);

    // Log data for debugging
    console.log("Wizard submission:", {
      reportId,
      selectedPlan,
      ...data,
    });

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
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepLogin
            data={{
              email: data.email,
              password: data.password,
            }}
            onChange={handleChange}
            onGoogleLogin={handleGoogleLogin}
            onEmailLogin={handleEmailLogin}
          />
        );
      case 2:
        return (
          <StepYourInfo
            data={{
              fullName: data.fullName,
              email: data.email,
              linkedinProfile: data.linkedinProfile,
              phone: data.phone,
            }}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <StepYourIdea
            data={{
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
      case 4:
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
      case 5:
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
      case 6:
        return (
          <StepGoals
            data={{
              goal: data.goal,
              goalOther: data.goalOther,
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
      isLoginStep={currentStep === 1}
      onSubmit={handleSubmit}
    >
      {renderStep()}
    </WizardLayout>
  );
};

export default PmsWizard;
