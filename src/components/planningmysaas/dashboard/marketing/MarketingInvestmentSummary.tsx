import { DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingTotals, MarketingService } from "@/hooks/useMarketingTiers";

interface MarketingInvestmentSummaryProps {
  selectedServiceIds: string[];
  services: MarketingService[];
  totals: MarketingTotals;
  suggestedPaidMedia?: number; // in cents
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

const formatCurrencyK = (cents: number) => {
  const value = cents / 100;
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  }
  return formatCurrency(cents);
};

const MarketingInvestmentSummary = ({
  selectedServiceIds,
  services,
  totals,
  suggestedPaidMedia = 500000, // $5,000 default
}: MarketingInvestmentSummaryProps) => {
  const selectedServices = services.filter((s) =>
    selectedServiceIds.includes(s.service_id)
  );

  const totalMonthly = totals.uaicodeTotal + suggestedPaidMedia;
  const totalYearly = totalMonthly * 12;

  // No services selected
  if (selectedServiceIds.length === 0) {
    return (
      <Card className="bg-muted/20 border-border/30">
        <CardContent className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Select at least one service to see your investment summary</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/30 ring-1 ring-accent/20">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-accent" />
            <h4 className="font-medium text-foreground text-sm">Your Marketing Investment</h4>
          </div>
          <Badge className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
            {selectedServiceIds.length} service{selectedServiceIds.length !== 1 ? "s" : ""} selected
          </Badge>
        </div>

        {/* Selected Services List */}
        <div className="space-y-1.5 mb-3 pb-3 border-b border-border/30">
          {selectedServices.map((service) => (
            <div key={service.service_id} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">• {service.service_name}</span>
              <span className="font-medium text-foreground">
                {formatCurrency(service.uaicode_price_cents)}/mo
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Uaicode Subscription</span>
            <span className="text-sm font-bold text-gradient-gold">
              {formatCurrency(totals.uaicodeTotal)}/mo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Suggested Paid Media*</span>
            </div>
            <span className="text-xs text-foreground">{formatCurrency(suggestedPaidMedia)}/mo</span>
          </div>
          <div className="pt-2 border-t border-border/30 flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Total Monthly</span>
            <span className="text-base font-bold text-accent">{formatCurrency(totalMonthly)}/mo</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 text-[10px] text-muted-foreground">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>
            *Suggested budget based on market analysis. You can start smaller and scale as you see results.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingInvestmentSummary;
