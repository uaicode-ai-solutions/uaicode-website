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
} from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface InvestmentAskCardProps {
  investment: Record<string, unknown> | null | undefined;
}

const formatCurrency = (cents: number | undefined): string => {
  if (!cents) return "...";
  const value = cents / 100;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
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
        {/* Total Investment */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-center">
          <p className="text-sm text-muted-foreground mb-2">Total Investment</p>
          <p className="text-4xl font-bold text-gradient-gold">
            {formatCurrency(totalCents)}
          </p>
          
          {savingsPercent && (
            <div className="flex items-center justify-center gap-2 mt-3">
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
