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
  Clock,
  AlertCircle,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";
import { useState } from "react";

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
  const [selectedPackage, setSelectedPackage] = useState<'mvp-only' | 'mvp-marketing'>('mvp-marketing');

  // Calculate total weeks from timeline
  const totalWeeks = timeline.reduce((acc, phase) => {
    const match = phase.duration.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  const mvpPrice = investment.total;
  const mvpDiscountedPrice = Math.round(investment.total * 0.9);
  const mvpSavings = mvpPrice - mvpDiscountedPrice;
  const marketingMonthly = 8000;

  const pricingOptions = [
    {
      id: 'mvp-only' as const,
      name: 'MVP Development',
      badge: null,
      price: mvpPrice,
      priceLabel: 'one-time payment',
      discount: null,
      features: [
        "Complete MVP development",
        "12 months hosting included",
        "30 days post-launch support",
        "Full documentation & training"
      ],
      marketingNote: null,
      recommended: false
    },
    {
      id: 'mvp-marketing' as const,
      name: 'MVP + Marketing',
      badge: 'RECOMMENDED',
      price: mvpDiscountedPrice,
      priceLabel: '10% OFF on MVP',
      discount: {
        original: mvpPrice,
        savings: mvpSavings
      },
      features: [
        "Everything in MVP Development",
        `10% discount on MVP (save ${formatCurrency(mvpSavings)})`,
        "Full-stack marketing team",
        "Paid media management included",
        "AI-powered campaign optimization",
        "Dedicated account manager"
      ],
      marketingNote: {
        monthly: marketingMonthly,
        note: "Starts after MVP launch"
      },
      recommended: true
    }
  ];

  return (
    <section id="next-steps" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <ArrowRight className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Next Steps</h2>
            <InfoTooltip side="right" size="sm">
              Choose your package and start building your project today.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Choose your package and start building</p>
        </div>
      </div>

      {/* Viability Score Summary */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="transparent"
                  className="text-muted/30"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="url(#nextStepsGradient)"
                  strokeWidth="5"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${(viabilityScore / 100) * 214} 214`}
                />
                <defs>
                  <linearGradient id="nextStepsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--accent))" />
                    <stop offset="100%" stopColor="hsl(45, 100%, 45%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-accent">{viabilityScore}</span>
                <span className="text-[10px] text-muted-foreground">Score</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-foreground">{verdictHeadline}</p>
              <p className="text-xs text-muted-foreground mt-1">Your project is ready to be built</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {pricingOptions.map((option) => (
          <Card 
            key={option.id}
            onClick={() => setSelectedPackage(option.id)}
            className={`relative cursor-pointer transition-all duration-300 ${
              option.recommended 
                ? 'bg-gradient-to-br from-accent/15 via-card to-card border-accent/40 ring-2 ring-accent/20' 
                : 'bg-card/50 border-border/30 hover:border-border/50'
            } ${
              selectedPackage === option.id 
                ? 'ring-2 ring-accent shadow-lg shadow-accent/10' 
                : ''
            }`}
          >
            {option.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground px-3 py-1 text-xs font-bold shadow-lg">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {option.badge}
                </Badge>
              </div>
            )}
            <CardContent className={`p-6 ${option.badge ? 'pt-8' : ''}`}>
              {/* Package Name */}
              <h3 className="text-lg font-bold text-foreground mb-4 text-center">{option.name}</h3>
              
              {/* Price */}
              <div className="text-center mb-4">
                {option.discount && (
                  <p className="text-sm text-muted-foreground line-through mb-1">
                    {formatCurrency(option.discount.original)}
                  </p>
                )}
                <div className="text-3xl font-bold text-accent">
                  {formatCurrency(option.price)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{option.priceLabel}</p>
                {option.discount && (
                  <Badge className="mt-2 bg-green-500/10 text-green-400 border-green-500/20">
                    Save {formatCurrency(option.discount.savings)}
                  </Badge>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Marketing Note */}
              {option.marketingNote && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-foreground">
                      + {formatCurrency(option.marketingNote.monthly)}/month
                    </span>
                  </div>
                  <p className="text-xs text-blue-400">{option.marketingNote.note}</p>
                </div>
              )}

              {/* Select Button */}
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPackage(option.id);
                  onScheduleCall?.();
                }}
                className={`w-full gap-2 ${
                  option.recommended 
                    ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20' 
                    : 'bg-muted/50 hover:bg-muted text-foreground border border-border/50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Schedule a Call
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marketing Billing Notice */}
      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Important:</span> Marketing costs ({formatCurrency(marketingMonthly)}/month) 
          are <span className="text-blue-400 font-semibold">only charged after your MVP is launched</span>
        </p>
      </div>

      {/* Urgency Banner */}
      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
        <Clock className="h-4 w-4 text-accent" />
        <p className="text-sm text-foreground">
          <span className="text-accent font-semibold">Start this week</span> and launch in approximately {totalWeeks} weeks
        </p>
      </div>

      {/* What happens when you hire us */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 text-sm text-center">What happens when you hire us:</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {nextSteps.steps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || Calendar;
              return (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg bg-muted/10 border border-border/30 hover:border-accent/30 transition-colors"
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
        </CardContent>
      </Card>

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

      {/* Final Message */}
      <Card className="bg-gradient-to-br from-accent/5 via-card to-accent/5 border-accent/20">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-base font-medium text-foreground">
              We're ready to turn your idea into reality
            </span>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto mb-4 text-sm">
            Choose between <span className="text-foreground font-medium">MVP only</span> at {formatCurrency(mvpPrice)} or 
            get <span className="text-accent font-bold">MVP + Marketing</span> with 10% discount at {formatCurrency(mvpDiscountedPrice)}. 
            Marketing services start only after your MVP launches.
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
