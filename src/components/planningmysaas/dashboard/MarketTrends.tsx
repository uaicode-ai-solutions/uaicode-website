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
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg icon-container-premium">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Key Market Trends</h2>
          <p className="text-sm text-muted-foreground">Stay ahead of the curve</p>
        </div>
      </div>

      {/* Trends Grid - Visual Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {marketTrends.slice(0, 6).map((trend, index) => (
          <Card 
            key={index} 
            className="metric-card-premium bg-card/50 border-border/30 hover:border-accent/30 group"
          >
            <CardContent className="p-4">
              {/* Header with trend icon */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-1.5 rounded-md ${trend.impact === "High" ? "bg-green-500/10" : "bg-amber-500/10"}`}>
                  {getTrendIcon(trend.relevance)}
                </div>
                <Badge className={`${getImpactColor(trend.impact)} text-[10px]`}>
                  {trend.impact}
                </Badge>
              </div>

              {/* Trend Name */}
              <h3 className="font-semibold text-foreground text-sm mb-1.5 group-hover:text-accent transition-colors">
                {trend.trend}
              </h3>

              {/* Relevance Badge */}
              <Badge 
                variant="outline" 
                className={`mb-2 text-[10px] ${
                  trend.relevance === "Direct" 
                    ? "border-accent/30 text-accent" 
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {trend.relevance} Impact
              </Badge>

              {/* Description - Truncated */}
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {trend.description}
              </p>

              {/* Footer - Opportunity & Timeframe */}
              <div className="pt-3 border-t border-border/30 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Opportunity:</span>
                  <span className="text-[10px] text-accent font-medium">{trend.opportunity}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
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