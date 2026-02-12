import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Target,
  Crosshair,
  TrendingUp,
  DollarSign,
  Scale,
  Clock,
  CheckCircle2,
  Wallet,
  BadgePercent,
  BarChart3,
} from "lucide-react";
import { OpportunitySection, GrowthIntelligenceSection } from "@/types/report";
import { FinancialMetrics } from "@/hooks/useFinancialMetrics";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ExecutiveSnapshotCardProps {
  opportunity: OpportunitySection | null | undefined;
  growth: GrowthIntelligenceSection | null | undefined;
  investment: Record<string, unknown> | null | undefined;
  financialMetrics: FinancialMetrics;
  viabilityScore: number;
  viabilityLabel: string;
}

const getViabilityStyle = (score: number) => {
  if (score >= 80) return {
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
  };
  if (score >= 60) return {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  };
  return {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
  };
};

const formatCurrency = (value: number | null | undefined): string => {
  if (!value) return "...";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const formatPercentage = (value: string | number | null | undefined): string => {
  if (!value) return "...";
  if (typeof value === "number") {
    const percentage = value < 1 ? value * 100 : value;
    return `${percentage.toFixed(1)}%`;
  }
  return value.replace(/\s*CAGR\s*/i, '');
};

const METRIC_TOOLTIPS: Record<string, { term: string; description: string }> = {
  TAM: { term: "TAM", description: "Total Addressable Market — the entire revenue opportunity available if you captured 100% of the market." },
  SAM: { term: "SAM", description: "Serviceable Addressable Market — the portion of TAM your product can realistically serve based on your features and positioning." },
  SOM: { term: "SOM", description: "Serviceable Obtainable Market — the realistic share you can capture in Year 1 given competition and resources." },
  CAGR: { term: "CAGR", description: "Compound Annual Growth Rate — how fast this market is growing year over year." },
  "Y1 ARR": { term: "Year 1 ARR", description: "Annual Recurring Revenue projected for the first year based on pricing, churn, and growth assumptions." },
  "LTV/CAC": { term: "LTV/CAC Ratio", description: "Customer Lifetime Value divided by Customer Acquisition Cost. A ratio above 3x is considered healthy." },
  Payback: { term: "Payback Period", description: "Number of months to recover the cost of acquiring a customer. Under 12 months is ideal for SaaS." },
  "Break-even": { term: "Break-even", description: "Number of months until total revenue exceeds total costs and the business becomes profitable." },
  Investment: { term: "Total Investment", description: "The upfront cost to build and launch your MVP with UaiCode." },
  Savings: { term: "Savings vs Traditional", description: "How much you save compared to hiring a traditional development agency." },
  "ROI Y1": { term: "ROI Year 1", description: "Return on Investment in the first year. Negative ROI in Year 1 is normal (investment phase)." },
  "ROI Y2": { term: "ROI Year 2", description: "Return on Investment in the second year, when most SaaS products reach profitability." },
};

const ExecutiveSnapshotCard: React.FC<ExecutiveSnapshotCardProps> = ({
  opportunity,
  growth,
  investment,
  financialMetrics,
  viabilityScore,
  viabilityLabel,
}) => {
  const viabilityStyle = getViabilityStyle(viabilityScore || 0);

  const financialData = growth?.financial_metrics;
  const investmentCents = investment?.investment_one_payment_cents as number | undefined;
  const savingsPercent = investment?.savings_percentage as number | undefined;

  const metrics = [
    { label: "TAM", value: opportunity?.tam_value || "...", icon: Globe },
    { label: "SAM", value: opportunity?.sam_value || "...", icon: Target },
    { label: "SOM", value: opportunity?.som_value || "...", icon: Crosshair },
    { label: "CAGR", value: formatPercentage(opportunity?.market_growth_rate_numeric || opportunity?.market_growth_rate), icon: TrendingUp },
    { label: "Y1 ARR", value: financialData?.arr_year_1_formatted || formatCurrency(financialData?.arr_year_1), icon: DollarSign },
    { label: "LTV/CAC", value: financialMetrics.ltvCacCalculated ? `${financialMetrics.ltvCacCalculated.toFixed(1)}x` : financialMetrics.ltvCacRatio || "...", icon: Scale },
    { label: "Payback", value: financialMetrics.paybackPeriod ? `${financialMetrics.paybackPeriod} mo` : "...", icon: Clock },
    { label: "Break-even", value: financialData?.break_even_months ? `${financialData.break_even_months} mo` : financialMetrics.breakEvenMonths || "...", icon: CheckCircle2 },
    { label: "Investment", value: investmentCents ? formatCurrency(investmentCents / 100) : "...", icon: Wallet },
    { label: "Savings", value: savingsPercent ? `${savingsPercent}%` : "...", icon: BadgePercent },
    { label: "ROI Y1", value: financialData?.roi_year_1_formatted || financialMetrics.roiYear1 || "...", icon: TrendingUp },
    { label: "ROI Y2", value: financialData?.roi_year_2_formatted || "...", icon: TrendingUp },
  ];

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Executive Snapshot</CardTitle>
            <InfoTooltip term="Executive Snapshot">
              A quick overview of the 12 most important metrics for decision makers — covering market size, financials, and investment.
            </InfoTooltip>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`inline-flex items-center gap-1.5 px-3 py-1 ${viabilityStyle.bg} ${viabilityStyle.border} border`}
            >
              <TrendingUp className={`h-4 w-4 ${viabilityStyle.text}`} />
              <span className={`font-semibold ${viabilityStyle.text}`}>
                {viabilityLabel}: {viabilityScore}/100
              </span>
            </Badge>
            <InfoTooltip term="Viability Score">
              An AI-calculated score (0–100) based on market size, competition, financial projections, and execution feasibility. Above 70 is considered strong.
            </InfoTooltip>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Key metrics at a glance — 30-second overview for decision makers
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {metrics.map((metric, index) => {
            const tooltipData = METRIC_TOOLTIPS[metric.label];
            return (
              <div
                key={index}
                className="p-3 rounded-lg bg-muted/10 border border-border/20 text-center hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <metric.icon className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  {tooltipData && (
                    <InfoTooltip term={tooltipData.term} size="sm">
                      {tooltipData.description}
                    </InfoTooltip>
                  )}
                </div>
                <div className="text-lg font-bold text-foreground">{metric.value}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSnapshotCard;
