import { useState, useEffect } from "react";
import { Check, X, Clock, Shield, FileText, Code, Headphones, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import { useMvpTier } from "@/hooks/useMvpTier";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

const formatDays = (days: number) => {
  if (days < 30) return `${days} days`;
  const weeks = Math.round(days / 7);
  if (weeks <= 12) return `${weeks} weeks`;
  const months = Math.round(days / 30);
  return `${months} months`;
};

const PricingComparisonSlider = () => {
  const { report } = useReportContext();
  const selectedFeatures = report?.selected_features || [];
  const { tier, pricing, timeline, isLoading } = useMvpTier(selectedFeatures);
  
  const [animatedUaicode, setAnimatedUaicode] = useState(0);
  const [animatedTraditional, setAnimatedTraditional] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Calculate values
  const uaicodePrice = pricing.uaicode.calculated > 0 
    ? pricing.uaicode.calculated 
    : pricing.uaicode.min;
  const traditionalPrice = pricing.traditional.min;
  const savingsAmount = traditionalPrice - uaicodePrice;
  const savingsPercentage = traditionalPrice > 0 
    ? Math.round((savingsAmount / traditionalPrice) * 100) 
    : 0;

  // Features comparison based on tier data
  const features = [
    {
      label: "Delivery Time",
      icon: Clock,
      uaicode: timeline.uaicode.min > 0 
        ? `${formatDays(timeline.uaicode.min)}-${formatDays(timeline.uaicode.max)}`
        : "30-75 days",
      traditional: timeline.traditional.min > 0 
        ? `${formatDays(timeline.traditional.min)}-${formatDays(timeline.traditional.max)}`
        : "75-150 days",
      uaicodePositive: true,
    },
    {
      label: "Hidden Costs",
      icon: Shield,
      uaicode: "Fixed price",
      traditional: "Common extras",
      uaicodePositive: true,
    },
    {
      label: "Post-Launch Support",
      icon: Headphones,
      uaicode: "30 days included",
      traditional: "Paid hourly",
      uaicodePositive: true,
    },
    {
      label: "Code Ownership",
      icon: Code,
      uaicode: "100% yours",
      traditional: "Often retained",
      uaicodePositive: true,
    },
    {
      label: "Documentation",
      icon: FileText,
      uaicode: "Complete",
      traditional: "Often missing",
      uaicodePositive: true,
    },
  ];

  // Animate bars on mount
  useEffect(() => {
    if (isLoading || !tier) return;
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [isLoading, tier]);

  // Animate numbers
  useEffect(() => {
    if (!hasAnimated || isLoading) return;
    
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedUaicode(Math.floor(uaicodePrice * easeOut));
      setAnimatedTraditional(Math.floor(traditionalPrice * easeOut));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedUaicode(uaicodePrice);
        setAnimatedTraditional(traditionalPrice);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [hasAnimated, uaicodePrice, traditionalPrice, isLoading]);

  const uaicodeWidth = traditionalPrice > 0 
    ? (uaicodePrice / traditionalPrice) * 100 
    : 50;

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

      {/* Tier Badge */}
      {tier && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent">
            {tier.tier_name}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Based on {selectedFeatures.length} selected features
          </span>
        </div>
      )}

      {/* Price Bars */}
      <div className="space-y-3">
        {/* Traditional Agency Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Traditional Agency (US Market)</span>
            <span className="font-medium text-red-400">{formatCurrency(animatedTraditional)}</span>
          </div>
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-border/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500/40 to-red-400/30 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: hasAnimated ? '100%' : '0%' }}
            >
              <span className="text-xs font-medium text-red-300">
                {formatCurrency(traditionalPrice)}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Range: {formatCurrency(pricing.traditional.min)} - {formatCurrency(pricing.traditional.max)}
          </div>
        </div>

        {/* Uaicode Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-accent font-medium">Uaicode</span>
            <span className="font-bold text-accent">{formatCurrency(animatedUaicode)}</span>
          </div>
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-accent/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 to-accent/40 rounded-lg transition-all duration-1000 ease-out delay-300 flex items-center justify-end pr-3"
              style={{ width: hasAnimated ? `${uaicodeWidth}%` : '0%' }}
            >
              <span className="text-xs font-medium text-accent-foreground">
                {formatCurrency(uaicodePrice)}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Range: {formatCurrency(pricing.uaicode.min)} - {formatCurrency(pricing.uaicode.max)}
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="space-y-2 animate-fade-in">
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
              className="grid grid-cols-3 gap-2 py-2 border-b border-border/20 last:border-0 items-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
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
      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-green-500/20">
            <Check className="h-3.5 w-3.5 text-green-400" />
          </div>
          <span className="font-bold text-green-400 text-lg">
            You Save: {formatCurrency(savingsAmount)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground pl-7">
          That's {savingsPercentage}% less than traditional agencies — enough for months of marketing!
        </p>
      </div>
    </div>
  );
};

export default PricingComparisonSlider;
