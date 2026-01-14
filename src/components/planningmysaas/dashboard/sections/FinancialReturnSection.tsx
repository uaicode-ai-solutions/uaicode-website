import { TrendingUp, Clock, DollarSign, Target, BarChart3, Shield, Rocket, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { UnitEconomics, FinancialScenario, ProjectionDataPoint } from "@/types/report";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const FinancialReturnSection = () => {
  const { report } = useReportContext();
  
  // Use real data only - no mock fallbacks for validation
  const breakEvenMonths = report?.break_even_months || "-";
  const roiYear1 = report?.expected_roi_year1 || "-";
  const mrrMonth12 = report?.mrr_month12_cents || "-";
  const arrProjected = report?.arr_projected_cents || "-";
  const ltvCacRatio = report?.ltv_cac_ratio || "-";
  
  // Parse JSONB fields - undefined/empty arrays if not available
  const unitEconomics = report?.unit_economics as unknown as UnitEconomics | undefined;
  const financialScenarios: FinancialScenario[] = (report?.financial_scenarios as unknown as FinancialScenario[]) || [];
  const projectionData: ProjectionDataPoint[] = (report?.projection_data as unknown as ProjectionDataPoint[]) || [];

  const formatCurrency = (value: number | string) => {
    // If already formatted string, return it
    if (typeof value === 'string' && (value.includes('$') || value.includes('K') || value.includes('M'))) {
      return value;
    }
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    if (isNaN(numValue)) return String(value);
    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(1)}M`;
    }
    if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(0)}K`;
    }
    return `$${numValue}`;
  };

  const scenarioIcons: Record<string, React.ElementType> = {
    Conservative: Shield,
    Realistic: Target,
    Optimistic: Rocket,
  };

  // Parse numeric values from TEXT fields
  const parseNumericBreakEven = () => {
    const match = breakEvenMonths.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const parseNumericROI = () => {
    const match = roiYear1.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const metrics = [
    {
      icon: Clock,
      label: "Break-even",
      value: breakEvenMonths.includes('month') ? breakEvenMonths : `${breakEvenMonths} months`,
      sublabel: "Until investment payoff",
      highlight: true,
      tooltip: "The month when your cumulative revenue exceeds your total investment and operational costs."
    },
    {
      icon: TrendingUp,
      label: "Year 1 ROI",
      value: roiYear1.includes('%') ? roiYear1 : `${roiYear1}%`,
      sublabel: "Return on investment",
      highlight: false,
      tooltip: "Return on Investment - The projected percentage gain on your investment in the first year."
    },
    {
      icon: DollarSign,
      label: "Month 12 MRR",
      value: formatCurrency(mrrMonth12),
      sublabel: "Monthly recurring revenue",
      highlight: false,
      tooltip: "Monthly Recurring Revenue - The predictable monthly revenue from subscriptions at month 12."
    },
    {
      icon: Target,
      label: "Projected ARR",
      value: formatCurrency(arrProjected),
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
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Return</h2>
            <InfoTooltip side="right" size="sm">
              Financial projections including ROI, break-even analysis, and unit economics for your SaaS business model.
            </InfoTooltip>
          </div>
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
          {projectionData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
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
                    x={`M${parseNumericBreakEven()}`}
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
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm">Projection Scenarios</h3>
          <InfoTooltip side="right" size="sm">
            Three scenarios based on different market conditions and execution quality.
          </InfoTooltip>
        </div>

        {/* ROI Estimate & 3-Year MRR Evolution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ROI Estimate Donut Chart */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h4 className="font-medium text-sm text-foreground">ROI Estimate</h4>
              </div>
              
              {/* Donut Chart */}
              <div className="relative h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "ROI", value: Math.min(parseNumericROI(), 250) },
                        { name: "Remaining", value: Math.max(0, 250 - parseNumericROI()) }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="hsl(var(--accent))" />
                      <Cell fill="hsl(var(--muted))" opacity={0.2} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-accent">{roiYear1.includes('%') ? roiYear1 : `${roiYear1}%`}</span>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
              </div>
              
              {/* Description */}
              <div className="text-center mt-4">
                <p className="text-sm text-foreground">
                  <span className="font-medium">$1 invested</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-bold text-accent">${(1 + parseNumericROI() / 100).toFixed(2)} return</span>
                </p>
                <p className="text-xs text-muted-foreground">12 months</p>
              </div>
              
              {/* Industry comparison */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Industry Avg: 80-120%</span>
                  <Badge className="bg-accent/10 text-accent border-accent/30 text-[10px]">
                    {parseNumericROI() > 120 ? 'Above Average' : parseNumericROI() >= 80 ? 'Average' : 'Below Average'}
                  </Badge>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full" 
                    style={{ width: `${Math.min(100, parseNumericROI() / 2)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3-Year MRR Evolution */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-foreground">3-Year MRR Evolution</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Monthly Recurring Revenue growth over 36 months</p>
              
              {/* Year milestones cards - use real Year 1 data, placeholders for Year 2/3 */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { year: "Year 1", arr: formatCurrency(arrProjected), mrr: formatCurrency(mrrMonth12) + " MRR" },
                  { year: "Year 2", arr: "-", mrr: "- MRR" },
                  { year: "Year 3", arr: "-", mrr: "- MRR" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-muted/20 rounded-lg p-2.5 text-center border border-border/20">
                    <p className="text-[10px] text-muted-foreground">{item.year}</p>
                    <p className="text-base font-bold text-accent">{item.arr}</p>
                    <p className="text-[10px] text-muted-foreground">ARR</p>
                    <p className="text-[9px] text-accent/80">{item.mrr}</p>
                  </div>
                ))}
              </div>
              
              {/* Note about future projections */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground text-center">
                  Year 2 and 3 projections will be calculated based on growth assumptions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Scenario Cards */}
        {financialScenarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {financialScenarios.map((scenario, index) => {
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
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 rounded-lg bg-card/50 border border-border/30">
            <AlertCircle className="h-4 w-4" />
            <span>No financial scenarios available</span>
          </div>
        )}
      </div>

      {/* Unit Economics */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-sm">Unit Economics</h3>
          <InfoTooltip side="right" size="sm">
            Key metrics showing your customer acquisition efficiency and lifetime value analysis.
          </InfoTooltip>
        </div>
        {unitEconomics ? (
          <>
            {/* 4 Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Ideal Ticket */}
              <Card className="bg-card/50 border-border/30">
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground">Ideal Ticket</span>
                  <div className="text-xl font-bold text-foreground mt-1">${unitEconomics.idealTicket || "-"}</div>
                  <span className="text-xs text-muted-foreground">/month</span>
                </CardContent>
              </Card>
              
              {/* Payback Period */}
              <Card className="bg-card/50 border-border/30">
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground">Payback Period</span>
                  <div className="text-xl font-bold text-foreground mt-1">{unitEconomics.paybackPeriod || "-"}</div>
                  <span className="text-xs text-muted-foreground">months</span>
                </CardContent>
              </Card>
              
              {/* LTV */}
              <Card className="bg-card/50 border-border/30">
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground">LTV (Lifetime Value)</span>
                  <div className="text-xl font-bold text-foreground mt-1">${unitEconomics.ltv || "-"}</div>
                  <span className="text-xs text-muted-foreground">{unitEconomics.ltvMonths || "-"} months</span>
                </CardContent>
              </Card>
              
              {/* LTV/CAC Ratio */}
              <Card className="bg-card/50 border-border/30">
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground">LTV/CAC Ratio</span>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="text-xl font-bold text-foreground">{ltvCacRatio}x</span>
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-xs text-muted-foreground">healthy (&gt;3x)</span>
                </CardContent>
              </Card>
            </div>
            
            {/* How it works */}
            {unitEconomics.howItWorks && (
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">How it works: </span>
                    {unitEconomics.howItWorks}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 rounded-lg bg-card/50 border border-border/30">
            <AlertCircle className="h-4 w-4" />
            <span>No unit economics data available</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default FinancialReturnSection;
