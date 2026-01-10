import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, TrendingUp, Target, Calendar, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const COLORS = ["hsl(var(--accent))", "hsl(45, 100%, 45%)", "hsl(142, 76%, 36%)", "hsl(280, 67%, 60%)"];

const PaidMediaCards = () => {
  const { paidMediaDiagnosis, paidMediaActionPlan } = competitorAnalysisData;

  const budgetData = paidMediaActionPlan.channels.map((channel, idx) => ({
    name: channel.name,
    value: channel.allocation,
    color: COLORS[idx % COLORS.length],
    budget: channel.budget,
  }));

  const totalBudget = paidMediaActionPlan.totalBudget;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Megaphone className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Paid Media Intelligence
            <InfoTooltip term="Paid Media">
              Advertising spend across platforms like Google Ads, Facebook, LinkedIn, and TikTok to drive traffic and conversions.
            </InfoTooltip>
          </h2>
          <p className="text-sm text-muted-foreground">Competitive ad landscape and recommended strategy</p>
        </div>
      </div>

      {/* Competitor Media Analysis - Condensed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paidMediaDiagnosis.competitors.slice(0, 2).map((competitor, idx) => (
          <Card key={idx} className="glass-premium border-accent/20">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{competitor.name}</CardTitle>
                <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">{competitor.estimatedBudget}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="flex flex-wrap gap-1">
                {competitor.platforms.map((platform, i) => (
                  <Badge key={i} className="bg-accent/10 text-accent border-accent/20 text-[10px]">
                    {platform.name}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-accent">
                    <CheckCircle className="h-2.5 w-2.5" />Strengths
                  </div>
                  {competitor.strengths.slice(0, 2).map((s, i) => (
                    <p key={i} className="text-[10px] text-muted-foreground">• {s}</p>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-red-400">
                    <AlertTriangle className="h-2.5 w-2.5" />Weaknesses
                  </div>
                  {competitor.weaknesses.slice(0, 2).map((w, i) => (
                    <p key={i} className="text-[10px] text-muted-foreground">• {w}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Gaps */}
      <Card className="glass-premium border-accent/20">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            Market Gaps & Opportunities
            <InfoTooltip term="Market Gaps">
              Underserved areas in competitor ad strategy where you can gain an advantage with targeted campaigns.
            </InfoTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {paidMediaDiagnosis.marketGaps.map((gap, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-accent">{idx + 1}</span>
                </div>
                <p className="text-xs text-foreground">{gap.gap}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Allocation & Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                Budget Allocation
                <InfoTooltip term="Budget Allocation">
                  Recommended distribution of your ad spend across platforms based on your ICP and competitive analysis.
                </InfoTooltip>
              </CardTitle>
              <Badge className="bg-accent text-accent-foreground text-xs">{totalBudget}/mo</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={budgetData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={75} 
                    paddingAngle={3} 
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                    labelLine={false}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: { payload: { budget: string } }) => [props.payload.budget, name]}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--accent) / 0.2)", borderRadius: "8px", fontSize: "12px" }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {paidMediaActionPlan.channels.map((channel, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-xs">{channel.name}</span>
                  </div>
                  <span className="text-xs font-medium text-accent">{channel.budget}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />Campaign Phases
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            {paidMediaActionPlan.campaigns.map((phase, idx) => (
              <div key={idx} className="relative pl-5 pb-3 last:pb-0">
                {idx < paidMediaActionPlan.campaigns.length - 1 && (
                  <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-accent/20" />
                )}
                <div className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-[8px] font-bold text-accent-foreground">{idx + 1}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm">{phase.phase}</span>
                    <Badge variant="outline" className="text-[10px] border-accent/20 text-accent">{phase.duration}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{phase.objective}</p>
                  <div className="flex flex-wrap gap-1">
                    {phase.channels.slice(0, 3).map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-[9px] bg-accent/10 text-accent border-accent/20">{c}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Timeline - Compact */}
      <Card className="glass-premium border-accent/20">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />90-Day Implementation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {paidMediaActionPlan.timeline.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-accent">{idx + 1}</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{item.week}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5">{item.action}</p>
                <div className="flex flex-wrap gap-1">
                  {item.deliverables.slice(0, 2).map((d, i) => (
                    <Badge key={i} variant="outline" className="text-[9px] border-accent/20 text-accent">{d}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PaidMediaCards;
