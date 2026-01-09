import { Target, TrendingUp, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reportData } from "@/lib/reportMockData";

const MarketOpportunitySection = () => {
  const { market, competitors, competitiveAdvantage } = reportData;

  const funnelData = [
    { 
      ...market.tam, 
      width: "100%", 
      opacity: "bg-accent/30",
      gradient: "from-accent/40 to-accent/20"
    },
    { 
      ...market.sam, 
      width: "70%", 
      opacity: "bg-accent/50",
      gradient: "from-accent/60 to-accent/40"
    },
    { 
      ...market.som, 
      width: "40%", 
      opacity: "bg-accent/70",
      gradient: "from-accent/80 to-accent/60"
    },
  ];

  return (
    <section id="market-opportunity" className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">A Oportunidade</h2>
          <p className="text-sm text-muted-foreground">Tamanho do mercado e competição</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Funnel */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Tamanho do Mercado</h3>
              <Badge variant="outline" className="border-accent/30 text-accent gap-1">
                <TrendingUp className="h-3 w-3" />
                {market.growthRate} ao ano
              </Badge>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-4">
              {funnelData.map((item, index) => (
                <div key={index} className="relative">
                  <div 
                    className={`bg-gradient-to-r ${item.gradient} rounded-lg p-4 transition-all hover:scale-[1.02]`}
                    style={{ width: item.width, marginLeft: 'auto', marginRight: 'auto' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                        <div className="text-2xl font-bold text-foreground">{item.value}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center max-w-[80%] mx-auto">
                    {item.description}
                  </p>
                </div>
              ))}
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
              <h3 className="font-semibold text-foreground">Competidores & Diferencial</h3>
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
                    <span className="text-muted-foreground">Fraqueza:</span> {competitor.weakness}
                  </p>
                  <div className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-green-400/90">
                      <span className="font-medium">Sua vantagem:</span> {competitor.yourAdvantage}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Your Competitive Advantage */}
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h4 className="text-sm font-medium text-accent mb-2">Seu Diferencial Competitivo</h4>
              <p className="text-foreground">{competitiveAdvantage}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketOpportunitySection;
