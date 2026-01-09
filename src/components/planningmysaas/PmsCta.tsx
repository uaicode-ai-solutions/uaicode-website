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
      
      {/* Animated Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Animated Border */}
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-accent via-purple-500 to-accent bg-[length:200%_100%] animate-[borderMove_3s_linear_infinite]" />
          
          {/* Card Content */}
          <div className="relative glass-premium rounded-3xl p-8 md:p-12 lg:p-16 text-center border-0">
            {/* Decorative Stars */}
            <div className="absolute top-8 left-8 text-accent/30">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute top-8 right-8 text-purple-500/30">
              <Star className="w-6 h-6" />
            </div>
            <div className="absolute bottom-8 left-12 text-purple-500/30">
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

            {/* Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
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
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm">60-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsCta;
