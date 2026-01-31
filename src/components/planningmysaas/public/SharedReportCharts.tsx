import { TrendingUp } from "lucide-react";
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

export default SharedChartRenderer;
