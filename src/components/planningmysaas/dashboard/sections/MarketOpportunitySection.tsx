import { Target, TrendingUp, Users, ArrowRight, CheckCircle2, Globe, Crosshair } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const MarketOpportunitySection = () => {
  const { market, competitors, competitiveAdvantage } = reportData;

  const funnelData = [
    { 
      ...market.tam, 
      icon: Globe,
      gradient: "from-accent/20 to-accent/10",
      tooltipText: "Total Addressable Market - The entire global market demand for your product/service category."
    },
    { 
      ...market.sam, 
      icon: Target,
      gradient: "from-accent/40 to-accent/25",
      tooltipText: "Serviceable Available Market - The segment of TAM you can realistically serve based on geography and capabilities."
    },
    { 
      ...market.som, 
      icon: Crosshair,
      gradient: "from-accent/60 to-accent/45",
      tooltipText: "Serviceable Obtainable Market - The portion of SAM you can capture in the first 3 years."
    },
  ];

  const pyramidWidths = ["100%", "75%", "50%"];

  return (
    <section id="market-opportunity" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Opportunity</h2>
            <InfoTooltip side="right" size="sm">
              Market analysis including TAM, SAM, SOM calculations, competitor landscape, and your competitive advantages.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Market size and competition</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Market Funnel */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Market Size</h3>
              <Badge variant="outline" className="border-accent/30 text-accent gap-1">
                <TrendingUp className="h-3 w-3" />
                {market.growthRate} YoY
              </Badge>
            </div>

            {/* Pyramid Visualization */}
            <div className="flex flex-col items-center gap-2 py-2">
              {funnelData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="relative w-full transition-all duration-300"
                    style={{ maxWidth: pyramidWidths[index] }}
                  >
                    <div
                      className={`
                        relative py-3 px-4 transition-all duration-300
                        bg-gradient-to-r ${item.gradient}
                        hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/10
                        border border-accent/20 hover:border-accent/40
                        rounded-lg
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center border border-accent/30">
                            <IconComponent className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-foreground/60 font-medium uppercase tracking-wide">
                                {item.label}
                              </span>
                              <InfoTooltip side="right" size="sm">
                                {item.tooltipText}
                              </InfoTooltip>
                            </div>
                            <div className="text-lg font-bold text-foreground">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile-friendly description - always visible */}
                      <p className="text-xs text-muted-foreground mt-2 lg:hidden">
                        {item.description}
                      </p>
                    </div>

                    {/* Desktop tooltip on hover */}
                    <div className="hidden lg:block absolute left-[105%] top-1/2 -translate-y-1/2 
                                    opacity-0 hover:opacity-100 group-hover:opacity-100 pointer-events-none
                                    bg-card border border-border/50 rounded-lg p-2.5 
                                    shadow-xl z-20 w-44 transition-opacity">
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conclusion */}
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90">{market.conclusion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitors & Advantage */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">Competitors & Differentiation</h3>
            </div>

            {/* Competitors List */}
            <div className="space-y-3 mb-4">
              {competitors.map((competitor, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-foreground text-sm">{competitor.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {competitor.price}
                    </Badge>
                  </div>
                  <p className="text-xs text-red-400/80 mb-1.5">
                    <span className="text-muted-foreground">Weakness:</span> {competitor.weakness}
                  </p>
                  <div className="flex items-start gap-1.5 text-xs">
                    <ArrowRight className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-green-400/90">
                      <span className="font-medium">Your advantage:</span> {competitor.yourAdvantage}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Your Competitive Advantage */}
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <h4 className="text-xs font-medium text-accent mb-1.5 flex items-center gap-1">
                Your Competitive Advantage
                <InfoTooltip side="top" size="sm">
                  What makes your product unique compared to existing solutions in the market.
                </InfoTooltip>
              </h4>
              <p className="text-foreground text-sm">{competitiveAdvantage}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketOpportunitySection;
