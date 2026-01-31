// ============================================
// Growth Potential Section - Investor-Focused
// Shows current vs target metrics + quick wins
// Visual style matches CustomerPainPointsSection
// ============================================

import { 
  Target, 
  TrendingUp, 
  Lightbulb,
  Zap,
  DollarSign,
  Users,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import WhatIfScenarios from "@/components/planningmysaas/dashboard/WhatIfScenarios";

interface MetricProgress {
  label: string;
  current: number | string;
  target: number | string;
  progress: number; // 0-100
  tooltip: string;
  icon: React.ElementType;
}

const GrowthPotentialSection = () => {
  const { reportData, report } = useReportContext();
  
  // Get market type and financial metrics
  const marketType = report?.market_type || undefined;
  const metrics = useFinancialMetrics(reportData, marketType);
  
  // Extract current values - NO FALLBACKS, use null when missing
  const currentLtvCac = metrics.ltvCacCalculated ?? metrics.ltvCacRatioNum ?? null;
  const currentChurn = metrics.unitEconomics?.monthlyChurn 
    ? parseFloat(String(metrics.unitEconomics.monthlyChurn).replace('%', '')) 
    : null;
  const currentPayback = metrics.paybackPeriod ?? null;
  const currentArpu = metrics.idealTicket ?? null;
  const currentCac = metrics.targetCac?.avg ?? null;
  
  // Target values based on market type benchmarks
  const isB2B = marketType?.toLowerCase()?.includes('b2b');
  const targetLtvCac = 3.0;
  const targetChurn = isB2B ? 2.0 : 4.0;
  const targetPayback = isB2B ? 12 : 8;
  
  // Calculate progress percentages - use 0 when data missing
  const ltvCacProgress = currentLtvCac !== null ? Math.min(100, (currentLtvCac / targetLtvCac) * 100) : 0;
  const churnProgress = currentChurn !== null ? Math.min(100, (targetChurn / currentChurn) * 100) : 0;
  const paybackProgress = currentPayback !== null ? Math.min(100, (targetPayback / currentPayback) * 100) : 0;
  
  // Average progress for big number - only count metrics with data
  const validMetrics = [ltvCacProgress, churnProgress, paybackProgress].filter(p => p > 0);
  const avgProgress = validMetrics.length > 0 ? Math.round(validMetrics.reduce((a, b) => a + b, 0) / validMetrics.length) : 0;
  
  // Metrics data - show "..." when data missing
  const metricsData: MetricProgress[] = [
    {
      label: "LTV/CAC Ratio",
      current: currentLtvCac !== null ? `${currentLtvCac.toFixed(1)}x` : "...",
      target: `${targetLtvCac.toFixed(1)}x`,
      progress: ltvCacProgress,
      tooltip: "Lifetime Value to Customer Acquisition Cost. Target 3x+ for sustainable growth.",
      icon: TrendingUp,
    },
    {
      label: "Monthly Churn",
      current: currentChurn !== null ? `${currentChurn.toFixed(1)}%` : "...",
      target: `${targetChurn.toFixed(1)}%`,
      progress: churnProgress,
      tooltip: "Percentage of customers lost monthly. Lower is better for long-term growth.",
      icon: Users,
    },
    {
      label: "Payback Period",
      current: currentPayback !== null ? `${Math.round(currentPayback)}mo` : "...",
      target: `${targetPayback}mo`,
      progress: paybackProgress,
      tooltip: "Months to recover customer acquisition cost. Shorter payback means faster reinvestment.",
      icon: BarChart3,
    },
  ];
  
  // Quick wins calculations - based on real impact formulas, show "..." when data missing
  const quickWins = [
    {
      icon: Users,
      action: "Reduce churn by 2%",
      result: currentChurn !== null && currentChurn > 2
        ? `LTV increases by ${Math.round((1 / ((currentChurn - 2) / 100) - 1 / (currentChurn / 100)) / (1 / (currentChurn / 100)) * 100)}%`
        : "LTV increases by ...%",
      index: 1,
    },
    {
      icon: DollarSign,
      action: currentArpu !== null ? `Increase ARPU by $${Math.round(currentArpu * 0.2)}` : "Increase ARPU by ...",
      result: currentPayback !== null ? `Payback drops by ${Math.round(currentPayback * 0.15)} months` : "Payback drops by ... months",
      index: 2,
    },
    {
      icon: Zap,
      action: "Optimize CAC by 15%",
      result: metrics.ltv && currentCac !== null 
        ? `LTV/CAC reaches ${(metrics.ltv / (currentCac * 0.85)).toFixed(1)}x`
        : "LTV/CAC reaches ...x",
      index: 3,
    },
  ];
  
  return (
    <section id="growth-potential" className="space-y-6 animate-fade-in">
      {/* Section Header - matches Customer Pain Points */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Growth Potential</h2>
            <InfoTooltip side="right" size="sm">
              Your path from current metrics to healthy, sustainable unit economics.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            The roadmap to investor-ready metrics
          </p>
        </div>
      </div>

      {/* Two Cards Grid - matching Customer Pain Points layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Card 1: Current vs Target Metrics (2 cols) */}
        <Card className="bg-card/50 border-border/30 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">Current vs Target</h3>
                <InfoTooltip side="top" size="sm">
                  Your current metrics compared to industry benchmarks for healthy SaaS.
                </InfoTooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Benchmark:</span>
                <span className="text-sm font-medium text-accent">{isB2B ? 'B2B SaaS' : 'B2C SaaS'}</span>
              </div>
            </div>

            {/* Metrics comparison */}
            <div className="space-y-5">
              {metricsData.map((metric, index) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <metric.icon className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <InfoTooltip side="top" size="sm">{metric.tooltip}</InfoTooltip>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{metric.current}</span>
                      <span className="text-accent">→</span>
                      <span className="font-bold text-accent">{metric.target}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Educational note */}
            <div className="mt-6 flex items-start gap-3 text-xs bg-accent/5 border border-accent/10 rounded-lg p-3">
              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
              <span className="text-muted-foreground">
                Small improvements in these metrics compound over time. Reaching target metrics 
                typically increases company valuation by 2-3x.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Summary (1 col) */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-sm font-medium text-foreground">Summary</h3>
              <InfoTooltip side="top" size="sm">
                Overall progress toward investor-ready unit economics.
              </InfoTooltip>
            </div>

            {/* Big number */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gradient-gold mb-1">
                {avgProgress}%
              </div>
              <div className="text-sm text-muted-foreground">Progress to Target</div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  LTV/CAC Status
                  <InfoTooltip side="top" size="sm">
                    Healthy LTV/CAC is 3x or higher for sustainable growth.
                  </InfoTooltip>
                </span>
                <span className={`font-bold ${currentLtvCac !== null && currentLtvCac >= 3 ? 'text-accent' : 'text-foreground'}`}>
                  {currentLtvCac !== null ? (currentLtvCac >= 3 ? '✓ Healthy' : '⚠ Monitor') : '...'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Churn Status
                  <InfoTooltip side="top" size="sm">
                    Target churn rate for your market segment.
                  </InfoTooltip>
                </span>
                <span className={`font-bold ${currentChurn !== null && currentChurn <= targetChurn ? 'text-accent' : 'text-foreground'}`}>
                  {currentChurn !== null ? (currentChurn <= targetChurn ? '✓ On Track' : '⚠ Improve') : '...'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Payback Status
                  <InfoTooltip side="top" size="sm">
                    Shorter payback periods allow faster reinvestment in growth.
                  </InfoTooltip>
                </span>
                <span className={`font-bold ${currentPayback !== null && currentPayback <= targetPayback ? 'text-accent' : 'text-foreground'}`}>
                  {currentPayback !== null ? (currentPayback <= targetPayback ? '✓ Fast' : '⚠ Slow') : '...'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Wins Cards - matching Customer Pain Points item cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickWins.map((win) => (
          <Card 
            key={win.index}
            className="bg-accent/5 border-border/30 hover:border-accent/30 transition-colors"
          >
            <CardContent className="p-5">
              {/* Header: Number badge + Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">#{win.index}</span>
                </div>
                <div className="p-2 rounded-lg bg-accent/10">
                  <win.icon className="h-4 w-4 text-accent" />
                </div>
              </div>
              
              {/* Action */}
              <h4 className="font-semibold text-foreground text-sm leading-relaxed mb-3">
                {win.action}
              </h4>

              {/* Result */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {win.result}
              </p>

              {/* Progress bar placeholder */}
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: '100%', opacity: 0.6 }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What-If Scenarios - Always Visible */}
      <div className="border border-border/30 rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <BarChart3 className="h-4 w-4 text-accent" />
          </div>
          <div>
            <span className="font-medium text-foreground">Simulate Your Scenario</span>
            <p className="text-xs text-muted-foreground">
              Adjust ARPU, Churn, and CAC to see real-time impact on your metrics
            </p>
          </div>
        </div>
        
        <div className="border-t border-border/30">
          <WhatIfScenarios 
            currentArpu={currentArpu}
            currentChurn={currentChurn}
            currentCac={currentCac}
            currentLtv={metrics.ltv || 0}
            currentLtvCac={currentLtvCac}
            currentPayback={currentPayback}
            marketType={marketType}
          />
        </div>
      </div>
    </section>
  );
};

export default GrowthPotentialSection;
