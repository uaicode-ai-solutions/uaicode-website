import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Target, CheckCircle, Star, Zap, Crown } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const positionColors: Record<string, string> = {
  "Premium": "bg-accent/10 text-accent border-accent/20",
  "Mid-market": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Budget": "bg-green-500/10 text-green-400 border-green-500/20",
};

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
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <DollarSign className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pricing Intelligence</h2>
          <p className="text-sm text-muted-foreground">Competitive pricing analysis and recommended strategy</p>
        </div>
      </div>

      {/* Recommended Pricing Strategy */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Recommended Pricing Strategy</h3>
          <InfoTooltip size="sm">
            Optimal pricing tiers based on competitor analysis and market positioning.
          </InfoTooltip>
          <Badge className="bg-accent text-accent-foreground text-xs ml-auto">{pricingActionPlan.recommendedModel}</Badge>
        </div>
        <Card className="glass-premium border-accent/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
          <CardContent className="p-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingActionPlan.tiers.map((tier, idx) => {
                const TierIcon = tierIcons[tier.name] || Star;
                return (
                  <div 
                    key={idx} 
                    className={`relative p-5 rounded-xl border transition-all duration-300 ${
                      tier.recommended 
                        ? "bg-accent/10 border-accent/40 shadow-lg shadow-accent/10" 
                        : "bg-accent/5 border-accent/20 hover:border-accent/30"
                    }`}
                  >
                    {tier.recommended && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px]">
                        Recommended
                      </Badge>
                    )}
                    <div className="text-center mb-3">
                      <TierIcon className={`h-6 w-6 mx-auto mb-1.5 ${tier.recommended ? "text-accent" : "text-muted-foreground"}`} />
                      <h3 className="text-base font-bold text-foreground">{tier.name}</h3>
                      <p className="text-xl font-bold text-accent mt-0.5">{tier.price}</p>
                      <p className="text-[10px] text-muted-foreground">per month</p>
                    </div>
                    <div className="space-y-1.5">
                      {tier.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-3 text-center">Est. conversion: {tier.expectedConversion}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Price Positioning Chart */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Price Positioning Map</h3>
            <InfoTooltip size="sm">
              Visual comparison of competitor pricing in the market.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceChartData} layout="vertical" margin={{ right: 40 }}>
                    <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value}/mo`, "Price"]} 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--accent) / 0.2)", borderRadius: "8px", fontSize: "12px" }} 
                    />
                    <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                      {priceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.position)} />
                      ))}
                      <LabelList dataKey="price" position="right" formatter={(v: number) => `$${v}`} style={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competitor Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Competitor Breakdown</h3>
            <InfoTooltip size="sm">
              Detailed view of competitor pricing models and target markets.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4 space-y-2">
              {pricingDiagnosis.priceMap.slice(0, 4).map((comp, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground text-sm">{comp.competitor}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`${positionColors[comp.position] || "bg-muted"} text-[10px]`}>{comp.position}</Badge>
                      <span className="font-bold text-accent text-sm">{comp.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>Model: {comp.model}</span>
                    <span>Target: {comp.targetMarket}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Models */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Pricing Models in Market</h3>
          <InfoTooltip size="sm">
            Common pricing approaches used by competitors and their prevalence.
          </InfoTooltip>
        </div>
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pricingDiagnosis.models.slice(0, 3).map((model, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground text-sm">{model.type}</span>
                    <Badge variant="outline" className="border-accent/20 text-accent text-[10px]">{model.prevalence}%</Badge>
                  </div>
                  <Progress value={model.prevalence} className="h-1 mb-2 [&>div]:bg-accent" />
                  <div className="space-y-1 text-[10px]">
                    <div><span className="text-accent font-medium">Pros: </span><span className="text-muted-foreground">{model.pros.slice(0, 2).join(", ")}</span></div>
                    <div><span className="text-red-400 font-medium">Cons: </span><span className="text-muted-foreground">{model.cons.slice(0, 1).join(", ")}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pricing Gaps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Pricing Gaps & Opportunities</h3>
            <InfoTooltip size="sm">
              Unaddressed pricing ranges where you can position your product competitively.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4 space-y-2">
              {pricingDiagnosis.gaps.map((gap, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                  <Badge className={`text-[10px] ${gap.priority === "high" ? "bg-accent/20 text-accent" : gap.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}>
                    {gap.priority}
                  </Badge>
                  <div className="flex-1">
                    <span className="font-medium text-foreground text-sm">{gap.range}</span>
                    <p className="text-xs text-muted-foreground">{gap.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Price Elasticity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Price Elasticity Analysis</h3>
            <InfoTooltip size="sm">
              Measures how demand changes when prices change. Low elasticity means customers are less sensitive to price increases.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4">
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <Badge variant="outline" className="mb-2 border-accent/20 text-accent text-[10px]">{pricingDiagnosis.elasticity.assessment}</Badge>
                <p className="text-xs text-muted-foreground mb-2">{pricingDiagnosis.elasticity.insight}</p>
                <div className="space-y-1.5">
                  {pricingDiagnosis.elasticity.recommendations.slice(0, 3).map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs">
                      <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingCards;