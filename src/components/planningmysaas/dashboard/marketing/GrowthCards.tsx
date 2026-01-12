import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, DollarSign, Heart, TrendingUp, CheckCircle, Star } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { InfoTooltip } from "@/components/ui/info-tooltip";

// Configuração dos pilares com gradientes UAICODE
const pillarConfig = {
  acquisition: { 
    icon: Users, 
    label: "Acquisition", 
    color: "text-accent",
    gradient: "from-[#d97706] to-[#fbbf24]",
    bgGlow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
    border: "border-accent/30"
  },
  engagement: { 
    icon: Zap, 
    label: "Engagement", 
    color: "text-amber-400",
    gradient: "from-[#e5a00d] to-[#fcd34d]",
    bgGlow: "shadow-[0_0_20px_rgba(229,160,13,0.15)]",
    border: "border-amber-400/30"
  },
  monetization: { 
    icon: DollarSign, 
    label: "Monetization", 
    color: "text-amber-300",
    gradient: "from-[#f0b429] to-[#fde68a]",
    bgGlow: "shadow-[0_0_20px_rgba(240,180,41,0.15)]",
    border: "border-amber-300/30"
  },
  retention: { 
    icon: Heart, 
    label: "Retention", 
    color: "text-orange-400",
    gradient: "from-[#ea580c] to-[#f97316]",
    bgGlow: "shadow-[0_0_20px_rgba(234,88,12,0.15)]",
    border: "border-orange-400/30"
  }
};

