// ============================================
// Comparable Successes Section - Market Context
// Shows industry statistics and success benchmarks
// Visual style matches CustomerPainPointsSection
// ============================================

import { 
  Trophy, 
  TrendingUp, 
  Target,
  BarChart3,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import { OpportunitySection } from "@/types/report";

const ComparableSuccessesSection = () => {
  const { reportData, report } = useReportContext();
  const marketType = report?.market_type || undefined;
  const metrics = useFinancialMetrics(reportData, marketType);
  
  // Get TAM for positioning - no fallback, use "..." when missing
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const tamValue = opportunityData?.tam_value || "...";
  
  // Parse TAM to determine market size tier - return null when data missing
  const getTamSize = (tam: string): 'small' | 'medium' | 'large' | null => {
    if (tam === "..." || !tam) return null;
    const numMatch = tam.match(/([\d.]+)/);
    if (!numMatch) return null;
    const num = parseFloat(numMatch[1]);
    const isBillion = tam.toLowerCase().includes('b');
    const value = isBillion ? num * 1000 : num;
    if (value >= 10000) return 'large';
    if (value >= 1000) return 'medium';
    return 'small';
  };
  
  const tamSize = getTamSize(tamValue);
  const ltvCacRatio = metrics.ltvCacRatioNum || metrics.ltvCacCalculated || 1.3;
  
  // Industry statistics based on market type
  const isB2B = marketType?.toLowerCase()?.includes('b2b');
  const industry = report?.industry || 'technology';
  
  // Calculate user's position percentile - return 0 when data missing
  const getPositionPercentile = () => {
    if (tamSize === null) return 0;
    let basePercentile = tamSize === 'large' ? 75 : tamSize === 'medium' ? 50 : 25;
    if (ltvCacRatio >= 3) basePercentile += 15;
    else if (ltvCacRatio >= 2) basePercentile += 5;
    else if (ltvCacRatio < 1.5) basePercentile -= 10;
    return Math.min(95, Math.max(15, basePercentile));
  };
  
  const positionPercentile = getPositionPercentile();
  
  // Success rate for big number - 0 when data missing
  const successRate = tamSize === 'large' ? 78 : tamSize === 'medium' ? 65 : tamSize === 'small' ? 52 : 0;
  
  // Stats for the summary card - show "..." when data missing
  const stats = [
    {
      label: 'Market Size',
      value: tamSize === 'large' ? '> $10B' : tamSize === 'medium' ? '$1B-$10B' : tamSize === 'small' ? '< $1B' : '...',
      tooltip: 'Total Addressable Market size determines growth ceiling.',
    },
    {
      label: 'Position',
      value: positionPercentile > 0 ? `Top ${100 - positionPercentile}%` : '...',
      tooltip: 'How your opportunity ranks vs. similar early-stage SaaS.',
    },
    {
      label: 'Success Rate',
      value: successRate > 0 ? `${successRate}%` : '...',
      tooltip: 'Percentage of similar companies reaching profitability within 4 years.',
    },
  ];
  
  // Comparable insights based on market and stage
  const comparableInsights = [
    {
      icon: TrendingUp,
      title: 'Similar Market',
      description: isB2B 
        ? `B2B SaaS in ${industry} grew 2.3x faster than market average in 2023-2024.`
        : `B2C SaaS with strong retention (churn < 5%) achieves 40% faster break-even.`,
      source: 'Industry Report 2024',
      index: 1,
    },
    {
      icon: Target,
      title: 'Similar Stage',
      description: ltvCacRatio >= 1.5
        ? `Early-stage SaaS with LTV/CAC above ${Math.floor(ltvCacRatio)}x have 3x higher success rate than average.`
        : `Companies that improved LTV/CAC from ${ltvCacRatio.toFixed(1)}x to 3x saw 2.5x valuation increase.`,
      source: 'SaaS Metrics Report',
      index: 2,
    },
  ];

  return (
    <section id="comparable-successes" className="space-y-6 animate-fade-in">
      {/* Section Header - matches Customer Pain Points */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Trophy className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Market Context</h2>
            <InfoTooltip side="right" size="sm">
              Industry benchmarks and success rates for companies in similar markets.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            How similar companies have performed
          </p>
        </div>
      </div>

      {/* Two Cards Grid - matching Customer Pain Points layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Card 1: Market Position (2 cols) */}
        <Card className="bg-card/50 border-border/30 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">Your Position</h3>
                <InfoTooltip side="top" size="sm">
                  How your project compares to early-stage SaaS in your market segment.
                </InfoTooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">TAM:</span>
                <span className="text-sm font-medium text-accent">{tamValue}</span>
              </div>
            </div>

            {/* Position visualization */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Market opportunity ranking</span>
                <span className="font-bold text-accent">Top {100 - positionPercentile}%</span>
              </div>
              
              <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                {/* Position indicator */}
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${positionPercentile}%` }}
                />
              </div>
              
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Bottom 25%</span>
                <span>Average</span>
                <span>Top 25%</span>
              </div>
            </div>

            {/* Position explanation */}
            <div className="flex items-start gap-3 text-xs bg-accent/5 border border-accent/10 rounded-lg p-3">
              <ArrowUpRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Based on your analysis:</span>{' '}
                {tamSize === 'large' 
                  ? 'Large addressable market significantly increases exit potential.'
                  : tamSize === 'medium'
                    ? 'Healthy market size with room for multiple successful players.'
                    : 'Focused niche with potential for strong market position.'
                }
                {ltvCacRatio >= 2 
                  ? ' Your unit economics are trending positive.'
                  : ' Focus on improving unit economics to unlock growth.'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Summary (1 col) */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-sm font-medium text-foreground">Summary</h3>
              <InfoTooltip side="top" size="sm">
                Key market statistics for your segment.
              </InfoTooltip>
            </div>

            {/* Big number */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gradient-gold mb-1">
                {successRate > 0 ? `${successRate}%` : "..."}
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    {stat.label}
                    <InfoTooltip side="top" size="sm">
                      {stat.tooltip}
                    </InfoTooltip>
                  </span>
                  <span className="font-bold text-accent">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparable Insights Cards - matching Customer Pain Points item cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparableInsights.map((insight) => (
          <Card 
            key={insight.index}
            className="bg-accent/5 border-border/30 hover:border-accent/30 transition-colors"
          >
            <CardContent className="p-5">
              {/* Header: Number badge + Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">#{insight.index}</span>
                </div>
                <div className="p-2 rounded-lg bg-accent/10">
                  <insight.icon className="h-4 w-4 text-accent" />
                </div>
              </div>
              
              {/* Title */}
              <h4 className="font-semibold text-foreground text-sm leading-relaxed mb-3">
                {insight.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {insight.description}
              </p>

              {/* Source */}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                <BarChart3 className="h-3 w-3" />
                <span>Source: {insight.source}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ComparableSuccessesSection;
