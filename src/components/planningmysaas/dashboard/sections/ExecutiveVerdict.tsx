import { 
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Rocket,
  Target,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { SummarySection, OpportunitySection, safeNumber } from "@/types/report";
import { useSmartFallbackField } from "@/hooks/useSmartFallbackField";
import { FallbackSkeleton, CardContentSkeleton } from "@/components/ui/fallback-skeleton";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";

const ExecutiveVerdict = () => {
  const { report, reportData } = useReportContext();
  
  // Get financial metrics for score-based badge
  const marketType = report?.market_type || undefined;
  const metrics = useFinancialMetrics(reportData, marketType);
  
  // Get summary data from summary_section JSONB (prefer over legacy fields)
  const summaryData = reportData?.summary_section as SummarySection | null;
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  
  // Get viability score for dynamic badge
  const viabilityScore = safeNumber(
    (reportData?.hero_score_section as { score?: number } | null)?.score ?? 
    (reportData?.section_investment as { viability_score?: number } | null)?.viability_score,
    70
  );
  
  // Use smart fallback for verdict
  const rawVerdict = summaryData?.verdict || report?.verdict;
  const { value: verdict, isLoading: verdictLoading } = useSmartFallbackField<string>({
    fieldPath: "summary_section.verdict",
    currentValue: rawVerdict,
  });

  // Use smart fallback for verdict_summary
  const rawVerdictSummary = summaryData?.verdict_summary || report?.verdict_summary;
  const { value: verdictSummary, isLoading: summaryLoading } = useSmartFallbackField<string>({
    fieldPath: "summary_section.verdict_summary",
    currentValue: rawVerdictSummary,
  });

  // Parse executive summary into bullet points for better readability
  const summaryParagraphs = (verdictSummary || "").split('\n\n').filter(p => p.trim());
  
  // Extract key opportunity from data
  const tamValue = opportunityData?.tam_value || "...";
  const marketGrowth = opportunityData?.market_growth_rate || "18%";
  const ltvCac = metrics.ltvCacRatioNum || metrics.ltvCacCalculated || 0;
  const breakEven = metrics.breakEvenMonthsNum || 0;
  
  // Dynamic badge based on viability score
  const getViabilityBadge = () => {
    if (viabilityScore >= 80) {
      return { label: "Strong Opportunity", icon: "🟢", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/30" };
    }
    if (viabilityScore >= 60) {
      return { label: "Proceed with Strategy", icon: "🟡", color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/30" };
    }
    return { label: "Needs Validation", icon: "🔴", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/30" };
  };
  
  const viabilityBadge = getViabilityBadge();
  
  // Path to success timeline
  const pathToSuccess = [
    { label: "Launch", months: "0-3mo", icon: Rocket, description: "MVP deployment" },
    { label: "Traction", months: "4-12mo", icon: TrendingUp, description: "First paying customers" },
    { label: "Profitability", months: `${Math.max(12, breakEven)}+mo`, icon: Target, description: "Break-even reached" },
  ];

  return (
    <section id="executive-verdict" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <ShieldCheck className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Summary</h2>
            <InfoTooltip side="right" size="sm">
              AI-powered executive summary analyzing your SaaS idea's viability and market potential.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Executive summary of your SaaS analysis</p>
        </div>
      </div>

      {/* Viability Score Badge - Dynamic based on score */}
      <div className={`flex items-center justify-between p-4 rounded-xl ${viabilityBadge.bgColor} border ${viabilityBadge.borderColor}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${viabilityBadge.bgColor}`}>
            <CheckCircle2 className={`h-6 w-6 ${viabilityBadge.color}`} />
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Our Recommendation:</span>
            {verdictLoading ? (
              <FallbackSkeleton size="lg" className="mt-1" />
            ) : (
              <div className={`text-xl font-bold ${viabilityBadge.color}`}>
                {verdict || "..."}
              </div>
            )}
          </div>
        </div>
        <Badge className={`${viabilityBadge.bgColor} ${viabilityBadge.borderColor} ${viabilityBadge.color}`}>
          {viabilityBadge.icon} {viabilityBadge.label}
        </Badge>
      </div>

      {/* Key Opportunity Card */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">Key Opportunity</h3>
            <InfoTooltip side="right" size="sm">
              The primary market opportunity identified for your SaaS idea.
            </InfoTooltip>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                TAM: {tamValue}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                Growth: {marketGrowth}
              </Badge>
            </div>
            {ltvCac >= 2 && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                  LTV/CAC: {ltvCac.toFixed(1)}x
                </Badge>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Large addressable market with strong growth trajectory creates significant opportunity for well-executed entry.
          </p>
        </CardContent>
      </Card>

      {/* Path to Success Timeline */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">Path to Success</h3>
            <InfoTooltip side="right" size="sm">
              Typical timeline milestones for SaaS ventures in your market.
            </InfoTooltip>
          </div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-accent/50 via-amber-400/50 to-green-400/50 rounded-full" />
            
            {/* Timeline steps */}
            <div className="relative flex justify-between">
              {pathToSuccess.map((step, index) => (
                <div key={step.label} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    index === 0 ? 'bg-accent/20 border-2 border-accent/50' :
                    index === 1 ? 'bg-amber-500/20 border-2 border-amber-500/50' :
                    'bg-green-500/20 border-2 border-green-500/50'
                  }`}>
                    <step.icon className={`h-5 w-5 ${
                      index === 0 ? 'text-accent' :
                      index === 1 ? 'text-amber-400' :
                      'text-green-400'
                    }`} />
                  </div>
                  <div className="mt-3">
                    <span className="font-medium text-foreground text-sm">{step.label}</span>
                    <p className="text-[10px] text-muted-foreground">{step.months}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Analysis Summary */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-foreground text-sm">Analysis Summary</h3>
            <InfoTooltip side="right" size="sm">
              AI-generated executive summary of your SaaS idea's viability and market potential.
            </InfoTooltip>
          </div>
          {summaryLoading ? (
            <CardContentSkeleton lines={4} />
          ) : summaryParagraphs.length > 0 ? (
            <div className="space-y-3">
              {summaryParagraphs.map((paragraph, index) => (
                <div 
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-muted/10 border border-border/20"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {paragraph}
                    {paragraph.includes('LTV/CAC') && (
                      <InfoTooltip term="LTV/CAC Ratio" side="top">
                        Customer Lifetime Value divided by Customer Acquisition Cost. A ratio above 3x indicates healthy unit economics.
                      </InfoTooltip>
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 rounded-lg bg-muted/10">
              <AlertCircle className="h-4 w-4" />
              <span>No analysis summary available</span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ExecutiveVerdict;