const GrowthCards = () => {
  const { growthStrategy, competitiveAdvantages } = competitorAnalysisData;

  // KPIs principais para exibição
  const mainKPIs = [
    { key: "acquisition", value: growthStrategy.acquisition.targetCAC, label: "Target CAC" },
    { key: "engagement", value: growthStrategy.engagement.activationTarget, label: "Activation" },
    { key: "monetization", value: growthStrategy.monetization.conversionTarget, label: "Conversion" },
    { key: "retention", value: growthStrategy.retention.targetChurn, label: "Target Churn" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Growth Strategy (AEMR)
              <InfoTooltip term="AEMR Framework" size="sm">
                Acquisition, Engagement, Monetization, Retention — four pillars of SaaS growth.
              </InfoTooltip>
            </h2>
            <p className="text-xs text-muted-foreground">Complete growth framework for your SaaS</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Premium */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainKPIs.map((kpi) => {
          const config = pillarConfig[kpi.key as keyof typeof pillarConfig];
          const Icon = config.icon;
          return (
            <Card 
              key={kpi.key} 
              className={`bg-gradient-to-b from-accent/10 to-transparent ${config.border} overflow-hidden ${config.bgGlow}`}
            >
              <CardContent className="p-4 text-center relative">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* === ACQUISITION SECTION === */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b border-accent/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d97706] to-[#fbbf24] flex items-center justify-center shadow-lg">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Acquisition</h3>
            <p className="text-[10px] text-muted-foreground">Customer acquisition channels & CAC targets</p>
          </div>
          <Badge className="ml-auto bg-accent/10 text-accent border-accent/20 text-[9px]">
            Target: {growthStrategy.acquisition.targetCAC}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {growthStrategy.acquisition.channels.slice(0, 3).map((channel, idx) => (
            <Card key={idx} className="bg-gradient-to-b from-accent/8 to-transparent border-accent/20 overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{channel.name}</span>
                  <Badge className="bg-gradient-to-r from-[#d97706] to-[#fbbf24] text-white text-[9px] border-0">
                    {channel.investment}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">CAC: <span className="text-accent font-medium">{channel.expectedCAC}</span></p>
                <div className="h-1.5 mt-2 rounded-full bg-accent/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#d97706] to-[#fbbf24] rounded-full"
                    style={{ width: `${channel.investment === "High" ? 85 : channel.investment === "Medium" ? 55 : 30}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {growthStrategy.acquisition.tactics.slice(0, 4).map((tactic, idx) => (
            <Badge key={idx} className="bg-accent/10 text-foreground border border-accent/20 text-[10px]">
              <CheckCircle className="h-2.5 w-2.5 mr-1 text-accent" />
              {tactic}
            </Badge>
          ))}
        </div>
      </div>

      {/* === ENGAGEMENT SECTION === */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b border-amber-400/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e5a00d] to-[#fcd34d] flex items-center justify-center shadow-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Engagement</h3>
            <p className="text-[10px] text-muted-foreground">User activation & onboarding strategy</p>
          </div>
          <Badge className="ml-auto bg-amber-400/10 text-amber-400 border-amber-400/20 text-[9px]">
            Target: {growthStrategy.engagement.activationTarget}
          </Badge>
        </div>
        
        <Card className="bg-gradient-to-b from-amber-400/8 to-transparent border-amber-400/20">
          <CardContent className="p-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Activation Metric</span>
            <p className="text-sm font-medium text-foreground mt-1">{growthStrategy.engagement.activationMetric}</p>
          </CardContent>
        </Card>
        
        <div className="flex flex-wrap gap-1.5">
          {growthStrategy.engagement.onboardingSteps.slice(0, 4).map((step, idx) => (
            <Badge key={idx} className="bg-gradient-to-r from-[#e5a00d]/20 to-[#fcd34d]/20 text-amber-400 border border-amber-400/30 text-[10px]">
              {idx + 1}. {step.action}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {growthStrategy.engagement.tactics.slice(0, 4).map((tactic, idx) => (
            <Badge key={idx} variant="outline" className="border-accent/20 text-foreground text-[10px]">
              {tactic}
            </Badge>
          ))}
        </div>
      </div>

      {/* === MONETIZATION SECTION === */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b border-amber-300/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f0b429] to-[#fde68a] flex items-center justify-center shadow-lg">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Monetization</h3>
            <p className="text-[10px] text-muted-foreground">Revenue streams & contract values</p>
          </div>
          <Badge className="ml-auto bg-amber-300/10 text-amber-300 border-amber-300/20 text-[9px]">
            Conv: {growthStrategy.monetization.conversionTarget}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {growthStrategy.monetization.revenueStreams.map((stream, idx) => (
            <Card key={idx} className="bg-gradient-to-b from-amber-300/8 to-transparent border-amber-300/20 overflow-hidden">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-[#f0b429] to-[#fde68a] bg-clip-text text-transparent">
                  {stream.percentage}%
                </p>
                <p className="text-xs text-foreground mt-1">{stream.stream}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-b from-accent/8 to-transparent border-accent/20">
            <CardContent className="p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Contract Value</span>
              <p className="text-lg font-bold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent mt-1">
                {growthStrategy.monetization.averageContractValue}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-accent/8 to-transparent border-accent/20">
            <CardContent className="p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Expansion Target</span>
              <p className="text-lg font-bold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent mt-1">
                {growthStrategy.monetization.expansionRevenueTarget}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* === RETENTION SECTION === */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b border-orange-400/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#f97316] flex items-center justify-center shadow-lg">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Retention</h3>
            <p className="text-[10px] text-muted-foreground">Customer loyalty & churn prevention</p>
          </div>
          <Badge className="ml-auto bg-orange-400/10 text-orange-400 border-orange-400/20 text-[9px]">
            Churn: {growthStrategy.retention.targetChurn}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-b from-orange-400/8 to-transparent border-orange-400/20">
            <CardContent className="p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">NPS Target</span>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#ea580c] to-[#f97316] bg-clip-text text-transparent">
                {growthStrategy.retention.npsTarget}+
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-orange-400/8 to-transparent border-orange-400/20">
            <CardContent className="p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Churn Reasons</span>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#ea580c] to-[#f97316] bg-clip-text text-transparent">
                {growthStrategy.retention.churnReasons.length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          {growthStrategy.retention.strategies.slice(0, 2).map((strategy, idx) => (
            <Card key={idx} className="bg-gradient-to-b from-accent/5 to-transparent border-accent/20">
              <CardContent className="p-3">
                <span className="text-xs font-medium text-foreground">{strategy.strategy}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{strategy.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* === COMPETITIVE ADVANTAGES PREMIUM === */}
      <Card className="bg-gradient-to-b from-accent/10 to-transparent border-accent/30 overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.08)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Your Competitive Advantages</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {competitiveAdvantages.map((adv, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gradient-to-b from-accent/8 to-transparent border border-accent/20 text-center hover:border-accent/40 transition-all hover:-translate-y-0.5">
                <h4 className="font-medium bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent text-xs mb-1">
                  {adv.advantage}
                </h4>
                <Badge className="bg-accent/10 text-muted-foreground border-accent/20 text-[9px]">
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
