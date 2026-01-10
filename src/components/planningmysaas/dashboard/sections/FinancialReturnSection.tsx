import { TrendingUp, Clock, DollarSign, Target, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const metrics = [
    {
      icon: Clock,
      label: "Break-even",
      value: `${financials.breakEvenMonths} months`,
      sublabel: "Until investment payoff",
      highlight: true,
    },
    {
      icon: TrendingUp,
      label: "Year 1 ROI",
      value: `${financials.roiYear1}%`,
      sublabel: "Return on investment",
      highlight: false,
    },
    {
      icon: DollarSign,
      label: "Month 12 MRR",
      value: formatCurrency(financials.mrrMonth12),
      sublabel: "Monthly recurring revenue",
      highlight: false,
    },
    {
      icon: Target,
      label: "Projected ARR",
      value: formatCurrency(financials.arrProjected),
      sublabel: "Annual recurring revenue",
      highlight: false,
    },
  ];

  return (
    <section id="financial-return" className="space-y-8">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card 
            key={index}
            className={`bg-card/50 border-border/30 ${metric.highlight ? 'ring-1 ring-accent/30' : ''}`}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${metric.highlight ? 'bg-accent/20' : 'bg-muted/30'}`}>
                  <metric.icon className={`h-4 w-4 ${metric.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                </div>
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <div className={`text-2xl font-bold ${metric.highlight ? 'text-accent' : 'text-foreground'}`}>
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.sublabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue vs Costs Chart */}
        <Card className="lg:col-span-2 bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6">Revenue vs Costs (12 months)</h3>
            <div className="h-72">
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
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
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
                    label={{ value: 'Break-even', fill: 'hsl(var(--accent))', fontSize: 11 }}
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

        {/* Scenarios */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6">Projection Scenarios</h3>
            <div className="space-y-4">
              {financials.scenarios.map((scenario, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    scenario.name === 'Realistic' 
                      ? 'bg-accent/10 border-accent/30' 
                      : 'bg-muted/20 border-border/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-medium ${
                      scenario.name === 'Realistic' ? 'text-accent' : 'text-foreground'
                    }`}>
                      {scenario.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {scenario.probability} prob.
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
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
                </div>
              ))}
            </div>

            {/* Additional Metrics */}
            <div className="mt-6 pt-6 border-t border-border/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">LTV/CAC Ratio</span>
                <span className="font-medium text-green-400">{financials.ltvCacRatio}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Churn</span>
                <span className="font-medium text-foreground">{financials.monthlyChurn}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FinancialReturnSection;
