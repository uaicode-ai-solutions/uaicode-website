import { Lightbulb, BarChart3, FileText, Palette } from "lucide-react";
import stepIdea from "@/assets/pms-step-idea.webp";
import stepAnalysis from "@/assets/pms-step-analysis.webp";
import stepReport from "@/assets/pms-step-report.webp";
import stepBrand from "@/assets/pms-step-brand.webp";

const steps = [
  {
    icon: Lightbulb,
    step: 1,
    title: "Describe Your Idea",
    description: "Tell us about your SaaS concept, target audience, and goals in a simple form.",
    image: stepIdea,
  },
  {
    icon: BarChart3,
    step: 2,
    title: "AI Market Analysis",
    description: "Our AI analyzes market size, trends, competitors, and opportunities in real-time.",
    image: stepAnalysis,
  },
  {
    icon: FileText,
    step: 3,
    title: "Get Your Full Report",
    description: "Receive a comprehensive validation report with actionable, data-backed insights.",
    image: stepReport,
  },
  {
    icon: Palette,
    step: 4,
    title: "Download Your Brand Kit",
    description: "Get your logo, colors, mockups, and landing page suggestion — ready to use.",
    image: stepBrand,
  },
];

const PmsHowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-accent/30 mb-6">
            <span className="text-sm font-medium text-accent">How It Works</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            From Idea to Launch-Ready
            <br />
            <span className="text-gradient-gold">in 4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform guides you through the entire validation process,
            delivering everything you need to launch with confidence.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12`}
            >
              {/* Image Side */}
              <div className="flex-1 relative group">
                {/* Glow */}
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-75 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Image Container */}
                <div className="relative glass-premium rounded-2xl p-3 border border-white/10 animate-fade-in-up">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-auto rounded-xl"
                  />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-background">{step.step}</span>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 text-center lg:text-left">
                {/* Step Indicator */}
                <div className="flex items-center gap-4 justify-center lg:justify-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center shadow-lg pulse-glow">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Step {step.step}</div>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent to-transparent rounded-full mt-1" />
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                  {step.description}
                </p>

                {/* Connection Line (hidden on last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block mt-8">
                    <div className="h-px w-32 bg-gradient-to-r from-accent to-transparent opacity-30" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-xl text-muted-foreground mb-2">
            Ready to validate your idea?
          </p>
          <p className="text-lg text-accent font-semibold">
            It only takes 5 minutes to get started →
          </p>
        </div>
      </div>
    </section>
  );
};

export default PmsHowItWorks;
