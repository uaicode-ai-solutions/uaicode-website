import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: CheckCircle, label: "2,500+ Ideas Validated" },
  { icon: Clock, label: "Ready in 5 Minutes" },
  { icon: Sparkles, label: "100% Free" },
];

const LpHero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
    {/* Background orbs */}
    <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-float pointer-events-none" />
    <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] animate-float-delayed pointer-events-none" />

    <div className="relative z-10 max-w-4xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-accent" />
        AI-Powered SaaS Validation
      </div>

      {/* Headline */}
      <h1 className="text-foreground mb-6 tracking-tight">
        Turn Your SaaS Idea Into a{" "}
        <span className="text-gradient-gold">Data-Driven Strategy</span>
        {" "}— In Minutes
      </h1>

      {/* Sub-headline */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
        Answer a few questions about your idea and get a complete validation report
        with market analysis, competitive landscape, pricing strategy, and financial
        projections. 100% free.
      </p>

      {/* CTA */}
      <Link to="/pms/wizard">
        <Button
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 glow-white text-lg px-10 py-6 rounded-xl font-semibold group"
        >
          Get My Free Report
          <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>

      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-14">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-muted-foreground text-sm">
            <item.icon className="w-4 h-4 text-accent" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LpHero;
