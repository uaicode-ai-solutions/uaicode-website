import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Rocket, CheckCircle, Sparkles } from "lucide-react";
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
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pms_offer_expiry');
    if (saved) {
      const remaining = parseInt(saved) - Date.now();
      if (remaining > 0) return remaining;
    }
    // Se não existe ou expirou, criar nova oferta de 6 horas
    const expiry = Date.now() + 6 * 60 * 60 * 1000;
    localStorage.setItem('pms_offer_expiry', expiry.toString());
    return 6 * 60 * 60 * 1000;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          // Reiniciar timer quando expirar
          const newExpiry = Date.now() + 6 * 60 * 60 * 1000;
          localStorage.setItem('pms_offer_expiry', newExpiry.toString());
          return 6 * 60 * 60 * 1000;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

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
        {/* Urgency Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 mb-6 animate-pulse">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">Limited Time Offer — Expires Soon!</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Lock In Your
          <span className="text-gradient-gold"> 10% Discount</span>
          <br />
          Before Time Runs Out
        </h2>

        {/* Subheadline */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Don't miss this exclusive opportunity. Join 2,500+ founders who already 
          validated their SaaS ideas — and saved on development costs.
        </p>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          <div className="text-center">
            <div className="glass-premium border border-red-500/40 rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px] shadow-lg shadow-red-500/10">
              <span className="text-2xl sm:text-4xl font-bold text-red-400">{hours.toString().padStart(2, '0')}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-2 block">HOURS</span>
          </div>
          <span className="text-2xl sm:text-3xl text-red-400 font-bold mt-[-20px]">:</span>
          <div className="text-center">
            <div className="glass-premium border border-red-500/40 rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px] shadow-lg shadow-red-500/10">
              <span className="text-2xl sm:text-4xl font-bold text-red-400">{minutes.toString().padStart(2, '0')}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-2 block">MINUTES</span>
          </div>
          <span className="text-2xl sm:text-3xl text-red-400 font-bold mt-[-20px]">:</span>
          <div className="text-center">
            <div className="glass-premium border border-red-500/40 rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px] shadow-lg shadow-red-500/10">
              <span className="text-2xl sm:text-4xl font-bold text-red-400">{seconds.toString().padStart(2, '0')}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-2 block">SECONDS</span>
          </div>
        </div>

        {/* Discount Highlight */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-xl sm:text-2xl text-muted-foreground line-through opacity-60">$60,500</span>
            <ArrowRight className="w-5 h-5 text-accent hidden sm:block" />
            <span className="text-3xl sm:text-4xl font-bold text-accent">$54,450</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">You save $6,050 with this offer</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-background font-bold text-lg px-10 py-6 rounded-xl group shadow-lg shadow-accent/30"
          onClick={() => scrollToSection("pricing")}
        >
          <Rocket className="mr-2 w-5 h-5" />
          Claim My 10% Discount Now
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Offer expires soon</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">60-day money-back guarantee</span>
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
