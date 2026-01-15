import { Loader2, Brain, Search, BarChart3, Palette, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface GeneratingReportSkeletonProps {
  projectName: string;
}

const steps = [
  { id: 1, label: "Researching market data", icon: Search, duration: 20 },
  { id: 2, label: "Analyzing competitors", icon: BarChart3, duration: 25 },
  { id: 3, label: "Generating insights", icon: Brain, duration: 35 },
  { id: 4, label: "Creating brand assets", icon: Palette, duration: 15 },
  { id: 5, label: "Finalizing report", icon: CheckCircle2, duration: 5 },
];

const GeneratingReportSkeleton = ({ projectName }: GeneratingReportSkeletonProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress through steps
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 1;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(newProgress);

      // Determine current step
      let accumulatedDuration = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedDuration += steps[i].duration;
        if (elapsed <= accumulatedDuration) {
          setCurrentStep(i);
          break;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-lg w-full mx-auto text-center space-y-8 px-4">
        {/* Animated Logo */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/40 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-background animate-pulse" />
          </div>
          <div className="absolute -inset-2 border-2 border-accent/30 rounded-full animate-spin-slow" style={{ animationDuration: '8s' }} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Generating Your Report
          </h2>
          <p className="text-muted-foreground">
            Our AI is analyzing <span className="text-accent font-semibold">{projectName}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete • Estimated time: 2-3 minutes
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-left bg-card/50 rounded-xl p-6 border border-border/50">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isActive ? "text-accent" : isComplete ? "text-muted-foreground" : "text-muted-foreground/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? "bg-accent/20 border-2 border-accent" 
                    : isComplete 
                      ? "bg-accent/10 border border-accent/50" 
                      : "bg-muted/30 border border-border/50"
                }`}>
                  {isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-foreground" : ""}`}>
                  {step.label}
                </span>
                {isActive && (
                  <span className="ml-auto text-xs text-accent animate-pulse">
                    In progress...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <p className="text-xs text-muted-foreground">
          💡 Tip: Your report will include market research, competitor analysis, financial projections, and brand assets.
        </p>
      </div>
    </div>
  );
};

export default GeneratingReportSkeleton;
