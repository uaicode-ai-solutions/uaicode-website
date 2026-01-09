import { Target, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { marketOpportunityData } from "@/lib/dashboardMockData";
import ScoreCircle from "./ui/ScoreCircle";

const MarketOpportunity = () => {
  const { tam, tamDescription, sam, samDescription, som, somDescription, growthRate, growthPeriod, marketMaturity, opportunityScore } = marketOpportunityData;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Market Opportunity</h2>
          <p className="text-muted-foreground">Total addressable market and growth potential</p>
        </div>
      </div>

      {/* Opportunity Score */}
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <ScoreCircle score={opportunityScore} label="Score" color="accent" size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Market Opportunity Score</h3>
                <p className="text-sm text-muted-foreground">Excellent opportunity with strong growth trajectory</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                    {marketMaturity}
                  </span>
                  <span className="flex items-center gap-1 text-green-500 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    {growthRate} {growthPeriod}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TAM SAM SOM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Zap className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">TAM</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">{tam}</div>
            <p className="text-sm text-muted-foreground">{tamDescription}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <Target className="h-4 w-4 text-purple-500" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SAM</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">{sam}</div>
            <p className="text-sm text-muted-foreground">{samDescription}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SOM</span>
            </div>
            <div className="text-3xl font-bold text-accent mb-2">{som}</div>
            <p className="text-sm text-muted-foreground">{somDescription}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketOpportunity;
