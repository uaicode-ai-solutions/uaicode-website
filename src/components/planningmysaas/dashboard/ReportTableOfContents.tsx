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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const header = document.querySelector("header");
      const offset = (header?.clientHeight ?? 64) + 24;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const currentIndex = tocItems.findIndex((item) => item.id === activeSection);
  const progress = ((currentIndex + 1) / tocItems.length) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="px-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Contents
        </h3>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted/30 rounded-full mx-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scrollable items */}
      <nav className="flex flex-col gap-0.5">
        {tocItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left",
                "transition-all duration-200",
                isActive
                  ? "bg-accent/20 text-accent border-l-2 border-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
              title={item.title}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Progress indicator at bottom */}
      <div className="px-3 py-2 border-t border-border/30 mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-accent">
            {currentIndex + 1} / {tocItems.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportTableOfContents;
