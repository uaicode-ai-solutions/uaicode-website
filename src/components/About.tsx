import { Rocket, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import aboutImage from "@/assets/uaicode-about.webp";

const About = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Why Choose <span className="text-gradient-gold">Uaicode?</span></h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="order-2 lg:order-1 flex flex-col">
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Uaicode is an AI-powered MVP development partner based in Orlando, FL, serving entrepreneurs globally. We've helped over 1,247 startups launch their SaaS ideas, achieving an average 300% faster time-to-market with our proven framework.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              We build production-ready MVPs that validate your business idea fast—from AI-powered SaaS platforms with intelligent features, to automated workflows that scale from day one, to integrated payment and user management systems. You get a complete technical foundation with dedicated support from our experienced development team throughout your launch journey.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Your competitors are already launching MVPs in weeks while traditional development takes months—losing you market position and first-mover advantage daily. Winning startups in your space move faster with validated tech, proven frameworks, and rapid iterations. We deliver that competitive edge with an MVP designed to transform your idea into a revenue-generating product in weeks, not months.
            </p>
            <p className="text-lg font-semibold text-accent mb-8">
              Discover how we can transform your idea into a thriving SaaS business.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 justify-start items-start mt-auto">
              <Button 
                size="lg"
                onClick={() => scrollToSection("schedule")}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 glow-white"
              >
              <Calculator className="w-5 h-5 mr-2" />
                Get MVP Pricing
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("schedule")}
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-lg px-8 py-6 transition-all duration-300"
              >
              <Rocket className="w-5 h-5 mr-1.5" />
              Launch Your MVP
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img 
              src={aboutImage} 
              alt="Uaicode Team" 
              loading="lazy"
              className="rounded-2xl shadow-2xl hover-lift w-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
