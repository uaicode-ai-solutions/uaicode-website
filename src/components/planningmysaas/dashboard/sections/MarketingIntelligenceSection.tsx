import { 
  Megaphone, 
  Target, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  User, 
  Users, 
  Heart,
  Building2,
  MapPin,
  Calendar,
  MessageSquare,
  BarChart3,
  Eye
} from "lucide-react";
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

// ICP Data - expanded
const icpData = {
  persona: {
    name: "Maria Santos",
    age: 42,
    role: "CEO & Founder",
    businessType: "Health Product Store",
    initials: "MS"
  },
  demographics: [
    { icon: Users, label: "Company Size", value: "10-50 employees" },
    { icon: DollarSign, label: "Annual Revenue", value: "$500K - $5M" },
    { icon: Building2, label: "Industry", value: "Health & Wellness" },
    { icon: MapPin, label: "Location", value: "Urban, US & LATAM" },
    { icon: Calendar, label: "Business Stage", value: "Growth (2-7 yrs)" }
  ],
  goals: [
    "Scale without losing quality",
    "Compete with big platforms",
    "Build customer loyalty"
  ],
  painPoints: [
    { pain: "Losing sales to big platforms", severity: "high" },
    { pain: "Manual inventory takes 3+ hours/day", severity: "high" },
    { pain: "No integrated delivery solution", severity: "medium" },
    { pain: "Compliance documentation is complex", severity: "medium" }
  ],
  buyingTriggers: [
    "Hiring new staff members",
    "Opening second location",
    "Seasonal demand spike",
    "Competitor launching online store"
  ],
  decisionMakers: [
    { role: "Owner/CEO", initials: "CEO", influence: "Final decision" },
    { role: "Ops Manager", initials: "OM", influence: "Daily usage" },
    { role: "Accountant", initials: "ACC", influence: "Cost approval" }
  ],
  messagingHooks: [
    "Save 10+ hours per week on inventory",
    "Compete with big platforms on delivery"
  ]
};

// Growth Strategy Data
const { growthStrategy } = competitorAnalysisData;

const acquisitionMetrics = [
  { icon: DollarSign, value: growthStrategy.acquisition.targetCAC, label: "Target CAC" },
  { icon: TrendingUp, value: growthStrategy.engagement.activationTarget, label: "Activation" }
];

const monetizationMetrics = [
  { icon: TrendingUp, value: growthStrategy.monetization.conversionTarget, label: "Conversion" },
  { icon: Heart, value: growthStrategy.retention.targetChurn, label: "Target Churn" }
];

const keyMetrics = [
  { label: "Monthly Visitors", value: "25K", target: "target" },
  { label: "Lead Conv. Rate", value: "3%", target: "target" },
  { label: "MQLs/month", value: "500", target: "target" },
  { label: "CAC Target", value: "<$75", target: "target" }
];

