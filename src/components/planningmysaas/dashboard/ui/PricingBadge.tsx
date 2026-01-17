import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePriceModels, getPriceModel } from "@/hooks/usePriceModels";
import { icons } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingBadgeProps {
  modelId: string;
  showIcon?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export const PricingBadge = ({
  modelId,
  showIcon = true,
  size = "sm",
  className,
}: PricingBadgeProps) => {
  const { data: priceModels } = usePriceModels();
  const model = getPriceModel(priceModels, modelId);

  const iconName = model?.icon;
  const Icon = iconName && iconName in icons ? icons[iconName as keyof typeof icons] : null;
  const displayName = model?.model_name || modelId;
  const description = model?.description || "Pricing model type";

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "cursor-help bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
              size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-0.5",
              className
            )}
          >
            {showIcon && Icon && <Icon className="w-3 h-3 mr-1" />}
            {displayName}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
