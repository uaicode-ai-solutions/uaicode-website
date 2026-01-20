import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Shield, Target, Rocket } from 'lucide-react';
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
} from 'recharts';

interface ScenarioData {
  name: 'Conservative' | 'Realistic' | 'Optimistic';
  mrrMonth12: number;
  breakEvenMonths: number;
  probability: string;
}

interface JCurveChartProps {
  mvpInvestment: number | null;
  breakEvenMonths?: number | null;
  mrrMonth12?: number | null;
  marketingBudget: number | null;
  projectionMonths?: number;
  scenarios?: ScenarioData[];
}

interface MultiScenarioDataPoint {
  month: string;
  monthNum: number;
  conservative: number;
  realistic: number;
  optimistic: number;
}

const SCENARIO_COLORS = {
  Conservative: { stroke: '#94A3B8', fill: 'rgba(148, 163, 184, 0.15)' },
  Realistic: { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.25)' },
  Optimistic: { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.15)' },
};

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const calculateCumulativeFlow = (
  mvpInvestment: number,
  mrrMonth12: number,
  marketingBudget: number,
  month: number
): number => {
  let cumulativeCashFlow = -mvpInvestment;

  for (let m = 1; m <= month; m++) {
    const revenueGrowthFactor = m <= 12
      ? Math.pow(m / 12, 1.5)
      : 1 + ((m - 12) * 0.025);

    const monthlyRevenue = mrrMonth12 * revenueGrowthFactor;
    const monthlyCosts = marketingBudget * (1 + (m * 0.005));

    cumulativeCashFlow += (monthlyRevenue - monthlyCosts);
  }

  return Math.round(cumulativeCashFlow);
};

const generateMultiScenarioData = (
  mvpInvestment: number,
  scenarios: ScenarioData[],
  marketingBudget: number,
  projectionMonths: number
): MultiScenarioDataPoint[] => {
  const data: MultiScenarioDataPoint[] = [];

  const conservativeScenario = scenarios.find(s => s.name === 'Conservative');
  const realisticScenario = scenarios.find(s => s.name === 'Realistic');
  const optimisticScenario = scenarios.find(s => s.name === 'Optimistic');

  if (!conservativeScenario || !realisticScenario || !optimisticScenario) {
    return [];
  }

  // Month 0 - Initial investment
  data.push({
    month: 'M0',
    monthNum: 0,
    conservative: -mvpInvestment,
    realistic: -mvpInvestment,
    optimistic: -mvpInvestment,
  });

  for (let month = 1; month <= projectionMonths; month++) {
    data.push({
      month: `M${month}`,
      monthNum: month,
      conservative: calculateCumulativeFlow(
        mvpInvestment,
        conservativeScenario.mrrMonth12,
        marketingBudget,
        month
      ),
      realistic: calculateCumulativeFlow(
        mvpInvestment,
        realisticScenario.mrrMonth12,
        marketingBudget,
        month
      ),
      optimistic: calculateCumulativeFlow(
        mvpInvestment,
        optimisticScenario.mrrMonth12,
        marketingBudget,
        month
      ),
    });
  }

  return data;
};

const MultiScenarioTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
    const maxValue = sortedPayload[0]?.value || 0;
    const minValue = sortedPayload[sortedPayload.length - 1]?.value || 0;

    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>

        {sortedPayload.map((entry: any, idx: number) => {
          const isNegative = entry.value < 0;
          const colorClass = entry.name === 'optimistic'
            ? 'text-green-400'
            : entry.name === 'realistic'
              ? 'text-amber-400'
              : 'text-slate-400';

          return (
            <div key={idx} className="flex items-center justify-between gap-4 text-sm py-0.5">
              <span className={`capitalize ${colorClass}`}>
                {entry.name}:
              </span>
              <span className={`font-medium ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          );
        })}

        <div className="mt-2 pt-2 border-t border-border/30 text-xs text-muted-foreground">
          Range: {formatCurrency(minValue)} to {formatCurrency(maxValue)}
        </div>
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
  scenarios,
}) => {
  const hasScenarios = scenarios && scenarios.length === 3;

  const hasValidData = mvpInvestment && mvpInvestment > 0 &&
    (hasScenarios || (breakEvenMonths && breakEvenMonths > 0 && mrrMonth12 && mrrMonth12 > 0));

  const multiScenarioData = useMemo(() => {
    if (!hasValidData || !hasScenarios || !mvpInvestment) return [];

    return generateMultiScenarioData(
      mvpInvestment,
      scenarios!,
      marketingBudget || (scenarios![1].mrrMonth12 * 0.3),
      projectionMonths
    );
  }, [mvpInvestment, scenarios, marketingBudget, projectionMonths, hasValidData, hasScenarios]);

  // Get scenario details
  const conservativeScenario = scenarios?.find(s => s.name === 'Conservative');
  const realisticScenario = scenarios?.find(s => s.name === 'Realistic');
  const optimisticScenario = scenarios?.find(s => s.name === 'Optimistic');

  // Calculate Y axis domain
  const allValues = multiScenarioData.flatMap(d => [d.conservative, d.realistic, d.optimistic]);
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues, 0);
  const yAxisPadding = Math.abs(maxValue - minValue) * 0.1;

  // Get end values for footer
  const endData = multiScenarioData[multiScenarioData.length - 1];

  if (!hasValidData) {
    return (
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5 h-[380px] flex items-center justify-center">
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
              The J-Curve shows 3 investment scenarios overlaid. Conservative assumes 60% of target MRR,
              Realistic assumes 80%, and Optimistic assumes 100%. Each line shows cumulative cash flow
              from initial investment through profitability.
            </InfoTooltip>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-slate-400" />
            <div className="w-4 h-0.5 bg-slate-400 rounded" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">Conservative ({conservativeScenario?.probability || '25%'})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="h-3 w-3 text-amber-500" />
            <div className="w-4 h-0.5 bg-amber-500 rounded" />
            <span className="text-foreground font-medium">Realistic ({realisticScenario?.probability || '50%'})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Rocket className="h-3 w-3 text-green-500" />
            <div className="w-4 h-0.5 bg-green-500 rounded" />
            <span className="text-muted-foreground">Optimistic ({optimisticScenario?.probability || '25%'})</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={multiScenarioData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="conservativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="realisticGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                interval={11}
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

              {/* Break-even markers for each scenario */}
              {conservativeScenario && (
                <ReferenceLine
                  x={`M${conservativeScenario.breakEvenMonths}`}
                  stroke="#94A3B8"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
              )}
              {realisticScenario && (
                <ReferenceLine
                  x={`M${realisticScenario.breakEvenMonths}`}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}
              {optimisticScenario && (
                <ReferenceLine
                  x={`M${optimisticScenario.breakEvenMonths}`}
                  stroke="#10B981"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
              )}

              <Tooltip content={<MultiScenarioTooltip />} />

              {/* Order matters: bottom to top */}
              <Area
                type="monotone"
                dataKey="conservative"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                fill="url(#conservativeGradient)"
                dot={false}
              />

              <Area
                type="monotone"
                dataKey="realistic"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fill="url(#realisticGradient)"
                dot={false}
              />

              <Area
                type="monotone"
                dataKey="optimistic"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#optimisticGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer with 3 scenario results */}
        <div className="pt-4 border-t border-border/30">
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Conservative */}
            <div className="p-2.5 rounded-lg bg-slate-500/10 border border-slate-500/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="h-3 w-3 text-slate-400" />
                <p className="text-[10px] text-muted-foreground">Conservative</p>
              </div>
              <p className="text-sm font-semibold text-slate-400">
                {endData ? formatCurrency(endData.conservative) : '-'}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Break-even M{conservativeScenario?.breakEvenMonths || '-'}
              </p>
            </div>

            {/* Realistic - Highlighted */}
            <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-3 w-3 text-amber-400" />
                <p className="text-[10px] text-amber-400">Realistic</p>
              </div>
              <p className="text-sm font-bold text-gradient-gold">
                {endData ? formatCurrency(endData.realistic) : '-'}
              </p>
              <p className="text-[9px] text-amber-400 mt-0.5">
                Break-even M{realisticScenario?.breakEvenMonths || '-'}
              </p>
            </div>

            {/* Optimistic */}
            <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Rocket className="h-3 w-3 text-green-400" />
                <p className="text-[10px] text-muted-foreground">Optimistic</p>
              </div>
              <p className="text-sm font-semibold text-green-400">
                {endData ? formatCurrency(endData.optimistic) : '-'}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Break-even M{optimisticScenario?.breakEvenMonths || '-'}
              </p>
            </div>
          </div>

          {/* Initial investment note */}
          <p className="text-[10px] text-muted-foreground text-center mt-3">
            Initial Investment: <span className="text-foreground font-medium">{formatCurrency(mvpInvestment!)}</span>
            <span className="mx-2">•</span>
            5-Year Projection
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JCurveChart;
