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

// Gradientes premium UAICODE para barras
const BAR_GRADIENTS = [
  { id: "barGrad0", start: "#d97706", end: "#fbbf24" },   // Premium: Laranja -> Dourado
  { id: "barGrad1", start: "#e5a00d", end: "#fcd34d" },   // Mid-market: Dourado médio
  { id: "barGrad2", start: "#f0b429", end: "#fde68a" },   // Budget: Dourado claro
];

const getBarGradient = (position: string) => {
  switch (position) {
    case "Premium": return "url(#barGrad0)";
    case "Mid-market": return "url(#barGrad1)";
    case "Budget": return "url(#barGrad2)";
    default: return "url(#barGrad0)";
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
        {/* Price Map Chart - Premium */}
        <Card className="bg-gradient-to-b from-accent/8 to-transparent border-accent/30 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-3.5 w-3.5 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Competitive Price Map</h3>
              </div>
              <Badge variant="outline" className="border-accent/30 text-accent text-[9px]">
                Market Positions
              </Badge>
            </div>
            
            {/* Dark premium container */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#1c1917] via-[#0f0f0f] to-[#1c1917] shadow-[0_0_40px_rgba(249,115,22,0.08),inset_0_0_20px_rgba(0,0,0,0.4)]">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceChartData} layout="vertical" margin={{ right: 40, left: 0 }}>
                    <defs>
                      {BAR_GRADIENTS.map((grad) => (
                        <linearGradient key={grad.id} id={grad.id} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={grad.start} />
                          <stop offset="100%" stopColor={grad.end} />
                        </linearGradient>
                      ))}
                      <filter id="barGlow" x="-10%" y="-10%" width="120%" height="120%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <XAxis 
                      type="number" 
                      tickFormatter={(v) => `$${v}`} 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(32, 95%, 44%, 0.2)' }}
                      tickLine={{ stroke: 'hsl(32, 95%, 44%, 0.1)' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={75} 
                      tick={{ fontSize: 10, fill: '#fafaf9' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="price" radius={[0, 6, 6, 0]}>
                      {priceChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getBarGradient(entry.position)}
                          style={{ filter: 'url(#barGlow)' }}
                        />
                      ))}
                      <LabelList 
                        dataKey="price" 
                        position="right" 
                        formatter={(v: number) => `$${v}`} 
                        style={{ fontSize: 10, fill: '#fbbf24', fontWeight: 600 }} 
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Premium Legend Pills */}
            <div className="flex justify-center gap-3 mt-4">
              {[
                { label: "Premium", gradient: "from-[#d97706] to-[#fbbf24]" },
                { label: "Mid-market", gradient: "from-[#e5a00d] to-[#fcd34d]" },
                { label: "Budget", gradient: "from-[#f0b429] to-[#fde68a]" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/5 border border-accent/10">
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${item.gradient}`} />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
              ))}
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
