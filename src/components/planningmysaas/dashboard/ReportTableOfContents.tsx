import { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  Briefcase,
  Target,
  Search,
  Clock,
  BarChart3,
  Swords,
  Rocket,
  Megaphone,
  DollarSign,
  Users,
  TrendingUp,
  GitBranch,
  CheckSquare,
  Flag,
  Award,
  ArrowRight,
  Calendar,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  title: string;
  icon: React.ElementType;
}

const tocItems: TocItem[] = [
  { id: "report-hero", title: "Overview", icon: Sparkles },
  { id: "executive-verdict", title: "The Verdict", icon: ShieldCheck },
  { id: "business-model", title: "The Model", icon: Briefcase },
  { id: "market-opportunity", title: "The Opportunity", icon: Target },
  { id: "demand-validation", title: "The Demand", icon: Search },
  { id: "timing-analysis", title: "The Timing", icon: Clock },
  { id: "market-benchmarks", title: "Industry Standards", icon: BarChart3 },
  { id: "competitors-differentiation", title: "Competition", icon: Swords },
  { id: "go-to-market-preview", title: "Launch Strategy", icon: Rocket },
  { id: "marketing-intelligence", title: "Marketing Intel", icon: Megaphone },
  { id: "investment", title: "The Investment", icon: DollarSign },
  { id: "resource-requirements", title: "Beyond Money", icon: Users },
  { id: "financial-return", title: "The Return", icon: TrendingUp },
  { id: "pivot-scenarios", title: "Plan B", icon: GitBranch },
  { id: "execution-plan", title: "The Plan", icon: CheckSquare },
  { id: "success-metrics", title: "Success Metrics", icon: Flag },
  { id: "why-uaicode", title: "Why Uaicode", icon: Award },
  { id: "next-steps", title: "Next Steps", icon: ArrowRight },
  { id: "schedule-call", title: "Schedule Call", icon: Calendar },
  { id: "direct-contact", title: "Contact", icon: MessageCircle },
];

const ReportTableOfContents = () => {
  const [activeSection, setActiveSection] = useState<string>("report-hero");
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    // Small delay to ensure sections are rendered
    const timer = setTimeout(() => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    
    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for fixed header + tabs
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const currentIndex = tocItems.findIndex((item) => item.id === activeSection);
  const progress = ((currentIndex + 1) / tocItems.length) * 100;

  if (!isVisible) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Collapse toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "self-end p-1.5 rounded-lg",
          "bg-background/80 backdrop-blur-sm border border-border/50",
          "text-muted-foreground hover:text-foreground",
          "transition-colors duration-200"
        )}
        title={isExpanded ? "Collapse" : "Expand"}
      >
        {isExpanded ? (
          <ChevronLeft className="h-3.5 w-3.5" />
        ) : (
          <List className="h-3.5 w-3.5" />
        )}
      </button>

      {/* TOC container */}
      <nav
        className={cn(
          "glass-premium border border-accent/20 rounded-2xl overflow-hidden",
          "transition-all duration-300 ease-out",
          isExpanded ? "w-44" : "w-12"
        )}
      >
        {/* Progress bar at top */}
        <div className="h-0.5 bg-muted/30">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Scrollable items */}
        <div className="p-2 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
          {tocItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "flex items-center gap-2 w-full p-2 rounded-lg text-left",
                  "transition-all duration-200",
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                )}
                title={item.title}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-xs truncate">{item.title}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress indicator at bottom */}
        <div className="px-3 py-2 border-t border-border/30 bg-muted/10">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs font-medium text-accent">
              {currentIndex + 1}
            </span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs text-muted-foreground">
              {tocItems.length}
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ReportTableOfContents;
