import { Check, Minus, Clock, Shield, FileText, Code, Headphones, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { Skeleton } from "@/components/ui/skeleton";
import { getSectionInvestment, getPricingComparison } from "@/lib/sectionInvestmentUtils";

// Post-launch support days by MVP tier (single values as per PricingTransparency)
const SUPPORT_DAYS_BY_TIER: Record<string, number> = {
  starter: 45,
  growth: 90,
  enterprise: 120,
};

const getPostLaunchSupport = (mvpTier: string | undefined): string => {
  const tier = mvpTier?.toLowerCase() || 'starter';
  const days = SUPPORT_DAYS_BY_TIER[tier] || SUPPORT_DAYS_BY_TIER.starter;
  return `${days} days included`;
};

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

const formatCurrencyShort = (cents: number) => {
  const value = cents / 100;
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  }
  return formatCurrency(cents);
};

const PricingComparisonSlider = () => {
  const { reportData } = useReportContext();
  
  // Get section_investment data with fallback to legacy fields
  const sectionInvestment = getSectionInvestment(reportData);
  const pricingData = getPricingComparison(reportData, sectionInvestment);
  
  // Destructure for easier use
  const traditionalPrice = pricingData.traditionalPrice;
  const uaicodePrice = pricingData.uaicodePrice;
  const savingsPercentage = pricingData.savingsPercentage;
  const savingsAmount = pricingData.savingsAmount;
  const marketingMonths = pricingData.marketingMonths;
  const deliveryTraditional = pricingData.deliveryTraditional;
  const deliveryUaicode = pricingData.deliveryUaicode;

  // Get MVP tier for dynamic support days
  const mvpTier = sectionInvestment?.mvp_tier;
  const postLaunchSupport = getPostLaunchSupport(mvpTier);

  // Features comparison
  const features = [
    {
      label: "Delivery Time",
      icon: Clock,
      uaicode: deliveryUaicode,
      traditional: deliveryTraditional,
    },
    {
      label: "Hidden Costs",
      icon: Shield,
      uaicode: "Fixed price",
      traditional: "Common extras",
    },
    {
      label: "Post-Launch Support",
      icon: Headphones,
      uaicode: postLaunchSupport,
      traditional: "Paid hourly",
    },
    {
      label: "Code Ownership",
      icon: Code,
      uaicode: "100% yours",
      traditional: "Often retained",
    },
    {
      label: "Documentation",
      icon: FileText,
      uaicode: "Complete",
      traditional: "Often missing",
    },
  ];

  const uaicodeWidth = traditionalPrice > 0 
    ? (uaicodePrice / traditionalPrice) * 100 
    : 50;

  const isLoading = !reportData;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-accent" />
          <h4 className="font-medium text-foreground text-sm">Price Comparison</h4>
        </div>
        <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent text-xs">
          Save {savingsPercentage}%
        </Badge>
      </div>

      {/* Price Bars */}
      <div className="space-y-3">
        {/* Traditional Agency Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Traditional Agency</span>
            <span className="font-medium text-muted-foreground">{formatCurrency(traditionalPrice)}</span>
          </div>
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-border/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-lg w-full flex items-center justify-end pr-3"
            >
              <span className="text-xs font-medium text-accent-foreground">
                {formatCurrencyShort(traditionalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Uaicode Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-accent font-medium">Uaicode</span>
            <span className="font-bold text-accent">{formatCurrency(uaicodePrice)}</span>
          </div>
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-amber-500/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-lg flex items-center justify-end pr-3"
              style={{ width: `${Math.max(uaicodeWidth, 15)}%` }}
            >
              <span className="text-xs font-medium text-accent-foreground">
                {formatCurrencyShort(uaicodePrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b border-border/30">
          <span>Feature</span>
          <span className="text-center text-muted-foreground/70">Traditional</span>
          <span className="text-center text-accent">Uaicode</span>
        </div>
        
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          
          return (
            <div 
              key={index}
              className="grid grid-cols-3 gap-2 py-2 border-b border-border/20 last:border-0 items-center"
            >
              <div className="flex items-center gap-1.5">
                <IconComponent className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground">{feature.label}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Minus className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground/70">{feature.traditional}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Check className="h-3 w-3 text-accent" />
                <span className="text-xs text-accent">{feature.uaicode}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Callout */}
      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-accent/20">
            <Check className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="font-bold text-accent text-lg">
            You Save: {formatCurrency(savingsAmount)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground pl-7">
          That's enough for {marketingMonths} months of marketing budget!
        </p>
      </div>
    </div>
  );
};

export default PricingComparisonSlider;
