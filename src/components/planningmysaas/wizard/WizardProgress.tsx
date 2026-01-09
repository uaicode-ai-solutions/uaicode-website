import { cn } from "@/lib/utils";
import { Check, LucideIcon } from "lucide-react";
import React from "react";

interface Step {
  id: number;
  label: string;
  icon: LucideIcon;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

const WizardProgress = ({ steps, currentStep, onStepClick }: WizardProgressProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || isCurrent;
          const StepIcon = step.icon;
          const isLastStep = index === steps.length - 1;
          
          // Connector between steps
          const showConnector = !isLastStep;
          const connectorCompleted = step.id < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step button */}
              <button
                onClick={() => {
                  if (isClickable && onStepClick) {
                    onStepClick(step.id);
                  }
                }}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center relative z-10 group flex-shrink-0",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center",
                    "transition-all duration-500 ease-out transform",
                    isCompleted
                      ? "bg-accent text-accent-foreground scale-100 group-hover:scale-105"
                      : isCurrent
                      ? "border-2 border-accent bg-accent/10 text-accent scale-110 shadow-lg shadow-accent/25"
                      : "border border-border/40 bg-card/50 text-muted-foreground/50 scale-100"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 md:w-6 md:h-6 animate-scale-in" />
                  ) : (
                    <StepIcon className={cn(
                      "w-5 h-5 md:w-6 md:h-6 transition-all duration-500",
                      isCurrent && "animate-pulse"
                    )} />
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    "mt-3 text-xs md:text-sm font-medium transition-all duration-500 text-center max-w-[70px] md:max-w-[80px] leading-tight",
                    isCurrent 
                      ? "text-accent" 
                      : isCompleted 
                      ? "text-foreground group-hover:text-accent" 
                      : "text-muted-foreground/50"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector between steps */}
              {showConnector && (
                <div className="flex-1 flex items-center h-12 md:h-14 mx-1 md:mx-2">
                  <div className="relative w-full h-1 bg-border/30 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-700 ease-out",
                        connectorCompleted ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
