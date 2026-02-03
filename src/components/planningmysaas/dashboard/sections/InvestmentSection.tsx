import { useCallback, useEffect } from "react";
import { DollarSign, Check, Minus, PieChart, AlertCircle, Sparkles, Megaphone, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { useMvpTier } from "@/hooks/useMvpTier";
import { useMarketingTiers, MarketingTotals, calculateMarketingTotals } from "@/hooks/useMarketingTiers";
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
  const { report, reportData, selectedMarketingIds, setSelectedMarketingIds, marketingTotals, setMarketingTotals, wizardId } = useReportContext();
  const wizardIdFromData = reportData?.wizard_id;
  const selectedFeatures = report?.selected_features || [];
  const { tier, pricing, featureCounts, isLoading: tierLoading } = useMvpTier(selectedFeatures);
  const { services, isLoading: marketingLoading } = useMarketingTiers();
  
  // Initialize marketing totals with ALL services (readOnly mode always uses all)
  useEffect(() => {
    if (!marketingLoading && services.length > 0) {
      const allServiceIds = services.map(s => s.service_id);
      setSelectedMarketingIds(allServiceIds);
      
      const totals = calculateMarketingTotals(allServiceIds, services);
      console.log('[InvestmentSection] Initialized marketing totals with all services:', { 
        count: allServiceIds.length, 
        uaicodeTotal: totals.uaicodeTotal / 100 
      });
      setMarketingTotals(totals);
    }
  }, [services, marketingLoading, setSelectedMarketingIds, setMarketingTotals]);
  
  // Calculate suggested paid media based on wizard budget selection
  // Uses shared utility with correct budget ranges from StepGoals.tsx
  const calculateSuggestedPaidMedia = (budget: string | null | undefined, uaicodeTotal: number): number => {
    // Budget map matching current wizard ranges (StepGoals.tsx)
    const budgetMap: Record<string, number> = {
      '10k-25k': 250000,    // $2,500 (~14% of $17.5K midpoint)
      '25k-60k': 600000,    // $6,000 (~14% of $42.5K midpoint)
      '60k-160k': 1500000,  // $15,000 (~14% of $110K midpoint)
      '160k+': 3000000,     // $30,000 (~15% of $200K estimated)
      'guidance': 0,        // Calculated dynamically
    };
    
    // If user chose a specific budget range (not 'guidance')
    if (budget && budgetMap[budget] !== undefined) {
      const mappedValue = budgetMap[budget];
      
      // For 'guidance' or zero-mapped budgets, calculate dynamically
      if (mappedValue === 0 && uaicodeTotal > 0) {
        const suggested = Math.round(uaicodeTotal * 0.75);
        const min = 300000;  // $3,000 minimum
        const max = 1500000; // $15,000 maximum
        return Math.min(Math.max(suggested, min), max);
      }
      
      return mappedValue;
    }
    
    // If not defined, use 75% of uaicodeTotal with min/max caps
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
    console.log('[InvestmentSection] Marketing selection changed:', { selectedIds, totals });
    setSelectedMarketingIds(selectedIds);
    setMarketingTotals(totals);
  }, [setSelectedMarketingIds, setMarketingTotals]);
  
  // Parse investment data from section_investment JSON (with fallback to legacy fields)
  const sectionInvestment = getSectionInvestment(reportData);
  const investmentNotIncluded = parseJsonField<{ items: string[] }>(report?.investment_not_included, { items: [] });
  
  // MVP Investment breakdown values - prefer section_investment, fallback to legacy fields
  const mvpBreakdown = getInvestmentBreakdown(reportData, sectionInvestment);
  
  // All values come directly from database - no fallback agents

  // Format currency with fallback "..." or skeleton
  // Uses Number() to handle scientific notation strings from Supabase JSONB
  const formatValueOrFallback = (cents: number | string | null | undefined, loading?: boolean) => {
    if (loading) return null; // Will render skeleton
    if (cents === null || cents === undefined) return "...";
    // Handle scientific notation strings from JSONB (e.g., "1.45e+07")
    const numCents = typeof cents === 'string' ? Number(cents) : cents;
    if (isNaN(numCents)) return "...";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numCents / 100);
  };

  // Colors for donut chart
  const COLORS = [
    'hsl(var(--accent))',
    'hsl(45, 100%, 45%)',
    'hsl(var(--accent) / 0.7)',
    'hsl(45, 80%, 55%)',
    'hsl(var(--accent) / 0.5)',
  ];

  // Breakdown items with values from database (100% from section_investment JSONB)
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

  // UNIFIED: Prefer database onePayment value, use breakdown as detail view
  const investmentTotal = mvpBreakdown.onePayment ? mvpBreakdown.onePayment / 100 : 0;
  
  // Log divergence for debugging (not shown to user)
  if (mvpBreakdown.onePayment && totalFromBreakdown > 0) {
    const divergence = Math.abs(mvpBreakdown.onePayment - totalFromBreakdown);
    if (divergence > 10000) { // > $100 divergence
      console.warn('[InvestmentSection] Investment breakdown divergence:', {
        onePayment: mvpBreakdown.onePayment / 100,
        breakdownTotal: totalFromBreakdown / 100,
        divergenceUSD: divergence / 100
      });
    }
  }

  // Build investment object for other parts of the component
  const investment = {
    total: investmentTotal,
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

  // Detect mismatch between user budget and calculated investment
  const getBudgetMismatchInfo = (userBudget: string | null | undefined, investmentCents: number | null) => {
    if (!userBudget || !investmentCents) return null;
    
    // If user chose "guidance", don't show alert
    if (userBudget === "guidance") return null;
    
    const budgetRanges: Record<string, { min: number; max: number; label: string }> = {
      '10k-25k':  { min: 1000000,  max: 2500000,  label: '$10K - $25K' },
      '25k-60k':  { min: 2500000,  max: 6000000,  label: '$25K - $60K' },
      '60k-160k': { min: 6000000,  max: 16000000, label: '$60K - $160K' },
      '160k+':    { min: 16000000, max: Infinity, label: '$160K+' },
    };
    
    const range = budgetRanges[userBudget];
    if (!range) return null;
    
    // If budget is 100k+, no upper limit
    if (userBudget === '100k+') return null;
    
    // Mismatch exists if investment exceeds max budget by more than 20%
    const threshold = range.max * 1.2;
    if (investmentCents <= threshold) return null;
    
    const overageMultiple = investmentCents / range.max;
    
    return {
      userBudgetLabel: range.label,
      investmentFormatted: formatCurrency(investmentCents / 100),
      overageMultiple: overageMultiple.toFixed(1),
      severity: overageMultiple > 3 ? 'critical' as const : 'warning' as const,
    };
  };

  // Calculate budget mismatch
  const budgetMismatch = getBudgetMismatchInfo(userBudget, mvpBreakdown.onePayment);

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

      {/* Budget Mismatch Alert */}
      {budgetMismatch && (
        <Card className={cn(
          "border-2 animate-fade-in",
          budgetMismatch.severity === 'critical' 
            ? "bg-red-500/10 border-red-500/50" 
            : "bg-amber-500/10 border-amber-500/50"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className={cn(
                "h-5 w-5 flex-shrink-0 mt-0.5",
                budgetMismatch.severity === 'critical' ? "text-red-500" : "text-amber-500"
              )} />
              <div className="flex-1">
                <h4 className={cn(
                  "font-semibold text-sm",
                  budgetMismatch.severity === 'critical' ? "text-red-400" : "text-amber-400"
                )}>
                  Investment Exceeds Your Budget
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your selected budget range is <span className="font-medium text-foreground">{budgetMismatch.userBudgetLabel}</span>, 
                  but the calculated MVP investment is <span className="font-medium text-foreground">{budgetMismatch.investmentFormatted}</span> 
                  ({budgetMismatch.overageMultiple}× your maximum budget).
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Consider reducing features or scheduling a call to discuss phased development options.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <InfoTooltip side="right" size="sm">
          Marketing services included in the Complete Launch Bundle.
        </InfoTooltip>
      </div>

      {/* Marketing Service Selector - Now readOnly with all services displayed */}
      <MarketingServiceSelector 
        onSelectionChange={handleMarketingSelectionChange}
        defaultSelectRecommended={true}
        readOnly={true}
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
