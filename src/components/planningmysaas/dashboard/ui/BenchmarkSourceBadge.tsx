import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Database, AlertCircle, CheckCircle } from "lucide-react";
import { BenchmarkSection } from "@/types/benchmark";

interface BenchmarkSourceBadgeProps {
  isFromResearch: boolean;
  sourceCount: number;
  confidence: 'high' | 'medium' | 'low';
  sources?: string[];
  className?: string;
}

export function BenchmarkSourceBadge({
  isFromResearch,
  sourceCount,
  confidence,
  sources = [],
  className = "",
}: BenchmarkSourceBadgeProps) {
  const confidenceColors = {
    high: "text-emerald-500",
    medium: "text-amber-500",
    low: "text-muted-foreground",
  };

  const confidenceIcons = {
    high: CheckCircle,
    medium: AlertCircle,
    low: Database,
  };

  const ConfidenceIcon = confidenceIcons[confidence];

  if (!isFromResearch) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="secondary" 
              className={`gap-1 text-xs font-normal ${className}`}
            >
              <Database className="h-3 w-3" />
              Industry Averages
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">
              Using industry benchmark averages. 
              Dynamic market research will be available when the report is regenerated.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`gap-1 text-xs font-normal border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ${className}`}
          >
            <Search className="h-3 w-3" />
            Market Research
            <span className="opacity-70">({sourceCount})</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ConfidenceIcon className={`h-4 w-4 ${confidenceColors[confidence]}`} />
              <span className="font-medium capitalize">{confidence} Confidence</span>
            </div>
            
            {sources.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <p className="mb-1">Sources:</p>
                <ul className="space-y-0.5 max-h-32 overflow-y-auto">
                  {sources.slice(0, 5).map((source, i) => {
                    try {
                      const hostname = new URL(source).hostname.replace('www.', '');
                      return (
                        <li key={i} className="truncate">
                          • {hostname}
                        </li>
                      );
                    } catch {
                      return (
                        <li key={i} className="truncate">
                          • {source}
                        </li>
                      );
                    }
                  })}
                  {sources.length > 5 && (
                    <li className="text-muted-foreground/70">
                      +{sources.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default BenchmarkSourceBadge;
