import { TrendingUp, Target, Shield, AlertTriangle, CheckCircle2, Lightbulb, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const MarketingVerdict = () => {
  const highlights = [
    {
      icon: Target,
      title: "Underserved SMB Market",
      description: "Competitors focus on enterprise or consumer, leaving a gap for SMB-focused solutions"
    },
    {
      icon: Shield,
      title: "Compliance as Differentiator",
      description: "Health-specific compliance features are missing from generic competitors"
    },
    {
      icon: TrendingUp,
      title: "Low-Competition Channels",
      description: "LinkedIn B2B and TikTok educational content remain untapped by competitors"
    },
    {
      icon: Lightbulb,
      title: "Content Marketing Gap",
      description: "Limited quality content targeting health business owners in search results"
    }
  ];

  const risks = [
    {
      risk: "Established Brand Recognition",
      mitigation: "Focus on niche positioning and community building"
    },
    {
      risk: "Higher Competitor Budgets",
      mitigation: "Target long-tail keywords and underserved channels"
    },
    {
      risk: "Price Sensitivity in SMB",
      mitigation: "Emphasize ROI and time savings over features"
    }
  ];

  const summaryPoints = [
    "Fragmented market with major players either serving enterprises or consumers",
    "The $60-90/month SMB tier is significantly underserved",
    "No competitor combines health compliance, integrated delivery, and modern UX",
    "With $15K/month paid media budget, expect 3.5x ROAS in the first 6 months"
  ];

  return (
    <section id="marketing-verdict" className="space-y-6 scroll-mt-8">
      {/* Recommendation Banner */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="p-2 rounded-full bg-green-500/20">
          <Rocket className="h-5 w-5 text-green-400" />
        </div>
        <div className="flex-1">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-1">
            Recommendation
          </Badge>
          <p className="text-foreground font-medium">Proceed with Differentiated Strategy</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Analysis Summary</h3>
          <InfoTooltip size="sm">
            Key findings from competitive analysis that inform the go-to-market strategy.
          </InfoTooltip>
        </div>
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-6">
            <div className="space-y-3">
              {summaryPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    {point.includes("SMB") ? (
                      <>
                        {point.split("SMB")[0]}
                        <span className="text-accent font-medium">
                          SMB
                          <InfoTooltip term="SMB" size="sm">
                            Small and Medium Businesses — typically companies with 10-500 employees and $1M-$50M in annual revenue.
                          </InfoTooltip>
                        </span>
                        {point.split("SMB")[1]}
                      </>
                    ) : point.includes("ROAS") ? (
                      <>
                        {point.split("ROAS")[0]}
                        <span className="text-accent font-medium">
                          ROAS
                          <InfoTooltip term="ROAS" size="sm">
                            Return on Ad Spend — a metric that measures revenue generated for every dollar spent on advertising.
                          </InfoTooltip>
                        </span>
                        {point.split("ROAS")[1]}
                      </>
                    ) : (
                      point
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlights & Risks Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Key Opportunities */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Key Competitive Opportunities</h3>
            <InfoTooltip size="sm">
              Market gaps and advantages you can leverage against competitors.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-accent/20">
            <CardContent className="p-5">
              <div className="space-y-3">
                {highlights.map((item, index) => (
                  <div 
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/30 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-accent/10 h-fit">
                      <item.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risks & Mitigations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Risks & Mitigations</h3>
            <InfoTooltip size="sm">
              Potential challenges and strategies to address them.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-5">
              <div className="space-y-3">
                {risks.map((item, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-muted/20 border border-border/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-yellow-500">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{item.risk}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="text-accent">Mitigation:</span> {item.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MarketingVerdict;