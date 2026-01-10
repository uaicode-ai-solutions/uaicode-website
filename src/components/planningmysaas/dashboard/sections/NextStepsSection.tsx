import { 
  Calendar, 
  FileText, 
  PlayCircle, 
  Package, 
  ArrowRight, 
  Download,
  Mail,
  MessageCircle,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Check,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  FileText,
  PlayCircle,
  Package,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface NextStepsSectionProps {
  onScheduleCall?: () => void;
  onDownloadPDF?: () => void;
}

const NextStepsSection = ({ onScheduleCall, onDownloadPDF }: NextStepsSectionProps) => {
  const { nextSteps, viabilityScore, verdictHeadline, investment, timeline } = reportData;

  // Calculate total weeks from timeline
  const totalWeeks = timeline.reduce((acc, phase) => {
    const match = phase.duration.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  const investmentHighlights = [
    "Complete MVP development",
    "12 months hosting included",
    "30 days post-launch support",
    "Full documentation & training"
  ];

  return (
    <section id="next-steps" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Next Steps</h2>
        <p className="text-lg text-accent">{nextSteps.verdictSummary}</p>
      </div>

      {/* Summary Card with Investment */}
      <Card className="bg-gradient-to-br from-accent/10 via-card to-card border-accent/20 ring-1 ring-accent/10">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Score Recap */}
            <div className="flex-shrink-0 text-center">
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-muted/30"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="url(#nextStepsGradient)"
                    strokeWidth="6"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${(viabilityScore / 100) * 302} 302`}
                  />
                  <defs>
                    <linearGradient id="nextStepsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="hsl(45, 100%, 45%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-accent">{viabilityScore}</span>
                  <span className="text-xs text-muted-foreground">Score</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground max-w-[200px]">{verdictHeadline}</p>
            </div>

            {/* Investment Display */}
            <div className="flex-shrink-0 text-center lg:text-left lg:border-l lg:border-r lg:border-border/30 lg:px-6">
              <Badge className="bg-accent/10 text-accent border-accent/20 mb-2">
                <DollarSign className="h-3 w-3 mr-1" />
                Total MVP Investment
              </Badge>
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-1 animate-pulse">
                {formatCurrency(investment.total)}
              </div>
              <p className="text-xs text-muted-foreground mb-3">One-time payment</p>
              <ul className="space-y-1.5">
                {investmentHighlights.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {investment.comparison && (
                <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-400">
                    <span className="font-bold">{investment.comparison.savings}</span> savings vs traditional agency
                  </p>
                </div>
              )}
            </div>

            {/* Steps */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-4 text-sm">What happens when you hire us:</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {nextSteps.steps.map((step, index) => {
                  const IconComponent = iconMap[step.icon] || Calendar;
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-2 p-3 rounded-lg bg-card/50 border border-border/30 hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-accent">{step.step}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-xs">{step.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgency Banner */}
      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
        <Clock className="h-4 w-4 text-accent" />
        <p className="text-sm text-foreground">
          <span className="text-accent font-semibold">Start this week</span> and launch in approximately {totalWeeks} weeks
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          size="lg"
          onClick={onScheduleCall}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-6 h-12 shadow-lg shadow-accent/20"
        >
          <Calendar className="h-4 w-4" />
          {nextSteps.cta.primary}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button 
          size="lg"
          variant="outline"
          onClick={onDownloadPDF}
          className="border-border/50 hover:border-accent/50 gap-2 h-12"
        >
          <Download className="h-4 w-4" />
          {nextSteps.cta.secondary}
        </Button>
      </div>

      {/* Contact Info */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3 text-center text-sm">Direct Contact</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={`mailto:${nextSteps.contact.email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-sm"
            >
              <Mail className="h-4 w-4" />
              <span>{nextSteps.contact.email}</span>
            </a>
            <a 
              href={`https://wa.me/${nextSteps.contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{nextSteps.contact.whatsapp}</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Final Message with Investment */}
      <Card className="bg-gradient-to-br from-accent/5 via-card to-accent/5 border-accent/20">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-base font-medium text-foreground">
              We're ready to turn your idea into reality
            </span>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto mb-4 text-sm">
            For just <span className="text-accent font-bold text-lg">{formatCurrency(investment.total)}</span>, 
            get your complete MVP developed by Uaicode's expert team. This includes full development, 
            hosting, documentation, and post-launch support.
          </p>
          <Button 
            size="lg"
            onClick={onScheduleCall}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <Calendar className="h-4 w-4" />
            Start Your Project Today
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
            This report was generated based on the information provided and market analysis. 
            The numbers are projections and may vary depending on project execution.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default NextStepsSection;
