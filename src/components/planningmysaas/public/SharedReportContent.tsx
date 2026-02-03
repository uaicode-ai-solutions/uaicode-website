import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Hash, 
  Globe,
  Target,
  Crosshair,
  DollarSign,
  Scale,
  Clock,
  CheckCircle2,
  Wallet,
  BadgePercent,
  BarChart3,
  FileText,
  ArrowRight,
} from "lucide-react";
import { BusinessPlanSection } from "@/types/report";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// ==========================================
// Viability Score Badge Styling
// ==========================================
const getViabilityStyle = (score: number) => {
  if (score >= 80) return {
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
  };
  if (score >= 60) return {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  };
  return {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
  };
};

const CHART_COLORS = ["#F59E0B", "#D97706", "#B45309"];

// ==========================================
// Main SharedReportContent Component
// ==========================================
interface SharedReportContentProps {
  businessPlan: BusinessPlanSection;
}

const SharedReportContent = ({ businessPlan }: SharedReportContentProps) => {
  const viabilityStyle = getViabilityStyle(businessPlan.viability_score || 0);
  
  // Extract AI-generated content
  const narrative = businessPlan.ai_executive_narrative;
  const verdict = businessPlan.ai_strategic_verdict;
  const recommendations = businessPlan.ai_key_recommendations || [];
  const insights = businessPlan.ai_section_insights;
  
  // Check if we have the new structured format
  const hasStructuredContent = narrative || verdict;

  // For legacy support, extract chart data if available
  const chartsData = businessPlan.charts_data;
  const marketSizing = chartsData?.market_sizing;
  
  // Parse chart data for visualization
  const parseValue = (val: string | undefined): number => {
    if (!val) return 0;
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (val.toLowerCase().includes("b")) return num * 1000;
    if (val.toLowerCase().includes("m")) return num;
    if (val.toLowerCase().includes("k")) return num / 1000;
    return num;
  };

  const marketChartData = marketSizing ? [
    { name: "TAM", value: parseValue(marketSizing.tam), label: marketSizing.tam },
    { name: "SAM", value: parseValue(marketSizing.sam), label: marketSizing.sam },
    { name: "SOM", value: parseValue(marketSizing.som), label: marketSizing.som },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-8">
      {/* Header Card with Viability Score */}
      <Card className="glass-card border-accent/20 overflow-hidden">
        <div className="bg-gradient-to-r from-accent/20 to-accent/5 border-b border-accent/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title + Subtitle */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient-gold">
                {businessPlan.title || "Business Plan"}
              </h1>
              {businessPlan.subtitle && (
                <p className="text-muted-foreground mt-1">{businessPlan.subtitle}</p>
              )}
            </div>

            {/* Viability Score Badge */}
            <Badge 
              className={`inline-flex items-center gap-2 px-4 py-2 ${viabilityStyle.bg} ${viabilityStyle.border} border`}
            >
              <TrendingUp className={`h-5 w-5 ${viabilityStyle.text}`} />
              <span className={`font-semibold ${viabilityStyle.text}`}>
                {businessPlan.viability_label || "Score"}: {businessPlan.viability_score || 0}/100
              </span>
            </Badge>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            {businessPlan.generated_at && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Generated: {new Date(businessPlan.generated_at).toLocaleDateString()}</span>
              </div>
            )}
            {businessPlan.word_count && (
              <div className="flex items-center gap-1.5">
                <Hash className="h-4 w-4" />
                <span>{businessPlan.word_count.toLocaleString()} words</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Executive Narrative (AI Generated) */}
      {narrative && (
        <Card className="glass-card border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{narrative}</p>
            {insights?.market_insight && (
              <div className="mt-4 p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
                <p className="text-sm text-foreground italic">"{insights.market_insight}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Market Sizing Chart (if available) */}
      {marketChartData.length > 0 && (
        <Card className="glass-card border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Market Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Size Cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/10 border border-border/20">
                  <Globe className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">TAM</p>
                    <p className="text-xl font-bold text-foreground">{marketSizing?.tam}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/10 border border-border/20">
                  <Target className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">SAM</p>
                    <p className="text-xl font-bold text-foreground">{marketSizing?.sam}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/10 border border-border/20">
                  <Crosshair className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">SOM</p>
                    <p className="text-xl font-bold text-foreground">{marketSizing?.som}</p>
                  </div>
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {marketChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--accent) / 0.3)",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(_, name, props) => [props.payload.label, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Verdict (AI Generated) */}
      {verdict && (
        <Card className={`glass-card ${viabilityStyle.border} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className={`h-5 w-5 ${viabilityStyle.text}`} />
              Strategic Verdict
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-5 rounded-lg ${viabilityStyle.bg} border ${viabilityStyle.border}`}>
              <p className="text-foreground leading-relaxed">{verdict}</p>
            </div>
            
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-accent" />
                  Next Steps
                </h4>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/10 border border-border/20"
                    >
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default SharedReportContent;
