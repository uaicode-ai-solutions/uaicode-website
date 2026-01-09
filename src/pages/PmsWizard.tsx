import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import WizardLayout from "@/components/planningmysaas/wizard/WizardLayout";
import StepYourInfo from "@/components/planningmysaas/wizard/StepYourInfo";
import StepYourIdea from "@/components/planningmysaas/wizard/StepYourIdea";
import StepTargetMarket from "@/components/planningmysaas/wizard/StepTargetMarket";
import StepFeatures from "@/components/planningmysaas/wizard/StepFeatures";
import StepGoals from "@/components/planningmysaas/wizard/StepGoals";

interface WizardData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  // Step 2
  saasType: string;
  industry: string;
  description: string;
  // Step 3
  customerType: string;
  marketSize: string;
  // Step 4
  selectedFeatures: string[];
  selectedTier: string;
  // Step 5
  goal: string;
  timeline: string;
}

const initialData: WizardData = {
  fullName: "",
  email: "",
  phone: "",
  saasType: "",
  industry: "",
  description: "",
  customerType: "",
  marketSize: "",
  selectedFeatures: [],
  selectedTier: "",
  goal: "",
  timeline: "",
};

const PmsWizard = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "pro";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();

  const totalSteps = 5;

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
        return data.saasType !== "" && data.industry !== "";
      case 3:
        return data.customerType !== "" && data.marketSize !== "";
      case 4:
        return true; // Features are optional
      case 5:
        return data.goal !== "" && data.timeline !== "";
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

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    // Log data for debugging
    console.log("Wizard submission:", {
      selectedPlan,
      ...data,
    });

    // Fire confetti
    fireConfetti();

    // Show success toast
    toast({
      title: "🎉 Submission Successful!",
      description: "Your SaaS validation report is being generated. We'll send it to your email shortly.",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepYourInfo
            data={{
              fullName: data.fullName,
              email: data.email,
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
              industry: data.industry,
              description: data.description,
            }}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <StepTargetMarket
            data={{
              customerType: data.customerType,
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
              timeline: data.timeline,
            }}
            allData={data}
            selectedPlan={selectedPlan}
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
      canGoNext={validateStep(currentStep)}
      isLastStep={currentStep === totalSteps}
      onSubmit={handleSubmit}
    >
      {renderStep()}
    </WizardLayout>
  );
};

export default PmsWizard;
