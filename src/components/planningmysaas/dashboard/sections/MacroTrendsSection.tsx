import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import { useSmartFallbackField } from "@/hooks/useSmartFallbackField";
import { FallbackSkeleton, CardContentSkeleton } from "@/components/ui/fallback-skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Remove citation markers like [1], [2] from text
const cleanCitations = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Map strength to numeric value
const strengthToValue = (strength: string): number => {
  const lower = strength?.toLowerCase() || "";
  if (lower.includes("strong") || lower.includes("high")) return 90;
  if (lower.includes("medium") || lower.includes("moderate")) return 60;
  if (lower.includes("weak") || lower.includes("low")) return 30;
  return 50;
};

// Macro trend type from API
interface MacroTrend {
  trend: string;
  impact: string;
  strength: string;
  evidence: string;
}

const MacroTrendsSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  
  // Use smart fallback for macro trends - skip if data already exists
  const rawMacroTrends = opportunityData?.macro_trends;
  const hasValidTrends = Array.isArray(rawMacroTrends) && rawMacroTrends.length > 0;
  const { value: macroTrends, isLoading } = useSmartFallbackField<MacroTrend[]>({
    fieldPath: "opportunity_section.macro_trends",
    currentValue: rawMacroTrends,
    skipFallback: hasValidTrends, // Skip fallback if we already have data
  });

  const trendsArray = macroTrends || [];

  // Count positive vs negative trends
  const positiveTrends = trendsArray.filter(
    t => t.impact?.toLowerCase().includes("positive")
  ).length;
  const negativeTrends = trendsArray.filter(
    t => t.impact?.toLowerCase().includes("negative")
  ).length;

  // Create chart data - simulated trend visualization
  const chartData = trendsArray.map((trend, index) => ({
    name: `T${index + 1}`,
    positive: trend.impact?.toLowerCase().includes("positive") ? strengthToValue(trend.strength) : 0,
    negative: trend.impact?.toLowerCase().includes("negative") ? strengthToValue(trend.strength) : 0,
    trend: trend.trend,
  }));

  // Add some padding points for visual
  if (chartData.length > 0) {
    chartData.unshift({ name: "", positive: 0, negative: 0, trend: "" });
    chartData.push({ name: "", positive: 0, negative: 0, trend: "" });
  }

  // Show loading skeleton
  if (isLoading) {
    return (
      <section id="macro-trends" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Activity className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Macro Trends</h2>
            <p className="text-sm text-muted-foreground">Loading trends...</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <CardContentSkeleton lines={4} />
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30 lg:col-span-2">
            <CardContent className="p-6">
              <CardContentSkeleton lines={5} />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (trendsArray.length === 0) {
    return null;
  }

  return (
    <section id="macro-trends" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Activity className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Macro Trends</h2>
            <InfoTooltip side="right" size="sm">
              Industry trends shaping the market landscape and their impact on your opportunity.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Industry forces at play</p>
        </div>
      </div>

      {/* Overview Stats + Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-5">Overview</h3>

            {/* Big number */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gradient-gold mb-1">
                {trendsArray.length}
              </div>
              <div className="text-sm text-muted-foreground">Trends Identified</div>
            </div>

            {/* Stats with tooltips */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Favorable
                  <InfoTooltip side="top" size="sm">
                    Trends that create opportunities for your product in the market.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-accent">{positiveTrends}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Challenging
                  <InfoTooltip side="top" size="sm">
                    Trends that may pose challenges or require strategic adaptation.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-foreground">{negativeTrends}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Market Favorability
                  <InfoTooltip side="top" size="sm">
                    Percentage of trends that are favorable for your business opportunity.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-accent">
                  {trendsArray.length > 0 ? Math.round((positiveTrends / trendsArray.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card className="bg-card/50 border-border/30 lg:col-span-2 flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-foreground">Trend Strength</h3>
              <InfoTooltip side="top" size="sm">
                Visual representation of each trend's market impact strength over time.
              </InfoTooltip>
            </div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    {/* Amber gradient for positive area */}
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#FBBF24" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FCD34D" stopOpacity={0} />
                    </linearGradient>
                    {/* Stroke gradient for positive line */}
                    <linearGradient id="trendPositiveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="50%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#FCD34D" />
                    </linearGradient>
                    {/* Glow filter */}
                    <filter id="trendGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]?.payload?.trend) {
                        return payload[0].payload.trend;
                      }
                      return label;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stroke="url(#trendPositiveStroke)"
                    fill="url(#colorPositive)"
                    strokeWidth={2}
                    filter="url(#trendGlow)"
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stroke="hsl(var(--muted-foreground))"
                    fill="url(#colorNegative)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {trendsArray.map((trend, index) => {
          const isPositive = trend.impact?.toLowerCase().includes("positive");
          const strengthValue = strengthToValue(trend.strength);

          return (
            <Card key={index} className={`border-border/30 hover:border-accent/30 transition-colors ${
              isPositive ? "bg-accent/5" : "bg-card/50"
            }`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    isPositive ? "bg-accent/10" : "bg-muted/20"
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-accent" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm mb-2">
                      {trend.trend}
                    </h4>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className={isPositive 
                          ? "border-accent/30 text-accent bg-accent/5" 
                          : "border-border/50 text-muted-foreground bg-muted/10"
                        }
                      >
                        {trend.impact}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-border/50 text-muted-foreground"
                      >
                        {trend.strength}
                      </Badge>
                    </div>

                    {/* Evidence (truncated) */}
                    {trend.evidence && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {cleanCitations(trend.evidence)}
                      </p>
                    )}

                    {/* Strength indicator bar */}
                    <div className="mt-3 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isPositive 
                            ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300" 
                            : "bg-muted-foreground/50"
                        }`}
                        style={{ width: `${strengthValue}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default MacroTrendsSection;
