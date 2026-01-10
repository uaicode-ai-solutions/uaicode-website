import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Target, CheckCircle, Star, Zap, Crown } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const positionColors: Record<string, string> = {
  "Premium": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Mid-market": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Budget": "bg-green-500/10 text-green-500 border-green-500/20",
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
      case "Premium": return "hsl(280, 67%, 60%)";
      case "Mid-market": return "hsl(var(--primary))";
      case "Budget": return "hsl(142, 76%, 36%)";
      default: return "hsl(var(--accent))";
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20">
          <DollarSign className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pricing Intelligence</h2>
          <p className="text-muted-foreground">Competitive pricing analysis and recommended strategy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Price Positioning Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceChartData} layout="vertical">
                  <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value: number) => [`$${value}/mo`, "Price"]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                    {priceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.position)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Competitor Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pricingDiagnosis.priceMap.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{comp.competitor}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={positionColors[comp.position] || "bg-muted"}>{comp.position}</Badge>
                    <span className="font-bold text-foreground">{comp.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Model: {comp.model}</span>
                  <span>Target: {comp.targetMarket}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pricing Models in Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingDiagnosis.models.map((model, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">{model.type}</span>
                  <Badge variant="outline">{model.prevalence}% of market</Badge>
                </div>
                <Progress value={model.prevalence} className="h-1.5 mb-3" />
                <div className="space-y-2 text-xs">
                  <div><span className="text-green-500 font-medium">Pros: </span><span className="text-muted-foreground">{model.pros.join(", ")}</span></div>
                  <div><span className="text-red-500 font-medium">Cons: </span><span className="text-muted-foreground">{model.cons.join(", ")}</span></div>
                  <div><span className="text-accent font-medium">Best for: </span><span className="text-muted-foreground">{model.bestFor}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />Pricing Gaps & Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pricingDiagnosis.gaps.map((gap, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <Badge className={gap.priority === "High" ? "bg-red-500/10 text-red-500" : gap.priority === "Medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}>
                  {gap.priority}
                </Badge>
                <div className="flex-1">
                  <span className="font-medium text-foreground">{gap.range}</span>
                  <p className="text-sm text-muted-foreground">{gap.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />Price Elasticity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <Badge variant="outline" className="mb-2">{pricingDiagnosis.elasticity.assessment}</Badge>
              <p className="text-sm text-muted-foreground mb-3">{pricingDiagnosis.elasticity.insight}</p>
              <div className="space-y-2">
                {pricingDiagnosis.elasticity.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />Recommended Pricing Strategy
            </CardTitle>
            <Badge className="bg-accent text-accent-foreground">{pricingActionPlan.recommendedModel}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingActionPlan.tiers.map((tier, idx) => {
              const TierIcon = tierIcons[tier.name] || Star;
              return (
                <div key={idx} className={`relative p-6 rounded-xl border ${tier.recommended ? "bg-accent/10 border-accent/30" : "bg-muted/30 border-border/30"}`}>
                  {tier.recommended && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">Recommended</Badge>}
                  <div className="text-center mb-4">
                    <TierIcon className={`h-8 w-8 mx-auto mb-2 ${tier.recommended ? "text-accent" : "text-muted-foreground"}`} />
                    <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                    <p className="text-3xl font-bold text-foreground mt-1">{tier.price}</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <div className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">Est. conversion: {tier.expectedConversion}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PricingCards;
