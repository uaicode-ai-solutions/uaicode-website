import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle, Star, Zap, Crown, TrendingUp } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { PriceIntelligenceSection } from "@/types/report";
import { CompetitiveAnalysisSectionData, extractAveragePrice } from "@/lib/competitiveAnalysisUtils";

const tierIcons: Record<string, React.ElementType> = {
  "Starter": Zap,
  "Professional": Star,
  "Enterprise": Crown,
};

const getBarColor = (position: string) => {
  switch (position) {
    case "Premium": return "hsl(var(--accent))";
    case "Mid-market": return "hsl(32, 85%, 55%)";
    case "Budget": return "hsl(38, 80%, 60%)";
    default: return "hsl(var(--accent))";
  }
};

// Helper: Determine price position based on value vs average
const getPricePosition = (price: number, avgPrice: number): string => {
  if (price > avgPrice * 1.2) return "Premium";
  if (price < avgPrice * 0.8) return "Budget";
  return "Mid-market";
};

// Helper: Capitalize first letter
const capitalize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const PricingCards = () => {
  const { reportData } = useReportContext();
  const { pricingDiagnosis, pricingActionPlan } = competitorAnalysisData;

  // Parse price intelligence from database (tb_pms_reports.price_intelligence_section)
  const priceData = parseJsonField<PriceIntelligenceSection | null>(
    reportData?.price_intelligence_section,
    null
  );

  // Parse competitive analysis for price map chart
  const competitiveData = parseJsonField<CompetitiveAnalysisSectionData | null>(
    reportData?.competitive_analysis_section,
    null
  );

  // Check if we have real data from n8n
  const hasRealData = priceData?.recommended_tiers && priceData.recommended_tiers.length > 0;

  // ===== TRANSFORM TIERS =====
  const tiers = hasRealData
    ? priceData.recommended_tiers.map(tier => ({
        name: tier.name,
        price: `$${tier.price_monthly}`,
        features: tier.features,
        targetCustomer: tier.target_segment,
        expectedConversion: `${tier.expected_distribution_percent}%`,
        recommended: tier.recommended,
      }))
    : pricingActionPlan.tiers;

  // ===== RECOMMENDED MODEL =====
  const recommendedModel = hasRealData
    ? capitalize(priceData.recommended_model)
    : pricingActionPlan.recommendedModel;

  // ===== PRICE MAP CHART (from competitors) =====
  const avgPrice = priceData?.market_overview?.market_average_price || 45;
  
  const priceChartData = competitiveData?.competitors
    ? Object.values(competitiveData.competitors)
        .slice(0, 6)
        .map(comp => ({
          name: (comp.company_name || "Unknown").split(" ")[0],
          price: extractAveragePrice(comp.saas_app_base_price),
          position: getPricePosition(
            extractAveragePrice(comp.saas_app_base_price),
            avgPrice
          ),
        }))
    : pricingDiagnosis.priceMap.map(comp => ({
        name: comp.competitor.split(" ")[0],
        price: parseInt(comp.price.replace(/[^0-9]/g, "")) || 0,
        position: comp.position,
      }));

  // ===== PRICING GAPS (from market gaps) =====
  const gaps = competitiveData?.market_gaps_identified
    ? competitiveData.market_gaps_identified.slice(0, 3).map((gap, idx) => ({
        range: gap,
        priority: idx === 0 ? "high" : idx === 1 ? "medium" : "low",
      }))
    : pricingDiagnosis.gaps;

  // ===== ELASTICITY =====
  const elasticity = hasRealData && priceData.market_overview?.price_elasticity
    ? {
        assessment: capitalize(priceData.market_overview.price_elasticity.sensitivity),
        insight: `Sweet spot at $${priceData.market_overview.price_elasticity.sweet_spot}/mo. ` +
          `Users tolerate up to ${priceData.market_overview.price_elasticity.increase_tolerance}% increases. ` +
          `Value drivers: ${priceData.market_overview.price_elasticity.value_drivers?.slice(0, 2).join(", ") || "N/A"}.`,
      }
    : pricingDiagnosis.elasticity;

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <DollarSign className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Pricing Intelligence</h2>
            <InfoTooltip size="sm">
              Competitive pricing analysis and recommended strategy.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Pricing recommendations and competitive positioning</p>
        </div>
      </div>

      {/* 2-Column Layout - Balanced */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Recommended Pricing - Compact */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Recommended Pricing</h3>
              <Badge className="bg-accent text-accent-foreground text-xs">{recommendedModel}</Badge>
            </div>
            <div className="space-y-3">
              {tiers.map((tier, idx) => {
                const TierIcon = tierIcons[tier.name] || Star;
                return (
                  <div 
                    key={idx} 
                    className={`relative p-3 rounded-lg border ${
                      tier.recommended 
                        ? "bg-accent/10 border-accent/40" 
                        : "bg-muted/10 border-border/20"
                    }`}
                  >
                    {tier.recommended && (
                      <Badge className="absolute -top-2 right-3 bg-accent text-accent-foreground text-[9px]">
                        Best Value
                      </Badge>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tier.recommended ? "bg-accent/20" : "bg-muted/20"}`}>
                        <TierIcon className={`h-5 w-5 ${tier.recommended ? "text-accent" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-foreground">{tier.name}</h4>
                          <div className="text-right">
                            <p className="text-lg font-bold text-accent">{tier.price}</p>
                            <p className="text-[9px] text-muted-foreground">/month • {tier.expectedConversion} conv</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {tier.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-1 text-[9px]">
                              <CheckCircle className="h-2 w-2 text-accent flex-shrink-0" />
                              <span className="text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Market Position & Opportunities - Combined */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            {/* Price Map Chart */}
            <div className="mb-4 pb-4 border-b border-border/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground text-sm">Competitive Price Map</h3>
                </div>
              </div>
              
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceChartData} layout="vertical" margin={{ right: 35, left: 0 }}>
                    <XAxis 
                      type="number" 
                      tickFormatter={(v) => `$${v}`} 
                      tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={65} 
                      tick={{ fontSize: 9, fill: 'hsl(var(--foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                      {priceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.position)} />
                      ))}
                      <LabelList 
                        dataKey="price" 
                        position="right" 
                        formatter={(v: number) => `$${v}`} 
                        style={{ fontSize: 9, fill: 'hsl(var(--accent))', fontWeight: 600 }} 
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-3 mt-2">
                {[
                  { label: "Premium", color: "bg-accent" },
                  { label: "Mid-market", color: "bg-[hsl(32,85%,55%)]" },
                  { label: "Budget", color: "bg-[hsl(38,80%,60%)]" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[9px] text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Opportunities */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Opportunities
              </h3>
              <div className="space-y-2">
                {gaps.map((gap, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-border/20">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[9px] ${
                        gap.priority === "high" ? "bg-accent/20 text-accent" : 
                        gap.priority === "medium" ? "bg-yellow-500/20 text-yellow-500" : 
                        "bg-green-500/20 text-green-500"
                      }`}>
                        {gap.priority}
                      </Badge>
                      <span className="text-xs font-medium text-foreground">{gap.range}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Elasticity - Inline */}
              <div className="mt-3 p-2 rounded-lg bg-muted/10 border border-border/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Price Elasticity</span>
                  <Badge variant="outline" className="text-[9px] border-accent/20 text-accent">
                    {elasticity.assessment}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{elasticity.insight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PricingCards;
