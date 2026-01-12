import { TrendingUp, Target, Shield, Lightbulb, CheckCircle2, Rocket, AlertTriangle, ArrowRight } from "lucide-react";
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
    { risk: "Brand Recognition", action: "Niche positioning", description: "Focus on vertical-specific messaging" },
    { risk: "Budget Gap", action: "Long-tail keywords", description: "Target low-competition keywords" },
    { risk: "Price Sensitivity", action: "Emphasize ROI", description: "Highlight cost savings vs competitors" },
    { risk: "Sales Cycles", action: "Freemium trial", description: "Reduce friction with free tier" },
  ];

  const keyFindings = [
    "Fragmented market — enterprises or consumers only",
    "$60-90/mo SMB tier significantly underserved",
    "No competitor combines compliance + delivery + modern UX",
    "Expected 3.5x ROAS with $15K/mo budget",
  ];

  return (
    <section id="marketing-verdict" className="space-y-6 scroll-mt-8">
      {/* Recommendation Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="p-2 rounded-full bg-green-500/20">
          <Rocket className="h-5 w-5 text-green-400" />
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

      {/* 2-Column Grid - Consolidated */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Strategic Analysis (Key Findings + Opportunities) */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Strategic Analysis
            </h3>
            
            {/* Key Findings */}
            <div className="mb-5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Key Findings</span>
              <div className="space-y-2 mt-2">
                {keyFindings.map((finding, i) => (
                  <div key={i} className="flex gap-2 p-2 rounded-lg bg-muted/10 border border-border/20">
                    <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-bold text-accent">{i + 1}</span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Opportunities</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {opportunities.map((opp, i) => (
                  <div key={i} className="p-2 rounded-lg bg-muted/10 border border-border/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <opp.icon className="h-3 w-3 text-accent" />
                        <span className="text-[10px] text-foreground">{opp.title}</span>
                      </div>
                      <span className="text-[10px] font-bold text-accent">{opp.score}%</span>
                    </div>
                    <Progress value={opp.score} className="h-1 [&>div]:bg-accent" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Risks & Mitigation */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Risks & Mitigation
            </h3>
            <div className="space-y-3">
              {risks.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/10 border border-border/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{item.risk}</span>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                      <Badge variant="outline" className="text-[9px] border-accent/30 text-accent">
                        {item.action}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.description}</p>
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