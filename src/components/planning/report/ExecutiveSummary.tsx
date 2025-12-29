import { CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

interface ExecutiveSummaryProps {
  data: {
    keyHighlights: string[];
    marketOpportunity: string;
    mainRisks: string[];
  };
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-accent" />
        Executive Summary
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Key Highlights */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Key Highlights
          </h3>
          <ul className="space-y-2">
            {data.keyHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-medium shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm text-muted-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Main Risks to Consider
          </h3>
          <ul className="space-y-2">
            {data.mainRisks.map((risk, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs font-medium shrink-0">
                  !
                </span>
                <span className="text-sm text-muted-foreground">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Opportunity */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4">
        <h3 className="text-base font-semibold text-foreground mb-2">Market Opportunity</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.marketOpportunity}</p>
      </div>
    </section>
  );
}
