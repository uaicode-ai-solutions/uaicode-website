import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles, ChartBar, Palette, Target, Zap } from "lucide-react";

const featureCategories = [
  {
    icon: ChartBar,
    title: "Validation",
    features: [
      "Market Validation Report",
      "Competitor Analysis",
      "Financial Projections",
    ],
  },
  {
    icon: Palette,
    title: "Brand Assets",
    features: [
      "Complete Brand Manual",
      "AI-Generated Logo",
      "Product Mockups",
    ],
  },
  {
    icon: Target,
    title: "Strategy",
    features: [
      "Marketing Intelligence",
      "Go-to-Market Plan",
      "Landing Page Blueprint",
    ],
  },
  {
    icon: Zap,
    title: "Extras",
    features: [
      "Target Audience (ICP)",
      "PDF Export",
      "Priority Support",
    ],
  },
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
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* Animated Border */}
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-accent via-yellow-400 to-accent bg-[length:200%_100%] animate-[borderMove_3s_linear_infinite]" />
            
            {/* Glow Effect */}
            <div className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

            <div className="relative h-full flex flex-col bg-gradient-to-br from-background via-background to-accent/5 p-10 md:p-12 rounded-3xl border border-transparent shadow-2xl">
              
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-accent to-yellow-400 text-background font-bold text-sm shadow-lg shadow-accent/30">
                  <Sparkles className="w-4 h-4" />
                  ALL-INCLUSIVE
                </div>
              </div>

              {/* Price Section */}
              <div className="text-center mb-10 pt-4">
                <div className="flex items-baseline justify-center gap-3 mb-3">
                  <span className="text-2xl text-muted-foreground line-through">$499</span>
                  <span className="text-6xl md:text-7xl font-bold text-gradient-gold">
                    $199
                  </span>
                </div>
                <p className="text-lg text-muted-foreground">
                  One-time payment • Lifetime access
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-10" />

              {/* Features Grid by Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                {featureCategories.map((category, catIndex) => (
                  <div key={catIndex} className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <category.icon className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-semibold text-foreground">{category.title}</span>
                    </div>
                    <ul className="space-y-3">
                      {category.features.map((feature, featIndex) => (
                        <li key={featIndex} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-accent/30">
                            <Check className="w-3 h-3 text-background" />
                          </div>
                          <span className="text-sm text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>


              {/* CTA Button */}
              <Button
                onClick={handleValidate}
                size="lg"
                className="w-full py-7 text-lg font-bold rounded-2xl transition-all duration-300 group/btn bg-gradient-to-r from-accent via-yellow-400 to-accent hover:from-yellow-400 hover:via-accent hover:to-yellow-400 text-background shadow-xl shadow-accent/30 hover:shadow-accent/50 hover:scale-[1.02]"
              >
                Validate My Idea Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>

              {/* Helper Text */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Takes only 5 minutes to start • No credit card required
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PmsPricing;
