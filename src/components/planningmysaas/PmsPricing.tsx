import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Rocket } from "lucide-react";

const features = [
  "Complete Market Validation Report",
  "In-depth Competitor Analysis",
  "Target Audience Insights",
  "Complete Brand Manual",
  "AI-Generated Logo (3 options)",
  "Color Palette & Typography",
  "Product Mockups",
  "Landing Page Blueprint",
  "Go-to-Market Strategy",
  "PDF Export",
  "Priority Support",
];

const PmsPricing = () => {
  const navigate = useNavigate();

  const handleValidate = () => {
    navigate("/planningmysaas/wizard");
  };

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

        {/* Single Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="relative group">
            {/* Animated Border */}
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-accent via-yellow-500 to-accent bg-[length:200%_100%] animate-[borderMove_3s_linear_infinite]" />

            <div className="relative h-full flex flex-col glass-card p-8 rounded-2xl border border-transparent shadow-lg shadow-accent/20">
              
              {/* Plan Icon */}
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-7 h-7 text-accent" />
              </div>

              {/* Plan Info */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-gradient-gold">
                    $199
                  </span>
                  <span className="text-foreground/80">/one-time</span>
                </div>
                <p className="text-foreground">
                  Everything you need to validate and launch your SaaS idea
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-background" />
                    </div>
                    <span className="text-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

              {/* CTA Button */}
              <Button
                onClick={handleValidate}
                className="w-full py-6 text-lg font-bold rounded-xl transition-all duration-300 group/btn bg-gradient-to-r from-[hsl(45,100%,55%)] to-[hsl(38,100%,50%)] hover:from-[hsl(45,100%,50%)] hover:to-[hsl(38,100%,45%)] text-white glow-white"
              >
                Validate My Idea
                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PmsPricing;
