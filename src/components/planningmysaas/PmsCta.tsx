import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Sparkles, Star } from "lucide-react";

const PmsCta = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 aurora-bg" />
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Animated Orbs - Using only accent/gold color */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Animated Border - Gold only */}
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-accent via-yellow-500 to-accent bg-[length:200%_100%] animate-[borderMove_3s_linear_infinite]" />
          
          {/* Card Content */}
          <div className="relative glass-premium rounded-3xl p-8 md:p-12 lg:p-16 text-center border-0">
            {/* Decorative Stars */}
            <div className="absolute top-8 left-8 text-accent/30">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute top-8 right-8 text-accent/20">
              <Star className="w-6 h-6" />
            </div>
            <div className="absolute bottom-8 left-12 text-accent/20">
              <Star className="w-4 h-4" />
            </div>
            <div className="absolute bottom-12 right-16 text-accent/30">
              <Sparkles className="w-6 h-6" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-8">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Limited Time Offer</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
              Ready to Turn Your Idea
              <br />
              <span className="text-gradient-gold">Into Reality?</span>
            </h2>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of founders who validated their SaaS ideas before writing 
              a single line of code. Your journey to success starts here.
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-background font-bold text-lg px-12 py-7 rounded-xl glow-white group relative overflow-hidden"
              onClick={() => scrollToSection("pricing")}
            >
              <span className="relative z-10 flex items-center">
                Get Started — It's Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-yellow-400 to-accent bg-[length:200%_100%] animate-[borderMove_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            {/* Social Proof */}
            <div className="flex flex-col items-center gap-6 mt-10">
              {/* User Avatars */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["SC", "MR", "EW", "JP", "AC"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent/20 border-2 border-background flex items-center justify-center text-accent text-xs font-bold"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-foreground font-semibold">Join 2,500+ founders</div>
                  <div className="text-sm text-muted-foreground">who validated their ideas</div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm">Results in under 5 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm">60-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsCta;
