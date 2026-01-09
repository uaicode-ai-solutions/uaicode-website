import { 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  Star,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { executiveSummaryData } from "@/lib/dashboardMockData";
import ScoreCircle from "./ui/ScoreCircle";

const getViabilityLabel = (score: number): { text: string; } => {
  if (score >= 85) return { text: "Excellent" };
  if (score >= 70) return { text: "Strong" };
  if (score >= 50) return { text: "Moderate" };
  return { text: "Needs Work" };
};

const getComplexityLabel = (score: number): { text: string; } => {
  if (score >= 80) return { text: "High" };
  if (score >= 60) return { text: "Medium-High" };
  if (score >= 40) return { text: "Medium" };
  return { text: "Low" };
};

const highlightIcons = [Star, TrendingUp, Zap, Lightbulb, CheckCircle2];

const ExecutiveSummary = () => {
  const viabilityLabel = getViabilityLabel(executiveSummaryData.viabilityScore);
  const complexityLabel = getComplexityLabel(executiveSummaryData.complexityScore);

  return (
    <section id="executive-summary" className="scroll-mt-20">
      <Card className="border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">What We Found</CardTitle>
              <p className="text-xs text-muted-foreground">Our AI analysis of your SaaS idea</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* The Verdict - Narrative Summary */}
          <Card className="bg-accent/5 border-accent/20 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">The Verdict</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <span className="text-accent font-medium">Your project shows strong market-product fit.</span>{" "}
                  {executiveSummaryData.verdictSummary}{" "}
                  <span className="font-medium text-foreground">We recommend proceeding with development.</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Scores Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Viability Score */}
            <Card className="bg-card/80 border-border/30 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <ScoreCircle 
                    score={executiveSummaryData.viabilityScore} 
                    label="score" 
                    color="accent"
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">Viability Score</h3>
                      <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] px-1.5">
                        {viabilityLabel.text}
                      </Badge>
                    </div>
                    <Progress 
                      value={executiveSummaryData.viabilityScore} 
                      className="h-1.5 bg-muted/20 [&>div]:bg-accent"
                    />
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Top <span className="text-accent font-medium">{executiveSummaryData.benchmarkPercentile}%</span> of ideas analyzed
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Complexity Score */}
            <Card className="bg-card/80 border-border/30 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <ScoreCircle 
                    score={executiveSummaryData.complexityScore} 
                    label="score" 
                    color="muted"
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">Complexity Score</h3>
                      <Badge className="bg-muted/20 text-muted-foreground border-border/30 text-[10px] px-1.5">
                        {complexityLabel.text}
                      </Badge>
                    </div>
                    <Progress 
                      value={executiveSummaryData.complexityScore} 
                      className="h-1.5 bg-muted/20 [&>div]:bg-muted-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Standard development scope with clear milestones
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Key Highlights</h3>
            </div>
            
            {/* Main Highlight */}
            <Card className="bg-accent/5 border-accent/20 p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Star className="w-3 h-3 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-accent uppercase tracking-wide">Key Insight</span>
                  <p className="text-sm text-foreground font-medium mt-0.5">
                    {executiveSummaryData.keyHighlights[0]}
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Other Highlights */}
            <div className="grid md:grid-cols-2 gap-2">
              {executiveSummaryData.keyHighlights.slice(1, 5).map((highlight, index) => {
                const IconComponent = highlightIcons[(index + 1) % highlightIcons.length];
                return (
                  <Card
                    key={index}
                    className="bg-card/50 border-border/30 p-3 hover:border-accent/20 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <IconComponent className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {highlight}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Risk Assessment with Mitigation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Challenges & Solutions</h3>
            </div>
            
            <div className="grid gap-2">
              {executiveSummaryData.mainRisks.map((riskItem, index) => (
                <Card
                  key={index}
                  className="bg-card/50 border-l-2 border-l-accent/40 border-border/30 p-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-accent/70 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] px-1.5 py-0 ${
                              riskItem.priority === 'high' 
                                ? 'border-accent/50 text-accent' 
                                : 'border-border/50 text-muted-foreground'
                            }`}
                          >
                            {riskItem.priority === 'high' ? 'Priority' : 'Moderate'}
                          </Badge>
                        </div>
                        <p className="text-xs text-foreground/80">{riskItem.risk}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pl-5">
                      <CheckCircle2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-accent/90">{riskItem.mitigation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Ready to turn this analysis into reality?
            </p>
            <Button variant="outline" size="sm" className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 gap-2">
              <MessageSquare className="w-4 h-4" />
              Talk to Our Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ExecutiveSummary;
