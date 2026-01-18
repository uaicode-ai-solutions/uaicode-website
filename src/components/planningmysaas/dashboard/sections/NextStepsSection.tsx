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

// Founder avatars
import sarahJohnsonImg from "@/assets/testimonial-sarah-johnson.webp";
import marcusChenImg from "@/assets/author-marcus.webp";
import emmaThompsonImg from "@/assets/testimonial-emma-thompson.webp";
import johnSmithImg from "@/assets/testimonial-john-smith.webp";
import mariaSantosImg from "@/assets/testimonial-maria-santos.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { NextSteps, ExecutionPhase } from "@/types/report";
import { useState, useEffect } from "react";
import KyleConsultantDialog from "../KyleConsultantDialog";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { getSectionInvestment, getDiscountStrategy } from "@/lib/sectionInvestmentUtils";
import ScoreCircle from "@/components/planningmysaas/dashboard/ui/ScoreCircle";


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

// Post-launch support days by MVP tier (single values as per PricingTransparency)
const SUPPORT_DAYS_BY_TIER: Record<string, number> = {
  starter: 45,
  growth: 90,
  enterprise: 120,
};

// Bonus days added by Flash Deal offer
const FLASH_DEAL_BONUS_DAYS = 15;

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
  
  
  const [kyleDialogOpen, setKyleDialogOpen] = useState(false);
  const [selectedConsultPackage, setSelectedConsultPackage] = useState<string>('');
  const { hours, minutes, seconds } = useCountdownTimer();

  // Calculate total weeks from timeline
  const totalWeeks = timeline.reduce((acc, phase) => {
    const match = phase.duration?.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  // Get section_investment data for pricing and discounts
  const sectionInvestment = getSectionInvestment(reportData);
  
  // MVP Price from section_investment (with fallback to legacy field)
  const mvpPriceCents = sectionInvestment?.investment_one_payment_cents ?? reportData?.investment_one_payment_cents ?? 0;
  const mvpPrice = mvpPriceCents > 0 ? mvpPriceCents / 100 : 0;
  
  // Get discount strategy from section_investment (with calculated fallbacks)
  const discountStrategy = getDiscountStrategy(sectionInvestment, mvpPriceCents);
  
  // Calculate dynamic support days based on MVP tier
  const mvpTier = sectionInvestment?.mvp_tier?.toLowerCase() || 'starter';
  const baseSupportDays = SUPPORT_DAYS_BY_TIER[mvpTier] || SUPPORT_DAYS_BY_TIER.starter;
  const extendedSupportDays = baseSupportDays + FLASH_DEAL_BONUS_DAYS;
  
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
  
  // MVP Development - use 30d discount from strategy (fallback 10%)
  const MVP_DEV_DISCOUNT_PERCENT = discountStrategy.discount_30d_percent;
  const mvpDevDiscountedPrice = discountStrategy.price_30d_cents > 0 
    ? discountStrategy.price_30d_cents / 100 
    : Math.round(mvpPrice * (1 - MVP_DEV_DISCOUNT_PERCENT / 100));
  const mvpDevSavings = discountStrategy.savings_30d_cents > 0 
    ? discountStrategy.savings_30d_cents / 100 
    : Math.round(mvpPrice * MVP_DEV_DISCOUNT_PERCENT / 100);
  
  // MVP + Marketing - use bundle discount from strategy (fallback 15%)
  const MVP_MARKETING_DISCOUNT_PERCENT = discountStrategy.bundle_discount_percent > 0 
    ? discountStrategy.bundle_discount_percent 
    : 15;
  const mvpMarketingDiscountedPrice = discountStrategy.bundle_price_cents > 0 
    ? discountStrategy.bundle_price_cents / 100 
    : Math.round(mvpPrice * (1 - MVP_MARKETING_DISCOUNT_PERCENT / 100));
  const mvpMarketingSavings = discountStrategy.savings_bundle_cents > 0 
    ? discountStrategy.savings_bundle_cents / 100 
    : Math.round(mvpPrice * MVP_MARKETING_DISCOUNT_PERCENT / 100);
  
  // Annual marketing contract (12 months)
  const marketingAnnualUaicode = marketingMonthlyUaicode * 12;
  
  // Total MVP + Marketing package price (MVP with 15% OFF + annual marketing)
  const mvpMarketingTotalPrice = mvpMarketingDiscountedPrice + marketingAnnualUaicode;
  
  // Original price before discount (MVP full price + marketing annual)
  const mvpMarketingOriginalPrice = mvpPrice + marketingAnnualUaicode;


  return (
    <section id="next-steps" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
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
            <ScoreCircle 
              score={viabilityScore} 
              label="Score" 
              size="xl"
              showLabelInside={true}
              showGlow={true}
            />
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-foreground">{verdictHeadline}</p>
              <p className="text-xs text-muted-foreground mt-1">Your project is ready to be built</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What happens when you hire us - Premium Cards */}
      <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
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
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-card/50 border-border/30 hover:border-yellow-500/30 hover:shadow-yellow-500/10"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-500/15 to-yellow-400/5 rounded-bl-[40px] -mr-4 -mt-4"></div>
                
                <div className="relative p-5 text-center">
                  {/* Step Number Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                      <span className="text-[10px] font-semibold text-yellow-500">{step.step}</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br from-yellow-500/20 to-yellow-400/10">
                    <IconComponent className="h-6 w-6 text-yellow-500" />
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


      {/* ========== LOCK IN YOUR DISCOUNT SECTION ========== */}
      <div className="flex items-center gap-3 mt-8 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <Zap className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-foreground">Lock In Your Discount</h3>
            <InfoTooltip side="right" size="sm">
              Limited-time offers to help you save on your MVP development.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Limited time offers available</p>
        </div>
      </div>

      {/* Aggressive Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-4 pt-4 items-stretch">
        {/* Card 1: MVP Flash Deal (24h - 25% OFF) */}
        <div className="relative h-full flex flex-col">
          {/* Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <Badge className="px-3 py-1 text-xs font-bold text-amber-950 border-0 hover:bg-none" style={{ background: 'linear-gradient(135deg, hsl(45, 100%, 55%), hsl(38, 100%, 50%))' }}>
              <Clock className="h-3 w-3 mr-1" />
              24H FLASH DEAL
            </Badge>
          </div>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-card/50 border-accent/30 hover:border-accent/40 hover:shadow-accent/10 h-full">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/15 to-accent/5 rounded-bl-[40px] -mr-4 -mt-4"></div>

            <CardContent className="relative p-6 pt-8 flex flex-col h-full">
            {/* Package Name */}
            <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-5 w-5 text-accent fill-accent" />
              <h3 className="text-lg font-bold text-foreground">MVP Flash Deal</h3>
            </div>
            
            {/* Price Section */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground line-through">
                  {formatCurrency(mvpPrice)}
                </p>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                  -{discountStrategy.discount_24h_percent}%
                </Badge>
              </div>
              <div className="text-4xl font-bold text-gradient-gold">
                {formatCurrency(discountStrategy.price_24h_cents / 100)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Today Only - Maximum Discount!
              </p>
            </div>

            {/* Savings Highlights */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-lg font-bold text-green-400">
                  {formatCurrency(discountStrategy.savings_24h_cents / 100)}
                </p>
                <p className="text-[10px] text-green-400/80">You Save</p>
              </div>
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-center">
                <p className="text-lg font-bold text-gradient-gold">
                  {discountStrategy.savings_vs_traditional_24h_percent}%
                </p>
                <p className="text-[10px] text-muted-foreground">vs Traditional</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-4 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  Complete MVP development
                  <InfoTooltip term="MVP Development">
                    Your fully functional SaaS product built from scratch, including all core features defined in your report. Ready to launch and acquire customers.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  25% OFF - Today only!
                  <InfoTooltip term="Limited Discount">
                    Exclusive 24-hour discount. After this window closes, standard pricing applies.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  12 months hosting included
                  <InfoTooltip term="Hosting">
                    Professional cloud hosting with SSL, CDN, backups, and 99.9% uptime. After 12 months: $299/month or $2,990/year.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  Priority onboarding slot
                  <InfoTooltip term="Priority Onboarding">
                    Start your project within 7 days instead of the standard 14-day wait. Jump the queue and get to market faster.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  Full source code ownership
                  <InfoTooltip term="Code Ownership">
                    You own 100% of the code. No licensing fees, no vendor lock-in. Deploy anywhere you want.
                  </InfoTooltip>
                </span>
              </li>
            </ul>

            {/* Bonuses */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Exclusive 24H Bonuses:
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Extended support ({extendedSupportDays} days)
                    <InfoTooltip size="sm">
                      {extendedSupportDays} days of priority email support with 24-hour response time instead of standard {baseSupportDays} days.
                    </InfoTooltip>
                  </span>
                  <span className="text-amber-400 font-semibold">$750 value</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Fast-track onboarding (7 days)
                    <InfoTooltip size="sm">
                      Project kickoff within 7 days instead of 14. Includes expedited requirements review.
                    </InfoTooltip>
                  </span>
                  <span className="text-amber-400 font-semibold">$1,500 value</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-amber-500/20 flex justify-between">
                <span className="text-xs text-foreground font-bold">Total Bonus Value:</span>
                <span className="text-xs text-amber-400 font-bold">$2,250</span>
              </div>
            </div>

            {/* Prominent Timer */}
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4">
              <div className="flex items-center justify-center gap-2 text-foreground mb-2">
                <Clock className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-sm font-medium">Offer expires in:</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-accent/10 border border-accent/20 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-gradient-gold">{hours.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-muted-foreground block">HOURS</span>
                </div>
                <span className="text-2xl font-bold text-muted-foreground">:</span>
                <div className="bg-accent/10 border border-accent/20 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-gradient-gold">{minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-muted-foreground block">MINS</span>
                </div>
                <span className="text-2xl font-bold text-muted-foreground">:</span>
                <div className="bg-accent/10 border border-accent/20 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-gradient-gold">{seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-muted-foreground block">SECS</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onScheduleCall?.();
              }}
              className="w-full gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 shadow-lg shadow-yellow-500/20 font-bold text-base py-6"
            >
              <Star className="h-5 w-5" />
              CLAIM 25% DISCOUNT NOW
            </Button>
            
            {/* Talk to Kyle */}
            <Button 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedConsultPackage('MVP Flash Deal');
                setKyleDialogOpen(true);
              }}
              className="w-full gap-3 border-accent/30 hover:border-accent/50 hover:bg-accent/10 text-foreground mt-2 py-4 h-auto"
            >
              <div className="relative flex-shrink-0">
                <KyleAvatar size="sm" isActive={true} />
                <div className="absolute -bottom-0.5 -right-0.5 p-1 rounded-full bg-accent shadow-lg border-2 border-background">
                  <Phone className="h-2.5 w-2.5 text-accent-foreground" />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">Talk to Kyle</span>
                  <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">Have questions? Get instant answers</span>
              </div>
            </Button>
          </CardContent>
          </Card>
        </div>

        {/* Card 2: Complete Launch Bundle (30% OFF) */}
        <div className="relative h-full flex flex-col">
          {/* Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <Badge className="px-3 py-1 text-xs font-bold text-amber-950 border-0 hover:bg-none" style={{ background: 'linear-gradient(135deg, hsl(45, 100%, 55%), hsl(38, 100%, 50%))' }}>
              <Star className="h-3 w-3 mr-1" />
              BEST VALUE - 30% OFF
            </Badge>
          </div>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-card/50 border-accent/30 hover:border-accent/40 hover:shadow-accent/10 h-full">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/15 to-accent/5 rounded-bl-[40px] -mr-4 -mt-4"></div>

            <CardContent className="relative p-6 pt-8 flex flex-col h-full">
            {/* Package Name */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5 text-accent fill-accent" />
              <h3 className="text-lg font-bold text-foreground">Complete Launch Bundle</h3>
            </div>
            
            {/* Price Section */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground line-through">
                  {formatCurrency(mvpPrice + marketingAnnualUaicode)}
                </p>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                  -{discountStrategy.bundle_discount_percent}% on MVP
                </Badge>
              </div>
              <div className="text-4xl font-bold text-gradient-gold">
                {formatCurrency((discountStrategy.bundle_price_cents / 100) + marketingAnnualUaicode)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                MVP + Full Marketing Team Included
              </p>
            </div>

            {/* Savings Highlights */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-lg font-bold text-green-400">
                  {formatCurrency(discountStrategy.savings_bundle_cents / 100)}
                </p>
                <p className="text-[10px] text-green-400/80">MVP Savings</p>
              </div>
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-center">
                <p className="text-lg font-bold text-gradient-gold">
                  30%
                </p>
                <p className="text-[10px] text-muted-foreground">Max Discount</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-4 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  30% OFF on MVP - Maximum discount!
                  <InfoTooltip term="Maximum Discount">
                    Our highest discount tier. Only available when bundling MVP + Marketing together.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  Save {formatCurrency(discountStrategy.savings_bundle_cents / 100)} on development
                  <InfoTooltip term="Development Savings">
                    Direct savings compared to purchasing MVP at regular price. Calculated based on your project scope.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  Full marketing team included
                  <InfoTooltip term="Marketing Team">
                    Complete marketing execution: content creation, social media, email marketing, and paid ads. Billed monthly after MVP launch.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  90-day launch roadmap
                  <InfoTooltip term="Launch Roadmap">
                    Structured 90-day development plan with clear milestones. Weekly progress reports keep you informed every step of the way.
                  </InfoTooltip>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 flex items-center gap-1">
                  VIP priority support
                  <InfoTooltip term="VIP Support">
                    90 days of VIP support with 4-hour response time during business hours. Direct access to senior developers.
                  </InfoTooltip>
                </span>
              </li>
            </ul>

            {/* Exclusive Bonuses */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Exclusive Bundle Bonuses:
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    3 months extra hosting
                    <InfoTooltip size="sm">
                      15 months total hosting instead of 12. Saves 3x $299/month market rate.
                    </InfoTooltip>
                  </span>
                  <span className="text-amber-400 font-semibold">$897 value</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    90 days VIP support
                    <InfoTooltip size="sm">
                      VIP support with 4-hour response time during business hours. Direct access to senior developers.
                    </InfoTooltip>
                  </span>
                  <span className="text-amber-400 font-semibold">$1,500 value</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Marketing strategy session (2h)
                    <InfoTooltip size="sm">
                      2-hour strategy session with marketing specialist. Includes competitive analysis and 90-day roadmap.
                    </InfoTooltip>
                  </span>
                  <span className="text-amber-400 font-semibold">$1,500 value</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-amber-500/20 flex justify-between">
                <span className="text-xs text-foreground font-bold">Total Bonus Value:</span>
                <span className="text-xs text-amber-400 font-bold">$3,897</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex flex-col items-center gap-3">
                <div className="flex -space-x-3">
                  {[sarahJohnsonImg, marcusChenImg, emmaThompsonImg, johnSmithImg, mariaSantosImg].map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt="Founder" 
                      className="w-8 h-8 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    <span className="text-yellow-400">127 founders</span> chose this bundle
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Last month • Average rating: ⭐ 4.9/5
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onScheduleCall?.();
              }}
              className="w-full gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 shadow-lg shadow-yellow-500/20 font-bold text-base py-6"
            >
              <Star className="h-5 w-5" />
              GET MAXIMUM SAVINGS
            </Button>
            
            {/* Talk to Kyle */}
            <Button 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedConsultPackage('Complete Launch Bundle');
                setKyleDialogOpen(true);
              }}
              className="w-full gap-3 border-accent/30 hover:border-accent/50 hover:bg-accent/10 text-foreground mt-2 py-4 h-auto"
            >
              <div className="relative flex-shrink-0">
                <KyleAvatar size="sm" isActive={true} />
                <div className="absolute -bottom-0.5 -right-0.5 p-1 rounded-full bg-accent shadow-lg border-2 border-background">
                  <Phone className="h-2.5 w-2.5 text-accent-foreground" />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">Talk to Kyle</span>
                  <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">Have questions? Get instant answers</span>
              </div>
            </Button>
          </CardContent>
          </Card>
        </div>
      </div>

      {/* Marketing Billing Notice */}
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Important:</span> Marketing costs are 
            <span className="text-amber-400 font-semibold"> only charged after your MVP is launched</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground text-center">
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
