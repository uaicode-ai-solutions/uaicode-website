import { useState, useCallback } from "react";
import { DollarSign, Check, X, PieChart, AlertCircle, Sparkles, Megaphone, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField, parseCentsField, emptyStates } from "@/lib/reportDataUtils";
import { InvestmentBreakdown } from "@/types/report";
import { useMvpTier } from "@/hooks/useMvpTier";
import { useMarketingTiers, MarketingTotals, calculateMarketingTotals } from "@/hooks/useMarketingTiers";
import PricingComparisonSlider from "../PricingComparisonSlider";
import MarketingComparisonSlider from "../MarketingComparisonSlider";
import MarketingServiceSelector from "../marketing/MarketingServiceSelector";
import MarketingInvestmentSummary from "../marketing/MarketingInvestmentSummary";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const InvestmentSection = () => {
  const { report, reportData } = useReportContext();
  const selectedFeatures = report?.selected_features || [];
  const { tier, pricing, featureCounts, isLoading: tierLoading } = useMvpTier(selectedFeatures);
  const { services, isLoading: marketingLoading } = useMarketingTiers();
  
  // Marketing selection state
  const [selectedMarketingIds, setSelectedMarketingIds] = useState<string[]>([]);
  const [marketingTotals, setMarketingTotals] = useState<MarketingTotals>({
    uaicodeTotal: 0,
    traditionalMinTotal: 0,
    traditionalMaxTotal: 0,
    savingsMinCents: 0,
    savingsMaxCents: 0,
    savingsPercentMin: 0,
    savingsPercentMax: 0,
    annualSavingsMin: 0,
    annualSavingsMax: 0,
  });
  
  const suggestedPaidMedia = 500000; // $5,000 in cents
  
  const handleMarketingSelectionChange = useCallback((selectedIds: string[], totals: MarketingTotals) => {
    setSelectedMarketingIds(selectedIds);
    setMarketingTotals(totals);
  }, []);
  
  // Parse investment data from report
  const investmentNotIncluded = parseJsonField<{ items: string[] }>(report?.investment_not_included, { items: [] });
  
  // MVP Investment breakdown values from tb_pms_reports table (in cents)
  const mvpBreakdown = {
    onePayment: reportData?.investment_one_payment_cents ?? null,
    frontend: reportData?.investment_front_cents ?? null,
    backend: reportData?.investment_back_cents ?? null,
    integrations: reportData?.investment_integrations_cents ?? null,
    infra: reportData?.investment_infra_cents ?? null,
    testing: reportData?.investment_testing_cents ?? null,
  };

  // Format currency with fallback "..."
  const formatValueOrFallback = (cents: number | null | undefined) => {
    if (cents === null || cents === undefined) return "...";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Colors for donut chart
  const COLORS = [
    'hsl(var(--accent))',
    'hsl(45, 100%, 45%)',
    'hsl(var(--accent) / 0.7)',
    'hsl(45, 80%, 55%)',
    'hsl(var(--accent) / 0.5)',
  ];

  // Breakdown items with updated names
  const breakdownItems = [
    { name: "Frontend Development", value: mvpBreakdown.frontend, color: COLORS[0] },
    { name: "Backend & API", value: mvpBreakdown.backend, color: COLORS[1] },
    { name: "Integrations", value: mvpBreakdown.integrations, color: COLORS[2] },
    { name: "Infrastructure", value: mvpBreakdown.infra, color: COLORS[3] },
    { name: "Testing & QA", value: mvpBreakdown.testing, color: COLORS[4] },
  ];

  // Fixed "What's Included" items
  const includedItems = [
    "Complete MVP development",
    "Build infrastructure",
    "Build integrations",
    "Responsive web app",
  ];

  // Fixed "Not Included" items
  const notIncludedItems = [
    "Marketing and customer acquisition",
    "Native iOS/Android apps",
    "Additional custom integrations",
    "24/7 support after initial period",
  ];

  // Calculate total from breakdown for chart (use 0 for null values in chart)
  const totalFromBreakdown = breakdownItems.reduce((acc, item) => acc + (item.value ?? 0), 0);

  // Chart data for donut
  const chartData = breakdownItems.map((item) => ({
    name: item.name,
    value: item.value ?? 0,
    percentage: totalFromBreakdown > 0 && item.value 
      ? Math.round((item.value / totalFromBreakdown) * 100) 
      : 0,
    fill: item.color,
  }));

  // Build investment object for other parts of the component
  const investment = {
    total: mvpBreakdown.onePayment ? mvpBreakdown.onePayment / 100 : 0,
    notIncluded: investmentNotIncluded?.items || []
  };

  // Calculate marketing yearly total based on selection
  const marketingYearlyTotal = (marketingTotals.uaicodeTotal + suggestedPaidMedia) * 12;


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const originalItem = breakdownItems.find(item => item.name === data.name);
      return (
        <div className="bg-card border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground text-sm">{data.name}</p>
          <p className="text-accent font-bold">{formatValueOrFallback(originalItem?.value)}</p>
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
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-foreground text-sm">MVP Development</h3>
        <InfoTooltip side="right" size="sm">
          One-time investment to build your minimum viable product.
        </InfoTooltip>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Main Investment Card with Chart */}
        <Card className="bg-card/50 border-border/30 ring-1 ring-accent/10">
          <CardContent className="p-5">
            {/* Total Investment */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Total MVP Investment</p>
              <div className="text-4xl md:text-5xl font-bold text-gradient-gold">
                {formatValueOrFallback(mvpBreakdown.onePayment)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
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
                {breakdownItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground text-xs">{item.name}</span>
                    </div>
                    <span className="text-foreground font-medium text-xs">
                      {formatValueOrFallback(item.value)}
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
                  {includedItems.map((item, index) => (
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
                  {notIncludedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <X className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">{item}</span>
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
        <Badge className="text-[10px] bg-accent/10 text-accent border-accent/30">
          INTERACTIVE
        </Badge>
        <InfoTooltip side="right" size="sm">
          Select the marketing services you need. Pricing updates automatically.
        </InfoTooltip>
      </div>

      {/* Marketing Service Selector */}
      <MarketingServiceSelector 
        onSelectionChange={handleMarketingSelectionChange}
        defaultSelectRecommended={true}
      />

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        {/* Marketing Investment Summary */}
        <MarketingInvestmentSummary 
          selectedServiceIds={selectedMarketingIds}
          services={services}
          totals={marketingTotals}
          suggestedPaidMedia={suggestedPaidMedia}
        />

        {/* Marketing Cost Comparison Slider - Dynamic */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <MarketingComparisonSlider 
              uaicodeTotal={marketingTotals.uaicodeTotal}
              traditionalMin={marketingTotals.traditionalMinTotal}
              traditionalMax={marketingTotals.traditionalMaxTotal}
              savingsPercentMin={marketingTotals.savingsPercentMin}
              savingsPercentMax={marketingTotals.savingsPercentMax}
              annualSavingsMin={marketingTotals.annualSavingsMin}
              annualSavingsMax={marketingTotals.annualSavingsMax}
              isLoading={marketingLoading}
            />
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
                {formatCurrency(investment.total + marketingYearlyTotal / 100)}
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
                <p className="text-sm font-bold text-foreground">{formatCurrency(marketingTotals.uaicodeTotal * 12 / 100)}</p>
                <p className="text-[9px] text-muted-foreground/70">(selected × 12)</p>
              </div>
              <div className="px-3 py-2 bg-muted/20 rounded-lg border border-border/30 text-center min-w-[70px]">
                <p className="text-[10px] text-muted-foreground">Paid Media*</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(suggestedPaidMedia * 12 / 100)}</p>
                <p className="text-[9px] text-muted-foreground/70">($5K × 12)</p>
              </div>
              <div className="px-3 py-2 bg-accent/20 rounded-lg border border-accent/30 text-center min-w-[70px]">
                <p className="text-[10px] text-accent/80">Total</p>
                <p className="text-sm font-bold text-accent">{formatCurrency(investment.total + marketingYearlyTotal / 100)}</p>
                <p className="text-[9px] text-muted-foreground/70">(1st year)</p>
              </div>
              <div className="px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/30 text-center min-w-[70px]">
                <p className="text-[10px] text-green-400/80">After Year 1</p>
                <p className="text-sm font-bold text-green-400">{formatCurrency(marketingYearlyTotal / 100)}</p>
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
