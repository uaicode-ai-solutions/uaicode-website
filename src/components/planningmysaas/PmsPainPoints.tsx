import { AlertCircle, Brain, Palette, Map, ArrowDown } from "lucide-react";

const painPoints = [
  {
    icon: AlertCircle,
    title: "Market Uncertainty",
    description: "You have a great idea but no data to prove it'll work. Don't gamble with your time and money.",
    color: "from-red-500/20 to-red-500/5",
    borderColor: "border-red-500/20",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
  },
  {
    icon: Brain,
    title: "Analysis Paralysis",
    description: "Spreadsheets, research, competitors... where do you even start? It's overwhelming.",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/20",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    icon: Palette,
    title: "Branding Burnout",
    description: "Hiring designers costs thousands and takes weeks. You need to move faster.",
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/20",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
  },
  {
    icon: Map,
    title: "No Clear Roadmap",
    description: "You're building blind without a strategic plan. Every decision feels like a guess.",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
];

const PmsPainPoints = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-0 mesh-gradient opacity-50" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-red-500/20 mb-6">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-muted-foreground">The Problem</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Launching a SaaS is Hard.
            <br />
            <span className="text-gradient-gold">It Shouldn't Be.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most founders waste months researching, planning, and second-guessing. 
            Sound familiar?
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-fade-in">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl p-6 border ${point.borderColor} bg-gradient-to-br ${point.color} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 rounded-2xl shimmer opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl ${point.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <point.icon className={`w-7 h-7 ${point.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gradient-gold transition-all duration-300">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>

              {/* Corner Glow */}
              <div className={`absolute -bottom-2 -right-2 w-20 h-20 ${point.iconBg} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            </div>
          ))}
        </div>

        {/* Transition Arrow */}
        <div className="flex flex-col items-center mt-16">
          <div className="w-px h-12 bg-gradient-to-b from-border to-accent/50" />
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center animate-bounce">
            <ArrowDown className="w-5 h-5 text-accent" />
          </div>
        </div>

        {/* Transition Text */}
        <div className="text-center mt-8">
          <p className="text-xl text-muted-foreground">
            What if you could skip the struggle and get
            <span className="text-accent font-bold"> everything you need in minutes?</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PmsPainPoints;
