import { DollarSign, Calendar, Target, Palette, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const PaidMediaActionPlan = () => {
  const { paidMediaActionPlan } = competitorAnalysisData;

  return (
    <div className="space-y-6">
      {/* Header with Total Budget */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Paid Media Action Plan</h3>
          <p className="text-sm text-muted-foreground">Strategic roadmap for your advertising campaigns</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Recommended Monthly Budget</p>
          <p className="text-2xl font-bold text-accent">{paidMediaActionPlan.totalBudget}</p>
        </div>
      </div>

      {/* Channel Allocation */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-5 w-5 text-accent" />
            Channel Budget Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paidMediaActionPlan.channels.map((channel, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {channel.priority}
                  </Badge>
                  <div>
                    <p className="font-medium text-foreground">{channel.name}</p>
                    <p className="text-xs text-muted-foreground">{channel.focus}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">{channel.budget}</p>
                  <p className="text-xs text-muted-foreground">ROAS: {channel.expectedROAS}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={channel.allocation} className="flex-1 h-2" />
                <span className="text-sm font-medium w-10 text-right">{channel.allocation}%</span>
              </div>
              <div className="flex flex-wrap gap-1 pl-9">
                {channel.keyMetrics.map((metric, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{metric}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Campaign Phases */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-accent" />
            Campaign Phases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {paidMediaActionPlan.campaigns.map((campaign, index) => (
              <Card 
                key={index} 
                className={`bg-background/50 border-border/30 ${
                  index === 1 ? 'ring-2 ring-accent/50' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`${
                        index === 0 ? 'bg-blue-500/20 text-blue-600' : 
                        index === 1 ? 'bg-accent text-accent-foreground' : 
                        'bg-green-500/20 text-green-600'
                      }`}
                    >
                      {campaign.phase}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{campaign.budgetAllocation}% budget</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{campaign.duration}</p>
                  <p className="text-sm font-medium text-foreground">{campaign.objective}</p>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Channels</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.channels.map((ch, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{ch}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">KPIs</p>
                    <ul className="space-y-1">
                      {campaign.kpis.map((kpi, i) => (
                        <li key={i} className="text-xs text-foreground/80 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-accent flex-shrink-0" />
                          {kpi}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creative Strategy */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-5 w-5 text-accent" />
            Creative Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paidMediaActionPlan.creatives.map((creative, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-muted/30 border border-border/30 space-y-2"
              >
                <h4 className="font-medium text-foreground">{creative.type}</h4>
                <p className="text-xs text-muted-foreground">{creative.format}</p>
                <p className="text-xs text-accent">{creative.quantity}</p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {creative.platforms.map((p, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                  ))}
                </div>
                <div className="pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">Themes:</p>
                  <ul className="mt-1 space-y-0.5">
                    {creative.themes.map((t, i) => (
                      <li key={i} className="text-xs text-foreground/80">• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-accent" />
            90-Day Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {paidMediaActionPlan.timeline.map((item, index) => (
                <div key={index} className="relative pl-10">
                  <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                    index === paidMediaActionPlan.timeline.length - 1 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted border-2 border-border'
                  }`}>
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{item.week}</Badge>
                      <Badge className="bg-accent/20 text-accent">{item.milestone}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{item.action}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.deliverables.map((d, i) => (
                        <span key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expected Results */}
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Expected Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Month 3 */}
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <h4 className="font-semibold text-foreground mb-3">After 3 Months</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(paidMediaActionPlan.expectedResults.month3).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-lg font-bold text-accent">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Month 6 */}
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <h4 className="font-semibold text-foreground mb-3">After 6 Months</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(paidMediaActionPlan.expectedResults.month6).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-lg font-bold text-accent">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaidMediaActionPlan;
