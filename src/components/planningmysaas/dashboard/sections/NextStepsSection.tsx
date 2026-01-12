import { 
  Calendar, 
  FileText, 
  PlayCircle, 
  Package, 
  ArrowRight, 
  Download,
  Mail,
  MessageCircle,
  Phone,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Check,
  Clock,
  AlertCircle,
  Star,
  Zap,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";
import { useState, useEffect } from "react";
import KyleConsultantDialog from "../KyleConsultantDialog";
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
  const [kyleDialogOpen, setKyleDialogOpen] = useState(false);
  const [selectedConsultPackage, setSelectedConsultPackage] = useState<string>('');

  // Countdown Timer - 4 hours offer
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pms_dashboard_offer_expiry');
    if (saved) {
      const remaining = parseInt(saved) - Date.now();
      return remaining > 0 ? remaining : 4 * 60 * 60 * 1000;
    }
    const expiry = Date.now() + 4 * 60 * 60 * 1000;
    localStorage.setItem('pms_dashboard_offer_expiry', expiry.toString());
    return 4 * 60 * 60 * 1000;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          const newExpiry = Date.now() + 4 * 60 * 60 * 1000;
          localStorage.setItem('pms_dashboard_offer_expiry', newExpiry.toString());
          return 4 * 60 * 60 * 1000;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

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
        "Full documentation & training",
        "Source code ownership",
        "Priority bug fixes"
      ],
      maintenanceNote: {
        afterMonths: 12,
        note: "After 12 months, hosting + priority bug fixes will be covered by a new infrastructure maintenance contract"
      },
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
        contract: 3000,
        recommendedAds: 5000,
        total: 8000,
        note: "Annual contract • Starts after MVP launch"
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

      {/* What happens when you hire us - Premium Cards */}
      <div className="space-y-6">
        <h3 className="font-semibold text-foreground text-center text-xl">
          What happens when you hire us
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nextSteps.steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || Calendar;
            return (
              <Card 
                key={index}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-accent/20 hover:border-accent/30 hover:shadow-accent/10"
              >
                {/* Decorative glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-accent/10 rounded-bl-[30px] -mr-3 -mt-3" />
                
                <CardContent className="relative p-5 text-center">
                  {/* Step Number Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">{step.step}</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <IconComponent className="h-6 w-6 text-accent" />
                  </div>
                  
                  {/* Title */}
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    {step.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pricing Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {pricingOptions.map((option) => (
          <Card 
            key={option.id}
            onClick={() => setSelectedPackage(option.id)}
            className={`relative cursor-pointer transition-all duration-300 h-full ${
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
            <CardContent className={`p-6 flex flex-col h-full ${option.badge ? 'pt-8' : ''}`}>
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

              {/* Payment Terms */}
              <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-muted/20 border border-border/30">
                <CreditCard className="h-4 w-4 text-foreground/60 flex-shrink-0" />
                <p className="text-xs text-foreground/70">
                  <span className="font-medium text-foreground">50%</span> at contract signing + 
                  <span className="font-medium text-foreground"> 50%</span> at final delivery
                </p>
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

              {/* Maintenance Note - for MVP Development */}
              {option.maintenanceNote && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-foreground/70 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-foreground/70">
                        <span className="font-medium text-foreground">After {option.maintenanceNote.afterMonths} months:</span>{" "}
                        Hosting infrastructure + priority bug fixes will be covered by a new maintenance contract.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Marketing Note */}
              {option.marketingNote && (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4 space-y-2">
                  {/* Total */}
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      + {formatCurrency(option.marketingNote.total)}/month
                    </span>
                  </div>
                  
                  {/* Breakdown */}
                  <div className="pl-6 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Marketing contract (annual)</span>
                      <span className="text-foreground font-medium">{formatCurrency(option.marketingNote.contract)}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Recommended ad spend</span>
                      <span className="text-accent font-medium">{formatCurrency(option.marketingNote.recommendedAds)}/mo*</span>
                    </div>
                  </div>
                  
                  {/* Note */}
                  <p className="text-xs text-accent/80 pl-6">
                    *Suggested investment • {option.marketingNote.note}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-auto pt-4">
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
                
                <Button 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedConsultPackage(option.name);
                    setKyleDialogOpen(true);
                  }}
                  className="w-full gap-2 border-accent/30 hover:border-accent/50 hover:bg-accent/10 text-foreground"
                >
                  <div className="relative">
                    <Phone className="h-4 w-4 text-accent" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </div>
                  Talk to Our Consultant
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marketing Billing Notice */}
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-accent flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Important:</span> Marketing costs are 
            <span className="text-accent font-semibold"> only charged after your MVP is launched</span>
          </p>
        </div>
        <p className="text-xs text-foreground/60 text-center">
          The {formatCurrency(3000)}/month contract is an annual commitment. 
          The {formatCurrency(5000)}/month ad spend is a recommendation and can be adjusted based on your budget.
        </p>
      </div>


      {/* Final Message - Urgency CTA */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-card to-accent/10 border-accent/30">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 animate-pulse" />
        
        <CardContent className="relative p-8 text-center">
          {/* Urgency Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse px-3 py-1">
              <Clock className="w-3 h-3 mr-1" />
              Limited Time Offer
            </Badge>
          </div>

          {/* Headline */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <h3 className="text-xl font-bold text-foreground">
              Lock In Your <span className="text-accent">10% Discount</span> Now
            </h3>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-lg px-4 py-3 min-w-[70px]">
                <span className="text-2xl font-bold text-accent">{hours.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">HOURS</span>
            </div>
            <span className="text-xl text-accent font-bold pb-4">:</span>
            <div className="text-center">
              <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-lg px-4 py-3 min-w-[70px]">
                <span className="text-2xl font-bold text-accent">{minutes.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">MINUTES</span>
            </div>
            <span className="text-xl text-accent font-bold pb-4">:</span>
            <div className="text-center">
              <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-lg px-4 py-3 min-w-[70px]">
                <span className="text-2xl font-bold text-accent">{seconds.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">SECONDS</span>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="flex flex-col items-center gap-3 my-6">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-lg text-muted-foreground">MVP only:</span>
              <span className="text-xl font-semibold text-foreground">{formatCurrency(mvpPrice)}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-lg text-accent font-medium">MVP + Marketing:</span>
              <span className="text-lg text-muted-foreground line-through">{formatCurrency(mvpPrice)}</span>
              <ArrowRight className="w-4 h-4 text-accent" />
              <span className="text-2xl font-bold text-accent">{formatCurrency(mvpDiscountedPrice)}</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-1">
              <Check className="w-3 h-3 mr-1" />
              You save {formatCurrency(mvpSavings)} with this offer
            </Badge>
          </div>

          {/* Urgency Text */}
          <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-sm">
            <span className="text-red-400 font-medium">⚠️ This discount expires when the timer hits zero.</span>
            {" "}Don't miss the opportunity to launch your MVP with full marketing support at the best price.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg"
            onClick={onScheduleCall}
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 text-base px-8 py-6 animate-pulse"
          >
            <Calendar className="h-5 w-5" />
            Claim Your 10% Discount Now
            <ArrowRight className="h-5 w-5" />
          </Button>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              60-day money-back guarantee
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              No hidden fees
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              Marketing starts after launch
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
            This report was generated based on the information provided and market analysis. 
            The numbers are projections and may vary depending on project execution.
          </p>
        </CardContent>
      </Card>

      {/* Kyle Consultant Dialog */}
      <KyleConsultantDialog 
        open={kyleDialogOpen} 
        onOpenChange={setKyleDialogOpen}
        packageName={selectedConsultPackage}
      />
    </section>
  );
};

export default NextStepsSection;
