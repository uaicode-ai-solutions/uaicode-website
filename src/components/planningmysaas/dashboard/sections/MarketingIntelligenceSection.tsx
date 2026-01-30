// ============================================
// Marketing Intelligence Section
// Uses real data from icp_intelligence_section
// Fallback: "..." for all missing values
// Uses PRE-GENERATED static avatars from storage
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { ICPIntelligenceSection, ICPPersona } from "@/types/report";

// HIDDEN v1.0 - onExploreMarketing prop removed, will return in future version
interface MarketingIntelligenceSectionProps {
  onExploreMarketing?: () => void;
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

// Helper: Extract pricing model NAME from potentially long strategy text
const extractPricingModelName = (strategy: string | undefined | null, fallbackModel: string | undefined | null): string => {
  // Try fallback first if it's short and valid
  if (fallbackModel && String(fallbackModel).length <= 25) {
    const fb = String(fallbackModel).trim();
    if (fb && !['null', 'undefined', ''].includes(fb.toLowerCase())) {
      return fb.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }
  
  if (!strategy) return "Tiered Subscription";
  const str = String(strategy).trim();
  if (!str || ['null', 'undefined'].includes(str.toLowerCase())) return "Tiered Subscription";
  
  // If it's already a short name, capitalize and return
  if (str.length <= 25) {
    return str.split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Extract model name from long text using keywords
  const lowerStr = str.toLowerCase();
  if (lowerStr.includes('freemium')) return 'Freemium';
  if (lowerStr.includes('tiered')) return 'Tiered Pricing';
  if (lowerStr.includes('subscription')) return 'Subscription';
  if (lowerStr.includes('usage-based') || lowerStr.includes('usage based')) return 'Usage-Based';
  if (lowerStr.includes('per-user') || lowerStr.includes('per user')) return 'Per-User';
  if (lowerStr.includes('flat rate') || lowerStr.includes('flat-rate')) return 'Flat Rate';
  if (lowerStr.includes('value-based') || lowerStr.includes('value based')) return 'Value-Based';
  
  // Fallback: extract first 2-3 words
  const words = str.split(/[\s,.-]+/).filter(w => w.length > 0).slice(0, 3);
  const extracted = words.join(' ');
  return extracted.length > 25 ? extracted.slice(0, 22) + '...' : extracted;
};
// Helper: Extract company size from potentially long text
const extractCompanySize = (value: string | undefined | null): string => {
  if (!value?.trim()) return "SMB";
  const str = String(value).trim();
  const lowerStr = str.toLowerCase();
  
  // 1. Handle "N/A" patterns first - extract useful info after it
  if (lowerStr.startsWith('n/a')) {
    if (lowerStr.includes('individual')) return 'Individual';
    if (lowerStr.includes('solopreneur')) return 'Solopreneur';
    if (lowerStr.includes('startup')) return 'Startup';
    if (lowerStr.includes('smb')) return 'SMB';
    if (lowerStr.includes('enterprise')) return 'Enterprise';
    return 'Individual'; // Default for N/A with no useful info
  }
  
  // 2. Check keywords BEFORE length check (applies to ALL strings)
  if (lowerStr.includes('enterprise')) return 'Enterprise';
  if (lowerStr.includes('large')) return 'Large Business';
  if (lowerStr.includes('mid-market') || lowerStr.includes('midmarket')) return 'Mid-Market';
  if (lowerStr.includes('small') && lowerStr.includes('medium')) return 'SMB';
  if (lowerStr.includes('smb')) return 'SMB';
  if (lowerStr.includes('startup')) return 'Startup';
  if (lowerStr.includes('solopreneur')) return 'Solopreneur';
  if (lowerStr.includes('individual')) return 'Individual';
  if (lowerStr.includes('small')) return 'Small Business';
  if (lowerStr.includes('medium')) return 'Medium Business';
  
  // 3. Extract employee count patterns: "10-50", "50-200", "1-10", etc.
  const employeeMatch = str.match(/(\d{1,4}\s*[-–]\s*\d{1,4})\s*(employees?)?/i);
  if (employeeMatch) {
    return employeeMatch[1].replace(/\s+/g, '') + " employees";
  }
  
  // 4. If already short and clean, capitalize and return
  if (str.length <= 20) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // 5. Fallback: first 2-3 words max 20 chars
  const words = str.split(/[\s,.-]+/).filter(w => w.length > 0).slice(0, 3);
  const extracted = words.join(' ');
  return extracted.length > 20 ? extracted.slice(0, 17) + '...' : extracted;
};

// Helper: Extract minimum monthly budget from typical_budget field
// Source: icp_intelligence_section.budget_timeline.typical_budget (e.g., "$25-$60/month")
const extractMinMonthlyBudget = (typicalBudget: string | undefined | null): string => {
  if (!typicalBudget?.trim()) return "...";
  const str = String(typicalBudget).trim();
  
  // Match patterns like "$25-$60/month", "$25/month", "$25-60"
  const match = str.match(/\$?([\d,]+(?:\.\d+)?)/);
  if (match) {
    const value = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(value) && value > 0) {
      return `$${Math.round(value)}`;
    }
  }
  return "...";
};

// Helper: calculate competitive position from paid_media data
// Source: paid_media_intelligence_section.performance_targets (ROAS, target_cac, etc.)
const getCompetitivePosition = (
  paidMediaData: Record<string, unknown> | null,
  competitorCount: number
): { value: string; percent: number } => {
  if (!paidMediaData) return { value: "...", percent: 0 };
  
  // Try to extract from market_gaps_identified or competitive_position field
  const performanceTargets = paidMediaData?.performance_targets as Record<string, unknown> | null;
  const marketGaps = performanceTargets?.market_gaps_identified as unknown[] | null;
  
  if (marketGaps && marketGaps.length > 0) {
    // More gaps = more opportunities = stronger position
    if (marketGaps.length >= 3) return { value: "Strong", percent: 75 };
    if (marketGaps.length >= 2) return { value: "Moderate", percent: 50 };
    return { value: "Emerging", percent: 30 };
  }
  
  // Fallback: Use competitor count
  if (competitorCount > 0) {
    if (competitorCount <= 3) return { value: "Less Crowded", percent: 70 };
    if (competitorCount <= 5) return { value: "Moderate", percent: 50 };
    return { value: "Crowded", percent: 30 };
  }
  
  return { value: "...", percent: 0 };
};

// Helper: calculate expected ROAS from paid_media_intelligence_section
// Source: paid_media_intelligence_section.performance_targets.target_roas
const getExpectedROAS = (
  paidMediaData: Record<string, unknown> | null,
  industry: string
): { value: string; percent: number; industry: string } => {
  if (!paidMediaData) return { value: "...", percent: 0, industry: industry || "..." };
  
  const performanceTargets = paidMediaData?.performance_targets as Record<string, unknown> | null;
  const targetRoasRaw = performanceTargets?.target_roas;
  
  if (targetRoasRaw) {
    const roasStr = String(targetRoasRaw).trim();
    // Extract numeric value from "3.0x" or "3.0"
    const match = roasStr.match(/([\d.]+)/);
    if (match) {
      const roasValue = parseFloat(match[1]);
      if (!isNaN(roasValue) && roasValue > 0) {
        // ROAS 3x = 75%, 4x+ = 90%, 2x = 50%, 1x = 25%
        const percent = Math.min(100, Math.round((roasValue / 4) * 100));
        return { 
          value: `${roasValue.toFixed(1)}x`, 
          percent, 
          industry: industry || "..." 
        };
      }
    }
  }
  
  return { value: "...", percent: 0, industry: industry || "..." };
};

// Helper: parse stakeholder string "Role Name (badge text)"
const parseStakeholder = (text: string, index: number): { role: string; influence: string; percent: number } => {
  if (!text || text.trim() === "") {
    return { role: "...", influence: "...", percent: 0 };
  }
  
  const match = text.match(/^(.+?)\s*\(([^)]+)\)/);
  if (!match) {
    return { role: text.trim(), influence: "Stakeholder", percent: Math.max(25, 90 - (index * 15)) };
  }
  
  const role = match[1].trim();
  // Capitalize first letter of influence badge
  const influence = match[2].trim().charAt(0).toUpperCase() + match[2].trim().slice(1);
  // Influence decreasing by position: 90%, 75%, 60%, 45%, 35%, 25%...
  const percent = Math.max(25, 90 - (index * 15));
  
  return { role, influence, percent };
};

// Helper: get decision makers from stakeholders array
const getDecisionMakers = (stakeholders: string[] | null | undefined): Array<{ role: string; influence: string; percent: number }> => {
  if (!stakeholders || stakeholders.length === 0) {
    return [
      { role: "...", influence: "...", percent: 0 },
      { role: "...", influence: "...", percent: 0 },
      { role: "...", influence: "...", percent: 0 }
    ];
  }
  
  return stakeholders.map((s, i) => parseStakeholder(s, i));
};

const MarketingIntelligenceSection = ({ onExploreMarketing }: MarketingIntelligenceSectionProps) => {
  const { report, reportData } = useReportContext();

  // Parse ICP data from reportData (tb_pms_reports.icp_intelligence_section)
  const rawIcpData = parseJsonField<ICPIntelligenceSection | null>(
    reportData?.icp_intelligence_section,
    null
  );

  // Use ICP data directly from database (100% from tb_pms_reports JSONB)
  const icpData = rawIcpData;

  // Get primary persona (first one)
  const primaryPersona = icpData?.primary_personas?.[0] || null;

  // ============================================
  // ICP Display Data (Updated per requirements)
  // ============================================
  
  // Name: Use persona.name from ICP research (e.g., "Sarah Mitchell")
  const icpDisplayName = getValue(
    icpData?.persona?.name ||
    (icpData?.persona as any)?.persona_name ||
    primaryPersona?.persona_name
  );
  // Generate initials from the name (e.g., "SM" from "Sarah Mitchell")
  const initials = getInitials(icpDisplayName);
  
  // Gender: From persona.gender (e.g., "female")
  const personaGender = getValue(
    icpData?.persona?.gender ||
    (primaryPersona as any)?.gender
  );

  // Age Range: From persona.age_range (e.g., "35-45")
  const personaAgeRange = getValue(
    icpData?.persona?.age_range ||
    (primaryPersona as any)?.age_range
  );

  // Persona Summary: From persona.persona_summary
  const personaSummary = getValue(
    icpData?.persona?.persona_summary ||
    (primaryPersona as any)?.persona_summary
  );
  
  // ============================================
  // STATIC AVATAR URL - Pre-generated avatars
  // ============================================
  const getStaticAvatarUrl = (region: string | null | undefined, gender: string | null | undefined): string => {
    // Map region to storage key
    const regionMap: Record<string, string> = {
      us: "us",
      brazil: "brazil",
      europe: "europe",
      asia: "asia"
    };
    const regionKey = regionMap[region?.toLowerCase() || "us"] || "us";
    
    // Map gender/target_audience to storage key
    const genderMap: Record<string, string> = {
      male: "male",
      female: "female",
      any: "any",
      both: "any"
    };
    const genderKey = genderMap[gender?.toLowerCase() || "any"] || "any";
    
    return `https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/icp-avatars/${regionKey}-${genderKey}.png`;
  };
  
  // Use gender from ICP research (persona.gender) for avatar selection
  const avatarUrl = getStaticAvatarUrl(report?.geographic_region, icpData?.persona?.gender);
  
  // Role/Job Title: Use job_title from persona (e.g., "VP of Operations / Director of Business Technology")
  const icpRole = getValue(
    icpData?.persona?.job_title ||
    primaryPersona?.job_title ||
    primaryPersona?.summary?.job_title
  );
  
  // Industry Badge: From wizard industry (e.g., "Healthcare") with fallbacks
  const businessType = getValue(
    report?.industry ||
    (icpData?.persona as unknown as Record<string, Record<string, string>>)?.demographics?.industry ||
    primaryPersona?.summary?.industry_focus?.split(",")[0]?.trim()
  );
  
  // ============================================
  // COMPANY PROFILE DATA (from icp_intelligence_section)
  // ============================================
  
  // Industry: From ICP research demographics.industry with wizard fallback
  const industry = getValue(
    icpData?.demographics?.industry ||
    report?.industry
  );

  // Company Size: From icp_intelligence_section.demographics.company_size
  const companySize = getValue(
    icpData?.demographics?.company_size ||
    primaryPersona?.summary?.company_size
  );

  // Location: From icp_intelligence_section.demographics.location
  const location = getValue(
    icpData?.demographics?.location ||
    report?.geographic_region
  );

  // Budget Range: Full value from summary.budget_range
  const budgetRange = getValue(primaryPersona?.summary?.budget_range);

  // Decision Timeframe: Full text from icp_intelligence_section.budget_timeline.decision_timeline
  const decisionTimeframe = getValue(
    icpData?.budget_timeline?.decision_timeline ||
    primaryPersona?.summary?.decision_timeframe
  );

  // Decision Authority: From icp_intelligence_section.demographics.decision_authority
  const decisionAuthority = getValue(
    icpData?.demographics?.decision_authority
  );

  // Pain Points: From icp_intelligence_section.pain_points (array directly)
  interface PainPointItem {
    pain_point: string;
    urgency_level: string;
    intensity_score?: string;
  }
  const painPointsData = (icpData?.pain_points || []) as PainPointItem[];
  const displayPainPoints = painPointsData.length > 0 
    ? painPointsData.slice(0, 3)
    : [{ pain_point: "...", urgency_level: "medium" }];

  // Get paid_media data for metrics calculation
  const paidMediaData = parseJsonField<Record<string, unknown> | null>(
    reportData?.paid_media_intelligence_section,
    null
  );
  
  // Get competitor count from competitive_analysis_section
  // Competitors are stored as object with keys: competitor_1, competitor_2, etc.
  const competitiveData = parseJsonField<{ competitors?: Record<string, unknown> } | null>(
    reportData?.competitive_analysis_section,
    null
  );
  // Count competitor keys (competitor_1, competitor_2, etc.) from the object
  const competitorCount = competitiveData?.competitors 
    ? Object.keys(competitiveData.competitors).filter(k => k.startsWith('competitor_')).length 
    : 0;
  
  // Calculate metrics using real data
  const competitivePosition = getCompetitivePosition(paidMediaData, competitorCount);
  const expectedROAS = getExpectedROAS(paidMediaData, report?.industry || "...");
  
  // Get stakeholders array from icp_intelligence_section.budget_timeline.stakeholders
  const stakeholdersArray = icpData?.budget_timeline?.stakeholders as string[] | undefined;
  const decisionMakers = getDecisionMakers(stakeholdersArray);
  
  // Get typical_budget from icp_intelligence_section for Min Monthly Budget
  const typicalBudget = icpData?.budget_timeline?.typical_budget as string | undefined;

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
      value: extractMinMonthlyBudget(typicalBudget), 
      label: "Min Monthly Budget",
      sublabel: "Monthly ICP Spend",
      tooltip: "Minimum monthly budget your Ideal Customer Profile (ICP) allocates for SaaS solutions like yours. Extracted from ICP research data.",
      percent: extractMinMonthlyBudget(typicalBudget) !== "..." ? 75 : 0
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

  // Company profile demographics - 5 items with new order
  const demographics = [
    { icon: Building2, label: "Industry", value: industry },
    { icon: Users, label: "Company Size", value: companySize },
    { icon: MapPin, label: "Location", value: location },
    { icon: DollarSign, label: "Budget Range", value: budgetRange },
    { icon: Calendar, label: "Decision Timeframe", value: decisionTimeframe }
  ];

  // Decision maker icons - cycle through for any number of stakeholders
  const decisionMakerIcons = [Crown, User, Shield, CreditCard, Building2, Target, Users, Megaphone];

  return (
    <section id="marketing-intelligence" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Megaphone className="h-5 w-5 text-accent" />
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
                  <div className="flex items-center gap-1.5">
                    <Badge 
                      variant="outline" 
                      className="bg-amber-500/10 border-amber-500/20 text-amber-500 text-xs"
                    >
                      {metric.label}
                    </Badge>
                    <InfoTooltip size="sm">{metric.tooltip}</InfoTooltip>
                  </div>
                </div>

                {/* Value */}
                <p className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent mb-1">
                  {metric.value}
                </p>

                {/* Sublabel */}
                <p className="text-sm text-muted-foreground mb-4">{metric.sublabel}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Score</span>
                    <span className="font-medium text-foreground">{metric.percent}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${metric.percent}%` }}
                    />
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
              <InfoTooltip side="right" size="sm">
                A detailed profile of your ideal customer, including demographics, location, decision-making timeline, and the key features they value most.
              </InfoTooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar and Name */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-background">
                <AvatarImage 
                  src={avatarUrl} 
                  alt={icpDisplayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground">{icpDisplayName}</h3>
                <p className="text-sm text-muted-foreground">{icpRole}</p>
                {/* Gender + Age Range + Industry badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {personaGender !== "..." && (
                    <Badge variant="outline" className="bg-muted/10 border-border/30 text-foreground text-xs capitalize">
                      {personaGender}
                    </Badge>
                  )}
                  {personaAgeRange !== "..." && (
                    <Badge variant="outline" className="bg-muted/10 border-border/30 text-foreground text-xs">
                      {personaAgeRange} years
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-500 text-xs">
                    {businessType}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Persona Summary */}
            {personaSummary !== "..." && (
              <div className="p-3 rounded-xl bg-muted/10 border border-border/20">
                <p className="text-sm text-muted-foreground italic">"{personaSummary}"</p>
              </div>
            )}

            {/* Decision Authority */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Decision Authority</p>
              <div className="p-3 rounded-xl bg-gradient-to-b from-card/80 to-card/40 border border-accent/10">
                <span className="text-sm text-foreground">{decisionAuthority}</span>
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Pain Points</p>
              <div className="space-y-2">
                {displayPainPoints.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between text-sm p-3 rounded-xl bg-gradient-to-b from-card/80 to-card/40 border border-accent/10 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-start gap-2 flex-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span className="text-foreground">{item.pain_point}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="ml-2 shrink-0 text-xs bg-amber-500/10 border-amber-500/30 text-amber-400 capitalize"
                    >
                      {item.urgency_level}
                    </Badge>
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
              <InfoTooltip side="right" size="sm">
                The typical company characteristics of your ICP, including size, budget capacity, industry focus, and preferred pricing model.
              </InfoTooltip>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {decisionMakers.map((dm, i) => {
              const IconComponent = decisionMakerIcons[i % decisionMakerIcons.length];
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

      {/* HIDDEN v1.0 - CTA Banner will return with Marketing tab
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
      */}
    </section>
  );
};

export default MarketingIntelligenceSection;
