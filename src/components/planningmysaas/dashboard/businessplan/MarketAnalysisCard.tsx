import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Globe, Target, Crosshair, ArrowUpRight } from "lucide-react";
import { OpportunitySection } from "@/types/report";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface MarketAnalysisCardProps {
  opportunity: OpportunitySection | null | undefined;
  insight?: string;
}

const CHART_COLORS = ["#F59E0B", "#D97706", "#B45309"];

const MarketAnalysisCard: React.FC<MarketAnalysisCardProps> = ({
  opportunity,
  insight,
}) => {
  if (!opportunity) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Market data will appear once the analysis is complete...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Parse numeric values for chart
  const parseValue = (val: string | undefined): number => {
    if (!val) return 0;
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    // Handle billions/millions
    if (val.toLowerCase().includes("b")) return num * 1000;
    if (val.toLowerCase().includes("m")) return num;
    if (val.toLowerCase().includes("k")) return num / 1000;
    return num;
  };

  const chartData = [
    { name: "TAM", value: parseValue(opportunity.tam_value), label: opportunity.tam_value },
    { name: "SAM", value: parseValue(opportunity.sam_value), label: opportunity.sam_value },
    { name: "SOM", value: parseValue(opportunity.som_value), label: opportunity.som_value },
  ].filter(d => d.value > 0);

  const macroTrends = opportunity.macro_trends?.slice(0, 3) || [];

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Market Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Size Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Market Size Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/10 border border-border/20">
              <Globe className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Total Addressable Market (TAM)</p>
                <p className="text-xl font-bold text-foreground">{opportunity.tam_value || "..."}</p>
                {opportunity.tam_description && (
                  <p className="text-xs text-muted-foreground mt-1">{opportunity.tam_description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/10 border border-border/20">
              <Target className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Serviceable Addressable Market (SAM)</p>
                <p className="text-xl font-bold text-foreground">{opportunity.sam_value || "..."}</p>
                {opportunity.sam_description && (
                  <p className="text-xs text-muted-foreground mt-1">{opportunity.sam_description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/10 border border-border/20">
              <Crosshair className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Serviceable Obtainable Market (SOM)</p>
                <p className="text-xl font-bold text-foreground">{opportunity.som_value || "..."}</p>
                {opportunity.som_description && (
                  <p className="text-xs text-muted-foreground mt-1">{opportunity.som_description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
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
          )}
        </div>

        {/* Market Growth Rate */}
        {opportunity.market_growth_rate && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Market Growth Rate (CAGR):</span>
              <span className="font-bold text-accent">{opportunity.market_growth_rate}</span>
            </div>
          </div>
        )}

        {/* Macro Trends */}
        {macroTrends.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Key Market Trends</h4>
            <div className="grid gap-2">
              {macroTrends.map((trend, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg bg-muted/10 border border-border/20"
                >
                  <TrendingUp className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{trend.trend}</p>
                    {trend.impact && (
                      <p className="text-xs text-muted-foreground mt-1">{trend.impact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight */}
        {insight && (
          <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
            <p className="text-sm text-foreground italic">"{insight}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketAnalysisCard;
