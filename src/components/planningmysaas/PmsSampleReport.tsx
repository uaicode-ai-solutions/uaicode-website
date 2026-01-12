import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  BarChart3, 
  Users, 
  Palette, 
  Lock,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  Layers,
  Download
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "market", label: "Market Analysis", icon: BarChart3 },
  { id: "competitors", label: "Competitors", icon: Users },
  { id: "brand", label: "Brand Assets", icon: Palette },
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
const ProgressBar = ({ value, label }: { value: number; label?: string }) => (
  <div className="w-full">
    {label && <span className="text-xs text-muted-foreground mb-1 block">{label}</span>}
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

// Color Palette Preview Component
const ColorPalettePreview = () => (
  <div className="flex gap-2">
    <div className="w-8 h-8 rounded-full bg-accent border-2 border-accent/50" />
    <div className="w-8 h-8 rounded-full bg-foreground border-2 border-foreground/50" />
    <div className="w-8 h-8 rounded-full bg-muted border-2 border-muted/50" />
    <div className="w-8 h-8 rounded-full bg-card border-2 border-border" />
  </div>
);

// Asset Preview Component
const AssetPreview = ({ count, label, icon: Icon }: { count: number; label: string; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div>
      <span className="text-lg font-bold text-foreground">{count}</span>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

const tabContent = {
  overview: {
    title: "Executive Summary",
    metrics: [
      { label: "Market Opportunity", value: 87, type: "score" as const, description: "High potential", icon: Target },
      { label: "Estimated TAM", value: "$4.2B", type: "text" as const, description: "by 2026", icon: DollarSign },
      { label: "Competition Level", value: "Moderate", type: "badge" as const, description: "Room for differentiation", icon: Users },
      { label: "Positioning", value: "Premium B2B", type: "text" as const, description: "SaaS Solution", icon: Layers },
      { label: "Go-to-Market", value: "Product-led", type: "badge" as const, description: "Growth Strategy", icon: TrendingUp },
      { label: "Viability Score", value: 94, type: "percentage" as const, description: "Ready for launch", icon: Zap },
    ],
  },
  market: {
    title: "Market Analysis",
    metrics: [
      { label: "YoY Growth", value: "23%", type: "text" as const, description: "Market expansion rate", icon: TrendingUp },
      { label: "Target Segments", value: "4", type: "text" as const, description: "Identified niches", icon: Target },
      { label: "Key Trends", value: "AI + Remote", type: "badge" as const, description: "Integration & Work", icon: Zap },
      { label: "Compliance", value: "GDPR Ready", type: "badge" as const, description: "Regulatory aligned", icon: FileText },
      { label: "Entry Timing", value: 92, type: "percentage" as const, description: "Optimal window", icon: BarChart3 },
      { label: "Market Fit", value: 88, type: "score" as const, description: "Strong alignment", icon: Layers },
    ],
  },
  competitors: {
    title: "Competitor Landscape",
    metrics: [
      { label: "Direct Competitors", value: "12", type: "text" as const, description: "Identified players", icon: Users },
      { label: "Market Leaders", value: "3", type: "text" as const, description: "Dominant players", icon: Target },
      { label: "Pricing Range", value: "$29 - $299", type: "text" as const, description: "Monthly plans", icon: DollarSign },
      { label: "Feature Gaps", value: "7", type: "text" as const, description: "Opportunities found", icon: Zap },
      { label: "Differentiation", value: 85, type: "score" as const, description: "Strong positioning", icon: Layers },
      { label: "Win Probability", value: 78, type: "percentage" as const, description: "Against competition", icon: TrendingUp },
    ],
  },
  brand: {
    title: "Brand Kit Preview",
    metrics: [],
  },
};

const PmsSampleReport = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleValidate = () => {
    const element = document.getElementById("pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

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
            Here's a preview of the comprehensive validation report and assets 
            you'll receive for your SaaS idea.
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
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {currentContent.title}
              </h3>
              
              {activeTab === "brand" ? (
                /* Brand Assets Special Layout */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AssetPreview count={3} label="Logo Variations" icon={Palette} />
                    <AssetPreview count={5} label="Product Mockups" icon={Layers} />
                    <AssetPreview count={1} label="Landing Template" icon={FileText} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-premium rounded-xl p-4 border border-border/50 animate-fade-in" style={{ animationDelay: "300ms" }}>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">Color Palette</span>
                      <ColorPalettePreview />
                      <p className="text-xs text-muted-foreground mt-2">Primary + 4 accent colors</p>
                    </div>
                    
                    <div className="glass-premium rounded-xl p-4 border border-border/50 animate-fade-in" style={{ animationDelay: "400ms" }}>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">Typography</span>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-foreground">Display Font</p>
                        <p className="text-sm text-muted-foreground">Body Font Style</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Headers + Body fonts included</p>
                    </div>
                  </div>
                  
                  <div className="glass-premium rounded-xl p-4 border border-border/50 animate-fade-in" style={{ animationDelay: "500ms" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Complete Package</span>
                        <p className="text-lg font-bold text-foreground mt-1">All assets in one download</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Download className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Metrics Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentContent.metrics.map((metric, index) => (
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
              )}
            </div>

            {/* CTA Footer - Outside content container */}
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
