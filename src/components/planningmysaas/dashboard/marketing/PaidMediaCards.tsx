import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, CheckCircle, AlertTriangle, ArrowRight, Calendar, Zap, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { PaidMediaIntelligenceSection } from "@/types/report";

interface CompetitorData {
  company_name?: string;
  differentiators?: string[];
  weaknesses?: string[];
  [key: string]: unknown;
}

interface CompetitiveAnalysisData {
  competitors?: Record<string, CompetitorData>;
  [key: string]: unknown;
}

const COLORS = ["hsl(var(--accent))", "hsl(32, 85%, 55%)", "hsl(38, 80%, 60%)", "hsl(45, 75%, 65%)"];

const PaidMediaCards = () => {
  const { reportData } = useReportContext();

  // Parse sections from database
  const paidMediaData = parseJsonField<PaidMediaIntelligenceSection | null>(
    reportData?.paid_media_intelligence_section,
    null
  );

  const competitiveData = parseJsonField<CompetitiveAnalysisData | null>(
    reportData?.competitive_analysis_section,
    null
  );

  const hasData = !!paidMediaData?.budget_strategy || !!paidMediaData?.channel_recommendations;

  // Total budget
  const totalBudget = hasData && paidMediaData?.budget_strategy?.recommended_marketing_budget_monthly
    ? paidMediaData.budget_strategy.recommended_marketing_budget_monthly
    : "...";

  // Budget allocation for pie chart
  const budgetData = hasData && paidMediaData?.budget_strategy?.channel_allocation
    ? Object.entries(paidMediaData.budget_strategy.channel_allocation).map(([name, allocation]) => ({
        name,
        value: typeof allocation === 'string' 
          ? parseInt(allocation.replace('%', '')) || 0 
          : typeof allocation === 'number' ? allocation : 0,
        budget: typeof allocation === 'string' ? allocation : `${allocation}%`,
      }))
    : [];

  // Channel recommendations for legend (use channel field from the interface)
  const channels = hasData && paidMediaData?.channel_recommendations?.length
    ? paidMediaData.channel_recommendations.slice(0, 4).map(ch => ({
        name: ch.channel || "...",
        allocation: 25, // Default even distribution if no specific allocation
        budget: ch.expected_cac || "..."
      }))
    : [];

  // If no budget data but has channels, create budget data from channels
  const displayBudgetData = budgetData.length > 0 
    ? budgetData 
    : channels.length > 0 
      ? channels.map((ch) => ({
          name: ch.name,
          value: ch.allocation,
          budget: `${ch.allocation}%`
        }))
      : [];

  // Competitor landscape from competitive analysis
  const competitors = competitiveData?.competitors
    ? Object.values(competitiveData.competitors).slice(0, 2).map((c: CompetitorData) => ({
        name: c.company_name || "...",
        estimatedBudget: "...",
        strengths: c.differentiators?.slice(0, 2) || [],
        weaknesses: c.weaknesses?.slice(0, 2) || [],
      }))
    : [];

  // Timeline - static structure with dynamic status
  const timeline = [
    { week: "Week 1-2", milestone: "Setup & Launch", status: "active", kpi: "Tracking live" },
    { week: "Week 3-4", milestone: "Initial Optimization", status: "pending", kpi: "First data" },
    { week: "Week 5-8", milestone: "Scale Winners", status: "pending", kpi: "2x budget" },
    { week: "Week 9-12", milestone: "Full Optimization", status: "pending", kpi: "3.5x ROAS" },
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
        <Badge className="bg-accent text-accent-foreground text-xs">{totalBudget}/mo</Badge>
      </div>

      {/* 2-Column Layout - Consolidated */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Competitor Analysis + Budget Overview */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            {/* Competitor Landscape */}
            <div className="mb-4 pb-4 border-b border-border/20">
              <h3 className="font-semibold text-foreground text-sm mb-3">Competitor Landscape</h3>
              {competitors.length > 0 ? (
                <div className="space-y-2">
                  {competitors.map((comp, idx) => (
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
                          {comp.strengths.length > 0 ? (
                            comp.strengths.map((s, i) => (
                              <p key={i} className="text-muted-foreground truncate">• {s}</p>
                            ))
                          ) : (
                            <p className="text-muted-foreground">...</p>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-destructive mb-1">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            <span className="font-medium">Gaps</span>
                          </div>
                          {comp.weaknesses.length > 0 ? (
                            comp.weaknesses.map((w, i) => (
                              <p key={i} className="text-muted-foreground truncate">• {w}</p>
                            ))
                          ) : (
                            <p className="text-muted-foreground">...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-4">...</div>
              )}
            </div>

            {/* Budget Allocation - Compact */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Your Budget Allocation</h3>
              <div className="flex items-center gap-4">
                {/* Mini Pie Chart */}
                {displayBudgetData.length > 0 ? (
                  <>
                    <div className="w-24 h-24 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={displayBudgetData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={20} 
                            outerRadius={40} 
                            paddingAngle={2} 
                            dataKey="value"
                            stroke="hsl(var(--border))"
                            strokeWidth={1}
                          >
                            {displayBudgetData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number, name: string, props: { payload: { budget: string } }) => [props.payload.budget, name]}
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              border: "1px solid hsl(var(--border) / 0.3)", 
                              borderRadius: "8px", 
                              fontSize: "10px"
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex-1 grid grid-cols-2 gap-1.5">
                      {displayBudgetData.map((channel, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded bg-muted/10 border border-border/20">
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="text-[10px] text-foreground truncate">{channel.name}</span>
                          <span className="text-[10px] font-bold text-accent ml-auto">{channel.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center text-muted-foreground text-sm py-8">...</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: 90-Day Implementation - Expanded */}
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

            <div className="space-y-3">
              {timeline.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`relative p-3 rounded-lg border ${
                    item.status === 'active' 
                      ? 'bg-accent/10 border-accent/30' 
                      : 'bg-muted/10 border-border/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                      item.status === 'active'
                        ? 'bg-accent/20 border-accent/40'
                        : 'bg-muted/20 border-border/30'
                    }`}>
                      {item.status === 'active' 
                        ? <Zap className="h-4 w-4 text-accent" />
                        : <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                      }
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-accent">{item.week}</span>
                        {item.status === 'active' && (
                          <Badge className="bg-success/20 text-success border-success/30 text-[9px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.milestone}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Target className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{item.kpi}</span>
                      </div>
                    </div>
                    
                    {idx < timeline.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PaidMediaCards;
