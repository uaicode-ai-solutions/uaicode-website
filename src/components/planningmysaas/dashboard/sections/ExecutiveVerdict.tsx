import { 
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { SummarySection } from "@/types/report";
import { useFinancialMetrics } from "@/hooks/useFinancialMetrics";

const ExecutiveVerdict = () => {
  const { report, reportData } = useReportContext();
  
  // Get validated financial metrics for syncing with summary text
  const financialMetrics = useFinancialMetrics(reportData, report?.market_type);
  
  // Get summary data from summary_section JSONB (100% from database)
  const summaryData = reportData?.summary_section as SummarySection | null;
  
  // Verdict: Direct from database
  const verdict = summaryData?.verdict || "...";

  // Verdict Summary: Direct from database
  const verdictSummary = summaryData?.verdict_summary || "";

  // Sync metrics in summary text with validated financial data to prevent contradictions
  const syncMetricsInText = (text: string): string => {
    if (!text) return text;
    
    let synced = text;
    
    // Replace LTV/CAC mentions with validated value from financial hook
    const ltvCacReal = financialMetrics.ltvCacCalculated || financialMetrics.ltvCacRatioNum;
    if (ltvCacReal && ltvCacReal > 0) {
      // Match patterns like "LTV/CAC of 4.5x", "LTV/CAC ratio of 4.5", "LTV:CAC of 4.5x"
      synced = synced.replace(
        /LTV[\/:]CAC(?:\s+ratio)?\s+(?:of\s+)?[\d.]+x?/gi,
        `LTV/CAC ratio of ${ltvCacReal.toFixed(1)}x`
      );
    }
    
    // Replace payback period mentions with validated value
    const paybackReal = financialMetrics.paybackPeriod;
    if (paybackReal && paybackReal > 0) {
      // Match patterns like "payback period of 3 months", "3-month payback"
      synced = synced.replace(
        /payback(?:\s+period)?\s+(?:of\s+)?(\d+)[-\s]?months?/gi,
        `payback period of ${paybackReal} months`
      );
      synced = synced.replace(
        /(\d+)[-\s]?month\s+payback/gi,
        `${paybackReal}-month payback`
      );
    }
    
    return synced;
  };

  // Apply metric sync to verdict summary
  const syncedVerdictSummary = syncMetricsInText(verdictSummary);

  // Parse executive summary into bullet points for better readability
  const summaryParagraphs = syncedVerdictSummary.split('\n\n').filter(p => p.trim());

  return (
    <section id="executive-verdict" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <ShieldCheck className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Summary</h2>
            <InfoTooltip side="right" size="sm">
              AI-powered executive summary analyzing your SaaS idea's viability and market potential.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Executive summary of your SaaS analysis</p>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/20 border border-green-500/30">
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

      {/* Card: Analysis Summary */}
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
    </section>
  );
};

export default ExecutiveVerdict;
