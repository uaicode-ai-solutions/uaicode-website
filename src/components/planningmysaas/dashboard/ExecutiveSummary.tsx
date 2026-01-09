import { FileText, TrendingUp, AlertTriangle, Zap, Target, DollarSign, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { executiveSummaryData } from "@/lib/dashboardMockData";
import ScoreCircle from "./ui/ScoreCircle";

// Icons for highlights (will be assigned based on content)
const highlightIcons = [TrendingUp, Target, DollarSign, Users, Zap];

const ExecutiveSummary = () => {
  const getViabilityLabel = (score: number) => {
    if (score >= 80) return { text: "Highly Viable", color: "text-green-400" };
    if (score >= 60) return { text: "Viable", color: "text-green-400" };
    if (score >= 40) return { text: "Moderate Risk", color: "text-amber-400" };
    return { text: "High Risk", color: "text-red-400" };
  };

  const getComplexityLabel = (score: number) => {
    if (score >= 80) return { text: "Very Complex", color: "text-red-400" };
    if (score >= 60) return { text: "Medium-High", color: "text-amber-400" };
    if (score >= 40) return { text: "Medium", color: "text-amber-400" };
    return { text: "Low Complexity", color: "text-green-400" };
  };

  const viabilityInfo = getViabilityLabel(executiveSummaryData.viabilityScore);
  const complexityInfo = getComplexityLabel(executiveSummaryData.complexityScore);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl icon-container-premium">
          <FileText className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Executive Summary</h2>
          <p className="text-muted-foreground">Key insights at a glance</p>
        </div>
      </div>

      {/* Score Cards - Premium Design */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Viability Score Card */}
        <Card className="metric-card-premium bg-gradient-to-br from-green-500/10 via-card to-card border-green-500/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="score-circle-animated">
                <ScoreCircle
                  score={executiveSummaryData.viabilityScore}
                  label="Score"
                  color="success"
                  size="lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">Viability Score</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {viabilityInfo.text}
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Strong market fit with favorable unit economics
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-muted/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                style={{ width: `${executiveSummaryData.viabilityScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Complexity Score Card */}
        <Card className="metric-card-premium bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="score-circle-animated">
                <ScoreCircle
                  score={executiveSummaryData.complexityScore}
                  label="Score"
                  color="warning"
                  size="lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">Complexity Score</h3>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {complexityInfo.text}
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  AI integrations require careful architecture
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-muted/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${executiveSummaryData.complexityScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Highlights - Visual Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Key Highlights
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {executiveSummaryData.keyHighlights.slice(0, 5).map((highlight, index) => {
            const Icon = highlightIcons[index % highlightIcons.length];
            return (
              <Card 
                key={index} 
                className="metric-card-premium bg-card/50 border-border/30 hover:border-accent/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {highlight}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Risks - Alert Style Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          Risk Assessment
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {executiveSummaryData.mainRisks.map((risk, index) => (
            <Card 
              key={index} 
              className={`bg-card/50 border-l-4 ${
                index === 0 ? 'border-l-red-500/70' : 'border-l-amber-500/70'
              } border-t-0 border-r-0 border-b-0`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    index === 0 ? 'text-red-500' : 'text-amber-500'
                  }`} />
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`mb-2 text-xs ${
                        index === 0 
                          ? 'border-red-500/30 text-red-400' 
                          : 'border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {index === 0 ? 'High Priority' : 'Medium Priority'}
                    </Badge>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {risk}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;