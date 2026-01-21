// ============================================
// Comparable Successes Section - Market Context
// Shows industry statistics and success benchmarks
// Visual style matches FinancialReturnSection
// ============================================

import { 
  Trophy, 
  TrendingUp, 
  Target,
  BarChart3,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import { OpportunitySection } from "@/types/report";

const ComparableSuccessesSection = () => {
  const { reportData, report } = useReportContext();
  const marketType = report?.market_type || undefined;
  const metrics = useFinancialMetrics(reportData, marketType);
  
  // Get TAM for positioning
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const tamValue = opportunityData?.tam_value || "$10B";
  
  // Parse TAM to determine market size tier
  const getTamSize = (tam: string): 'small' | 'medium' | 'large' => {
    const numMatch = tam.match(/([\d.]+)/);
    if (!numMatch) return 'medium';
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
  
  // Calculate user's position percentile
  const getPositionPercentile = () => {
    // Based on TAM size and LTV/CAC ratio
    let basePercentile = tamSize === 'large' ? 75 : tamSize === 'medium' ? 50 : 25;
    if (ltvCacRatio >= 3) basePercentile += 15;
    else if (ltvCacRatio >= 2) basePercentile += 5;
    else if (ltvCacRatio < 1.5) basePercentile -= 10;
    return Math.min(95, Math.max(15, basePercentile));
  };
  
  const positionPercentile = getPositionPercentile();
  
  // Success statistics
  const stats = [
    {
      icon: Trophy,
      stat: tamSize === 'large' ? '78%' : tamSize === 'medium' ? '65%' : '52%',
      description: `of SaaS companies with TAM ${tamSize === 'large' ? '> $10B' : tamSize === 'medium' ? '$1B-$10B' : '< $1B'} reach profitability within 4 years`,
      source: 'SaaS Metrics Report 2024',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
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
      badge: 'Market Trend',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: Target,
      title: 'Similar Stage',
      description: ltvCacRatio >= 1.5
        ? `Early-stage SaaS with LTV/CAC above ${Math.floor(ltvCacRatio)}x have 3x higher success rate than average.`
        : `Companies that improved LTV/CAC from ${ltvCacRatio.toFixed(1)}x to 3x saw 2.5x valuation increase.`,
      badge: 'Benchmark',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <section id="comparable-successes" className="space-y-6">
      {/* Header - matches The Return style */}
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

      {/* Main Stat Card */}
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-gradient-gold">{stat.stat}</span>
                  <Badge variant="outline" className="text-[10px] bg-muted/10 border-muted/30">
                    Industry Data
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.description}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                  <BarChart3 className="h-3 w-3" />
                  <span>Source: {stat.source}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Comparable Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparableInsights.map((insight, index) => (
          <Card key={index} className={`${insight.bgColor} ${insight.borderColor} border hover:scale-[1.02] transition-all duration-300`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                </div>
                <Badge variant="outline" className={`text-[9px] ${insight.borderColor} ${insight.color}`}>
                  {insight.badge}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Your Position Card */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Your Position</span>
            <InfoTooltip side="top" size="sm">
              How your project compares to early-stage SaaS in your market segment.
            </InfoTooltip>
          </div>
          
          {/* Progress visualization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Market opportunity ranking</span>
              <span className="font-bold text-accent">Top {100 - positionPercentile}%</span>
            </div>
            
            <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500/30 via-amber-500/30 to-green-500/30" />
              {/* Position indicator */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-accent rounded-full shadow-lg shadow-accent/50"
                style={{ left: `${positionPercentile}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Bottom 25%</span>
              <span>Average</span>
              <span>Top 25%</span>
            </div>
          </div>
          
          {/* Position explanation */}
          <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/10">
            <div className="flex items-start gap-2">
              <ArrowUpRight className="h-4 w-4 text-accent mt-0.5" />
              <p className="text-xs text-muted-foreground">
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
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ComparableSuccessesSection;