const expectedResults = [
  { label: "Impressions", value: "5M+" },
  { label: "Leads Generated", value: "2,500+" },
  { label: "Trial Signups", value: "500+" },
  { label: "New Customers", value: "150+" },
  { label: "Achieved CAC", value: "$75" }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default: return "bg-muted/20 text-muted-foreground border-border/30";
  }
};

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
              className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5 relative group"
            >
              {/* Gradient corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
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

      {/* Your Ideal Customer - Subtitle */}
      <div className="flex items-center gap-2 mt-8">
        <h3 className="font-semibold text-foreground text-sm">Your Ideal Customer</h3>
        <InfoTooltip side="right" size="sm">
          Detailed profile of your most valuable customer segment.
        </InfoTooltip>
      </div>

      {/* ICP Row 1: Customer Avatar + Company Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Avatar Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Customer Avatar</h4>
            </div>
            
            <div className="flex items-center gap-4 mb-5">
              <Avatar className="h-14 w-14 border-2 border-accent/30">
                <AvatarFallback className="bg-accent/20 text-accent font-bold text-lg">
                  {icpData.persona.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-lg">{icpData.persona.name}, {icpData.persona.age}</p>
                <p className="text-sm text-muted-foreground">{icpData.persona.role}</p>
                <Badge className="mt-1.5 text-xs bg-accent/10 text-accent border-accent/30">
                  {icpData.persona.businessType}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">Primary Goals</p>
              <div className="space-y-2">
                {icpData.goals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-foreground">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Profile Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Company Profile</h4>
            </div>
            
            <div className="space-y-3 mb-5">
              {icpData.demographics.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-accent/70" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-foreground font-medium">{item.value}</span>
                  </div>
                );
              })}
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* Decision Makers Row */}
      <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Users className="h-4 w-4 text-accent" />
            <h4 className="font-medium text-sm text-foreground">Decision Makers</h4>
            <InfoTooltip side="right" size="sm">
              Key stakeholders involved in the purchasing decision.
            </InfoTooltip>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {icpData.decisionMakers.map((dm, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center text-center p-5 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-all"
              >
                <Avatar className="h-12 w-12 border-2 border-accent mb-3">
                  <AvatarFallback className="bg-transparent text-accent font-semibold">
                    {dm.initials}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-foreground text-sm mb-2">{dm.role}</p>
                <Badge className="text-xs bg-accent/10 text-accent border-accent/30">
                  {dm.influence}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Targets (AEMR) - Subtitle */}
      <div className="flex items-center gap-2 mt-8">
        <h3 className="font-semibold text-foreground text-sm">Growth Targets (AEMR)</h3>
        <InfoTooltip side="right" size="sm">
          Acquisition, Engagement, Monetization, Retention framework metrics.
        </InfoTooltip>
      </div>

      {/* AEMR Row 1: Acquisition & Engagement + Monetization & Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Acquisition & Engagement Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Acquisition & Engagement</h4>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {acquisitionMetrics.map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className="text-center p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <Icon className="h-4 w-4 text-accent mx-auto mb-2" />
                    <p className="text-xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                );
              })}
            </div>
            
            {/* Key Channels */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Key Acquisition Channels</p>
              <div className="flex flex-wrap gap-2">
                {growthStrategy.acquisition.channels.slice(0, 3).map((ch, i) => (
                  <Badge key={i} className="text-xs bg-muted/20 text-foreground border-border/30">
                    {ch.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Lead Target */}
            <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Lead Target</span>
                <span className="text-sm font-bold text-foreground">500 MQLs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monetization & Retention Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Monetization & Retention</h4>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {monetizationMetrics.map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className="text-center p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <Icon className="h-4 w-4 text-accent mx-auto mb-2" />
                    <p className="text-xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                );
              })}
            </div>
            
            {/* Revenue Streams */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Revenue Streams</p>
              <div className="space-y-2">
              {growthStrategy.monetization.revenueStreams.map((stream, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{stream.stream}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full" 
                          style={{ width: stream.percentage }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-8">{stream.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Avg Contract */}
            <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Contract Value</span>
                <span className="text-sm font-bold text-foreground">$1,200/year</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AEMR Row 2: Key Metrics + Expected Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Key Metrics Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Key Metrics</h4>
            </div>
            
            <div className="space-y-3 mb-5">
              {keyMetrics.map((metric, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-muted/10 border border-border/20">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{metric.value}</span>
                    <Badge className="text-[8px] bg-accent/10 text-accent border-accent/30">
                      {metric.target}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
              <p className="text-xs text-muted-foreground mb-1">Activation Metric</p>
              <p className="text-sm font-medium text-foreground">
                {growthStrategy.engagement.activationMetric}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Expected Results Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-sm text-foreground">Expected Results</h4>
              <Badge className="text-[10px] bg-accent/10 text-accent border-accent/30">Month 6</Badge>
            </div>
            
            <div className="space-y-3 mb-5">
              {expectedResults.map((result, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                  <span className="text-muted-foreground">{result.label}</span>
                  <span className="font-bold text-green-400">{result.value}</span>
                </div>
              ))}
            </div>
            
            <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projected ROI</span>
                <span className="text-sm font-bold text-accent">3.5x</span>
              </div>
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
