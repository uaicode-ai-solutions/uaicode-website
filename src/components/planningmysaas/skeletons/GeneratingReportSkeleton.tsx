import { Loader2, DollarSign, Target, BarChart3, TrendingUp, Users, Tag, Megaphone, Rocket, FileText, Trophy, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GeneratingReportSkeletonProps {
  projectName: string;
  currentStatus?: string;
}

// Steps in sequential order 1→11 (single column layout)
const STEPS = [
  { label: "Initialize Report", icon: Zap },
  { label: "Investment Analysis", icon: DollarSign },
  { label: "Market Benchmarks", icon: Target },
  { label: "Competitor Research", icon: BarChart3 },
  { label: "Market Opportunity", icon: TrendingUp },
  { label: "Customer Profiling", icon: Users },
  { label: "Pricing Strategy", icon: Tag },
  { label: "Paid Media Analysis", icon: Megaphone },
  { label: "Growth Projections", icon: Rocket },
  { label: "Executive Summary", icon: FileText },
  { label: "Final Scoring", icon: Trophy },
];

const TOTAL_STEPS = STEPS.length;

interface ParsedStatus {
  lastCompleted: number; // index of last completed step (-1 if none)
  failed: number | null; // index of failed step (null if none)
  inProgress: number | null; // index of in-progress step (null if none)
}

/**
 * Parse status string into structured data
 * Status format: "Step X Label - Completed|In Progress|Fail"
 */
const parseStatus = (status: string | undefined): ParsedStatus => {
  if (!status) {
    return { lastCompleted: -1, failed: null, inProgress: null };
  }
  
  const normalized = status.trim().toLowerCase();
  
  // "completed" = all steps done
  if (normalized === "completed") {
    return { lastCompleted: TOTAL_STEPS - 1, failed: null, inProgress: null };
  }
  
  // Parse "Step X ..." pattern
  const match = status.match(/Step (\d+)/i);
  if (!match) {
    return { lastCompleted: -1, failed: null, inProgress: null };
  }
  
  const stepNum = parseInt(match[1]); // 1-11
  const stepIndex = stepNum - 1;      // 0-10
  
  if (normalized.includes("fail")) {
    return { lastCompleted: stepIndex - 1, failed: stepIndex, inProgress: null };
  }
  
  if (normalized.includes("in progress")) {
    return { lastCompleted: stepIndex - 1, failed: null, inProgress: stepIndex };
  }
  
  if (normalized.includes("completed")) {
    return { lastCompleted: stepIndex, failed: null, inProgress: null };
  }
  
  // Default: assume in progress
  return { lastCompleted: stepIndex - 1, failed: null, inProgress: stepIndex };
};

/**
 * Get estimated remaining time based on progress
 */
const getEstimatedTime = (lastCompleted: number, hasFailed: boolean): string => {
  if (hasFailed) return "Generation stopped";
  const remainingSteps = TOTAL_STEPS - (lastCompleted + 1);
  if (remainingSteps <= 0) return "Almost done...";
  if (remainingSteps <= 2) return "Less than a minute";
  const minutes = Math.ceil((remainingSteps * 15) / 60);
  return `~${minutes} min remaining`;
};

const GeneratingReportSkeleton = ({ projectName, currentStatus }: GeneratingReportSkeletonProps) => {
  const { lastCompleted, failed, inProgress } = parseStatus(currentStatus);
  const hasFailed = failed !== null;
  
  // Progress bar calculation
  const completedCount = lastCompleted + 1;
  const progress = Math.min((completedCount / TOTAL_STEPS) * 100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-lg w-full mx-auto text-center space-y-6 px-4">
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
            {Math.round(progress)}% complete • {getEstimatedTime(lastCompleted, hasFailed)}
          </p>
        </div>

        {/* Steps - Single Column */}
        <div className="text-left bg-card/50 rounded-xl p-4 md:p-6 border border-border/50">
          <div className="space-y-2">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const Icon = step.icon;
              
              const isComplete = index <= lastCompleted;
              const isActive = index === inProgress;
              const isFailed = index === failed;
              const isPending = !isComplete && !isActive && !isFailed;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    isFailed 
                      ? "text-destructive" 
                      : isActive 
                        ? "text-accent" 
                        : isComplete 
                          ? "text-muted-foreground" 
                          : "text-muted-foreground/50"
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isFailed
                      ? "bg-destructive/20 border-2 border-destructive"
                      : isActive 
                        ? "bg-accent/20 border-2 border-accent" 
                        : isComplete 
                          ? "bg-accent/10 border border-accent/50" 
                          : "bg-muted/30 border border-border/50"
                  }`}>
                    {isFailed ? (
                      <XCircle className="w-4 h-4" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <span className={`text-sm font-medium flex-1 ${
                    isFailed ? "text-destructive" : isActive ? "text-foreground" : ""
                  }`}>
                    {stepNumber}. {step.label}
                  </span>
                  
                  {/* Status Badge */}
                  {isFailed && (
                    <span className="text-xs text-destructive font-medium">
                      Failed
                    </span>
                  )}
                  {isActive && (
                    <span className="text-xs text-accent animate-pulse">
                      In progress...
                    </span>
                  )}
                  {isComplete && (
                    <span className="text-xs text-muted-foreground">
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
