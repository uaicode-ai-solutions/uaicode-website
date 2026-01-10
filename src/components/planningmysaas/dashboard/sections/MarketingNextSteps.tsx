import { 
  Calendar, 
  FileText, 
  Megaphone, 
  TrendingUp, 
  ArrowRight, 
  Download,
  Mail,
  MessageCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Megaphone,
  TrendingUp,
  Calendar,
};

interface MarketingNextStepsProps {
  onScheduleCall?: () => void;
  onDownloadPDF?: () => void;
}

const MarketingNextSteps = ({ onScheduleCall, onDownloadPDF }: MarketingNextStepsProps) => {
  const marketingScore = 72;
  
  const steps = [
    {
      step: 1,
      icon: "FileText",
      title: "Strategy Workshop",
      description: "Deep dive into your competitive positioning and ideal customer profile"
    },
    {
      step: 2,
      icon: "Megaphone",
      title: "Campaign Setup",
      description: "Build your paid media infrastructure with tracking and creative assets"
    },
    {
      step: 3,
      icon: "TrendingUp",
      title: "Launch & Optimize",
      description: "Go live with campaigns and begin weekly optimization cycles"
    },
    {
      step: 4,
      icon: "Calendar",
      title: "Scale & Expand",
      description: "Double down on winning channels and expand to new opportunities"
    }
  ];

  const contact = {
    email: "marketing@uaicode.com",
    whatsapp: "+1 (555) 123-4567"
  };

  return (
    <section id="marketing-next-steps" className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Dominate Your Market?</h2>
        <p className="text-lg text-accent">Let's turn these insights into results</p>
      </div>

      {/* Summary Card */}
      <Card className="glass-premium border-accent/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Score Recap */}
            <div className="flex-shrink-0 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/30"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#marketingNextStepsGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${(marketingScore / 100) * 352} 352`}
                  />
                  <defs>
                    <linearGradient id="marketingNextStepsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="hsl(45, 100%, 45%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-accent">{marketingScore}</span>
                  <span className="text-xs text-muted-foreground">Score</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Strong position with untapped opportunities
              </p>
            </div>

            {/* Steps */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-6">What happens when you hire us:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {steps.map((step, index) => {
                  const IconComponent = iconMap[step.icon] || Calendar;
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/10"
                    >
                      <div className="p-2 rounded-lg bg-accent/10">
                        <IconComponent className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-accent font-medium">Step {step.step}</span>
                        </div>
                        <h4 className="font-medium text-foreground text-sm">{step.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg"
          onClick={onScheduleCall}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-8 h-14 text-lg"
        >
          <Calendar className="h-5 w-5" />
          Get Your Marketing Strategy
          <ArrowRight className="h-5 w-5" />
        </Button>
        <Button 
          size="lg"
          variant="outline"
          onClick={onDownloadPDF}
          className="border-accent/30 hover:border-accent/50 hover:bg-accent/5 gap-2 h-14"
        >
          <Download className="h-5 w-5" />
          Download Marketing Report
        </Button>
      </div>

      {/* Contact Info */}
      <Card className="bg-card/50 border-accent/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 text-center">Direct Contact</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{contact.email}</span>
            </a>
            <a 
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{contact.whatsapp}</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Final Message */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle2 className="h-6 w-6 text-accent" />
          <span className="text-lg font-medium text-foreground">
            We're ready to accelerate your growth
          </span>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          This analysis was generated based on competitive data and market research. 
          Results may vary based on execution, budget, and market conditions.
        </p>
      </div>
    </section>
  );
};

export default MarketingNextSteps;
