import { Users, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const CompetitorsDifferentiationSection = () => {
  const { competitors, competitiveAdvantage } = reportData;

  return (
    <section id="competitors-differentiation" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Users className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Competitors & Differentiation</h2>
            <InfoTooltip side="right" size="sm">
              Analysis of your main competitors and your unique advantages in the market.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Know your competition</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Card 1: Top Competitors */}
        <Card className="metric-card-premium bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Top Competitors</h3>
              <InfoTooltip size="sm">
                Main competitors in your market segment with their pricing and identified weaknesses.
              </InfoTooltip>
            </div>
            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <span className="font-medium text-foreground text-sm">{competitor.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-accent/30 text-accent shrink-0">
                      {competitor.price}
                    </Badge>
                  </div>
                  <p className="text-xs text-red-400">
                    <span className="font-medium">Weakness:</span> {competitor.weakness}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Your Competitive Advantages */}
        <Card className="metric-card-premium bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-green-400" />
              <h3 className="font-semibold text-foreground text-sm">Your Advantages</h3>
              <InfoTooltip size="sm">
                What makes your product unique compared to existing solutions.
              </InfoTooltip>
            </div>
            
            {/* Overall Advantage */}
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
              <p className="text-sm text-green-400 font-medium">{competitiveAdvantage}</p>
            </div>

            {/* Advantages per Competitor */}
            <div className="space-y-2">
              {competitors.map((competitor, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-background/30"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  <span className="text-xs text-muted-foreground">vs {competitor.name}:</span>
                  <span className="text-xs text-foreground">{competitor.yourAdvantage}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompetitorsDifferentiationSection;
