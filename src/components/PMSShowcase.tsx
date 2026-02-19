import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Target, DollarSign, Users, TrendingUp, 
  BarChart3, Percent, Sparkles, FileText,
  ArrowRight
} from "lucide-react";

// Score Ring Component
const ScoreRing = ({ score, size = 56 }: { score: number; size?: number }) => {
  const percentage = score;
  const strokeWidth = 5;
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
        <span className="text-sm font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full">
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
  type?: "score" | "percentage" | "text" | "badge";
  icon?: React.ComponentType<{ className?: string }>;
  delay?: number;
}) => (
  <div 
    className="glass-card rounded-xl p-4 border border-border/50 hover:border-accent/30 transition-all duration-300 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      {Icon && <Icon className="w-4 h-4 text-accent" />}
    </div>
    
    {type === "score" && typeof value === "number" ? (
      <div className="flex items-center gap-3">
        <ScoreRing score={value} size={48} />
        <div>
          <span className="text-xl font-bold text-foreground">{value}/100</span>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    ) : type === "percentage" && typeof value === "number" ? (
      <div className="space-y-2">
        <span className="text-xl font-bold text-accent">{value}%</span>
        <ProgressBar value={value} />
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    ) : type === "badge" ? (
      <div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
          {value}
        </span>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </div>
    ) : (
      <div>
        <span className="text-xl font-bold text-foreground">{value}</span>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    )}
  </div>
);

const sampleMetrics = [
  { label: "Viability Score", value: 87, type: "score" as const, description: "High potential", icon: Target },
  { label: "Market Size (TAM)", value: "$4.2B", type: "text" as const, description: "by 2026", icon: DollarSign },
  { label: "Competition Level", value: "Moderate", type: "badge" as const, description: "Room for differentiation", icon: Users },
  { label: "Market Timing", value: 92, type: "percentage" as const, description: "Optimal entry window", icon: TrendingUp },
  { label: "Investment Required", value: "$15,000", type: "text" as const, description: "MVP development", icon: BarChart3 },
  { label: "Projected ROI Y1", value: 180, type: "percentage" as const, description: "First year return", icon: Percent },
];

const PMSShowcase = () => {
  const navigate = useNavigate();

  return (
    <section id="validation" className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 mb-6">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              What You Get on Your Strategy Call
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            See What Your <span className="text-gradient-gold">Free Strategy Call</span> Reveals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            During your 45-minute call, Rafael runs a live AI analysis of your idea. 
            Here is a sample of what you will walk away with:
          </p>
        </div>
        
        {/* Métricas Grid */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl" />
          
          <div className="relative glass-card rounded-3xl border border-accent/20 p-6 md:p-8 shadow-[0_0_40px_rgba(234,171,8,0.1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {sampleMetrics.map((metric, index) => (
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
            
            {/* Preview borrado */}
            <div className="relative rounded-xl border border-border/50 overflow-hidden bg-muted/20 p-6 mb-8">
              <div className="blur-sm select-none pointer-events-none space-y-3">
                <div className="h-3 bg-muted-foreground/20 rounded w-full" />
                <div className="h-3 bg-muted-foreground/20 rounded w-5/6" />
                <div className="h-3 bg-muted-foreground/20 rounded w-4/6" />
                <div className="h-16 bg-accent/10 rounded-lg mt-4" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-background/60">
                <span className="text-accent font-medium text-sm md:text-base">
                  + 10 more sections including brand identity, business plan, and investor pitch
                </span>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.open("https://uaicode.ai/booking", "_blank")}
                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Book My Free Strategy Call
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open("https://uaicode.ai/booking", "_blank")}
                className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 transition-all duration-300"
              >
                Sample Report
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PMSShowcase;
