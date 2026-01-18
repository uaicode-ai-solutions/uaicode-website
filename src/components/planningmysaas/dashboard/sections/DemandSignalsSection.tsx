import { Search, TrendingUp, MessageSquare, Briefcase, Star, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Helper to get trend icon and color
const getTrendConfig = (trend: string) => {
  const normalizedTrend = (trend || "").toLowerCase();
  if (normalizedTrend.includes("increas") || normalizedTrend.includes("grow") || normalizedTrend.includes("up")) {
    return { color: "text-green-500", bgColor: "bg-green-500/20", label: "Increasing", growthRate: 0.18 };
  }
  if (normalizedTrend.includes("decreas") || normalizedTrend.includes("declin") || normalizedTrend.includes("down")) {
    return { color: "text-red-500", bgColor: "bg-red-500/20", label: "Decreasing", growthRate: -0.10 };
  }
  return { color: "text-amber-500", bgColor: "bg-amber-500/20", label: "Stable", growthRate: 0.04 };
};

// Helper to extract count from object or return fallback
const extractValue = (data: unknown): string => {
  if (!data) return "...";
  if (typeof data === "string") return data || "...";
  if (typeof data === "number") return data.toString();
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (obj.count !== undefined) return String(obj.count);
    if (obj.value !== undefined) return String(obj.value);
    if (obj.total !== undefined) return String(obj.total);
    if (Object.keys(obj).length === 0) return "...";
    const firstValue = Object.values(obj)[0];
    if (firstValue !== undefined) return String(firstValue);
  }
  return "...";
};

