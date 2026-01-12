import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, DollarSign, Heart, TrendingUp, CheckCircle, Star } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const GrowthCards = () => {
  const { growthStrategy, competitiveAdvantages } = competitorAnalysisData;

  return (
    <div className="space-y-6">
      {/* Section Header with KPIs inline */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">Growth Strategy (AEMR)</h2>
              <InfoTooltip term="AEMR Framework" size="sm">
                Acquisition, Engagement, Monetization, Retention — four pillars of SaaS growth.
              </InfoTooltip>
            </div>
            <p className="text-sm text-muted-foreground">Complete growth framework for your SaaS</p>
          </div>
        </div>
        {/* Inline KPIs */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-muted/10 border border-border/20 text-center">
            <p className="text-xs font-bold text-accent">{growthStrategy.acquisition.targetCAC}</p>
            <p className="text-[9px] text-muted-foreground">Target CAC</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-muted/10 border border-border/20 text-center">
            <p className="text-xs font-bold text-accent">{growthStrategy.engagement.activationTarget}</p>
            <p className="text-[9px] text-muted-foreground">Activation</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-muted/10 border border-border/20 text-center">
            <p className="text-xs font-bold text-accent">{growthStrategy.monetization.conversionTarget}</p>
            <p className="text-[9px] text-muted-foreground">Conversion</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-muted/10 border border-border/20 text-center">
            <p className="text-xs font-bold text-accent">{growthStrategy.retention.targetChurn}</p>
            <p className="text-[9px] text-muted-foreground">Churn</p>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Acquisition+Engagement | Monetization+Retention */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Acquisition & Engagement */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            {/* Acquisition Section */}
            <div className="mb-5 pb-4 border-b border-border/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground text-sm">Acquisition</h3>
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
                  Target: {growthStrategy.acquisition.targetCAC}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                {growthStrategy.acquisition.channels.slice(0, 2).map((channel, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-muted/10 border border-border/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{channel.name}</span>
                      <Badge className="bg-accent/20 text-accent text-[9px] border-0">
                        {channel.investment}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">CAC: <span className="text-accent font-medium">{channel.expectedCAC}</span></p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {growthStrategy.acquisition.tactics.slice(0, 3).map((tactic, idx) => (
                  <Badge key={idx} variant="outline" className="border-border/30 text-foreground text-[9px]">
                    <CheckCircle className="h-2 w-2 mr-1 text-accent" />
                    {tactic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Engagement Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground text-sm">Engagement</h3>
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
                  Target: {growthStrategy.engagement.activationTarget}
                </Badge>
              </div>
              
              <div className="p-2 rounded-lg bg-muted/10 border border-border/20 mb-3">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Activation Metric</span>
                <p className="text-xs font-medium text-foreground mt-0.5">{growthStrategy.engagement.activationMetric}</p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {growthStrategy.engagement.onboardingSteps.slice(0, 3).map((step, idx) => (
                  <Badge key={idx} className="bg-accent/10 text-accent border border-accent/20 text-[9px]">
                    {idx + 1}. {step.action}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Monetization & Retention */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            {/* Monetization Section */}
            <div className="mb-5 pb-4 border-b border-border/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground text-sm">Monetization</h3>
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
                  Conv: {growthStrategy.monetization.conversionTarget}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                {growthStrategy.monetization.revenueStreams.map((stream, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-muted/10 border border-border/20 text-center">
                    <p className="text-lg font-bold text-accent">{stream.percentage}%</p>
                    <p className="text-[9px] text-foreground">{stream.stream}</p>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/10 border border-border/20">
                  <span className="text-[9px] text-muted-foreground uppercase">ACV</span>
                  <p className="text-sm font-bold text-accent">{growthStrategy.monetization.averageContractValue}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/10 border border-border/20">
                  <span className="text-[9px] text-muted-foreground uppercase">Expansion</span>
                  <p className="text-sm font-bold text-accent">{growthStrategy.monetization.expansionRevenueTarget}</p>
                </div>
              </div>
            </div>

            {/* Retention Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground text-sm">Retention</h3>
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
                  Churn: {growthStrategy.retention.targetChurn}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded-lg bg-muted/10 border border-border/20">
                  <span className="text-[9px] text-muted-foreground uppercase">NPS Target</span>
                  <p className="text-lg font-bold text-accent">{growthStrategy.retention.npsTarget}+</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/10 border border-border/20">
                  <span className="text-[9px] text-muted-foreground uppercase">Churn Risks</span>
                  <p className="text-lg font-bold text-accent">{growthStrategy.retention.churnReasons.length}</p>
                </div>
              </div>
              
              <div className="p-2 rounded-lg bg-muted/10 border border-border/20">
                <span className="text-[9px] text-muted-foreground">{growthStrategy.retention.strategies[0].strategy}</span>
                <p className="text-[10px] text-foreground mt-0.5">{growthStrategy.retention.strategies[0].description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Advantages - Inline chips */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">Your Competitive Advantages</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {competitiveAdvantages.map((adv, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/20">
                <span className="text-xs font-medium text-accent">{adv.advantage}</span>
                <Badge variant="outline" className="border-border/30 text-muted-foreground text-[9px]">
                  {adv.impact}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthCards;