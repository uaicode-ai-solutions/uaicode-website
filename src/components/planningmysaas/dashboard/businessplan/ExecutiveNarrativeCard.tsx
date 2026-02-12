import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ExecutiveNarrativeCardProps {
  narrative: string | null | undefined;
  marketInsight?: string;
}

const ExecutiveNarrativeCard: React.FC<ExecutiveNarrativeCardProps> = ({
  narrative,
  marketInsight,
}) => {
  if (!narrative) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
            AI narrative will appear here once generated...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          Executive Summary
          <InfoTooltip term="Executive Summary">
            An AI-generated narrative that summarizes your business opportunity, target market, and strategic positioning in plain language.
          </InfoTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {narrative}
        </p>
        
        {marketInsight && (
          <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-accent">Market Insight</span>
              <InfoTooltip term="Market Insight" size="sm">
                A key finding from market research that highlights a relevant trend or opportunity for your product.
              </InfoTooltip>
            </div>
            <p className="text-sm text-foreground italic">
              "{marketInsight}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExecutiveNarrativeCard;
