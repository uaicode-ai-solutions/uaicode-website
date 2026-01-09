import { 
  FileSearch, 
  Users, 
  Target, 
  BookOpen, 
  Sparkles, 
  Palette, 
  Monitor, 
  Layout,
  TrendingUp,
  Star,
  Clock
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Market Validation Report",
    description: "Data-driven analysis of your idea's potential with real market insights.",
    size: "large",
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "Know who you're up against and how to stand out.",
    size: "small",
  },
  {
    icon: Target,
    title: "Positioning Strategy",
    description: "Clear messaging that resonates with your audience.",
    size: "small",
  },
  {
    icon: BookOpen,
    title: "Complete Brand Manual",
    description: "Guidelines for consistent brand identity across all touchpoints.",
    size: "large",
  },
  {
    icon: Sparkles,
    title: "AI-Generated Logo",
    description: "Professional logo options ready to use immediately.",
    size: "small",
  },
  {
    icon: Palette,
    title: "Color Palette",
    description: "Curated colors that match your brand personality.",
    size: "small",
  },
  {
    icon: Monitor,
    title: "Product Mockups",
    description: "Visualize your SaaS before you build it.",
    size: "small",
  },
  {
    icon: Layout,
    title: "Landing Page Suggestion",
    description: "A blueprint for your launch page that converts.",
    size: "small",
  },
];

const stats = [
  { icon: TrendingUp, value: "2,500+", label: "Ideas Validated" },
  { icon: Star, value: "4.9/5", label: "Avg. Rating" },
  { icon: Clock, value: "< 5 min", label: "Avg. Report Time" },
];

const PmsFeatures = () => {
  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-accent/30 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Everything Included</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to
            <br />
            <span className="text-gradient-gold">Launch with Confidence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a complete validation package with market insights, branding assets, 
            and strategic guidance — all in one place.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl p-6 glass-card border border-border/50 transition-all duration-500 hover:border-accent/40 glow-card ${
                feature.size === 'large' ? 'md:col-span-2' : ''
              }`}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shimmer */}
              <div className="absolute inset-0 rounded-2xl shimmer opacity-0 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="glass-premium rounded-2xl border border-white/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsFeatures;
