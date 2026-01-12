import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, CheckCircle, AlertTriangle, ArrowRight, Calendar, Zap } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const COLORS = ["hsl(var(--accent))", "hsl(32, 85%, 55%)", "hsl(38, 80%, 60%)", "hsl(45, 75%, 65%)"];

const PaidMediaCards = () => {
  const { paidMediaDiagnosis, paidMediaActionPlan } = competitorAnalysisData;

  const budgetData = paidMediaActionPlan.channels.map((channel, idx) => ({
    name: channel.name,
    value: channel.allocation,
    budget: channel.budget,
  }));

  const timeline = [
    { week: "Week 1-2", milestone: "Setup & Launch", status: "active" },
    { week: "Week 3-4", milestone: "Initial Optimization", status: "pending" },
    { week: "Week 5-8", milestone: "Scale Winners", status: "pending" },
    { week: "Week 9-12", milestone: "Full Optimization", status: "pending" },
  ];

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Megaphone className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Paid Media Intelligence</h2>
            <InfoTooltip term="Paid Media" size="sm">
              Ad spend analysis across Google, Meta, LinkedIn, and TikTok.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Competitor analysis and recommended budget allocation</p>
        </div>
        <Badge className="bg-accent text-accent-foreground text-xs">{paidMediaActionPlan.totalBudget}/mo</Badge>
      </div>

      {/* 2-Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competitor Analysis */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Competitor Landscape</h3>
            <div className="space-y-3">
              {paidMediaDiagnosis.competitors.slice(0, 3).map((comp, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/10 border border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{comp.name}</span>
                    <Badge variant="outline" className="text-[10px] border-accent/20 text-accent">
                      {comp.estimatedBudget}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <div className="flex items-center gap-1 text-accent mb-1">
                        <CheckCircle className="h-2.5 w-2.5" />
                        <span className="font-medium">Strengths</span>
                      </div>
                      {comp.strengths.slice(0, 2).map((s, i) => (
                        <p key={i} className="text-muted-foreground truncate">• {s}</p>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-red-400 mb-1">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        <span className="font-medium">Gaps</span>
                      </div>
                      {comp.weaknesses.slice(0, 2).map((w, i) => (
                        <p key={i} className="text-muted-foreground truncate">• {w}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Allocation */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Your Budget Allocation</h3>
            
            <div className="relative flex items-center justify-center py-4">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={budgetData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={40} 
                      outerRadius={80} 
                      paddingAngle={2} 
                      dataKey="value"
                      stroke="hsl(var(--border))"
                      strokeWidth={1}
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: { payload: { budget: string } }) => [props.payload.budget, name]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border) / 0.3)", 
                        borderRadius: "8px", 
                        fontSize: "11px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {paidMediaActionPlan.channels.map((channel, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/10 border border-border/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-xs font-medium text-foreground">{channel.name}</span>
                  </div>
                  <div className="flex items-center justify-between pl-5">
                    <span className="text-sm font-bold text-accent">{channel.budget}</span>
                    <span className="text-[10px] text-muted-foreground">{channel.allocation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 90-Day Timeline */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">90-Day Implementation</h3>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-[10px]">
              <Zap className="h-3 w-3 mr-1" />
              AI-Accelerated
            </Badge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {timeline.map((item, idx) => (
              <div 
                key={idx} 
                className={`relative p-4 rounded-lg border transition-all ${
                  item.status === 'active' 
                    ? 'bg-accent/10 border-accent/30' 
                    : 'bg-muted/10 border-border/20 hover:border-border/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    item.status === 'active'
                      ? 'bg-accent/20 border-accent/40'
                      : 'bg-muted/20 border-border/30'
                  }`}>
                    {item.status === 'active' 
                      ? <Zap className="h-4 w-4 text-accent" />
                      : <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                    }
                  </div>
                  {item.status === 'active' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[9px]">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-medium text-accent">{item.week}</span>
                  <p className="text-sm font-medium text-foreground">{item.milestone}</p>
                </div>
                
                {idx < timeline.length - 1 && (
                  <div className="hidden lg:flex absolute -right-1.5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PaidMediaCards;
