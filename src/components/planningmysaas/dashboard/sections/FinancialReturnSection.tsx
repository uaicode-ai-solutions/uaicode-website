// ============================================
// Financial Return Section - Restructured
// Matches CustomerPainPointsSection visual style
// Now connected to marketing investment selections
// ============================================

import { TrendingUp, Target, Shield, Rocket, DollarSign, Clock, Zap, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import { formatCurrency } from "@/lib/financialParsingUtils";
import { JCurveChart } from "@/components/planningmysaas/dashboard/JCurveChart";
import { 
  calculateSuggestedPaidMedia, 
  calculateMarketingEfficiency,
  calculateTotalMarketingMonthly 
} from "@/lib/marketingBudgetUtils";

const FinancialReturnSection = () => {
  const { reportData, report, marketingTotals } = useReportContext();
  
  // Debug log to verify marketingTotals updates
  console.log('[FinancialReturnSection] marketingTotals:', marketingTotals);
  
  // Get market_type from wizard data
  const marketType = report?.market_type || undefined;
  
  // Get all financial metrics from hook
  const metrics = useFinancialMetrics(reportData, marketType);

  // Extract key values - NO FALLBACKS, use "..." for display when null
  const breakEvenMonths = metrics.breakEvenMonthsNum;
  const roiYear1 = metrics.roiYear1Num;
  // PRIORITIZE ltvCacCalculated for consistency across all Report sections
  const ltvCacRatioNum = metrics.ltvCacCalculated ?? metrics.ltvCacRatioNum;
  const paybackMonths = metrics.paybackPeriod;
  const mrrMonth12 = metrics.mrrMonth12Num ?? 0;
  const arrYear1 = metrics.arrProjectedNum ?? 0;
  // Calculate raw ARR Year 3 only if data exists
  const rawArrYear3 = metrics.arr24Months ? metrics.arr24Months.avg * 1.5 : (arrYear1 ? arrYear1 * 2.54 : 0);
  const maxGrowthMultiple = 10; // 900% max growth - realistic for high-growth SaaS
  const arrYear3 = arrYear1 > 0 ? Math.min(rawArrYear3, arrYear1 * maxGrowthMultiple) : 0;
  
  // Calculate growth percentage only if data exists
  const rawGrowthPercent = arrYear1 > 0 ? Math.round(((arrYear3 - arrYear1) / arrYear1) * 100) : 0;
  const growthPercent = Math.min(rawGrowthPercent, 900);
  const wasGrowthCapped = rawGrowthPercent > 900;
  // ARPU and LTV from database - no fallbacks
  const arpu = metrics.idealTicket;
  const ltv = metrics.ltv ?? 0;
  const mvpInvestment = metrics.mvpInvestment || 0;
  
  // Fixed baseline for comparison = minimum marketing package
  // (Project Manager $1,200 + 1 service ~$1,800 = $3,000 subscription + $3,000 paid media = $6,000/mo)
  const MINIMUM_MARKETING_BASELINE = 6000;
  const baselineMarketingBudget = MINIMUM_MARKETING_BASELINE;
  
  // Calculate effective marketing budget based on user selections
  const userBudget = report?.budget;
  const suggestedPaidMedia = calculateSuggestedPaidMedia(userBudget, marketingTotals.uaicodeTotal);
  const totalMarketingMonthly = calculateTotalMarketingMonthly(
    marketingTotals.uaicodeTotal, 
    suggestedPaidMedia
  );
  
  // Use user's marketing selection if available, otherwise fall back to baseline
  const effectiveMarketingBudget = marketingTotals.uaicodeTotal > 0 
    ? totalMarketingMonthly 
    : baselineMarketingBudget;
  
  // Calculate marketing efficiency for display
  const marketingEfficiency = calculateMarketingEfficiency(effectiveMarketingBudget, baselineMarketingBudget);
  const efficiencyBoostPercent = Math.round((marketingEfficiency - 1) * 100);
  
  // Calculate total investment including first year marketing
  const marketingYear1 = effectiveMarketingBudget * 12;
  const totalInvestment = mvpInvestment + marketingYear1;
  
  // Debug log to verify calculation flow
  console.log('[FinancialReturnSection] Calculated values:', {
    baselineMarketingBudget,
    effectiveMarketingBudget,
    marketingYear1,
    totalInvestment,
    marketingEfficiency,
    efficiencyBoostPercent,
    uaicodeTotal: marketingTotals.uaicodeTotal,
  });

  // Scenario data for cards and chart
  const scenarios = [
    {
      name: "Conservative" as const,
      icon: Shield,
      probability: "25%",
      probNum: 25,
      mrrMonth12: Math.round(mrrMonth12 * 0.7),
      breakEvenMonths: Math.min(60, Math.round(breakEvenMonths * 1.3)),
      arr: Math.round(arrYear1 * 0.7),
      color: "text-slate-400",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20",
      progressColor: "bg-slate-400",
    },
    {
      name: "Realistic" as const,
      icon: Target,
      probability: "50%",
      probNum: 50,
      mrrMonth12: mrrMonth12,
      breakEvenMonths: breakEvenMonths,
      arr: arrYear1,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      progressColor: "bg-gradient-to-r from-amber-500 to-amber-400",
      highlighted: true,
    },
    {
      name: "Optimistic" as const,
      icon: Rocket,
      probability: "25%",
      probNum: 25,
      mrrMonth12: Math.round(mrrMonth12 * 1.5),
      breakEvenMonths: Math.max(12, Math.round(breakEvenMonths * 0.65)),
      arr: Math.round(arrYear1 * 1.5),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      progressColor: "bg-green-500",
    },
  ];

  // Prepare scenarios for JCurveChart
  const chartScenarios = scenarios.map((s) => ({
    name: s.name,
    mrrMonth12: s.mrrMonth12,
    breakEvenMonths: s.breakEvenMonths,
    probability: s.probability,
  }));

  // Calculate additional metrics for the "How it works" explanation - no fallbacks
  const churnMonthly = metrics.unitEconomics?.monthlyChurn 
    ? parseFloat(String(metrics.unitEconomics.monthlyChurn)) 
    : null;
  const ltvMonths = churnMonthly && churnMonthly > 0 ? Math.round(1 / (churnMonthly / 100)) : null;
  const cac = metrics.targetCac?.avg ?? null;
  const profitMonths = ltvMonths !== null && paybackMonths !== null ? Math.max(0, ltvMonths - paybackMonths) : null;

  // Unit economics data with tooltips - show "..." when data missing
  const unitEconomicsData = [
    {
      label: "ARPU",
      value: arpu !== null ? formatCurrency(arpu) : "...",
      sublabel: "/month",
      icon: DollarSign,
      tooltip: "Average Revenue Per User - the monthly recurring revenue you receive from each customer.",
    },
    {
      label: "Payback",
      value: paybackMonths !== null ? `${paybackMonths}` : "...",
      sublabel: "months",
      icon: Clock,
      tooltip: "Time in months to recover the cost of acquiring one customer through subscription revenue.",
    },
    {
      label: "LTV",
      value: ltv > 0 ? formatCurrency(ltv) : "...",
      sublabel: "lifetime",
      icon: TrendingUp,
      tooltip: "Lifetime Value - total revenue expected from a customer throughout their relationship.",
    },
    {
      label: "LTV/CAC",
      value: ltvCacRatioNum !== null ? `${ltvCacRatioNum.toFixed(1)}x` : "...",
      sublabel: ltvCacRatioNum !== null && ltvCacRatioNum >= 3 ? "healthy" : "monitor",
      sublabelType: ltvCacRatioNum !== null && ltvCacRatioNum >= 3 ? "success" : "warning",
      icon: Zap,
      highlight: ltvCacRatioNum !== null && ltvCacRatioNum >= 3,
      tooltip: "Ratio comparing customer value to acquisition cost. Above 3x indicates healthy unit economics.",
    },
  ] as const;

  return (
    <section id="financial-return" className="space-y-6">
      {/* [1] Header - Simple like Pain Points */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Return</h2>
            <InfoTooltip side="right" size="sm">
              Investment trajectory and financial return projections based on your market analysis.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            Financial projections based on your market
          </p>
        </div>
      </div>

      {/* Validation Warning Banner - Shows when projections were capped for realism */}
      {metrics.wasAdjustedForRealism && (
        <div className="flex items-center gap-2 text-sm bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
          <Shield className="h-4 w-4 text-amber-500" />
          <span className="text-foreground/80">
            <strong className="text-amber-500">Adjusted for market realism:</strong> Projections capped to reflect industry benchmarks for your market type.
            <InfoTooltip side="top" size="sm" className="ml-1 inline-block">
              AI-generated growth projections were compared against real-world SaaS benchmarks. Values exceeding market norms were adjusted to provide realistic expectations.
            </InfoTooltip>
          </span>
        </div>
      )}

      {/* Marketing Boost Badge - Shows when user has selected marketing services */}
      {marketingTotals.uaicodeTotal > 0 && efficiencyBoostPercent > 0 && (
        <div className="flex items-center gap-2 text-sm bg-accent/10 border border-accent/20 rounded-lg px-4 py-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-foreground/80">
            <strong className="text-accent">Marketing boost applied:</strong> +{efficiencyBoostPercent}% faster customer acquisition vs minimum package
          </span>
        </div>
      )}

      {/* [2] Grid Principal: J-Curve (2 cols) + Summary Card (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* J-Curve Chart - Main Visual */}
        <div className="lg:col-span-2">
          <JCurveChart
            mvpInvestment={mvpInvestment}
            marketingBudget={effectiveMarketingBudget}
            baselineMarketingBudget={baselineMarketingBudget}
            scenarios={chartScenarios}
            breakEvenMonths={breakEvenMonths}
            mrrMonth12={mrrMonth12}
          />
        </div>

        {/* Summary Card - Style Pain Points */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            {/* Header - Summary */}
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-sm font-medium text-foreground">Summary</h3>
              <InfoTooltip side="top" size="sm">
                Financial viability overview based on projected revenue, investment, and unit economics.
              </InfoTooltip>
            </div>

            {/* Big Number - Break-even */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gradient-gold mb-1">
                {breakEvenMonths !== null ? breakEvenMonths : "..."}
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <span>Months to Profitability</span>
                <InfoTooltip side="top" size="sm">
                  Time until cumulative revenue exceeds total investment. The point where your SaaS becomes self-sustaining.
                </InfoTooltip>
              </div>
            </div>

            {/* Stats - Reordered: LTV/CAC first (strongest indicator) */}
            <div className="space-y-3">
              {/* LTV/CAC - Primary indicator (usually positive) */}
              <div className={`flex items-center justify-between p-3 rounded-lg ${ltvCacRatioNum !== null && ltvCacRatioNum >= 3 ? 'bg-accent/10 border-accent/30' : 'bg-accent/5 border-accent/10'} border`}>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">LTV/CAC Ratio</span>
                  <InfoTooltip side="top" size="sm">
                    Key viability indicator. Ratio comparing customer lifetime value to acquisition cost. Above 3x indicates healthy, sustainable unit economics.
                  </InfoTooltip>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${ltvCacRatioNum !== null && ltvCacRatioNum >= 3 ? 'text-accent' : 'text-foreground'}`}>
                    {ltvCacRatioNum !== null ? `${ltvCacRatioNum.toFixed(1)}x` : "..."}
                  </span>
                  {ltvCacRatioNum !== null && ltvCacRatioNum >= 3 && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-accent/10 border-accent/30 text-accent">
                      ✓ healthy
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Payback Period */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Payback Period</span>
                  <InfoTooltip side="top" size="sm">
                    Time in months to recover the cost of acquiring one customer through subscription revenue.
                  </InfoTooltip>
                </div>
                <span className="font-bold text-foreground">{paybackMonths !== null ? `${paybackMonths}mo` : "..."}</span>
              </div>
              
              {/* ROI Year 1 - With educational context */}
              <div className="flex flex-col p-3 rounded-lg bg-accent/5 border border-accent/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">ROI Year 1</span>
                    <InfoTooltip side="top" size="sm">
                      Year 1 ROI in SaaS is typically negative due to upfront investment (the "J-Curve"). 
                      {breakEvenMonths !== null ? ` Your break-even in ${breakEvenMonths} months indicates healthy trajectory.` : ''} 
                      Focus on LTV/CAC ratio as the key viability indicator.
                    </InfoTooltip>
                  </div>
                  <span className={`font-bold ${roiYear1 !== null && roiYear1 >= 0 ? 'text-accent' : 'text-amber-500'}`}>
                    {roiYear1 !== null ? `${roiYear1 >= 0 ? '+' : ''}${roiYear1}%` : "..."}
                  </span>
                </div>
                {roiYear1 !== null && roiYear1 < 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-amber-500/70 mt-1.5">
                    <Clock className="h-3 w-3" />
                    <span>Investment phase – typical for Year 1</span>
                  </div>
                )}
              </div>
            </div>


            {/* Investment Badge */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Total Investment</span>
                  <InfoTooltip side="top" size="sm">
                    Combined cost of MVP development ({formatCurrency(mvpInvestment)}) plus first-year marketing budget ({formatCurrency(marketingYear1)}) required to launch and grow the product.
                  </InfoTooltip>
                </div>
                <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                  {formatCurrency(totalInvestment)}
                </Badge>
              </div>
              {marketingYear1 > 0 && (
                <div className="text-[10px] text-muted-foreground/70 text-right mt-1">
                  MVP {formatCurrency(mvpInvestment)} + Marketing {formatCurrency(marketingYear1)}/yr
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* J-Curve Educational Banner - Below chart for context */}
        {roiYear1 !== null && roiYear1 < 0 && (
          <div className="flex items-start gap-3 text-sm text-amber-600/80 bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <TrendingUp className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
            <div>
              <strong className="text-amber-500">J-Curve expected:</strong>{' '}
              <span className="text-muted-foreground">
                Initial investment phase is typical for SaaS. {ltvCacRatioNum !== null ? `Your ${ltvCacRatioNum.toFixed(1)}x LTV/CAC indicates strong long-term viability.` : ''}
              </span>
            </div>
          </div>
        )}

        {/* [3] Key Metrics - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">MRR Month 12</span>
              <InfoTooltip side="top" size="sm">
                Monthly Recurring Revenue projected for month 12. The predictable income from active subscriptions.
              </InfoTooltip>
            </div>
            <div className="text-2xl font-bold text-gradient-gold">
              {formatCurrency(mrrMonth12)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              Monthly recurring revenue
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">Projected ARR</span>
              <InfoTooltip side="top" size="sm">
                Annual Recurring Revenue - your MRR multiplied by 12. Key metric for SaaS valuation and growth tracking.
              </InfoTooltip>
            </div>
            <div className="text-2xl font-bold text-gradient-gold">
              {formatCurrency(arrYear1)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              Annual recurring revenue
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">3-Year Growth</span>
              <InfoTooltip side="top" size="sm">
                Percentage increase in ARR from Year 1 to Year 3, based on compound growth projections for your market.
              </InfoTooltip>
            </div>
            <div className="text-2xl font-bold text-gradient-gold">
              {growthPercent > 0 ? `+${growthPercent}%` : `${growthPercent}%`}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              {formatCurrency(arrYear1)} → {formatCurrency(arrYear3)}
            </div>
            {wasGrowthCapped && (
              <div className="text-[9px] text-amber-500/70 mt-1">
                Adjusted for market realism
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* [4] Projection Scenarios - 3 Cards (Pain Points Style) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-foreground">Projection Scenarios</span>
          <InfoTooltip size="sm">
            Three possible outcomes based on market conditions and execution quality.
          </InfoTooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <Card
              key={scenario.name}
              className={`${scenario.bgColor} ${scenario.borderColor} border ${
                scenario.highlighted ? 'ring-1 ring-accent/30' : ''
              } hover:scale-[1.02] transition-all duration-300`}
            >
              <CardContent className="p-5">
                {/* Header: Number badge + Probability */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${scenario.bgColor} border ${scenario.borderColor} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${scenario.color}`}>#{index + 1}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${scenario.borderColor} ${scenario.color}`}>
                    {scenario.probability} prob
                  </Badge>
                </div>

                {/* Scenario Name + Icon */}
                <div className="flex items-center gap-2 mb-4">
                  <scenario.icon className={`h-4 w-4 ${scenario.color}`} />
                  <h4 className="font-semibold text-foreground text-sm">
                    {scenario.name}
                  </h4>
                  {scenario.highlighted && (
                    <Badge className="text-[9px] px-1.5 py-0 bg-accent/20 text-accent border-accent/30">
                      Most Likely
                    </Badge>
                  )}
                </div>

                {/* Metrics */}
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Month 12 MRR</span>
                      <InfoTooltip side="top" size="sm">
                        Monthly Recurring Revenue at the end of Year 1 for this scenario.
                      </InfoTooltip>
                    </div>
                    <span className={`font-medium ${scenario.highlighted ? 'text-gradient-gold' : 'text-foreground'}`}>
                      {formatCurrency(scenario.mrrMonth12)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Break-even</span>
                      <InfoTooltip side="top" size="sm">
                        Months until total revenue exceeds total investment in this scenario.
                      </InfoTooltip>
                    </div>
                    <span className="font-medium text-foreground">
                      {scenario.breakEvenMonths} months
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Year 1 ARR</span>
                      <InfoTooltip side="top" size="sm">
                        Annual Recurring Revenue projection for this scenario after 12 months.
                      </InfoTooltip>
                    </div>
                    <span className="font-medium text-foreground">
                      {formatCurrency(scenario.arr)}
                    </span>
                  </div>
                </div>

                {/* Progress bar (probability visual) */}
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${scenario.progressColor} rounded-full`}
                    style={{ width: `${scenario.probNum}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* [5] Unit Economics - Clean Style (matching Customer Pain Points) */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-sm font-medium text-foreground">Unit Economics</h3>
            <InfoTooltip side="top" size="sm">
              Key financial metrics: revenue per user, payback period, and lifetime value.
            </InfoTooltip>
          </div>

          {/* How it works banner */}
          <div className="p-4 rounded-lg bg-card/80 border border-border/30 mb-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">How it works:</span>{" "}
              You invest{" "}
              <span className="font-medium text-foreground">{formatCurrency(cac)}</span>{" "}
              once to acquire a customer (CAC). They pay{" "}
              <span className="font-medium text-foreground">{formatCurrency(arpu)}/month</span>{" "}
              for an average of{" "}
              <span className="font-medium text-foreground">{ltvMonths} months</span>,{" "}
              generating{" "}
              <span className="font-medium text-foreground">{formatCurrency(ltv)}</span>{" "}
              in total revenue (LTV). You recover your acquisition cost in{" "}
              <span className="font-medium text-foreground">{paybackMonths} months</span>,{" "}
              then profit for the remaining{" "}
              <span className="font-medium text-foreground">{profitMonths} months</span>.{" "}
              This is a {ltvCacRatioNum >= 3 ? "healthy" : "developing"} business model with{" "}
              {ltvCacRatioNum >= 3 ? "strong" : "growing"} unit economics.
            </p>
          </div>

          {/* Unit Economics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unitEconomicsData.map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-lg bg-accent/5 border border-border/30 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <item.icon className="h-3.5 w-3.5 text-accent" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {item.label}
                  </span>
                  <InfoTooltip side="top" size="sm">
                    {item.tooltip}
                  </InfoTooltip>
                </div>
                <div className="text-xl font-bold text-gradient-gold mb-1">
                  {item.value}
                </div>
                <div className={`text-[10px] mb-3 flex items-center gap-1 ${
                  'sublabelType' in item && item.sublabelType === 'success' 
                    ? 'text-accent' 
                    : 'sublabelType' in item && item.sublabelType === 'warning' 
                      ? 'text-amber-500' 
                      : 'text-muted-foreground'
                }`}>
                  {'sublabelType' in item && item.sublabelType === 'success' && '✓ '}
                  {'sublabelType' in item && item.sublabelType === 'warning' && '⚠ '}
                  {item.sublabel}
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full"
                    style={{ width: 'highlight' in item && item.highlight ? '100%' : '75%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FinancialReturnSection;
