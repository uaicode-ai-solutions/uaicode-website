import { Check, User, Lightbulb, Users, Settings, Target } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { number: 1, label: "Your Info", icon: User },
  { number: 2, label: "Your Idea", icon: Lightbulb },
  { number: 3, label: "Market", icon: Users },
  { number: 4, label: "Features", icon: Settings },
  { number: 5, label: "Goals", icon: Target },
];

const WizardProgress = ({ currentStep, onStepClick }: WizardProgressProps) => {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-1 bg-border rounded-full" />
        <div
          className="absolute top-5 left-0 h-1 bg-accent rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isClickable = step.number < currentStep;

            return (
              <button
                key={step.number}
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-accent border-accent text-accent-foreground"
                      : isCurrent
                      ? "bg-background border-accent text-accent shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${
                    isCurrent
                      ? "text-accent"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step indicator */}
      <div className="text-center mb-6">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </span>
      </div>
    </div>
  );
};

export default WizardProgress;
