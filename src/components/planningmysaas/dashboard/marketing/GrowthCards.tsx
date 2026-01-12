import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Zap, DollarSign, Heart, Target, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const pillarConfig = {
  acquisition: { icon: Users, label: "Acquisition" },
  engagement: { icon: Zap, label: "Engagement" },
  monetization: { icon: DollarSign, label: "Monetization" },
  retention: { icon: Heart, label: "Retention" }
};

const GrowthCards = () => {
  const { growthStrategy, competitiveAdvantages } = competitorAnalysisData;

  const overviewData = [
    { 
      key: "acquisition", 
      value: growthStrategy.acquisition.targetCAC, 
      label: "Target CAC",
      tooltip: "Maximum cost to acquire a customer while remaining profitable based on LTV calculations."
    },
    { 
      key: "engagement", 
      value: growthStrategy.engagement.activationTarget, 
      label: "Activation Target",
      tooltip: "Percentage of users who reach the 'aha moment' — the key action that indicates they've found value."
    },
    { 
      key: "monetization", 
      value: growthStrategy.monetization.conversionTarget, 
      label: "Conversion Target",
      tooltip: "Free to paid conversion rate goal based on industry benchmarks and pricing strategy."
    },
    { 
      key: "retention", 
      value: growthStrategy.retention.targetChurn, 
      label: "Target Churn",
      tooltip: "Monthly customer loss rate goal. Lower churn dramatically increases customer lifetime value."
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Growth Strategy
            <InfoTooltip term="AEMR Framework">
              Acquisition (getting users), Engagement (activating them), Monetization (converting to paid), Retention (keeping them) — the four pillars of sustainable SaaS growth.
            </InfoTooltip>
          </h2>
          <p className="text-sm text-muted-foreground">Acquisition, Engagement, Monetization, and Retention pillars</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Growth Targets Overview</h3>
          <InfoTooltip size="sm">
            Key performance targets for each growth pillar based on industry benchmarks.
          </InfoTooltip>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {overviewData.map((item) => {
            const config = pillarConfig[item.key as keyof typeof pillarConfig];
            const Icon = config.icon;
            return (
              <Card key={item.key} className="glass-premium border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="font-medium text-foreground text-sm">{config.label}</span>
                  </div>
                  <p className="text-xl font-bold text-accent">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Cards - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Acquisition */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Acquisition Strategy</h3>
            <InfoTooltip size="sm">
              Channels and tactics for acquiring new customers cost-effectively.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] text-muted-foreground">Target CAC: {growthStrategy.acquisition.targetCAC}</p>
              <div className="space-y-2">
                {growthStrategy.acquisition.channels.slice(0, 3).map((channel, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{channel.name}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] border-accent/20 text-accent">{channel.investment}</Badge>
                        <span className="text-muted-foreground text-[10px]">CAC: {channel.expectedCAC}</span>
                      </div>
                    </div>
                    <Progress value={channel.investment === "High" ? 80 : channel.investment === "Medium" ? 50 : 30} className="h-1 [&>div]:bg-accent" />
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-accent/10">
                <div className="grid grid-cols-2 gap-1.5">
                  {growthStrategy.acquisition.tactics.slice(0, 4).map((tactic, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                      <CheckCircle className="h-2.5 w-2.5 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground">{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Engagement Strategy</h3>
            <InfoTooltip size="sm">
              Onboarding flow and activation metrics to maximize user value realization.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] text-muted-foreground">Activation Target: {growthStrategy.engagement.activationTarget}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {growthStrategy.engagement.onboardingSteps.slice(0, 4).map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent border-accent/20">{step.action}</Badge>
                    {idx < Math.min(growthStrategy.engagement.onboardingSteps.length, 4) - 1 && <ArrowRight className="h-2.5 w-2.5 text-accent/50 mx-0.5" />}
                  </div>
                ))}
              </div>
              <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-[10px] text-muted-foreground">Activation Metric</span>
                <p className="text-xs font-medium text-foreground">{growthStrategy.engagement.activationMetric}</p>
              </div>
              <div className="pt-2 border-t border-accent/10">
                <div className="grid grid-cols-2 gap-1.5">
                  {growthStrategy.engagement.tactics.slice(0, 4).map((tactic, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                      <CheckCircle className="h-2.5 w-2.5 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground">{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monetization */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Monetization Strategy</h3>
            <InfoTooltip size="sm">
              Revenue streams and conversion optimization tactics.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] text-muted-foreground">Conversion Target: {growthStrategy.monetization.conversionTarget}</p>
              <div className="space-y-2">
                {growthStrategy.monetization.revenueStreams.map((stream, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-accent/5 border border-accent/10">
                    <span className="text-xs text-foreground">{stream.stream}</span>
                    <span className="text-xs font-medium text-accent">{stream.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground">Avg Contract Value</span>
                  <p className="text-base font-bold text-accent">{growthStrategy.monetization.averageContractValue}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground">Expansion Target</span>
                  <p className="text-base font-bold text-accent">{growthStrategy.monetization.expansionRevenueTarget}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Retention */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Retention Strategy</h3>
            <InfoTooltip size="sm">
              Tactics to reduce churn and increase customer lifetime value.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/20">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] text-muted-foreground">Target Churn: {growthStrategy.retention.targetChurn}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    NPS Target
                    <InfoTooltip size="sm">
                      Net Promoter Score — measures customer satisfaction and loyalty on a scale of -100 to 100.
                    </InfoTooltip>
                  </span>
                  <p className="text-base font-bold text-accent">{growthStrategy.retention.npsTarget}+</p>
                </div>
                <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground">Churn Reasons</span>
                  <p className="text-base font-bold text-accent">{growthStrategy.retention.churnReasons.length} identified</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {growthStrategy.retention.strategies.slice(0, 2).map((strategy, idx) => (
                  <div key={idx} className="p-2 rounded bg-accent/5 border border-accent/10">
                    <span className="text-[10px] font-medium text-foreground">{strategy.strategy}</span>
                    <p className="text-[10px] text-muted-foreground">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitive Advantages */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Your Competitive Advantages</h3>
          <InfoTooltip size="sm">
            Unique strengths that differentiate you from competitors in the market.
          </InfoTooltip>
        </div>
        <Card className="glass-premium border-accent/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
          <CardContent className="p-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {competitiveAdvantages.map((adv, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-accent/5 border border-accent/20 hover:border-accent/40 transition-colors">
                  <h4 className="font-medium text-accent text-sm mb-1">{adv.advantage}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{adv.description}</p>
                  <Badge variant="outline" className="text-[10px] border-accent/20 text-accent">{adv.impact}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GrowthCards;