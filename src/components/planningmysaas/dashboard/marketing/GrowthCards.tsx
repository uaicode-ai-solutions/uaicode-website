import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, DollarSign, Heart, TrendingUp, CheckCircle, Star } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const pillarConfig = {
  acquisition: { icon: Users, label: "Acquisition", color: "text-blue-400" },
  engagement: { icon: Zap, label: "Engagement", color: "text-yellow-400" },
  monetization: { icon: DollarSign, label: "Monetization", color: "text-green-400" },
  retention: { icon: Heart, label: "Retention", color: "text-red-400" }
};

const GrowthCards = () => {
  const { growthStrategy, competitiveAdvantages } = competitorAnalysisData;

  const kpis = [
    { key: "acquisition", value: growthStrategy.acquisition.targetCAC, label: "Target CAC" },
    { key: "engagement", value: growthStrategy.engagement.activationTarget, label: "Activation" },
    { key: "monetization", value: growthStrategy.monetization.conversionTarget, label: "Conversion" },
    { key: "retention", value: growthStrategy.retention.targetChurn, label: "Target Churn" },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header - Compact */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-accent/10">
          <TrendingUp className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Growth Strategy (AEMR)
          <InfoTooltip term="AEMR Framework" size="sm">
            Acquisition, Engagement, Monetization, Retention — four pillars of SaaS growth.
          </InfoTooltip>
        </h2>
      </div>

      {/* KPI Overview - Large Cards */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => {
          const config = pillarConfig[kpi.key as keyof typeof pillarConfig];
          const Icon = config.icon;
          return (
            <Card key={kpi.key} className="glass-premium border-accent/20">
              <CardContent className="p-4 text-center">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${config.color}`} />
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabbed Details */}
      <Card className="glass-premium border-accent/20">
        <CardContent className="p-4">
          <Tabs defaultValue="acquisition" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-9">
              {Object.entries(pillarConfig).map(([key, config]) => (
                <TabsTrigger key={key} value={key} className="text-xs data-[state=active]:bg-accent/20">
                  <config.icon className="h-3.5 w-3.5 mr-1.5" />
                  {config.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="acquisition" className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {growthStrategy.acquisition.channels.slice(0, 3).map((channel, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{channel.name}</span>
                      <Badge variant="outline" className="text-[9px] border-accent/20 text-accent">
                        {channel.investment}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">CAC: {channel.expectedCAC}</p>
                    <Progress value={channel.investment === "High" ? 80 : channel.investment === "Medium" ? 50 : 30} className="h-1 mt-2 [&>div]:bg-blue-400" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {growthStrategy.acquisition.tactics.slice(0, 4).map((tactic, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px] bg-accent/10 text-foreground">
                    <CheckCircle className="h-2.5 w-2.5 mr-1 text-accent" />
                    {tactic}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-xs text-muted-foreground">Activation Metric</span>
                <p className="text-sm font-medium text-foreground mt-1">{growthStrategy.engagement.activationMetric}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {growthStrategy.engagement.onboardingSteps.slice(0, 4).map((step, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                    {idx + 1}. {step.action}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {growthStrategy.engagement.tactics.slice(0, 4).map((tactic, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px] border-accent/20 text-foreground">
                    {tactic}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monetization" className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {growthStrategy.monetization.revenueStreams.map((stream, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-accent/5 border border-accent/10 text-center">
                    <p className="text-lg font-bold text-green-400">{stream.percentage}%</p>
                    <p className="text-xs text-foreground">{stream.stream}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground">Avg Contract Value</span>
                  <p className="text-base font-bold text-accent">{growthStrategy.monetization.averageContractValue}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground">Expansion Target</span>
                  <p className="text-base font-bold text-accent">{growthStrategy.monetization.expansionRevenueTarget}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="retention" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground">NPS Target</span>
                  <p className="text-xl font-bold text-accent">{growthStrategy.retention.npsTarget}+</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-[10px] text-muted-foreground">Churn Reasons Identified</span>
                  <p className="text-xl font-bold text-accent">{growthStrategy.retention.churnReasons.length}</p>
                </div>
              </div>
              <div className="space-y-2">
                {growthStrategy.retention.strategies.slice(0, 2).map((strategy, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                    <span className="text-xs font-medium text-foreground">{strategy.strategy}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Competitive Advantages - Compact Badges */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-accent" />
            Your Competitive Advantages
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {competitiveAdvantages.map((adv, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-background/50 border border-accent/20 text-center">
                <h4 className="font-medium text-accent text-xs mb-1">{adv.advantage}</h4>
                <Badge variant="outline" className="text-[9px] border-accent/20 text-muted-foreground">
                  {adv.impact}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GrowthCards;
