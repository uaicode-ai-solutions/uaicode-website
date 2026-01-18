import { Flame, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

// Remove citation markers like [1], [2] from text
const cleanCitations = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Parse intensity score like "9/10" to number
const parseIntensity = (score: string): number => {
  if (!score) return 0;
  const match = score.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
        <p className="font-medium text-foreground text-sm mb-1">{data.fullName}</p>
        <p className="text-accent font-bold">{data.intensity}/10 Intensity</p>
        {data.evidence && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
            {data.evidence}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomerPainPointsSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const painPoints = opportunityData?.customer_pain_points || [];

  // Transform data for chart
  const chartData = painPoints.map((point, index) => ({
    name: `#${index + 1}`,
    fullName: point.pain_point,
    intensity: parseIntensity(point.intensity_score),
    evidence: cleanCitations(point.market_evidence),
    index: index + 1,
  }));

  // Sort by intensity descending
  chartData.sort((a, b) => b.intensity - a.intensity);

  // Calculate average intensity
  const avgIntensity = chartData.length > 0
    ? Math.round(chartData.reduce((sum, p) => sum + p.intensity, 0) / chartData.length * 10) / 10
    : 0;

  // Get opacity based on intensity (higher = more opaque)
  const getBarOpacity = (intensity: number): number => {
    return 0.4 + (intensity / 10) * 0.6; // Range: 0.4 to 1.0
  };

  if (painPoints.length === 0) {
    return null;
  }

  return (
    <section id="customer-pain-points" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Flame className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Customer Pain Points</h2>
            <InfoTooltip side="right" size="sm">
              Key customer problems driving market demand, ranked by intensity.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Top problems your product can solve</p>
        </div>
      </div>

      {/* Two Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Card 1: Horizontal Bar Chart (2 cols) */}
        <Card className="bg-card/50 border-border/30 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">Pain Intensity</h3>
                <InfoTooltip side="top" size="sm">
                  Visual ranking of customer pain points by severity (0-10 scale).
                </InfoTooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Avg:</span>
                <span className="text-lg font-bold text-accent">{avgIntensity}/10</span>
              </div>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData.slice(0, 5)} // Top 5 pain points
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 10]}
                    tickCount={6}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={40}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent) / 0.05)" }} />
                  <Bar
                    dataKey="intensity"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={28}
                  >
                    {chartData.slice(0, 5).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--accent))`}
                        fillOpacity={getBarOpacity(entry.intensity)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Stats Summary */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-sm font-medium text-foreground">Summary</h3>
              <InfoTooltip side="top" size="sm">
                Overview statistics of identified customer problems.
              </InfoTooltip>
            </div>

            {/* Big number */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-accent mb-1">
                {painPoints.length}
              </div>
              <div className="text-sm text-muted-foreground">Pain Points Identified</div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground">Highest Intensity</span>
                <span className="font-bold text-accent">
                  {chartData.length > 0 ? `${chartData[0].intensity}/10` : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground">Average Intensity</span>
                <span className="font-bold text-foreground">{avgIntensity}/10</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground">Critical (8+)</span>
                <span className="font-bold text-foreground">
                  {chartData.filter(p => p.intensity >= 8).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pain Points Cards (Top 5 with evidence) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.slice(0, 5).map((point, index) => {
          const intensityPercent = (point.intensity / 10) * 100;
          return (
            <Card 
              key={index} 
              className="bg-accent/5 border-border/30 hover:border-accent/30 transition-colors"
            >
              <CardContent className="p-5">
                {/* Header: Number badge + Score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">#{point.index}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-accent">{point.intensity}</span>
                    <span className="text-sm text-muted-foreground">/10</span>
                  </div>
                </div>
                
                {/* Pain Point Title - sem truncamento */}
                <h4 className="font-semibold text-foreground text-sm leading-relaxed mb-3">
                  {point.fullName}
                </h4>

                {/* Evidence - sem truncamento */}
                {point.evidence && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {point.evidence}
                  </p>
                )}

                {/* Progress bar */}
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ 
                      width: `${intensityPercent}%`,
                      opacity: getBarOpacity(point.intensity)
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default CustomerPainPointsSection;
