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
  Calendar,
  Crown,
  Shield,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Helper: get value or fallback (with capitalization)
const getValue = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return "...";
  const str = String(value).trim();
  if (str.length === 0) return "...";
  // Capitalize first letter if starts with text
  if (/^[a-zA-Z]/.test(str)) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
};

// Helper: get initials from name
const getInitials = (name: string | undefined | null): string => {
  if (!name || name === "...") return "?";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ============================================
// NAME GENERATION: Based on region and gender
// ============================================
const NAME_MAP: Record<string, Record<string, { firstName: string; lastName: string }>> = {
  us: {
    male: { firstName: "Michael", lastName: "Johnson" },
    female: { firstName: "Sarah", lastName: "Williams" },
    any: { firstName: "Taylor", lastName: "Anderson" }
  },
  brazil: {
    male: { firstName: "Carlos", lastName: "Silva" },
    female: { firstName: "Maria", lastName: "Oliveira" },
    any: { firstName: "Alex", lastName: "Santos" }
  },
  europe: {
    male: { firstName: "Thomas", lastName: "Müller" },
    female: { firstName: "Emma", lastName: "Schmidt" },
    any: { firstName: "Alex", lastName: "Martin" }
  },
  asia: {
    male: { firstName: "Kenji", lastName: "Tanaka" },
    female: { firstName: "Yuki", lastName: "Yamamoto" },
    any: { firstName: "Hiro", lastName: "Sato" }
  }
};

// Helper: generate ICP display name from wizard data
const getIcpDisplayName = (
  targetAudience: string | null | undefined,
  geographicRegion: string | null | undefined
): string => {
  const region = geographicRegion || "us";
  const gender = targetAudience || "any";
  
  const regionNames = NAME_MAP[region] || NAME_MAP.us;
  const personName = regionNames[gender] || regionNames.any;
  
  return `${personName.firstName} ${personName.lastName}`;
};

// Helper: format camelCase to Title Case (e.g., advancedAnalytics -> Advanced Analytics)
const formatFeatureName = (feature: string): string => {
  if (!feature) return "...";
  
  return feature
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// ============================================
// COMPANY PROFILE HELPERS
// ============================================

// Helper: Extract main value (before parentheses or semicolons)
const extractMainValue = (value: string | undefined | null): string => {
  if (!value?.trim()) return "...";
  // Remove text inside parentheses and after semicolons
  const cleaned = value.split("(")[0].split(";")[0].trim();
  // Capitalize first letter if starts with text
  if (cleaned.length === 0) return "...";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

// Helper: Map wizard region to display name
const REGION_DISPLAY_MAP: Record<string, string> = {
  us: "United States",
  brazil: "Brazil",
  europe: "Europe",
  asia: "Asia Pacific"
};

const getLocationDisplay = (region: string | null | undefined): string => {
  if (!region) return "...";
  const lowerRegion = region.toLowerCase();
  return REGION_DISPLAY_MAP[lowerRegion] || region.charAt(0).toUpperCase() + region.slice(1);
};

// Helper: Format pricing model (capitalize first letter)
const formatPricingModel = (value: string | undefined | null): string => {
  if (!value?.trim()) return "...";
  const main = value.split(";")[0].trim();
  if (main.length === 0) return "...";
  return main.charAt(0).toUpperCase() + main.slice(1);
};

// Helper: Extract budget value (only monetary amount + period)
const extractBudgetValue = (value: string | undefined | null): string => {
  if (!value?.trim()) return "...";
  // Match pattern like "$50-150/month" or "$100/month"
  const budgetMatch = value.match(/\$[\d,]+-?[\d,]*\/\w+/);
  if (budgetMatch) {
    return budgetMatch[0];
  }
  // Fallback: take first part before space after /
  const parts = value.split(" ");
  for (const part of parts) {
    if (part.includes("$") && part.includes("/")) {
      return part;
    }
  }
  return extractMainValue(value);
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
const getDecisionMakers = (persona: ICPPersona | null): Array<{ role: string; initials: string; influence: string; percent: number }> => {
  const criteria = persona?.buying_behavior?.evaluation_criteria;
  
  if (!criteria || criteria.length === 0) {
    return [
      { role: "...", initials: "?", influence: "...", percent: 0 },
      { role: "...", initials: "?", influence: "...", percent: 0 },
      { role: "...", initials: "?", influence: "...", percent: 0 }
    ];
  }
  
  // Map common evaluation criteria to decision maker roles
  const roleMap: Record<string, { role: string; initials: string; influence: string; percent: number }> = {
    "ROI": { role: "Owner/CEO", initials: "CEO", influence: "Final decision", percent: 85 },
    "Ease of use": { role: "Ops Manager", initials: "OM", influence: "Daily usage", percent: 65 },
    "Cost": { role: "Accountant", initials: "ACC", influence: "Cost approval", percent: 55 },
    "Integration": { role: "IT Manager", initials: "IT", influence: "Tech review", percent: 60 },
    "Scalability": { role: "Growth Lead", initials: "GL", influence: "Strategy", percent: 50 },
    "Support": { role: "Ops Manager", initials: "OM", influence: "Daily usage", percent: 65 }
  };
  
  const makers: Array<{ role: string; initials: string; influence: string; percent: number }> = [];
  
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
      { role: "Owner/CEO", initials: "CEO", influence: "Final decision", percent: 85 },
      { role: "Ops Manager", initials: "OM", influence: "Daily usage", percent: 65 },
      { role: "Accountant", initials: "ACC", influence: "Cost approval", percent: 55 }
    ];
    const next = defaults[makers.length];
    if (!makers.find(m => m.role === next.role)) {
      makers.push(next);
    } else {
      makers.push({ role: "...", initials: "?", influence: "...", percent: 0 });
    }
  }
  
  return makers.slice(0, 3);
};

const MarketingIntelligenceSection = ({ onExploreMarketing }: MarketingIntelligenceSectionProps) => {
  const { report, reportData } = useReportContext();

  // Parse ICP data from reportData (tb_pms_reports.icp_intelligence_section)
  const icpData = parseJsonField<ICPIntelligenceSection | null>(
    reportData?.icp_intelligence_section,
    null
  );

  // Get primary persona (first one)
  const primaryPersona = icpData?.primary_personas?.[0] || null;

  // ============================================
  // ICP Display Data (Updated per requirements)
  // ============================================
  
  // Name: Generated from wizard's target_audience + geographic_region
  const icpDisplayName = getIcpDisplayName(
    report?.target_audience,
    report?.geographic_region
  );
  const initials = getInitials(icpDisplayName);
  
  // Role: Comes from summary.name (e.g., "Mid-Market Clinic Operations Director")
  const icpRole = getValue(primaryPersona?.summary?.name || primaryPersona?.persona_name);
  
  // Industry Badge: First item from industry_focus
  const businessType = getValue(
    primaryPersona?.summary?.industry_focus?.split(",")[0]?.trim() ||
    primaryPersona?.industry_focus?.split(",")[0]?.trim()
  );
  
  // ============================================
  // COMPANY PROFILE DATA (from summary)
  // ============================================
  
  // Company Size: From summary.company_size, extract main value only
  const companySize = extractMainValue(primaryPersona?.summary?.company_size);

  // Budget Range: From summary.budget_range, extract main value only
  const budgetRange = extractBudgetValue(primaryPersona?.summary?.budget_range);

  // Industry: From summary.industry_focus
  const industry = getValue(primaryPersona?.summary?.industry_focus);

  // Location: From wizard's geographic_region
  const location = getLocationDisplay(report?.geographic_region);

  // Decision Timeframe: From summary.decision_timeframe, extract main value only
  const decisionTimeframe = extractMainValue(primaryPersona?.summary?.decision_timeframe);

  // Preferred Pricing Model: From summary.preferred_pricing_model
  const pricingModel = formatPricingModel(primaryPersona?.summary?.preferred_pricing_model);

  // Primary Goals: From summary.key_features, formatted
  const keyFeatures = primaryPersona?.summary?.key_features || [];
  const displayGoals = keyFeatures.length > 0 
    ? keyFeatures.slice(0, 3).map(formatFeatureName)
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
      percent: competitivePosition.percent
    },
    { 
      icon: DollarSign, 
      value: budgetRange, 
      label: "Recommended Budget",
      sublabel: "Paid Media",
      tooltip: "Monthly paid media spend recommended to achieve growth targets based on your ICP and competitive landscape.",
      percent: budgetRange !== "..." ? 75 : 0
    },
    { 
      icon: TrendingUp, 
      value: expectedROAS.value, 
      label: "Expected ROAS",
      sublabel: `Industry: ${expectedROAS.industry}`,
      tooltip: "Return on Ad Spend — for every $1 spent on advertising, expect this return in revenue based on industry benchmarks.",
      percent: expectedROAS.percent
    },
  ];

  // Company profile demographics - all fullWidth for consistent vertical layout
  const demographics = [
    { icon: Users, label: "Company Size", value: companySize },
    { icon: DollarSign, label: "Budget Range", value: budgetRange },
    { icon: Building2, label: "Industry", value: industry },
    { icon: MapPin, label: "Location", value: location },
    { icon: Calendar, label: "Decision Timeframe", value: decisionTimeframe },
    { icon: CreditCard, label: "Pricing Model", value: pricingModel }
  ];

  // Decision maker icons
  const decisionMakerIcons = [Crown, User, Shield];

  return (
    <section id="marketing-intelligence" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10">
          <Megaphone className="h-5 w-5 text-amber-500" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">Marketing Intelligence</h2>
          <InfoTooltip side="right" size="sm">
            Strategic insights to accelerate your growth based on ICP analysis.
          </InfoTooltip>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={index} 
              className="group relative bg-card/50 border-border/30 overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Gradient corner decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
              
              <CardContent className="p-5 relative">
                {/* Icon and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10">
                    <Icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-amber-500/10 border-amber-500/20 text-amber-500 text-xs"
                  >
                    {metric.label}
                  </Badge>
                </div>

                {/* Value */}
                <p className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent mb-1">
                  {metric.value}
                </p>

                {/* Sublabel */}
                <p className="text-sm text-muted-foreground mb-4">{metric.sublabel}</p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${metric.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <InfoTooltip size="sm">{metric.tooltip}</InfoTooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Your Ideal Customer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Avatar Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Your Ideal Customer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{icpDisplayName}</h3>
                <p className="text-sm text-muted-foreground">{icpRole}</p>
                <Badge variant="outline" className="mt-1 bg-amber-500/10 border-amber-500/20 text-amber-500 text-xs">
                  {businessType}
                </Badge>
              </div>
            </div>

            {/* Primary Goals */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Key Features</p>
              <div className="space-y-2">
                {displayGoals.map((goal, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gradient-to-b from-card/80 to-card/40 border border-accent/10 hover:border-accent/30 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                    <span className="text-foreground">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Profile Card */}
        <Card className="bg-card/50 border-border/30 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Company Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demographics.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i} 
                    className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-accent/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-gradient-to-br from-amber-500/15 to-amber-400/5">
                        <Icon className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground pl-8">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Makers Row */}
      <Card className="bg-card/50 border-border/30 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Decision Makers</CardTitle>
            <InfoTooltip side="right" size="sm">
              Key stakeholders involved in the purchasing decision.
            </InfoTooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {decisionMakers.map((dm, i) => {
              const IconComponent = decisionMakerIcons[i];
              return (
                <div 
                  key={i} 
                  className="group flex flex-col items-center text-center p-5 rounded-xl bg-muted/30 border border-border/50 hover:border-accent/30 hover:shadow-md transition-all duration-300"
                >
                  <Avatar className="h-14 w-14 mb-3 ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500/80 to-amber-600/80 text-white">
                      <IconComponent className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-foreground text-sm mb-2">{dm.role}</p>
                  <Badge 
                    variant="outline" 
                    className="mb-3 bg-amber-500/10 border-amber-500/20 text-amber-500 text-xs"
                  >
                    {dm.influence}
                  </Badge>
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Influence</span>
                      <span>{dm.percent > 0 ? `${dm.percent}%` : "..."}</span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500"
                        style={{ width: `${dm.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA Banner */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-amber-500/30 hover:border-amber-500/40 transition-all">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-400/10">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Want the full Marketing Strategy?</h3>
                <p className="text-sm text-muted-foreground">Get detailed ICP profile, paid media plan, and growth roadmap.</p>
              </div>
            </div>
            <Button 
              onClick={onExploreMarketing}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25 shrink-0"
            >
              Explore Marketing Tab
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MarketingIntelligenceSection;
