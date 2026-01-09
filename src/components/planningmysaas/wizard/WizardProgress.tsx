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
}

const WizardProgress = ({ steps, currentStep }: WizardProgressProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-border/40" />
        
        {/* Progress line filled */}
        <div
          className="absolute left-0 top-5 h-0.5 bg-accent transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isCurrent
                    ? "border-2 border-dashed border-accent bg-transparent text-accent"
                    : "border border-border/60 bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors duration-300 text-center max-w-[70px]",
                  isCurrent ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
