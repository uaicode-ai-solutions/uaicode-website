import { Target, TrendingUp, CheckCircle2, Globe, Crosshair, Lightbulb, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
// Geographic region labels
const regionLabels: Record<string, string> = {
  us: "United States",
  brazil: "Brazil",
  europe: "Europe",
  asia: "Asia Pacific",
};

// Industry ID to label mapping
const industryLabels: Record<string, string> = {
  healthcare: "Healthcare",
  education: "Education",
  finance: "Finance",
  realestate: "Real Estate",
  retail: "Retail",
  technology: "Technology",
  marketing: "Marketing",
  other: "",
};

// Extract maximum value from ranges like "$2.8B - $4.2B" → "$4.2B"
const extractMaxValue = (value: string): string => {
  if (!value || value === "...") return value;
  
  // Normalize text suffixes first
  let normalized = value
    .replace(/\s*billion/gi, "B")
    .replace(/\s*million/gi, "M")
    .replace(/\s*trillion/gi, "T")
    .replace(/\s*thousand/gi, "K");
  
  // Check for range pattern (e.g., "$2.8B - $4.2B", "2.8B-4.2B", "$2.8B – $4.2B")
  const rangeMatch = normalized.match(/\$?([\d.,]+)\s*([BMTK])?\s*[-–]\s*\$?([\d.,]+)\s*([BMTK])?/i);
  
  if (rangeMatch) {
    const maxNumber = rangeMatch[3];
    // Use second suffix if present, otherwise first
    const suffix = rangeMatch[4] || rangeMatch[2] || "";
    return `$${maxNumber}${suffix}`;
  }
  
  return value;
};

// Format market values: "$713.36 billion" → "$713.4B" (1 decimal place)
const formatMarketValue = (value: string): string => {
  if (!value || value === "..." || value === "$...") return "...";
  
  // First, replace text suffixes
  let formatted = value
    .replace(/\s*billion/gi, "B")
    .replace(/\s*million/gi, "M")
    .replace(/\s*trillion/gi, "T")
    .replace(/\s*thousand/gi, "K")
    .trim();
  
  // Round numeric values to 1 decimal place
  formatted = formatted.replace(/(\$?)([\d,]+)\.(\d{2,})/g, (match, dollar, integer, decimals) => {
    const num = parseFloat(`${integer.replace(/,/g, '')}.${decimals}`);
    return `${dollar}${num.toFixed(1)}`;
  });
  
  return formatted;
};

// Format growth rate: "19.8% annually (2026-2035)" → "19.8% 2026-2035"
const formatGrowthRate = (value: string): string => {
  if (!value || value === "..." || value === "...%") return "...";
  const percentMatch = value.match(/([\d.]+)%/);
  const yearRangeMatch = value.match(/(\d{4}[-–]\d{4})/);
  if (percentMatch) {
    const percent = percentMatch[1];
    const yearRange = yearRangeMatch ? ` ${yearRangeMatch[1]}` : "";
    return `${percent}%${yearRange}`;
  }
  return value;
};

// Remove citation references and format values in text
const cleanHeadline = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/\[\d+\]/g, "")      // Remove [1], [2], [3], etc.
    .replace(/\(\d+\)/g, "")      // Remove (1), (2), (3), etc.
    .replace(/\s*billion/gi, "B")
    .replace(/\s*million/gi, "M")
    .replace(/\s*trillion/gi, "T")
    .replace(/\s*thousand/gi, "K")
    .replace(/\s{2,}/g, " ")      // Collapse multiple spaces
    .trim();
};

// Helper to format value with extraction
const formatTamSamSom = (value: unknown): string => {
  if (typeof value !== 'string') return "...";
  return formatMarketValue(extractMaxValue(value));
};

