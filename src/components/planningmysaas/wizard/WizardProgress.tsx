import { cn } from "@/lib/utils";
import { Check, LucideIcon } from "lucide-react";

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
      <div className="flex items-center justify-between relative">
        {/* Progress line background - positioned between icons, not through them */}
        <div className="absolute left-[10%] right-[10%] top-6 md:top-7 h-0.5 bg-border/30 rounded-full" />
        
        {/* Progress line filled - calculates width based on the space between icons (80% of container) */}
        <div
          className="absolute left-[10%] top-6 md:top-7 h-0.5 bg-gradient-to-r from-accent via-accent to-accent/80 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 80}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || isCurrent;
          const StepIcon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => {
                if (isClickable && onStepClick) {
                  onStepClick(step.id);
                }
              }}
              disabled={!isClickable}
              className={cn(
                "flex flex-col items-center relative z-10 group",
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
                  "mt-3 text-sm font-medium transition-all duration-500 text-center max-w-[80px]",
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
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
