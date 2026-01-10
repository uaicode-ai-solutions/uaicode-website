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

interface WizardData {
  // Step 1: Your Info
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  
  // Step 2: Your Idea
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
  
  // Step 4: Features
  selectedFeatures: string[];
  selectedTier: string;
  
  // Step 5: Goals
  goal: string;
  goalOther: string;
  budget: string;
  timeline: string;
}

const initialData: WizardData = {
  fullName: "",
  email: "",
  companyName: "",
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
  const totalSteps = 5;
  
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
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          data.fullName.trim().length >= 2 &&
          emailRegex.test(data.email) &&
          data.phone.length >= 8
        );
      case 2:
        const saasTypeValid = data.saasType !== "" && 
          (data.saasType !== "other" || data.saasTypeOther.trim().length >= 2);
        const industryValid = data.industry !== "" && 
          (data.industry !== "other" || data.industryOther.trim().length >= 2);
        const saasNameValid = (data.saasName || "").trim().length >= 3;
        return saasTypeValid && industryValid && data.description.trim().length >= 20 && saasNameValid;
      case 3:
        return data.customerTypes.length > 0 && data.marketSize !== "";
      case 4:
        return data.selectedFeatures.length > 0;
      case 5:
        const goalValid = data.goal !== "" && 
          (data.goal !== "other" || (data.goalOther || "").trim().length >= 2);
        return goalValid && data.budget !== "" && data.timeline !== "";
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
          <StepYourInfo
            data={{
              fullName: data.fullName,
              email: data.email,
              companyName: data.companyName,
              phone: data.phone,
            }}
            onChange={handleChange}
          />
        );
      case 2:
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
      case 3:
        return (
          <StepTargetMarket
            data={{
              customerTypes: data.customerTypes,
              marketSize: data.marketSize,
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
