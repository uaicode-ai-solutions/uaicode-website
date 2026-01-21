// ============================================
// Growth Potential Section - Investor-Focused
// Shows current vs target metrics + quick wins
// Visual style matches FinancialReturnSection
// ============================================

import { useState } from "react";
import { 
  Target, 
  TrendingUp, 
  ArrowRight, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  DollarSign,
  Users,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Button } from "@/components/ui/button";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import { formatCurrency } from "@/lib/financialParsingUtils";
import WhatIfScenarios from "@/components/planningmysaas/dashboard/WhatIfScenarios";

interface MetricProgress {
  label: string;
  current: number | string;
  target: number | string;
  progress: number; // 0-100
  unit?: string;
  isInverted?: boolean; // For metrics where lower is better (churn, payback)
  tooltip: string;
  icon: React.ElementType;
}

const GrowthPotentialSection = () => {
  const { reportData, report } = useReportContext();
  const [showWhatIf, setShowWhatIf] = useState(false);
  
  // Get market type and financial metrics
  const marketType = report?.market_type || undefined;
  const metrics = useFinancialMetrics(reportData, marketType);
  
  // Extract current values
  const currentLtvCac = metrics.ltvCacRatioNum || metrics.ltvCacCalculated || 1.3;
  const currentChurn = metrics.unitEconomics?.monthlyChurn 
    ? parseFloat(String(metrics.unitEconomics.monthlyChurn)) 
    : 5;
  const currentPayback = metrics.paybackPeriod || 15;
  const currentArpu = metrics.idealTicket || 25;
  const currentCac = metrics.targetCac?.avg || 150;
  
  // Target values based on market type benchmarks
  const isB2B = marketType?.toLowerCase()?.includes('b2b');
  const targetLtvCac = 3.0;
  const targetChurn = isB2B ? 2.0 : 4.0;
  const targetPayback = isB2B ? 12 : 8;
  
  // Calculate progress percentages
  const ltvCacProgress = Math.min(100, (currentLtvCac / targetLtvCac) * 100);
  const churnProgress = Math.min(100, (targetChurn / currentChurn) * 100);
  const paybackProgress = Math.min(100, (targetPayback / currentPayback) * 100);
  
  // Metrics data
  const metricsData: MetricProgress[] = [
    {
      label: "LTV/CAC Ratio",
      current: `${currentLtvCac.toFixed(1)}x`,
      target: `${targetLtvCac.toFixed(1)}x`,
      progress: ltvCacProgress,
      tooltip: "Lifetime Value to Customer Acquisition Cost. Target 3x+ for sustainable growth.",
      icon: TrendingUp,
    },
    {
      label: "Monthly Churn",
      current: `${currentChurn.toFixed(1)}%`,
      target: `${targetChurn.toFixed(1)}%`,
      progress: churnProgress,
      isInverted: true,
      tooltip: "Percentage of customers lost monthly. Lower is better for long-term growth.",
      icon: Users,
    },
    {
      label: "Payback Period",
      current: `${Math.round(currentPayback)}mo`,
      target: `${targetPayback}mo`,
      progress: paybackProgress,
      isInverted: true,
      tooltip: "Months to recover customer acquisition cost. Shorter payback means faster reinvestment.",
      icon: BarChart3,
    },
  ];
  
  // Quick wins calculations - based on real impact formulas
  const quickWins = [
    {
      icon: Users,
      action: "Reduce churn by 2%",
      result: `LTV increases by ${Math.round((1 / ((currentChurn - 2) / 100) - 1 / (currentChurn / 100)) / (1 / (currentChurn / 100)) * 100)}%`,
      impact: "high",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: DollarSign,
      action: `Increase ARPU by $${Math.round(currentArpu * 0.2)}`,
      result: `Payback drops by ${Math.round(currentPayback * 0.15)} months`,
      impact: "medium",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      icon: Zap,
      action: "Optimize CAC by 15%",
      result: `LTV/CAC reaches ${((metrics.ltv || 0) / (currentCac * 0.85)).toFixed(1)}x`,
      impact: "high",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
  ];
  
  return (
    <section id="growth-potential" className="space-y-6">
      {/* Header - matches The Return style */}
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

      {/* Educational Banner */}
      <div className="flex items-start gap-3 text-sm bg-accent/5 border border-accent/20 rounded-lg p-4">
        <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0 text-accent" />
        <div>
          <strong className="text-accent">Your path to success:</strong>{' '}
          <span className="text-muted-foreground">
            These are your current metrics compared to industry benchmarks. Small improvements in key areas
            can dramatically accelerate your path to profitability.
          </span>
        </div>
      </div>

      {/* Current vs Target Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current State Card */}
        <Card className="bg-slate-500/5 border-slate-500/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <Badge variant="outline" className="bg-slate-500/10 border-slate-500/30 text-slate-400">
                Current State
              </Badge>
              <InfoTooltip side="top" size="sm">
                Your current unit economics based on market analysis.
              </InfoTooltip>
            </div>
            
            <div className="space-y-5">
              {metricsData.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <metric.icon className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <InfoTooltip side="top" size="sm">{metric.tooltip}</InfoTooltip>
                    </div>
                    <span className="font-bold text-foreground">{metric.current}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        metric.progress >= 80 ? 'bg-green-500' :
                        metric.progress >= 50 ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target State Card */}
        <Card className="bg-accent/5 border-accent/20 ring-1 ring-accent/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <Badge className="bg-accent/20 border-accent/30 text-accent">
                Target State
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-green-500/10 border-green-500/30 text-green-400">
                ✓ Investor Ready
              </Badge>
            </div>
            
            <div className="space-y-5">
              {metricsData.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <metric.icon className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                    </div>
                    <span className="font-bold text-accent">{metric.target}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-amber-400 rounded-full"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Status indicator */}
            <div className="mt-4 pt-4 border-t border-accent/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">
                Benchmark: {isB2B ? 'B2B SaaS' : 'B2C SaaS'} industry standards
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Wins Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-foreground">Quick Wins</span>
          <InfoTooltip size="sm">
            Specific actions that can significantly improve your metrics.
          </InfoTooltip>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickWins.map((win, index) => (
            <Card 
              key={index}
              className={`${win.bgColor} ${win.borderColor} border hover:scale-[1.02] transition-all duration-300`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${win.bgColor}`}>
                    <win.icon className={`h-4 w-4 ${win.color}`} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] ${win.borderColor} ${win.color}`}
                  >
                    {win.impact} impact
                  </Badge>
                </div>
                
                <h4 className="font-semibold text-foreground text-sm mb-2">
                  {win.action}
                </h4>
                
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight className={`h-4 w-4 ${win.color}`} />
                  <span className={win.color}>{win.result}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What-If Scenarios Toggle */}
      <div className="border border-border/30 rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          onClick={() => setShowWhatIf(!showWhatIf)}
          className="w-full flex items-center justify-between p-4 h-auto hover:bg-accent/5"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <BarChart3 className="h-4 w-4 text-accent" />
            </div>
            <div className="text-left">
              <span className="font-medium text-foreground">Simulate Your Scenario</span>
              <p className="text-xs text-muted-foreground">
                Adjust ARPU, Churn, and CAC to see real-time impact on your metrics
              </p>
            </div>
          </div>
          {showWhatIf ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        
        {showWhatIf && (
          <div className="border-t border-border/30">
            <WhatIfScenarios 
              currentArpu={currentArpu}
              currentChurn={currentChurn}
              currentCac={currentCac}
              currentLtv={metrics.ltv || 0}
              currentLtvCac={currentLtvCac}
              currentPayback={currentPayback}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default GrowthPotentialSection;
