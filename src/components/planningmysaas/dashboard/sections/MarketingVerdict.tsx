import { TrendingUp, Target, Shield, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  return (
    <section id="marketing-verdict" className="space-y-8 scroll-mt-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Executive Summary</h2>
          <p className="text-sm text-muted-foreground">Competitive landscape analysis & recommendations</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="glass-premium border-accent/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Recommendation Badge */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2 mb-4">
                Proceed with Differentiated Strategy
              </Badge>
              <p className="text-muted-foreground max-w-xs">
                The competitive analysis reveals significant opportunities for a focused market entry 
                targeting underserved health SMBs with a modern, compliance-first approach.
              </p>
            </div>

            {/* Summary Points */}
            <div className="flex-1 space-y-4">
              <p className="text-foreground leading-relaxed">
                Your competitive analysis reveals a fragmented market where major players either 
                serve large enterprises with complex solutions or target consumers with generic tools. 
                The <span className="text-accent font-medium">$60-90/month SMB tier is underserved</span>, 
                and no competitor effectively combines health compliance, integrated delivery, and modern UX.
              </p>
              <p className="text-foreground leading-relaxed">
                With a recommended <span className="text-accent font-medium">$15K/month paid media budget</span> and 
                focus on content marketing, you can achieve <span className="text-accent font-medium">3.5x ROAS</span> within 
                the first 6 months while building a sustainable organic acquisition channel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights & Risks Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Key Opportunities */}
        <Card className="bg-card/50 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Key Competitive Opportunities
            </h3>
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div 
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/30 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-accent/10 h-fit">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risks & Mitigations */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Risks & Mitigations
            </h3>
            <div className="space-y-4">
              {risks.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-yellow-500">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{item.risk}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
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
    </section>
  );
};

export default MarketingVerdict;
