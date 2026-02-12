import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, Target, Scale } from "lucide-react";
import { GrowthIntelligenceSection } from "@/types/report";
import { FinancialMetrics } from "@/hooks/useFinancialMetrics";
import { JCurveChart } from "../JCurveChart";
import { useReportContext } from "@/contexts/ReportContext";
import { calculateSuggestedPaidMedia, calculateTotalMarketingMonthly } from "@/lib/marketingBudgetUtils";
import { InfoTooltip } from "@/components/ui/info-tooltip";

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
  const { report, marketingTotals } = useReportContext();
  
  const financialData = growth?.financial_metrics;
  const investmentCents = investment?.investment_one_payment_cents as number | undefined;
  const mvpInvestment = investmentCents ? investmentCents / 100 : null;

  // === Marketing budget logic - IDENTICAL to FinancialReturnSection ===
  const MINIMUM_MARKETING_BASELINE = 6000;
  const baselineMarketingBudget = MINIMUM_MARKETING_BASELINE;
  
  const userBudget = report?.budget;
  const suggestedPaidMedia = calculateSuggestedPaidMedia(userBudget, marketingTotals.uaicodeTotal);
  const totalMarketingMonthly = calculateTotalMarketingMonthly(
    marketingTotals.uaicodeTotal, 
    suggestedPaidMedia
  );
  
  const effectiveMarketingBudget = marketingTotals.uaicodeTotal > 0 
    ? totalMarketingMonthly 
    : baselineMarketingBudget;

  const dbScenarios = financialMetrics.financialScenarios || [];
  const conservativeDb = dbScenarios.find(s => s.name === 'Conservative');
  const baseDb = dbScenarios.find(s => s.name === 'Base');
  const optimisticDb = dbScenarios.find(s => s.name === 'Optimistic');

  const rawScenarios = [
    {
      name: "Conservative" as const,
      mrrMonth12: conservativeDb?.mrrMonth12 ?? null,
      breakEvenMonths: conservativeDb?.breakEven ?? null,
      probability: conservativeDb?.probability ?? "25%",
    },
    {
      name: "Realistic" as const,
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
          <InfoTooltip term="Financial Projections">
            Revenue forecasts, break-even timeline, and ROI estimates based on your pricing, market size, and growth assumptions.
          </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
            <DollarSign className="h-5 w-5 text-accent mx-auto mb-1" />
            <div className="flex items-center justify-center gap-1">
              <p className="text-xs text-muted-foreground">Year 1 ARR</p>
              <InfoTooltip term="Year 1 ARR" size="sm">
                Projected Annual Recurring Revenue at the end of your first year based on subscriber growth and pricing.
              </InfoTooltip>
            </div>
            <p className="text-xl font-bold text-foreground">
              {financialData?.arr_year_1_formatted || formatCurrency(financialData?.arr_year_1)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20 text-center">
            <Target className="h-5 w-5 text-accent mx-auto mb-1" />
            <div className="flex items-center justify-center gap-1">
              <p className="text-xs text-muted-foreground">Year 2 ARR</p>
              <InfoTooltip term="Year 2 ARR" size="sm">
                Projected revenue in Year 2, factoring in compounding growth, reduced churn, and expanded customer base.
              </InfoTooltip>
            </div>
            <p className="text-xl font-bold text-foreground">
              {financialData?.arr_year_2_formatted || formatCurrency(financialData?.arr_year_2)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20 text-center">
            <Clock className="h-5 w-5 text-accent mx-auto mb-1" />
            <div className="flex items-center justify-center gap-1">
              <p className="text-xs text-muted-foreground">Break-even</p>
              <InfoTooltip term="Break-even" size="sm">
                The month when cumulative revenue surpasses cumulative costs — the point where your business becomes profitable.
              </InfoTooltip>
            </div>
            <p className="text-xl font-bold text-foreground">
              {financialData?.break_even_months
                ? `${financialData.break_even_months} mo`
                : financialMetrics.breakEvenMonths || "..."}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20 text-center">
            <Scale className="h-5 w-5 text-accent mx-auto mb-1" />
            <div className="flex items-center justify-center gap-1">
              <p className="text-xs text-muted-foreground">LTV/CAC</p>
              <InfoTooltip term="LTV/CAC" size="sm">
                Customer Lifetime Value divided by Acquisition Cost. Above 3x means each customer generates 3× more than it costs to acquire them.
              </InfoTooltip>
            </div>
            <p className="text-xl font-bold text-foreground">
              {financialMetrics.ltvCacCalculated
                ? `${financialMetrics.ltvCacCalculated.toFixed(1)}x`
                : financialMetrics.ltvCacRatio || "..."}
            </p>
          </div>
        </div>

        {mvpInvestment && scenarios && scenarios.length === 3 && (
          <JCurveChart
            mvpInvestment={mvpInvestment}
            breakEvenMonths={financialData?.break_even_months || financialMetrics.breakEvenMonthsNum}
            mrrMonth12={financialData?.mrr_month_12 || financialMetrics.mrrMonth12Num}
            marketingBudget={effectiveMarketingBudget}
            baselineMarketingBudget={baselineMarketingBudget}
            projectionMonths={60}
            scenarios={scenarios}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-muted-foreground">ROI Year 1</p>
              <InfoTooltip term="ROI Year 1" size="sm">
                Return on Investment in Year 1. A negative value is normal — it means you're still in the investment phase (J-Curve).
              </InfoTooltip>
            </div>
            <p className={`text-2xl font-bold ${
              (financialData?.roi_year_1 || 0) >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {financialData?.roi_year_1_formatted || financialMetrics.roiYear1 || "..."}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-muted-foreground">ROI Year 2</p>
              <InfoTooltip term="ROI Year 2" size="sm">
                Return on Investment by Year 2, when most SaaS businesses start seeing positive returns on their initial investment.
              </InfoTooltip>
            </div>
            <p className={`text-2xl font-bold ${
              (financialData?.roi_year_2 || 0) >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {financialData?.roi_year_2_formatted || "..."}
            </p>
          </div>
        </div>

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
