import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, Zap, Clock } from "lucide-react";

const PmsHero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
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
              className="bg-accent hover:bg-accent/90 text-background font-semibold text-lg px-8 py-6 glow-white"
              onClick={() => scrollToSection("pricing")}
            >
              Validate My Idea
              <ArrowRight className="ml-2 w-5 h-5" />
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
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm">500+ Ideas Validated</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-sm">Reports in 5 Minutes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm">AI-Powered Insights</span>
            </div>
          </div>

          {/* Product Mockup Placeholder */}
          <div className="mt-16 relative animate-fade-in">
            <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto border border-accent/20">
              <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-accent" />
                  </div>
                  <p className="text-muted-foreground">Interactive Demo Coming Soon</p>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsHero;
