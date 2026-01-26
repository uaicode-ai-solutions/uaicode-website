import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight, UserCircle, Rocket, Globe2, Puzzle, Flag } from "lucide-react";
import WizardProgress from "./WizardProgress";
import uaicodeLogo from "@/assets/uaicode-logo.png";

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
  const navigate = useNavigate();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const handleClose = () => {
    navigate("/planningmysaas/reports");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 mesh-gradient opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-premium border-b border-accent/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src={uaicodeLogo} 
                alt="Uaicode" 
                className="h-9 w-9 rounded-lg"
              />
              <span className="text-lg font-bold text-foreground hidden sm:block">
                Planning<span className="text-accent">My</span>SaaS
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/10 border border-border/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

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
          <div key={currentStep} className="animate-tab-enter">
            {children}
          </div>
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
                  🚀 Get my SaaS Analysis
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
