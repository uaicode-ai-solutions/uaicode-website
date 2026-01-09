import { AlertCircle, Brain, Palette, Map } from "lucide-react";

const painPoints = [
  {
    icon: AlertCircle,
    title: "Market Uncertainty",
    description: "You have a great idea but no data to prove it'll work. Don't gamble with your time and money.",
  },
  {
    icon: Brain,
    title: "Analysis Paralysis",
    description: "Spreadsheets, research, competitors... where do you even start? It's overwhelming.",
  },
  {
    icon: Palette,
    title: "Branding Burnout",
    description: "Hiring designers costs thousands and takes weeks. You need to move faster.",
  },
  {
    icon: Map,
    title: "No Clear Roadmap",
    description: "You're building blind without a strategic plan. Every decision feels like a guess.",
  },
];

const PmsPainPoints = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl border border-border/50 hover-lift transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <point.icon className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition Text */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground">
            What if you could skip the struggle and get
            <span className="text-accent font-semibold"> everything you need in minutes?</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PmsPainPoints;
