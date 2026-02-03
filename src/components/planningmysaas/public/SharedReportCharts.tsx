import { TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BusinessPlanChartsData } from "@/types/report";

// ==========================================
// Chart Color Palette (Gold/Amber theme)
// ==========================================
const CHART_COLORS = [
  "#F59E0B", // amber-500
  "#D97706", // amber-600
  "#B45309", // amber-700
  "#92400E", // amber-800
  "#78350F", // amber-900
];

// ==========================================
// Chart Renderer Component
// ==========================================
interface SharedChartRendererProps {
  type: string;
  data: BusinessPlanChartsData;
}

export const SharedChartRenderer = ({ type, data }: SharedChartRendererProps) => {
  switch (type) {
    case "market_sizing":
      return <SharedMarketSizingChart data={data.market_sizing} />;
    case "financial_projections":
      return <SharedFinancialProjectionsChart data={data.financial_projections} />;
    case "competitor_pricing":
      return <SharedCompetitorPricingChart data={data.competitor_pricing} />;
    case "investment_breakdown":
      return <SharedInvestmentBreakdownChart data={data.investment_breakdown} />;
    case "roadmap_timeline":
      return <SharedRoadmapTimelineChart data={data.roadmap_timeline} />;
    default:
      return (
        <div className="p-4 bg-muted/20 rounded-lg text-muted-foreground text-sm">
          Chart type "{type}" not supported
        </div>
      );
  }
};

// ==========================================
// Market Sizing Donut Chart (TAM/SAM/SOM)
// ==========================================
const SharedMarketSizingChart = ({ data }: { data?: BusinessPlanChartsData["market_sizing"] }) => {
  if (!data) return null;

  const chartData = [
    { name: "TAM", value: parseFloat(data.tam?.replace(/[^0-9.]/g, "") || "0"), label: data.tam },
    { name: "SAM", value: parseFloat(data.sam?.replace(/[^0-9.]/g, "") || "0"), label: data.sam },
    { name: "SOM", value: parseFloat(data.som?.replace(/[^0-9.]/g, "") || "0"), label: data.som },
  ];

  return (
    <Card className="glass-card border-accent/20 my-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Market Sizing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, label }) => `${name}: ${label}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--accent) / 0.3)",
                  borderRadius: "0.5rem"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ==========================================
// Financial Projections Bar Chart
// ==========================================
const SharedFinancialProjectionsChart = ({ data }: { data?: BusinessPlanChartsData["financial_projections"] }) => {
  if (!data) return null;

  const chartData = [
    { name: "MRR Month 6", value: parseFloat(data.month_6_mrr?.replace(/[^0-9.]/g, "") || "0"), label: data.month_6_mrr },
    { name: "ARR Year 1", value: parseFloat(data.year_1_arr?.replace(/[^0-9.]/g, "") || "0"), label: data.year_1_arr },
    { name: "ARR Year 2", value: parseFloat(data.year_2_arr?.replace(/[^0-9.]/g, "") || "0"), label: data.year_2_arr },
  ];

  return (
    <Card className="glass-card border-accent/20 my-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Financial Projections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--accent) / 0.3)",
                  borderRadius: "0.5rem"
                }}
                formatter={(value, name, props) => [props.payload.label, name]}
              />
              <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ==========================================
// Competitor Pricing Horizontal Bar Chart
// ==========================================
const SharedCompetitorPricingChart = ({ data }: { data?: BusinessPlanChartsData["competitor_pricing"] }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card className="glass-card border-accent/20 my-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Competitor Pricing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))" }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--accent) / 0.3)",
                  borderRadius: "0.5rem"
                }}
              />
              <Bar dataKey="min_price" fill={CHART_COLORS[1]} name="Min Price" radius={[0, 4, 4, 0]} />
              <Bar dataKey="max_price" fill={CHART_COLORS[0]} name="Max Price" radius={[0, 4, 4, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ==========================================
// Investment Breakdown Pie Chart
// ==========================================
const SharedInvestmentBreakdownChart = ({ data }: { data?: BusinessPlanChartsData["investment_breakdown"] }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card className="glass-card border-accent/20 my-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Investment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="amount"
                nameKey="category"
                label={({ category, amount }) => `${category}: $${amount.toLocaleString()}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--accent) / 0.3)",
                  borderRadius: "0.5rem"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ==========================================
// Roadmap Timeline Chart (Horizontal/Vertical)
// ==========================================
const SharedRoadmapTimelineChart = ({ 
  data 
}: { 
  data?: BusinessPlanChartsData["roadmap_timeline"] 
}) => {
  if (!data || data.length === 0) return null;

  return (
    <Card className="glass-card border-accent/20 my-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Product Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting Line */}
            <div 
              className="absolute top-4 h-0.5 bg-accent/30" 
              style={{ 
                left: `${100 / (data.length * 2)}%`, 
                right: `${100 / (data.length * 2)}%` 
              }} 
            />
            
            {/* Phases Grid */}
            <div 
              className="grid gap-4" 
              style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}
            >
              {data.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-4 mx-auto z-10 relative">
                    <span className="text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Phase Content */}
                  <div className="p-4 rounded-lg bg-muted/10 border border-border/30">
                    <h4 className="font-semibold text-foreground text-sm mb-1 text-center">
                      {phase.phase}
                    </h4>
                    <p className="text-xs text-accent mb-2 text-center">
                      {phase.timeline}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {phase.focus}
                    </p>
                    <ul className="space-y-1">
                      {phase.outcomes.slice(0, 3).map((outcome, i) => (
                        <li 
                          key={i} 
                          className="text-xs text-muted-foreground flex items-start gap-1.5"
                        >
                          <span className="text-accent shrink-0">•</span>
                          <span className="line-clamp-1">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden">
          <div className="relative pl-6">
            {/* Vertical Line */}
            <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-accent/30" />
            
            <div className="space-y-6">
              {data.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 w-6 h-6 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Phase Content */}
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/30 ml-2">
                    <h4 className="font-semibold text-foreground text-sm">
                      {phase.phase}
                    </h4>
                    <p className="text-xs text-accent mb-2">{phase.timeline}</p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {phase.focus}
                    </p>
                    <ul className="space-y-0.5">
                      {phase.outcomes.slice(0, 2).map((outcome, i) => (
                        <li 
                          key={i} 
                          className="text-xs text-muted-foreground flex items-start gap-1"
                        >
                          <span className="text-accent">•</span>
                          <span className="line-clamp-1">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharedChartRenderer;
