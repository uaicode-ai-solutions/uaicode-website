import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface StrategicVerdictCardProps {
  verdict: string | null | undefined;
  recommendations: string[] | null | undefined;
  viabilityScore?: number;
  viabilityLabel?: string;
}

const getVerdictStyle = (score: number | undefined) => {
  if (!score) return { bg: "bg-muted/10", border: "border-border/20", icon: "text-muted-foreground" };
  if (score >= 80) return { bg: "bg-green-500/10", border: "border-green-500/30", icon: "text-green-400" };
  if (score >= 60) return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "text-yellow-400" };
  return { bg: "bg-red-500/10", border: "border-red-500/30", icon: "text-red-400" };
};

const StrategicVerdictCard: React.FC<StrategicVerdictCardProps> = ({
  verdict,
  recommendations,
  viabilityScore,
  viabilityLabel,
}) => {
  const verdictStyle = getVerdictStyle(viabilityScore);
  const hasRecommendations = recommendations && recommendations.length > 0;

  if (!verdict && !hasRecommendations) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Strategic Verdict
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Lightbulb className="h-5 w-5 mr-2 animate-pulse" />
            Strategic analysis will appear once generated...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-card ${verdictStyle.border} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className={`h-5 w-5 ${verdictStyle.icon}`} />
            Strategic Verdict
            <InfoTooltip term="Strategic Verdict">
              The AI's final assessment of your business idea, combining market analysis, financial viability, and competitive positioning into a clear go/no-go recommendation.
            </InfoTooltip>
          </CardTitle>
          {viabilityLabel && (
            <div className="flex items-center gap-1">
              <Badge className={`${verdictStyle.bg} ${verdictStyle.border}`}>
                <Rocket className={`h-3.5 w-3.5 mr-1 ${verdictStyle.icon}`} />
                <span className={verdictStyle.icon}>{viabilityLabel}</span>
              </Badge>
              <InfoTooltip term="Viability Label" size="sm">
                A qualitative rating based on the viability score: Strong (80+), Promising (60-79), or Needs Work (below 60).
              </InfoTooltip>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {verdict && (
          <div className={`p-5 rounded-lg ${verdictStyle.bg} border ${verdictStyle.border}`}>
            <p className="text-foreground leading-relaxed">{verdict}</p>
          </div>
        )}

        {hasRecommendations && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-accent" />
              Next Steps
              <InfoTooltip term="Next Steps" size="sm">
                Prioritized actions recommended by the AI to move your project forward, based on the analysis findings.
              </InfoTooltip>
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/10 border border-border/20 hover:bg-muted/20 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Ready to move forward?
          </p>
          <p className="text-foreground font-medium">
            Schedule a call with our team to discuss your roadmap
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategicVerdictCard;
