import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useReportContext } from "@/contexts/ReportContext";
import { BusinessPlanSection, BusinessPlanChartsData } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Hash, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

// ==========================================
// Chart Renderer Component
// ==========================================
interface ChartRendererProps {
  type: string;
  data: BusinessPlanChartsData;
}

const ChartRenderer = ({ type, data }: ChartRendererProps) => {
  switch (type) {
    case "market_sizing":
      return <MarketSizingChart data={data.market_sizing} />;
    case "financial_projections":
      return <FinancialProjectionsChart data={data.financial_projections} />;
    case "competitor_pricing":
      return <CompetitorPricingChart data={data.competitor_pricing} />;
    case "investment_breakdown":
      return <InvestmentBreakdownChart data={data.investment_breakdown} />;
    case "roadmap_timeline":
      return <RoadmapTimelineChart data={data.roadmap_timeline} />;
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
const MarketSizingChart = ({ data }: { data?: BusinessPlanChartsData["market_sizing"] }) => {
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
const FinancialProjectionsChart = ({ data }: { data?: BusinessPlanChartsData["financial_projections"] }) => {
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
const CompetitorPricingChart = ({ data }: { data?: BusinessPlanChartsData["competitor_pricing"] }) => {
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
const InvestmentBreakdownChart = ({ data }: { data?: BusinessPlanChartsData["investment_breakdown"] }) => {
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
const RoadmapTimelineChart = ({ 
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

// ==========================================
// Custom Markdown Components
// ==========================================
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-3xl font-bold text-gradient-gold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-foreground border-b border-accent/20 pb-2 mt-8 mb-4">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="ml-2">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <div className="p-4 rounded-xl bg-accent/10 border-l-4 border-accent my-4">
      {children}
    </div>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm">{children}</code>;
    }
    return (
      <pre className="bg-muted/30 p-4 rounded-lg overflow-x-auto mb-4">
        <code className="text-sm">{children}</code>
      </pre>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-6 overflow-hidden rounded-lg border border-accent/20">
      <Table>{children}</Table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <TableHeader className="bg-accent/10">{children}</TableHeader>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <TableBody>{children}</TableBody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <TableRow className="border-accent/10">{children}</TableRow>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <TableHead className="text-accent font-semibold">{children}</TableHead>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <TableCell className="text-muted-foreground">{children}</TableCell>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-accent/20" />,
};

// ==========================================
// Main BusinessPlanTab Component
// ==========================================
const BusinessPlanTab = () => {
  const { reportData } = useReportContext();

  // Cast business_plan_section from unknown to typed
  const businessPlan = useMemo(() => {
    const raw = reportData?.business_plan_section;
    if (!raw || typeof raw !== "object") return null;
    return raw as BusinessPlanSection;
  }, [reportData?.business_plan_section]);

  // If no business plan data, show empty state
  if (!businessPlan || !businessPlan.markdown_content) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Business Plan Not Available</h3>
        <p className="text-muted-foreground max-w-md">
          The Business Plan document hasn't been generated yet. This feature is being rolled out progressively.
        </p>
      </div>
    );
  }

  const viabilityStyle = getViabilityStyle(businessPlan.viability_score || 0);

  // Split markdown by chart placeholders and render inline charts
  const renderContentWithCharts = () => {
    const markdown = businessPlan.markdown_content || "";
    const chartsData = businessPlan.charts_data || {};
    
    // Split by [CHART:xxx] pattern
    const parts = markdown.split(/(\[CHART:\w+\])/g);
    
    return parts.map((part, index) => {
      const chartMatch = part.match(/\[CHART:(\w+)\]/);
      if (chartMatch) {
        const chartType = chartMatch[1];
        return <ChartRenderer key={index} type={chartType} data={chartsData} />;
      }
      // Regular markdown content
      return (
        <ReactMarkdown 
          key={index} 
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Card */}
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
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${viabilityStyle.bg} ${viabilityStyle.border}`}>
              <TrendingUp className={`h-5 w-5 ${viabilityStyle.text}`} />
              <span className={`font-semibold ${viabilityStyle.text}`}>
                {businessPlan.viability_label || "Score"}: {businessPlan.viability_score || 0}/100
              </span>
            </div>
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

      {/* Markdown Content with Charts */}
      <Card className="glass-card border-accent/20">
        <CardContent className="p-6 md:p-8 prose prose-invert max-w-none">
          {renderContentWithCharts()}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPlanTab;
