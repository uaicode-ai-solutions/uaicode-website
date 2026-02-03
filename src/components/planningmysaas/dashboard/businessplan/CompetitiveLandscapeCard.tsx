import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink, Star, Shield } from "lucide-react";
import { CompetitorFromAPI } from "@/lib/competitiveAnalysisUtils";

interface CompetitiveLandscapeCardProps {
  competitors: Record<string, CompetitorFromAPI> | null | undefined;
  insight?: string;
}

const CompetitiveLandscapeCard: React.FC<CompetitiveLandscapeCardProps> = ({
  competitors,
  insight,
}) => {
  // Convert keyed object to array
  const competitorList = competitors
    ? Object.values(competitors).filter((c): c is CompetitorFromAPI => 
        c !== null && typeof c === "object" && "saas_app_name" in c
      ).slice(0, 4)
    : [];

  if (competitorList.length === 0) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Competitive Landscape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Competitor analysis will appear once the research is complete...
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number | undefined) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-yellow-400";
    return "text-muted-foreground";
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Competitive Landscape
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitorList.map((competitor, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/10 border border-border/20 hover:bg-muted/20 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {competitor.saas_app_name}
                  </h4>
                  {competitor.saas_app_positioning && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {competitor.saas_app_positioning}
                    </p>
                  )}
                </div>
                {competitor.company_website && (
                  <a
                    href={competitor.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Metrics Row */}
              <div className="flex flex-wrap gap-2 mb-3">
                {competitor.saas_app_market_share_estimate && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {competitor.saas_app_market_share_estimate}
                  </Badge>
                )}
                {competitor.priority_score && (
                  <Badge className={`text-xs ${getPriorityColor(competitor.priority_score)}`}>
                    {competitor.priority_score} threat
                  </Badge>
                )}
              </div>

              {/* Pricing */}
              {competitor.saas_app_price_range && (
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="text-foreground font-medium">
                    {competitor.saas_app_price_range}
                  </span>
                  {competitor.saas_app_pricing_type && (
                    <span className="text-xs ml-1">
                      ({competitor.saas_app_pricing_type.replace(/_/g, " ")})
                    </span>
                  )}
                </p>
              )}

              {/* Calculated Score */}
              {competitor.calculated_score && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/20">
                  <Star className={`h-3.5 w-3.5 ${getScoreColor(competitor.calculated_score)}`} />
                  <span className="text-xs text-muted-foreground">
                    Score:
                  </span>
                  <span className={`text-xs font-medium ${getScoreColor(competitor.calculated_score)}`}>
                    {competitor.calculated_score}/100
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Insight */}
        {insight && (
          <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
            <p className="text-sm text-foreground italic">"{insight}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitiveLandscapeCard;
