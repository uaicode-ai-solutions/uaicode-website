import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "one-time",
    description: "Perfect for validating a single idea",
    features: [
      "Market Validation Report",
      "Basic Competitor Analysis",
      "Target Audience Insights",
      "PDF Export",
      "Email Support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "one-time",
    description: "Everything you need to launch",
    features: [
      "Everything in Starter",
      "Complete Brand Manual",
      "AI-Generated Logo (3 options)",
      "Color Palette & Typography",
      "Product Mockups",
      "Landing Page Blueprint",
      "Priority Support",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "one-time",
    description: "For serious founders & teams",
    features: [
      "Everything in Pro",
      "Unlimited Revisions",
      "Custom Consultation (30 min)",
      "Pitch Deck Template",
      "Go-to-Market Strategy",
      "1-on-1 Strategy Session",
      "Lifetime Updates",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PmsPricing = () => {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, <span className="text-gradient-gold">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No subscriptions. No hidden fees. Pay once, own forever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass-card p-8 rounded-2xl border transition-all duration-300 hover-lift ${
                plan.popular
                  ? "border-accent shadow-lg shadow-accent/10"
                  : "border-border/50"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-accent text-background text-sm font-semibold">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-accent hover:bg-accent/90 text-background"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            🛡️ <span className="font-semibold">60-Day Money-Back Guarantee</span> — 
            If you're not satisfied, we'll refund you. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PmsPricing;
