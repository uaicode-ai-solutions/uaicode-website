import { Loader2, DollarSign, Target, BarChart3, TrendingUp, Users, Tag, Megaphone, Rocket, FileText, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GeneratingReportSkeletonProps {
  projectName: string;
  currentStatus?: string;
}

// Steps ordered for column-first display in 2-column grid
// Visual order: left column (1-5), right column (6-10)
// Array order: [1,6], [2,7], [3,8], [4,9], [5,10] for row-by-row grid rendering
const steps = [
  { id: 1, label: "Investment analysis", icon: DollarSign, statusKey: "investment" },
  { id: 6, label: "Pricing strategy", icon: Tag, statusKey: "price" },
  { id: 2, label: "Market benchmarks", icon: Target, statusKey: "benchmark" },
  { id: 7, label: "Paid media analysis", icon: Megaphone, statusKey: "paid media" },
  { id: 3, label: "Competitor research", icon: BarChart3, statusKey: "competitors" },
  { id: 8, label: "Growth projections", icon: Rocket, statusKey: "growth" },
  { id: 4, label: "Market opportunity", icon: TrendingUp, statusKey: "opportunity" },
  { id: 9, label: "Executive summary", icon: FileText, statusKey: "summary" },
  { id: 5, label: "Customer profiling (ICP)", icon: Users, statusKey: "icp" },
  { id: 10, label: "Final scoring", icon: Trophy, statusKey: "hero score" },
];

const TOTAL_STEPS = 10;

/**
 * Parse the current step number from the status string
 * Status format: "Step X Name - Completed" or "Started" or "Created"
 */
const parseCurrentStep = (status: string | undefined): number => {
  if (!status) return 0;
  if (status === "Started") return 0;
  if (status === "Created") return TOTAL_STEPS;
  
  const match = status.match(/Step (\d+)/i);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Parse failed step number from status string
 * Status format: "Step X Name - Fail" or "Step X - Fail"
 */
const parseFailedStep = (status: string | undefined): number | null => {
  if (!status) return null;
  const match = status.match(/Step (\d+).*Fail/i);
  return match ? parseInt(match[1]) : null;
};

/**
 * Get estimated remaining time based on current step
 */
const getEstimatedTime = (currentStep: number): string => {
  const remainingSteps = TOTAL_STEPS - currentStep;
  if (remainingSteps <= 0) return "Almost done...";
  if (remainingSteps <= 2) return "Less than a minute";
  const minutes = Math.ceil((remainingSteps * 15) / 60); // ~15 seconds per step
  return `~${minutes} min remaining`;
};

const GeneratingReportSkeleton = ({ projectName, currentStatus }: GeneratingReportSkeletonProps) => {
  const currentStep = parseCurrentStep(currentStatus);
  const failedStep = parseFailedStep(currentStatus);
  const progress = Math.min((currentStep / TOTAL_STEPS) * 100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-auto text-center space-y-6 px-4">
        {/* Animated Logo */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/40 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
            <Rocket className="w-10 h-10 text-background animate-pulse" />
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
            {Math.round(progress)}% complete • {getEstimatedTime(currentStep)}
          </p>
        </div>

        {/* Steps - 2 columns on desktop, 1 column on mobile */}
        <div className="text-left bg-card/50 rounded-xl p-4 md:p-6 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-3">
            {steps.map((step) => {
              const Icon = step.icon;
              const isFailed = step.id === failedStep;
              const isActive = !isFailed && step.id === currentStep + 1;
              const isComplete = !isFailed && step.id <= currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 md:gap-3 transition-all duration-300 ${
                    isFailed ? "text-destructive" : isActive ? "text-accent" : isComplete ? "text-muted-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <div className={`w-6 h-6 md:w-8 md:h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isFailed
                      ? "bg-destructive/20 border-2 border-destructive"
                      : isActive 
                        ? "bg-accent/20 border-2 border-accent" 
                        : isComplete 
                          ? "bg-accent/10 border border-accent/50" 
                          : "bg-muted/30 border border-border/50"
                  }`}>
                    {isFailed ? (
                      <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                    ) : isActive ? (
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                    ) : isComplete ? (
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Icon className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <span className={`text-xs md:text-sm font-medium truncate flex-1 ${isFailed ? "text-destructive" : isActive ? "text-foreground" : ""}`}>
                    {step.label}
                  </span>
                  {isFailed && (
                    <span className="shrink-0 ml-auto text-[10px] md:text-xs text-destructive font-medium">
                      Failed
                    </span>
                  )}
                  {isActive && (
                    <span className="shrink-0 ml-auto text-[10px] md:text-xs text-accent animate-pulse">
                      In progress...
                    </span>
                  )}
                  {isComplete && (
                    <span className="shrink-0 ml-auto text-[10px] md:text-xs text-muted-foreground">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
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
