import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, DollarSign, Heart, TrendingUp, CheckCircle, Star } from "lucide-react";
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

  const mainKPIs = [
    { key: "acquisition", value: growthStrategy.acquisition.targetCAC, label: "Target CAC" },
    { key: "engagement", value: growthStrategy.engagement.activationTarget, label: "Activation" },
    { key: "monetization", value: growthStrategy.monetization.conversionTarget, label: "Conversion" },
    { key: "retention", value: growthStrategy.retention.targetChurn, label: "Target Churn" }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainKPIs.map((kpi) => {
          const config = pillarConfig[kpi.key as keyof typeof pillarConfig];
          const Icon = config.icon;
          return (
            <Card key={kpi.key} className="bg-card/50 border-border/30">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <p className="text-2xl font-bold text-accent">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* === ACQUISITION SECTION === */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Acquisition</h3>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
              Target: {growthStrategy.acquisition.targetCAC}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {growthStrategy.acquisition.channels.slice(0, 3).map((channel, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/10 border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{channel.name}</span>
                  <Badge className="bg-accent/20 text-accent text-[9px] border-0">
                    {channel.investment}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">CAC: <span className="text-accent font-medium">{channel.expectedCAC}</span></p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {growthStrategy.acquisition.tactics.slice(0, 4).map((tactic, idx) => (
              <Badge key={idx} variant="outline" className="border-border/30 text-foreground text-[10px]">
                <CheckCircle className="h-2.5 w-2.5 mr-1 text-accent" />
                {tactic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* === ENGAGEMENT SECTION === */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Engagement</h3>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
              Target: {growthStrategy.engagement.activationTarget}
            </Badge>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/10 border border-border/20 mb-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Activation Metric</span>
            <p className="text-sm font-medium text-foreground mt-1">{growthStrategy.engagement.activationMetric}</p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            {growthStrategy.engagement.onboardingSteps.slice(0, 4).map((step, idx) => (
              <Badge key={idx} className="bg-accent/10 text-accent border border-accent/20 text-[10px]">
                {idx + 1}. {step.action}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {growthStrategy.engagement.tactics.slice(0, 4).map((tactic, idx) => (
              <Badge key={idx} variant="outline" className="border-border/30 text-foreground text-[10px]">
                {tactic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* === MONETIZATION SECTION === */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Monetization</h3>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
              Conv: {growthStrategy.monetization.conversionTarget}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {growthStrategy.monetization.revenueStreams.map((stream, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/10 border border-border/20 text-center">
                <p className="text-2xl font-bold text-accent">{stream.percentage}%</p>
                <p className="text-xs text-foreground mt-1">{stream.stream}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Contract Value</span>
              <p className="text-lg font-bold text-accent mt-1">{growthStrategy.monetization.averageContractValue}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Expansion Target</span>
              <p className="text-lg font-bold text-accent mt-1">{growthStrategy.monetization.expansionRevenueTarget}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === RETENTION SECTION === */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Retention</h3>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
              Churn: {growthStrategy.retention.targetChurn}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">NPS Target</span>
              <p className="text-2xl font-bold text-accent">{growthStrategy.retention.npsTarget}+</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Churn Reasons</span>
              <p className="text-2xl font-bold text-accent">{growthStrategy.retention.churnReasons.length}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {growthStrategy.retention.strategies.slice(0, 2).map((strategy, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/10 border border-border/20">
                <span className="text-xs font-medium text-foreground">{strategy.strategy}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{strategy.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* === COMPETITIVE ADVANTAGES === */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">Your Competitive Advantages</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {competitiveAdvantages.map((adv, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/10 border border-border/20 text-center">
                <h4 className="font-medium text-accent text-xs mb-1">{adv.advantage}</h4>
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
