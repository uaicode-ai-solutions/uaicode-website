import { Sparkles, TrendingUp, Target, DollarSign, Clock, Calendar, ChevronDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectInfoData, executiveSummaryData, marketOpportunityData, financialProjections } from "@/lib/dashboardMockData";

const DashboardHero = () => {
  const getVerdictColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-foreground";
    return "text-muted-foreground";
  };

  const quickStats = [
    {
      icon: TrendingUp,
      value: `${executiveSummaryData.viabilityScore}%`,
      label: "Viability",
      sublabel: "Market Ready",
    },
    {
      icon: Target,
      value: marketOpportunityData.tam,
      label: "TAM",
      sublabel: "Total Market",
    },
    {
      icon: DollarSign,
      value: financialProjections.pricingStrategy.idealTicket,
      label: "Price/mo",
      sublabel: "Ideal Ticket",
    },
    {
      icon: Clock,
      value: `${financialProjections.pricingStrategy.breakEvenMonths}mo`,
      label: "Break-even",
      sublabel: "To Profitability",
    },
  ];

  const scrollToContent = () => {
    document.getElementById('executive-summary')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center space-y-6 py-8">
        {/* Report type badge */}
        <div className="flex justify-center">
          <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 text-xs font-medium">
            <Sparkles className="w-3 h-3 mr-1.5" />
            {projectInfoData.reportType}
          </Badge>
        </div>

        {/* Project name with verdict headline */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            {projectInfoData.projectName}
          </h1>
          <p className={`text-lg md:text-xl font-medium italic ${getVerdictColor(executiveSummaryData.viabilityScore)}`}>
            "{executiveSummaryData.verdictHeadline}"
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {projectInfoData.description}
          </p>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-xs border-border/50 bg-card/50 text-muted-foreground">
            {projectInfoData.saasType}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs border-border/50 bg-card/50 text-muted-foreground">
            {projectInfoData.industry}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs border-border/50 bg-card/50 text-muted-foreground">
            {projectInfoData.targetMarket}
          </Badge>
        </div>

        {/* Quick stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-card/50 border-border/30 p-3 backdrop-blur-sm hover:border-accent/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-2 mx-auto">
                <stat.icon className="w-4 h-4 text-accent" />
              </div>
              <div className="text-lg font-semibold text-accent">
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {stat.sublabel}
              </div>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-medium">
            <Calendar className="w-4 h-4" />
            Let's Build This Together
          </Button>
          <Button 
            variant="outline" 
            className="border-border/50 text-muted-foreground hover:text-accent hover:border-accent/50 gap-2"
            onClick={scrollToContent}
          >
            Explore Full Analysis
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Success rate badge */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted-foreground">
              <span className="text-accent font-medium">{projectInfoData.successRate}%</span> of similar projects delivered successfully
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pt-4">
          <button 
            onClick={scrollToContent}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
