import { Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingTransparency = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAccordionChange = (value: string) => {
    if (value) {
      setTimeout(() => {
        const element = document.querySelector(`[value="${value}"]`);
        if (element) {
          element.scrollIntoView({ 
            behavior: "smooth", 
            block: "nearest",
            inline: "nearest" 
          });
        }
      }, 150);
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Transparent Solutions for <span className="text-gradient-gold">Every Vision</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect package to bring your SaaS idea to life
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-start">
          {/* Starter MVP */}
          <div className="glass-card p-6 md:p-8 rounded-2xl hover-lift flex flex-col h-full transition-all duration-500 ease-in-out">
            <h3 className="text-2xl font-bold mb-4">Starter MVP</h3>
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">
                $8,000 - $12,000
              </div>
            <p className="text-sm text-muted-foreground mb-6">
              Timeline: 30-45 days
            </p>
            
            <ul className="space-y-3 mb-6 min-h-[120px]">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Launch Your Idea Fast</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Core Features Only</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Essential AI Tools</span>
              </li>
            </ul>

            <AccordionItem value="starter" className="border-accent/20 mb-6">
              <AccordionTrigger className="text-accent hover:text-accent/80 text-sm font-semibold py-3">
                What's Included
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground [&>li]:animate-fade-in [&>li:nth-child(1)]:animation-delay-[50ms] [&>li:nth-child(2)]:animation-delay-[100ms] [&>li:nth-child(3)]:animation-delay-[150ms] [&>li:nth-child(4)]:animation-delay-[200ms] [&>li:nth-child(5)]:animation-delay-[250ms] [&>li:nth-child(6)]:animation-delay-[300ms]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>3-5 core features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>User authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Payment integration (Stripe)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Basic admin panel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Responsive design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>AI-optimized templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>30 days of support</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <Button
              onClick={() => scrollToSection("schedule")}
              variant="outline"
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Request Detailed Quote
            </Button>
          </div>

          {/* Growth MVP - Most Popular */}
          <div className="relative p-6 md:p-8 rounded-2xl hover-lift flex flex-col h-full border-2 border-yellow-500 shadow-lg shadow-yellow-500/20 bg-gradient-to-b from-yellow-500/10 via-yellow-600/5 to-transparent backdrop-blur-sm transition-all duration-500 ease-in-out">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-md">
              Most Popular
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Growth MVP</h3>
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">
                $15,000 - $25,000
              </div>
            <p className="text-sm text-muted-foreground mb-6">
              Timeline: 45-60 days
            </p>
            
            <ul className="space-y-3 mb-6 min-h-[120px]">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Scale Your Vision</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Advanced Features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">AI-Powered Automation</span>
              </li>
            </ul>

            <AccordionItem value="growth" className="border-accent/20 mb-6">
              <AccordionTrigger className="text-accent hover:text-accent/80 text-sm font-semibold py-3">
                What's Included
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground [&>li]:animate-fade-in [&>li:nth-child(1)]:animation-delay-[50ms] [&>li:nth-child(2)]:animation-delay-[100ms] [&>li:nth-child(3)]:animation-delay-[150ms] [&>li:nth-child(4)]:animation-delay-[200ms] [&>li:nth-child(5)]:animation-delay-[250ms] [&>li:nth-child(6)]:animation-delay-[300ms]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>8-12 advanced features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Multi-role authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Payment & subscription management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Advanced admin dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Mobile-responsive design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>AI integration & automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>API development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>60 days of support</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <Button
              onClick={() => scrollToSection("schedule")}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Request Detailed Quote
            </Button>
          </div>

          {/* Enterprise MVP */}
          <div className="glass-card p-6 md:p-8 rounded-2xl hover-lift flex flex-col h-full transition-all duration-500 ease-in-out">
            <h3 className="text-2xl font-bold mb-4">Enterprise MVP</h3>
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">
                $30,000+
              </div>
            <p className="text-sm text-muted-foreground mb-6">
              Timeline: 60-90 days
            </p>
            
            <ul className="space-y-3 mb-6 min-h-[120px]">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Full-Stack Solution</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Custom AI Models</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Priority Support</span>
              </li>
            </ul>

            <AccordionItem value="enterprise" className="border-accent/20 mb-6">
              <AccordionTrigger className="text-accent hover:text-accent/80 text-sm font-semibold py-3">
                What's Included
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground [&>li]:animate-fade-in [&>li:nth-child(1)]:animation-delay-[50ms] [&>li:nth-child(2)]:animation-delay-[100ms] [&>li:nth-child(3)]:animation-delay-[150ms] [&>li:nth-child(4)]:animation-delay-[200ms] [&>li:nth-child(5)]:animation-delay-[250ms] [&>li:nth-child(6)]:animation-delay-[300ms]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>15+ custom features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Enterprise-grade authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Advanced payment solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Complex admin systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Multi-platform support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Custom AI model integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Dedicated API infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Real-time analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Third-party integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>90 days of priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Dedicated project manager</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <Button
              onClick={() => scrollToSection("schedule")}
              variant="outline"
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Request Detailed Quote
            </Button>
          </div>
        </div>
        </Accordion>
      </div>
    </section>
  );
};

export default PricingTransparency;
