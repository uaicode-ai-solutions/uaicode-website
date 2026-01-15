import { DollarSign, TrendingUp, Calendar, Sparkles, AlertCircle } from "lucide-react";
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-foreground">Your Marketing Investment</h4>
          </div>
          <Badge className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
            {selectedServiceIds.length} service{selectedServiceIds.length !== 1 ? "s" : ""} selected
          </Badge>
        </div>

        {/* Selected Services List */}
        <div className="space-y-2 mb-4 pb-4 border-b border-border/30">
          {selectedServices.map((service) => (
            <div key={service.service_id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">• {service.service_name}</span>
              <span className="font-medium text-foreground">
                {formatCurrency(service.uaicode_price_cents)}/mo
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Uaicode Subscription</span>
            <span className="text-lg font-bold text-gradient-gold">
              {formatCurrency(totals.uaicodeTotal)}/mo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Suggested Paid Media*</span>
            </div>
            <span className="text-sm text-foreground">{formatCurrency(suggestedPaidMedia)}/mo</span>
          </div>
          <div className="pt-2 border-t border-border/30 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total Monthly</span>
            <span className="text-xl font-bold text-accent">{formatCurrency(totalMonthly)}/mo</span>
          </div>
        </div>

        {/* Comparison vs Traditional */}
        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="font-medium text-foreground text-sm">Comparison vs Traditional</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Traditional Agency Cost</span>
              <span className="text-red-400">
                {formatCurrencyK(totals.traditionalMinTotal)} - {formatCurrencyK(totals.traditionalMaxTotal)}/mo
              </span>
            </div>
            
            <div className="pt-2 border-t border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-green-400" />
                  <span className="font-bold text-green-400">Your Savings</span>
                </div>
                <span className="font-bold text-green-400 text-lg">
                  {totals.savingsPercentMin}-{totals.savingsPercentMax}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Save {formatCurrencyK(totals.savingsMinCents)} - {formatCurrencyK(totals.savingsMaxCents)}/month
              </p>
            </div>
          </div>
        </div>

        {/* Annual Savings Highlight */}
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground">Annual Savings</span>
          </div>
          <p className="text-xl font-bold text-gradient-gold">
            {formatCurrencyK(totals.annualSavingsMin)} - {formatCurrencyK(totals.annualSavingsMax)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Reinvest in paid media for faster growth!
          </p>
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
