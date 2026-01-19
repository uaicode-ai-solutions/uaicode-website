import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DataQualityIssue, 
  getIssuesSummary, 
  hasCriticalIssues 
} from "@/lib/dataQualityUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DataQualityBannerProps {
  issues: DataQualityIssue[];
  onRegenerate: () => void;
  onDismiss: () => void;
  isRegenerating: boolean;
}

export const DataQualityBanner = ({
  issues,
  onRegenerate,
  onDismiss,
  isRegenerating,
}: DataQualityBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (issues.length === 0) return null;
  
  const isCritical = hasCriticalIssues(issues);
  const summary = getIssuesSummary(issues);
  
  return (
    <div 
      className={`
        relative rounded-xl border p-4 mb-6
        ${isCritical 
          ? 'bg-amber-500/10 border-amber-500/30' 
          : 'bg-amber-500/5 border-amber-500/20'
        }
      `}
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-3 pr-8">
        <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isCritical ? 'text-amber-500' : 'text-amber-400'}`} />
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${isCritical ? 'text-amber-500' : 'text-amber-400'}`}>
            Data Quality Notice
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            We detected {summary} in this report that may affect some metrics. 
            {!isCritical && " This won't impact the overall analysis."}
          </p>
          
          {/* Collapsible details */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="flex items-center gap-3 mt-3">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      See Details
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="h-8 gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50"
              >
                <RefreshCw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate Report'}
              </Button>
            </div>
            
            <CollapsibleContent className="mt-3">
              <div className="space-y-2 pl-0.5">
                {issues.map((issue) => (
                  <div 
                    key={issue.id}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span 
                      className={`
                        inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0
                        ${issue.severity === 'warning' ? 'bg-amber-500' : 'bg-amber-400/60'}
                      `}
                    />
                    <span className="text-muted-foreground">
                      {issue.message}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default DataQualityBanner;
