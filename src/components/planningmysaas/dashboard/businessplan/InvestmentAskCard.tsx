import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Code,
  Megaphone,
  Server,
  Shield,
  CheckCircle2,
  BadgePercent,
  Rocket,
  Users,
  Briefcase,
  Palette,
  Share2,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { DiscountStrategyMap } from "@/lib/sectionInvestmentUtils";

interface InvestmentAskCardProps {
  investment: Record<string, unknown> | null | undefined;
}

const formatCurrency = (cents: number | undefined): string => {
  if (!cents) return "...";
  const value = cents / 100;
  if (value >= 1000) return `$${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return `$${value.toFixed(0)}`;
};

const InvestmentAskCard: React.FC<InvestmentAskCardProps> = ({ investment }) => {
  if (!investment) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-accent" />
            Investment Ask
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Investment breakdown will appear once calculated...
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalCents = investment.investment_one_payment_cents as number | undefined;
  const frontendCents = investment.investment_front_cents as number | undefined;
  const backendCents = investment.investment_back_cents as number | undefined;
  const integrationsCents = investment.investment_integrations_cents as number | undefined;
  const infraCents = investment.investment_infra_cents as number | undefined;
  const testingCents = investment.investment_testing_cents as number | undefined;
  const savingsPercent = investment.savings_percentage as number | undefined;
  const traditionalMinCents = investment.traditional_min_cents as number | undefined;
  const traditionalMaxCents = investment.traditional_max_cents as number | undefined;

  // Extract bundle from discount_strategy
  const discountStrategy = investment.discount_strategy as DiscountStrategyMap | undefined;
  const bundle = discountStrategy?.bundle;
  const bundlePriceCents = bundle?.price_cents;
  const bundlePercent = bundle?.percent;
  const bundleBonusDays = bundle?.bonus_support_days;
  const bundleSavingsCents = totalCents && bundlePriceCents 
    ? totalCents - bundlePriceCents 
    : 0;

  // All marketing services from tb_pms_mkt_tier
  const allMarketingServices = [
    { name: "Project Manager", icon: Briefcase },
    { name: "Paid Media", icon: Megaphone },
    { name: "Digital Media", icon: Palette },
    { name: "Social Media", icon: Share2 },
    { name: "CRM Pipeline", icon: Users },
  ];

  const breakdownItems = [
    { label: "Frontend Development", icon: Code, value: frontendCents },
    { label: "Backend Development", icon: Server, value: backendCents },
    { label: "Integrations", icon: Shield, value: integrationsCents },
    { label: "Infrastructure", icon: Server, value: infraCents },
    { label: "Testing & QA", icon: CheckCircle2, value: testingCents },
  ].filter(item => item.value && item.value > 0);

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5 text-accent" />
          Investment Ask
          <InfoTooltip>
            Total investment required to build and launch your MVP with Uaicode
          </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MVP Only Investment */}
        <div className="p-5 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">MVP Only</p>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(totalCents)}
          </p>
          
          {savingsPercent && (
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <BadgePercent className="h-3.5 w-3.5 mr-1" />
                Save {savingsPercent}% vs Traditional
              </Badge>
            </div>
          )}
          
          {traditionalMinCents && traditionalMaxCents && (
            <p className="text-xs text-muted-foreground mt-2">
              Traditional agencies: {formatCurrency(traditionalMinCents)} - {formatCurrency(traditionalMaxCents)}
            </p>
          )}
        </div>

        {/* MVP + Marketing Bundle */}
        {bundlePriceCents && bundlePriceCents > 0 && (
          <div className="p-5 rounded-lg bg-gradient-to-br from-accent/15 to-green-500/10 border-2 border-accent/40 relative overflow-hidden">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0">
              <Badge className="rounded-none rounded-bl-lg bg-accent text-accent-foreground font-semibold text-xs px-3 py-1">
                BEST VALUE
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Rocket className="h-5 w-5 text-accent" />
              <p className="text-sm font-semibold text-foreground">MVP + Marketing Bundle</p>
            </div>
            
            <p className="text-3xl font-bold text-gradient-gold">
              {formatCurrency(bundlePriceCents)}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {bundlePercent && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <BadgePercent className="h-3.5 w-3.5 mr-1" />
                  Save {bundlePercent}%
                </Badge>
              )}
              {bundleSavingsCents > 0 && (
                <span className="text-xs text-muted-foreground">
                  (Save {formatCurrency(bundleSavingsCents)})
                </span>
              )}
            </div>

            {/* Included Marketing Services */}
            <div className="mt-4 pt-3 border-t border-accent/20">
              <p className="text-xs text-muted-foreground mb-2">Includes monthly marketing:</p>
              <div className="flex flex-wrap gap-2">
                {allMarketingServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-xs text-foreground bg-background/50 rounded-full px-2.5 py-1 border border-border/30"
                  >
                    <service.icon className="h-3 w-3 text-accent" />
                    {service.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Breakdown */}
        {breakdownItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Investment Breakdown</h4>
            <div className="space-y-2">
              {breakdownItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/20"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Included */}
        <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            What's Included
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              Full source code
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              Responsive design
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              API integrations
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              30-day support
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentAskCard;
