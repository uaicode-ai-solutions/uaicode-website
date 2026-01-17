import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
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

const MacroTrendsSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const macroTrends = opportunityData?.macro_trends || [];

  // Count positive vs negative trends
  const positiveTrends = macroTrends.filter(
    t => t.impact?.toLowerCase().includes("positive")
  ).length;
  const negativeTrends = macroTrends.filter(
    t => t.impact?.toLowerCase().includes("negative")
  ).length;

  // Create chart data - simulated trend visualization
  const chartData = macroTrends.map((trend, index) => ({
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

  if (macroTrends.length === 0) {
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

            <div className="space-y-4">
              {/* Total trends */}
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-accent mb-1">
                  {macroTrends.length}
                </div>
                <div className="text-sm text-muted-foreground">Trends Identified</div>
              </div>

              {/* Positive vs Negative */}
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ArrowUpRight className="h-4 w-4 text-accent" />
                    <span className="text-xl font-bold text-accent">{positiveTrends}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Favorable</div>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-bold text-muted-foreground">{negativeTrends}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Challenging</div>
                </div>
              </div>

              {/* Trend balance indicator */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Market Favorability</span>
                  <span>{macroTrends.length > 0 ? Math.round((positiveTrends / macroTrends.length) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ 
                      width: macroTrends.length > 0 
                        ? `${(positiveTrends / macroTrends.length) * 100}%` 
                        : "0%" 
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card className="bg-card/50 border-border/30 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Trend Strength</h3>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
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
                    stroke="hsl(var(--accent))"
                    fill="url(#colorPositive)"
                    strokeWidth={2}
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
        {macroTrends.map((trend, index) => {
          const isPositive = trend.impact?.toLowerCase().includes("positive");
          const strengthValue = strengthToValue(trend.strength);

          return (
            <Card key={index} className="bg-card/50 border-border/30">
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
                    <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-1">
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
                    <div className="mt-3 h-1 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isPositive ? "bg-accent" : "bg-muted-foreground"
                        }`}
                        style={{ 
                          width: `${strengthValue}%`,
                          opacity: isPositive ? 1 : 0.5
                        }}
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
