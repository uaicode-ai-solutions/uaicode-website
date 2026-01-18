import { Clock, TrendingUp, CalendarClock, Activity, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import ScoreCircle from "@/components/planningmysaas/dashboard/ui/ScoreCircle";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Parse score value like "92/100" or "85" to number
const parseScore = (value: string | undefined): number => {
  if (!value) return 0;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Map trajectory to score
const trajectoryToScore = (trajectory: string | undefined): number => {
  if (!trajectory) return 50;
  const lower = trajectory.toLowerCase();
  if (lower.includes("accelerat") || lower.includes("rapid")) return 95;
  if (lower.includes("steady") || lower.includes("growing")) return 75;
  if (lower.includes("slow") || lower.includes("maturing")) return 50;
  if (lower.includes("declin") || lower.includes("saturate")) return 25;
  return 60;
};

// Map maturity to score
const maturityToScore = (maturity: string | undefined): number => {
  if (!maturity) return 50;
  const lower = maturity.toLowerCase();
  if (lower.includes("emerging") || lower.includes("nascent")) return 90;
  if (lower.includes("growth") || lower.includes("expanding")) return 80;
  if (lower.includes("mature") || lower.includes("established")) return 50;
  if (lower.includes("declining") || lower.includes("saturated")) return 30;
  return 60;
};

// Map saturation level to score (inverse - lower saturation = higher score)
const saturationToScore = (saturation: string | undefined): number => {
  if (!saturation) return 70;
  const lower = saturation.toLowerCase();
  if (lower.includes("low") || lower.includes("minimal")) return 90;
  if (lower.includes("moderate") || lower.includes("medium")) return 60;
  if (lower.includes("high") || lower.includes("saturated")) return 30;
  return 60;
};

const MarketTimingSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;

  // Extract timing metrics
  const trendsScore = parseScore(opportunityData?.trends_score);
  const trajectoryScore = trajectoryToScore(opportunityData?.current_trajectory);
  const maturityScore = maturityToScore(opportunityData?.market_maturity);
  const saturationScore = saturationToScore(opportunityData?.saturation_level);

  // Calculate window score based on optimal_window presence
  const windowScore = opportunityData?.optimal_window ? 85 : 60;

  // Data for radar chart with descriptions for tooltips
  const radarData = [
    { 
      axis: "Trends", 
      value: trendsScore, 
      fullMark: 100,
      description: "Measures current market search trends and interest growth. Higher scores indicate rising demand and growing audience interest."
    },
    { 
      axis: "Trajectory", 
      value: trajectoryScore, 
      fullMark: 100,
      description: "Indicates the speed and direction of market growth. Accelerating markets score higher, suggesting strong momentum."
    },
    { 
      axis: "Maturity", 
      value: maturityScore, 
      fullMark: 100,
      description: "Reflects the market lifecycle stage. Emerging markets score higher as they offer more growth potential."
    },
    { 
      axis: "Window", 
      value: windowScore, 
      fullMark: 100,
      description: "Evaluates the optimal entry timing window. Higher scores suggest favorable conditions for market entry."
    },
    { 
      axis: "Saturation", 
      value: saturationScore, 
      fullMark: 100,
      description: "Measures competitive density (inverted). Lower saturation means more opportunity and less competition."
    },
  ];

  // Custom Tooltip for Radar Chart
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border/50 rounded-lg p-3 shadow-lg max-w-[240px]">
          <p className="font-semibold text-accent text-sm mb-1">{data.axis}</p>
          <p className="text-xl font-bold text-foreground mb-2">{data.value}/100</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate overall timing score
  const overallScore = Math.round(
    (trendsScore + trajectoryScore + maturityScore + windowScore + saturationScore) / 5
  );

  // Metrics for display
  const metrics = [
    {
      label: "Phase",
      value: opportunityData?.market_maturity || "Growth",
      icon: Clock,
    },
    {
      label: "Trajectory",
      value: opportunityData?.current_trajectory || "Accelerating",
      icon: TrendingUp,
    },
    {
      label: "Window",
      value: opportunityData?.optimal_window || "Q1-Q2 2026",
      icon: CalendarClock,
    },
    {
      label: "Trend Score",
      value: opportunityData?.trends_score || "85/100",
      icon: Activity,
    },
  ];

  return (
    <section id="market-timing" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Clock className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Market Timing</h2>
            <InfoTooltip side="right" size="sm">
              Analysis of market timing indicators including trends, trajectory, and window of opportunity.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">When to enter the market</p>
        </div>
      </div>

      {/* Two Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Radar Chart */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">Timing Analysis</h3>
                <InfoTooltip side="top" size="sm">
                  This radar chart visualizes 5 key market timing factors. Each axis represents a 
                  different indicator that helps determine the optimal moment to enter the market. 
                  Higher values toward the outer edges indicate more favorable conditions.
                </InfoTooltip>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-accent">{overallScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                  <InfoTooltip side="left" size="sm">
                    Overall Timing Score is the average of all 5 timing metrics: Trends, Trajectory, 
                    Maturity, Window, and Saturation. Scores above 75 indicate excellent timing for 
                    market entry.
                  </InfoTooltip>
                </div>
                <span className="text-xs text-muted-foreground">Overall Score</span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                    tickCount={5}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomRadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Metrics Grid with Mini ScoreCircles */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-5">Key Indicators</h3>

            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-accent/5 border border-accent/10 transition-all duration-300 hover:border-accent/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-accent/10">
                        <IconComponent className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm leading-tight">
                      {metric.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Score Circles Row */}
            <div className="mt-6 flex justify-center gap-6">
              <ScoreCircle score={trendsScore} label="Trends" size="sm" />
              <ScoreCircle score={trajectoryScore} label="Trajectory" size="sm" />
              <ScoreCircle score={maturityScore} label="Maturity" size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saturation Risk Alert */}
      {opportunityData?.saturation_risk && (
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-accent/10 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Saturation Alert</p>
              <p className="text-sm text-muted-foreground">{opportunityData.saturation_risk}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MarketTimingSection;
