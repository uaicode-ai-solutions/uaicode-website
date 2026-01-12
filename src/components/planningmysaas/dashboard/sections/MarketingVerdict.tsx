import { TrendingUp, Target, Shield, Lightbulb, CheckCircle2, Rocket, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const MarketingVerdict = () => {
  const opportunities = [
    { title: "SMB Market Gap", score: 85, icon: Target },
    { title: "Compliance Edge", score: 78, icon: Shield },
    { title: "Untapped Channels", score: 72, icon: TrendingUp },
    { title: "Content Gap", score: 68, icon: Lightbulb },
  ];

  const risks = [
    { risk: "Brand Recognition", action: "Niche positioning" },
    { risk: "Budget Gap", action: "Long-tail keywords" },
    { risk: "Price Sensitivity", action: "Emphasize ROI" },
    { risk: "Sales Cycles", action: "Freemium trial" },
  ];

  const keyFindings = [
    "Fragmented market — enterprises or consumers only",
    "$60-90/mo SMB tier significantly underserved",
    "No competitor combines compliance + delivery + modern UX",
    "Expected 3.5x ROAS with $15K/mo budget",
  ];

  return (
    <section id="marketing-verdict" className="space-y-4 scroll-mt-8">
      {/* Recommendation Banner - Compact */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="p-1.5 rounded-full bg-green-500/20">
          <Rocket className="h-4 w-4 text-green-400" />
        </div>
        <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
          <div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Proceed with Differentiated Strategy
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">Market Score: <span className="text-green-400 font-bold">78/100</span></span>
            <span className="text-muted-foreground">Risk Level: <span className="text-yellow-400 font-bold">Medium</span></span>
          </div>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid lg:grid-cols-3 gap-3">
        {/* Key Findings */}
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Key Findings
            </h3>
            <div className="space-y-2">
              {keyFindings.map((finding, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-accent">{i + 1}</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Opportunities with Visual Scores */}
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Opportunities
            </h3>
            <div className="space-y-3">
              {opportunities.map((opp, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <opp.icon className="h-3 w-3 text-accent" />
                      <span className="text-xs text-foreground">{opp.title}</span>
                    </div>
                    <span className="text-xs font-bold text-accent">{opp.score}%</span>
                  </div>
                  <Progress value={opp.score} className="h-1.5 [&>div]:bg-accent" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risks & Actions */}
        <Card className="glass-premium border-border/30">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Risks & Actions
            </h3>
            <div className="space-y-2">
              {risks.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-border/20">
                  <span className="text-xs text-foreground">{item.risk}</span>
                  <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">
                    {item.action}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketingVerdict;
