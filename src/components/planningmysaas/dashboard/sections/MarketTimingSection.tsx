import { Clock, CalendarClock, AlertTriangle, Zap, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { cn } from "@/lib/utils";

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

// Parse optimal_window: "Immediate (Q1-Q2 2026)"
interface ParsedWindow {
  urgency: string;
  startQuarter: number;
  endQuarter: number;
  year: number;
}

const parseOptimalWindow = (windowText: string | undefined): ParsedWindow => {
  if (!windowText) return { urgency: "Unknown", startQuarter: 1, endQuarter: 2, year: 2026 };
  
  // Extract urgency (before parenthesis)
  const urgencyMatch = windowText.match(/^([^(]+)/);
  const urgency = urgencyMatch ? urgencyMatch[1].trim() : "Unknown";
  
  // Extract quarters (inside parenthesis) - handles Q1-Q2 2026 format
  const quarterMatch = windowText.match(/Q(\d)[-–]Q(\d)\s+(\d{4})/);
  if (quarterMatch) {
    return {
      urgency,
      startQuarter: parseInt(quarterMatch[1]),
      endQuarter: parseInt(quarterMatch[2]),
      year: parseInt(quarterMatch[3])
    };
  }
  
  // Single quarter format: "Q1 2026"
  const singleMatch = windowText.match(/Q(\d)\s+(\d{4})/);
  if (singleMatch) {
    return {
      urgency,
      startQuarter: parseInt(singleMatch[1]),
      endQuarter: parseInt(singleMatch[1]),
      year: parseInt(singleMatch[2])
    };
  }
  
  return { urgency, startQuarter: 1, endQuarter: 2, year: 2026 };
};

// Generate 8 quarters starting from a year
const generateQuarterTimeline = (startYear: number) => {
  const quarters = [];
  for (let y = startYear; y <= startYear + 1; y++) {
    for (let q = 1; q <= 4; q++) {
      quarters.push({ quarter: q, year: y });
    }
  }
  return quarters.slice(0, 8);
};

// Determine quarter status
const getQuarterStatus = (quarter: number, year: number, optimal: ParsedWindow): "optimal" | "late" | "risky" => {
  // Check if within optimal window
  if (year === optimal.year && quarter >= optimal.startQuarter && quarter <= optimal.endQuarter) {
    return "optimal";
  }
  
  // Calculate absolute position
  const currentAbsolute = (year - optimal.year) * 4 + quarter;
  const optimalEndAbsolute = optimal.endQuarter;
  
  // If before optimal window
  if (currentAbsolute < optimal.startQuarter) {
    return "late"; // Before optimal = still preparing
  }
  
  // Late: within 2 quarters after optimal end
  if (currentAbsolute <= optimalEndAbsolute + 2) {
    return "late";
  }
  
  return "risky";
};

// Get urgency configuration
const getUrgencyConfig = (urgency: string) => {
  const lower = urgency.toLowerCase();
  if (lower.includes("immediate")) {
    return { 
      icon: Zap, 
      color: "bg-green-500/20 text-green-400 border-green-500/40",
      pulse: true,
      tooltip: "Market conditions are highly favorable - Enter now for best positioning"
    };
  }
  if (lower.includes("short") || lower.includes("soon")) {
    return { 
      icon: Clock, 
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
      pulse: false,
      tooltip: "Good conditions but window closing - Plan entry within 3-6 months"
    };
  }
  return { 
    icon: Calendar, 
    color: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    pulse: false,
    tooltip: "Standard timeline - Market conditions are stable"
  };
};

// Quarter Block Component
interface QuarterBlockProps {
  quarter: number;
  year: number;
  status: "optimal" | "late" | "risky";
}

const QuarterBlock = ({ quarter, year, status }: QuarterBlockProps) => {
  const statusConfig = {
    optimal: {
      bg: "bg-green-500",
      border: "border-green-400",
      text: "text-green-400",
      glow: "shadow-lg shadow-green-500/30 ring-2 ring-green-400/50",
      label: "OPTIMAL",
      tooltip: "Recommended entry period - Best market conditions and lowest competition"
    },
    late: {
      bg: "bg-yellow-500/60",
      border: "border-yellow-500/40",
      text: "text-yellow-400",
      glow: "",
      label: "LATE",
      tooltip: "Still viable but competition increasing - Act quickly if entering"
    },
    risky: {
      bg: "bg-muted/40",
      border: "border-border",
      text: "text-muted-foreground",
      glow: "",
      label: "RISKY",
      tooltip: "High risk period - Market may be saturated or conditions unfavorable"
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col items-center gap-2 cursor-help group">
          <div className={cn(
            "w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
            config.border, config.glow,
            "group-hover:scale-105"
          )}>
            <div className={cn("w-5 h-5 rounded-full transition-all", config.bg)} />
          </div>
          <div className="text-center">
            <span className={cn("text-sm font-semibold block", config.text)}>
              Q{quarter}
            </span>
            <span className="text-xs text-muted-foreground">
              {year}
            </span>
          </div>
          <span className={cn(
            "text-[10px] font-medium uppercase tracking-wider",
            config.text
          )}>
            {config.label}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[200px]">
        <p className="text-xs">{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const MarketTimingSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;

  // Extract timing metrics for radar
  const trendsScore = parseScore(opportunityData?.trends_score);
  const trajectoryScore = trajectoryToScore(opportunityData?.current_trajectory);
  const maturityScore = maturityToScore(opportunityData?.market_maturity);
  const saturationScore = saturationToScore(opportunityData?.saturation_level);
  const windowScore = opportunityData?.optimal_window ? 85 : 60;

  // Parse optimal window for timeline
  const parsedWindow = parseOptimalWindow(opportunityData?.optimal_window);
  const urgencyConfig = getUrgencyConfig(parsedWindow.urgency);
  const UrgencyIcon = urgencyConfig.icon;
  const quarters = generateQuarterTimeline(parsedWindow.year);

  // Data for radar chart
  const radarData = [
    { 
      axis: "Trends", 
      value: trendsScore, 
      fullMark: 100,
      description: "Measures current market search trends and interest growth."
    },
    { 
      axis: "Trajectory", 
      value: trajectoryScore, 
      fullMark: 100,
      description: "Indicates the speed and direction of market growth."
    },
    { 
      axis: "Maturity", 
      value: maturityScore, 
      fullMark: 100,
      description: "Reflects the market lifecycle stage."
    },
    { 
      axis: "Window", 
      value: windowScore, 
      fullMark: 100,
      description: "Evaluates the optimal entry timing window."
    },
    { 
      axis: "Saturation", 
      value: saturationScore, 
      fullMark: 100,
      description: "Measures competitive density (inverted)."
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

  // Calculate progress bar position
  const progressStart = ((parsedWindow.startQuarter - 1) / 8) * 100;
  const progressWidth = ((parsedWindow.endQuarter - parsedWindow.startQuarter + 1) / 8) * 100;

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

      {/* Two Cards Grid - Radar + Empty placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Radar Chart */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">Timing Analysis</h3>
                <InfoTooltip side="top" size="sm">
                  This radar chart visualizes 5 key market timing factors. Higher values toward the outer edges indicate more favorable conditions.
                </InfoTooltip>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-accent">{overallScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                  <InfoTooltip side="left" size="sm">
                    Overall Timing Score is the average of all 5 timing metrics. Scores above 75 indicate excellent timing.
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
                  <RechartsTooltip content={<CustomRadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Placeholder for future content */}
        <div className="hidden lg:block" />
      </div>

      {/* Optimal Window Card - Full Width */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Optimal Window
            </CardTitle>
            <InfoTooltip>
              Optimal market entry window based on current trajectory, saturation levels, and competitive landscape analysis.
            </InfoTooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Urgency Badge with Tooltip */}
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={cn(
                  "px-4 py-2 text-sm font-semibold border cursor-help",
                  urgencyConfig.color,
                  urgencyConfig.pulse && "animate-pulse"
                )}>
                  <UrgencyIcon className="h-4 w-4 mr-2" />
                  {parsedWindow.urgency}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p className="text-xs">{urgencyConfig.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Quarter Timeline - Horizontal */}
          <div className="flex justify-center items-start gap-4 md:gap-6 py-4 overflow-x-auto">
            {quarters.map((q) => (
              <QuarterBlock
                key={`${q.quarter}-${q.year}`}
                quarter={q.quarter}
                year={q.year}
                status={getQuarterStatus(q.quarter, q.year, parsedWindow)}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-muted/30 rounded-full mx-4">
            <div 
              className="absolute h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
              style={{ 
                left: `${progressStart}%`,
                width: `${progressWidth}%`
              }}
            />
          </div>
          
          {/* Summary */}
          <p className="text-center text-sm text-muted-foreground">
            Best time to enter: <span className="text-primary font-medium">
              Q{parsedWindow.startQuarter}-Q{parsedWindow.endQuarter} {parsedWindow.year}
            </span>
          </p>
        </CardContent>
      </Card>

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
