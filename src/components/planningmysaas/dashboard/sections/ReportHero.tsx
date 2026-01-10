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
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
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
    <div className="relative min-h-[85vh] flex flex-col justify-center py-8">
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
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          {displayName}
        </h1>

        {/* Viability Score */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {/* Score Ring */}
            <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-muted/30"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.viabilityScore / 100) * 283} 283`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--accent))" />
                    <stop offset="100%" stopColor="hsl(45, 100%, 45%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl md:text-5xl font-bold ${getScoreColor(data.viabilityScore)}`}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto mt-6">
          {metrics.map((metric, index) => (
            <Card 
              key={index}
              className="bg-card/50 border-border/30 p-4 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <metric.icon className="h-4 w-4 text-accent" />
                </div>
                <InfoTooltip side="top">
                  {metric.tooltip}
                </InfoTooltip>
              </div>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className="text-xs text-muted-foreground/70">{metric.sublabel}</div>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button 
            size="lg"
            onClick={onScheduleCall}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-6 shadow-lg shadow-accent/20"
          >
            Let's Build This Together
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={onExploreReport || scrollToContent}
            className="border-border/50 hover:border-accent/50 gap-2"
          >
            See Full Analysis
          </Button>
        </div>

        {/* Urgency Text */}
        <p className="text-sm text-muted-foreground">
          <span className="text-accent">Limited availability</span> — We accept 2-3 new projects per month
        </p>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce"
          onClick={scrollToContent}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
        </div>
      </div>
    </div>
  );
};

export default ReportHero;
