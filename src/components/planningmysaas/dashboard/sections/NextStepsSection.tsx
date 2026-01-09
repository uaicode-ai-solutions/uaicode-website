import { 
  Calendar, 
  FileText, 
  PlayCircle, 
  Package, 
  ArrowRight, 
  Download,
  Mail,
  MessageCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  FileText,
  PlayCircle,
  Package,
};

interface NextStepsSectionProps {
  onScheduleCall?: () => void;
  onDownloadPDF?: () => void;
}

const NextStepsSection = ({ onScheduleCall, onDownloadPDF }: NextStepsSectionProps) => {
  const { nextSteps, viabilityScore, verdictHeadline } = reportData;

  return (
    <section id="next-steps" className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Next Steps</h2>
        <p className="text-lg text-accent">{nextSteps.verdictSummary}</p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-accent/10 via-card to-card border-accent/20">
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
                    stroke="url(#nextStepsGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${(viabilityScore / 100) * 352} 352`}
                  />
                  <defs>
                    <linearGradient id="nextStepsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="hsl(45, 100%, 45%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-accent">{viabilityScore}</span>
                  <span className="text-xs text-muted-foreground">Score</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">{verdictHeadline}</p>
            </div>

            {/* Steps */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-6">What happens when you hire us:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {nextSteps.steps.map((step, index) => {
                  const IconComponent = iconMap[step.icon] || Calendar;
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/30"
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
          {nextSteps.cta.primary}
          <ArrowRight className="h-5 w-5" />
        </Button>
        <Button 
          size="lg"
          variant="outline"
          onClick={onDownloadPDF}
          className="border-border/50 hover:border-accent/50 gap-2 h-14"
        >
          <Download className="h-5 w-5" />
          {nextSteps.cta.secondary}
        </Button>
      </div>

      {/* Contact Info */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 text-center">Direct Contact</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href={`mailto:${nextSteps.contact.email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{nextSteps.contact.email}</span>
            </a>
            <a 
              href={`https://wa.me/${nextSteps.contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{nextSteps.contact.whatsapp}</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Final Message */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <span className="text-lg font-medium text-foreground">
            We're ready to turn your idea into reality
          </span>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          This report was generated based on the information provided and market analysis. 
          The numbers are projections and may vary depending on project execution.
        </p>
      </div>
    </section>
  );
};

export default NextStepsSection;
