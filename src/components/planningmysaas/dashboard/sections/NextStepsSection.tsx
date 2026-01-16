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
  CreditCard,
  HandCoins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { NextSteps, ExecutionPhase } from "@/types/report";
import { useState, useEffect } from "react";
import KyleConsultantDialog from "../KyleConsultantDialog";


// Countdown Timer Hook
const useCountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pms_offer_expiry_24h');
    if (saved) {
      const remaining = parseInt(saved) - Date.now();
      return remaining > 0 ? remaining : 24 * 60 * 60 * 1000;
    }
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('pms_offer_expiry_24h', expiry.toString());
    return 24 * 60 * 60 * 1000;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          const newExpiry = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem('pms_offer_expiry_24h', newExpiry.toString());
          return 24 * 60 * 60 * 1000;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};
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
  const { report, reportData, marketingTotals } = useReportContext();
  
  // Parse data from report
  const nextSteps = parseJsonField<NextSteps>(report?.next_steps, {
    verdictSummary: "Your project is ready to be built.",
    steps: [
      { step: 1, title: "Free Consultation", description: "45min to align expectations and validate the scope", icon: "Calendar" },
      { step: 2, title: "Proposal & Sign Contract", description: "Clear documentation with scope, timeline, and investment", icon: "FileText" },
      { step: 3, title: "Start in 5 Business Days", description: "We begin the project right after approval", icon: "PlayCircle" },
      { step: 4, title: "First Delivery in 2 Weeks", description: "You'll see real progress quickly", icon: "Package" },
    ],
    cta: { primary: "Schedule a Call", secondary: "Download PDF Report" },
    contact: { email: "contact@uaicode.dev", whatsapp: "+1 (555) 123-4567", calendly: "https://calendly.com/uaicode" }
  });
  
  // Viability score from reportData (same source as ReportHero)
  const viabilityScore = reportData?.viability_score ?? 0;
  const verdictHeadline = reportData?.verdict_headline || "High viability, your idea has real traction potential.";
  const timeline = parseJsonField<ExecutionPhase[]>(report?.execution_timeline, []);
  
  const [selectedPackage, setSelectedPackage] = useState<'mvp-only' | 'mvp-marketing'>('mvp-marketing');
  const [kyleDialogOpen, setKyleDialogOpen] = useState(false);
  const [selectedConsultPackage, setSelectedConsultPackage] = useState<string>('');
  const { hours, minutes, seconds } = useCountdownTimer();

  // Calculate total weeks from timeline
  const totalWeeks = timeline.reduce((acc, phase) => {
    const match = phase.duration?.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  // MVP Price from reportData (same source as InvestmentSection)
  const mvpPriceCents = reportData?.investment_one_payment_cents ?? 0;
  const mvpPrice = mvpPriceCents > 0 ? mvpPriceCents / 100 : 0;
  
  // Marketing total from shared context (synced with InvestmentSection selections)
  const marketingMonthlyUaicode = marketingTotals.uaicodeTotal / 100; // cents to dollars
  
  // Calculate suggested paid media based on wizard budget selection (same as InvestmentSection)
  const calculateSuggestedPaidMedia = (budget: string | null | undefined, uaicodeTotal: number): number => {
    const budgetMap: Record<string, number> = {
      '5k-10k': 200000,     // $2,000
      '10k-25k': 450000,    // $4,500
      '25k-50k': 900000,    // $9,000
      '50k-100k': 1800000,  // $18,000
      '100k+': 3500000,     // $35,000
    };
    
    if (budget && budgetMap[budget]) {
      return budgetMap[budget];
    }
    
    if (uaicodeTotal > 0) {
      const suggested = Math.round(uaicodeTotal * 0.75);
      const min = 300000;
      const max = 1500000;
      return Math.min(Math.max(suggested, min), max);
    }
    
    return 500000;
  };
  
  const userBudget = report?.budget;
  const suggestedPaidMedia = calculateSuggestedPaidMedia(userBudget, marketingTotals.uaicodeTotal);
  const suggestedPaidMediaDollars = suggestedPaidMedia / 100;
  
  // MVP Development - 10% discount
  const MVP_DEV_DISCOUNT = 0.10;
  const mvpDevDiscountedPrice = Math.round(mvpPrice * (1 - MVP_DEV_DISCOUNT));
  const mvpDevSavings = Math.round(mvpPrice * MVP_DEV_DISCOUNT);
  
  // MVP + Marketing - 15% discount on MVP
  const MVP_MARKETING_DISCOUNT = 0.15;
  const mvpMarketingDiscountedPrice = Math.round(mvpPrice * (1 - MVP_MARKETING_DISCOUNT));
  const mvpMarketingSavings = Math.round(mvpPrice * MVP_MARKETING_DISCOUNT);
  
  // Annual marketing contract (12 months)
  const marketingAnnualUaicode = marketingMonthlyUaicode * 12;
  
  // Total MVP + Marketing package price (MVP with 15% OFF + annual marketing)
  const mvpMarketingTotalPrice = mvpMarketingDiscountedPrice + marketingAnnualUaicode;
  
  // Original price before discount (MVP full price + marketing annual)
  const mvpMarketingOriginalPrice = mvpPrice + marketingAnnualUaicode;

  const pricingOptions = [
    {
      id: 'mvp-only' as const,
      name: 'MVP Development',
      badge: null,
      price: mvpDevDiscountedPrice,
      priceLabel: '10% OFF',
      discount: {
        original: mvpPrice,
        savings: mvpDevSavings
      },
      features: [
        "Complete MVP development",
        `10% discount (save ${formatCurrency(mvpDevSavings)})`,
        "12 months hosting included",
        "30 days post-launch premium support",
        "Full documentation & training",
        "Source code ownership"
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
      price: mvpMarketingTotalPrice,
      priceLabel: '15% OFF on MVP',
      discount: {
        original: mvpMarketingOriginalPrice,
        savings: mvpMarketingSavings
      },
      features: [
        "Everything in MVP Development",
        `15% discount on MVP (save ${formatCurrency(mvpMarketingSavings)})`,
        "Full-stack marketing team",
        "Paid media management included",
        "AI-powered campaign optimization",
        "Dedicated account manager"
      ],
      marketingNote: {
        contractAnnual: marketingAnnualUaicode,
        contractMonthly: marketingMonthlyUaicode,
        recommendedAds: suggestedPaidMediaDollars,
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

      {/* What happens when you hire us - Premium Cards */}
      <div className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-semibold text-foreground text-xl">
                What happens when you choose Uaicode
              </h3>
              <InfoTooltip size="sm">
                The journey from signing up to launching your MVP
              </InfoTooltip>
            </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nextSteps.steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || Calendar;
            return (
              <Card 
                key={index}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-accent/20 hover:border-accent/30 hover:shadow-accent/10"
              >
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Decoração canto superior direito */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-accent/10 rounded-bl-[30px] -mr-3 -mt-3"></div>
                
                <div className="relative p-5 text-center">
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
                </div>
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
                ? 'bg-gradient-to-br from-accent/15 via-card to-card border-accent/40 ring-2 ring-accent shadow-lg shadow-accent/10' 
                : 'bg-card/50 border-border/30 hover:border-border/50'
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
            <CardContent className="p-6 pt-8 flex flex-col h-full">
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


              {/* Payment Details - MVP Only */}
              {option.id === 'mvp-only' && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 mb-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-accent/20">
                    <CreditCard className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">Payment details</span>
                  </div>
                  
                  {/* MVP Development */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-foreground font-medium">MVP Development</span>
                      <span className="text-foreground font-bold">
                        {formatCurrency(mvpDevDiscountedPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-4 min-h-[32px]">
                      50% upfront, 50% on delivery
                    </p>
                  </div>

                  {/* Hosting infrastructure Free */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-400 font-medium">Hosting infrastructure</span>
                      <span className="text-amber-400 font-bold">Free</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-4 min-h-[32px]">
                      Valid for 12 months
                    </p>
                  </div>

                  {/* Premium Support Free */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-400 font-medium">Premium Support</span>
                      <span className="text-amber-400 font-bold">Free</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-4 min-h-[32px]">
                      Valid for 30 days post-launch
                    </p>
                  </div>
                </div>
              )}

              {/* Marketing Note */}
              {option.marketingNote && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 mb-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-accent/20">
                    <CreditCard className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">Payment details</span>
                  </div>
                  
                  {/* MVP Development */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-foreground font-medium">MVP Development</span>
                      <span className="text-foreground font-bold">
                        {formatCurrency(mvpMarketingDiscountedPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-4 min-h-[32px]">
                      50% upfront, 50% on delivery
                    </p>
                  </div>
                  
                  {/* Marketing Annual Contract */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-accent font-medium">Marketing Annual contract</span>
                      <span className="text-accent font-bold">
                        {formatCurrency(option.marketingNote.contractAnnual)}
                      </span>
                    </div>
                    <p className="text-xs text-accent/70 leading-4 min-h-[32px]">
                      Up to 12x of {formatCurrency(option.marketingNote.contractMonthly)}
                    </p>
                  </div>
                  
                  {/* Recommended ADS */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Recommended ADS spend</span>
                      <span className="text-muted-foreground font-bold">
                        {formatCurrency(option.marketingNote.recommendedAds)}/mo
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 leading-4 min-h-[32px]">
                      Monthly. No contract. After MVP.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-auto pt-4">
                
                {/* Urgency Timer */}
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center justify-center gap-2 text-accent">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs font-medium">Offer expires in:</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="bg-accent/20 px-2 py-1 rounded text-sm font-bold text-accent">
                      {hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-accent font-bold">:</span>
                    <span className="bg-accent/20 px-2 py-1 rounded text-sm font-bold text-accent">
                      {minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-accent font-bold">:</span>
                    <span className="bg-accent/20 px-2 py-1 rounded text-sm font-bold text-accent">
                      {seconds.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConsultPackage(option.name);
                      setKyleDialogOpen(true);
                    }}
                    size="sm"
                    className="w-full mt-2 gap-2 bg-yellow-400 hover:bg-yellow-500 text-black hover:text-black font-semibold"
                  >
                    <HandCoins className="h-4 w-4 text-black" />
                    Get your discount now!
                  </Button>
                </div>
                
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
                  Doubts? Talk to Kyle.
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
          The {formatCurrency(marketingMonthlyUaicode)}/month contract is an annual commitment. 
          The {formatCurrency(suggestedPaidMediaDollars)}/month ad spend is a recommendation and can be adjusted based on your budget.
        </p>
      </div>



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
