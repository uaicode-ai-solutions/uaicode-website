import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, TrendingUp, Target, Calendar, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["hsl(var(--accent))", "hsl(45, 100%, 45%)", "hsl(142, 76%, 36%)", "hsl(280, 67%, 60%)"];

const PaidMediaCards = () => {
  const { paidMediaDiagnosis, paidMediaActionPlan } = competitorAnalysisData;

  const budgetData = paidMediaActionPlan.channels.map((channel, idx) => ({
    name: channel.name,
    value: channel.allocation,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
          <Megaphone className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Paid Media Intelligence</h2>
          <p className="text-muted-foreground">Competitive ad landscape and recommended strategy</p>
        </div>
      </div>

      {/* Competitor Media Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paidMediaDiagnosis.competitors.map((competitor, idx) => (
          <Card key={idx} className="glass-premium border-accent/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{competitor.name}</CardTitle>
                <Badge className="bg-accent/10 text-accent border-accent/20">{competitor.estimatedBudget}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {competitor.platforms.map((platform, i) => (
                  <Badge key={i} className="bg-accent/10 text-accent border-accent/20">
                    {platform.name}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-accent">
                    <CheckCircle className="h-3 w-3" />Strengths
                  </div>
                  {competitor.strengths.slice(0, 2).map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {s}</p>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-red-400">
                    <AlertTriangle className="h-3 w-3" />Weaknesses
                  </div>
                  {competitor.weaknesses.slice(0, 2).map((w, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {w}</p>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-accent/10">
                <div className="flex items-center gap-1 text-xs font-medium text-accent mb-2">
                  <Lightbulb className="h-3 w-3" />Opportunities
                </div>
                <div className="flex flex-wrap gap-1">
                  {competitor.opportunities.map((o, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] bg-accent/10 text-accent border-accent/20">{o}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Gaps */}
      <Card className="glass-premium border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />Market Gaps & Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paidMediaDiagnosis.marketGaps.map((gap, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent">{idx + 1}</span>
                </div>
                <p className="text-sm text-foreground">{gap.gap}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Allocation & Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recommended Budget Allocation</CardTitle>
              <Badge className="bg-accent text-accent-foreground">{paidMediaActionPlan.totalBudget}/mo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--accent) / 0.2)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {paidMediaActionPlan.channels.map((channel, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-accent/5 border border-accent/10">
                  <span className="text-sm">{channel.name}</span>
                  <span className="text-sm font-medium text-accent">{channel.budget}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-premium border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />Campaign Phases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paidMediaActionPlan.campaigns.map((phase, idx) => (
              <div key={idx} className="relative pl-6 pb-4 last:pb-0">
                {idx < paidMediaActionPlan.campaigns.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-accent/20" />
                )}
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-[10px] font-bold text-accent-foreground">{idx + 1}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{phase.phase}</span>
                    <Badge variant="outline" className="text-xs border-accent/20 text-accent">{phase.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{phase.objective}</p>
                  <div className="flex flex-wrap gap-1">
                    {phase.channels.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] bg-accent/10 text-accent border-accent/20">{c}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="glass-premium border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />90-Day Implementation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paidMediaActionPlan.timeline.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">{idx + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.week}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.action}</p>
                <div className="flex flex-wrap gap-1">
                  {item.deliverables.slice(0, 2).map((d, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] border-accent/20 text-accent">{d}</Badge>
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
