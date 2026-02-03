import { Lightbulb, BarChart3, FileText, Rocket } from "lucide-react";
import stepIdea from "@/assets/pms-step-idea.webp";
import stepAnalysis from "@/assets/pms-step-analysis.webp";
import stepReport from "@/assets/pms-step-report.webp";
import stepBrand from "@/assets/pms-step-brand.webp";
import stepLaunch from "@/assets/pms-step-launch.webp";

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  step: number;
  title: string;
  description: string;
  image: string;
  isUrgent?: boolean;
}

const steps: Step[] = [
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
    icon: FileText,
    step: 4,
    title: "Download Your Launch Plan",
    description: "Get your complete business plan, financial projections, and go-to-market strategy.",
    image: stepBrand,
  },
  {
    icon: Rocket,
    step: 5,
    title: "Launch Your MVP",
    description: "Your validated idea is ready. Start building with our partner network — spots are limited!",
    image: stepLaunch,
    isUrgent: true,
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
            <span className="text-gradient-gold">in 5 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform guides you through the entire validation process,
            delivering everything you need to launch with confidence.
          </p>
        </div>

        {/* Steps with Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/30 to-accent/10 hidden lg:block" />
          
          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-8 lg:gap-12`}
              >
                {/* Timeline Node (Desktop) */}
                <div className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hidden lg:flex z-20 ${
                  step.isUrgent 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/40 pulse-glow' 
                    : 'bg-accent shadow-accent/30 pulse-glow'
                }`}>
                  <span className="text-lg font-bold text-background">{step.step}</span>
                </div>
                
                {/* Image Side */}
                <div className={`flex-1 relative group ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                  {/* Glow */}
                  <div className={`absolute inset-0 blur-3xl rounded-full scale-75 opacity-50 group-hover:opacity-80 transition-opacity duration-500 ${
                    step.isUrgent ? 'bg-amber-500/30' : 'bg-accent/20'
                  }`} />
                  
                  {/* Image Container */}
                  <div className={`relative glass-premium rounded-2xl p-3 border animate-fade-in-up ${
                    step.isUrgent ? 'border-amber-500/30' : 'border-white/10'
                  }`}>
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-auto rounded-xl"
                    />
                    
                    {/* Step Number Badge (Mobile) */}
                    <div className={`lg:hidden absolute -top-4 -left-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      step.isUrgent 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500' 
                        : 'bg-accent'
                    }`}>
                      <span className="text-xl font-bold text-background">{step.step}</span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`flex-1 text-center lg:text-left ${index % 2 === 0 ? 'lg:pl-16' : 'lg:pr-16'}`}>
                  {/* Step Indicator */}
                  <div className="flex items-center gap-4 justify-center lg:justify-start mb-6">
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-lg ${
                      step.isUrgent 
                        ? 'bg-amber-500/20 border-amber-500/40' 
                        : 'bg-accent/10 border-accent/30'
                    }`}>
                      <step.icon className={`w-8 h-8 ${step.isUrgent ? 'text-amber-400' : 'text-accent'}`} />
                    </div>
                    <div className="hidden sm:block">
                      <div className={`text-sm uppercase tracking-wider font-semibold ${
                        step.isUrgent ? 'text-amber-400' : 'text-accent'
                      }`}>Step {step.step}</div>
                      <div className={`w-24 h-1 rounded-full mt-1 ${
                        step.isUrgent 
                          ? 'bg-gradient-to-r from-amber-500 to-transparent' 
                          : 'bg-gradient-to-r from-accent to-transparent'
                      }`} />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                    {step.description}
                  </p>

                  {/* Urgency Banner for Step 5 */}
                  {step.isUrgent && (
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 max-w-md mx-auto lg:mx-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-amber-400">Limited spots this month</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        First 10 founders get 25% off MVP development →
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
