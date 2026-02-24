import { 
  Calendar, 
  FileText, 
  PlayCircle, 
  Package, 
  Sparkles,
  Check,
  Star,
  Zap,
  Shield,
  Send
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { NextSteps, ExecutionPhase, HeroScoreSection, safeNumber } from "@/types/report";
import { getSectionInvestment, getDiscountStrategy, getDiscountSavings } from "@/lib/sectionInvestmentUtils";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  FileText,
  PlayCircle,
  Package,
};

// Post-launch support days by MVP tier
const SUPPORT_DAYS_BY_TIER: Record<string, number> = {
  starter: 45,
  growth: 90,
  enterprise: 120,
};

const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  enterprise: "Enterprise",
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
  onNewReport?: () => void;
}

const NextStepsSection = ({ onScheduleCall, onNewReport }: NextStepsSectionProps) => {
  const { report, reportData, wizardId } = useReportContext();
  
  // Get section_investment data for pricing and discounts
  const sectionInvestment = getSectionInvestment(reportData);
  
  // MVP Price from section_investment (already includes marketing)
  const mvpPriceCents = safeNumber(sectionInvestment?.investment_one_payment_cents, 0);
  const fullPrice = mvpPriceCents > 0 ? mvpPriceCents / 100 : 0;
  
  // Get discount strategy
  const discountStrategy = getDiscountStrategy(sectionInvestment, mvpPriceCents);
  
  // Flash (25%) and Week (15%) prices
  const flashPrice = discountStrategy.flash_24h.price_cents / 100;
  const weekPrice = discountStrategy.week.price_cents / 100;
  const flashSavings = fullPrice - flashPrice;
  const weekSavings = fullPrice - weekPrice;
  
  // Calculate dynamic support days based on MVP tier
  const mvpTier = sectionInvestment?.mvp_tier?.toLowerCase() || 'starter';
  const supportDays = SUPPORT_DAYS_BY_TIER[mvpTier] || SUPPORT_DAYS_BY_TIER.starter;
  const tierLabel = TIER_LABELS[mvpTier] || "Starter";

  return (
    <section id="next-steps" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3 mt-8 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
          <Star className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Your Investment</h2>
            <InfoTooltip side="right" size="sm">
              Complete SaaS partnership including development, marketing launch, and post-launch support.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Everything you need to launch and grow your SaaS</p>
        </div>
      </div>

      {/* ========== SINGLE UNIFIED CARD ========== */}
      <Card className="relative overflow-hidden border-accent/30 bg-card/50">
        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-accent/5 rounded-bl-[50px] -mr-4 -mt-4" />

        <CardContent className="relative p-6 md:p-8">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-accent fill-accent" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Your Complete SaaS Partnership</h3>
            </div>
            <Badge className="bg-accent/15 text-accent border-accent/30 text-xs font-bold">
              {tierLabel} Tier
            </Badge>
          </div>

          {/* ========== 3 DELIVERABLES ========== */}
          <div className="space-y-6 mb-8">

            {/* DELIVERABLE 1: Strategic Meeting */}
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-500/15">
                    <Calendar className="h-4 w-4 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-foreground">Deliverable 1: Strategic Meeting</h4>
                </div>
                <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-[10px]">
                  <Check className="h-3 w-3 mr-1" />
                  COMPLETED
                </Badge>
              </div>
              <ul className="space-y-1.5 ml-10">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                  AI-Powered Business Plan
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                  Personalized Investment Proposal
                </li>
              </ul>
            </div>

            {/* DELIVERABLE 2: MVP + Marketing Launch Plan */}
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-accent/15">
                  <Package className="h-4 w-4 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground">Deliverable 2: MVP + Marketing Launch Plan</h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-1.5 ml-10">
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Complete SaaS Application
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Branding & Brand Identity
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Brand Manual
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Optimized Landing Page
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Paid Media Strategy
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  8-12 Ad Creatives
                </li>
              </div>
            </div>

            {/* DELIVERABLE 3: Post-Launch Support */}
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-accent/15">
                  <Shield className="h-4 w-4 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground">
                  Deliverable 3: Post-Launch Support ({supportDays} days)
                </h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-1.5 ml-10">
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Bug fixes & performance monitoring
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Feature enhancements & technical guidance
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Marketing campaign metrics monitoring
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground list-none">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  Monthly extension available after period
                </li>
              </div>
            </div>
          </div>

          {/* ========== INVESTMENT / PRICING TABLE ========== */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/25 mb-6">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Investment
            </h4>

            <div className="space-y-3">
              {/* Row 1: Flash Deal - Close Today (25% OFF) */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/25">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-foreground">Close Today</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gradient-gold">{formatCurrency(flashPrice)}</span>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] font-bold">
                    {discountStrategy.flash_24h.percent}% OFF
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] font-bold">
                    BEST DEAL
                  </Badge>
                </div>
              </div>

              {/* Row 2: Week Deal - Close in 7 days (15% OFF) */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/15">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Close in 7 days</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-foreground">{formatCurrency(weekPrice)}</span>
                  <Badge variant="outline" className="text-accent border-accent/30 text-[10px] font-bold">
                    {discountStrategy.week.percent}% OFF
                  </Badge>
                </div>
              </div>

              {/* Row 3: Full Price - After 7 days */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">After 7 days</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">{formatCurrency(fullPrice)}</span>
                  <span className="text-[10px] text-muted-foreground">Full Price</span>
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            {flashSavings > 0 && (
              <p className="text-xs text-green-400 mt-3 text-center font-medium">
                Close today and save {formatCurrency(flashSavings)} — that's {discountStrategy.flash_24h.percent}% off!
              </p>
            )}
          </div>

          {/* ========== TRUST SIGNALS ========== */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-accent" />
              Full source code ownership
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-accent" />
              12 months hosting included
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-accent" />
              Priority onboarding
            </span>
          </div>

          {/* ========== CTA BUTTONS ========== */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onScheduleCall?.();
              }}
              className="flex-1 gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 shadow-lg shadow-yellow-500/20 font-bold text-base py-6"
            >
              <Zap className="h-5 w-5" />
              CLOSE THE DEAL
            </Button>
            <Button 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onScheduleCall?.();
              }}
              className="flex-1 gap-2 border-accent/30 text-foreground hover:bg-accent/10 font-medium py-6"
            >
              <Send className="h-4 w-4" />
              Send Proposal
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default NextStepsSection;
