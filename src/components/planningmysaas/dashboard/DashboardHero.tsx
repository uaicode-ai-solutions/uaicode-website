import { CheckCircle2, Sparkles, TrendingUp, Target, DollarSign, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projectInfoData, executiveSummaryData, marketOpportunityData, financialProjections } from "@/lib/dashboardMockData";

const DashboardHero = () => {
  const quickStats = [
    {
      icon: TrendingUp,
      value: `${executiveSummaryData.viabilityScore}%`,
      label: "Viability",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Target,
      value: marketOpportunityData.tam,
      label: "TAM",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: DollarSign,
      value: financialProjections.pricingStrategy.idealTicket,
      label: "Price/mo",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Clock,
      value: `${financialProjections.pricingStrategy.breakEvenMonths}mo`,
      label: "Break-even",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="relative">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center space-y-8 py-12">
        {/* Report type badge */}
        <div className="flex justify-center">
          <Badge className="bg-accent/20 text-accent border-accent/30 px-5 py-2 text-sm font-medium shimmer">
            <Sparkles className="w-4 h-4 mr-2" />
            {projectInfoData.reportType}
          </Badge>
        </div>

        {/* Project name with gradient */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient-gold tracking-tight">
            {projectInfoData.projectName}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {projectInfoData.description}
          </p>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap justify-center gap-3">
          <Badge variant="outline" className="px-4 py-1.5 text-sm border-border/50 bg-card/50 backdrop-blur-sm">
            {projectInfoData.saasType}
          </Badge>
          <Badge variant="outline" className="px-4 py-1.5 text-sm border-border/50 bg-card/50 backdrop-blur-sm">
            {projectInfoData.industry}
          </Badge>
          <Badge variant="outline" className="px-4 py-1.5 text-sm border-border/50 bg-card/50 backdrop-blur-sm">
            {projectInfoData.targetMarket}
          </Badge>
        </div>

        {/* Quick stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="metric-card-premium bg-card/50 border-border/30 p-4 backdrop-blur-sm"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3 mx-auto`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} animate-count-up`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Social proof */}
        <div className="flex justify-center pt-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 glow-success">
            <div className="relative">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm md:text-base text-green-400 font-medium">
              {projectInfoData.successRate}% of similar projects delivered successfully by UaiCode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
