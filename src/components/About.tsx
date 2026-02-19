import { Sparkles, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import aboutImage from "@/assets/uaicode-about.webp";

const About = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Built by Engineers Who Have Been <span className="text-gradient-gold">in Your Shoes</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="order-2 lg:order-1 flex flex-col">
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Uaicode is an AI-powered MVP development partner based in Austin, TX, serving entrepreneurs globally. We've helped over 2,500 founders validate their ideas and launch successful SaaS products.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              <strong className="text-foreground">We believe in validation first.</strong> That's why we created Planning My SaaS—a free tool that gives you AI-powered market analysis before you invest in development. Know your market, competitors, and viability score in minutes.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Once validated, we build production-ready MVPs that turn your idea into reality—from AI-powered SaaS platforms with intelligent features, to automated workflows that scale from day one. You get a complete technical foundation with dedicated support from our experienced development team throughout your launch journey.
            </p>
            <p className="text-lg font-semibold text-accent mb-8">
              Call first. Build smart. Launch fast.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 justify-start items-start mt-auto">
              <Button 
                size="lg"
                onClick={() => window.open("https://uaicode.ai/booking", "_blank")}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
              >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Book My Free Strategy Call
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("eve")}
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 transition-all duration-300"
              >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
              Contact Eve
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl -z-10"></div>
            <img 
              src={aboutImage} 
              alt="Uaicode Team" 
              loading="lazy"
              className="rounded-2xl shadow-2xl hover-lift w-full object-cover border border-accent/20"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
