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
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-6 md:top-7 h-1 bg-border/30 rounded-full" />
        
        {/* Progress line filled with gradient and glow */}
        <div
          className="absolute left-0 top-6 md:top-7 h-1 bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-[0_0_10px_hsl(var(--accent)/0.5)] transition-all duration-700 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 group">
              {/* Step circle */}
              <div
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-medium transition-all duration-300",
                  isCompleted
                    ? "bg-accent text-accent-foreground shadow-[0_0_15px_hsl(var(--accent)/0.4)]"
                    : isCurrent
                    ? "bg-accent text-accent-foreground ring-4 ring-accent/40 shadow-[0_0_20px_hsl(var(--accent)/0.6)] animate-pulse"
                    : "bg-card border-2 border-border/60 text-muted-foreground group-hover:border-accent/30 transition-colors"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </div>

              {/* Step number */}
              <span
                className={cn(
                  "mt-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300",
                  isCurrent ? "text-accent" : isCompleted ? "text-accent/80" : "text-muted-foreground/60"
                )}
              >
                Step {step.id}
              </span>

              {/* Step label */}
              <span
                className={cn(
                  "text-[11px] sm:text-xs font-medium transition-colors duration-300 text-center max-w-[60px] sm:max-w-none",
                  isCurrent ? "text-foreground" : isCompleted ? "text-foreground/80" : "text-muted-foreground"
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
