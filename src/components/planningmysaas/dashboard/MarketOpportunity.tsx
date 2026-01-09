import { Target, TrendingUp, Globe, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { marketOpportunityData } from "@/lib/dashboardMockData";
import ScoreCircle from "./ui/ScoreCircle";

const MarketOpportunity = () => {
  const funnelData = [
    {
      label: "TAM",
      sublabel: "Total Addressable Market",
      value: marketOpportunityData.tam,
      description: marketOpportunityData.tamDescription,
      width: "100%",
      opacity: "1",
    },
    {
      label: "SAM",
      sublabel: "Serviceable Addressable Market",
      value: marketOpportunityData.sam,
      description: marketOpportunityData.samDescription,
      width: "60%",
      opacity: "0.85",
    },
    {
      label: "SOM",
      sublabel: "Serviceable Obtainable Market",
      value: marketOpportunityData.som,
      description: marketOpportunityData.somDescription,
      width: "35%",
      opacity: "0.7",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg icon-container-premium">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Market Opportunity</h2>
          <p className="text-sm text-muted-foreground">Size, growth, and potential</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Opportunity Score Card */}
        <Card className="metric-card-premium bg-gradient-to-br from-accent/10 via-card to-card border-accent/20 lg:row-span-2">
          <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-3">
              <ScoreCircle
                score={marketOpportunityData.opportunityScore}
                label="Opportunity"
                color="accent"
                size="md"
              />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Opportunity Score</h3>
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-3 text-xs">
              {marketOpportunityData.marketMaturity}
            </Badge>
            <div className="flex items-center gap-1.5 text-green-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span className="text-lg">{marketOpportunityData.growthRate}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{marketOpportunityData.growthPeriod}</p>
          </CardContent>
        </Card>

        {/* TAM/SAM/SOM Funnel */}
        <div className="lg:col-span-2 space-y-3">
          {funnelData.map((item, index) => (
            <Card 
              key={index}
              className="metric-card-premium bg-card/50 border-border/30 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Funnel bar */}
                  <div 
                    className="relative py-4 px-3 flex items-center justify-center"
                    style={{ 
                      width: item.width,
                      minWidth: "140px",
                      background: `linear-gradient(90deg, hsla(45, 100%, 55%, ${parseFloat(item.opacity) * 0.3}), hsla(45, 100%, 55%, ${parseFloat(item.opacity) * 0.1}))`,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xl font-semibold text-accent">
                        {item.value}
                      </div>
                      <Badge variant="outline" className="mt-1 border-accent/30 text-accent text-xs">
                        {item.label}
                      </Badge>
                    </div>
                    {/* Arrow indicator */}
                    {index < funnelData.length - 1 && (
                      <ChevronRight className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                    )}
                  </div>
                  {/* Description */}
                  <div className="flex-1 p-3 flex flex-col justify-center border-l border-border/30">
                    <h4 className="text-sm font-medium text-foreground mb-0.5">{item.sublabel}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.description.replace(`${item.label} - `, '')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="metric-card-premium bg-card/50 border-border/30 p-3 text-center">
          <Globe className="w-4 h-4 text-accent mx-auto mb-1.5" />
          <div className="text-base font-semibold text-foreground">{marketOpportunityData.growthRate}</div>
          <div className="text-[10px] text-muted-foreground">Growth Rate</div>
        </Card>
        <Card className="metric-card-premium bg-card/50 border-border/30 p-3 text-center">
          <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1.5" />
          <div className="text-base font-semibold text-foreground">{marketOpportunityData.marketMaturity}</div>
          <div className="text-[10px] text-muted-foreground">Market Phase</div>
        </Card>
        <Card className="metric-card-premium bg-card/50 border-border/30 p-3 text-center">
          <Target className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
          <div className="text-base font-semibold text-foreground">{marketOpportunityData.opportunityScore}%</div>
          <div className="text-[10px] text-muted-foreground">Score</div>
        </Card>
        <Card className="metric-card-premium bg-card/50 border-border/30 p-3 text-center">
          <div className="w-4 h-4 mx-auto mb-1.5 flex items-center justify-center">
            <span className="text-sm">📈</span>
          </div>
          <div className="text-base font-semibold text-foreground">{marketOpportunityData.growthPeriod.split(' ')[1]}</div>
          <div className="text-[10px] text-muted-foreground">Until</div>
        </Card>
      </div>
    </div>
  );
};

export default MarketOpportunity;