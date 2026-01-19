import { LucideIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
}

const SelectableCard = ({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  className,
  disabled = false,
  disabledMessage,
}: SelectableCardProps) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "group relative flex flex-col items-start gap-3 p-4 rounded-xl transition-all duration-300 text-left",
        "bg-muted/30 border",
        !disabled && "hover:scale-[1.02]",
        selected && !disabled
          ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
          : !disabled
            ? "border-border/50 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
            : "border-border/30 opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
          selected && !disabled ? "bg-accent/20" : "bg-muted/50",
          !disabled && !selected && "group-hover:bg-accent/10"
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5 transition-colors duration-300",
            selected && !disabled ? "text-accent" : "text-muted-foreground",
            !disabled && !selected && "group-hover:text-accent"
          )}
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Title */}
        <span
          className={cn(
            "text-sm font-medium block transition-colors duration-300",
            disabled ? "text-muted-foreground" : selected ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
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

        {/* Disabled message */}
        {disabled && disabledMessage && (
          <span className="text-xs text-muted-foreground/70 block mt-1">
            {disabledMessage}
          </span>
        )}
      </div>

      {/* Selected indicator or Lock icon */}
      {selected && !disabled && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent animate-pulse" />
      )}
      {disabled && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </button>
  );
};

export default SelectableCard;