// Format search volume to B/M/K /month
const formatSearchVolume = (value: string): string => {
  if (!value || value === "..." || value === "N/A") return "...";
  
  // Extract first number from text (e.g., "2.1-3.2 million" -> 2.1)
  const numMatch = value.match(/[\d.]+/);
  if (!numMatch) return "...";
  
  const num = parseFloat(numMatch[0]);
  const lowerValue = value.toLowerCase();
  
  // Detect suffix based on text
  if (lowerValue.includes("billion")) {
    return `${num}B /month`;
  }
  if (lowerValue.includes("million")) {
    return `${num}M /month`;
  }
  if (lowerValue.includes("thousand") || lowerValue.includes("k")) {
    return `${num}K /month`;
  }
  
  // Auto-format large numbers
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B /month`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M /month`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K /month`;
  
  return `${num} /month`;
};

// Extract numeric value from search volume for chart
const extractNumericValue = (value: string): number => {
  if (!value || value === "..." || value === "N/A") return 1000000; // Default 1M
  
  const numMatch = value.match(/[\d.]+/);
  if (!numMatch) return 1000000;
  
  const num = parseFloat(numMatch[0]);
  const lowerValue = value.toLowerCase();
  
  if (lowerValue.includes("billion")) return num * 1000000000;
  if (lowerValue.includes("million")) return num * 1000000;
  if (lowerValue.includes("thousand") || lowerValue.includes("k")) return num * 1000;
  
  return num;
};

// Format number for chart labels
const formatChartNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

// Generate projection data for 5 years
const generateProjectionData = (baseValue: number, growthRate: number) => {
  return [
    { year: "Year 1", demand: baseValue, label: formatChartNumber(baseValue) },
    { year: "Year 2", demand: Math.round(baseValue * (1 + growthRate)), label: formatChartNumber(Math.round(baseValue * (1 + growthRate))) },
    { year: "Year 3", demand: Math.round(baseValue * Math.pow(1 + growthRate, 2)), label: formatChartNumber(Math.round(baseValue * Math.pow(1 + growthRate, 2))) },
    { year: "Year 4", demand: Math.round(baseValue * Math.pow(1 + growthRate, 3)), label: formatChartNumber(Math.round(baseValue * Math.pow(1 + growthRate, 3))) },
    { year: "Year 5", demand: Math.round(baseValue * Math.pow(1 + growthRate, 4)), label: formatChartNumber(Math.round(baseValue * Math.pow(1 + growthRate, 4))) },
  ];
};

// Count available signals
const countAvailableSignals = (signals: { value: string }[]): number => {
  return signals.filter(s => s.value !== "...").length;
};

const DemandSignalsSection = () => {
  const { reportData } = useReportContext();

  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const rawData = opportunityData as unknown as Record<string, unknown> | null;
  
  const monthlySearches = opportunityData?.monthly_searches || "...";
  const searchTrend = opportunityData?.search_trend || "...";
  const forumDiscussions = extractValue(rawData?.forum_discussions);
  const jobPostings = extractValue(rawData?.job_postings);
  const onlineReviews = extractValue(rawData?.online_reviews);

  const trendConfig = getTrendConfig(searchTrend);

  const demandSignals = [
    {
      key: "searches",
      label: "Monthly Searches",
      value: formatSearchVolume(monthlySearches),
      icon: Search,
      description: "Estimated monthly search volume for related keywords",
    },
    {
      key: "trend",
      label: "Search Trend",
      value: searchTrend !== "..." ? trendConfig.label : "...",
      icon: TrendingUp,
      description: "Direction of search interest over time",
    },
    {
      key: "forums",
      label: "Forum Discussions",
      value: forumDiscussions,
      icon: MessageSquare,
      description: "Active discussions in relevant online communities",
    },
    {
      key: "jobs",
      label: "Job Postings",
      value: jobPostings,
      icon: Briefcase,
      description: "Related job listings indicating market activity",
    },
    {
      key: "reviews",
      label: "Online Reviews",
      value: onlineReviews,
      icon: Star,
      description: "Customer reviews for competing products",
    },
  ];

  const availableSignals = countAvailableSignals(demandSignals);
  const primarySignal = monthlySearches !== "..." ? formatSearchVolume(monthlySearches) : "N/A";
  const trendDirection = searchTrend !== "..." ? trendConfig.label : "N/A";
  
  // Chart data
  const baseValue = extractNumericValue(monthlySearches);
  const projectionData = generateProjectionData(baseValue, trendConfig.growthRate);

  return (
    <section id="demand-signals" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10">
          <Activity className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Demand</h2>
            <InfoTooltip side="right" size="sm">
              Market signals and search behavior indicating demand for your solution.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Market signals and search behavior</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Summary Card - Left Column */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-5">Demand Overview</h3>
            
            {/* Big Number */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gradient-gold">{availableSignals}</div>
              <div className="text-sm text-muted-foreground">Signals Available</div>
            </div>

            {/* Stats Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Primary Signal
                  <InfoTooltip size="sm">Monthly search volume for your target keywords</InfoTooltip>
                </span>
                <span className="font-bold text-gradient-gold">{primarySignal}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Trend Direction
                  <InfoTooltip size="sm">Whether interest is growing, stable, or declining</InfoTooltip>
                </span>
                <span className={`font-bold ${searchTrend !== "..." ? trendConfig.color : "text-muted-foreground"}`}>
                  {trendDirection}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Data Quality
                  <InfoTooltip size="sm">Percentage of signals with available data</InfoTooltip>
                </span>
                <span className="font-bold text-gradient-gold">{Math.round((availableSignals / 5) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Signals Cards - Right Two Columns */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {demandSignals.map((signal) => {
            const IconComponent = signal.icon;
            return (
              <Card 
                key={signal.key} 
                className="group relative bg-muted/30 border-border/50 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:scale-[1.02] transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10">
                      <IconComponent className="h-4 w-4 text-amber-500" />
                    </div>
                    <InfoTooltip size="sm">{signal.description}</InfoTooltip>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1">{signal.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {signal.value}
                  </p>
                  
                  <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">
                    {signal.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Demand Growth Projection Chart */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">Demand Growth Projection</h3>
              <InfoTooltip size="sm">5-year demand forecast based on current search trends</InfoTooltip>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs border-border/50">
                Base: <span className="text-gradient-gold ml-1">{primarySignal}</span>
              </Badge>
              <Badge variant="outline" className={`text-xs border-border/50 ${trendConfig.color}`}>
                Trend: {trendDirection}
              </Badge>
            </div>
          </div>
          
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatChartNumber(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [formatChartNumber(value) + " /month", "Projected Demand"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#FFD700"
                  strokeWidth={2}
                  fill="url(#demandGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Growth Rate: <span className={`font-medium ${trendConfig.color}`}>{trendConfig.growthRate > 0 ? '+' : ''}{(trendConfig.growthRate * 100).toFixed(0)}% annually</span></span>
            <span>•</span>
            <span>Year 5 Projection: <span className="font-medium text-gradient-gold">{projectionData[4].label} /month</span></span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DemandSignalsSection;
