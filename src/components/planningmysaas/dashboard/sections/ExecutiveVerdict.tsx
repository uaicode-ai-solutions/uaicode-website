import { 
  TrendingUp, 
  PiggyBank, 
  Target, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  PiggyBank,
  Target,
  Clock,
};

const ExecutiveVerdict = () => {
  const data = reportData;

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
  const summaryParagraphs = data.executiveSummary.split('\n\n').filter(p => p.trim());

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
            {data.recommendation}
          </div>
        </div>
      </div>

      {/* Main Summary Card */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          {/* Narrative Summary - Scannable format */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">Analysis Summary</h3>
            </div>
            <div className="space-y-4">
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
                    {/* Add tooltip for LTV/CAC if mentioned */}
                    {paragraph.includes('LTV/CAC') && (
                      <InfoTooltip term="LTV/CAC Ratio" side="top">
                        Customer Lifetime Value divided by Customer Acquisition Cost. A ratio above 3x indicates healthy unit economics.
                      </InfoTooltip>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Key Strengths
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {data.highlights.map((highlight, index) => {
                const IconComponent = iconMap[highlight.icon] || CheckCircle2;
                return (
                  <div 
                    key={index}
                    className="flex gap-3 p-4 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-md hover:shadow-accent/5"
                  >
                    <div className="p-2 rounded-lg bg-accent/10 h-fit">
                      <IconComponent className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{highlight.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{highlight.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risks Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Identified Risks
              <InfoTooltip side="right">
                We proactively identify risks so they can be mitigated during development. Each risk has a planned mitigation strategy.
              </InfoTooltip>
            </h3>
            <div className="space-y-3">
              {data.risks.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-card border border-border/30 hover:border-border/50 transition-colors"
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ExecutiveVerdict;
