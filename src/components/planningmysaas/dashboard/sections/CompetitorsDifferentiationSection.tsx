import { Swords, ExternalLink, Tag, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField, emptyStates } from "@/lib/reportDataUtils";
import { Competitor, CompetitiveAdvantage } from "@/types/report";

// Flexible type to handle both string[] and object[] from AI
type AdvantageItem = string | { name?: string; advantage?: string; description?: string; competitor_gap?: string; competitorGap?: string };

const CompetitorsDifferentiationSection = () => {
  const { report } = useReportContext();
  
  // Parse competitors and advantages from report
  const competitors = parseJsonField<Competitor[]>(report?.competitors, []);
  const rawAdvantages = parseJsonField<AdvantageItem[]>(report?.competitive_advantages, []);
  
  // Normalize advantages to always get the display text
  const getAdvantageText = (item: AdvantageItem): string => {
    if (typeof item === 'string') return item;
    return item.name || item.advantage || item.description || 'Unknown advantage';
  };
  
  // Calculate max price for chart scaling
  const maxPrice = competitors.length > 0 ? Math.max(...competitors.map(c => c.price || 0)) : 100;
  
  // Early return if no data
  if (competitors.length === 0) {
    return (
      <section id="competitors-differentiation" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Swords className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Competitive Analysis</h2>
            <p className="text-sm text-muted-foreground">Competitor data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="competitors-differentiation" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Swords className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Competitive Analysis</h2>
            <InfoTooltip side="right" size="sm">
              Analysis of your main competitors and your unique advantages in the market.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Know your competition</p>
        </div>
      </div>

      {/* Competitors Grid - 3x2 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.map((competitor, index) => (
          <Card key={index} className="metric-card-premium bg-card/50 border-border/30 hover:border-accent/30 transition-colors flex flex-col h-full">
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-foreground text-sm">{competitor.name}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mb-4 flex-1">
                {competitor.description}
              </p>
              <div className="flex justify-between items-end mt-auto">
                <div>
                  <span className="text-2xl font-bold text-foreground">${competitor.price}</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant="outline" 
                    className="text-[10px] px-2 py-0.5 bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                  >
                    {competitor.priceModel}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-[10px] px-2 py-0.5 bg-accent/10 border-accent/30 text-accent"
                  >
                    {competitor.targetMarket}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Row: Price Positioning + Your Advantages */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Price Positioning Chart */}
        <Card className="metric-card-premium bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Price Positioning</h3>
              <InfoTooltip size="sm">
                Comparison of competitor pricing in your market segment.
              </InfoTooltip>
            </div>
            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-muted-foreground truncate">{competitor.name}</span>
                  <div className="flex-1 h-3 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${maxPrice > 0 ? (competitor.price / maxPrice) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-16 text-right">
                    {competitor.price === 0 ? "Free" : `$${competitor.price}/mo`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Competitive Advantages */}
        <Card className="metric-card-premium bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-green-400" />
              <h3 className="font-semibold text-foreground text-sm">Your Competitive Advantages</h3>
              <InfoTooltip size="sm">
                Features and capabilities that set you apart from competitors.
              </InfoTooltip>
            </div>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
              {(rawAdvantages || []).map((advantage, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="p-1 rounded bg-accent/10">
                    <Zap className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-xs text-foreground">{getAdvantageText(advantage)}</span>
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
