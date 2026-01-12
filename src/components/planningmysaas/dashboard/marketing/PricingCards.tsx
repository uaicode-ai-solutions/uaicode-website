import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CheckCircle, Star, Zap, Crown, TrendingUp } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const tierIcons: Record<string, React.ElementType> = {
  "Starter": Zap,
  "Professional": Star,
  "Enterprise": Crown,
};

const PricingCards = () => {
  const { pricingDiagnosis, pricingActionPlan } = competitorAnalysisData;

  const priceChartData = pricingDiagnosis.priceMap.map(comp => ({
    name: comp.competitor.split(" ")[0],
    price: parseInt(comp.price.replace(/[^0-9]/g, "")) || 0,
    position: comp.position,
  }));

  const getBarColor = (position: string) => {
    switch (position) {
      case "Premium": return "hsl(var(--accent))";
      case "Mid-market": return "hsl(217, 91%, 60%)";
      case "Budget": return "hsl(142, 76%, 36%)";
      default: return "hsl(var(--accent))";
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header - Compact */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-accent/10">
          <DollarSign className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Pricing Intelligence
          <InfoTooltip size="sm">
            Competitive pricing analysis and recommended strategy.
          </InfoTooltip>
        </h2>
      </div>

      {/* Pricing Tiers - Compact */}
      <Card className="glass-premium border-accent/30 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recommended Pricing</h3>
            <Badge className="bg-accent text-accent-foreground text-xs">{pricingActionPlan.recommendedModel}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {pricingActionPlan.tiers.map((tier, idx) => {
              const TierIcon = tierIcons[tier.name] || Star;
              return (
                <div 
                  key={idx} 
                  className={`relative p-4 rounded-xl border text-center ${
                    tier.recommended 
                      ? "bg-accent/10 border-accent/40 shadow-lg shadow-accent/10" 
                      : "bg-accent/5 border-accent/20"
                  }`}
                >
                  {tier.recommended && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[9px]">
                      Best Value
                    </Badge>
                  )}
                  <TierIcon className={`h-5 w-5 mx-auto mb-1 ${tier.recommended ? "text-accent" : "text-muted-foreground"}`} />
                  <h4 className="text-sm font-bold text-foreground">{tier.name}</h4>
                  <p className="text-lg font-bold text-accent">{tier.price}</p>
                  <p className="text-[10px] text-muted-foreground mb-2">/month</p>
                  <div className="space-y-1 text-left">
                    {tier.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-1 text-[10px]">
                        <CheckCircle className="h-2.5 w-2.5 text-accent flex-shrink-0" />
                        <span className="text-foreground truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-2">Conv: {tier.expectedConversion}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2-Column: Chart + Opportunities */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Price Map Chart */}
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Competitive Price Map</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceChartData} layout="vertical" margin={{ right: 35 }}>
                  <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 10 }} />
                  <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                    {priceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.position)} />
                    ))}
                    <LabelList dataKey="price" position="right" formatter={(v: number) => `$${v}`} style={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Position Legend */}
            <div className="flex justify-center gap-4 mt-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Premium</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Mid-market</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Budget</span>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Opportunities */}
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Pricing Opportunities
            </h3>
            <div className="space-y-2">
              {pricingDiagnosis.gaps.map((gap, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[9px] ${
                      gap.priority === "high" ? "bg-accent/20 text-accent" : 
                      gap.priority === "medium" ? "bg-yellow-500/20 text-yellow-500" : 
                      "bg-green-500/20 text-green-500"
                    }`}>
                      {gap.priority}
                    </Badge>
                    <span className="text-xs font-medium text-foreground">{gap.range}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Elasticity - Compact */}
            <div className="mt-3 p-3 rounded-lg bg-muted/10 border border-border/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Price Elasticity</span>
                <Badge variant="outline" className="text-[9px] border-accent/20 text-accent">
                  {pricingDiagnosis.elasticity.assessment}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">{pricingDiagnosis.elasticity.insight}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PricingCards;
