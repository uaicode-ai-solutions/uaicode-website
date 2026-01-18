import { Search, TrendingUp, MessageSquare, Briefcase, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";

// Helper to get trend icon and color
const getTrendConfig = (trend: string) => {
  const normalizedTrend = (trend || "").toLowerCase();
  if (normalizedTrend.includes("increas") || normalizedTrend.includes("grow") || normalizedTrend.includes("up")) {
    return { color: "text-green-500", bgColor: "bg-green-500/20", label: "Increasing" };
  }
  if (normalizedTrend.includes("decreas") || normalizedTrend.includes("declin") || normalizedTrend.includes("down")) {
    return { color: "text-red-500", bgColor: "bg-red-500/20", label: "Decreasing" };
  }
  return { color: "text-amber-500", bgColor: "bg-amber-500/20", label: "Stable" };
};

// Helper to extract count from object or return fallback
const extractValue = (data: unknown): string => {
  if (!data) return "...";
  if (typeof data === "string") return data || "...";
  if (typeof data === "number") return data.toString();
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // Try common keys
    if (obj.count !== undefined) return String(obj.count);
    if (obj.value !== undefined) return String(obj.value);
    if (obj.total !== undefined) return String(obj.total);
    // If object is empty
    if (Object.keys(obj).length === 0) return "...";
    // Return first value if available
    const firstValue = Object.values(obj)[0];
    if (firstValue !== undefined) return String(firstValue);
  }
  return "...";
};

const DemandSignalsSection = () => {
  const { reportData } = useReportContext();

  // Parse opportunity_section JSONB
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;

  // Extract demand signals with fallbacks
  // Cast to unknown first to avoid TypeScript overlap error
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
      value: monthlySearches,
      icon: Search,
      description: "Estimated monthly search volume for related keywords",
    },
    {
      key: "trend",
      label: "Search Trend",
      value: searchTrend !== "..." ? trendConfig.label : "...",
      icon: TrendingUp,
      description: "Direction of search interest over time",
      badgeColor: searchTrend !== "..." ? trendConfig.bgColor : undefined,
      textColor: searchTrend !== "..." ? trendConfig.color : undefined,
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

  return (
    <section id="demand-signals" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Search className="h-5 w-5 text-accent" />
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

      {/* Demand Signals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {demandSignals.map((signal) => {
          const IconComponent = signal.icon;
          return (
            <Card 
              key={signal.key} 
              className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors"
            >
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className={`p-2.5 rounded-lg ${signal.badgeColor || "bg-accent/10"}`}>
                    <IconComponent className={`h-5 w-5 ${signal.textColor || "text-accent"}`} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{signal.label}</p>
                <p className={`text-lg font-bold ${signal.textColor || "text-foreground"}`}>
                  {signal.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default DemandSignalsSection;