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
import { useReportContext } from "@/contexts/ReportContext";

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
  // Access marketing totals from context (all services selected)
  const { marketingTotals } = useReportContext();
  
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
  const traditionalMinCents = investment.traditional_min_cents as number | undefined;
  const traditionalMaxCents = investment.traditional_max_cents as number | undefined;

  // Calculate marketing annual (all services - from context)
  const marketingAnnualCents = marketingTotals.uaicodeTotal * 12;
  const marketingTraditionalAnnualMaxCents = marketingTotals.traditionalMaxTotal * 12;

  // MVP + Marketing Bundle = MVP full price + Marketing annual
  const bundleTotalCents = (totalCents || 0) + marketingAnnualCents;
  
  // Calculate savings vs Traditional (MVP + Marketing traditional max)
  const traditionalTotalCents = (traditionalMaxCents || 0) + marketingTraditionalAnnualMaxCents;
  const savingsVsTraditionalPercent = traditionalTotalCents > 0 
    ? Math.round(((traditionalTotalCents - bundleTotalCents) / traditionalTotalCents) * 100)
    : 0;
  
  // MVP Only savings vs traditional
  const mvpSavingsPercent = traditionalMaxCents && totalCents
    ? Math.round(((traditionalMaxCents - totalCents) / traditionalMaxCents) * 100)
    : 0;

  // All marketing services from tb_pms_mkt_tier
  const allMarketingServices = [
    { name: "Project Manager", icon: Briefcase },
    { name: "Paid Media", icon: Megaphone },
    { name: "Digital Media", icon: Palette },
    { name: "Social Media", icon: Share2 },
    { name: "CRM Pipeline", icon: Users },
  ];
  
  // What's Included items (now displayed as badges in MVP Only card)
  const includedItems = [
    "Full source code",
    "Responsive design",
    "API integrations",
    "30-day support",
  ];

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
          
          {mvpSavingsPercent > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <BadgePercent className="h-3.5 w-3.5 mr-1" />
                Save {mvpSavingsPercent}% vs Traditional
              </Badge>
            </div>
          )}
          
          {traditionalMinCents && traditionalMaxCents && (
            <p className="text-xs text-muted-foreground mt-2">
              Traditional agencies: {formatCurrency(traditionalMinCents)} - {formatCurrency(traditionalMaxCents)}
            </p>
          )}
          
          {/* What's Included as Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {includedItems.map((item, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs bg-muted/20 text-foreground/80 border-border/40 px-2 py-1"
              >
                <CheckCircle2 className="h-3 w-3 mr-1 text-green-400" />
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* MVP + Marketing Bundle */}
        {bundleTotalCents > 0 && (
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
              {formatCurrency(bundleTotalCents)}
            </p>
            
            {/* Price breakdown */}
            <p className="text-xs text-muted-foreground mt-1">
              MVP: {formatCurrency(totalCents)} + Marketing: {formatCurrency(marketingAnnualCents)}/year
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {savingsVsTraditionalPercent > 0 && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <BadgePercent className="h-3.5 w-3.5 mr-1" />
                  Save {savingsVsTraditionalPercent}% vs Traditional
                </Badge>
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
      </CardContent>
    </Card>
  );
};

export default InvestmentAskCard;
