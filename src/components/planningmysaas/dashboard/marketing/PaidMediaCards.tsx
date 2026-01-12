import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";


// Gradientes premium para cada fatia do donut
const GRADIENTS = [
  { id: "budgetGrad0", start: "hsl(32, 95%, 44%)", end: "hsl(45, 100%, 55%)" },   // Laranja -> Dourado
  { id: "budgetGrad1", start: "hsl(38, 90%, 48%)", end: "hsl(50, 95%, 60%)" },    // Dourado -> Amarelo
  { id: "budgetGrad2", start: "hsl(35, 85%, 52%)", end: "hsl(48, 90%, 62%)" },    // Dourado médio
  { id: "budgetGrad3", start: "hsl(40, 80%, 56%)", end: "hsl(52, 85%, 68%)" },    // Dourado claro
];

const PaidMediaCards = () => {
  const { paidMediaDiagnosis, paidMediaActionPlan } = competitorAnalysisData;

  const budgetData = paidMediaActionPlan.channels.map((channel, idx) => ({
    name: channel.name,
    value: channel.allocation,
    gradientId: `url(#${GRADIENTS[idx % GRADIENTS.length].id})`,
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
            
            {/* Container Premium */}
            <div className="relative flex items-center justify-center py-4">
              {/* Fundo escuro circular premium */}
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#1c1917] via-[#0f0f0f] to-[#1c1917] flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.12),inset_0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500">
                
                {/* PieChart Container */}
                <div className="w-60 h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {/* Definições de gradientes SVG */}
                      <defs>
                        {GRADIENTS.map((grad) => (
                          <linearGradient key={grad.id} id={grad.id} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={grad.start} />
                            <stop offset="100%" stopColor={grad.end} />
                          </linearGradient>
                        ))}
                        <filter id="budgetGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <Pie 
                        data={budgetData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={45} 
                        outerRadius={100} 
                        paddingAngle={1} 
                        dataKey="value"
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                        cornerRadius={6}
                      >
                        {budgetData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.gradientId}
                            style={{ filter: 'url(#budgetGlow)' }}
                          />
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
                
                {/* Centro vazio com acabamento premium */}
                <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-accent/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
            
            {/* Legenda premium com gradientes */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {paidMediaActionPlan.channels.map((channel, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${GRADIENTS[idx % GRADIENTS.length].start}, ${GRADIENTS[idx % GRADIENTS.length].end})` 
                      }}
                    />
                    <span className="text-xs font-semibold text-foreground">{channel.name}</span>
                  </div>
                  <div className="flex items-center justify-between pl-5">
                    <span className="text-sm font-bold text-accent">{channel.budget}</span>
                    <span className="text-[10px] text-muted-foreground bg-accent/10 px-1.5 py-0.5 rounded-full">{channel.allocation}%</span>
                  </div>
                </div>
              ))}
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
