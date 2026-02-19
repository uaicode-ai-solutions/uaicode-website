import { Sparkles, TrendingUp, Lightbulb, Code, Rocket, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    {
      icon: Lightbulb,
      title: "Free Strategy Call",
      subtitle: "45 minutes with our founder, powered by AI",
      description: "Book a free call with Rafael. During the session, he runs a complete AI-powered validation of your idea live — market analysis, competitor landscape, viability score, and financial projections. You leave with clarity and a concrete next step.",
      isFirst: true
    },
    {
      icon: Code,
      title: "Design & Develop",
      subtitle: "AI-accelerated development in 4-8 weeks",
      description: "User experience design, AI-powered code generation, agile development sprints, continuous integration, and quality assurance.",
      isFirst: false
    },
    {
      icon: Rocket,
      title: "Launch & Iterate",
      subtitle: "Go to market with confidence, not hope",
      description: "Deployment strategy, go-to-market planning, performance monitoring, user feedback collection, and rapid iterations.",
      isFirst: false
    },
    {
      icon: TrendingUp,
      title: "Grow & Optimize",
      subtitle: "Scale from 10 to 10,000 users without rebuilding",
      description: "Feature expansion, performance optimization, scaling infrastructure, AI enhancements, and ongoing technical support.",
      isFirst: false
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">From Idea to Revenue: <span className="text-gradient-gold">Your Risk-Free Path</span></h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start with a free strategy call. Build only what the market wants. Scale with confidence.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-accent/40 hidden md:block"></div>
              )}
              <div className="flex flex-col md:flex-row gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                    step.isFirst 
                      ? 'bg-accent border-accent' 
                      : 'bg-card border-accent/40'
                  }`}>
                    <step.icon className={`w-7 h-7 ${step.isFirst ? 'text-accent-foreground' : 'text-accent'}`} />
                  </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex-grow hover-lift border border-accent/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,171,8,0.2)] hover:border-accent/40">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    {step.isFirst && (
                      <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded-full">FREE</span>
                    )}
                  </div>
                  <p className="text-accent font-semibold mb-3">{step.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={() => navigate("/planningmysaas")}
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Book My Free Strategy Call
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("eve")}
            className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 transition-all duration-300"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
            Talk to Eve
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
