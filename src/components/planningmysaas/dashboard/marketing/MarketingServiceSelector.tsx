import { useState, useEffect } from "react";
import { Check, Briefcase, Megaphone, Palette, Share2, Users, Sparkles, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketingTiers, MarketingService, calculateMarketingTotals, MarketingTotals } from "@/hooks/useMarketingTiers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  megaphone: Megaphone,
  palette: Palette,
  share2: Share2,
  users: Users,
  sparkles: Sparkles,
};

// Required service configuration
const REQUIRED_SERVICE_ID = "project_manager";
const MIN_ADDITIONAL_SERVICES = 1;

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
  isLocked,
  onToggle,
}: {
  service: MarketingService;
  isSelected: boolean;
  isLocked: boolean;
  onToggle: () => void;
}) => {
  const IconComponent = iconMap[service.service_icon] || Briefcase;
  
  // Calculate bar widths (uaicode relative to traditional max)
  const uaicodeWidth = (service.uaicode_price_cents / service.traditional_max_cents) * 100;
  const traditionalMinWidth = (service.traditional_min_cents / service.traditional_max_cents) * 100;
  
  return (
    <Card
      className={cn(
        "group relative transition-all duration-300",
    isLocked 
      ? "cursor-not-allowed bg-accent/10 border-accent shadow-lg shadow-accent/20"
          : "cursor-pointer hover:scale-[1.02]",
        isSelected && !isLocked
          ? "bg-accent/10 border-accent shadow-lg shadow-accent/20"
          : !isLocked && "bg-muted/30 border-border/50 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
      )}
      onClick={isLocked ? undefined : onToggle}
    >
      <CardContent className="p-4">
        {/* Checkbox + Title Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Custom Checkbox or Lock Icon */}
            {isLocked ? (
              <div className="w-4 h-4 rounded-md bg-accent/20 border border-accent flex items-center justify-center">
                <Lock className="h-2.5 w-2.5 text-accent" />
              </div>
            ) : (
              <div
                className={cn(
                  "w-4 h-4 rounded-md border flex items-center justify-center transition-colors duration-300",
                  isSelected
                    ? "bg-accent/20 border-accent"
                    : "border-border/50 bg-transparent group-hover:border-accent/50"
                )}
              >
                {isSelected && <Check className="h-2.5 w-2.5 text-accent" />}
              </div>
            )}
            
            <div className={cn(
              "p-1.5 rounded-lg transition-colors duration-300",
              isSelected || isLocked ? "bg-accent/20" : "bg-muted/50 group-hover:bg-accent/10"
            )}>
              <IconComponent className={cn(
                "h-3.5 w-3.5 transition-colors duration-300",
                isSelected || isLocked ? "text-accent" : "text-muted-foreground group-hover:text-accent"
              )} />
            </div>
            <span className={cn(
              "font-medium text-sm transition-colors duration-300",
              isSelected || isLocked ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
            )}>
              {service.service_name}
            </span>
          </div>
          
          {isLocked ? (
            <InfoTooltip size="sm" side="top">
              <div className="text-xs">
                <p className="font-medium mb-1">Required Service</p>
                <p className="text-muted-foreground">
                  Project Manager is essential for coordinating all marketing services and ensuring your project runs smoothly.
                </p>
              </div>
            </InfoTooltip>
          ) : null}
          
          {isLocked ? (
            <Badge className="text-[9px] bg-accent/20 text-accent border-accent/40 px-1.5 py-0.5 font-semibold">
              REQUIRED
            </Badge>
          ) : service.is_recommended ? (
            <Badge className="text-[9px] bg-accent/10 text-accent border-accent/30 px-1.5 py-0.5">
              RECOMMENDED
            </Badge>
          ) : null}
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
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-300"
                style={{ width: `${uaicodeWidth}%` }}
              />
            </div>
          </div>
          
          {/* Traditional Price */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Traditional</span>
              <span className="text-muted-foreground">
                {formatCurrencyK(service.traditional_min_cents)}-{formatCurrencyK(service.traditional_max_cents)}/mo
              </span>
            </div>
            <div className="relative h-1.5 bg-muted/30 rounded-full overflow-hidden">
              {/* Min range indicator */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full"
                style={{ width: `${traditionalMinWidth}%` }}
              />
              {/* Max range indicator */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
        
        {/* Savings Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10 border border-accent/20">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-[10px] font-medium text-accent">
              Save {service.savings_percent_min}-{service.savings_percent_max}%
            </span>
          </div>
          {!isLocked && (
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
          )}
        </div>

        {/* Selected indicator */}
        {(isSelected || isLocked) && (
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent animate-pulse" />
        )}
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

  // Initialize selection with required service + recommended services
  useEffect(() => {
    if (services.length > 0 && !initialized) {
      let initialIds: string[];
      
      if (defaultSelectRecommended) {
        // Select all recommended services
        initialIds = services
          .filter((s) => s.is_recommended)
          .map((s) => s.service_id);
      } else {
        // Minimum: Project Manager + first recommended additional service
        const firstRecommended = services.find(
          s => s.is_recommended && s.service_id !== REQUIRED_SERVICE_ID
        );
        initialIds = [REQUIRED_SERVICE_ID];
        if (firstRecommended) {
          initialIds.push(firstRecommended.service_id);
        } else {
          // Fallback: pick first non-required service
          const firstOther = services.find(s => s.service_id !== REQUIRED_SERVICE_ID);
          if (firstOther) {
            initialIds.push(firstOther.service_id);
          }
        }
      }
      
      // Ensure required service is always included
      if (!initialIds.includes(REQUIRED_SERVICE_ID)) {
        initialIds.unshift(REQUIRED_SERVICE_ID);
      }
      
      setSelectedIds(initialIds);
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
    // Project Manager cannot be deselected
    if (serviceId === REQUIRED_SERVICE_ID) {
      toast.info("Project Manager is required", {
        description: "This service is essential for coordinating all other services."
      });
      return;
    }
    
    const isRemoving = selectedIds.includes(serviceId);
    
    if (isRemoving) {
      // Check if we still have minimum additional services after removal
      const additionalServices = selectedIds.filter(id => id !== REQUIRED_SERVICE_ID);
      if (additionalServices.length <= MIN_ADDITIONAL_SERVICES) {
        toast.info("Minimum 2 services required", {
          description: "Project Manager + at least 1 other service"
        });
        return;
      }
    }
    
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
          <span className="text-accent/70 ml-1">• Min: 2 required</span>
        </span>
      </div>

      {/* Service Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service) => (
          <ServiceCard
            key={service.service_id}
            service={service}
            isSelected={selectedIds.includes(service.service_id)}
            isLocked={service.service_id === REQUIRED_SERVICE_ID}
            onToggle={() => toggleService(service.service_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketingServiceSelector;
