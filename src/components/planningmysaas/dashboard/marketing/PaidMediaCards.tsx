import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";


// Paleta monocromática dourada - variações de intensidade
const COLORS = [
  "hsl(38, 92%, 50%)",   // Dourado intenso
  "hsl(38, 85%, 58%)",   // Dourado médio
  "hsl(38, 75%, 65%)",   // Dourado claro
  "hsl(38, 65%, 72%)"    // Dourado suave
];

const PaidMediaCards = () => {
  const { paidMediaDiagnosis, paidMediaActionPlan } = competitorAnalysisData;

  const budgetData = paidMediaActionPlan.channels.map((channel, idx) => ({
    name: channel.name,
    value: channel.allocation,
    color: COLORS[idx % COLORS.length],
    budget: channel.budget,
  }));

  const timeline = [
    { week: "Week 1-2", milestone: "Setup & Launch", status: "active" },
    { week: "Week 3-4", milestone: "Initial Optimization", status: "pending" },
    { week: "Week 5-8", milestone: "Scale Winners", status: "pending" },
    { week: "Week 9-12", milestone: "Full Optimization", status: "pending" },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header - Compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Megaphone className="h-4 w-4 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Paid Media Intelligence
            <InfoTooltip term="Paid Media" size="sm">
              Ad spend analysis across Google, Meta, LinkedIn, and TikTok.
            </InfoTooltip>
          </h2>
        </div>
        <Badge className="bg-accent text-accent-foreground text-xs">{paidMediaActionPlan.totalBudget}/mo</Badge>
      </div>

      {/* 2-Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Competitor Analysis - Compact Grid */}
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Competitor Landscape</h3>
            <div className="space-y-3">
              {paidMediaDiagnosis.competitors.slice(0, 3).map((comp, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-accent/5 border border-accent/10">
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

        {/* Budget Allocation - Premium Design */}
        <Card className="glass-premium border-accent/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Your Budget Allocation</h3>
            
            {/* Container Premium - Fundo escuro sólido com anel dourado */}
            <div className="relative flex items-center justify-center py-2">
              {/* Fundo escuro circular */}
              <div className="relative w-48 h-48 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                
                {/* Anel dourado externo */}
                <div className="absolute inset-1 rounded-full border-2 border-accent/50" />
                
                {/* PieChart Container */}
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={budgetData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={35} 
                        outerRadius={60} 
                        paddingAngle={2} 
                        dataKey="value"
                        stroke="none"
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string, props: { payload: { budget: string } }) => [props.payload.budget, name]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--accent) / 0.3)", 
                          borderRadius: "8px", 
                          fontSize: "11px"
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Valor Central - Total Budget */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold text-accent">{paidMediaActionPlan.totalBudget.replace('/mo', '')}</span>
                  <span className="text-[9px] text-muted-foreground">/month</span>
                </div>
              </div>
            </div>
            
            {/* Legenda monocromática dourada */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {paidMediaActionPlan.channels.map((channel, idx) => {
                const opacities = ["border-l-[hsl(38,92%,50%)]", "border-l-[hsl(38,85%,58%)]", "border-l-[hsl(38,75%,65%)]", "border-l-[hsl(38,65%,72%)]"];
                
                return (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-lg bg-accent/5 border-l-4 ${opacities[idx % 4]} transition-all duration-200 hover:bg-accent/10`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{channel.name}</span>
                      <span className="text-xs font-bold text-accent">{channel.budget}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{channel.allocation}% of budget</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 90-Day Timeline - Horizontal */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 text-center">90-Day Implementation</h3>
          <div className="flex items-center justify-between">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    item.status === 'active' 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted/30 text-muted-foreground'
                  }`}>
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <span className="text-[10px] font-medium text-accent">{item.week}</span>
                  <span className="text-xs text-foreground">{item.milestone}</span>
                </div>
                {idx < timeline.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-accent/30 mx-1" />
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
