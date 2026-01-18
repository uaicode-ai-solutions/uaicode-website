// ============================================
// Marketing Intelligence Section
// Redesigned to show most convincing data points
// Uses real data from icp_intelligence_section
// ============================================

import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Crown,
  AlertTriangle,
  Clock,
  Zap,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { ICPIntelligenceSection } from "@/types/report";

interface MarketingIntelligenceSectionProps {
  onExploreMarketing: () => void;
}

// Helper: get value or "..."
const getValue = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return "...";
  return String(value).trim() || "...";
};

// Helper: extract unique pain points (top 3)
const getTopPainPoints = (icpData: ICPIntelligenceSection | null): Array<{
  name: string;
  intensity: number;
  urgency: string;
}> => {
  const painPoints = icpData?.aggregated_insights?.top_pain_points_all;
  if (!painPoints || painPoints.length === 0) {
    return [
      { name: "...", intensity: 0, urgency: "..." },
      { name: "...", intensity: 0, urgency: "..." },
      { name: "...", intensity: 0, urgency: "..." }
    ];
  }

  // Deduplicate by name and get top 3
  const seen = new Set<string>();
  const unique: Array<{ name: string; intensity: number; urgency: string }> = [];
  
  for (const p of painPoints) {
    const name = p.pain_point || "Unknown";
    if (!seen.has(name.toLowerCase()) && unique.length < 3) {
      seen.add(name.toLowerCase());
      const intensityScore = parseFloat(p.intensity_score?.replace("/10", "") || "0");
      unique.push({
        name,
        intensity: isNaN(intensityScore) ? 0 : intensityScore,
        urgency: p.urgency_level || "MEDIUM"
      });
    }
  }

  // Fill with placeholders if needed
  while (unique.length < 3) {
    unique.push({ name: "...", intensity: 0, urgency: "..." });
  }

  return unique;
};

// Helper: extract competitors info
// Note: competitive_threats can be string[] or array of objects depending on data
const getCompetitorInfo = (icpData: ICPIntelligenceSection | null): {
  count: number;
  priceRange: string;
  names: string[];
} => {
  const threats = icpData?.aggregated_insights?.competitive_threats;
  if (!threats || threats.length === 0) {
    return { count: 0, priceRange: "...", names: [] };
  }

  const prices: number[] = [];
  const names: string[] = [];

  for (const t of threats) {
    // Handle both string and object formats
    if (typeof t === 'string') {
      names.push(t);
    } else if (typeof t === 'object' && t !== null) {
      const threatObj = t as { name?: string; pricing?: string };
      if (threatObj.name) names.push(threatObj.name);
      if (threatObj.pricing) {
        const match = threatObj.pricing.match(/\$?(\d+)/);
        if (match) prices.push(parseInt(match[1], 10));
      }
    }
  }

  let priceRange = "...";
  if (prices.length >= 2) {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    priceRange = `$${min} - $${max}/month`;
  } else if (prices.length === 1) {
    priceRange = `$${prices[0]}/month`;
  }

  return { count: threats.length, priceRange, names: names.slice(0, 6) };
};

// Helper: calculate average pain intensity
const getAvgPainIntensity = (icpData: ICPIntelligenceSection | null): number => {
  const painPoints = icpData?.aggregated_insights?.top_pain_points_all;
  if (!painPoints || painPoints.length === 0) return 0;

  const scores = painPoints.map(p => {
    const score = parseFloat(p.intensity_score?.replace("/10", "") || "0");
    return isNaN(score) ? 0 : score;
  });

  return scores.length > 0 
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0;
};

