import { Lightbulb, BarChart3, FileText, Palette } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Describe Your Idea",
    description: "Tell us about your SaaS concept, target audience, and goals through our intuitive wizard.",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "AI Market Analysis",
    description: "We analyze market size, trends, and competition in real-time using advanced AI.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Get Your Full Report",
    description: "Receive actionable insights with data-backed validation and clear recommendations.",
  },
  {
    icon: Palette,
    step: "04",
    title: "Download Your Brand Kit",
    description: "Logo, colors, mockups, and a landing page suggestion — all ready to use.",
  },
];

const PmsHowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Idea to Launch-Ready
            <br />
            <span className="text-gradient-gold">in 4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered wizard guides you through the entire process. 
            No expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center group"
              >
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border-2 border-accent mb-6 group-hover:bg-accent/20 transition-colors">
                  <span className="text-2xl font-bold text-accent">{step.step}</span>
                </div>

                {/* Icon Card */}
                <div className="glass-card p-6 rounded-xl border border-border/50 hover-lift transition-all duration-300">
                  <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Ready to see it in action?{" "}
            <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="text-accent hover:text-accent/80 font-semibold underline underline-offset-4"
            >
              Start your validation now
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PmsHowItWorks;
