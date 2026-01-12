import { ChevronDown, TrendingUp, DollarSign, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

interface ReportHeroProps {
  projectName?: string;
  onScheduleCall?: () => void;
  onExploreReport?: () => void;
}

const ReportHero = ({ projectName, onScheduleCall, onExploreReport }: ReportHeroProps) => {
  const data = reportData;
  const displayName = projectName || data.projectName;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-amber-400";
    if (score >= 60) return "text-amber-500";
    return "text-red-400";
  };

  const metrics = [
    { 
      icon: TrendingUp, 
      value: data.keyMetrics.marketSize, 
      label: data.keyMetrics.marketLabel,
      sublabel: "Global TAM",
      tooltip: "Total Addressable Market - The total global market demand for your product or service."
    },
    { 
      icon: DollarSign, 
      value: data.keyMetrics.expectedROI, 
      label: data.keyMetrics.roiLabel,
      sublabel: "Year 1",
      tooltip: "Return on Investment - The projected percentage gain on your investment in the first year."
    },
    { 
      icon: Clock, 
      value: `${data.keyMetrics.paybackMonths} months`, 
      label: data.keyMetrics.paybackLabel,
      sublabel: "To break-even",
      tooltip: "The estimated time until your cumulative revenue exceeds your total investment."
    },
  ];

  const scrollToContent = () => {
    document.getElementById('executive-verdict')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center py-10">
      {/* Background Effects */}
      <div className="absolute inset-0 aurora-bg opacity-40" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center space-y-6 animate-fade-in">
        {/* Report Badge */}
        <Badge variant="outline" className="border-accent/30 text-accent gap-2 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Viability Report
        </Badge>

        {/* Project Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          {displayName}
        </h1>

        {/* Viability Score */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {/* Score Ring */}
            <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.25)]">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="transparent"
                  className="text-muted/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#scoreGradient)"
                  strokeWidth="7"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.viabilityScore / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                  className="transition-all duration-1000"
                  filter="url(#glow)"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#FCD34D" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  {data.viabilityScore}
                </span>
                <span className="text-xs text-muted-foreground">Viability</span>
              </div>
            </div>
          </div>

          {/* Verdict Headline */}
          <p className="text-lg md:text-xl text-accent font-medium max-w-lg">
            {data.verdictHeadline}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-6">
          {metrics.map((metric, index) => (
            <Card 
              key={index}
              className="glass-premium border-accent/20 p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <metric.icon className="h-4 w-4 text-accent" />
                </div>
                <InfoTooltip term={metric.label}>
                  {metric.tooltip}
                </InfoTooltip>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{metric.sublabel}</div>
            </Card>
        ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce z-10"
        onClick={scrollToContent}
      >
        <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
      </div>
    </div>
  );
};

export default ReportHero;
