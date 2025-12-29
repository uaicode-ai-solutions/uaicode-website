import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  
  const pricing = {
    monthly: { price: 20000, label: "per month" },
    annual: { price: 12000, label: "per month" }
  };
  
  const discount = pricing.monthly.price - pricing.annual.price; // $8,000
  const discountPercent = Math.round((discount / pricing.monthly.price) * 100); // 40%

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="subscription" className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Learn more about our <span className="text-gradient-gold">Subscription</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Keep your solution stable, secure, and constantly evolving
          </p>
        </div>

        {/* Pricing Card */}
        <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto mb-12 animate-fade-in-up">
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <Tabs 
              value={billingCycle} 
              onValueChange={(value) => setBillingCycle(value as "monthly" | "annual")}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pricing Display */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-semibold text-muted-foreground">US$</span>
                <span className="text-[5rem] md:text-[6.5rem] font-bold text-gradient-gold leading-none">
                  {pricing[billingCycle].price.toLocaleString()}
                </span>
                <span className="text-2xl font-semibold text-muted-foreground">/month</span>
              </div>
              <p className="text-lg text-muted-foreground">
                {billingCycle === "annual" ? "Annual Contract" : "Monthly Contract"}
              </p>
            </div>
            
            {billingCycle === "monthly" && (
              <p className="text-sm text-muted-foreground animate-fade-in">
                Save <span style={{ color: '#FFBE14' }}>${discount.toLocaleString()} per month</span> with annual billing (<span style={{ color: '#FFBE14' }}>{discountPercent}% discount</span>)
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg"
              className="glow-white text-lg px-8 py-6"
              onClick={() => scrollToSection("schedule")}
            >
              <Stethoscope className="mr-1.5 h-5 w-5" />
              Schedule Free Diagnostic
            </Button>
            <p className="text-sm text-muted-foreground">
              I want AI agents in my company
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
