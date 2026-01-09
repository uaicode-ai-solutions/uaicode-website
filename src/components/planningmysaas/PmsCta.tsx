import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

const PmsCta = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-accent/20 text-center relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Ready to Turn Your Idea
              <br />
              <span className="text-gradient-gold">Into Reality?</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of founders who validated their SaaS ideas before writing 
              a single line of code. Your journey starts here.
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-background font-semibold text-lg px-10 py-6 glow-white"
              onClick={() => scrollToSection("pricing")}
            >
              Get Started — It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>Results in under 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsCta;
