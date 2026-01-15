import { useState, useEffect } from "react";
import { Check, Briefcase, Megaphone, Palette, Share2, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketingTiers, MarketingService, calculateMarketingTotals, MarketingTotals } from "@/hooks/useMarketingTiers";
import { cn } from "@/lib/utils";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  megaphone: Megaphone,
  palette: Palette,
  share2: Share2,
  users: Users,
  sparkles: Sparkles,
};

interface MarketingServiceSelectorProps {
  onSelectionChange?: (selectedIds: string[], totals: MarketingTotals) => void;
  defaultSelectRecommended?: boolean;
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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

const ServiceCard = ({
  service,
  isSelected,
  onToggle,
}: {
  service: MarketingService;
  isSelected: boolean;
  onToggle: () => void;
}) => {
  const IconComponent = iconMap[service.service_icon] || Briefcase;
  
  // Calculate bar widths (uaicode relative to traditional max)
  const uaicodeWidth = (service.uaicode_price_cents / service.traditional_max_cents) * 100;
  const traditionalMinWidth = (service.traditional_min_cents / service.traditional_max_cents) * 100;
  
  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-colors duration-200",
        isSelected
          ? "bg-accent/10 border-accent/40"
          : "bg-card/50 border-border/30 hover:border-accent/30"
      )}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        {/* Checkbox + Title Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Custom Checkbox */}
            <div
              className={cn(
                "w-4 h-4 rounded-md border flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-accent/20 border-accent/50"
                  : "border-border/50 bg-transparent"
              )}
            >
              {isSelected && <Check className="h-2.5 w-2.5 text-accent" />}
            </div>
            
            <div className={cn(
              "p-1.5 rounded-md",
              isSelected ? "bg-accent/15" : "bg-accent/10"
            )}>
              <IconComponent className={cn(
                "h-3.5 w-3.5",
                isSelected ? "text-accent" : "text-muted-foreground"
              )} />
            </div>
            <span className={cn(
              "font-medium text-sm",
              isSelected ? "text-foreground" : "text-foreground/80"
            )}>
              {service.service_name}
            </span>
          </div>
          
          {service.is_recommended && (
            <Badge className="text-[9px] bg-accent/10 text-accent border-accent/30 px-1.5 py-0.5">
              RECOMMENDED
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {service.service_description}
        </p>
        
        {/* Price Comparison Bars */}
        <div className="space-y-2 mb-3">
          {/* Uaicode Price */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-accent font-medium">Uaicode</span>
              <span className="font-bold text-accent">{formatCurrency(service.uaicode_price_cents)}/mo</span>
            </div>
            <div className="relative h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-accent/80 rounded-full transition-all duration-300"
                style={{ width: `${uaicodeWidth}%` }}
              />
            </div>
          </div>
          
          {/* Traditional Price */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Traditional</span>
              <span className="text-red-400/80">
                {formatCurrencyK(service.traditional_min_cents)}-{formatCurrencyK(service.traditional_max_cents)}/mo
              </span>
            </div>
            <div className="relative h-1.5 bg-muted/30 rounded-full overflow-hidden">
              {/* Min range indicator */}
              <div 
                className="absolute inset-y-0 left-0 bg-red-500/30 rounded-full"
                style={{ width: `${traditionalMinWidth}%` }}
              />
              {/* Max range indicator */}
              <div 
                className="absolute inset-y-0 left-0 bg-red-500/50 rounded-full transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
        
        {/* Savings Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
            <Sparkles className="h-3 w-3 text-green-400" />
            <span className="text-[10px] font-medium text-green-400">
              Save {service.savings_percent_min}-{service.savings_percent_max}%
            </span>
          </div>
          <InfoTooltip size="sm" side="top">
            <div className="text-xs space-y-1">
              <p className="font-medium">{service.service_name}</p>
              {service.whats_included.length > 0 && (
                <ul className="list-disc pl-3 text-muted-foreground">
                  {service.whats_included.slice(0, 4).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </InfoTooltip>
        </div>
      </CardContent>
    </Card>
  );
};

const MarketingServiceSelector = ({
  onSelectionChange,
  defaultSelectRecommended = true,
}: MarketingServiceSelectorProps) => {
  const { services, isLoading } = useMarketingTiers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize selection with recommended services
  useEffect(() => {
    if (services.length > 0 && !initialized && defaultSelectRecommended) {
      const recommendedIds = services
        .filter((s) => s.is_recommended)
        .map((s) => s.service_id);
      setSelectedIds(recommendedIds);
      setInitialized(true);
    }
  }, [services, initialized, defaultSelectRecommended]);

  // Notify parent of changes
  useEffect(() => {
    if (onSelectionChange && services.length > 0) {
      const totals = calculateMarketingTotals(selectedIds, services);
      onSelectionChange(selectedIds, totals);
    }
  }, [selectedIds, services, onSelectionChange]);

  const toggleService = (serviceId: string) => {
    setSelectedIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Select the services you need ({selectedIds.length}/{services.length} selected)
        </span>
      </div>

      {/* Service Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service) => (
          <ServiceCard
            key={service.service_id}
            service={service}
            isSelected={selectedIds.includes(service.service_id)}
            onToggle={() => toggleService(service.service_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketingServiceSelector;
