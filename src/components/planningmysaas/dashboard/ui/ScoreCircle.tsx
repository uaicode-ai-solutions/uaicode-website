import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  label: string;
  color?: "success" | "warning" | "error" | "accent";
  size?: "sm" | "md" | "lg";
}

const ScoreCircle = ({ score, label, color = "accent", size = "md" }: ScoreCircleProps) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    success: { stroke: "stroke-green-500", text: "text-green-500", bg: "bg-green-500/10" },
    warning: { stroke: "stroke-amber-500", text: "text-amber-500", bg: "bg-amber-500/10" },
    error: { stroke: "stroke-red-500", text: "text-red-500", bg: "bg-red-500/10" },
    accent: { stroke: "stroke-accent", text: "text-accent", bg: "bg-accent/10" },
  };

  const sizeMap = {
    sm: { container: "w-16 h-16", text: "text-lg", label: "text-[10px]" },
    md: { container: "w-20 h-20", text: "text-xl", label: "text-xs" },
    lg: { container: "w-24 h-24", text: "text-2xl", label: "text-xs" },
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
        <span className={cn("text-muted-foreground", sizeMap[size].label)}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default ScoreCircle;
