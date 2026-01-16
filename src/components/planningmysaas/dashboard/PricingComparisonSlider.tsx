import { Check, X, Clock, Shield, FileText, Code, Headphones, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { Skeleton } from "@/components/ui/skeleton";
import { getSectionInvestment, getPricingComparison } from "@/lib/sectionInvestmentUtils";

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

  // Features comparison (FIXED texts as per reference image)
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
      uaicode: "45-120 days included",
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
          <TrendingDown className="h-4 w-4 text-green-400" />
          <h4 className="font-medium text-foreground text-sm">Price Comparison</h4>
        </div>
        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400 text-xs">
          Save {savingsPercentage}%
        </Badge>
      </div>

      {/* Price Bars */}
      <div className="space-y-3">
        {/* Traditional Agency Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Traditional Agency</span>
            <span className="font-medium text-red-400">{formatCurrency(traditionalPrice)}</span>
          </div>
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-border/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500/40 to-red-400/30 rounded-lg w-full flex items-center justify-end pr-3"
            >
              <span className="text-xs font-medium text-red-300">
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
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-accent/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 to-accent/40 rounded-lg flex items-center pl-3"
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
          <span className="text-center text-red-400/70">Traditional</span>
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
                <X className="h-3 w-3 text-red-400/70" />
                <span className="text-xs text-red-400/70">{feature.traditional}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Check className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">{feature.uaicode}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Callout */}
      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-green-500/20">
            <Check className="h-3.5 w-3.5 text-green-400" />
          </div>
          <span className="font-bold text-green-400 text-lg">
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
