import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface ScoreCircleProps {
  score: number;
  label: string;
  color?: "accent" | "muted";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  showLabelInside?: boolean;
  showGlow?: boolean;
}

// Generate unique ID for SVG elements
let idCounter = 0;
const getUniqueId = () => `score-circle-${++idCounter}`;

const ScoreCircle = ({ 
  score, 
  label, 
  color = "accent", 
  size = "md",
  showLabelInside = true,
  showGlow = false
}: ScoreCircleProps) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Generate unique IDs for this instance
  const uniqueId = useMemo(() => getUniqueId(), []);
  const gradientId = `gradient-${uniqueId}`;
  const glowId = `glow-${uniqueId}`;

  const sizeMap = {
    sm: { container: "w-12 h-12", text: "text-sm", label: "text-[9px]" },
    md: { container: "w-14 h-14", text: "text-base", label: "text-[10px]" },
    lg: { container: "w-16 h-16", text: "text-lg", label: "text-[10px]" },
    xl: { container: "w-20 h-20", text: "text-xl", label: "text-xs" },
    "2xl": { container: "w-24 h-24", text: "text-2xl", label: "text-xs" },
    "3xl": { container: "w-32 h-32", text: "text-3xl", label: "text-sm" },
  };

  return (
    <div className={cn(
      "relative flex-shrink-0",
      sizeMap[size].container,
      showGlow && "drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
    )}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Gradient and Glow Definitions */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FCD34D" />
          </linearGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="8"
          className="stroke-muted/20"
        />
        {/* Progress circle with gradient and glow */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={showGlow ? `url(#${gradientId})` : undefined}
          filter={showGlow ? `url(#${glowId})` : undefined}
          className={cn(
            !showGlow && "stroke-accent",
            "transition-all duration-1000 ease-out"
          )}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn(
          "font-bold",
          sizeMap[size].text,
          showGlow 
            ? "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent"
            : "text-accent"
        )}>
          {score}
        </span>
        {showLabelInside && label && (
          <span className={cn("text-muted-foreground", sizeMap[size].label)}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreCircle;
