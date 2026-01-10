import { ArrowRight, Calendar, Download, Mail, MessageCircle, CheckCircle2, Sparkles, Target, TrendingUp, BarChart3, Zap, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MarketingNextStepsProps {
  onScheduleCall?: () => void;
  onDownloadPDF?: () => void;
}

const MarketingNextSteps = ({ onScheduleCall, onDownloadPDF }: MarketingNextStepsProps) => {
  const iconMap: { [key: string]: React.ElementType } = {
    Target,
    TrendingUp,
    BarChart3,
    Zap
  };

  const nextSteps = [
    {
      step: 1,
      title: "Schedule Strategy Call",
      description: "30-minute consultation to discuss your marketing goals",
      icon: "Target"
    },
    {
      step: 2,
      title: "Custom Marketing Plan",
      description: "Receive a detailed 90-day marketing strategy",
      icon: "TrendingUp"
    },
    {
      step: 3,
      title: "Campaign Launch",
      description: "Go live with optimized campaigns",
      icon: "BarChart3"
    },
    {
      step: 4,
      title: "Continuous Optimization",
      description: "Weekly performance reviews and improvements",
      icon: "Zap"
    }
  ];

  const handleScheduleCall = () => {
    if (onScheduleCall) {
      onScheduleCall();
    } else {
      window.open("https://cal.com/uaicode", "_blank");
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/5531999999999?text=Hi!%20I%20want%20to%20learn%20more%20about%20Uaicode%27s%20marketing%20services.", "_blank");
  };

  return (
    <section id="marketing-next-steps" className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <ArrowRight className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ready to Transform Your Marketing?</h2>
          <p className="text-sm text-muted-foreground">Your next steps to dominate the market</p>
        </div>
      </div>

      {/* Simplified Investment Summary - No duplicate score */}
      <Card className="glass-premium border-accent/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Investment Info */}
            <div className="text-center md:text-left">
              <Badge className="bg-accent/20 text-accent border-accent/30 mb-2 text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                Monthly Investment
              </Badge>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <span className="text-3xl font-bold text-accent">$3,000</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Full-service marketing execution + dedicated team
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleScheduleCall}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Strategy Call
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-accent/30 text-accent hover:bg-accent/10"
                onClick={onDownloadPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Steps - with connecting arrows */}
      <Card className="bg-card/50 border-accent/20">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-5 text-center text-sm">What Happens Next</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {nextSteps.map((step, idx) => {
              const IconComponent = iconMap[step.icon] || Target;
              return (
                <div 
                  key={step.step}
                  className="relative p-4 rounded-lg bg-accent/5 border border-accent/20 text-center"
                >
                  {/* Connecting arrow */}
                  {idx < nextSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-4 w-4 text-accent/40" />
                    </div>
                  )}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground text-[10px]">
                      Step {step.step}
                    </Badge>
                  </div>
                  <div className="pt-3">
                    <div className="p-2 rounded-full bg-accent/10 inline-flex mb-2">
                      <IconComponent className="h-5 w-5 text-accent" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid grid-cols-3 gap-3">
        <Card 
          className="bg-card/50 border-accent/20 cursor-pointer hover:border-accent/40 transition-colors"
          onClick={handleScheduleCall}
        >
          <CardContent className="p-4 text-center">
            <div className="p-2 rounded-full bg-accent/10 inline-flex mb-2">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground text-sm mb-0.5">Schedule a Call</h4>
            <p className="text-xs text-muted-foreground">30-min strategy session</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30 cursor-pointer hover:border-accent/40 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="p-2 rounded-full bg-accent/10 inline-flex mb-2">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground text-sm mb-0.5">Email Us</h4>
            <p className="text-xs text-accent">contato@uaicode.io</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-card/50 border-border/30 cursor-pointer hover:border-green-500/40 transition-colors"
          onClick={handleWhatsApp}
        >
          <CardContent className="p-4 text-center">
            <div className="p-2 rounded-full bg-green-500/10 inline-flex mb-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
            </div>
            <h4 className="font-semibold text-foreground text-sm mb-0.5">WhatsApp</h4>
            <p className="text-xs text-green-500">Chat with us now</p>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA - with urgency */}
      <Card className="glass-premium border-accent/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        <CardContent className="p-6 relative text-center">
          <Sparkles className="h-8 w-8 text-accent mx-auto mb-3" />
          <h3 className="text-xl font-bold text-foreground mb-1.5">
            Start Growing Today
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            Join 150+ successful SaaS companies that have transformed their marketing with Uaicode.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {["Strategy", "Paid Media", "Content", "Optimization", "Reporting"].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
            onClick={handleScheduleCall}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Get Your Marketing Strategy
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            <span className="text-accent font-medium">Limited availability</span> — Only taking 3 new clients this month
          </p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground text-center">
        * This analysis is based on competitive research and industry benchmarks. 
        Actual results may vary. Marketing service fee of $3,000/month does not include ad spend budget.
      </p>
    </section>
  );
};

export default MarketingNextSteps;
