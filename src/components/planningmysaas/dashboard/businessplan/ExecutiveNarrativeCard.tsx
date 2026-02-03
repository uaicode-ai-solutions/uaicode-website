import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";

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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main narrative */}
        <p className="text-muted-foreground leading-relaxed">
          {narrative}
        </p>
        
        {/* Optional market insight */}
        {marketInsight && (
          <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
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
