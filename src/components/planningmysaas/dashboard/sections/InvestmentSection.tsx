import { DollarSign, Check, X, PieChart, AlertCircle, Sparkles, Megaphone, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField, parseCentsField, emptyStates } from "@/lib/reportDataUtils";
import { InvestmentBreakdown } from "@/types/report";
import { useMvpTier } from "@/hooks/useMvpTier";
import PricingComparisonSlider from "../PricingComparisonSlider";
import MarketingComparisonSlider from "../MarketingComparisonSlider";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const InvestmentSection = () => {
  const { report } = useReportContext();
  const selectedFeatures = report?.selected_features || [];
  const { tier, pricing, featureCounts, isLoading: tierLoading } = useMvpTier(selectedFeatures);
  
  // Parse investment data from report
  const investmentBreakdown = parseJsonField<InvestmentBreakdown["breakdown"]>(report?.investment_breakdown, []);
  const investmentIncluded = parseJsonField<{ items: string[] }>(report?.investment_included, { items: [] });
  const investmentNotIncluded = parseJsonField<{ items: string[] }>(report?.investment_not_included, { items: [] });
  const investmentComparison = parseJsonField<InvestmentBreakdown["comparison"]>(report?.investment_comparison, null);
  const investmentTotalCents = parseCentsField(report?.investment_total_cents, 0);
  
  // Use dynamic pricing from tier if available, fallback to report data
  const dynamicTotal = pricing.uaicode.calculated > 0 
    ? pricing.uaicode.calculated / 100 
    : investmentTotalCents > 0 
      ? investmentTotalCents 
      : investmentBreakdown.reduce((acc, item) => acc + (item.value || 0), 0);
  
  // Build investment object
  const investment = {
    total: dynamicTotal,
    breakdown: investmentBreakdown,
    included: investmentIncluded?.items || [],
    notIncluded: investmentNotIncluded?.items || []
  };

  // Marketing Investment Data
  const marketingInvestment = {
    uaicode: {
      subscription: 5000,
      suggestedPaidMedia: 5000,
      total: 10000,
      yearlyTotal: 120000,
      included: [
        "Full-stack marketing team",
        "Strategy + Execution included",
        "Performance-focused approach",
        "AI-powered optimization",
        "Monthly performance reporting",
        "Dedicated account manager"
      ]
    },
    traditional: {
      retainerMin: 8000,
      retainerMax: 15000,
      paidMedia: 5000,
      managementFeePercent: "15-20%",
      managementFeeMin: 750,
      managementFeeMax: 1000,
      totalMin: 13750,
      totalMax: 21000,
      yearlyMin: 165000,
      yearlyMax: 252000,
      notIncluded: [
        "Strategy charged separately",
        "Creative production is extra",
        "Limited to ads management",
        "Hourly billing for meetings",
        "Manual reporting processes",
        "No AI optimization tools"
      ]
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Colors for donut chart
  const COLORS = [
    'hsl(var(--accent))',
    'hsl(45, 100%, 45%)',
    'hsl(var(--accent) / 0.7)',
    'hsl(45, 80%, 55%)',
    'hsl(var(--accent) / 0.5)',
  ];

  const chartData = investment.breakdown.map((item, index) => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground text-sm">{data.name}</p>
          <p className="text-accent font-bold">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="investment" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <DollarSign className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Investment</h2>
            <InfoTooltip side="right" size="sm">
              Complete breakdown of MVP development and marketing investment options.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">How much it costs to build and grow your SaaS</p>
        </div>
      </div>

      {/* MVP Development - Subtitle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm">MVP Development</h3>
          <InfoTooltip side="right" size="sm">
            One-time investment to build your minimum viable product.
          </InfoTooltip>
        </div>
        {tier && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent">
              {tier.tier_name}
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {featureCounts.essential}E + {featureCounts.advanced}A + {featureCounts.enterprise}Ent features
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Main Investment Card with Chart */}
        <Card className="bg-card/50 border-border/30 ring-1 ring-accent/10">
          <CardContent className="p-5">
            {/* Total Investment */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Total MVP Investment</p>
              <div className="text-4xl md:text-5xl font-bold text-gradient-gold">
                {formatCurrency(investment.total)}
              </div>
              {tier && (
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {formatCurrency(pricing.uaicode.min / 100)} - {formatCurrency(pricing.uaicode.max / 100)}
                </p>
              )}
              {!tier && (
                <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
              )}
            </div>

            {/* Breakdown with Donut Chart */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Donut Chart */}
              <div className="h-48 md:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="transparent"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <PieChart className="h-4 w-4 text-accent" />
                  <h4 className="font-medium text-foreground text-sm">Breakdown</h4>
                </div>
                {investment.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground text-xs">{item.name}</span>
                    </div>
                    <span className="text-foreground font-medium text-xs">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included / Not Included */}
            <div className="mt-5 pt-5 border-t border-border/30 grid md:grid-cols-2 gap-4">
              {/* Included */}
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
                  What's Included
                  <InfoTooltip side="top" size="sm">
                    Everything included in your investment with no hidden costs.
                  </InfoTooltip>
                </h3>
                <ul className="space-y-1.5">
                  {investment.included.slice(0, 4).map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Included */}
              <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
                  Not Included
                </h3>
                <ul className="space-y-1.5">
                  {investment.notIncluded.slice(0, 4).map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <X className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Comparison Slider */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <PricingComparisonSlider />
          </CardContent>
        </Card>
      </div>

      {/* Marketing Investment - Subtitle */}
      <div className="flex items-center gap-2 mt-8">
        <h3 className="font-semibold text-foreground text-sm">Marketing Investment</h3>
        <InfoTooltip side="right" size="sm">
          Ongoing marketing investment to acquire customers and grow your business.
        </InfoTooltip>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Uaicode Marketing Card */}
        <Card className="bg-card/50 border-border/30 ring-1 ring-accent/20">
          <CardContent className="p-5">
            {/* Header with Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h4 className="font-semibold text-foreground">Uaicode Marketing</h4>
              </div>
              <Badge className="text-[10px] bg-accent/10 text-accent border-accent/30">
                RECOMMENDED
              </Badge>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Subscription</span>
                <span className="text-lg font-bold text-gradient-gold">
                  {formatCurrency(marketingInvestment.uaicode.subscription)}/mo
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Suggested Paid Media*</span>
                  <Megaphone className="h-3 w-3 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">
                  {formatCurrency(marketingInvestment.uaicode.suggestedPaidMedia)}/mo
                </span>
              </div>
              <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total Monthly</span>
                <span className="text-lg font-bold text-accent">
                  {formatCurrency(marketingInvestment.uaicode.total)}/mo
                </span>
              </div>
            </div>

            {/* Included Benefits */}
            <div className="mb-4">
              <h5 className="font-medium text-foreground text-xs mb-2">
                What's Included
              </h5>
              <ul className="space-y-1.5">
                {marketingInvestment.uaicode.included.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs">
                    <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-amber-500">*Suggested budget</span> based on your 
                  market analysis. You can start with a smaller budget and scale as you see results. 
                  This is a recommendation, not a requirement.
                </div>
              </div>
            </div>

            {/* Yearly Total */}
            <div className="pt-3 border-t border-border/30 text-center">
              <p className="text-xs text-muted-foreground mb-1">First Year Investment</p>
              <p className="text-2xl font-bold text-gradient-gold">
                {formatCurrency(marketingInvestment.uaicode.yearlyTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Cost Comparison Slider */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <MarketingComparisonSlider />
          </CardContent>
        </Card>
      </div>

      {/* Total First Year Investment - Subtitle */}
      <div className="flex items-center gap-2 mt-8">
        <h3 className="font-semibold text-foreground text-sm">Total First Year Investment</h3>
        <InfoTooltip side="right" size="sm">
          Complete first year investment including MVP development and marketing.
        </InfoTooltip>
      </div>

      <Card className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-accent/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left side - Total */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Complete First Year</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(investment.total + marketingInvestment.uaicode.yearlyTotal)}
              </p>
              <p className="text-xs text-accent">MVP + 12 months of marketing</p>
            </div>
            
            {/* Right side - Breakdown */}
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-2 bg-muted/20 rounded-lg border border-border/30 text-center min-w-[70px]">
                <p className="text-[10px] text-muted-foreground">MVP Dev</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(investment.total)}</p>
                <p className="text-[9px] text-muted-foreground/70">(one-time)</p>
              </div>
              <div className="px-3 py-2 bg-muted/20 rounded-lg border border-border/30 text-center min-w-[70px]">
                <p className="text-[10px] text-muted-foreground">Marketing Sub.</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(marketingInvestment.uaicode.subscription * 12)}</p>
                <p className="text-[9px] text-muted-foreground/70">($5K × 12)</p>
              </div>
              <div className="px-3 py-2 bg-muted/20 rounded-lg border border-border/30 text-center min-w-[70px]">
                <p className="text-[10px] text-muted-foreground">Paid Media*</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(marketingInvestment.uaicode.suggestedPaidMedia * 12)}</p>
                <p className="text-[9px] text-muted-foreground/70">($5K × 12)</p>
              </div>
              <div className="px-3 py-2 bg-accent/20 rounded-lg border border-accent/30 text-center min-w-[70px]">
                <p className="text-[10px] text-accent/80">Total</p>
                <p className="text-sm font-bold text-accent">{formatCurrency(investment.total + marketingInvestment.uaicode.yearlyTotal)}</p>
                <p className="text-[9px] text-muted-foreground/70">(1st year)</p>
              </div>
              <div className="px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/30 text-center min-w-[70px]">
                <p className="text-[10px] text-green-400/80">After Year 1</p>
                <p className="text-sm font-bold text-green-400">{formatCurrency(marketingInvestment.uaicode.yearlyTotal)}</p>
                <p className="text-[9px] text-muted-foreground/70">/year only</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default InvestmentSection;
