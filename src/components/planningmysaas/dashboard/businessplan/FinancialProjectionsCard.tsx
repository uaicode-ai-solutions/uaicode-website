import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, Target, Scale } from "lucide-react";
import { GrowthIntelligenceSection } from "@/types/report";
import { FinancialMetrics } from "@/hooks/useFinancialMetrics";
import { JCurveChart } from "../JCurveChart";

interface FinancialProjectionsCardProps {
  growth: GrowthIntelligenceSection | null | undefined;
  investment: Record<string, unknown> | null | undefined;
  financialMetrics: FinancialMetrics;
  insight?: string;
}

const formatCurrency = (value: number | null | undefined): string => {
  if (!value) return "...";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const FinancialProjectionsCard: React.FC<FinancialProjectionsCardProps> = ({
  growth,
  investment,
  financialMetrics,
  insight,
}) => {
  const financialData = growth?.financial_metrics;
  const investmentCents = investment?.investment_one_payment_cents as number | undefined;
  const mvpInvestment = investmentCents ? investmentCents / 100 : null;

  // Build scenarios for J-Curve - NORMALIZE "Base" to "Realistic"
  const dbScenarios = financialMetrics.financialScenarios || [];
  const conservativeDb = dbScenarios.find(s => s.name === 'Conservative');
  const baseDb = dbScenarios.find(s => s.name === 'Base');
  const optimisticDb = dbScenarios.find(s => s.name === 'Optimistic');

  // Build chart scenarios with normalized names
  const rawScenarios = [
    {
      name: "Conservative" as const,
      mrrMonth12: conservativeDb?.mrrMonth12 ?? null,
      breakEvenMonths: conservativeDb?.breakEven ?? null,
      probability: conservativeDb?.probability ?? "25%",
    },
    {
      name: "Realistic" as const, // UI name for "Base" from DB
      mrrMonth12: baseDb?.mrrMonth12 ?? null,
      breakEvenMonths: baseDb?.breakEven ?? null,
      probability: baseDb?.probability ?? "50%",
    },
    {
      name: "Optimistic" as const,
      mrrMonth12: optimisticDb?.mrrMonth12 ?? null,
      breakEvenMonths: optimisticDb?.breakEven ?? null,
      probability: optimisticDb?.probability ?? "25%",
    },
  ];

  // Filter out scenarios with null values and build final array
  const scenarios = rawScenarios
    .filter(s => s.mrrMonth12 !== null && s.breakEvenMonths !== null)
    .length === 3
    ? rawScenarios.map(s => ({
        name: s.name,
        mrrMonth12: s.mrrMonth12!,
        breakEvenMonths: s.breakEvenMonths!,
        probability: s.probability,
      }))
    : null;

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Financial Projections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
            <DollarSign className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Year 1 ARR</p>
            <p className="text-xl font-bold text-foreground">
              {financialData?.arr_year_1_formatted || formatCurrency(financialData?.arr_year_1)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20 text-center">
            <Target className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Year 2 ARR</p>
            <p className="text-xl font-bold text-foreground">
              {financialData?.arr_year_2_formatted || formatCurrency(financialData?.arr_year_2)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20 text-center">
            <Clock className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Break-even</p>
            <p className="text-xl font-bold text-foreground">
              {financialData?.break_even_months
                ? `${financialData.break_even_months} mo`
                : financialMetrics.breakEvenMonths || "..."}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20 text-center">
            <Scale className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">LTV/CAC</p>
            <p className="text-xl font-bold text-foreground">
              {financialMetrics.ltvCacCalculated
                ? `${financialMetrics.ltvCacCalculated.toFixed(1)}x`
                : financialMetrics.ltvCacRatio || "..."}
            </p>
          </div>
        </div>

        {/* J-Curve Chart */}
        {mvpInvestment && scenarios && scenarios.length === 3 && (
          <JCurveChart
            mvpInvestment={mvpInvestment}
            breakEvenMonths={financialData?.break_even_months || financialMetrics.breakEvenMonthsNum}
            mrrMonth12={financialData?.mrr_month_12 || financialMetrics.mrrMonth12Num}
            marketingBudget={financialMetrics.marketingBudgetMonthly}
            projectionMonths={60}
            scenarios={scenarios}
          />
        )}

        {/* ROI Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
            <p className="text-xs text-muted-foreground mb-1">ROI Year 1</p>
            <p className={`text-2xl font-bold ${
              (financialData?.roi_year_1 || 0) >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {financialData?.roi_year_1_formatted || financialMetrics.roiYear1 || "..."}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
            <p className="text-xs text-muted-foreground mb-1">ROI Year 2</p>
            <p className={`text-2xl font-bold ${
              (financialData?.roi_year_2 || 0) >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {financialData?.roi_year_2_formatted || "..."}
            </p>
          </div>
        </div>

        {/* AI Insight */}
        {insight && (
          <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
            <p className="text-sm text-foreground italic">"{insight}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialProjectionsCard;
