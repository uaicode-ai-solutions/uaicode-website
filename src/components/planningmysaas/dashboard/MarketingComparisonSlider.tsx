import { useState, useEffect, useRef } from "react";
import { Check, Minus, DollarSign, Target, Palette, Sparkles, FileText, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketingComparisonSliderProps {
  uaicodeTotal?: number; // in cents
  traditionalMin?: number; // in cents
  traditionalMax?: number; // in cents
  paidMediaBudget?: number; // in cents
  savingsPercentMin?: number;
  savingsPercentMax?: number;
  annualSavingsMin?: number; // in cents
  annualSavingsMax?: number; // in cents
  isLoading?: boolean;
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

const formatCurrencyK = (cents: number) => {
  const value = cents / 100;
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  }
  return formatCurrency(cents);
};

// Feature comparison (static data)
const features = [
  {
    label: "Pricing Model",
    icon: DollarSign,
    uaicode: "Fixed price",
    traditional: "Variable",
  },
  {
    label: "Strategy",
    icon: Target,
    uaicode: "Included",
    traditional: "Extra charge",
  },
  {
    label: "Creative",
    icon: Palette,
    uaicode: "Included",
    traditional: "Hourly billing",
  },
  {
    label: "AI Optimization",
    icon: Sparkles,
    uaicode: "AI-powered",
    traditional: "None",
  },
  {
    label: "Reporting",
    icon: FileText,
    uaicode: "Advanced",
    traditional: "Basic",
  },
];

const MarketingComparisonSlider = ({
  uaicodeTotal = 500000, // $5,000 default
  traditionalMin = 1650000, // $16,500 default
  traditionalMax = 6000000, // $60,000 default
  paidMediaBudget = 500000, // $5,000 default
  savingsPercentMin = 69,
  savingsPercentMax = 91,
  annualSavingsMin = 13800000, // $138,000 default
  annualSavingsMax = 66000000, // $660,000 default
  isLoading = false,
}: MarketingComparisonSliderProps) => {
  const [animatedUaicode, setAnimatedUaicode] = useState(0);
  const [animatedTraditional, setAnimatedTraditional] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationKey = useRef(0);

  // Calculate traditional average for the bar
  const traditionalAvg = (traditionalMin + traditionalMax) / 2;
  
  // Calculate Uaicode + Paid Media total
  const uaicodeWithAds = uaicodeTotal + paidMediaBudget;
  
  // Calculate bar widths based on traditional average
  const uaicodeWidth = traditionalAvg > 0 ? (uaicodeTotal / traditionalAvg) * 100 : 30;
  const totalWidth = traditionalAvg > 0 ? (uaicodeWithAds / traditionalAvg) * 100 : 50;

  // Reset animation when values change
  useEffect(() => {
    animationKey.current += 1;
    setHasAnimated(false);
    setAnimatedUaicode(0);
    setAnimatedTraditional(0);
    setAnimatedTotal(0);
    
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [uaicodeTotal, traditionalMin, traditionalMax, paidMediaBudget]);

  // Animate numbers
  useEffect(() => {
    if (!hasAnimated || isLoading) return;
    
    const duration = 1200;
    const steps = 50;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedUaicode(Math.floor(uaicodeTotal * easeOut));
      setAnimatedTraditional(Math.floor(traditionalAvg * easeOut));
      setAnimatedTotal(Math.floor(uaicodeWithAds * easeOut));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedUaicode(uaicodeTotal);
        setAnimatedTraditional(traditionalAvg);
        setAnimatedTotal(uaicodeWithAds);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [hasAnimated, uaicodeTotal, traditionalAvg, uaicodeWithAds, isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-accent" />
          <h4 className="font-medium text-foreground text-sm">Marketing Cost Comparison</h4>
        </div>
        <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent text-xs">
          Save {savingsPercentMin}-{savingsPercentMax}%
        </Badge>
      </div>

      {/* Price Bars */}
      <div className="space-y-3">
        {/* Traditional Agency Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Traditional Agency</span>
            <span className="font-medium text-muted-foreground">
              {formatCurrencyK(traditionalMin)} - {formatCurrencyK(traditionalMax)}/mo
            </span>
          </div>
          <div className="relative h-10 bg-muted/20 rounded-lg overflow-hidden border border-border/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/20 to-muted-foreground/10 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: hasAnimated ? '100%' : '0%' }}
            >
              <span className="text-xs font-medium text-muted-foreground">~{formatCurrencyK(animatedTraditional)}</span>
            </div>
          </div>
        </div>

        {/* Uaicode Marketing Only Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-accent/70">Uaicode Marketing</span>
            <span className="font-medium text-accent/70">{formatCurrency(animatedUaicode)}/mo</span>
          </div>
          <div className="relative h-6 bg-muted/20 rounded-lg overflow-hidden border border-amber-400/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400/70 via-amber-300/50 to-amber-200/30 rounded-lg transition-all duration-1000 ease-out delay-200 flex items-center justify-end pr-2"
              style={{ width: hasAnimated ? `${Math.min(uaicodeWidth, 100)}%` : '0%' }}
            >
              <span className="text-[10px] font-medium text-accent-foreground/80">{formatCurrencyK(uaicodeTotal)}</span>
            </div>
          </div>
        </div>

        {/* Uaicode + ADS Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-accent font-medium flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Uaicode Marketing + ADS
            </span>
            <span className="font-bold text-accent">{formatCurrency(animatedTotal)}/mo</span>
          </div>
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-amber-500/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-lg transition-all duration-1000 ease-out delay-400 flex items-center justify-end pr-3"
              style={{ width: hasAnimated ? `${Math.min(totalWidth, 100)}%` : '0%' }}
            >
              <span className="text-xs font-medium text-accent-foreground">{formatCurrencyK(uaicodeWithAds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="space-y-2 animate-fade-in">
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
              className="grid grid-cols-3 gap-2 py-2 border-b border-border/20 last:border-0 items-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
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
      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-accent/20">
            <Check className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="font-bold text-accent text-sm md:text-lg">
            You Save: {formatCurrencyK(annualSavingsMin)} - {formatCurrencyK(annualSavingsMax)}/year
          </span>
        </div>
        <p className="text-xs text-muted-foreground pl-7">
          Reinvest in paid media for faster growth!
        </p>
      </div>
    </div>
  );
};

export default MarketingComparisonSlider;
