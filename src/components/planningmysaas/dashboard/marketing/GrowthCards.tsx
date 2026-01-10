import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Zap, DollarSign, Heart, Target, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const pillarConfig = {
  acquisition: { icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20", label: "Acquisition" },
  engagement: { icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/20", label: "Engagement" },
  monetization: { icon: DollarSign, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/20", label: "Monetization" },
  retention: { icon: Heart, color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500/20", label: "Retention" }
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
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
          <TrendingUp className="h-6 w-6 text-purple-500" />
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
            <Card key={item.key} className={`border ${config.borderColor} ${config.bgColor}`}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <span className="font-medium text-foreground">{config.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acquisition */}
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${pillarConfig.acquisition.bgColor}`}>
                <Users className={`h-5 w-5 ${pillarConfig.acquisition.color}`} />
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
                      <Badge variant="outline" className="text-xs">{channel.investment}</Badge>
                      <span className="text-muted-foreground">CAC: {channel.expectedCAC}</span>
                    </div>
                  </div>
                  <Progress value={channel.investment === "High" ? 80 : channel.investment === "Medium" ? 50 : 30} className="h-1.5" />
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-border/30">
              <div className="grid grid-cols-2 gap-2">
                {growthStrategy.acquisition.tactics.map((tactic, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{tactic}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${pillarConfig.engagement.bgColor}`}>
                <Zap className={`h-5 w-5 ${pillarConfig.engagement.color}`} />
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
                  <Badge variant="secondary" className="text-xs">{step.action}</Badge>
                  {idx < growthStrategy.engagement.onboardingSteps.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />}
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <span className="text-xs text-muted-foreground">Activation Metric</span>
              <p className="text-sm font-medium text-foreground">{growthStrategy.engagement.activationMetric}</p>
            </div>
            <div className="pt-3 border-t border-border/30">
              <div className="grid grid-cols-2 gap-2">
                {growthStrategy.engagement.tactics.map((tactic, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{tactic}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monetization */}
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${pillarConfig.monetization.bgColor}`}>
                <DollarSign className={`h-5 w-5 ${pillarConfig.monetization.color}`} />
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
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <span className="text-sm text-foreground">{stream.stream}</span>
                  <span className="text-sm font-medium text-green-500">{stream.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs text-muted-foreground">Avg Contract Value</span>
                <p className="text-lg font-bold text-foreground">{growthStrategy.monetization.averageContractValue}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs text-muted-foreground">Expansion Target</span>
                <p className="text-lg font-bold text-foreground">{growthStrategy.monetization.expansionRevenueTarget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retention */}
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${pillarConfig.retention.bgColor}`}>
                <Heart className={`h-5 w-5 ${pillarConfig.retention.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg">Retention Strategy</CardTitle>
                <p className="text-xs text-muted-foreground">Target Churn: {growthStrategy.retention.targetChurn}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs text-muted-foreground">NPS Target</span>
                <p className="text-lg font-bold text-foreground">{growthStrategy.retention.npsTarget}+</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs text-muted-foreground">Churn Reasons</span>
                <p className="text-lg font-bold text-foreground">{growthStrategy.retention.churnReasons.length} identified</p>
              </div>
            </div>
            <div className="space-y-2">
              {growthStrategy.retention.strategies.slice(0, 3).map((strategy, idx) => (
                <div key={idx} className="p-2 rounded bg-red-500/5 border border-red-500/20">
                  <span className="text-xs font-medium text-foreground">{strategy.strategy}</span>
                  <p className="text-xs text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Advantages */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />Your Competitive Advantages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitiveAdvantages.map((adv, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-background/50 border border-border/30">
                <h4 className="font-medium text-foreground mb-2">{adv.advantage}</h4>
                <p className="text-sm text-muted-foreground mb-2">{adv.description}</p>
                <Badge variant="outline" className="text-xs">{adv.impact}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GrowthCards;
