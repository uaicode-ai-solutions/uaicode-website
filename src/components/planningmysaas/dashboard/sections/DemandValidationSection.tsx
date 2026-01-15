import { Search, TrendingUp, MessageSquare, Users, Lightbulb, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField, emptyStates } from "@/lib/reportDataUtils";
import { DemandValidation } from "@/types/report";

const DemandValidationSection = () => {
  const { report } = useReportContext();
  
  // Parse demand validation from report
  const rawDemandValidation = parseJsonField<DemandValidation>(report?.demand_validation, null);
  
  const demandValidation = rawDemandValidation || emptyStates.demandValidation;

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (intensity >= 60) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "negative": return "text-red-400";
      case "positive": return "text-green-400";
      default: return "text-yellow-400";
    }
  };
  
  // Early return if no data
  if (!rawDemandValidation) {
    return (
      <section id="demand-validation" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Search className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">The Demand</h2>
            <p className="text-sm text-muted-foreground">Demand validation data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="demand-validation" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Search className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Demand</h2>
            <InfoTooltip side="right" size="sm">
              Evidence-based validation of real market demand for your solution
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Real demand signals and validation evidence</p>
        </div>
      </div>

      {/* Market Signals & Pain Points */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Signals Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Market Signals</h3>
              <InfoTooltip size="sm">
                Quantitative data indicating market interest in your solution
              </InfoTooltip>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
                <p className="text-2xl font-bold text-accent">{((demandValidation.searchVolume ?? 0) / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">Monthly Searches</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
                <p className="text-2xl font-bold text-accent">{demandValidation.trendsScore ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Trends Score</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-2xl font-bold text-green-400">{demandValidation.growthRate ?? '0%'}</p>
                <p className="text-xs text-muted-foreground mt-1">YoY Growth</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span className="text-sm text-foreground">Strong search demand indicates active problem-solving behavior</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Pain Points Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Customer Pain Points</h3>
              <InfoTooltip size="sm">
                Validated pain points ranked by intensity
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {(demandValidation.painPoints || []).map((point, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{point.pain}</p>
                      <p className="text-xs text-muted-foreground mt-1">Source: {point.source}</p>
                    </div>
                    <Badge className={`${getIntensityColor(point.intensity ?? 0)} text-xs`}>
                      {point.intensity ?? 0}% intensity
                    </Badge>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500/60 to-red-500 rounded-full"
                      style={{ width: `${point.intensity ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Evidence & Validation Methods */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Demand Evidence Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Demand Evidence</h3>
              <InfoTooltip size="sm">
                Social proof and user behavior data validating demand
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {(demandValidation.evidences || []).map((evidence, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{evidence.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {(evidence.count ?? 0).toLocaleString()} data points
                      </span>
                      {evidence.growth && (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                          {evidence.growth}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {evidence.sentiment && (
                      <span className={`text-sm font-medium ${getSentimentColor(evidence.sentiment)}`}>
                        {evidence.sentiment}
                      </span>
                    )}
                    {evidence.opportunity && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-32">{evidence.opportunity}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Validation Methods Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Quick Validation Methods</h3>
              <InfoTooltip size="sm">
                Recommended ways to further validate demand before full build
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {(demandValidation.validationMethods || []).map((method, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30 hover:border-accent/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{method.method}</span>
                    <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                      {method.timeframe}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Investment: {method.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-green-500/20 flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-sm text-foreground/90">
            Strong demand signals detected with {demandValidation.trendsScore ?? 0}/100 trends score and {demandValidation.growthRate ?? '0%'} year-over-year growth. 
            Customer pain points are validated across multiple sources, indicating a genuine market need for this solution.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemandValidationSection;
