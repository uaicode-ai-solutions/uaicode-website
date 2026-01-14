import { Clock, TrendingUp, Calendar, Zap, Target, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField, parseScoreField, emptyStates } from "@/lib/reportDataUtils";
import { TimingAnalysis } from "@/types/report";

const TimingAnalysisSection = () => {
  const { report } = useReportContext();
  
  // Parse timing analysis from report or use empty state
  const timingScore = parseScoreField(report?.timing_score, 0);
  const rawTimingAnalysis = parseJsonField<any>(report?.timing_analysis, null);
  
  // Build the timing analysis object with proper structure
  const timingAnalysis = rawTimingAnalysis ? {
    timingScore: timingScore || rawTimingAnalysis.score || 0,
    verdict: rawTimingAnalysis.verdict || "Analysis pending...",
    macroTrends: rawTimingAnalysis.macroTrends || [],
    windowOfOpportunity: rawTimingAnalysis.windowOfOpportunity || { opens: "Now", closes: "TBD", reason: "" },
    firstMoverAdvantage: {
      score: rawTimingAnalysis.firstMoverAdvantage?.score || parseScoreField(report?.first_mover_score, 0),
      benefits: rawTimingAnalysis.firstMoverAdvantage?.benefits || rawTimingAnalysis.firstMoverAdvantage || []
    }
  } : emptyStates.timingAnalysis;

  const getRelevanceColor = (relevance: string) => {
    switch (relevance?.toLowerCase()) {
      case "high": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-muted/20 text-muted-foreground border-border/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };
  
  // Early return if no data
  if (!rawTimingAnalysis) {
    return (
      <section id="timing-analysis" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">The Timing</h2>
            <p className="text-sm text-muted-foreground">Timing analysis data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="timing-analysis" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Clock className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Timing</h2>
            <InfoTooltip side="right" size="sm">
              Analysis of why now is the right time to launch this product
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Why now is the right moment to launch</p>
        </div>
      </div>

      {/* Timing Score Display */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Score Circle */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-muted/20 border-4 border-accent/30 flex items-center justify-center">
                <div className="text-center">
                  <span className={`text-3xl font-bold ${getScoreColor(timingAnalysis.timingScore)}`}>
                    {timingAnalysis.timingScore}
                  </span>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-green-500">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            
            {/* Verdict */}
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-2">
                Excellent Timing
              </Badge>
              <p className="text-lg text-foreground">{timingAnalysis.verdict}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macro Trends & Window of Opportunity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Macro Trends Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Macro Trends</h3>
              <InfoTooltip size="sm">
                Large-scale market trends supporting this timing
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {timingAnalysis.macroTrends.map((trend, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground flex-1">{trend.trend}</p>
                    <Badge className={`${getRelevanceColor(trend.relevance)} text-xs`}>
                      {trend.relevance}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">{trend.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Window of Opportunity Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Window of Opportunity</h3>
              <InfoTooltip size="sm">
                The ideal timeframe to enter this market before saturation
              </InfoTooltip>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div>
                  <p className="text-xs text-muted-foreground">Opens</p>
                  <p className="text-lg font-bold text-green-400">{timingAnalysis.windowOfOpportunity.opens}</p>
                </div>
                <div className="h-8 w-px bg-border/50" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Closes</p>
                  <p className="text-lg font-bold text-orange-400">{timingAnalysis.windowOfOpportunity.closes}</p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Why this window?</p>
                <p className="text-sm text-foreground">{timingAnalysis.windowOfOpportunity.reason}</p>
              </div>

              {/* Timeline Visual */}
              <div className="relative pt-4">
                <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" />
                <div className="flex justify-between relative">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                    <span className="text-xs text-muted-foreground mt-2">Now</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-background" />
                    <span className="text-xs text-muted-foreground mt-2">12 mo</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-background" />
                    <span className="text-xs text-muted-foreground mt-2">24 mo</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* First Mover Advantage */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">First Mover Advantage</h3>
              <InfoTooltip size="sm">
                Benefits of entering the market before competitors
              </InfoTooltip>
              <Badge className="bg-accent/10 text-accent border-accent/20 ml-auto">
                Score: {timingAnalysis.firstMoverAdvantage.score}/100
              </Badge>
            </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {timingAnalysis.firstMoverAdvantage.benefits.map((benefit, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30 text-center">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-accent">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-green-500/20 flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-sm text-foreground/90">
            With a timing score of {timingAnalysis.timingScore}/100, market conditions are highly favorable. 
            The window of opportunity is open now and will begin closing in {timingAnalysis.windowOfOpportunity.closes}. 
            Acting now provides significant first-mover advantages.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TimingAnalysisSection;
