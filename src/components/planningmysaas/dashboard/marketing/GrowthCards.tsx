import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Zap, DollarSign, Heart, Target, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const pillarConfig = {
  acquisition: { icon: Users, label: "Acquisition" },
  engagement: { icon: Zap, label: "Engagement" },
  monetization: { icon: DollarSign, label: "Monetization" },
  retention: { icon: Heart, label: "Retention" }
};

const GrowthCards = () => {
  const { growthStrategy, competitiveAdvantages } = competitorAnalysisData;

  const overviewData = [
    { key: "acquisition", value: growthStrategy.acquisition.targetCAC, label: "Target CAC" },
    { key: "engagement", value: growthStrategy.engagement.activationTarget, label: "Activation Target" },
    { key: "monetization", value: growthStrategy.monetization.conversionTarget, label: "Conversion Target" },
    { key: "retention", value: growthStrategy.retention.targetChurn, label: "Target Churn" }
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
          <TrendingUp className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Growth Strategy (AEMR Framework)</h2>
          <p className="text-muted-foreground">Acquisition, Engagement, Monetization, and Retention pillars</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewData.map((item) => {
          const config = pillarConfig[item.key as keyof typeof pillarConfig];
          const Icon = config.icon;
          return (
            <Card key={item.key} className="glass-premium border-accent/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="font-medium text-foreground">{config.label}</span>
                </div>
                <p className="text-2xl font-bold text-accent">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acquisition */}
        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Acquisition Strategy</CardTitle>
                <p className="text-xs text-muted-foreground">Target CAC: {growthStrategy.acquisition.targetCAC}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {growthStrategy.acquisition.channels.map((channel, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{channel.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-accent/20 text-accent">{channel.investment}</Badge>
                      <span className="text-muted-foreground">CAC: {channel.expectedCAC}</span>
                    </div>
                  </div>
                  <Progress value={channel.investment === "High" ? 80 : channel.investment === "Medium" ? 50 : 30} className="h-1.5 [&>div]:bg-accent" />
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-accent/10">
              <div className="grid grid-cols-2 gap-2">
                {growthStrategy.acquisition.tactics.map((tactic, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">{tactic}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Engagement Strategy</CardTitle>
                <p className="text-xs text-muted-foreground">Activation Target: {growthStrategy.engagement.activationTarget}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {growthStrategy.engagement.onboardingSteps.map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">{step.action}</Badge>
                  {idx < growthStrategy.engagement.onboardingSteps.length - 1 && <ArrowRight className="h-3 w-3 text-accent/50 mx-1" />}
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
              <span className="text-xs text-muted-foreground">Activation Metric</span>
              <p className="text-sm font-medium text-foreground">{growthStrategy.engagement.activationMetric}</p>
            </div>
            <div className="pt-3 border-t border-accent/10">
              <div className="grid grid-cols-2 gap-2">
                {growthStrategy.engagement.tactics.map((tactic, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">{tactic}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monetization */}
        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Monetization Strategy</CardTitle>
                <p className="text-xs text-muted-foreground">Conversion Target: {growthStrategy.monetization.conversionTarget}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {growthStrategy.monetization.revenueStreams.map((stream, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-accent/5 border border-accent/10">
                  <span className="text-sm text-foreground">{stream.stream}</span>
                  <span className="text-sm font-medium text-accent">{stream.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-xs text-muted-foreground">Avg Contract Value</span>
                <p className="text-lg font-bold text-accent">{growthStrategy.monetization.averageContractValue}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-xs text-muted-foreground">Expansion Target</span>
                <p className="text-lg font-bold text-accent">{growthStrategy.monetization.expansionRevenueTarget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retention */}
        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Retention Strategy</CardTitle>
                <p className="text-xs text-muted-foreground">Target Churn: {growthStrategy.retention.targetChurn}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-xs text-muted-foreground">NPS Target</span>
                <p className="text-lg font-bold text-accent">{growthStrategy.retention.npsTarget}+</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-xs text-muted-foreground">Churn Reasons</span>
                <p className="text-lg font-bold text-accent">{growthStrategy.retention.churnReasons.length} identified</p>
              </div>
            </div>
            <div className="space-y-2">
              {growthStrategy.retention.strategies.slice(0, 3).map((strategy, idx) => (
                <div key={idx} className="p-2 rounded bg-accent/5 border border-accent/10">
                  <span className="text-xs font-medium text-foreground">{strategy.strategy}</span>
                  <p className="text-xs text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Advantages */}
      <Card className="glass-premium border-accent/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />Your Competitive Advantages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitiveAdvantages.map((adv, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="font-medium text-accent mb-2">{adv.advantage}</h4>
                <p className="text-sm text-muted-foreground mb-2">{adv.description}</p>
                <Badge variant="outline" className="text-xs border-accent/20 text-accent">{adv.impact}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GrowthCards;
