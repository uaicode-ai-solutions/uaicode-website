import { ArrowRight, Calendar, Download, Mail, MessageCircle, Sparkles, Target, TrendingUp, BarChart3, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MarketingNextStepsProps {
  onScheduleCall?: () => void;
  onDownloadPDF?: () => void;
}

const MarketingNextSteps = ({ onScheduleCall, onDownloadPDF }: MarketingNextStepsProps) => {
  const steps = [
    { icon: Target, title: "Strategy Call", desc: "30-min consultation" },
    { icon: TrendingUp, title: "Custom Plan", desc: "90-day roadmap" },
    { icon: BarChart3, title: "Launch", desc: "Go live with campaigns" },
    { icon: Zap, title: "Optimize", desc: "Weekly improvements" },
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
    <section id="marketing-next-steps" className="space-y-6 animate-fade-in">
      {/* CTA Banner */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Ready to Transform Your Marketing?</h2>
                <p className="text-sm text-muted-foreground">Join 150+ successful SaaS companies</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleScheduleCall}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button size="lg" variant="outline" className="border-accent/30 text-accent" onClick={onDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Steps */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => (
          <Card key={idx} className="bg-card/50 border-border/30 relative">
            <CardContent className="p-4 text-center">
              {idx < steps.length - 1 && (
                <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-4 w-4 text-muted-foreground z-10 hidden lg:block" />
              )}
              <Badge className="bg-accent text-accent-foreground text-[9px] mb-2">Step {idx + 1}</Badge>
              <step.icon className="h-5 w-5 text-accent mx-auto mb-1" />
              <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
              <p className="text-[10px] text-muted-foreground">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-3 gap-3">
        <Card 
          className="bg-card/50 border-border/30 cursor-pointer hover:border-accent/40 transition-all"
          onClick={handleScheduleCall}
        >
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Calendar className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Schedule Call</h4>
              <p className="text-[10px] text-muted-foreground">30-min strategy</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30 cursor-pointer hover:border-accent/40 transition-all">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Mail className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Email Us</h4>
              <p className="text-[10px] text-accent">contato@uaicode.io</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-card/50 border-border/30 cursor-pointer hover:border-green-500/40 transition-all"
          onClick={handleWhatsApp}
        >
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <MessageCircle className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">WhatsApp</h4>
              <p className="text-[10px] text-green-500">Chat now</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] text-muted-foreground text-center">
        * Analysis based on competitive research. $5,000/mo service fee excludes ad spend budget.
      </p>
    </section>
  );
};

export default MarketingNextSteps;
