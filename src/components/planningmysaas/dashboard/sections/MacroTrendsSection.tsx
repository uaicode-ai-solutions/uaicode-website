import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

// Get opacity based on strength value (higher = more opaque)
const getBarOpacity = (value: number): number => {
  return 0.4 + (value / 100) * 0.6; // Range: 0.4 to 1.0
};

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data.positive || data.negative;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
        <p className="font-medium text-foreground text-sm mb-1">{data.trend}</p>
        <p className="text-accent font-bold">{value}/100 Strength</p>
      </div>
    );
  }
  return null;
};

// Remove citation markers like [1], [2] from text
const cleanCitations = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Macro trend type from API (enhanced with numeric fields from n8n)
interface MacroTrend {
  trend: string;
  impact: string;
  strength: string;
  strength_numeric?: number;  // Pre-parsed 0-100 scale from n8n
  evidence?: string;
}

// Get strength value - prefer pre-parsed numeric value from n8n workflow
const getStrengthValue = (trend: MacroTrend): number => {
  // Priority 1: Use pre-parsed numeric value (already 0-100 scale)
  if (typeof trend.strength_numeric === 'number' && Number.isFinite(trend.strength_numeric)) {
    return trend.strength_numeric;
  }
  // Priority 2: Fallback to parsing string
  const lower = trend.strength?.toLowerCase() || "";
  if (lower.includes("strong") || lower.includes("high")) return 90;
  if (lower.includes("medium") || lower.includes("moderate")) return 60;
  if (lower.includes("weak") || lower.includes("low")) return 30;
  // Return 0 when no valid data (chart shows zero, display shows "...")
  return 0;
};

const MacroTrendsSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  
  // Direct value extraction - no smart fallback
  const trendsArray = opportunityData?.macro_trends || [];

  // Count favorable (strong trends) vs challenging (medium/weak trends)
  // Favorable: strong impact strength (>=90)
  // Challenging: medium or weak strength (<90) - represents trends requiring more effort
  const positiveTrends = trendsArray.filter(
    t => getStrengthValue(t) >= 90
  ).length;
  const negativeTrends = trendsArray.filter(
    t => getStrengthValue(t) < 90 && getStrengthValue(t) > 0
  ).length;

  // Check if we have valid strength data (at least one trend with strength > 0)
  const hasValidStrengthData = trendsArray.some(t => getStrengthValue(t) > 0);

  // Create chart data - NO padding points to avoid artificial decay
  const chartData = trendsArray.map((trend, index) => {
    const strengthValue = getStrengthValue(trend);
    return {
      name: `T${index + 1}`,
      positive: trend.impact?.toLowerCase().includes("positive") ? strengthValue : 0,
      negative: trend.impact?.toLowerCase().includes("negative") ? strengthValue : 0,
      trend: trend.trend,
    };
  });

  // Return null if no data
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
              <div className="flex items-center gap-2 mb-5">
                <h3 className="text-sm font-medium text-foreground">Overview</h3>
                <InfoTooltip side="top" size="sm">
                  Summary of macro trends affecting your market opportunity.
                </InfoTooltip>
              </div>

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
                <span className="font-bold text-accent">
                  {hasValidStrengthData ? positiveTrends : "..."}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Challenging
                  <InfoTooltip side="top" size="sm">
                    Trends that may pose challenges or require strategic adaptation.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-foreground">
                  {hasValidStrengthData ? negativeTrends : "..."}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Market Favorability
                  <InfoTooltip side="top" size="sm">
                    Percentage of trends that are favorable for your business opportunity.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-accent">
                  {hasValidStrengthData && trendsArray.length > 0 
                    ? `${Math.round((positiveTrends / trendsArray.length) * 100)}%` 
                    : "..."}
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
                Comparative strength of each identified market trend.
              </InfoTooltip>
            </div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    {/* Premium gradient matching Pain Intensity style */}
                    <linearGradient id="trendBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="50%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    {/* Glow filter for premium effect */}
                    <filter id="trendBarGlow" x="-20%" y="-50%" width="140%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    {/* Gradient for negative bars */}
                    <linearGradient id="trendBarNegative" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tickCount={6}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: "hsl(var(--accent) / 0.05)" }} 
                  />
                  <Bar
                    dataKey="positive"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    filter="url(#trendBarGlow)"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-pos-${index}`}
                        fill="url(#trendBarGradient)"
                        fillOpacity={getBarOpacity(entry.positive)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="negative"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-neg-${index}`}
                        fill="url(#trendBarNegative)"
                        fillOpacity={getBarOpacity(entry.negative)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {trendsArray.map((trend, index) => {
          const isPositive = trend.impact?.toLowerCase().includes("positive");
          const strengthValue = getStrengthValue(trend);

          return (
            <Card key={index} className={`border-border/30 hover:border-accent/30 transition-colors ${
              isPositive ? "bg-accent/5" : "bg-card/50"
            }`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  {/* Numbered Badge - matches chart labels */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isPositive ? "bg-accent/10" : "bg-muted/20"
                  }`}>
                    <span className={`text-sm font-bold ${
                      isPositive ? "text-accent" : "text-muted-foreground"
                    }`}>
                      T{index + 1}
                    </span>
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
