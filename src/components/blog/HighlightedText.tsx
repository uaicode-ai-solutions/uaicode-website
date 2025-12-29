import { cn } from "@/lib/utils";

interface HighlightedTextProps {
  children: React.ReactNode;
  variant?: "highlight" | "subtitle";
  className?: string;
}

export const HighlightedText = ({ children, variant = "highlight", className }: HighlightedTextProps) => {
  if (variant === "subtitle") {
    return (
      <h3 className={cn(
        "text-2xl md:text-3xl font-bold text-accent mb-6 mt-12",
        className
      )}>
        {children}
      </h3>
    );
  }

  return (
    <span className={cn(
      "px-3 py-1 rounded-md bg-accent/25 text-accent font-bold",
      className
    )}>
      {children}
    </span>
  );
};
