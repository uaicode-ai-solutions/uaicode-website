import { TrendingUp, Clock, DollarSign, Target, BarChart3, Shield, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";
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
  const { financials } = reportData;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const scenarioIcons: Record<string, React.ElementType> = {
    Conservative: Shield,
    Realistic: Target,
    Optimistic: Rocket,
  };

  const metrics = [
    {
      icon: Clock,
      label: "Break-even",
      value: `${financials.breakEvenMonths} months`,
      sublabel: "Until investment payoff",
      highlight: true,
      tooltip: "The month when your cumulative revenue exceeds your total investment and operational costs."
    },
    {
      icon: TrendingUp,
      label: "Year 1 ROI",
      value: `${financials.roiYear1}%`,
      sublabel: "Return on investment",
      highlight: false,
      tooltip: "Return on Investment - The projected percentage gain on your investment in the first year."
    },
    {
      icon: DollarSign,
      label: "Month 12 MRR",
      value: formatCurrency(financials.mrrMonth12),
      sublabel: "Monthly recurring revenue",
      highlight: false,
      tooltip: "Monthly Recurring Revenue - The predictable monthly revenue from subscriptions at month 12."
    },
    {
      icon: Target,
      label: "Projected ARR",
      value: formatCurrency(financials.arrProjected),
      sublabel: "Annual recurring revenue",
      highlight: false,
      tooltip: "Annual Recurring Revenue - The yearly value of your recurring subscriptions (MRR × 12)."
    },
  ];

  return (
    <section id="financial-return" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <BarChart3 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Return</h2>
          <p className="text-sm text-muted-foreground">Financial projections and scenarios</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <Card 
            key={index}
            className={`bg-card/50 border-border/30 transition-all duration-300 hover:shadow-md ${metric.highlight ? 'ring-1 ring-accent/30' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`p-1 rounded-lg ${metric.highlight ? 'bg-accent/20' : 'bg-muted/30'}`}>
                  <metric.icon className={`h-3.5 w-3.5 ${metric.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                </div>
                <span className="text-xs text-muted-foreground">{metric.label}</span>
                <InfoTooltip side="top" size="sm">
                  {metric.tooltip}
                </InfoTooltip>
              </div>
              <div className={`text-xl font-bold ${metric.highlight ? 'text-accent' : 'text-foreground'}`}>
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{metric.sublabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue vs Costs Chart - Full Width */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Revenue vs Costs (12 months)</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Costs</span>
              </div>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financials.projectionData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
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
                <ReferenceLine 
                  x="M8" 
                  stroke="hsl(var(--accent))" 
                  strokeDasharray="5 5"
                  label={{ value: 'Break-even', fill: 'hsl(var(--accent))', fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--accent))"
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
        </CardContent>
      </Card>

      {/* Projection Scenarios - Horizontal Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm">Projection Scenarios</h3>
          <InfoTooltip side="right" size="sm">
            Three scenarios based on different market conditions and execution quality.
          </InfoTooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {financials.scenarios.map((scenario, index) => {
            const ScenarioIcon = scenarioIcons[scenario.name] || Target;
            return (
              <Card 
                key={index}
                className={`transition-all duration-300 ${
                  scenario.name === 'Realistic' 
                    ? 'bg-accent/10 border-accent/30 ring-1 ring-accent/20' 
                    : 'bg-card/50 border-border/30 hover:border-border/50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ScenarioIcon className={`h-4 w-4 ${
                        scenario.name === 'Realistic' ? 'text-accent' : 'text-muted-foreground'
                      }`} />
                      <span className={`font-medium text-sm ${
                        scenario.name === 'Realistic' ? 'text-accent' : 'text-foreground'
                      }`}>
                        {scenario.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {scenario.probability}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Month 12 MRR</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(scenario.mrrMonth12)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year 1 ARR</span>
                      <span className="font-medium text-foreground">
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
      </div>

      {/* Additional Metrics */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">LTV/CAC Ratio</span>
              <InfoTooltip side="top" size="sm">
                Customer Lifetime Value ÷ Customer Acquisition Cost. Above 3x is excellent.
              </InfoTooltip>
              <span className="font-bold text-green-400 text-lg">{financials.ltvCacRatio}x</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Monthly Churn</span>
              <InfoTooltip side="top" size="sm">
                The percentage of customers who cancel each month. Lower is better.
              </InfoTooltip>
              <span className="font-medium text-foreground text-lg">{financials.monthlyChurn}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FinancialReturnSection;
