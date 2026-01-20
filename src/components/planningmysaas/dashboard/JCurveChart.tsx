import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';

interface JCurveChartProps {
  mvpInvestment: number | null;
  breakEvenMonths: number | null;
  mrrMonth12: number | null;
  marketingBudget: number | null;
  projectionMonths?: number;
}

interface JCurveDataPoint {
  month: string;
  monthNum: number;
  cumulativeCashFlow: number;
  isBreakEven: boolean;
}

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const generateJCurveData = (
  mvpInvestment: number,
  breakEvenMonths: number,
  mrrMonth12: number,
  marketingBudget: number,
  projectionMonths: number
): JCurveDataPoint[] => {
  const data: JCurveDataPoint[] = [];
  let cumulativeCashFlow = -mvpInvestment;

  // Add initial point (Month 0 - investment)
  data.push({
    month: 'M0',
    monthNum: 0,
    cumulativeCashFlow: Math.round(cumulativeCashFlow),
    isBreakEven: false,
  });

  for (let month = 1; month <= projectionMonths; month++) {
    // Revenue grows gradually - S-curve style growth
    // Slow start, accelerating growth, then stabilizing
    const growthPhase = month / breakEvenMonths;
    const revenueGrowthFactor = month <= 12
      ? Math.pow(month / 12, 1.5) // Slow initial growth
      : 1 + ((month - 12) * 0.025); // 2.5% monthly growth after Y1

    const monthlyRevenue = mrrMonth12 * revenueGrowthFactor;
    
    // Costs grow slowly over time
    const monthlyCosts = marketingBudget * (1 + (month * 0.005));

    cumulativeCashFlow += (monthlyRevenue - monthlyCosts);

    data.push({
      month: `M${month}`,
      monthNum: month,
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
      isBreakEven: month === breakEvenMonths,
    });
  }

  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isNegative = value < 0;
    
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={`text-sm font-semibold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
          {formatCurrency(value)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isNegative ? 'Investment Phase' : 'Growth Phase'}
        </p>
      </div>
    );
  }
  return null;
};

export const JCurveChart: React.FC<JCurveChartProps> = ({
  mvpInvestment,
  breakEvenMonths,
  mrrMonth12,
  marketingBudget,
  projectionMonths = 60,
}) => {
  // Validate required data
  const hasValidData = mvpInvestment && mvpInvestment > 0 && 
                       breakEvenMonths && breakEvenMonths > 0 && 
                       mrrMonth12 && mrrMonth12 > 0;

  const jCurveData = useMemo(() => {
    if (!hasValidData) return [];
    
    return generateJCurveData(
      mvpInvestment!,
      breakEvenMonths!,
      mrrMonth12!,
      marketingBudget || mrrMonth12! * 0.3, // Fallback: 30% of MRR for marketing
      projectionMonths
    );
  }, [mvpInvestment, breakEvenMonths, mrrMonth12, marketingBudget, projectionMonths, hasValidData]);

  // Find break-even data point for the reference dot
  const breakEvenPoint = jCurveData.find(d => d.isBreakEven);
  
  // Calculate gradient stop position based on break-even
  const breakEvenPercent = hasValidData 
    ? Math.min(95, Math.max(5, (breakEvenMonths! / projectionMonths) * 100))
    : 50;

  // Calculate min/max for Y axis domain
  const minValue = Math.min(...jCurveData.map(d => d.cumulativeCashFlow), 0);
  const maxValue = Math.max(...jCurveData.map(d => d.cumulativeCashFlow), 0);
  const yAxisPadding = Math.abs(maxValue - minValue) * 0.1;

  if (!hasValidData) {
    return (
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5 h-[320px] flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              J-Curve will be generated once investment data is available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/30 hover:border-accent/30 transition-all duration-300">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h4 className="font-medium text-sm text-foreground">
              Investment Trajectory (J-Curve)
            </h4>
            <InfoTooltip>
              The classic J-Curve shows how SaaS investments typically have 
              negative returns initially before turning profitable. The break-even 
              point marks when cumulative revenue exceeds total investment.
            </InfoTooltip>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-muted-foreground">Investment Phase</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-muted-foreground">Growth Phase</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={jCurveData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Horizontal gradient from red to green based on break-even position */}
                <linearGradient id="jCurveGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.6} />
                  <stop offset={`${breakEvenPercent * 0.8}%`} stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset={`${breakEvenPercent}%`} stopColor="#F59E0B" stopOpacity={0.5} />
                  <stop offset={`${breakEvenPercent * 1.2}%`} stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.6} />
                </linearGradient>
                
                {/* Stroke gradient */}
                <linearGradient id="jCurveStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset={`${breakEvenPercent}%`} stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
                vertical={false}
              />
              
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                interval={11} // Show every 12 months
              />
              
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[minValue - yAxisPadding, maxValue + yAxisPadding]}
                width={50}
              />

              {/* Break-even line (Y=0) */}
              <ReferenceLine 
                y={0} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />

              {/* Break-even vertical line */}
              <ReferenceLine
                x={`M${breakEvenMonths}`}
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="cumulativeCashFlow"
                stroke="url(#jCurveStroke)"
                strokeWidth={2.5}
                fill="url(#jCurveGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: '#F59E0B',
                  strokeWidth: 2,
                  fill: 'hsl(var(--background))',
                }}
              />

              {/* Break-even point marker */}
              {breakEvenPoint && (
                <ReferenceDot
                  x={breakEvenPoint.month}
                  y={breakEvenPoint.cumulativeCashFlow}
                  r={6}
                  fill="#F59E0B"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Break-even label */}
        <div className="flex justify-center -mt-2 mb-3">
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-amber-400">
              Break-even: Month {breakEvenMonths}
            </span>
          </div>
        </div>

        {/* Insights footer */}
        <div className="pt-3 border-t border-border/30 flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Initial Investment</p>
            <p className="text-sm font-semibold text-red-400">
              {formatCurrency(-mvpInvestment!)}
            </p>
          </div>
          
          <div className="h-8 w-px bg-border/30" />
          
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Time to Profit</p>
            <p className="text-sm font-semibold text-amber-400">
              {breakEvenMonths} months
            </p>
          </div>
          
          <div className="h-8 w-px bg-border/30" />
          
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">5-Year Position</p>
            <p className="text-sm font-semibold text-green-400">
              {jCurveData.length > 0 ? formatCurrency(jCurveData[jCurveData.length - 1].cumulativeCashFlow) : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JCurveChart;
