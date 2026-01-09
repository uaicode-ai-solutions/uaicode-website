import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const SelectableCard = ({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  className,
}: SelectableCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300",
        "glass-card border hover:scale-[1.02]",
        selected
          ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
          : "border-border/50 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
          selected ? "bg-accent/20" : "bg-muted group-hover:bg-accent/10"
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6 transition-colors duration-300",
            selected ? "text-accent" : "text-muted-foreground group-hover:text-accent"
          )}
        />
      </div>

      {/* Title */}
      <span
        className={cn(
          "text-sm font-medium text-center transition-colors duration-300",
          selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {title}
      </span>

      {/* Description */}
      {description && (
        <span className="text-xs text-muted-foreground text-center line-clamp-2">
          {description}
        </span>
      )}

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent animate-pulse" />
      )}
    </button>
  );
};

export default SelectableCard;
