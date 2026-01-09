import { 
  FileSearch, 
  Users, 
  Target, 
  BookOpen, 
  Sparkles, 
  Palette, 
  Monitor, 
  Layout 
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Market Validation Report",
    description: "Data-driven analysis of your idea's potential with real market insights.",
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "Know who you're up against and how to stand out from the crowd.",
  },
  {
    icon: Target,
    title: "Positioning Strategy",
    description: "Clear messaging that resonates with your target audience.",
  },
  {
    icon: BookOpen,
    title: "Complete Brand Manual",
    description: "Guidelines for consistent brand identity across all touchpoints.",
  },
  {
    icon: Sparkles,
    title: "AI-Generated Logo",
    description: "Professional logo options ready to use for your launch.",
  },
  {
    icon: Palette,
    title: "Color Palette",
    description: "Curated colors that match your brand personality and industry.",
  },
  {
    icon: Monitor,
    title: "Product Mockups",
    description: "Visualize your SaaS before you build it with realistic previews.",
  },
  {
    icon: Layout,
    title: "Landing Page Blueprint",
    description: "A complete blueprint for your launch page with copy suggestions.",
  },
];

const PmsFeatures = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to
            <br />
            <span className="text-gradient-gold">Launch with Confidence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One platform, complete deliverables. No more juggling multiple tools and agencies.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl border border-border/50 hover-lift transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <div className="glass-card inline-flex items-center gap-6 px-8 py-4 rounded-full border border-accent/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">500+</p>
              <p className="text-xs text-muted-foreground">Ideas Validated</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">4.9/5</p>
              <p className="text-xs text-muted-foreground">Avg. Rating</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">5 min</p>
              <p className="text-xs text-muted-foreground">Avg. Report Time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsFeatures;
