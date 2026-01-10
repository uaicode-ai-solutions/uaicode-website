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

  const marketingScore = 72;
  
  const nextSteps = [
    {
      step: 1,
      title: "Schedule Strategy Call",
      description: "30-minute consultation to discuss your marketing goals and current challenges",
      icon: "Target"
    },
    {
      step: 2,
      title: "Custom Marketing Plan",
      description: "Receive a detailed 90-day marketing strategy tailored to your ICP",
      icon: "TrendingUp"
    },
    {
      step: 3,
      title: "Campaign Launch",
      description: "Go live with optimized campaigns across all recommended channels",
      icon: "BarChart3"
    },
    {
      step: 4,
      title: "Continuous Optimization",
      description: "Weekly performance reviews and ongoing campaign improvements",
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-accent";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <section id="marketing-next-steps" className="space-y-8">
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

      {/* Investment Summary Card */}
      <Card className="glass-premium border-accent/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
        <CardContent className="p-8 relative">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#marketingGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(marketingScore / 100) * 352} 352`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="marketingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(marketingScore)}`}>{marketingScore}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Marketing Score</p>
            </div>

            {/* Investment */}
            <div className="text-center lg:text-left">
              <Badge className="bg-accent/20 text-accent border-accent/30 mb-3">
                <DollarSign className="h-3 w-3 mr-1" />
                Monthly Investment
              </Badge>
              <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                <span className="text-4xl font-bold text-accent">$3,000</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Full-service marketing execution + dedicated team
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                *Ad spend budget managed separately
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleScheduleCall}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Strategy Call
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full border-accent/30 text-accent hover:bg-accent/10"
                onClick={onDownloadPDF}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Marketing Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card className="bg-card/50 border-accent/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6 text-center">What Happens Next</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {nextSteps.map((step) => {
              const IconComponent = iconMap[step.icon] || Target;
              return (
                <div 
                  key={step.step}
                  className="relative p-4 rounded-lg bg-accent/5 border border-accent/20 text-center"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Step {step.step}
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <div className="p-3 rounded-full bg-accent/10 inline-flex mb-3">
                      <IconComponent className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card 
          className="bg-card/50 border-accent/20 cursor-pointer hover:border-accent/40 transition-colors"
          onClick={handleScheduleCall}
        >
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full bg-accent/10 inline-flex mb-3">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Schedule a Call</h4>
            <p className="text-sm text-muted-foreground">30-min strategy session</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30 cursor-pointer hover:border-accent/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full bg-accent/10 inline-flex mb-3">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Email Us</h4>
            <p className="text-sm text-accent">contato@uaicode.io</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-card/50 border-border/30 cursor-pointer hover:border-green-500/40 transition-colors"
          onClick={handleWhatsApp}
        >
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full bg-green-500/10 inline-flex mb-3">
              <MessageCircle className="h-6 w-6 text-green-500" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">WhatsApp</h4>
            <p className="text-sm text-green-500">Chat with us now</p>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA */}
      <Card className="glass-premium border-accent/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        <CardContent className="p-8 relative text-center">
          <Sparkles className="h-10 w-10 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Start Growing Today
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join 150+ successful SaaS companies that have transformed their marketing with Uaicode. 
            For just <span className="text-accent font-semibold">$3,000/month</span>, get a dedicated team focused on your growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {["Strategy", "Paid Media", "Content", "Optimization", "Reporting"].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
            onClick={handleScheduleCall}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Get Your Marketing Strategy
          </Button>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        * This analysis is based on competitive research and industry benchmarks. 
        Actual results may vary based on market conditions and execution quality. 
        Marketing service fee of $3,000/month does not include ad spend budget.
      </p>
    </section>
  );
};

export default MarketingNextSteps;
