import { 
  TrendingUp, Target, AlertTriangle, DollarSign, ArrowRight,
  Lightbulb, Shield, BarChart3, Users, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { HeroScoreSection, OpportunitySection, BusinessPlanSection, safeNumber } from "@/types/report";
import { getSectionInvestment } from "@/lib/sectionInvestmentUtils";
import { parseJsonField } from "@/lib/reportDataUtils";

interface ExecutiveSummaryTabProps {
  projectName: string;
  onViewInvestment: () => void;
}

const ExecutiveSummaryTab = ({ projectName, onViewInvestment }: ExecutiveSummaryTabProps) => {
  const { reportData } = useReportContext();

  // Score
  const heroScore = reportData?.hero_score_section as HeroScoreSection | null;
  const score = safeNumber(heroScore?.score, 0);
  const tagline = heroScore?.tagline || "Analysis Complete";

  // Opportunity
  const opportunity = reportData?.opportunity_section as OpportunitySection | null;
  const tamValue = opportunity?.tam_value || "—";
  const marketGrowthRate = opportunity?.market_growth_rate || "—";

  // Financial metrics from growth intelligence
  const growth = reportData?.growth_intelligence_section as any;
  const financialMetrics = growth?.financial_metrics;
  const ltvCacRatio = financialMetrics?.ltv_cac_ratio
    ? `${financialMetrics.ltv_cac_ratio.toFixed(1)}x`
    : "—";
  const paybackMonths = financialMetrics?.payback_months
    ? `${financialMetrics.payback_months} mo`
    : "—";
  const breakEvenMonths = financialMetrics?.break_even_months
    ? `${financialMetrics.break_even_months} mo`
    : "—";

  // Investment
  const sectionInvestment = getSectionInvestment(reportData);
  const investmentCents = safeNumber(sectionInvestment?.investment_one_payment_cents, 0);
  const investmentFormatted = investmentCents > 0
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(investmentCents / 100)
    : "—";
  const mvpTier = sectionInvestment?.mvp_tier || "—";

  // Business Plan narratives
  const bpSection = reportData?.business_plan_section as BusinessPlanSection | null;
  const executiveNarrative = bpSection?.ai_executive_narrative || null;
  const recommendations = bpSection?.ai_key_recommendations || [];

  // Opportunities from opportunity section
  const highlights = opportunity?.highlights || [];
  const topOpportunities = highlights.slice(0, 3);

  // Risks
  const riskFactors = opportunity?.risk_factors || [];
  const topRisks = riskFactors.slice(0, 3);

  // Score color
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-400";
    if (s >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30";
    if (s >= 60) return "from-amber-500/20 to-amber-500/5 border-amber-500/30";
    return "from-red-500/20 to-red-500/5 border-red-500/30";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Score */}
      <div className={`p-8 rounded-2xl bg-gradient-to-br ${getScoreBg(score)} border text-center`}>
        <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}
        </div>
        <p className="text-lg font-semibold text-foreground">{tagline}</p>
        <p className="text-sm text-muted-foreground mt-1">{projectName} — Viability Score</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TAM", value: tamValue, icon: Target, color: "text-blue-400" },
          { label: "LTV/CAC", value: ltvCacRatio, icon: TrendingUp, color: "text-emerald-400" },
          { label: "Payback", value: paybackMonths, icon: BarChart3, color: "text-amber-400" },
          { label: "Investment", value: investmentFormatted, icon: DollarSign, color: "text-accent" },
        ].map(metric => (
          <Card key={metric.label} className="glass-card border-border/30">
            <CardContent className="p-4 text-center">
              <metric.icon className={`h-5 w-5 ${metric.color} mx-auto mb-2`} />
              <p className="text-lg font-bold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Narrative */}
      {executiveNarrative && (
        <Card className="glass-card border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Executive Overview</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {executiveNarrative}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Opportunities & Risks */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Opportunities */}
        <Card className="glass-card border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-foreground">Top Opportunities</h3>
            </div>
            {topOpportunities.length > 0 ? (
              <div className="space-y-3">
                {topOpportunities.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground/80">{h.text || h}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Data not available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Risks */}
        <Card className="glass-card border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-base font-semibold text-foreground">Key Risks</h3>
            </div>
            {topRisks.length > 0 ? (
              <div className="space-y-3">
                {topRisks.map((risk: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-400 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground/80">{risk}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Data not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="glass-card border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-accent" />
              <h3 className="text-base font-semibold text-foreground">Key Recommendations</h3>
            </div>
            <div className="space-y-2">
              {recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-accent font-bold">{i + 1}.</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onViewInvestment}
          className="gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg px-10 py-6 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105"
        >
          Let's Discuss the Investment
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ExecutiveSummaryTab;
