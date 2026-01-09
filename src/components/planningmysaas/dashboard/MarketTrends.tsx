import { TrendingUp, ArrowUpRight, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { marketTrends } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const MarketTrends = () => {
  const getImpactColor = (impact: string) => {
    if (impact === "High") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (impact === "Medium") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-muted text-muted-foreground";
  };

  const getTrendIcon = (relevance: string) => {
    if (relevance === "Direct") return <ArrowUpRight className="w-4 h-4" />;
    return <ArrowRight className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl icon-container-premium">
          <TrendingUp className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Key Market Trends</h2>
          <p className="text-muted-foreground">Stay ahead of the curve</p>
        </div>
      </div>

      {/* Trends Grid - Visual Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketTrends.slice(0, 6).map((trend, index) => (
          <Card 
            key={index} 
            className="metric-card-premium bg-card/50 border-border/30 hover:border-accent/30 group"
          >
            <CardContent className="p-5">
              {/* Header with trend icon */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${trend.impact === "High" ? "bg-green-500/10" : "bg-amber-500/10"}`}>
                  {getTrendIcon(trend.relevance)}
                </div>
                <Badge className={getImpactColor(trend.impact)}>
                  {trend.impact}
                </Badge>
              </div>

              {/* Trend Name */}
              <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-accent transition-colors">
                {trend.trend}
              </h3>

              {/* Relevance Badge */}
              <Badge 
                variant="outline" 
                className={`mb-3 text-xs ${
                  trend.relevance === "Direct" 
                    ? "border-accent/30 text-accent" 
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {trend.relevance} Impact
              </Badge>

              {/* Description - Truncated */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {trend.description}
              </p>

              {/* Footer - Opportunity & Timeframe */}
              <div className="pt-4 border-t border-border/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Opportunity:</span>
                  <span className="text-xs text-accent font-medium">{trend.opportunity}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {trend.timeframe}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketTrends;