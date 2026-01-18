import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportContext } from "@/contexts/ReportContext";
import { CalendarClock, Zap, Clock, AlertTriangle } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
// Helper functions
const parseScore = (score: string | number | null | undefined): number => {
  if (typeof score === 'number') return Math.min(100, Math.max(0, score));
  if (typeof score === 'string') {
    const match = score.match(/(\d+)/);
    if (match) return Math.min(100, Math.max(0, parseInt(match[1], 10)));
  }
  return 50;
};

const trajectoryToScore = (trajectory: string | null | undefined): number => {
  if (!trajectory) return 50;
  const t = trajectory.toLowerCase();
  if (t.includes('accelerating') || t.includes('strong')) return 90;
  if (t.includes('growing') || t.includes('upward')) return 75;
  if (t.includes('stable') || t.includes('steady')) return 60;
  if (t.includes('slowing') || t.includes('declining')) return 35;
  return 50;
};

const maturityToScore = (maturity: string | null | undefined): number => {
  if (!maturity) return 50;
  const m = maturity.toLowerCase();
  if (m.includes('emerging') || m.includes('early')) return 85;
  if (m.includes('growing') || m.includes('growth')) return 70;
  if (m.includes('maturing')) return 50;
  if (m.includes('mature') || m.includes('saturated')) return 30;
  return 50;
};

const saturationToScore = (saturation: string | null | undefined): number => {
  if (!saturation) return 50;
  const s = saturation.toLowerCase();
  if (s.includes('low') || s.includes('minimal')) return 85;
  if (s.includes('moderate') || s.includes('medium')) return 60;
  if (s.includes('high') || s.includes('saturated')) return 30;
  return 50;
};

interface ParsedWindow {
  startQuarter: number;
  endQuarter: number;
  year: number;
  urgency: string;
}

const parseOptimalWindow = (windowStr: string | null | undefined): ParsedWindow => {
  const defaultWindow: ParsedWindow = {
    startQuarter: 1,
    endQuarter: 2,
    year: new Date().getFullYear(),
    urgency: "Immediate"
  };
  
  if (!windowStr) return defaultWindow;
  
  const qMatch = windowStr.match(/Q(\d)(?:\s*[-–]\s*Q(\d))?/i);
  const yearMatch = windowStr.match(/20\d{2}/);
  
  if (qMatch) {
    defaultWindow.startQuarter = parseInt(qMatch[1], 10);
    defaultWindow.endQuarter = qMatch[2] ? parseInt(qMatch[2], 10) : defaultWindow.startQuarter;
  }
  
  if (yearMatch) {
    defaultWindow.year = parseInt(yearMatch[0], 10);
  }
  
  const urgencyPatterns = [
    { pattern: /immediate|urgent|now/i, label: "Immediate" },
    { pattern: /soon|near|short/i, label: "Soon" },
    { pattern: /moderate|medium/i, label: "Moderate" },
    { pattern: /later|long|extended/i, label: "Extended" }
  ];
  
  for (const { pattern, label } of urgencyPatterns) {
    if (pattern.test(windowStr)) {
      defaultWindow.urgency = label;
      break;
    }
  }
  
  return defaultWindow;
};

const generateQuarterTimeline = (parsedWindow: ParsedWindow): Array<{ quarter: number; year: number }> => {
  const quarters: Array<{ quarter: number; year: number }> = [];
  let currentQuarter = parsedWindow.startQuarter;
  let currentYear = parsedWindow.year;
  
  for (let i = 0; i < 8; i++) {
    quarters.push({ quarter: currentQuarter, year: currentYear });
    currentQuarter++;
    if (currentQuarter > 4) {
      currentQuarter = 1;
      currentYear++;
    }
  }
  
  return quarters;
};

type QuarterStatus = "optimal" | "late" | "risky";

const getQuarterStatus = (
  quarter: number, 
  year: number, 
  parsedWindow: ParsedWindow
): QuarterStatus => {
  const windowStart = parsedWindow.startQuarter;
  const windowEnd = parsedWindow.endQuarter;
  const windowYear = parsedWindow.year;
  
  if (year === windowYear) {
    if (quarter >= windowStart && quarter <= windowEnd) return "optimal";
    if (quarter > windowEnd && quarter <= windowEnd + 2) return "late";
    return "risky";
  }
  
  if (year === windowYear + 1) {
    const quartersAfterEnd = (4 - windowEnd) + quarter;
    if (quartersAfterEnd <= 2) return "late";
    return "risky";
  }
  
  return "risky";
};

const getUrgencyConfig = (urgency: string) => {
  const configs: Record<string, { icon: typeof Zap; color: string; bgColor: string; borderColor: string }> = {
    Immediate: { 
      icon: Zap, 
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    Soon: { 
      icon: Clock, 
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    },
    Moderate: { 
      icon: Clock, 
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    Extended: { 
      icon: AlertTriangle, 
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    }
  };
  return configs[urgency] || configs.Immediate;
};

interface QuarterBlockProps {
  quarter: number;
  year: number;
  status: QuarterStatus;
}

const QuarterBox = ({ quarter, year, status }: QuarterBlockProps) => {
  const statusStyles = {
    optimal: "bg-green-500/10 border-green-500/30",
    late: "bg-yellow-500/10 border-yellow-500/30",
    risky: "bg-muted/10 border-border/20"
  };
  
  const statusTextColors = {
    optimal: "text-green-400",
    late: "text-yellow-400",
    risky: "text-muted-foreground"
  };
  
  const statusLabels = {
    optimal: "OPTIMAL",
    late: "LATE",
    risky: "RISKY"
  };

  const tooltipMessages = {
    optimal: "This is the optimal time window for market entry. Market conditions are most favorable during this period.",
    late: "You can still enter during this period, but you may face increased competition and reduced first-mover advantages.",
    risky: "Entry during this period carries higher risk. Market conditions may be less favorable or competition may be established."
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "text-center p-3 rounded-lg border cursor-help transition-all hover:scale-105",
          statusStyles[status]
        )}>
          <p className={cn("text-lg font-bold", statusTextColors[status])}>Q{quarter}</p>
          <p className="text-xs text-muted-foreground">{year}</p>
          <p className={cn(
            "text-[10px] mt-1 font-medium uppercase tracking-wide",
            statusTextColors[status]
          )}>
            {statusLabels[status]}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[200px]">
        <p className="text-xs">{tooltipMessages[status]}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-semibold text-foreground mb-1">{data.metric}</p>
        <p className="text-lg font-bold text-accent">{data.score}/100</p>
      </div>
    );
  }
  return null;
};

const MarketTimingSection = () => {
  const { reportData } = useReportContext();
  
  const opportunityData = reportData?.opportunity_section as Record<string, any> | null;
  const timingData = opportunityData?.market_timing;
  
  if (!timingData) return null;
  
  const trendsScore = parseScore(timingData.trends_score);
  const trajectoryScore = trajectoryToScore(timingData.trajectory);
  const maturityScore = maturityToScore(timingData.market_maturity);
  const optimalWindowScore = parseScore(timingData.optimal_window_score || 75);
  const saturationScore = saturationToScore(timingData.saturation_risk);
  
  const radarData = [
    { metric: "Trends", score: trendsScore, fullMark: 100 },
    { metric: "Trajectory", score: trajectoryScore, fullMark: 100 },
    { metric: "Maturity", score: maturityScore, fullMark: 100 },
    { metric: "Optimal Window", score: optimalWindowScore, fullMark: 100 },
    { metric: "Saturation", score: saturationScore, fullMark: 100 },
  ];
  
  const parsedWindow = parseOptimalWindow(timingData.optimal_window);
  const quarters = generateQuarterTimeline(parsedWindow);
  const urgencyConfig = getUrgencyConfig(parsedWindow.urgency);
  const UrgencyIcon = urgencyConfig.icon;
  
  const windowDuration = (parsedWindow.endQuarter - parsedWindow.startQuarter + 1) * 3;

  return (
    <TooltipProvider>
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Timing Analysis</h2>
          <InfoTooltip>
            Analysis of market timing factors including trends, trajectory, maturity, and saturation to determine the optimal entry window.
          </InfoTooltip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart Card */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-accent" />
                Market Timing Score
                <InfoTooltip size="sm">
                  Radar visualization of key timing indicators affecting market entry success.
                </InfoTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <defs>
                      <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <PolarGrid 
                      stroke="hsl(var(--border))" 
                      strokeOpacity={0.3}
                    />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ 
                        fill: 'hsl(var(--muted-foreground))', 
                        fontSize: 11,
                        fontWeight: 500
                      }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      axisLine={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      fill="url(#radarGradient)"
                      dot={{ 
                        r: 4, 
                        fill: 'hsl(var(--accent))',
                        strokeWidth: 2,
                        stroke: 'hsl(var(--background))'
                      }}
                    />
                    <RechartsTooltip content={<CustomRadarTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Optimal Window Card */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Optimal Entry Window
                <InfoTooltip size="sm">
                  The recommended time frame to enter the market based on current conditions.
                </InfoTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timeline Grid */}
              <div className="grid grid-cols-4 gap-2">
                {quarters.slice(0, 8).map((q) => (
                  <QuarterBox
                    key={`${q.quarter}-${q.year}`}
                    quarter={q.quarter}
                    year={q.year}
                    status={getQuarterStatus(q.quarter, q.year, parsedWindow)}
                  />
                ))}
              </div>

              {/* Conclusion */}
              <div className={cn(
                "p-4 rounded-xl border",
                urgencyConfig.bgColor,
                urgencyConfig.borderColor
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-lg flex-shrink-0",
                    urgencyConfig.bgColor
                  )}>
                    <UrgencyIcon className={cn("h-4 w-4", urgencyConfig.color)} />
                  </div>
                  <p className="text-sm text-foreground/90">
                    Best time to enter:{" "}
                    <span className={cn("font-semibold", urgencyConfig.color)}>
                      Q{parsedWindow.startQuarter}
                      {parsedWindow.startQuarter !== parsedWindow.endQuarter && `-Q${parsedWindow.endQuarter}`}
                      {" "}{parsedWindow.year}
                    </span>
                    <span className="text-muted-foreground"> • </span>
                    <span className="text-muted-foreground">
                      {windowDuration} month window
                    </span>
                    <span className="text-muted-foreground"> • </span>
                    <span className={cn("font-medium", urgencyConfig.color)}>
                      {parsedWindow.urgency} entry recommended
                    </span>
                  </p>
                </div>
              </div>

              {/* Saturation Warning */}
              {timingData.saturation_risk && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-yellow-400">Saturation Risk:</span>{" "}
                    {timingData.saturation_risk}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default MarketTimingSection;
