import { useState, useEffect } from "react";
import { Check, X, Clock, Shield, FileText, Code, Headphones, TrendingDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ComparisonData {
  uaicode: number;
  traditional: number;
  savings: string;
  savingsAmount: number;
  savingsContext: string;
  features: {
    label: string;
    icon: React.ElementType;
    uaicode: string;
    traditional: string;
    uaicodePositive: boolean;
  }[];
}

const comparisonData: ComparisonData = {
  uaicode: 55000,
  traditional: 120000,
  savings: "54%",
  savingsAmount: 65000,
  savingsContext: "That's enough for 12 months of marketing budget!",
  features: [
    {
      label: "Delivery Time",
      icon: Clock,
      uaicode: "12-18 weeks",
      traditional: "6-9 months",
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
  ],
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const PricingComparisonSlider = () => {
  const [sliderValue, setSliderValue] = useState([0]);
  const [animatedUaicode, setAnimatedUaicode] = useState(0);
  const [animatedTraditional, setAnimatedTraditional] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animate bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animate numbers
  useEffect(() => {
    if (!hasAnimated) return;
    
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedUaicode(Math.floor(comparisonData.uaicode * easeOut));
      setAnimatedTraditional(Math.floor(comparisonData.traditional * easeOut));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedUaicode(comparisonData.uaicode);
        setAnimatedTraditional(comparisonData.traditional);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [hasAnimated]);

  const uaicodeWidth = (comparisonData.uaicode / comparisonData.traditional) * 100;
  const revealProgress = sliderValue[0] / 100;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-green-400" />
          <h4 className="font-medium text-foreground text-sm">Price Comparison</h4>
          <InfoTooltip side="right" size="sm">
            Drag the slider to compare Uaicode's pricing with traditional agencies.
          </InfoTooltip>
        </div>
        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400 text-xs">
          Save {comparisonData.savings}
        </Badge>
      </div>

      {/* Price Bars */}
      <div className="space-y-3">
        {/* Traditional Agency Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Traditional Agency</span>
            <span className="font-medium text-red-400">{formatCurrency(animatedTraditional)}</span>
          </div>
          <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden border border-border/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500/40 to-red-400/30 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: hasAnimated ? '100%' : '0%' }}
            >
              <span className="text-xs font-medium text-red-300">$120K</span>
            </div>
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
              <span className="text-xs font-medium text-accent-foreground">$55K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Drag to reveal comparison details</p>
        <Slider
          value={sliderValue}
          onValueChange={setSliderValue}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Feature Comparison (reveals with slider) */}
      <div 
        className="space-y-2 transition-all duration-300"
        style={{ 
          opacity: revealProgress,
          transform: `translateY(${(1 - revealProgress) * 10}px)`,
          maxHeight: revealProgress > 0.1 ? '500px' : '0px',
          overflow: 'hidden'
        }}
      >
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b border-border/30">
          <span>Feature</span>
          <span className="text-center text-red-400/70">Traditional</span>
          <span className="text-center text-accent">Uaicode</span>
        </div>
        
        {comparisonData.features.map((feature, index) => {
          const IconComponent = feature.icon;
          const itemOpacity = Math.max(0, Math.min(1, (revealProgress - (index * 0.15)) * 3));
          
          return (
            <div 
              key={index}
              className="grid grid-cols-3 gap-2 py-2 border-b border-border/20 last:border-0 items-center transition-all duration-200"
              style={{ opacity: itemOpacity }}
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
      <div 
        className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 transition-all duration-500"
        style={{ 
          opacity: 0.5 + (revealProgress * 0.5),
          transform: `scale(${0.98 + (revealProgress * 0.02)})`
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded-full bg-green-500/20">
            <Check className="h-3.5 w-3.5 text-green-400" />
          </div>
          <span className="font-bold text-green-400 text-lg">
            You Save: {formatCurrency(comparisonData.savingsAmount)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground pl-7">
          {comparisonData.savingsContext}
        </p>
      </div>
    </div>
  );
};

export default PricingComparisonSlider;
