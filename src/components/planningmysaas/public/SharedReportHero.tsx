import { ChevronDown, TrendingUp, DollarSign, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useReportContext } from "@/contexts/ReportContext";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";
import { HeroScoreSection, OpportunitySection, safeNumber } from "@/types/report";

// Format market values: "$713.36 billion" → "$713.4B"
const formatMarketValue = (value: string): string => {
  if (!value || value === "..." || value === "$...") return "...";
  
  let formatted = value
    .replace(/\s*billion/gi, "B")
    .replace(/\s*million/gi, "M")
    .replace(/\s*trillion/gi, "T")
    .replace(/\s*thousand/gi, "K")
    .trim();
  
  // Round to 1 decimal place
  formatted = formatted.replace(/(\$?)([\d,]+)\.(\d{2,})/g, (_, dollar, integer, decimals) => {
    const num = parseFloat(`${integer.replace(/,/g, '')}.${decimals}`);
    return `${dollar}${num.toFixed(1)}`;
  });
  
  return formatted;
};

/**
 * Premium hero banner for the public shared report page.
 * Displays project name, viability score ring with glow, and key metrics.
 */
const SharedReportHero = () => {
  const { report, reportData } = useReportContext();
  const financialMetrics = useFinancialMetrics(reportData, report?.market_type);

  // Project name
  const projectName = report?.saas_name || "Business Plan";

  // Score and tagline from hero_score_section
  const heroScoreData = reportData?.hero_score_section as HeroScoreSection | null;
  const viabilityScore = safeNumber(heroScoreData?.score, 0);
  const tagline = heroScoreData?.tagline || "Viability Analysis";

  // TAM from opportunity_section
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const totalMarket = opportunityData?.tam_value 
    ? formatMarketValue(opportunityData.tam_value) 
    : "...";

  // LTV/CAC and Payback from useFinancialMetrics
  const ltvCacRatio = financialMetrics.ltvCacCalculated 
    ? `${financialMetrics.ltvCacCalculated.toFixed(1)}x`
    : (financialMetrics.ltvCacRatio || "...");
  const paybackPeriod = financialMetrics.paybackPeriod 
    ? `${financialMetrics.paybackPeriod} mo` 
    : (financialMetrics.unitEconomics?.paybackPeriod || "...");

  const metrics = [
    { 
      icon: TrendingUp, 
      value: totalMarket, 
      label: "Total Market",
      sublabel: "Global TAM"
    },
    { 
      icon: DollarSign, 
      value: ltvCacRatio, 
      label: "LTV/CAC Ratio",
      sublabel: "Unit Economics"
    },
    { 
      icon: Clock, 
      value: paybackPeriod, 
      label: "Payback Period",
      sublabel: "To break-even"
    },
  ];

  const scrollToContent = () => {
    document.getElementById('shared-report-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col justify-center py-10">
      {/* Background Effects */}
      <div className="absolute inset-0 aurora-bg opacity-40" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center space-y-6 animate-fade-in">
        {/* Report Badge */}
        <Badge variant="outline" className="border-accent/30 text-accent gap-2 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Shared Business Plan
        </Badge>

        {/* Project Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          {projectName}
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
                  stroke="url(#sharedScoreGradient)"
                  strokeWidth="7"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${(viabilityScore / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                  className="transition-all duration-1000"
                  filter="url(#sharedGlow)"
                />
                <defs>
                  <linearGradient id="sharedScoreGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#FCD34D" />
                  </linearGradient>
                  <filter id="sharedGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-gradient-gold">
                  {viabilityScore}
                </span>
                <span className="text-xs text-muted-foreground">Viability</span>
              </div>
            </div>
          </div>

          {/* Verdict Tagline */}
          <p className="text-lg md:text-xl text-accent font-medium max-w-lg">
            {tagline}
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

export default SharedReportHero;