const MarketOpportunitySection = () => {
  const { report, reportData } = useReportContext();

  // Parse opportunity_section JSONB with safe casting
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  
  // Get geographic region from wizard or fallback to sam_geographic_focus
  const rawOpportunityData = opportunityData as unknown as Record<string, unknown> | null;
  const geographicRegion = report?.geographic_region || 
    (rawOpportunityData?.sam_geographic_focus as string) || "";

  // Direct value extraction with "..." fallback - no smart fallback calls
  const tam = opportunityData?.tam_value ? formatTamSamSom(opportunityData.tam_value) : "...";
  const sam = opportunityData?.sam_value ? formatTamSamSom(opportunityData.sam_value) : "...";
  const som = opportunityData?.som_value ? formatTamSamSom(opportunityData.som_value) : "...";
  const growthRate = opportunityData?.market_growth_rate ? formatGrowthRate(String(opportunityData.market_growth_rate)) : "...";
  const launchReasoning = opportunityData?.launch_reasoning ? cleanHeadline(String(opportunityData.launch_reasoning)) : null;
  const opportunityJustification = opportunityData?.opportunity_justification ? cleanHeadline(String(opportunityData.opportunity_justification)) : null;

  // Build fallback headline from wizard industry field
  const industryLabel =
    report?.industry === "other"
      ? report?.industry_other || "..."
      : industryLabels[report?.industry || ""] || "...";

  // Use launch_reasoning with citations removed and values formatted
  const headline = launchReasoning || 
    `There is clear room for a new player focused on ${industryLabel} businesses.`;

  const marketLevels = [
    {
      key: "tam",
      label: "TAM",
      fullName: "Total Addressable Market",
      value: tam,
      icon: Globe,
      description:
        "The entire global market demand for your product/service category. This represents the total revenue opportunity if you achieved 100% market share.",
    },
    {
      key: "sam",
      label: "SAM",
      fullName: "Serviceable Available Market",
      value: sam,
      icon: Target,
      description:
        "The segment of TAM you can realistically serve based on your geography, capabilities, and business model constraints.",
    },
    {
      key: "som",
      label: "SOM",
      fullName: "Serviceable Obtainable Market",
      value: som,
      icon: Crosshair,
      description:
        "The portion of SAM you can realistically capture in the first 3 years. This is your immediate addressable opportunity.",
    },
  ];

  return (
    <section id="market-opportunity" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">The Opportunity</h2>
              <InfoTooltip side="right" size="sm">
                Market analysis including TAM, SAM, SOM calculations and growth potential.
              </InfoTooltip>
            </div>
            <p className="text-sm text-muted-foreground">Market size and growth potential</p>
          </div>
        </div>
        
        {/* Geographic Region Badge */}
        {geographicRegion && (
          <Badge variant="outline" className="flex items-center gap-1.5 bg-accent/10 border-accent/30 text-accent px-3 py-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-sm font-medium">
              {regionLabels[geographicRegion] || geographicRegion}
            </span>
          </Badge>
        )}
      </div>

      {/* Two Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Concentric Circles Visualization */}
        <Card className="bg-card/50 border-border/30 overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-6">Market Size</h3>

            {/* Concentric Circles */}
            <div className="relative flex items-center justify-center py-4">
              {/* TAM - Outer Circle */}
              <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.08)] hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] transition-all duration-500 group">
                {/* TAM Label - Top */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <span className="text-xs font-medium text-accent/70 uppercase tracking-wider">TAM</span>
                  <span className="text-xl font-bold text-foreground">{tam}</span>
                </div>

                {/* SAM - Middle Circle */}
                <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-accent/10 to-accent/20 border border-accent/30 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] transition-all duration-500">
                  {/* SAM Label - Top */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-xs font-medium text-accent/80 uppercase tracking-wider">SAM</span>
                    <span className="text-xl font-bold text-foreground">{sam}</span>
                  </div>

                  {/* SOM - Inner Circle */}
                  <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-accent/20 to-accent/35 border border-accent/50 flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.15)] hover:shadow-[0_0_35px_rgba(249,115,22,0.25)] transition-all duration-500">
                    {/* SOM Label - Centered */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">SOM</span>
                      <span className="text-2xl font-bold text-foreground">{som}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Growth Legend */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="font-semibold text-accent">{growthRate}</span>
              <span className="text-muted-foreground">Year-over-Year market growth rate</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Understanding Market Size */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-5">Understanding Market Size</h3>

            <div className="space-y-4">
              {marketLevels.map((level, index) => {
                const IconComponent = level.icon;
                const intensities = [
                  { bg: "bg-accent/5", border: "border-accent/30", iconBg: "bg-accent/10" },
                  { bg: "bg-accent/10", border: "border-accent/40", iconBg: "bg-accent/15" },
                  { bg: "bg-accent/15", border: "border-accent/50", iconBg: "bg-accent/20" },
                ];
                const intensity = intensities[index];

                return (
                  <div
                    key={level.key}
                    className={`p-4 rounded-xl ${intensity.bg} border-l-4 ${intensity.border} transition-all duration-300 hover:translate-x-1`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${intensity.iconBg} flex-shrink-0`}>
                        <IconComponent className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{level.label}</span>
                          <span className="text-sm text-muted-foreground">-</span>
                          <span className="text-sm text-muted-foreground">{level.fullName}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Reasoning - Full Width */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-accent/20 flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-foreground">Launch Reasoning</h4>
              <InfoTooltip side="top" size="sm">
                The strategic rationale for launching this product in the current market.
              </InfoTooltip>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{headline}</p>
          </div>
        </div>
      </div>

      {/* Opportunity Justification Banner */}
      {opportunityJustification && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-card/80 via-card/60 to-card/80 border border-border/50 hover:border-accent/30 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-accent/15 flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-foreground">Why This Opportunity?</h4>
                <InfoTooltip side="top" size="sm">
                  The strategic justification for pursuing this market opportunity.
                </InfoTooltip>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {opportunityJustification}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Need to import Badge
import { Badge } from "@/components/ui/badge";

export default MarketOpportunitySection;
