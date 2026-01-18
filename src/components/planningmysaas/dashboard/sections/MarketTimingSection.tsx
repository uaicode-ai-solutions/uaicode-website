import { Clock, AlertTriangle, TrendingUp, ArrowUpRight, Target, Timer, Users } from "lucide-react";
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
  Tooltip as RechartsTooltip,
} from "recharts";
import { LucideIcon } from "lucide-react";

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

  // Indicator data for the 5 score circles with icons
  const indicatorData: { name: string; score: number; description: string; icon: LucideIcon }[] = [
    { 
      name: "Trends", 
      score: trendsScore,
      description: "Measures current market search trends and interest growth.",
      icon: TrendingUp
    },
    { 
      name: "Trajectory", 
      score: trajectoryScore,
      description: "Indicates the speed and direction of market growth.",
      icon: ArrowUpRight
    },
    { 
      name: "Maturity", 
      score: maturityScore,
      description: "Reflects the market lifecycle stage. Emerging markets score higher.",
      icon: Target
    },
    { 
      name: "Window", 
      score: windowScore,
      description: "Evaluates the optimal entry timing window.",
      icon: Timer
    },
    { 
      name: "Saturation", 
      score: saturationScore,
      description: "Measures competitive density (inverted). Lower saturation = higher score.",
      icon: Users
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

      {/* Row 1: Radar + Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Timing Analysis Radar */}
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
                  <defs>
                    <radialGradient id="radarGridGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.35" />
                      <stop offset="25%" stopColor="hsl(var(--accent))" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
                      <stop offset="75%" stopColor="hsl(var(--accent))" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
                    </radialGradient>
                  </defs>
                  <PolarGrid 
                    stroke="hsl(var(--border))" 
                    strokeOpacity={0.5}
                    fill="url(#radarGridGradient)"
                  />
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
                  <RechartsTooltip content={<CustomRadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Market Insights - 3 Mini Cards */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-sm font-medium text-foreground">Market Insights</h3>
              <InfoTooltip side="top" size="sm">
                Key qualitative insights about market timing conditions and entry strategy.
              </InfoTooltip>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Mini Card 1: Optimal Window */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-card/80 to-card/40 border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Optimal Window
                  </span>
                  <InfoTooltip side="top" size="sm">
                    The ideal time frame to enter the market based on current conditions and trends.
                  </InfoTooltip>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {opportunityData?.optimal_window || "To be determined based on market analysis"}
                </p>
              </div>
              
              {/* Mini Card 2: Current Trajectory */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-card/80 to-card/40 border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Current Trajectory
                  </span>
                  <InfoTooltip side="top" size="sm">
                    The current direction and speed of market growth, indicating momentum.
                  </InfoTooltip>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {opportunityData?.current_trajectory || "Analyzing market trajectory..."}
                </p>
              </div>
              
              {/* Mini Card 3: Market Maturity */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-card/80 to-card/40 border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Market Maturity
                  </span>
                  <InfoTooltip side="top" size="sm">
                    The current lifecycle stage of the market, from emerging to mature.
                  </InfoTooltip>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {opportunityData?.market_maturity || "Analyzing market maturity..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Indicators - Individual Cards Grid */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Key Indicators</h3>
          <InfoTooltip side="top" size="sm">
            These 5 metrics represent the key timing factors for market entry. 
            Each score ranges from 0-100, with higher values indicating more 
            favorable conditions.
          </InfoTooltip>
        </div>

        {/* Grid of Individual Cards (5 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {indicatorData.map((indicator) => {
            const Icon = indicator.icon;
            return (
              <Card
                key={indicator.name}
                className="group relative bg-muted/30 border-border/50 
                           hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 
                           hover:scale-[1.02] transition-all duration-300"
              >
                <CardContent className="p-4 flex flex-col items-center gap-3">
                  {/* Header: Icon + Name + Tooltip */}
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <Icon className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {indicator.name}
                    </span>
                    <InfoTooltip side="top" size="sm">
                      <p className="font-semibold text-accent mb-1">{indicator.name}</p>
                      <p className="text-foreground mb-1">{indicator.score}/100</p>
                      <p className="text-muted-foreground text-xs">{indicator.description}</p>
                    </InfoTooltip>
                  </div>
                  
                  {/* ScoreCircle - Larger with gradient glow effect */}
                  <ScoreCircle 
                    score={indicator.score} 
                    label="" 
                    size="2xl"
                    showLabelInside={false}
                    showGlow={true}
                  />
                  
                  {/* Description (short) */}
                  <p className="text-[10px] text-muted-foreground text-center line-clamp-2">
                    {indicator.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
