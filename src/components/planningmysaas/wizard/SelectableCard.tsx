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
        "group relative flex flex-col items-start gap-3 p-4 rounded-xl transition-all duration-300 text-left",
        "bg-muted/30 border hover:scale-[1.02]",
        selected
          ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
          : "border-border/50 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
          selected ? "bg-accent/20" : "bg-muted/50 group-hover:bg-accent/10"
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5 transition-colors duration-300",
            selected ? "text-accent" : "text-muted-foreground group-hover:text-accent"
          )}
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Title */}
        <span
          className={cn(
            "text-sm font-medium block transition-colors duration-300",
            selected ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
          )}
        >
          {title}
        </span>

        {/* Description */}
        {description && (
          <span className="text-xs text-muted-foreground line-clamp-2 block">
            {description}
          </span>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent animate-pulse" />
      )}
    </button>
  );
};

export default SelectableCard;
