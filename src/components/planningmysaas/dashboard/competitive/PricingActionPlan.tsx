import { DollarSign, CheckCircle2, Star, TrendingUp, Zap, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const PricingActionPlan = () => {
  const { pricingActionPlan } = competitorAnalysisData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Pricing Action Plan</h3>
        <p className="text-sm text-muted-foreground">Recommended pricing strategy and implementation roadmap</p>
      </div>

      {/* Recommended Model */}
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent/20">
              <DollarSign className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">Recommended Model</h4>
              <p className="text-xl font-bold text-accent mt-1">{pricingActionPlan.recommendedModel}</p>
              <p className="text-sm text-muted-foreground mt-2">{pricingActionPlan.rationale}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Recommended Pricing Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {pricingActionPlan.tiers.map((tier, index) => (
              <Card 
                key={index}
                className={`relative bg-background/50 border-border/30 ${
                  tier.recommended ? 'ring-2 ring-accent shadow-lg shadow-accent/10' : ''
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-accent">{tier.price}</span>
                    {tier.price !== "Custom" && (
                      <p className="text-xs text-muted-foreground mt-1">{tier.annualPrice}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-center text-muted-foreground italic">
                    {tier.targetCustomer}
                  </p>
                  
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-3 border-t border-border/30 text-center">
                    <p className="text-xs text-muted-foreground">Expected Conversion</p>
                    <p className="text-sm font-semibold text-accent">{tier.expectedConversion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-5 w-5 text-accent" />
            Available Add-ons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {pricingActionPlan.addOns.map((addon, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{addon.name}</h4>
                  <Badge variant="outline" className="font-mono">{addon.price}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{addon.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Launch Strategy */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-accent" />
            Launch Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-border" />
            <div className="space-y-6">
              {Object.entries(pricingActionPlan.launchStrategy).map(([key, phase], index) => (
                <div key={key} className="relative pl-10">
                  <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                    index === 0 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted border-2 border-border'
                  }`}>
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{phase.name}</h4>
                      <Badge className="bg-accent/20 text-accent">{phase.discount}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{phase.duration}</p>
                    <p className="text-sm text-foreground/80">{phase.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trial Strategy */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Free Trial Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{pricingActionPlan.trialStrategy.type}</p>
                  <p className="text-sm text-muted-foreground">{pricingActionPlan.trialStrategy.features}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm font-medium text-foreground mb-1">Conversion Target</p>
                <p className="text-3xl font-bold text-accent">{pricingActionPlan.trialStrategy.conversionTarget}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Conversion Tactics</p>
              {pricingActionPlan.trialStrategy.tactics.map((tactic, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-accent">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground/80">{tactic}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upsell Path */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-accent" />
            Upsell Paths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pricingActionPlan.upsellPath.map((path, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline">{path.from}</Badge>
                <ArrowRight className="h-4 w-4 text-accent" />
                <Badge className="bg-accent text-accent-foreground">{path.to}</Badge>
              </div>
              <p className="text-sm text-foreground mb-1">
                <span className="text-muted-foreground">Trigger: </span>
                {path.trigger}
              </p>
              <p className="text-xs text-accent italic">"{path.messaging}"</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projected Revenue */}
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            12-Month Revenue Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold text-foreground">{pricingActionPlan.projectedRevenue.month12.customers}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
              <p className="text-2xl font-bold text-accent">{pricingActionPlan.projectedRevenue.month12.mrr}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">ARPU</p>
              <p className="text-2xl font-bold text-foreground">{pricingActionPlan.projectedRevenue.month12.arpu}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-2">Distribution</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Starter</span>
                  <span className="font-medium">{pricingActionPlan.projectedRevenue.month12.distribution.starter}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Professional</span>
                  <span className="font-medium">{pricingActionPlan.projectedRevenue.month12.distribution.professional}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Enterprise</span>
                  <span className="font-medium">{pricingActionPlan.projectedRevenue.month12.distribution.enterprise}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingActionPlan;
