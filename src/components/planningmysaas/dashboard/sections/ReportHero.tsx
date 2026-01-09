import { ChevronDown, TrendingUp, DollarSign, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
      sublabel: "TAM Global"
    },
    { 
      icon: DollarSign, 
      value: data.keyMetrics.expectedROI, 
      label: data.keyMetrics.roiLabel,
      sublabel: "Ano 1"
    },
    { 
      icon: Clock, 
      value: `${data.keyMetrics.paybackMonths} meses`, 
      label: data.keyMetrics.paybackLabel,
      sublabel: "Até break-even"
    },
  ];

  const scrollToContent = () => {
    document.getElementById('executive-verdict')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 aurora-bg opacity-60" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center space-y-8">
        {/* Report Badge */}
        <Badge variant="outline" className="border-accent/30 text-accent gap-2 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Relatório de Viabilidade
        </Badge>

        {/* Project Name */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          {displayName}
        </h1>

        {/* Viability Score */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Score Ring */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/30"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.viabilityScore / 100) * 440} 440`}
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
                <span className={`text-5xl font-bold ${getScoreColor(data.viabilityScore)}`}>
                  {data.viabilityScore}
                </span>
                <span className="text-sm text-muted-foreground">Viabilidade</span>
              </div>
            </div>
          </div>

          {/* Verdict Headline */}
          <p className="text-xl md:text-2xl text-accent font-medium max-w-xl">
            {data.verdictHeadline}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
          {metrics.map((metric, index) => (
            <Card 
              key={index}
              className="bg-card/50 border-border/30 p-6 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <metric.icon className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">{metric.sublabel}</div>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            size="lg"
            onClick={onScheduleCall}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-8"
          >
            Vamos Construir Juntos
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={onExploreReport || scrollToContent}
            className="border-border/50 hover:border-accent/50 gap-2"
          >
            Ver Análise Completa
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce"
          onClick={scrollToContent}
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground/50" />
        </div>
      </div>
    </div>
  );
};

export default ReportHero;
