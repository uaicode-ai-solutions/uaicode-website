import { TrendingUp, Clock, DollarSign, Target, BarChart3, Shield, Rocket, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import { formatCurrency } from "@/lib/financialParsingUtils";
import { useSmartFallbackField } from "@/hooks/useSmartFallbackField";
import { InlineValueSkeleton } from "@/components/ui/fallback-skeleton";
import { DataSourceBadge, DataSourceType } from "@/components/planningmysaas/dashboard/ui/DataSourceBadge";
import { BenchmarkSourceBadge } from "@/components/planningmysaas/dashboard/ui/BenchmarkSourceBadge";
import { useBenchmarks } from "@/hooks/useBenchmarks";
import InvestmentHighlights from "@/components/planningmysaas/dashboard/InvestmentHighlights";
import {
  getROIBenchmarkBadge,
  getBreakEvenBenchmarkBadge,
  getROIStatus,
} from "@/lib/financialDisplayUtils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const FinancialReturnSection = () => {
  const { reportData, report, reportId } = useReportContext();
  const wizardId = reportData?.wizard_id;
  
  // Get market_type from wizard data (report) to pass to financial metrics
  const marketType = report?.market_type || undefined;
  
  // Use the new hook to extract all financial metrics from JSONB
  // Pass marketTypeOverride from wizard data for correct B2B/B2C churn & LTV caps
  const metrics = useFinancialMetrics(reportData, marketType);
  
  // Get benchmark data to show source badge
  const benchmarkData = useBenchmarks(reportData?.benchmark_section, marketType);
  
  // NOTE: break_even and ROI are now ALWAYS calculated locally by useFinancialMetrics
  // No need for smart fallback on these - they're derived from MRR/investment data
  const breakEvenLoading = false;
  const breakEvenValue = metrics.breakEvenMonths;
  
  const roiLoading = false;
  const roiValue = metrics.roiYear1;
  
  // Smart fallback only for raw data that might be missing (MRR/ARR from DB)
  const { value: mrrValue, isLoading: mrrLoading } = useSmartFallbackField({
    fieldPath: "growth_intelligence_section.growth_targets.12_month.mrr",
    currentValue: metrics.mrrMonth12 !== "..." ? metrics.mrrMonth12 : undefined,
    skipFallback: metrics.mrrMonth12 !== "...", // Skip if already calculated
  });
  
  const { value: arrValue, isLoading: arrLoading } = useSmartFallbackField({
    fieldPath: "growth_intelligence_section.growth_targets.12_month.arr",
    currentValue: metrics.arrProjected !== "..." ? metrics.arrProjected : undefined,
    skipFallback: metrics.arrProjected !== "...", // Skip if already calculated
  });

  const scenarioIcons: Record<string, React.ElementType> = {
    Conservative: Shield,
    Realistic: Target,
    Optimistic: Rocket,
  };

  // Validation flags for extreme values
  const isROIVeryHigh = metrics.roiYear1Num !== null && metrics.roiYear1Num > 250;
  const isROINegative = metrics.roiYear1Num !== null && metrics.roiYear1Num < -50;
  const isBreakEvenExtended = metrics.breakEvenMonthsNum !== null && metrics.breakEvenMonthsNum > 24;

  // Get dynamic benchmark badges
  const roiBenchmark = getROIBenchmarkBadge(metrics.roiYear1Num, marketType);
  const breakEvenBenchmark = getBreakEvenBenchmarkBadge(metrics.breakEvenMonthsNum, marketType);
  const roiStatus = getROIStatus(metrics.roiYear1Num, marketType);
  
  // Calculate 3-year growth percentage for highlights
  const arrYear1 = metrics.arr12Months?.avg || metrics.arrProjectedNum || null;
  const arrYear3 = metrics.arr24Months ? metrics.arr24Months.avg * 1.5 : (arrYear1 ? arrYear1 * 2.54 : null);
  const growthPercent = arrYear1 && arrYear3 ? ((arrYear3 - arrYear1) / arrYear1) * 100 : null;
  
  // Get market size from opportunity section
  const opportunitySection = reportData?.opportunity_section as Record<string, unknown> | null;
  const marketSizeRaw = opportunitySection?.tam_value as string | null;
  const marketSize = marketSizeRaw ? formatMarketSize(marketSizeRaw) : null;
  
  // Helper to format market size
  function formatMarketSize(value: string): string {
    // Extract just the number part, preferring the max if range
    const match = value.match(/\$[\d.]+[BMK]?/g);
    if (match && match.length > 0) {
      return match[match.length - 1]; // Return the last (max) value
    }
    return value;
  }

  const keyMetrics: {
    icon: typeof Clock;
    label: string;
    value: string | undefined;
    isLoading: boolean;
    sublabel: string;
    highlight: boolean;
    tooltip: string;
    warning: boolean;
    dataSource: DataSourceType;
    benchmarkBadge?: { label: string; variant: 'success' | 'warning' | 'default' | 'attention'; tooltip: string };
  }[] = [
    {
      icon: Clock,
      label: "Path to Profitability",
      value: breakEvenLoading ? undefined : (breakEvenValue || metrics.breakEvenMonths),
      isLoading: breakEvenLoading,
      sublabel: breakEvenBenchmark.label,
      highlight: true,
      tooltip: "The month when your cumulative revenue exceeds your total investment and operational costs.",
      warning: isBreakEvenExtended,
      dataSource: metrics.dataSources.breakEven,
      benchmarkBadge: breakEvenBenchmark,
    },
    {
      icon: TrendingUp,
      label: "Year 1 ROI",
      value: roiLoading ? undefined : (roiValue || metrics.roiYear1),
      isLoading: roiLoading,
      sublabel: roiBenchmark.label,
      highlight: false,
      tooltip: "Return on Investment - The projected percentage gain on your investment in the first year.",
      warning: isROIVeryHigh,
      dataSource: metrics.dataSources.roiYear1,
      benchmarkBadge: roiBenchmark,
    },
    {
      icon: DollarSign,
      label: "Month 12 MRR",
      value: mrrLoading ? undefined : (mrrValue || metrics.mrrMonth12),
      isLoading: mrrLoading,
      sublabel: "Monthly recurring revenue",
      highlight: false,
      tooltip: "Monthly Recurring Revenue - The predictable monthly revenue from subscriptions at month 12.",
      warning: false,
      dataSource: metrics.dataSources.mrrMonth12,
    },
    {
      icon: Target,
      label: "Projected ARR",
      value: arrLoading ? undefined : (arrValue || metrics.arrProjected),
      isLoading: arrLoading,
      sublabel: "Annual recurring revenue",
      highlight: false,
      tooltip: "Annual Recurring Revenue - The yearly value of your recurring subscriptions (MRR × 12).",
      warning: false,
      dataSource: metrics.dataSources.arrProjected,
    },
  ];

  return (
    <section id="financial-return" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20">
            <BarChart3 className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">The Return</h2>
              <InfoTooltip side="right" size="sm">
                Financial projections including ROI, break-even analysis, and unit economics for your SaaS business model.
              </InfoTooltip>
            </div>
            <p className="text-sm text-muted-foreground">Financial projections and scenarios</p>
          </div>
        </div>
        
        {/* Benchmark Source Badge */}
        <BenchmarkSourceBadge
          isFromResearch={benchmarkData.isFromResearch}
          sourceCount={benchmarkData.sourceCount}
          confidence={benchmarkData.confidence}
          sources={benchmarkData.rawBenchmarks?.sources}
        />
      </div>
      
      {/* Validation Warning Banner */}
      {metrics.wasAdjustedForRealism && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-500 font-medium">Projections adjusted for market realism</p>
              <p className="text-muted-foreground text-xs mt-1">
                Values were capped to match {benchmarkData.isFromResearch ? 'researched market benchmarks' : 'industry averages'} for your sector.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Investment Highlights - Dynamic Component */}
      <InvestmentHighlights
        ltvCacRatio={metrics.ltvCacCalculated}
        paybackMonths={metrics.paybackPeriod}
        marketSize={marketSize}
        growthPercent={growthPercent}
        arrYear1={arrYear1}
        arrYear3={arrYear3}
        breakEvenMonths={metrics.breakEvenMonthsNum}
        roiYear1={metrics.roiYear1Num}
        marketType={marketType}
      />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {keyMetrics.map((metric, index) => (
          <Card 
            key={index}
            className={`bg-card/50 border-border/30 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 ${metric.highlight ? 'ring-1 ring-accent/30' : ''} ${metric.warning ? 'ring-1 ring-amber-500/30' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1.5 rounded-lg ${metric.warning ? 'bg-amber-500/20' : metric.highlight ? 'bg-accent/20' : 'bg-muted/30'}`}>
                    <metric.icon className={`h-3.5 w-3.5 ${metric.warning ? 'text-amber-500' : metric.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <InfoTooltip side="top" size="sm">
                    {metric.tooltip}
                  </InfoTooltip>
                </div>
                <DataSourceBadge source={metric.dataSource} size="xs" />
              </div>
              <div className={`text-2xl font-bold ${metric.warning ? 'text-amber-500' : 'text-gradient-gold'}`}>
                {metric.isLoading ? <InlineValueSkeleton size="lg" /> : metric.value}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className={`text-xs ${metric.warning ? 'text-amber-500/80' : 'text-muted-foreground'}`}>{metric.sublabel}</p>
                {metric.benchmarkBadge && (
                  <Badge 
                    className={`text-[9px] px-1.5 py-0 ${
                      metric.benchmarkBadge.variant === 'success' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                        : metric.benchmarkBadge.variant === 'warning'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : 'bg-muted/20 text-muted-foreground border-border/30'
                    }`}
                    title={metric.benchmarkBadge.tooltip}
                  >
                    {metric.benchmarkBadge.variant === 'success' ? '✓' : ''}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue vs Costs Chart - Full Width */}
      <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">Revenue vs Costs (12 months)</h3>
              <InfoTooltip side="top" size="sm">
                Monthly revenue vs operational and marketing costs projection over the first year.
              </InfoTooltip>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Costs</span>
              </div>
            </div>
          </div>
          {metrics.projectionData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.projectionData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="costsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'revenue' ? 'Revenue' : 'Costs'
                    ]}
                  />
                  {metrics.breakEvenMonthsNum && metrics.breakEvenMonthsNum <= 12 && (
                    <ReferenceLine 
                      x={`M${metrics.breakEvenMonthsNum}`}
                      stroke="#F59E0B" 
                      strokeDasharray="5 5"
                      label={{ value: 'Break-even', fill: '#F59E0B', fontSize: 10 }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    name="revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="costs"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="url(#costsGradient)"
                    name="costs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>No projection data available</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projection Scenarios - Horizontal Row */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Projection Scenarios</h3>
          <InfoTooltip side="right" size="sm">
            Three scenarios based on different market conditions and execution quality.
          </InfoTooltip>
        </div>

        {/* ROI Estimate & 3-Year MRR Evolution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ROI Estimate Donut Chart */}
          <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h4 className="font-medium text-sm text-foreground">ROI Estimate</h4>
                <InfoTooltip side="top" size="sm">
                  Return on Investment projection for the first 12 months of operation.
                </InfoTooltip>
              </div>
              
              {/* Premium Circular Progress - Same style as Hero */}
              <div className="relative h-40 flex items-center justify-center">
                <div className="relative w-32 h-32 drop-shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="roiScoreGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#FCD34D" />
                      </linearGradient>
                      <filter id="roiGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="7"
                      fill="transparent"
                      className="text-muted/20"
                    />
                    {/* Progress circle with gradient and glow */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="url(#roiScoreGradient)"
                      strokeWidth="7"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${(Math.min(Math.abs(metrics.roiYear1Num || 0), 250) / 250) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                      className="transition-all duration-1000"
                      filter="url(#roiGlow)"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                      {metrics.roiYear1}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Description - Adaptive based on ROI value */}
              <div className="text-center mt-4">
                {metrics.roiYear1Num !== null ? (
                  metrics.roiYear1Num >= 0 ? (
                    // Positive ROI - show return calculation
                    <p className="text-sm text-foreground">
                      <span className="font-medium">$1 invested</span>
                      <span className="mx-2 text-muted-foreground">→</span>
                      <span className="font-bold text-gradient-gold">${(1 + (metrics.roiYear1Num || 0) / 100).toFixed(2)} return</span>
                    </p>
                  ) : (
                    // Negative ROI - show investment phase message
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{roiStatus.label}</span>
                    </p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">ROI calculation pending</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {metrics.roiYear1Num !== null && metrics.roiYear1Num < 0 
                    ? 'Focus: Customer Acquisition'
                    : '12 months'}
                </p>
              </div>
              
              {/* ROI Status - Using dynamic status */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">
                    {roiBenchmark.label}
                  </span>
                  <Badge 
                    className={`text-[10px] ${roiStatus.bgColor} ${roiStatus.textColor} ${roiStatus.borderColor}`}
                    title={roiBenchmark.tooltip}
                  >
                    {roiStatus.label}
                  </Badge>
                </div>
                {/* Progress bar - scale to max 200% for display */}
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      roiStatus.status === 'strong'
                        ? 'bg-gradient-to-r from-green-500 to-green-300'
                        : 'bg-gradient-to-r from-amber-500 to-amber-300'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, Math.abs(metrics.roiYear1Num || 0) / 2))}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {metrics.roiYear1Num !== null && metrics.roiYear1Num < 0 
                    ? 'Most SaaS businesses invest heavily in Year 1 for growth'
                    : 'Includes MVP, marketing & operational costs'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3-Year MRR Evolution */}
          <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-sm text-foreground">3-Year MRR Evolution</h4>
                <InfoTooltip side="top" size="sm">
                  Projected Annual Recurring Revenue growth over the next 3 years.
                </InfoTooltip>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Monthly Recurring Revenue growth over 36 months</p>
              
              {/* Year milestones cards */}
              <div className="grid grid-cols-3 gap-2">
                {metrics.yearEvolution.map((item, idx) => (
                  <div key={idx} className="bg-muted/20 rounded-lg p-2.5 text-center border border-border/20 hover:border-accent/30 transition-colors">
                    <p className="text-[10px] text-muted-foreground">{item.year}</p>
                    <p className="text-lg font-bold text-gradient-gold">{item.arr}</p>
                    <p className="text-[10px] text-muted-foreground">ARR</p>
                    <p className="text-[9px] text-amber-500/80">{item.mrr}</p>
                  </div>
                ))}
              </div>
              
              {/* Growth note */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground text-center">
                  {metrics.arr24Months 
                    ? "Projections based on growth intelligence data"
                    : "Year 2 and 3 projections will be calculated based on growth assumptions"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Scenario Cards */}
        {metrics.financialScenarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {metrics.financialScenarios.map((scenario, index) => {
              const ScenarioIcon = scenarioIcons[scenario.name] || Target;
              return (
                <Card 
                  key={index}
                  className={`transition-all duration-300 ${
                    scenario.name === 'Realistic' 
                      ? 'glass-card border-amber-500/30 ring-1 ring-amber-500/20 hover:border-amber-500/50' 
                      : 'bg-card/50 border-border/30 hover:border-accent/30'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ScenarioIcon className={`h-4 w-4 ${
                          scenario.name === 'Realistic' ? 'text-amber-500' : 'text-muted-foreground'
                        }`} />
                        <span className={`font-medium text-sm ${
                          scenario.name === 'Realistic' ? 'text-amber-500' : 'text-foreground'
                        }`}>
                          {scenario.name}
                        </span>
                        <InfoTooltip side="top" size="sm">
                          {scenario.name === 'Conservative' 
                            ? 'Pessimistic scenario assuming slower market adoption and higher churn.'
                            : scenario.name === 'Realistic'
                              ? 'Most likely scenario based on market data and comparable companies.'
                              : 'Optimistic scenario assuming faster growth and better retention.'
                          }
                        </InfoTooltip>
                      </div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {scenario.probability}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Month 12 MRR</span>
                        <span className="font-medium text-gradient-gold">
                          {formatCurrency(scenario.mrrMonth12)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year 1 ARR</span>
                        <span className="font-medium text-gradient-gold">
                          {formatCurrency(scenario.arrYear1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Break-even</span>
                        <span className="font-medium text-foreground">
                          {scenario.breakEven} months
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 rounded-lg bg-card/50 border border-border/30">
            <AlertCircle className="h-4 w-4" />
            <span>No financial scenarios available</span>
          </div>
        )}
      </div>

      {/* Unit Economics */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <DollarSign className="h-4 w-4 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Unit Economics</h3>
          <InfoTooltip side="right" size="sm">
            Key metrics showing your customer acquisition efficiency and lifetime value analysis.
          </InfoTooltip>
        </div>
        {metrics.unitEconomics ? (
          <>
            {/* 5 Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Ideal Ticket */}
              <Card className="bg-card/50 border-border/30 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-lg bg-muted/30">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Ideal Ticket</span>
                      <InfoTooltip side="top" size="sm">
                        Average Revenue Per User - the average monthly revenue per paying customer.
                      </InfoTooltip>
                    </div>
                    <DataSourceBadge source={metrics.dataSources.idealTicket} size="xs" />
                  </div>
                  <div className="text-2xl font-bold text-gradient-gold">{metrics.unitEconomics.idealTicket}</div>
                  <p className="text-xs mt-0.5 text-muted-foreground">/month</p>
                </CardContent>
              </Card>
              
              {/* Payback Period */}
              <Card className="bg-card/50 border-border/30 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-lg bg-muted/30">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Payback Period</span>
                      <InfoTooltip side="top" size="sm">
                        Time to recover Customer Acquisition Cost from subscription payments. Source: AI analysis based on your market and pricing model.
                      </InfoTooltip>
                    </div>
                    <DataSourceBadge source={metrics.dataSources.paybackPeriod} size="xs" />
                  </div>
                  <div className="text-2xl font-bold text-gradient-gold">{metrics.unitEconomics.paybackPeriod}</div>
                  <p className="text-xs mt-0.5 text-muted-foreground">months</p>
                </CardContent>
              </Card>
              
              {/* LTV */}
              <Card className="bg-card/50 border-border/30 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-lg bg-muted/30">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">LTV (Lifetime Value)</span>
                      <InfoTooltip side="top" size="sm">
                        Customer Lifetime Value calculated as ARPU × (1 / Monthly Churn Rate). Total revenue expected from a customer during their relationship.
                      </InfoTooltip>
                    </div>
                    <DataSourceBadge source={metrics.dataSources.ltv} size="xs" />
                  </div>
                  <div className="text-2xl font-bold text-gradient-gold">{metrics.unitEconomics.ltv}</div>
                  <p className="text-xs mt-0.5 text-muted-foreground">{metrics.unitEconomics.ltvMonths} months</p>
                </CardContent>
              </Card>
              
              {/* LTV/CAC Ratio - Calculated */}
              <Card className="bg-card/50 border-border/30 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-lg bg-muted/30">
                        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">LTV/CAC Ratio</span>
                      <InfoTooltip side="top" size="sm">
                        Your projected LTV/CAC ratio based on calculated LTV ÷ CAC. Values above 3x indicate healthy unit economics for sustainable growth.
                      </InfoTooltip>
                    </div>
                    <DataSourceBadge source={metrics.dataSources.ltvCacCalculated} size="xs" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-gradient-gold">
                      {metrics.unitEconomics.ltvCacCalculated}x
                    </span>
                    {metrics.ltvCacCalculated && metrics.ltvCacCalculated >= 3 && (
                      <CheckCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs mt-0.5 text-muted-foreground">calculated</p>
                </CardContent>
              </Card>
              
              {/* LTV/CAC Target */}
              <Card className="bg-card/50 border-border/30 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-lg bg-muted/30">
                        <Target className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">LTV/CAC Target</span>
                      <InfoTooltip side="top" size="sm">
                        Industry benchmark target for your market segment. This is the recommended minimum ratio for sustainable growth, not your calculated value.
                      </InfoTooltip>
                    </div>
                    <DataSourceBadge source={metrics.dataSources.ltvCacRatio} size="xs" />
                  </div>
                  <div className="text-2xl font-bold text-gradient-gold">{metrics.unitEconomics.ltvCacRatio}x</div>
                  <p className="text-xs mt-0.5 text-muted-foreground">benchmark</p>
                </CardContent>
              </Card>
            </div>
            
            {/* How it works */}
            {metrics.unitEconomics.howItWorks && metrics.idealTicket && (
              <Card className="glass-card border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 flex-shrink-0">
                      <Zap className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">How it works: </span>
                      {metrics.unitEconomics.howItWorks}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 rounded-lg bg-card/50 border border-border/30">
            <AlertCircle className="h-4 w-4" />
            <span>Unit economics will be calculated from growth and marketing data</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default FinancialReturnSection;
