import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Check, Sparkles, TrendingUp } from "lucide-react";
import { PriceIntelligenceSection, PriceIntelligenceTier } from "@/types/report";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface BusinessModelCardProps {
  pricing: PriceIntelligenceSection | null | undefined;
  insight?: string;
}

const BusinessModelCard: React.FC<BusinessModelCardProps> = ({
  pricing,
  insight,
}) => {
  if (!pricing) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Business Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Pricing analysis will appear once the research is complete...
          </p>
        </CardContent>
      </Card>
    );
  }

  const pricingTiers = pricing.recommended_tiers || [];
  const idealTicket = pricing.unit_economics?.recommended_arpu;
  const pricingModel = pricing.recommended_model;
  const pricePositioning = pricing.price_positioning;
  const marketAverage = pricing.market_overview?.market_average_price;

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-accent" />
          Business Model
          <InfoTooltip term="Business Model">
            Your recommended pricing strategy, including tier structure, ARPU target, and market positioning based on competitor analysis.
          </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {idealTicket && (
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-xs text-muted-foreground">Recommended ARPU</p>
                <InfoTooltip term="ARPU" size="sm">
                  Average Revenue Per User — the ideal monthly price point to maximize revenue while staying competitive.
                </InfoTooltip>
              </div>
              <p className="text-2xl font-bold text-accent">${idealTicket}/mo</p>
            </div>
          )}
          {pricingModel && (
            <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-xs text-muted-foreground">Pricing Model</p>
                <InfoTooltip term="Pricing Model" size="sm">
                  The billing structure recommended for your product (e.g., subscription, usage-based, freemium).
                </InfoTooltip>
              </div>
              <p className="text-lg font-semibold text-foreground">{pricingModel}</p>
            </div>
          )}
          {pricePositioning && (
            <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-xs text-muted-foreground">Market Position</p>
                <InfoTooltip term="Market Position" size="sm">
                  Where your pricing sits relative to competitors — premium (higher price, more value), mid-market, or budget.
                </InfoTooltip>
              </div>
              <p className="text-lg font-semibold text-foreground">{pricePositioning}</p>
            </div>
          )}
        </div>

        {pricingTiers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Suggested Tiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pricingTiers.slice(0, 3).map((tier: PriceIntelligenceTier, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    tier.recommended
                      ? "bg-accent/10 border-accent/30"
                      : "bg-muted/10 border-border/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-foreground">{tier.name}</h5>
                    {tier.recommended && (
                      <Badge className="bg-accent/20 text-accent text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Best
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl font-bold text-foreground mb-2">
                    ${tier.price_monthly}/mo
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tier.target_segment}
                  </p>
                  {tier.features && tier.features.length > 0 && (
                    <ul className="space-y-1">
                      {tier.features.slice(0, 3).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {marketAverage && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/10 border border-border/20">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">Market Average:</span>
            <span className="text-sm font-medium text-foreground">${marketAverage}/mo</span>
            <InfoTooltip term="Market Average" size="sm">
              The average monthly price charged by competitors in your market segment. Useful for positioning your pricing.
            </InfoTooltip>
          </div>
        )}

        {insight && (
          <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
            <p className="text-sm text-foreground italic">"{insight}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessModelCard;
