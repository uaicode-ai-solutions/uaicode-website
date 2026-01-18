import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  label: string;
  color?: "accent" | "muted";
  size?: "sm" | "md" | "lg" | "xl";
  showLabelInside?: boolean;
}

const ScoreCircle = ({ 
  score, 
  label, 
  color = "accent", 
  size = "md",
  showLabelInside = true 
}: ScoreCircleProps) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    accent: { stroke: "stroke-accent", text: "text-accent", bg: "bg-accent/10" },
    muted: { stroke: "stroke-muted-foreground", text: "text-muted-foreground", bg: "bg-muted/10" },
  };

  const sizeMap = {
    sm: { container: "w-12 h-12", text: "text-sm", label: "text-[9px]" },
    md: { container: "w-14 h-14", text: "text-base", label: "text-[10px]" },
    lg: { container: "w-16 h-16", text: "text-lg", label: "text-[10px]" },
    xl: { container: "w-20 h-20", text: "text-xl", label: "text-xs" },
  };

  return (
    <div className={cn("relative flex-shrink-0", sizeMap[size].container)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="8"
          className="stroke-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(colorMap[color].stroke, "transition-all duration-1000 ease-out")}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", sizeMap[size].text, colorMap[color].text)}>
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
