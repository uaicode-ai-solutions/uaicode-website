import { Users, Zap, DollarSign, Heart, Target, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const pillarConfig = {
  acquisition: {
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    title: "Acquisition",
    description: "How you attract new users"
  },
  engagement: {
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    title: "Engagement",
    description: "How you activate users"
  },
  monetization: {
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    title: "Monetization",
    description: "How you generate revenue"
  },
  retention: {
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    title: "Retention",
    description: "How you keep users"
  }
};

const GrowthStrategyAEMR = () => {
  const { growthStrategy } = competitorAnalysisData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Marketing & Sales Strategy</h3>
        <p className="text-sm text-muted-foreground">Complete AEMR framework for sustainable growth</p>
      </div>

      {/* AEMR Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(pillarConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Card key={key} className={`${config.bgColor} ${config.borderColor} border`}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{config.title}</h4>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Acquisition Section */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            Acquisition Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Target CAC</p>
              <p className="text-2xl font-bold text-blue-500">{growthStrategy.acquisition.targetCAC}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Monthly Lead Target</p>
              <p className="text-2xl font-bold text-foreground">{growthStrategy.acquisition.monthlyLeadTarget}</p>
            </div>
            {growthStrategy.acquisition.keyMetrics.slice(0, 2).map((metric, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                <p className="text-xs text-muted-foreground">{metric.metric}</p>
                <p className="text-2xl font-bold text-foreground">{metric.target}</p>
              </div>
            ))}
          </div>

          {/* Channels */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Acquisition Channels</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {growthStrategy.acquisition.channels.map((channel, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground">{channel.name}</h5>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{channel.investment}</Badge>
                      <Badge className="bg-blue-500/20 text-blue-600">CAC: {channel.expectedCAC}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{channel.timeline}</p>
                  <div className="flex flex-wrap gap-1">
                    {channel.tactics.map((tactic, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{tactic}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactics */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Key Tactics</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {growthStrategy.acquisition.tactics.map((tactic, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{tactic}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Section */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Zap className="h-5 w-5 text-purple-500" />
            </div>
            Engagement Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activation Metric */}
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activation Metric</p>
                <p className="text-lg font-semibold text-purple-500">{growthStrategy.engagement.activationMetric}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Target Rate</p>
                <p className="text-2xl font-bold text-purple-500">{growthStrategy.engagement.activationTarget}</p>
              </div>
            </div>
          </div>

          {/* Onboarding Steps */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Onboarding Journey</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-500/30" />
              <div className="space-y-3">
                {growthStrategy.engagement.onboardingSteps.map((step, index) => (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-2 w-5 h-5 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-500">{step.step}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-between">
                      <span className="text-sm text-foreground">{step.action}</span>
                      <Badge variant="outline" className="text-xs">{step.timing}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagement Loops */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Engagement Loops</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              {growthStrategy.engagement.engagementLoops.map((loop, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30 space-y-2">
                  <Badge variant="secondary" className="text-xs">{loop.trigger}</Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="h-3 w-3" />
                    {loop.action}
                  </div>
                  <p className="text-sm text-purple-500 font-medium">{loop.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monetization Section */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            Monetization Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Conversion Target</p>
              <p className="text-2xl font-bold text-green-500">{growthStrategy.monetization.conversionTarget}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Avg. Contract Value</p>
              <p className="text-2xl font-bold text-foreground">{growthStrategy.monetization.averageContractValue}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Expansion Revenue</p>
              <p className="text-2xl font-bold text-foreground">{growthStrategy.monetization.expansionRevenueTarget}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
              <p className="text-xs text-muted-foreground">Target LTV</p>
              <p className="text-2xl font-bold text-green-500">
                {growthStrategy.monetization.keyMetrics.find(m => m.metric === "LTV")?.target}
              </p>
            </div>
          </div>

          {/* Strategies */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Monetization Strategies</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {growthStrategy.monetization.strategies.map((strategy, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground">{strategy.strategy}</h5>
                    <Badge className="bg-green-500/20 text-green-600">{strategy.impact}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Streams */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Revenue Streams</h4>
            <div className="space-y-3">
              {growthStrategy.monetization.revenueStreams.map((stream, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{stream.stream}</span>
                      <span className="text-sm text-green-500 font-medium">{stream.percentage}%</span>
                    </div>
                    <Progress value={stream.percentage} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-32 text-right">{stream.description}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retention Section */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            Retention Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">Target Churn</p>
              <p className="text-2xl font-bold text-red-500">{growthStrategy.retention.targetChurn}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-xs text-muted-foreground">NPS Target</p>
              <p className="text-2xl font-bold text-foreground">{growthStrategy.retention.npsTarget}+</p>
            </div>
            {growthStrategy.retention.keyMetrics.slice(1, 3).map((metric, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                <p className="text-xs text-muted-foreground">{metric.metric}</p>
                <p className="text-2xl font-bold text-foreground">{metric.target}</p>
              </div>
            ))}
          </div>

          {/* Retention Strategies */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Retention Strategies</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {growthStrategy.retention.strategies.map((strategy, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <h5 className="font-medium text-foreground mb-1">{strategy.strategy}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                  <Badge variant="outline" className="text-xs">Trigger: {strategy.trigger}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Churn Analysis */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Churn Risk Analysis</h4>
            <div className="space-y-3">
              {growthStrategy.retention.churnReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{reason.reason}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={reason.preventable ? 'border-green-500/50 text-green-600' : 'border-muted-foreground/50'}
                        >
                          {reason.preventable ? 'Preventable' : 'Not preventable'}
                        </Badge>
                        <span className="text-sm font-medium">{reason.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={reason.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantages Summary */}
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Your Competitive Advantages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {competitorAnalysisData.competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="p-4 rounded-lg bg-background/50 border border-border/30">
                <h4 className="font-semibold text-accent mb-1">{advantage.advantage}</h4>
                <p className="text-sm text-foreground/80 mb-2">{advantage.description}</p>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Gap:</span> {advantage.competitorGap}
                  </p>
                  <p className="text-xs text-accent">
                    <span className="font-medium">Impact:</span> {advantage.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthStrategyAEMR;
