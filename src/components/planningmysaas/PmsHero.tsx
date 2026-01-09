import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, Zap, Clock, ChevronDown } from "lucide-react";
import heroDashboard from "@/assets/pms-hero-dashboard.webp";

const PmsHero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      
      {/* Floating Orbs */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-60 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">AI-Powered SaaS Validation</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Validate Your SaaS Idea
            <br />
            <span className="text-gradient-gold">in Minutes, Not Months</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in">
            From concept to market validation, branding, and launch-ready assets — all powered by AI. 
            Stop guessing. Start building with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-background font-semibold text-lg px-8 py-6 glow-white group"
              onClick={() => scrollToSection("pricing")}
            >
              Validate My Idea
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted text-foreground font-semibold text-lg px-8 py-6"
              onClick={() => scrollToSection("how-it-works")}
            >
              See How It Works
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-16 animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground font-medium">2,500+ Ideas Validated</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground font-medium">Reports in 5 Minutes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground font-medium">AI-Powered Insights</span>
            </div>
          </div>

          {/* Product Mockup */}
          <div className="relative animate-fade-in">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-3xl scale-90" />
            
            <div className="relative glass-premium rounded-2xl p-3 border border-accent/20 max-w-4xl mx-auto">
              <img 
                src={heroDashboard} 
                alt="Planning My SaaS Dashboard Preview"
                className="w-full h-auto rounded-xl"
              />
              
              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 md:top-8 md:-right-8 px-4 py-2 rounded-xl glass-premium border border-accent/30 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Market Validated</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 px-4 py-2 rounded-xl glass-premium border border-accent/30 animate-float-delayed">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gradient-gold">94%</span>
                  <span className="text-xs text-muted-foreground">Viability<br/>Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 flex flex-col items-center animate-bounce">
            <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsHero;
