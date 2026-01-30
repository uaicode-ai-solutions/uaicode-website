import { Swords, Globe, Tag, Lightbulb, CheckCircle2, AlertTriangle, ThumbsUp, ThumbsDown, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { 
  CompetitiveAnalysisSectionData, 
  getCompetitorsForUI,
} from "@/lib/competitiveAnalysisUtils";
import { PricingBadge } from "@/components/planningmysaas/dashboard/ui/PricingBadge";
import { Badge } from "@/components/ui/badge";

// Config for competitor type badges
const typeConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  direct: { color: "text-amber-500", bgColor: "bg-amber-500/20", label: "Direct" },
  indirect: { color: "text-amber-400", bgColor: "bg-amber-400/10", label: "Indirect" },
};

// Config for priority score badges
const priorityConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  high: { color: "text-amber-500", bgColor: "bg-amber-500/20", label: "High" },
  medium: { color: "text-amber-400", bgColor: "bg-amber-400/15", label: "Medium" },
  low: { color: "text-amber-300", bgColor: "bg-amber-300/10", label: "Low" },
};

const CompetitorsDifferentiationSection = () => {
  const { reportData, isLoading } = useReportContext();
  
  // Parse competitive analysis section from report data (100% from database)
  const competitiveData = parseJsonField<CompetitiveAnalysisSectionData>(
    reportData?.competitive_analysis_section,
    null
  );
  
  // Get competitors transformed for UI
  const competitors = getCompetitorsForUI(competitiveData);
  
  // Get market gaps and common features
  const marketGaps = competitiveData?.market_gaps_identified || [];
  const commonFeatures = competitiveData?.common_features || [];
  const averagePricingRange = competitiveData?.average_pricing_range || "";
  
  // Calculate max price for chart
  const maxPrice = competitors.length > 0 
    ? Math.max(...competitors.map(c => c.price || 0), 1) 
    : 100;

  // Early return if no data
  if (!competitiveData || competitors.length === 0) {
    return (
      <section id="competitors-differentiation" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Swords className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Competitive Analysis</h2>
            <p className="text-sm text-muted-foreground">Competitor data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="competitors-differentiation" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Swords className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Competitive Analysis</h2>
            <InfoTooltip side="right" size="sm">
              Analysis of your main competitors and market opportunities.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Know your competition</p>
        </div>
      </div>

      {/* Competitors Grid - Expanded Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.slice(0, 6).map((competitor, index) => {
          const typeStyle = typeConfig[competitor.competitorType] || typeConfig.direct;
          const priorityStyle = priorityConfig[competitor.priorityScore] || priorityConfig.medium;
          
          return (
            <Card key={index} className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors flex flex-col">
              <CardContent className="p-4 flex flex-col flex-1">
                {/* Main Content - grows to fill space */}
                <div className="flex-1 space-y-3">
                  {/* Header: Name + Badges */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-amber-500">{index + 1}</span>
                    </div>
                    <span className="font-semibold text-gradient-gold text-sm truncate">{competitor.name}</span>
                    {competitor.website && (
                      <a 
                        href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <Globe className="w-4 h-4 text-gradient-gold hover:text-amber-300 cursor-pointer transition-colors" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeStyle.bgColor} ${typeStyle.color} border-0`}>
                      {typeStyle.label}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityStyle.bgColor} ${priorityStyle.color} border-0`}>
                      {priorityStyle.label}
                    </Badge>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-xs text-muted-foreground">
                  {competitor.description}
                </p>
                
                {/* Price Range */}
                {competitor.priceRange && (
                  <div className="flex items-center gap-2 text-xs">
                    <Tag className="w-3 h-3 text-accent" />
                    <span className="text-muted-foreground">Price Range:</span>
                    <span className="font-medium text-gradient-gold">{competitor.priceRange}</span>
                  </div>
                )}
                
                {/* Features */}
                {competitor.features.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.features.map((feature, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
                  {/* Strengths */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-gradient-gold flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> Strengths
                    </p>
                    {competitor.strengths.map((strength, i) => (
                      <p key={i} className="text-[10px] text-gradient-gold">
                        <span className="text-gradient-gold">•</span> {strength}
                      </p>
                    ))}
                  </div>
                  
                  {/* Weaknesses */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-gradient-gold flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3" /> Weaknesses
                    </p>
                    {competitor.weaknesses.map((weakness, i) => (
                      <p key={i} className="text-[10px] text-gradient-gold">
                        <span className="text-gradient-gold">•</span> {weakness}
                      </p>
                    ))}
                  </div>
                  </div>
                </div>
                
                {/* Footer: Price + Model - always at bottom */}
                <div className="flex justify-between items-end pt-2 border-t border-border/30 mt-3">
                  <div className="flex flex-col">
                    <div>
                      <span className="text-xl font-bold text-gradient-gold">
                        ${competitor.price}
                      </span>
                      <span className="text-xs text-muted-foreground">/month</span>
                      <span className="text-gradient-gold text-sm ml-0.5">*</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">*today's price</span>
                  </div>
                  <PricingBadge modelId={competitor.priceModel} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Row: Price Positioning + Market Gaps/Common Features */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Price Positioning Chart */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Price Positioning</h3>
              <InfoTooltip size="sm">
                Comparison of competitor pricing in your market segment.
              </InfoTooltip>
            </div>
            <div className="space-y-3">
              {/* Price bars with numbers */}
              {competitors.slice(0, 6).map((competitor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-500">{index + 1}</span>
                  </div>
                  <div className="flex-1 h-3 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${maxPrice > 0 ? (competitor.price / maxPrice) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-20 text-right">
                    {competitor.price === 0 ? "Free" : `$${competitor.price}/mo`}
                  </span>
                </div>
              ))}
              
              {/* Legend below chart */}
              <div className="pt-3 mt-3 border-t border-border/30">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {competitors.slice(0, 6).map((competitor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-500 w-5">{index + 1}.</span>
                      <span className="text-sm text-muted-foreground truncate">{competitor.name}</span>
                    </div>
                  ))}
                </div>
                
                {/* Average pricing range */}
                {averagePricingRange && (
                  <div className="mt-3 pt-3 border-t border-border/30 text-center">
                    <span className="text-sm text-muted-foreground italic">
                      Market average: <span className="font-medium text-foreground">{averagePricingRange}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Gaps & Common Features */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 space-y-4">
            {/* Market Gaps */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-foreground text-sm">Market Gaps (Opportunities)</h3>
                <InfoTooltip size="sm">
                  Unmet needs in the market that represent opportunities for differentiation.
                </InfoTooltip>
              </div>
              {marketGaps.length > 0 ? (
                <div className="space-y-2">
                  {marketGaps.map((gap, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-foreground">{gap}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No market gaps identified</p>
              )}
            </div>
            
            {/* Common Features */}
            <div className="pt-3 border-t border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">Common Features in Market</h3>
                <InfoTooltip size="sm">
                  Features that are standard across competitors - table stakes.
                </InfoTooltip>
              </div>
              {commonFeatures.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {commonFeatures.map((feature, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No common features identified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompetitorsDifferentiationSection;
