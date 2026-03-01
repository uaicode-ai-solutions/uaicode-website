import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import uaicodeLogo from "@/assets/uaicode-logo.png";

interface LeadWizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isSubmitting?: boolean;
  showNav?: boolean;
  nextLabel?: string;
}

const LeadWizardLayout = ({
  currentStep,
  totalSteps,
  children,
  onBack,
  onNext,
  canGoNext,
  isSubmitting = false,
  showNav = true,
  nextLabel,
}: LeadWizardLayoutProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-background mesh-gradient flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/30">
        <div className="flex items-center justify-center py-6">
          <img src={uaicodeLogo} alt="UaiCode" className="h-8 md:h-10" />
        </div>

        {/* Progress dots */}
        {!isFirstStep && !isLastStep && (
          <div className="flex items-center justify-center gap-1.5 pb-4">
            {Array.from({ length: totalSteps - 2 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i + 1 === currentStep
                    ? "w-6 bg-accent"
                    : i + 1 < currentStep
                    ? "w-1.5 bg-accent/60"
                    : "w-1.5 bg-border/50"
                )}
              />
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto py-8 pb-24 flex items-center justify-center">
        {children}
      </main>

      {/* Footer nav */}
      {showNav && !isLastStep && (
        <footer className="fixed bottom-0 inset-x-0 backdrop-blur-xl bg-background/80 border-t border-border/30 p-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            {!isFirstStep ? (
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-6"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {nextLabel || (currentStep === totalSteps - 2 ? "Submit" : "Next")}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LeadWizardLayout;
