import { CheckCircle2, AlertTriangle, Sparkles, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { executiveSummaryData } from "@/lib/dashboardMockData";
import ScoreCircle from "./ui/ScoreCircle";

const ExecutiveSummary = () => {
  const { viabilityScore, complexityScore, keyHighlights, mainRisks } = executiveSummaryData;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Executive Summary</h2>
          <p className="text-muted-foreground">Your SaaS validation at a glance</p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <ScoreCircle 
                score={viabilityScore} 
                label="Viability" 
                color="success"
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Viability Score</h3>
                <p className="text-sm text-muted-foreground">
                  Based on market size, competition, and product-market fit analysis
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${viabilityScore >= 80 ? 'bg-green-500/10 text-green-500' : viabilityScore >= 60 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                    {viabilityScore >= 80 ? 'Highly Viable' : viabilityScore >= 60 ? 'Moderately Viable' : 'Needs Work'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <ScoreCircle 
                score={complexityScore} 
                label="Complexity" 
                color="warning"
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Complexity Score</h3>
                <p className="text-sm text-muted-foreground">
                  Technical difficulty and development effort required
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${complexityScore <= 40 ? 'bg-green-500/10 text-green-500' : complexityScore <= 70 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                    {complexityScore <= 40 ? 'Low Complexity' : complexityScore <= 70 ? 'Medium Complexity' : 'High Complexity'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Highlights & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Key Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {keyHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground/90">{highlight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Main Risks to Consider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mainRisks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground/90">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
