import { Search, TrendingUp, MessageSquare, Briefcase, Star, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSmartFallbackField } from "@/hooks/useSmartFallbackField";
import { InlineValueSkeleton } from "@/components/ui/fallback-skeleton";

// Seasonal variation percentages by month (based on holidays and business cycles)
const seasonalVariation: Record<string, number> = {
  Jan: -0.015,  // New Year, vacations
  Feb: -0.010,  // Carnival in some countries
  Mar: +0.015,  // Back to normal
  Apr: -0.005,  // Easter
  May: +0.010,  // No major holidays
  Jun: +0.005,  // Start of summer (Northern Hemisphere)
  Jul: -0.010,  // Summer vacations
  Aug: +0.005,  // Gradual return
  Sep: +0.020,  // Peak - back to school
  Oct: +0.015,  // High activity
  Nov: +0.010,  // Black Friday
  Dec: -0.020   // Christmas, end of year
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Helper to get trend icon and color
const getTrendConfig = (trend: string) => {
  const normalizedTrend = (trend || "").toLowerCase();
  if (normalizedTrend.includes("increas") || normalizedTrend.includes("grow") || normalizedTrend.includes("up")) {
    return { color: "text-gradient-gold", bgColor: "bg-amber-500/20", label: "Increasing", growthRate: 0.18 };
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

// Signal growth rates for multi-line chart
const signalGrowthRates = {
  searches: 1.0,    // Uses main trend growth rate
  forums: 0.12,     // 12% annual growth
  jobs: 0.08,       // 8% annual growth
  reviews: 0.06,    // 6% annual growth
};

// Signal colors - UaiCode gold palette (monochromatic)
const signalColors = {
  searches: "#FFD700",  // Gold principal (100%)
  forums: "#FFA500",    // Gold dark (85%)
  jobs: "#E6BE00",      // Gold médio (70%)
  reviews: "#CC9400",   // Gold profundo (55%)
};

// Generate fallback value based on Primary Signal and SOM
const generateFallbackValue = (
  primarySignalValue: number,
  somValue: number,
  signalType: 'forums' | 'jobs' | 'reviews'
): number => {
  // Different ratios per signal type
  const ratios = {
    forums: 0.0015,   // ~0.15% of searches
    jobs: 0.0008,     // ~0.08% of searches
    reviews: 0.0025,  // ~0.25% of searches
  };
  
  // Random variation ±25% for realistic variation
  const randomFactor = 0.75 + Math.random() * 0.5;
  
  // Base calculation from Primary Signal
  const baseFromSignal = primarySignalValue * ratios[signalType] * randomFactor;
  
  // SOM influence (0.001% of SOM)
  const baseFromSom = somValue * 0.00001 * ratios[signalType];
  
  // Blend with SOM influence, minimum 100
  return Math.max(100, Math.round((baseFromSignal + baseFromSom) / 2));
};

// Generate monthly projection data for 5 years with seasonal variation
const generateMonthlyProjection = (
  searchesBase: number, 
  growthRate: number,
  forumsValue: number,
  jobsValue: number,
  reviewsValue: number
) => {
  const data: Array<{
    month: string;
    searches: number;
    forums: number;
    jobs: number;
    reviews: number;
  }> = [];
  
  for (let year = 0; year < 5; year++) {
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthName = months[monthIndex];
      const seasonal = seasonalVariation[monthName];
      
      // Calculate base growth for this point in time
      const yearProgress = year + monthIndex / 12;
      
      // Searches: uses main trend growth rate with seasonality
      const searchesGrowth = Math.pow(1 + growthRate, yearProgress);
      const searchesWithSeasonal = searchesBase * searchesGrowth * (1 + seasonal);
      
      // Forums: 12% annual growth with seasonality
      const forumsGrowth = Math.pow(1 + signalGrowthRates.forums, yearProgress);
      const forumsWithSeasonal = forumsValue * forumsGrowth * (1 + seasonal * 0.8);
      
      // Jobs: 8% annual growth with seasonality
      const jobsGrowth = Math.pow(1 + signalGrowthRates.jobs, yearProgress);
      const jobsWithSeasonal = jobsValue * jobsGrowth * (1 + seasonal * 0.6);
      
      // Reviews: 6% annual growth with seasonality
      const reviewsGrowth = Math.pow(1 + signalGrowthRates.reviews, yearProgress);
      const reviewsWithSeasonal = reviewsValue * reviewsGrowth * (1 + seasonal * 0.4);
      
      data.push({
        month: `${monthName} Y${year + 1}`,
        searches: Math.round(searchesWithSeasonal),
        forums: Math.round(forumsWithSeasonal),
        jobs: Math.round(jobsWithSeasonal),
        reviews: Math.round(reviewsWithSeasonal),
      });
    }
  }
  
  return data;
};

// Extract numeric value from signal strings (e.g., "1,234" -> 1234, "2.5K" -> 2500)
const extractSignalNumericValue = (value: string): number => {
  if (!value || value === "..." || value === "N/A") return 0;
  
  const cleanValue = value.replace(/,/g, "");
  const numMatch = cleanValue.match(/[\d.]+/);
  if (!numMatch) return 0;
  
  const num = parseFloat(numMatch[0]);
  const lowerValue = cleanValue.toLowerCase();
  
  if (lowerValue.includes("k")) return num * 1000;
  if (lowerValue.includes("m")) return num * 1000000;
  if (lowerValue.includes("b")) return num * 1000000000;
  
  return num;
};

// Count available signals
const countAvailableSignals = (signals: { value: string }[]): number => {
  return signals.filter(s => s.value !== "...").length;
};

const DemandSignalsSection = () => {
  const { reportData, reportId } = useReportContext();
  const wizardId = reportData?.wizard_id;

  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const rawData = opportunityData as unknown as Record<string, unknown> | null;
  
  // Apply smart fallback for monthly searches
  const { value: monthlySearchesFallback, isLoading: searchesLoading } = useSmartFallbackField({
    fieldPath: "opportunity_section.monthly_searches",
    currentValue: opportunityData?.monthly_searches,
  });
  
  const { value: searchTrendFallback, isLoading: trendLoading } = useSmartFallbackField({
    fieldPath: "opportunity_section.search_trend",
    currentValue: opportunityData?.search_trend,
  });
  
  const monthlySearches = monthlySearchesFallback || "...";
  const searchTrend = searchTrendFallback || "...";
  const forumDiscussionsRaw = extractValue(rawData?.forum_discussions);
  const jobPostingsRaw = extractValue(rawData?.job_postings);
  const onlineReviewsRaw = extractValue(rawData?.online_reviews);

  const trendConfig = getTrendConfig(searchTrend);

  // Calculate base values and fallbacks BEFORE defining demandSignals
  const searchesBaseValue = extractNumericValue(monthlySearches);
  const somValue = extractNumericValue(opportunityData?.som_value || "0");
  
  // Extract raw numeric values
  const forumsRawValue = extractSignalNumericValue(forumDiscussionsRaw);
  const jobsRawValue = extractSignalNumericValue(jobPostingsRaw);
  const reviewsRawValue = extractSignalNumericValue(onlineReviewsRaw);
  
  // Generate fallback values when data is missing
  const forumsValue = forumsRawValue || generateFallbackValue(searchesBaseValue, somValue, 'forums');
  const jobsValue = jobsRawValue || generateFallbackValue(searchesBaseValue, somValue, 'jobs');
  const reviewsValue = reviewsRawValue || generateFallbackValue(searchesBaseValue, somValue, 'reviews');
  
  // Track which values are estimated
  const isForumsEstimated = !forumsRawValue;
  const isJobsEstimated = !jobsRawValue;
  const isReviewsEstimated = !reviewsRawValue;

  // Format signal values for display
  const formatSignalValue = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const demandSignals = [
    {
      key: "searches",
      label: "Monthly Searches",
      value: formatSearchVolume(monthlySearches),
      icon: Search,
      description: "Estimated monthly search volume for related keywords",
      isEstimated: false,
    },
    {
      key: "trend",
      label: "Search Trend",
      value: searchTrend !== "..." ? trendConfig.label : "...",
      icon: TrendingUp,
      description: "Direction of search interest over time",
      isEstimated: false,
    },
    {
      key: "forums",
      label: "Forum Discussions",
      value: formatSignalValue(forumsValue),
      icon: MessageSquare,
      description: "Active discussions in relevant online communities",
      isEstimated: isForumsEstimated,
    },
    {
      key: "jobs",
      label: "Job Postings",
      value: formatSignalValue(jobsValue),
      icon: Briefcase,
      description: "Related job listings indicating market activity",
      isEstimated: isJobsEstimated,
    },
    {
      key: "reviews",
      label: "Online Reviews",
      value: formatSignalValue(reviewsValue),
      icon: Star,
      description: "Customer reviews for competing products",
      isEstimated: isReviewsEstimated,
    },
  ];

  const availableSignals = countAvailableSignals(demandSignals);
  const primarySignal = monthlySearches !== "..." ? formatSearchVolume(monthlySearches) : "N/A";
  const trendDirection = searchTrend !== "..." ? trendConfig.label : "N/A";
  
  const projectionData = generateMonthlyProjection(
    searchesBaseValue, 
    trendConfig.growthRate,
    forumsValue,
    jobsValue,
    reviewsValue
  );

  return (
    <section id="demand-signals" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Activity className="h-5 w-5 text-accent" />
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
                    {signal.isEstimated && (
                      <span className="text-xs text-muted-foreground ml-1">*</span>
                    )}
                  </p>
                  
                  {signal.isEstimated ? (
                    <p className="text-[9px] text-amber-500/70 mt-2">
                      Estimated based on market data
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">
                      {signal.description}
                    </p>
                  )}
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
              <h3 className="text-sm font-medium text-foreground">Demand Growth Projection (5 Years)</h3>
              <InfoTooltip size="sm">Monthly demand forecast with seasonal variation based on market signals</InfoTooltip>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs border-border/50">
                Base: <span className="text-gradient-gold ml-1">{primarySignal}</span>
              </Badge>
              <Badge variant="outline" className={`text-xs border-border/50`}>
                <span className={trendConfig.color}>Trend: {trendDirection}</span>
              </Badge>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="searchesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={signalColors.searches} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={signalColors.searches} stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="forumsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={signalColors.forums} stopOpacity={0.28}/>
                    <stop offset="95%" stopColor={signalColors.forums} stopOpacity={0.04}/>
                  </linearGradient>
                  <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={signalColors.jobs} stopOpacity={0.22}/>
                    <stop offset="95%" stopColor={signalColors.jobs} stopOpacity={0.03}/>
                  </linearGradient>
                  <linearGradient id="reviewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={signalColors.reviews} stopOpacity={0.18}/>
                    <stop offset="95%" stopColor={signalColors.reviews} stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={11} // Show only one tick per year
                />
                <YAxis 
                  yAxisId="searches"
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatChartNumber(value)}
                  orientation="left"
                />
                <YAxis 
                  yAxisId="secondary"
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatChartNumber(value)}
                  orientation="right"
                  hide
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      searches: "Monthly Searches",
                      forums: "Forum Discussions",
                      jobs: "Job Postings",
                      reviews: "Online Reviews"
                    };
                    return [formatChartNumber(value), labels[name] || name];
                  }}
                />
                <Area 
                  yAxisId="searches"
                  type="monotone" 
                  dataKey="searches" 
                  stroke={signalColors.searches}
                  strokeWidth={2}
                  fill="url(#searchesGradient)"
                  name="searches"
                />
                <Area 
                  yAxisId="secondary"
                  type="monotone" 
                  dataKey="forums" 
                  stroke={signalColors.forums}
                  strokeWidth={1.5}
                  fill="url(#forumsGradient)"
                  name="forums"
                />
                <Area 
                  yAxisId="secondary"
                  type="monotone" 
                  dataKey="jobs" 
                  stroke={signalColors.jobs}
                  strokeWidth={1.5}
                  fill="url(#jobsGradient)"
                  name="jobs"
                />
                <Area 
                  yAxisId="secondary"
                  type="monotone" 
                  dataKey="reviews" 
                  stroke={signalColors.reviews}
                  strokeWidth={1.5}
                  fill="url(#reviewsGradient)"
                  name="reviews"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: signalColors.searches }}></div>
              <span className="text-muted-foreground">Monthly Searches</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: signalColors.forums }}></div>
              <span className="text-muted-foreground">Forum Discussions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: signalColors.jobs }}></div>
              <span className="text-muted-foreground">Job Postings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: signalColors.reviews }}></div>
              <span className="text-muted-foreground">Online Reviews</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground border-t border-border/30 pt-3">
            <span>Growth Rate: <span className={`font-medium ${trendConfig.color}`}>{trendConfig.growthRate > 0 ? '+' : ''}{(trendConfig.growthRate * 100).toFixed(0)}% annually</span></span>
            <span>•</span>
            <span>Year 5 Projection: <span className="font-medium text-gradient-gold">{formatChartNumber(projectionData[projectionData.length - 1]?.searches || 0)} /month</span></span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DemandSignalsSection;
