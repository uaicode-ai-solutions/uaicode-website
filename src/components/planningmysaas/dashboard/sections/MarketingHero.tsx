import { ChevronDown, Target, DollarSign, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface MarketingHeroProps {
  projectName?: string;
  onScheduleCall?: () => void;
  onExploreAnalysis?: () => void;
}

const MarketingHero = ({ projectName, onScheduleCall, onExploreAnalysis }: MarketingHeroProps) => {
  const marketingScore = 72;
  const displayName = projectName || "Your SaaS";

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-accent";
    return "text-red-400";
  };

  const metrics = [
    { 
      icon: Target, 
      value: "Top 30%", 
      label: "Competitive Position",
      sublabel: "vs. market",
      tooltip: "Your market positioning relative to direct competitors based on feature parity, pricing, and brand awareness."
    },
    { 
      icon: DollarSign, 
      value: "$15K/mo", 
      label: "Recommended Budget",
      sublabel: "Paid Media",
      tooltip: "Monthly paid media spend recommended to achieve growth targets based on your ICP and competitive landscape."
    },
    { 
      icon: TrendingUp, 
      value: "3.5x", 
      label: "Expected ROAS",
      sublabel: "First 6 months",
      tooltip: "Return on Ad Spend — for every $1 spent on advertising, expect $3.50 in revenue based on industry benchmarks."
    },
  ];

  const scrollToContent = () => {
    document.getElementById('marketing-verdict')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center py-10">
      {/* Background Effects */}
      <div className="absolute inset-0 aurora-bg opacity-50" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center space-y-6">
        {/* Report Badge */}
        <Badge variant="outline" className="border-accent/30 text-accent gap-2 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Marketing Intelligence Report
        </Badge>

        {/* Project Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          {displayName}
        </h1>

        {/* Marketing Score */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {/* Score Ring - Reduced size */}
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
                  stroke="url(#marketingScoreGradient)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${(marketingScore / 100) * 283} 283`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="marketingScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--accent))" />
                    <stop offset="100%" stopColor="hsl(45, 100%, 45%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl md:text-5xl font-bold ${getScoreColor(marketingScore)}`}>
                  {marketingScore}
                </span>
                <span className="text-xs text-muted-foreground">Marketing</span>
              </div>
            </div>
          </div>

          {/* Verdict Headline */}
          <p className="text-lg md:text-xl text-accent font-medium max-w-xl">
            Strong position with untapped opportunities to outperform competitors
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">
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

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button 
            size="lg"
            onClick={onScheduleCall}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-8"
          >
            Let's Build Your Strategy
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={onExploreAnalysis || scrollToContent}
            className="border-accent/30 hover:border-accent/50 hover:bg-accent/5 gap-2"
          >
            Explore Analysis
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce"
          onClick={scrollToContent}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
        </div>
      </div>
    </div>
  );
};

export default MarketingHero;
