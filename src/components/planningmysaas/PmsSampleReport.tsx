import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Briefcase,
  Rocket,
  Lock,
  ArrowRight,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Users,
  Bot,
  Calendar,
  Percent,
  Share2,
  Download,
  LineChart
} from "lucide-react";

const tabs = [
  { id: "report", label: "Market Analysis", icon: FileText },
  { id: "businessplan", label: "Business Plan", icon: Briefcase },
  { id: "nextsteps", label: "Next Steps", icon: Rocket },
];

// Score Ring Component
const ScoreRing = ({ score, maxScore = 100, size = 80 }: { score: number; maxScore?: number; size?: number }) => {
  const percentage = (score / maxScore) * 100;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full">
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

// Metric Card Component
const MetricCard = ({ 
  label, 
  value, 
  description, 
  type = "text",
  icon: Icon,
  delay = 0 
}: { 
  label: string; 
  value: string | number; 
  description?: string; 
  type?: "score" | "currency" | "percentage" | "text" | "badge";
  icon?: React.ComponentType<{ className?: string }>;
  delay?: number;
}) => (
  <div 
    className="glass-premium rounded-xl p-4 border border-border/50 hover:border-accent/30 transition-all duration-300 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      {Icon && <Icon className="w-4 h-4 text-accent" />}
    </div>
    
    {type === "score" && typeof value === "number" ? (
      <div className="flex items-center gap-3">
        <ScoreRing score={value} size={56} />
        <div>
          <span className="text-2xl font-bold text-foreground">{value}/100</span>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    ) : type === "percentage" && typeof value === "number" ? (
      <div className="space-y-2">
        <span className="text-2xl font-bold text-accent">{value}%</span>
        <ProgressBar value={value} />
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    ) : type === "badge" ? (
      <div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/20 text-accent border border-accent/30">
          {value}
        </span>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </div>
    ) : (
      <div>
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    )}
  </div>
);

// Stat Card Component for Business Plan
const StatCard = ({ value, label, icon: Icon }: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 border border-border/50">
    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <span className="text-2xl font-bold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

// Benefit Card Component for Next Steps
const BenefitCard = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string;
  delay?: number;
}) => (
  <div 
    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-accent/30 transition-all duration-300 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const reportMetrics = [
  { label: "Viability Score", value: 87, type: "score" as const, description: "High potential", icon: Target },
  { label: "Market Size (TAM)", value: "$4.2B", type: "text" as const, description: "by 2026", icon: DollarSign },
  { label: "Competition Level", value: "Moderate", type: "badge" as const, description: "Room for differentiation", icon: Users },
  { label: "Market Timing", value: 92, type: "percentage" as const, description: "Optimal entry window", icon: TrendingUp },
  { label: "Investment Required", value: "$15,000", type: "text" as const, description: "MVP development", icon: BarChart3 },
  { label: "Projected ROI Y1", value: 180, type: "percentage" as const, description: "First year return", icon: Percent },
];

const nextStepsBenefits = [
  { 
    icon: Bot, 
    title: "AI Consultant (Kyle)", 
    description: "Ask questions about your report anytime — get instant answers via chat, email, or voice call." 
  },
  { 
    icon: Calendar, 
    title: "Schedule Strategy Call", 
    description: "Book a 30-minute call with our founder to discuss your validation results." 
  },
  { 
    icon: Percent, 
    title: "Exclusive MVP Discount", 
    description: "Special pricing for report users who want to build their MVP with Uaicode." 
  },
  { 
    icon: Share2, 
    title: "Shareable Public Link", 
    description: "Share your report with investors, partners, or co-founders via a secure public link." 
  },
];

const PmsSampleReport = () => {
  const [activeTab, setActiveTab] = useState("report");

  const handleValidate = () => {
    const element = document.getElementById("pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-accent/30 mb-6">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Sample Report</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            See What You'll <span className="text-gradient-gold">Get</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's a preview of the comprehensive validation report and strategic 
            business plan you'll receive for your SaaS idea.
          </p>
        </div>

        {/* Report Preview Card */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl" />
          
          <div className="relative glass-premium rounded-3xl border border-accent/20 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border/50 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-accent border-b-2 border-accent bg-accent/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === "report" && (
                <>
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    Viability Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportMetrics.map((metric, index) => (
                      <MetricCard 
                        key={index}
                        label={metric.label}
                        value={metric.value}
                        description={metric.description}
                        type={metric.type}
                        icon={metric.icon}
                        delay={index * 100}
                      />
                    ))}
                  </div>
                </>
              )}

              {activeTab === "businessplan" && (
                <>
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    AI-Generated Business Plan
                  </h3>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard value="8,500+" label="Words" icon={FileText} />
                    <StatCard value="10" label="Sections" icon={Briefcase} />
                    <StatCard value="5" label="Interactive Charts" icon={LineChart} />
                  </div>
                  
                  {/* Blurred Preview */}
                  <div className="relative rounded-xl border border-border/50 overflow-hidden bg-muted/20 p-6">
                    <div className="space-y-4 blur-sm select-none pointer-events-none">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-foreground"># Executive Summary</h4>
                        <div className="h-3 bg-muted-foreground/20 rounded w-full" />
                        <div className="h-3 bg-muted-foreground/20 rounded w-5/6" />
                        <div className="h-3 bg-muted-foreground/20 rounded w-4/6" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-foreground"># Market Analysis</h4>
                        <div className="h-3 bg-muted-foreground/20 rounded w-full" />
                        <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                      </div>
                      <div className="h-24 bg-accent/10 rounded-lg flex items-center justify-center">
                        <span className="text-accent/50 text-sm">[Interactive Chart]</span>
                      </div>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
                  </div>
                  
                  {/* Export Options */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
                      <Download className="w-4 h-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Export to PDF</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
                      <Share2 className="w-4 h-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Share Link</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "nextsteps" && (
                <>
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nextStepsBenefits.map((benefit, index) => (
                      <BenefitCard 
                        key={index}
                        icon={benefit.icon}
                        title={benefit.title}
                        description={benefit.description}
                        delay={index * 100}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CTA Footer */}
            <div className="border-t border-border/50 p-6 md:p-8 flex flex-col items-center gap-4 bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-5 h-5 text-accent" />
                <span className="text-sm">Full report unlocked after purchase</span>
              </div>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-background font-bold glow-white w-full sm:w-auto"
                onClick={handleValidate}
              >
                Validate My Idea
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsSampleReport;
