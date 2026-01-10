import { Target, TrendingUp, Users, ArrowRight, CheckCircle2, Globe, Crosshair } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reportData } from "@/lib/reportMockData";

const MarketOpportunitySection = () => {
  const { market, competitors, competitiveAdvantage } = reportData;

  const funnelData = [
    { 
      ...market.tam, 
      icon: Globe,
      gradient: "from-accent/25 to-accent/15",
      hoverGradient: "hover:from-accent/35 hover:to-accent/25",
    },
    { 
      ...market.sam, 
      icon: Target,
      gradient: "from-accent/45 to-accent/30",
      hoverGradient: "hover:from-accent/55 hover:to-accent/40",
    },
    { 
      ...market.som, 
      icon: Crosshair,
      gradient: "from-accent/70 to-accent/50",
      hoverGradient: "hover:from-accent/80 hover:to-accent/60",
    },
  ];

  const pyramidWidths = ["100%", "72%", "44%"];
  const trapezoidClips = [
    "polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)",
    "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
    "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
  ];

  return (
    <section id="market-opportunity" className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Opportunity</h2>
          <p className="text-sm text-muted-foreground">Market size and competition</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Funnel - Enhanced Pyramid */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Market Size</h3>
              <Badge variant="outline" className="border-accent/30 text-accent gap-1">
                <TrendingUp className="h-3 w-3" />
                {market.growthRate} YoY
              </Badge>
            </div>

            {/* Pyramid Visualization */}
            <div className="flex flex-col items-center gap-2 py-4">
              {funnelData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="relative group cursor-pointer transition-all duration-300"
                    style={{ width: pyramidWidths[index] }}
                  >
                    {/* Trapezoid Shape */}
                    <div
                      className={`
                        relative py-4 px-5 transition-all duration-300
                        bg-gradient-to-r ${item.gradient} ${item.hoverGradient}
                        group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-accent/20
                        border border-accent/20 group-hover:border-accent/40
                      `}
                      style={{
                        clipPath: trapezoidClips[index],
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center border border-accent/30 shadow-inner">
                            <IconComponent className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <span className="text-xs text-foreground/60 font-medium uppercase tracking-wide">
                              {item.label}
                            </span>
                            <div className="text-xl font-bold text-foreground">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description tooltip on hover */}
                    <div className="absolute left-[105%] top-1/2 -translate-y-1/2 
                                    opacity-0 group-hover:opacity-100 transition-all duration-200
                                    translate-x-2 group-hover:translate-x-0
                                    bg-card border border-border/50 rounded-lg p-3 
                                    shadow-xl z-20 w-52 pointer-events-none">
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-full bg-accent/50 rounded-full flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conclusion */}
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90">{market.conclusion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitors & Advantage */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">Competitors & Differentiation</h3>
            </div>

            {/* Competitors List */}
            <div className="space-y-4 mb-6">
              {competitors.map((competitor, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{competitor.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {competitor.price}
                    </Badge>
                  </div>
                  <p className="text-sm text-red-400/80 mb-2">
                    <span className="text-muted-foreground">Weakness:</span> {competitor.weakness}
                  </p>
                  <div className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-green-400/90">
                      <span className="font-medium">Your advantage:</span> {competitor.yourAdvantage}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Your Competitive Advantage */}
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h4 className="text-sm font-medium text-accent mb-2">Your Competitive Advantage</h4>
              <p className="text-foreground">{competitiveAdvantage}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketOpportunitySection;
