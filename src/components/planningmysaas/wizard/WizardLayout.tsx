import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, UserCircle, Rocket, Globe2, Puzzle, Flag } from "lucide-react";
import WizardProgress from "./WizardProgress";

interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onStepClick?: (stepId: number) => void;
  canGoNext: boolean;
  isLastStep: boolean;
  onSubmit?: () => void;
}

const steps = [
  { id: 1, label: "Your Info", icon: UserCircle },
  { id: 2, label: "Your Idea", icon: Rocket },
  { id: 3, label: "Market", icon: Globe2 },
  { id: 4, label: "Features", icon: Puzzle },
  { id: 5, label: "Goals", icon: Flag },
];

const WizardLayout = ({
  children,
  currentStep,
  onNext,
  onBack,
  onStepClick,
  canGoNext,
  isLastStep,
  onSubmit,
}: WizardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 mesh-gradient opacity-30 pointer-events-none" />

      {/* Progress bar */}
      <div className="py-8 border-b border-border/30">
        <WizardProgress 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={onStepClick}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-4 pb-8 px-4">
        <div className="container mx-auto max-w-4xl relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Back button */}
              <Button
                variant="outline"
                onClick={onBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {/* Next/Submit button */}
              {isLastStep ? (
                <Button
                  onClick={onSubmit}
                  disabled={!canGoNext}
                  className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold glow-white"
                >
                  🚀 Generate My Launch Plan
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={!canGoNext}
                  className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </footer>
    </div>
  );
};

export default WizardLayout;
