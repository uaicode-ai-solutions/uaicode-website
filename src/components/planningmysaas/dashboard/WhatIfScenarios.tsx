// ============================================
// What-If Scenarios - Interactive Simulator
// Sliders for ARPU, Churn, CAC with real-time results
// Visual style matches FinancialReturnSection
// ============================================

import { useState, useMemo } from "react";
import { 
  DollarSign, 
  Users, 
  Target,
  Zap,
  Clock,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/financialParsingUtils";

interface WhatIfScenariosProps {
  currentArpu: number;
  currentChurn: number;
  currentCac: number;
  currentLtv: number;
  currentLtvCac: number;
  currentPayback: number;
  marketType?: string; // Added for market-specific caps
}

const WhatIfScenarios = ({
  currentArpu,
  currentChurn,
  currentCac,
  currentLtv,
  currentLtvCac,
  currentPayback,
  marketType = 'b2b',
}: WhatIfScenariosProps) => {
  // Slider states - initialized to current values
  const [arpu, setArpu] = useState(currentArpu);
  const [churn, setChurn] = useState(currentChurn);
  const [cac, setCac] = useState(currentCac);

  // Calculate metrics based on slider values
  const simulatedMetrics = useMemo(() => {
    // LTV = ARPU * (1 / monthly_churn_rate)
    // If churn is 5%, lifetime is 1/0.05 = 20 months
    const lifetimeMonths = churn > 0 ? Math.round(1 / (churn / 100)) : 120;
    const ltv = arpu * lifetimeMonths;
    const ltvCac = cac > 0 ? ltv / cac : 0;
    const payback = arpu > 0 ? Math.round(cac / arpu) : 0;
    
    return {
      ltv,
      ltvCac,
      payback,
      lifetimeMonths,
    };
  }, [arpu, churn, cac]);

  // Determine status based on metrics with market-type awareness
  const getStatus = () => {
    const { ltvCac, payback } = simulatedMetrics;
    
    // Market-specific healthy thresholds
    const isB2C = marketType?.toLowerCase().includes('b2c') || marketType?.toLowerCase().includes('consumer');
    const healthyLtvCac = isB2C ? 4.0 : 3.0; // B2C can have higher due to lower CAC
    const excellentLtvCac = isB2C ? 5.0 : 4.0;
    const healthyPayback = isB2C ? 6 : 12; // B2C needs faster payback
    const excellentPayback = isB2C ? 4 : 8;
    
    if (ltvCac >= excellentLtvCac && payback <= excellentPayback) {
      return { label: "Excellent", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🚀" };
    }
    if (ltvCac >= healthyLtvCac && payback <= healthyPayback) {
      return { label: "Healthy", color: "text-accent", bgColor: "bg-accent/10", borderColor: "border-accent/30", icon: "✓" };
    }
    return { label: "Monitor", color: "text-amber-500", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "⚠" };
  };

  const status = getStatus();

  // Calculate improvement tips with market-type awareness
  const getImprovementTip = () => {
    const { ltvCac, payback } = simulatedMetrics;
    const isB2C = marketType?.toLowerCase().includes('b2c') || marketType?.toLowerCase().includes('consumer');
    const healthyLtvCac = isB2C ? 4.0 : 3.0;
    const healthyPayback = isB2C ? 6 : 12;
    
    if (ltvCac < healthyLtvCac && payback > healthyPayback) {
      return "Reduce churn or increase ARPU to reach healthy unit economics.";
    }
    if (ltvCac < healthyLtvCac) {
      const neededArpuIncrease = Math.ceil((healthyLtvCac * cac - simulatedMetrics.ltv) / simulatedMetrics.lifetimeMonths);
      return `Increase ARPU by $${neededArpuIncrease} to achieve ${healthyLtvCac}x LTV/CAC.`;
    }
    if (payback > healthyPayback) {
      const neededCacReduction = Math.round((1 - (arpu * healthyPayback) / cac) * 100);
      return `Reduce CAC by ${neededCacReduction}% for ${healthyPayback}-month payback.`;
    }
    return "Your simulated metrics are investor-ready!";
  };

  // Slider configs
  const sliders = [
    {
      label: "ARPU/month",
      value: arpu,
      min: 10,
      max: Math.max(100, currentArpu * 2),
      step: 5,
      onChange: setArpu,
      format: (v: number) => formatCurrency(v),
      icon: DollarSign,
      tooltip: "Average Revenue Per User - monthly subscription price.",
    },
    {
      label: "Monthly Churn %",
      value: churn,
      min: 1,
      max: 15,
      step: 0.5,
      onChange: setChurn,
      format: (v: number) => `${v.toFixed(1)}%`,
      icon: Users,
      tooltip: "Percentage of customers who cancel each month.",
    },
    {
      label: "CAC (Customer Acquisition Cost)",
      value: cac,
      min: 25,
      max: Math.max(300, currentCac * 1.5),
      step: 25,
      onChange: setCac,
      format: (v: number) => formatCurrency(v),
      icon: Target,
      tooltip: "Cost to acquire one new customer.",
    },
  ];

  // Result metrics display
  const resultMetrics = [
    {
      label: "LTV",
      value: formatCurrency(simulatedMetrics.ltv),
      icon: TrendingUp,
      tooltip: "Customer Lifetime Value based on your inputs.",
    },
    {
      label: "LTV/CAC",
      value: `${simulatedMetrics.ltvCac.toFixed(1)}x`,
      icon: Zap,
      highlight: simulatedMetrics.ltvCac >= 3,
      tooltip: "Lifetime Value to CAC ratio. 3x+ is considered healthy.",
    },
    {
      label: "Payback",
      value: `${simulatedMetrics.payback}mo`,
      icon: Clock,
      highlight: simulatedMetrics.payback <= 12,
      tooltip: "Months to recover customer acquisition cost.",
    },
  ];

  return (
    <div className="p-6 bg-card/50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Adjust Variables</span>
          </div>
          
          {sliders.map((slider) => (
            <div key={slider.label} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <slider.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{slider.label}</span>
                  <InfoTooltip side="top" size="sm">{slider.tooltip}</InfoTooltip>
                </div>
                <span className="font-bold text-accent">{slider.format(slider.value)}</span>
              </div>
              <Slider
                value={[slider.value]}
                onValueChange={(v) => slider.onChange(v[0])}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{slider.format(slider.min)}</span>
                <span>{slider.format(slider.max)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-foreground">Simulated Results</span>
            <InfoTooltip size="sm">
              These metrics are recalculated in real-time as you adjust the sliders.
            </InfoTooltip>
          </div>
          
          {/* Result Cards */}
          <div className="grid grid-cols-3 gap-3">
            {resultMetrics.map((metric) => (
              <Card 
                key={metric.label}
                className={`${
                  metric.highlight 
                    ? 'bg-accent/10 border-accent/30' 
                    : 'bg-card/80 border-border/30'
                } transition-colors`}
              >
                <CardContent className="p-3 text-center">
                  <metric.icon className={`h-4 w-4 mx-auto mb-1 ${metric.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                  <div className={`text-lg font-bold ${metric.highlight ? 'text-gradient-gold' : 'text-foreground'}`}>
                    {metric.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                    {metric.label}
                    <InfoTooltip side="top" size="sm">{metric.tooltip}</InfoTooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status Badge */}
          <div className={`p-4 rounded-lg ${status.bgColor} border ${status.borderColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Unit Economics Status</span>
              <Badge className={`${status.bgColor} ${status.borderColor} ${status.color}`}>
                {status.icon} {status.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {getImprovementTip()}
            </p>
          </div>

          {/* Comparison with current */}
          <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
            <div className="text-[10px] text-muted-foreground mb-2">vs. Current Metrics</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">LTV/CAC: </span>
                <span className={simulatedMetrics.ltvCac > currentLtvCac ? 'text-green-400' : 'text-amber-500'}>
                  {simulatedMetrics.ltvCac > currentLtvCac ? '+' : ''}
                  {((simulatedMetrics.ltvCac - currentLtvCac) / currentLtvCac * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">LTV: </span>
                <span className={simulatedMetrics.ltv > currentLtv ? 'text-green-400' : 'text-amber-500'}>
                  {simulatedMetrics.ltv > currentLtv ? '+' : ''}
                  {((simulatedMetrics.ltv - currentLtv) / currentLtv * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Payback: </span>
                <span className={simulatedMetrics.payback < currentPayback ? 'text-green-400' : 'text-amber-500'}>
                  {simulatedMetrics.payback < currentPayback ? '' : '+'}
                  {simulatedMetrics.payback - currentPayback}mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfScenarios;
