import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight, Rocket, Zap, Crown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  icon: LucideIcon;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$199",
    period: "one-time",
    description: "Perfect for validating a single idea",
    icon: Rocket,
    features: [
      "Market Validation Report",
      "Basic Competitor Analysis",
      "Target Audience Insights",
      "PDF Export",
      "Email Support",
    ],
    cta: "Validate My Idea",
    popular: false,
  },
  {
    name: "Pro",
    price: "$799",
    period: "one-time",
    description: "Everything you need to launch",
    icon: Zap,
    features: [
      "Everything in Starter",
      "Complete Brand Manual",
      "AI-Generated Logo (3 options)",
      "Color Palette & Typography",
      "Product Mockups",
      "Landing Page Blueprint",
      "Priority Support",
    ],
    cta: "Validate My Idea",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$1299",
    period: "one-time",
    description: "For serious founders & teams",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Unlimited Revisions",
      "Custom Consultation (30 min)",
      "Pitch Deck Template",
      "Go-to-Market Strategy",
      "1-on-1 Strategy Session",
      "Lifetime Updates",
    ],
    cta: "Validate My Idea",
    popular: false,
  },
];

const PmsPricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, <span className="text-gradient-gold">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No subscriptions. No hidden fees. Pay once, own forever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl transition-all duration-300 ${
                plan.popular ? 'z-10 md:scale-105 md:-translate-y-2' : ''
              }`}
            >
              {/* Animated Border for Popular Plan */}
              {plan.popular && (
                <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-accent via-yellow-500 to-accent bg-[length:200%_100%] animate-[borderMove_3s_linear_infinite]" />
              )}

              <div className={`relative h-full flex flex-col glass-card p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "border-transparent shadow-lg shadow-accent/20"
                  : "border-border/50 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10"
              }`}>
                
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-accent text-background text-sm font-bold shadow-lg">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-14 h-14 rounded-2xl ${plan.popular ? 'bg-accent/20' : 'bg-muted'} flex items-center justify-center mx-auto mb-6`}>
                  <plan.icon className={`w-7 h-7 ${plan.popular ? 'text-accent' : 'text-muted-foreground'}`} />
                </div>

                {/* Plan Info */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-gradient-gold' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    <span className={plan.popular ? "text-foreground/80" : "text-muted-foreground"}>/{plan.period}</span>
                  </div>
                  <p className={`text-sm ${plan.popular ? "text-foreground" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full ${plan.popular ? 'bg-accent' : 'bg-muted-foreground/30'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-background' : 'text-foreground'}`} />
                      </div>
                      <span className={plan.popular ? "text-foreground" : "text-muted-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

                {/* CTA Button */}
                <Button
                  className={`w-full py-6 text-lg font-bold rounded-xl transition-all duration-300 group/btn ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[hsl(45,100%,55%)] to-[hsl(38,100%,50%)] hover:from-[hsl(45,100%,50%)] hover:to-[hsl(38,100%,45%)] text-white glow-white'
                      : 'bg-muted hover:bg-muted/80 text-foreground border border-border/50'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PmsPricing;