const MarketingIntelligenceSection = ({ onExploreMarketing }: MarketingIntelligenceSectionProps) => {
  const { reportData } = useReportContext();

  // Parse ICP data from reportData (tb_pms_reports.icp_intelligence_section)
  const icpData = parseJsonField<ICPIntelligenceSection | null>(
    reportData?.icp_intelligence_section,
    null
  );

  // Extract data points
  const aggregatedInsights = icpData?.aggregated_insights;
  const marketInsights = icpData?.market_insights;
  
  // Cast to access extended properties that may exist in actual data
  const extendedInsights = aggregatedInsights as typeof aggregatedInsights & {
    starter_personas?: number;
    growth_personas?: number;
    enterprise_personas?: number;
  };
  
  const totalPersonas = aggregatedInsights?.total_personas_identified || 0;
  const starterPersonas = extendedInsights?.starter_personas || 0;
  const growthPersonas = extendedInsights?.growth_personas || 0;
  const enterprisePersonas = extendedInsights?.enterprise_personas || 0;
  
  const highestValueSegment = marketInsights?.highest_value_segment;
  const topPainPoints = getTopPainPoints(icpData);
  const competitors = getCompetitorInfo(icpData);
  const avgPainIntensity = getAvgPainIntensity(icpData);
  const decisionTimeframe = aggregatedInsights?.decision_timeframes?.[0] || "...";

  // Persona distribution for mini chart
  const personaDistribution = [
    { label: "Starter", count: starterPersonas, color: "from-emerald-500 to-emerald-400" },
    { label: "Growth", count: growthPersonas, color: "from-blue-500 to-blue-400" },
    { label: "Enterprise", count: enterprisePersonas, color: "from-purple-500 to-purple-400" }
  ];
  const maxPersonaCount = Math.max(starterPersonas, growthPersonas, enterprisePersonas, 1);

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

      {/* Hero Card: Personas Identified */}
      <Card className="group relative bg-card/50 border-border/30 overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Big Number */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">Customer Personas</span>
              </div>
              <p className="text-6xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                {totalPersonas || "..."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">identified through research</p>
            </div>

            {/* Persona Distribution Chart */}
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-4">Distribution by Segment</p>
              <div className="space-y-3">
                {personaDistribution.map((segment, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-20">{segment.label}</span>
                    <div className="flex-1 h-6 bg-muted/30 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${segment.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${(segment.count / maxPersonaCount) * 100}%`, minWidth: segment.count > 0 ? '40px' : '0' }}
                      >
                        {segment.count > 0 && (
                          <span className="text-xs font-semibold text-white">{segment.count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Opportunity Card */}
      {highestValueSegment && (
        <Card className="group relative bg-gradient-to-br from-amber-500/5 via-card/50 to-card/50 border-amber-500/30 overflow-hidden hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/15 to-transparent rounded-bl-full" />
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-400/10 shrink-0">
                <Crown className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <Badge className="mb-2 bg-amber-500/10 border-amber-500/20 text-amber-500 text-xs">
                  Best Opportunity
                </Badge>
                <h3 className="text-xl font-bold text-foreground mb-2">{highestValueSegment}</h3>
                <p className="text-sm text-muted-foreground">
                  This segment shows the highest potential for your product based on pain intensity, budget capacity, and market growth.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Pain Points */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="text-lg font-semibold text-foreground">Top Market Pain Points</h3>
          <InfoTooltip size="sm">Key problems your target customers are actively trying to solve.</InfoTooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPainPoints.map((pain, index) => (
            <Card 
              key={index} 
              className="group relative bg-card/50 border-border/30 overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full" />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-500 text-xs">
                    #{index + 1}
                  </Badge>
                  {pain.urgency !== "..." && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        pain.urgency === "HIGH" 
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : pain.urgency === "MEDIUM"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-muted/30 border-border/50 text-muted-foreground"
                      }`}
                    >
                      {pain.urgency}
                    </Badge>
                  )}
                </div>
                <h4 className="font-semibold text-foreground mb-3 line-clamp-2">{pain.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Intensity</span>
                    <span className="font-medium text-foreground">{pain.intensity > 0 ? `${pain.intensity}/10` : "..."}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${(pain.intensity / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Competitive Landscape */}
      <Card className="bg-card/50 border-border/30 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Competitive Landscape</CardTitle>
            <InfoTooltip side="right" size="sm">
              Direct competitors identified in your market space.
            </InfoTooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Competitors Identified</span>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                {competitors.count || "..."}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Price Range</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {competitors.priceRange}
              </p>
            </div>
          </div>
          
          {competitors.names.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {competitors.names.map((name, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="bg-muted/30 border-border/50 text-foreground text-xs px-3 py-1"
                >
                  {name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Validation Mini Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-amber-500/15 to-amber-400/5">
              <Users className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <span className="text-xs text-muted-foreground">Customer Types</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalPersonas || "..."} Personas</p>
        </div>
        
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-amber-500/15 to-amber-400/5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <span className="text-xs text-muted-foreground">Avg Pain Intensity</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {avgPainIntensity > 0 ? `${avgPainIntensity}/10` : "..."}
          </p>
        </div>
        
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-amber-500/15 to-amber-400/5">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <span className="text-xs text-muted-foreground">Decision Time</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{getValue(decisionTimeframe)}</p>
        </div>
      </div>

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
