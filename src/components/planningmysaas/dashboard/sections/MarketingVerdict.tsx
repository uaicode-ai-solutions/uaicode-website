import { TrendingUp, Target, Shield, Lightbulb, CheckCircle2, Rocket, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { OpportunitySection, HeroScoreSection } from "@/types/report";

const MarketingVerdict = () => {
  const { reportData } = useReportContext();
  
  // Get data from database
  const opportunityData = parseJsonField<OpportunitySection | null>(
    reportData?.opportunity_section,
    null
  );
  
  const heroScoreData = parseJsonField<HeroScoreSection | null>(
    reportData?.hero_score_section,
    null
  );
  
  const competitiveData = parseJsonField<{ market_gaps_identified?: string[] } | null>(
    reportData?.competitive_analysis_section,
    null
  );

  // Extract market score from hero section
  const marketScore = heroScoreData?.score || 0;
  
  // Determine risk level based on score
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: "Low", color: "text-green-400" };
    if (score >= 60) return { label: "Medium", color: "text-yellow-400" };
    return { label: "High", color: "text-red-400" };
  };
  const riskLevel = getRiskLevel(marketScore);

  // Get recommendation based on score
  const getRecommendation = (score: number) => {
    if (score >= 80) return "Proceed with Confidence";
    if (score >= 60) return "Proceed with Differentiated Strategy";
    if (score >= 40) return "Proceed with Caution";
    return "Reassess Market Fit";
  };

  // Map market gaps to opportunities
  const iconOptions = [Target, Shield, TrendingUp, Lightbulb];
  const marketGaps = [
    ...(competitiveData?.market_gaps_identified || []),
    ...(opportunityData?.macro_trends?.slice(0, 2).map((t: any) => t.trend) || [])
  ].slice(0, 4);
  
  const opportunities = marketGaps.length > 0 
    ? marketGaps.map((gap: string, i: number) => ({
        title: gap.length > 30 ? gap.substring(0, 30) + "..." : gap,
        score: Math.max(60, 90 - (i * 7)),
        icon: iconOptions[i % iconOptions.length],
      }))
    : [
        { title: "...", score: 0, icon: Target },
        { title: "...", score: 0, icon: Shield },
      ];

  // Map risk factors
  const riskFactors = opportunityData?.risk_factors || [];
  const risks = riskFactors.length > 0
    ? riskFactors.slice(0, 4).map((riskText: string) => {
        // Parse risk text - format: "Name: Description"
        const colonIndex = riskText.indexOf(":");
        const riskName = colonIndex > 0 ? riskText.substring(0, colonIndex).trim() : riskText;
        const description = colonIndex > 0 ? riskText.substring(colonIndex + 1).trim() : "";
        
        return {
          risk: riskName.length > 25 ? riskName.substring(0, 25) + "..." : riskName,
          action: "Mitigation needed",
          description: description.length > 60 ? description.substring(0, 60) + "..." : description || "Strategy to address this risk",
        };
      })
    : [
        { risk: "...", action: "...", description: "Risk analysis pending..." },
      ];

  // Key findings from opportunity section
  const keyFindings = [
    opportunityData?.opportunity_justification 
      ? opportunityData.opportunity_justification.substring(0, 80) + "..."
      : "Market analysis pending...",
    opportunityData?.tam_value 
      ? `TAM: ${opportunityData.tam_value} with ${opportunityData.tam_growth_rate || "..."} CAGR`
      : "TAM data pending...",
    opportunityData?.saturation_level 
      ? `Market saturation: ${opportunityData.saturation_level}`
      : "Saturation analysis pending...",
    opportunityData?.customer_pain_points?.length 
      ? `${opportunityData.customer_pain_points.length} key pain points identified`
      : "Pain point analysis pending...",
  ].filter(f => f && f !== "...");

  const hasData = marketScore > 0 || keyFindings.some(f => !f.includes("pending"));

  return (
    <section id="marketing-verdict" className="space-y-6 scroll-mt-8">
      {/* Recommendation Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl ${marketScore >= 60 ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
        <div className={`p-2 rounded-full ${marketScore >= 60 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
          <Rocket className={`h-5 w-5 ${marketScore >= 60 ? 'text-green-400' : 'text-yellow-400'}`} />
        </div>
        <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
          <div>
            <Badge className={`${marketScore >= 60 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'} text-xs`}>
              {hasData ? getRecommendation(marketScore) : "Analysis Pending..."}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">
              Market Score: <span className={`${marketScore >= 60 ? 'text-green-400' : 'text-yellow-400'} font-bold`}>
                {marketScore > 0 ? `${marketScore}/100` : "..."}
              </span>
            </span>
            <span className="text-muted-foreground">
              Risk Level: <span className={`${riskLevel.color} font-bold`}>
                {hasData ? riskLevel.label : "..."}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid - Consolidated */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Strategic Analysis (Key Findings + Opportunities) */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Strategic Analysis
            </h3>
            
            {/* Key Findings */}
            <div className="mb-5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Key Findings</span>
              <div className="space-y-2 mt-2">
                {keyFindings.slice(0, 4).map((finding, i) => (
                  <div key={i} className="flex gap-2 p-2 rounded-lg bg-muted/10 border border-border/20">
                    <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-bold text-accent">{i + 1}</span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Opportunities</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {opportunities.map((opp, i) => (
                  <div key={i} className="p-2 rounded-lg bg-muted/10 border border-border/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <opp.icon className="h-3 w-3 text-accent" />
                        <span className="text-[10px] text-foreground">{opp.title}</span>
                      </div>
                      <span className="text-[10px] font-bold text-accent">
                        {opp.score > 0 ? `${opp.score}%` : "..."}
                      </span>
                    </div>
                    <Progress value={opp.score} className="h-1 [&>div]:bg-accent" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Risks & Mitigation */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Risks & Mitigation
            </h3>
            <div className="space-y-3">
              {risks.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/10 border border-border/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{item.risk}</span>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                      <Badge variant="outline" className="text-[9px] border-accent/30 text-accent">
                        {item.action}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketingVerdict;