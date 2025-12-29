import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calendar, DollarSign, CheckCircle2 } from "lucide-react";

interface ReportHeaderProps {
  companyName: string;
  saasIdea: string;
  viabilityScore: number;
  complexityScore: number;
  recommendedPlan: string;
  launchTimeline: string;
  budgetRange: string;
}

export function ReportHeader({
  companyName,
  saasIdea,
  viabilityScore,
  complexityScore,
  recommendedPlan,
  launchTimeline,
  budgetRange,
}: ReportHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 72) return "text-green-400";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Outstanding Opportunity";
    if (score >= 80) return "Excellent Opportunity";
    if (score >= 75) return "Strong Potential";
    if (score >= 72) return "Good Potential";
    return "Promising";
  };

  const getViabilityExplanation = (score: number) => {
    if (score >= 80) return "Excellent market fit - strong potential for rapid growth and adoption.";
    if (score >= 72) return "Good market opportunity - with the right execution, this can succeed.";
    return "Promising opportunity that needs strategic positioning.";
  };

  const getComplexityLabel = (score: number) => {
    if (score >= 55) return "Substantial";
    if (score >= 45) return "Moderate";
    return "Manageable";
  };

  const formatTimeline = (timeline: string) => {
    const timelineMap: Record<string, string> = {
      asap: "Within 3 months",
      this_year: "3-6 months",
      next_year: "6-12 months",
      flexible: "Flexible timing",
    };
    return timelineMap[timeline] || timeline;
  };

  const formatBudget = (budget: string) => {
    const budgetMap: Record<string, string> = {
      "10k-25k": "$10K - $25K",
      "25k-50k": "$25K - $50K",
      "50k-100k": "$50K - $100K",
      "100k+": "$100K+",
      guidance: "Needs guidance",
    };
    return budgetMap[budget] || budget;
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-accent text-accent text-xs">
          AI-Generated Feasibility Report
        </Badge>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {companyName}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          {saasIdea}
        </p>
      </div>

      {/* Confidence Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            94% of similar projects delivered successfully by UaiCode
          </span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* Viability Score */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Viability Score</span>
            </div>
            <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">
              {getScoreLabel(viabilityScore)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className={`text-2xl font-bold ${getScoreColor(viabilityScore)}`}>
                {viabilityScore}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#111415] overflow-hidden">
              <div 
                className="h-full rounded-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${viabilityScore}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {getViabilityExplanation(viabilityScore)}
          </p>
        </div>

        {/* Complexity Score */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Complexity Score</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {getComplexityLabel(complexityScore)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-accent">
                {complexityScore}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#111415] overflow-hidden">
              <div 
                className="h-full rounded-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${complexityScore}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {complexityScore >= 45 
              ? "This project requires expert development - our team specializes in these challenges."
              : "A well-defined scope that our team can deliver efficiently."}
          </p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <Target className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-foreground">
            Recommended: <strong className="text-accent">{recommendedPlan}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-foreground">
            Timeline: <strong>{formatTimeline(launchTimeline)}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
          <DollarSign className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-foreground">
            Budget: <strong>{formatBudget(budgetRange)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
