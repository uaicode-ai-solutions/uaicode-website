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
    // Se o valor for decimal (< 1), multiplica por 100 para converter para porcentagem
    // Ex: 0.177 → 17.7%
    const percentage = value < 1 ? value * 100 : value;
    return `${percentage.toFixed(1)}%`;
  }
  // Remove sufixos como " CAGR" do string para manter consistência visual
  return value.replace(/\s*CAGR\s*/i, '');
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

  // Extract data from sources
  const financialData = growth?.financial_metrics;
  const investmentCents = investment?.investment_one_payment_cents as number | undefined;
  const savingsPercent = investment?.savings_percentage as number | undefined;

  const metrics = [
    // Row 1: Market
    {
      label: "TAM",
      value: opportunity?.tam_value || "...",
      icon: Globe,
      tooltip: "Total Addressable Market",
    },
    {
      label: "SAM",
      value: opportunity?.sam_value || "...",
      icon: Target,
      tooltip: "Serviceable Addressable Market",
    },
    {
      label: "SOM",
      value: opportunity?.som_value || "...",
      icon: Crosshair,
      tooltip: "Serviceable Obtainable Market (Year 1)",
    },
    {
      label: "CAGR",
      value: formatPercentage(opportunity?.market_growth_rate_numeric || opportunity?.market_growth_rate),
      icon: TrendingUp,
      tooltip: "Market Growth Rate",
    },
    // Row 2: Financial
    {
      label: "Y1 ARR",
      value: financialData?.arr_year_1_formatted || formatCurrency(financialData?.arr_year_1),
      icon: DollarSign,
      tooltip: "Annual Recurring Revenue (Year 1)",
    },
    {
      label: "LTV/CAC",
      value: financialMetrics.ltvCacCalculated
        ? `${financialMetrics.ltvCacCalculated.toFixed(1)}x`
        : financialMetrics.ltvCacRatio || "...",
      icon: Scale,
      tooltip: "Customer Lifetime Value / Acquisition Cost",
    },
    {
      label: "Payback",
      value: financialMetrics.paybackPeriod
        ? `${financialMetrics.paybackPeriod} mo`
        : "...",
      icon: Clock,
      tooltip: "Months to recover CAC",
    },
    {
      label: "Break-even",
      value: financialData?.break_even_months
        ? `${financialData.break_even_months} mo`
        : financialMetrics.breakEvenMonths || "...",
      icon: CheckCircle2,
      tooltip: "Months to profitability",
    },
    // Row 3: Investment
    {
      label: "Investment",
      value: investmentCents ? formatCurrency(investmentCents / 100) : "...",
      icon: Wallet,
      tooltip: "Total MVP investment",
    },
    {
      label: "Savings",
      value: savingsPercent ? `${savingsPercent}%` : "...",
      icon: BadgePercent,
      tooltip: "Savings vs traditional development",
    },
    {
      label: "ROI Y1",
      value: financialData?.roi_year_1_formatted || financialMetrics.roiYear1 || "...",
      icon: TrendingUp,
      tooltip: "Return on Investment (Year 1)",
    },
    {
      label: "ROI Y2",
      value: financialData?.roi_year_2_formatted || "...",
      icon: TrendingUp,
      tooltip: "Return on Investment (Year 2)",
    },
  ];

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Executive Snapshot</CardTitle>
          </div>
          {/* Viability Badge */}
          <Badge
            className={`inline-flex items-center gap-1.5 px-3 py-1 ${viabilityStyle.bg} ${viabilityStyle.border} border`}
          >
            <TrendingUp className={`h-4 w-4 ${viabilityStyle.text}`} />
            <span className={`font-semibold ${viabilityStyle.text}`}>
              {viabilityLabel}: {viabilityScore}/100
            </span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Key metrics at a glance — 30-second overview for decision makers
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/10 border border-border/20 text-center hover:bg-muted/20 transition-colors"
              title={metric.tooltip}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <metric.icon className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <div className="text-lg font-bold text-foreground">{metric.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSnapshotCard;
