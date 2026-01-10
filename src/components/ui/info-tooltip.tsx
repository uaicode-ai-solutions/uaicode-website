import * as React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  children: React.ReactNode;
  term?: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "md";
}

const InfoTooltip = ({ 
  children, 
  term, 
  className,
  side = "top",
  size = "sm"
}: InfoTooltipProps) => {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4"
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-full",
              "bg-accent/10 hover:bg-accent/20 transition-colors",
              "cursor-help ml-1",
              size === "sm" ? "p-0.5" : "p-1",
              className
            )}
            aria-label={term ? `Learn about ${term}` : "More information"}
          >
            <Info className={cn("text-accent", sizeClasses[size])} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="max-w-xs bg-card border-border/50 shadow-lg z-50"
        >
          {term && (
            <p className="font-medium text-accent text-sm mb-1">{term}</p>
          )}
          <div className="text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { InfoTooltip };
