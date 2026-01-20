// ============================================
// Investment Highlights Component
// Displays 4 key metrics with dynamic status indicators
// ============================================

import { TrendingUp, Clock, DollarSign, Rocket, CheckCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  getLtvCacStatus,
  getPaybackStatus,
  getGrowthStatus,
  getLtvCacBenchmarkBadge,
  getPaybackBenchmarkBadge,
  generateInvestmentBullets,
  getInvestmentAssessment,
  InvestmentBullet,
} from "@/lib/financialDisplayUtils";
import { formatCurrency } from "@/lib/financialParsingUtils";

interface InvestmentHighlightsProps {
  ltvCacRatio: number | null;
  paybackMonths: number | null;
  marketSize: string | null;
  growthPercent: number | null;
  arrYear1: number | null;
  arrYear3: number | null;
  breakEvenMonths: number | null;
  roiYear1: number | null;
  marketType?: string;
}

interface HighlightCard {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  status: ReturnType<typeof getLtvCacStatus>;
  tooltip: string;
  benchmarkLabel?: string;
}

const InvestmentHighlights = ({
  ltvCacRatio,
  paybackMonths,
  marketSize,
  growthPercent,
  arrYear1,
  arrYear3,
  breakEvenMonths,
  roiYear1,
  marketType,
}: InvestmentHighlightsProps) => {
  // Get status for each metric
  const ltvCacStatus = getLtvCacStatus(ltvCacRatio, marketType);
  const paybackStatus = getPaybackStatus(paybackMonths, marketType);
  const growthStatus = getGrowthStatus(growthPercent, marketType);
  
  // Get benchmark badges
  const ltvCacBadge = getLtvCacBenchmarkBadge(ltvCacRatio, marketType);
  const paybackBadge = getPaybackBenchmarkBadge(paybackMonths, marketType);
  
  // Get investment assessment
  const assessment = getInvestmentAssessment(
    ltvCacRatio,
    paybackMonths,
    roiYear1,
    breakEvenMonths,
    marketType
  );
  
  // Generate dynamic bullet points
  const bullets = generateInvestmentBullets(
    ltvCacRatio,
    paybackMonths,
    marketSize,
    growthPercent,
    breakEvenMonths,
    marketType
  );
  
  // Build highlight cards dynamically based on available data
  const highlightCards: HighlightCard[] = [];
  
  // LTV/CAC Ratio
  if (ltvCacRatio !== null) {
    highlightCards.push({
      label: "LTV/CAC Ratio",
      value: `${ltvCacRatio.toFixed(1)}x`,
      subtitle: ltvCacBadge.label,
      icon: CheckCircle,
      status: ltvCacStatus,
      tooltip: ltvCacBadge.tooltip,
      benchmarkLabel: ltvCacRatio >= 3 ? "Healthy > 3x" : undefined,
    });
  }
  
  // Payback Period
  if (paybackMonths !== null) {
    highlightCards.push({
      label: "Payback Period",
      value: `${paybackMonths}mo`,
      subtitle: paybackBadge.label,
      icon: Rocket,
      status: paybackStatus,
      tooltip: paybackBadge.tooltip,
      benchmarkLabel: paybackMonths <= 6 ? "Fast recovery" : undefined,
    });
  }
  
  // Market Size
  if (marketSize && marketSize !== "...") {
    highlightCards.push({
      label: "Market Size",
      value: marketSize,
      subtitle: "TAM Opportunity",
      icon: TrendingUp,
      status: {
        status: 'strong',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        icon: TrendingUp,
        label: 'Large Market',
        textColor: 'text-amber-500',
      },
      tooltip: "Total Addressable Market - the total revenue opportunity available",
    });
  }
  
  // 3-Year Growth
  if (growthPercent !== null && arrYear1 !== null && arrYear3 !== null) {
    highlightCards.push({
      label: "3-Year Growth",
      value: `${growthPercent.toFixed(0)}%`,
      subtitle: `${formatCurrency(arrYear1)} → ${formatCurrency(arrYear3)}`,
      icon: DollarSign,
      status: growthStatus,
      tooltip: `Projected ARR growth from Year 1 (${formatCurrency(arrYear1)}) to Year 3 (${formatCurrency(arrYear3)})`,
    });
  } else if (growthPercent !== null) {
    highlightCards.push({
      label: "3-Year Growth",
      value: `${growthPercent.toFixed(0)}%`,
      subtitle: "ARR trajectory",
      icon: DollarSign,
      status: growthStatus,
      tooltip: `Projected ARR growth over 3 years`,
    });
  }
  
  // Don't render if no highlights available
  if (highlightCards.length === 0 && bullets.length === 0) {
    return null;
  }
  
  const getBadgeVariantClass = (status: ReturnType<typeof getLtvCacStatus>) => {
    switch (status.status) {
      case 'strong':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'moderate':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'attention':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-border/30';
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Main Investment Highlights Card */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-amber-500/30 overflow-hidden">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Why Your Investment Makes Sense</h3>
                <p className="text-xs text-muted-foreground">Key metrics for investor confidence</p>
              </div>
            </div>
            <Badge className={`${assessment.bgColor} ${assessment.color} ${assessment.borderColor} px-2 py-1`}>
              <span className="font-bold mr-1">{assessment.grade}</span>
              {assessment.label}
            </Badge>
          </div>
          
          {/* Highlight Cards Grid */}
          {highlightCards.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {highlightCards.map((card, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${card.status.borderColor} ${card.status.bgColor} transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <card.icon className={`h-3.5 w-3.5 ${card.status.color}`} />
                    <span className="text-xs text-muted-foreground">{card.label}</span>
                    <InfoTooltip side="top" size="sm">
                      {card.tooltip}
                    </InfoTooltip>
                  </div>
                  <div className={`text-xl font-bold ${card.status.textColor}`}>
                    {card.value}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[10px] ${card.status.color}`}>
                      {card.subtitle}
                    </span>
                    {card.benchmarkLabel && (
                      <Badge className="text-[9px] px-1 py-0 bg-green-500/10 text-green-500 border-green-500/30">
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Dynamic Bullet Points */}
          {bullets.length > 0 && (
            <div className="border-t border-amber-500/20 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {bullets.map((bullet: InvestmentBullet, index: number) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-2 text-sm ${bullet.highlight ? 'font-medium' : ''}`}
                  >
                    <bullet.icon className={`h-4 w-4 flex-shrink-0 ${bullet.color}`} />
                    <span className="text-foreground">{bullet.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentHighlights;
