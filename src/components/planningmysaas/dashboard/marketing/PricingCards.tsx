import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle, Star, Zap, Crown, TrendingUp } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const tierIcons: Record<string, React.ElementType> = {
  "Starter": Zap,
  "Professional": Star,
  "Enterprise": Crown,
};

const getBarColor = (position: string) => {
  switch (position) {
    case "Premium": return "hsl(var(--accent))";
    case "Mid-market": return "hsl(32, 85%, 55%)";
    case "Budget": return "hsl(38, 80%, 60%)";
    default: return "hsl(var(--accent))";
  }
};

const PricingCards = () => {
  const { pricingDiagnosis, pricingActionPlan } = competitorAnalysisData;

  const priceChartData = pricingDiagnosis.priceMap.map(comp => ({
    name: comp.competitor.split(" ")[0],
    price: parseInt(comp.price.replace(/[^0-9]/g, "")) || 0,
    position: comp.position,
  }));

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <DollarSign className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Pricing Intelligence</h2>
            <InfoTooltip size="sm">
              Competitive pricing analysis and recommended strategy.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Pricing recommendations and competitive positioning</p>
        </div>
      </div>

      {/* Pricing Tiers */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Recommended Pricing</h3>
            <Badge className="bg-accent text-accent-foreground text-xs">{pricingActionPlan.recommendedModel}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {pricingActionPlan.tiers.map((tier, idx) => {
              const TierIcon = tierIcons[tier.name] || Star;
              return (
                <div 
                  key={idx} 
                  className={`relative p-4 rounded-xl border text-center ${
                    tier.recommended 
                      ? "bg-accent/10 border-accent/40" 
                      : "bg-muted/10 border-border/20"
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
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Price Map Chart */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <h3 className="font-semibold text-foreground text-sm">Competitive Price Map</h3>
              </div>
              <Badge variant="outline" className="border-accent/30 text-accent text-[9px]">
                Market Positions
              </Badge>
            </div>
            
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceChartData} layout="vertical" margin={{ right: 40, left: 0 }}>
                  <XAxis 
                    type="number" 
                    tickFormatter={(v) => `$${v}`} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={75} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                    {priceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.position)} />
                    ))}
                    <LabelList 
                      dataKey="price" 
                      position="right" 
                      formatter={(v: number) => `$${v}`} 
                      style={{ fontSize: 10, fill: 'hsl(var(--accent))', fontWeight: 600 }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4">
              {[
                { label: "Premium", color: "bg-accent" },
                { label: "Mid-market", color: "bg-[hsl(32,85%,55%)]" },
                { label: "Budget", color: "bg-[hsl(38,80%,60%)]" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Opportunities */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Pricing Opportunities
            </h3>
            <div className="space-y-3">
              {pricingDiagnosis.gaps.map((gap, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/20">
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
            
            {/* Price Elasticity */}
            <div className="mt-4 p-3 rounded-lg bg-muted/10 border border-border/20">
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
