import { 
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { Highlight, Risk, OpportunitySection } from "@/types/report";

const ExecutiveVerdict = () => {
  const { report, reportData } = useReportContext();
  
  // Use real data only - no mock fallbacks for validation
  const verdict = report?.verdict || "";
  const verdictSummary = report?.verdict_summary || "";
  
  // Parse JSONB fields - empty arrays if not available
  const highlights: Highlight[] = (report?.highlights as unknown as Highlight[]) || [];
  
  // UNIFIED: Get risks from opportunity_section (primary source) with fallback to legacy field
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const riskFactorsFromOpportunity = opportunityData?.risk_factors || [];
  const legacyRisks: Risk[] = (report?.risks as unknown as Risk[]) || [];
  
  // Convert risk_factors (string[]) to Risk[] format if needed
  const risks: Risk[] = riskFactorsFromOpportunity.length > 0 
    ? riskFactorsFromOpportunity.map((riskText, idx) => ({
        risk: riskText,
        priority: idx === 0 ? "high" : idx === 1 ? "medium" : "low" as "high" | "medium" | "low",
        mitigation: "Review and address during development phase"
      }))
    : legacyRisks;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-muted-foreground bg-muted/10 border-border/20";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "High";
      case "medium": return "Medium";
      case "low": return "Low";
      default: return priority;
    }
  };

  // Parse executive summary into bullet points for better readability
  const summaryParagraphs = verdictSummary.split('\n\n').filter(p => p.trim());

  return (
    <section id="executive-verdict" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <ShieldCheck className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Verdict</h2>
            <InfoTooltip side="right" size="sm">
              AI-powered executive summary analyzing your SaaS idea's viability, strengths, and potential risks.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Executive summary of the analysis</p>
        </div>
      </div>

      {/* Recommendation Badge - Prominent at top */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="p-2 rounded-full bg-green-500/20">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Our Recommendation:</span>
          <div className="text-xl font-bold text-green-400">
            {verdict}
          </div>
        </div>
      </div>

      {/* Card 1: Analysis Summary */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-foreground text-sm">Analysis Summary</h3>
            <InfoTooltip side="right" size="sm">
              AI-generated executive summary of your SaaS idea's viability and market potential.
            </InfoTooltip>
          </div>
          {summaryParagraphs.length > 0 ? (
            <div className="space-y-3">
              {summaryParagraphs.map((paragraph, index) => (
                <div 
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-muted/10 border border-border/20"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {paragraph}
                    {paragraph.includes('LTV/CAC') && (
                      <InfoTooltip term="LTV/CAC Ratio" side="top">
                        Customer Lifetime Value divided by Customer Acquisition Cost. A ratio above 3x indicates healthy unit economics.
                      </InfoTooltip>
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 rounded-lg bg-muted/10">
              <AlertCircle className="h-4 w-4" />
              <span>No analysis summary available</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards lado a lado: Key Strengths + Identified Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 2: Key Strengths */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-foreground text-sm">Key Strengths</h3>
              <InfoTooltip side="right" size="sm">
                The main competitive advantages and strengths identified in your SaaS idea.
              </InfoTooltip>
            </div>
            {highlights.length > 0 ? (
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-muted/10 border border-border/20"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-accent">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{highlight.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{highlight.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 rounded-lg bg-muted/10">
                <AlertCircle className="h-4 w-4" />
                <span>No highlights available</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Identified Risks */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-foreground text-sm">Identified Risks</h3>
              <InfoTooltip side="right" size="sm">
                Proactively identified risks with planned mitigation strategies.
              </InfoTooltip>
            </div>
            {risks.length > 0 ? (
              <div className="space-y-3">
                {risks.map((item, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-muted/10 border border-border/20"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-medium text-foreground text-sm">{item.risk}</p>
                      <Badge 
                        variant="outline" 
                        className={`flex-shrink-0 text-xs ${getPriorityColor(item.priority)}`}
                      >
                        {getPriorityLabel(item.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="text-green-400 font-medium">Mitigation:</span>{" "}
                        {item.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 rounded-lg bg-muted/10">
                <AlertCircle className="h-4 w-4" />
                <span>No risks identified</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ExecutiveVerdict;
