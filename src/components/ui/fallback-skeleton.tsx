import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export interface FallbackSkeletonProps {
  /** Width of the skeleton (CSS value or Tailwind class) */
  width?: string;
  /** Height of the skeleton (CSS value or Tailwind class) */
  height?: string;
  /** Additional class names */
  className?: string;
  /** Show a loading spinner instead of skeleton */
  showSpinner?: boolean;
  /** Variant style */
  variant?: "text" | "value" | "card" | "inline";
  /** Size preset */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizePresets = {
  sm: { width: "w-12", height: "h-4" },
  md: { width: "w-20", height: "h-5" },
  lg: { width: "w-32", height: "h-6" },
  xl: { width: "w-40", height: "h-8" },
};

const variantStyles = {
  text: "rounded",
  value: "rounded-md",
  card: "rounded-lg",
  inline: "rounded inline-block align-middle",
};

/**
 * A skeleton component specifically designed for fallback loading states.
 * Shows a pulsing skeleton or spinner while data is being fetched.
 */
export function FallbackSkeleton({
  width,
  height,
  className,
  showSpinner = false,
  variant = "text",
  size = "md",
}: FallbackSkeletonProps) {
  const preset = sizePresets[size];
  const variantStyle = variantStyles[variant];
  
  if (showSpinner) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-muted-foreground", className)}>
        <Loader2 className={cn(
          "animate-spin",
          size === "sm" && "h-3 w-3",
          size === "md" && "h-4 w-4",
          size === "lg" && "h-5 w-5",
          size === "xl" && "h-6 w-6",
        )} />
        <span className="text-xs">Loading...</span>
      </span>
    );
  }

  return (
    <Skeleton
      className={cn(
        variantStyle,
        !width && preset.width,
        !height && preset.height,
        "bg-accent/10 animate-pulse",
        className
      )}
      style={{
        width: width && !width.startsWith("w-") ? width : undefined,
        height: height && !height.startsWith("h-") ? height : undefined,
      }}
    />
  );
}

/**
 * Inline skeleton for text values (currency, percentages, etc.)
 */
export function InlineValueSkeleton({ 
  size = "md",
  className,
}: { 
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <FallbackSkeleton 
      variant="inline" 
      size={size} 
      className={cn("mx-0.5", className)} 
    />
  );
}

/**
 * A skeleton specifically for large metric values
 */
export function MetricSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <FallbackSkeleton variant="value" size="xl" />
      <FallbackSkeleton variant="text" size="sm" className="w-16" />
    </div>
  );
}

/**
 * A skeleton for card content
 */
export function CardContentSkeleton({ 
  lines = 3,
  className,
}: { 
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <FallbackSkeleton 
          key={i} 
          variant="text" 
          className={cn(
            "h-4",
            i === 0 && "w-3/4",
            i === 1 && "w-full",
            i === 2 && "w-5/6",
            i > 2 && "w-full",
          )} 
        />
      ))}
    </div>
  );
}

export default FallbackSkeleton;
