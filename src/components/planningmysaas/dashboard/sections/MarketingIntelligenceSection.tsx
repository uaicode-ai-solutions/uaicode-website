import { Megaphone, Target, DollarSign, TrendingUp, ArrowRight, Sparkles, User, AlertTriangle, Zap, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

interface MarketingIntelligenceSectionProps {
  onExploreMarketing: () => void;
}

const marketingMetrics = [
  { 
    icon: Target, 
    value: "Top 30%", 
    label: "Competitive Position",
    sublabel: "vs. market",
    tooltip: "Your market positioning relative to direct competitors based on feature parity, pricing, and brand awareness.",
    indicator: {
      type: "progress" as const,
      value: 70,
      label: "Top tier positioning"
    }
  },
  { 
    icon: DollarSign, 
    value: "$15K/mo", 
    label: "Recommended Budget",
    sublabel: "Paid Media",
    tooltip: "Monthly paid media spend recommended to achieve growth targets based on your ICP and competitive landscape.",
    indicator: {
      type: "badge" as const,
      label: "AI-optimized for max ROI"
    }
  },
  { 
    icon: TrendingUp, 
    value: "3.5x", 
    label: "Expected ROAS",
    sublabel: "First 6 months",
    tooltip: "Return on Ad Spend — for every $1 spent on advertising, expect $3.50 in revenue based on industry benchmarks.",
    indicator: {
      type: "comparison" as const,
      industry: "2.5x",
      yourValue: 75,
      label: "Above industry average"
    }
  },
];

// ICP Preview data
const icpPreview = {
  persona: {
    name: "Maria Santos",
    age: 42,
    role: "CEO & Founder",
    businessType: "Health Product Store",
    initials: "MS"
  },
  painPoints: [
    { pain: "Losing sales to big platforms", severity: "high" },
    { pain: "Manual inventory takes 3+ hours/day", severity: "high" }
  ],
  buyingTriggers: [
    "Hiring new staff members",
    "Opening second location"
  ]
};

// Growth Metrics Preview (AEMR)
const { growthStrategy } = competitorAnalysisData;

const growthMetricsPreview = [
  { 
    icon: Users, 
    value: growthStrategy.acquisition.targetCAC, 
    label: "Target CAC"
  },
  { 
    icon: Zap, 
    value: growthStrategy.engagement.activationTarget, 
    label: "Activation"
  },
  { 
    icon: DollarSign, 
    value: growthStrategy.monetization.conversionTarget, 
    label: "Conversion"
  },
  { 
    icon: Heart, 
    value: growthStrategy.retention.targetChurn, 
    label: "Target Churn"
  }
];

const MarketingIntelligenceSection = ({ onExploreMarketing }: MarketingIntelligenceSectionProps) => {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Megaphone className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Marketing Intelligence</h2>
          <p className="text-sm text-muted-foreground">Strategic insights to accelerate your growth</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={index} 
              className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group"
            >
              {/* Gradient corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="p-5 relative">
                {/* Icon and Tooltip */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <InfoTooltip>{metric.tooltip}</InfoTooltip>
                </div>

                {/* Value */}
                <div className="mb-3">
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                </div>

                {/* Labels */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.sublabel}</p>
                </div>

                {/* Indicator */}
                {metric.indicator.type === "progress" && (
                  <div className="space-y-2">
                    <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full transition-all duration-500"
                        style={{ width: `${metric.indicator.value}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{metric.indicator.label}</p>
                  </div>
                )}

                {metric.indicator.type === "badge" && (
                  <Badge className="bg-accent/10 text-accent border-accent/30 text-[10px] font-normal">
                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                    {metric.indicator.label}
                  </Badge>
                )}

                {metric.indicator.type === "comparison" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Industry: {metric.indicator.industry}</span>
                      <Badge className="bg-accent/10 text-accent border-accent/30 text-[10px]">
                        Above Avg
                      </Badge>
                    </div>
                    <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full transition-all duration-500"
                        style={{ width: `${metric.indicator.yourValue}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ICP Preview + Growth Metrics - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ICP Preview Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Your Ideal Customer</h4>
              <InfoTooltip>A detailed profile of your most valuable customer segment based on market analysis.</InfoTooltip>
            </div>
            
            {/* Persona */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-accent/30">
                <AvatarFallback className="bg-accent/20 text-accent font-bold text-sm">
                  {icpPreview.persona.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{icpPreview.persona.name}, {icpPreview.persona.age}</p>
                <p className="text-xs text-muted-foreground">{icpPreview.persona.role}</p>
                <Badge className="mt-1 text-[10px] bg-accent/10 text-accent border-accent/30">
                  {icpPreview.persona.businessType}
                </Badge>
              </div>
            </div>
            
            {/* Pain Points */}
            <div className="mb-3">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1.5">
                <AlertTriangle className="h-3 w-3 text-red-400" />
                Pain Points
              </p>
              <div className="space-y-1">
                {icpPreview.painPoints.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded bg-red-500/5 border border-red-500/10">
                    <span className="text-foreground">{item.pain}</span>
                    <Badge className="text-[8px] bg-red-500/20 text-red-400 border-red-500/30">
                      {item.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Buying Triggers */}
            <div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1.5">
                <Zap className="h-3 w-3 text-accent" />
                Buying Triggers
              </p>
              <div className="space-y-1">
                {icpPreview.buyingTriggers.map((trigger, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs p-1.5 rounded bg-accent/5 border border-accent/10">
                    <div className="h-1 w-1 rounded-full bg-accent" />
                    <span className="text-foreground">{trigger}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Metrics Card (AEMR) */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Growth Targets</h4>
              <Badge className="text-[8px] bg-accent/10 text-accent border-accent/30">AEMR</Badge>
              <InfoTooltip>AEMR Framework: Acquisition, Engagement, Monetization, Retention - key metrics for sustainable growth.</InfoTooltip>
            </div>
            
            {/* AEMR Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {growthMetricsPreview.map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className="text-center p-2 rounded-lg bg-accent/5 border border-accent/10">
                    <Icon className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                    <p className="text-sm font-bold text-foreground">{metric.value}</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">{metric.label}</p>
                  </div>
                );
              })}
            </div>
            
            {/* Key Channels */}
            <div className="mb-3">
              <p className="text-[10px] text-muted-foreground mb-1.5">Key Acquisition Channels</p>
              <div className="flex flex-wrap gap-1">
                {growthStrategy.acquisition.channels.slice(0, 3).map((ch, i) => (
                  <Badge key={i} className="text-[10px] bg-muted/20 text-foreground border-border/30">
                    {ch.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Activation Metric */}
            <div className="p-2 rounded-lg bg-accent/5 border border-accent/10">
              <p className="text-[10px] text-muted-foreground">Activation Metric</p>
              <p className="text-xs font-medium text-foreground">
                {growthStrategy.engagement.activationMetric}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Banner */}
      <Card className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-accent/30">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Want the full Marketing Strategy?</p>
              <p className="text-xs text-muted-foreground">Get detailed ICP profile, paid media plan, and growth roadmap.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-accent/40 hover:bg-accent/10 gap-2 shrink-0"
            onClick={onExploreMarketing}
          >
            Explore Marketing Tab
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default MarketingIntelligenceSection;
