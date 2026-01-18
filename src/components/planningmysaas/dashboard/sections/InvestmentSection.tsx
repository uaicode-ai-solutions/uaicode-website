import { useCallback } from "react";
import { DollarSign, Check, Minus, PieChart, AlertCircle, Sparkles, Megaphone, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { useMvpTier } from "@/hooks/useMvpTier";
import { useMarketingTiers, MarketingTotals } from "@/hooks/useMarketingTiers";
import { getSectionInvestment, getInvestmentBreakdown } from "@/lib/sectionInvestmentUtils";
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
  const { report, reportData, selectedMarketingIds, setSelectedMarketingIds, marketingTotals, setMarketingTotals } = useReportContext();
  const selectedFeatures = report?.selected_features || [];
  const { tier, pricing, featureCounts, isLoading: tierLoading } = useMvpTier(selectedFeatures);
  const { services, isLoading: marketingLoading } = useMarketingTiers();
  
  // Calculate suggested paid media based on wizard budget selection
  const calculateSuggestedPaidMedia = (budget: string | null | undefined, uaicodeTotal: number): number => {
    const budgetMap: Record<string, number> = {
      '5k-10k': 200000,     // $2,000
      '10k-25k': 450000,    // $4,500
      '25k-50k': 900000,    // $9,000
      '50k-100k': 1800000,  // $18,000
      '100k+': 3500000,     // $35,000
    };
    
    // If user chose a specific budget range
    if (budget && budgetMap[budget]) {
      return budgetMap[budget];
    }
    
    // If "guidance" or not defined, use 75% of uaicodeTotal with min/max caps
    if (uaicodeTotal > 0) {
      const suggested = Math.round(uaicodeTotal * 0.75);
      const min = 300000;  // $3,000 minimum
      const max = 1500000; // $15,000 maximum
      return Math.min(Math.max(suggested, min), max);
    }
    
    // Fallback default
    return 500000; // $5,000
  };

  const userBudget = report?.budget;
  const suggestedPaidMedia = calculateSuggestedPaidMedia(userBudget, marketingTotals.uaicodeTotal);
  
  const handleMarketingSelectionChange = useCallback((selectedIds: string[], totals: MarketingTotals) => {
    setSelectedMarketingIds(selectedIds);
    setMarketingTotals(totals);
  }, []);
  
  // Parse investment data from section_investment JSON (with fallback to legacy fields)
  const sectionInvestment = getSectionInvestment(reportData);
  const investmentNotIncluded = parseJsonField<{ items: string[] }>(report?.investment_not_included, { items: [] });
  
  // MVP Investment breakdown values - prefer section_investment, fallback to legacy fields
  const mvpBreakdown = getInvestmentBreakdown(reportData, sectionInvestment);

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
        <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
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
                      <Check className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
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
                      <Minus className="h-3 w-3 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Comparison Slider */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
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
          budgetSource={userBudget}
        />

        {/* Marketing Cost Comparison Slider - Dynamic */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
          <CardContent className="p-5">
            <MarketingComparisonSlider 
              uaicodeTotal={marketingTotals.uaicodeTotal}
              traditionalMin={marketingTotals.traditionalMinTotal}
              traditionalMax={marketingTotals.traditionalMaxTotal}
              paidMediaBudget={suggestedPaidMedia}
              savingsPercentMin={marketingTotals.savingsPercentMin}
              savingsPercentMax={marketingTotals.savingsPercentMax}
              annualSavingsMin={marketingTotals.annualSavingsMin}
              annualSavingsMax={marketingTotals.annualSavingsMax}
              isLoading={marketingLoading}
            />
          </CardContent>
        </Card>
      </div>


      {/* Total First Year Investment - Uaicode Premium Pattern */}
      <div className="flex items-center gap-2 mt-10">
        <h3 className="font-semibold text-foreground text-lg">Total First Year Investment</h3>
        <InfoTooltip side="right" size="sm">
          Complete first year investment including MVP development and marketing.
        </InfoTooltip>
      </div>

      <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
        <CardContent className="p-5">
          {/* Main Grid - 4 columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* MVP Development */}
            <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">MVP Development</p>
                <p className="text-base md:text-lg font-bold text-foreground">
                  {formatCurrency(investment.total)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">(one-time)</p>
              </CardContent>
            </Card>
            
            {/* Marketing Services */}
            <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Marketing Services</p>
                <p className="text-base md:text-lg font-bold text-foreground">
                  {formatCurrency(marketingTotals.uaicodeTotal * 12 / 100)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">(selected × 12)</p>
              </CardContent>
            </Card>
            
            {/* Paid Media */}
            <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Paid Media*</p>
                <p className="text-base md:text-lg font-bold text-foreground">
                  {formatCurrency(suggestedPaidMedia * 12 / 100)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  ({formatCurrency(suggestedPaidMedia / 100)}/mo)
                </p>
              </CardContent>
            </Card>
            
            {/* Total Year 1 - Highlighted */}
            <Card className="bg-accent/10 border-accent/30 hover:border-accent/40 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <p className="text-[10px] text-accent uppercase tracking-wide font-medium mb-1">Total Year 1</p>
                <p className="text-lg md:text-xl font-bold text-gradient-gold">
                  {formatCurrency(investment.total + marketingYearlyTotal / 100)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* After Year 1 - Subtle footer */}
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-sm text-muted-foreground">After Year 1:</span>
            <span className="text-sm font-semibold text-accent">
              {formatCurrency(marketingYearlyTotal / 100)}/year
            </span>
            <span className="text-xs text-muted-foreground">(marketing only)</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default InvestmentSection;
