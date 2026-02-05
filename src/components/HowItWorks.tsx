import { Calculator, TrendingUp, Lightbulb, Code, Rocket } from "lucide-react";
import { Button } from "./ui/button";

const HowItWorks = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    {
      icon: Lightbulb,
      title: "Ideate & Validate",
      subtitle: "We refine your vision into a clear, viable blueprint",
      description: "Deep-dive consultation, competitive analysis, market validation, feature prioritization, and technical architecture planning.",
      isFirst: true
    },
    {
      icon: Code,
      title: "Design & Develop",
      subtitle: "Leveraging AI for rapid prototyping and development",
      description: "User experience design, AI-powered code generation, agile development sprints, continuous integration, and quality assurance.",
      isFirst: false
    },
    {
      icon: Rocket,
      title: "Launch & Iterate",
      subtitle: "We help you launch fast and gather crucial feedback",
      description: "Deployment strategy, go-to-market planning, performance monitoring, user feedback collection, and rapid iterations.",
      isFirst: false
    },
    {
      icon: TrendingUp,
      title: "Grow & Optimize",
      subtitle: "Your MVP evolves with your success, powered by continuous innovation",
      description: "Feature expansion, performance optimization, scaling infrastructure, AI enhancements, and ongoing technical support.",
      isFirst: false
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Your Journey to Launch: <span className="text-gradient-gold">Simple, Fast, Powerful</span></h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proven 4-step process takes you from idea to market-ready MVP
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
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
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
            onClick={() => scrollToSection("schedule")}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 glow-white"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Get MVP Pricing
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("schedule")}
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-lg px-8 py-6 transition-all duration-300"
          >
            <Rocket className="w-5 h-5 mr-1.5" />
            Launch Your MVP
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
