import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md",
        variant === "premium"
          ? "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer"
          : "animate-pulse bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
