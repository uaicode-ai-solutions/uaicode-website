import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Rocket, CheckCircle } from "lucide-react";
import sarahJohnsonImg from "@/assets/testimonial-sarah-johnson.webp";
import emmaThompsonImg from "@/assets/testimonial-emma-thompson.webp";
import johnSmithImg from "@/assets/testimonial-john-smith.webp";
import mariaSantosImg from "@/assets/testimonial-maria-santos.webp";
import carlosOliveiraImg from "@/assets/testimonial-carlos-oliveira.webp";

const founderAvatars = [
  { image: sarahJohnsonImg, name: "Sarah Johnson" },
  { image: emmaThompsonImg, name: "Emma Thompson" },
  { image: johnSmithImg, name: "John Smith" },
  { image: mariaSantosImg, name: "Maria Santos" },
  { image: carlosOliveiraImg, name: "Carlos Oliveira" },
];

const PmsCta = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      {/* Top Border Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      {/* Subtle Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-accent/30 mb-8">
          <Rocket className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">Start Your Journey</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Ready to Turn Your Idea
          <br />
          <span className="text-gradient-gold">Into Reality?</span>
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Join thousands of founders who validated their SaaS ideas before writing 
          a single line of code. Your journey to success starts here.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-background font-bold text-lg px-10 py-6 rounded-xl group"
          onClick={() => scrollToSection("pricing")}
        >
          Get Started Now
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">No credit card required</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Results in 5 minutes</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">2,500+ Ideas Validated</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-4 mt-10">
        <div className="flex -space-x-3">
            {founderAvatars.map((founder, i) => (
              <img
                key={i}
                src={founder.image}
                alt={founder.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-background"
              />
            ))}
          </div>
          <div className="text-left">
            <div className="text-foreground font-semibold">Join 2,500+ founders</div>
            <div className="text-sm text-muted-foreground">who validated their ideas</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsCta;
