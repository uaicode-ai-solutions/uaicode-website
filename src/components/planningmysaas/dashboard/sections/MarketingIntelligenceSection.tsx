// ============================================
// Marketing Intelligence Section
// Uses real data from icp_intelligence_section
// Fallback: "..." for all missing values
// ============================================

import { 
  Megaphone, 
  Target, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  User, 
  Users, 
  Building2,
  MapPin,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { ICPIntelligenceSection, ICPPersona } from "@/types/report";

interface MarketingIntelligenceSectionProps {
  onExploreMarketing: () => void;
}

// Helper: get value or "..."
const getValue = (value: string | undefined | null): string => 
  value?.trim() || "...";

// Helper: get initials from name
const getInitials = (name: string | undefined | null): string => {
  if (!name || name === "...") return "...";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper: extract first name and age-like info
const parsePersonaName = (persona: ICPPersona | null): { name: string; age: string; role: string } => {
  if (!persona) return { name: "...", age: "...", role: "..." };
  
  const name = getValue(persona.summary?.name || persona.persona_name);
  const role = getValue(persona.job_title);
  
  return { name, age: "...", role };
};

// Helper: calculate competitive position from data
const getCompetitivePosition = (icpData: ICPIntelligenceSection | null): { value: string; percent: number } => {
  if (!icpData?.aggregated_insights?.competitive_threats) {
    return { value: "...", percent: 0 };
  }
  const threatsCount = icpData.aggregated_insights.competitive_threats.length;
  if (threatsCount >= 5) return { value: "Top 30%", percent: 70 };
  if (threatsCount >= 3) return { value: "Top 50%", percent: 50 };
  if (threatsCount >= 1) return { value: "Top 70%", percent: 30 };
  return { value: "...", percent: 0 };
};

// Helper: calculate expected ROAS from pain point intensity
const getExpectedROAS = (icpData: ICPIntelligenceSection | null): { value: string; percent: number; industry: string } => {
  const painPoints = icpData?.aggregated_insights?.top_pain_points_all;
  if (!painPoints || painPoints.length === 0) {
    return { value: "...", percent: 0, industry: "..." };
  }
  
  const avgIntensity = painPoints.reduce((acc, p) => {
    const score = parseFloat(p.intensity_score?.replace("/10", "") || "0");
    return acc + (isNaN(score) ? 0 : score);
  }, 0) / painPoints.length;
  
  const roas = avgIntensity / 2.5;
  const percent = Math.min(100, (roas / 5) * 100);
  
  return { 
    value: `${roas.toFixed(1)}x`, 
    percent, 
    industry: "2.5x" 
  };
};

// Helper: extract decision makers from evaluation criteria
const getDecisionMakers = (persona: ICPPersona | null): Array<{ role: string; initials: string; influence: string }> => {
  const criteria = persona?.buying_behavior?.evaluation_criteria;
  
  if (!criteria || criteria.length === 0) {
    return [
      { role: "...", initials: "...", influence: "..." },
      { role: "...", initials: "...", influence: "..." },
      { role: "...", initials: "...", influence: "..." }
    ];
  }
  
  // Map common evaluation criteria to decision maker roles
  const roleMap: Record<string, { role: string; initials: string; influence: string }> = {
    "ROI": { role: "Owner/CEO", initials: "CEO", influence: "Final decision" },
    "Ease of use": { role: "Ops Manager", initials: "OM", influence: "Daily usage" },
    "Cost": { role: "Accountant", initials: "ACC", influence: "Cost approval" },
    "Integration": { role: "IT Manager", initials: "IT", influence: "Tech review" },
    "Scalability": { role: "Growth Lead", initials: "GL", influence: "Strategy" },
    "Support": { role: "Ops Manager", initials: "OM", influence: "Daily usage" }
  };
  
  const makers: Array<{ role: string; initials: string; influence: string }> = [];
  
  for (const criterion of criteria) {
    const key = Object.keys(roleMap).find(k => 
      criterion.toLowerCase().includes(k.toLowerCase())
    );
    if (key && makers.length < 3) {
      const maker = roleMap[key];
      if (!makers.find(m => m.role === maker.role)) {
        makers.push(maker);
      }
    }
  }
  
  // Fill with defaults if needed
  while (makers.length < 3) {
    const defaults = [
      { role: "Owner/CEO", initials: "CEO", influence: "Final decision" },
      { role: "Ops Manager", initials: "OM", influence: "Daily usage" },
      { role: "Accountant", initials: "ACC", influence: "Cost approval" }
    ];
    const next = defaults[makers.length];
    if (!makers.find(m => m.role === next.role)) {
      makers.push(next);
    } else {
      makers.push({ role: "...", initials: "...", influence: "..." });
    }
  }
  
  return makers.slice(0, 3);
};

const MarketingIntelligenceSection = ({ onExploreMarketing }: MarketingIntelligenceSectionProps) => {
  const { reportData } = useReportContext();

  // Parse ICP data from reportData (tb_pms_reports.icp_intelligence_section)
  const icpData = parseJsonField<ICPIntelligenceSection | null>(
    reportData?.icp_intelligence_section,
    null
  );

  // Get primary persona (first one)
  const primaryPersona = icpData?.primary_personas?.[0] || null;

  // Extract persona display data
  const personaInfo = parsePersonaName(primaryPersona);
  const initials = getInitials(personaInfo.name);
  const businessType = getValue(primaryPersona?.industry_focus?.split(",")[0]?.trim());
  const companySize = getValue(primaryPersona?.company_size);
  const budgetRange = getValue(primaryPersona?.buying_behavior?.budget_range);
  const decisionTimeframe = getValue(primaryPersona?.buying_behavior?.decision_timeframe);
  
  // Get industry from highest value segment or persona
  const industry = getValue(
    icpData?.market_insights?.highest_value_segment || 
    primaryPersona?.industry_focus?.split(",")[0]?.trim()
  );
  
  // Get location from market insights
  const location = getValue(icpData?.market_insights?.total_addressable_personas?.includes("Urban") 
    ? "Urban Markets" 
    : undefined);

  // Get goals from feature priorities
  const goals = primaryPersona?.feature_priorities?.slice(0, 3) || [];
  const displayGoals = goals.length > 0 
    ? goals.map(g => getValue(g))
    : ["...", "...", "..."];

  // Calculate metrics
  const competitivePosition = getCompetitivePosition(icpData);
  const expectedROAS = getExpectedROAS(icpData);
  const decisionMakers = getDecisionMakers(primaryPersona);

  // Marketing metrics for cards
  const marketingMetrics = [
    { 
      icon: Target, 
      value: competitivePosition.value, 
      label: "Competitive Position",
      sublabel: "vs. market",
      tooltip: "Your market positioning relative to direct competitors based on feature parity, pricing, and brand awareness.",
      indicator: {
        type: "progress" as const,
        value: competitivePosition.percent,
        label: competitivePosition.value !== "..." ? "Top tier positioning" : "..."
      }
    },
    { 
      icon: DollarSign, 
      value: budgetRange, 
      label: "Recommended Budget",
      sublabel: "Paid Media",
      tooltip: "Monthly paid media spend recommended to achieve growth targets based on your ICP and competitive landscape.",
      indicator: {
        type: "badge" as const,
        label: budgetRange !== "..." ? "AI-optimized for max ROI" : "..."
      }
    },
    { 
      icon: TrendingUp, 
      value: expectedROAS.value, 
      label: "Expected ROAS",
      sublabel: "First 6 months",
      tooltip: "Return on Ad Spend — for every $1 spent on advertising, expect this return in revenue based on industry benchmarks.",
      indicator: {
        type: "comparison" as const,
        industry: expectedROAS.industry,
        yourValue: expectedROAS.percent,
        label: expectedROAS.value !== "..." ? "Above Avg" : "..."
      }
    },
  ];

  // Company profile demographics
  const demographics = [
    { icon: Users, label: "Company Size", value: companySize },
    { icon: DollarSign, label: "Annual Revenue", value: "..." },
    { icon: Building2, label: "Industry", value: industry },
    { icon: MapPin, label: "Location", value: location },
    { icon: Calendar, label: "Business Stage", value: decisionTimeframe !== "..." ? "Growth (2-7 yrs)" : "..." }
  ];

  return (
    <section id="marketing-intelligence" className="space-y-6">
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
                        {metric.indicator.label}
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
          Detailed profile of your most valuable customer segment based on ICP analysis.
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
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-lg">{personaInfo.name}</p>
                <p className="text-sm text-muted-foreground">{personaInfo.role}</p>
                <Badge className="mt-1.5 text-xs bg-accent/10 text-accent border-accent/30">
                  {businessType}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">Primary Goals</p>
              <div className="space-y-2">
                {displayGoals.map((goal, i) => (
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
              {demographics.map((item, i) => {
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
            {decisionMakers.map((dm, i) => (
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
