import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, X, RefreshCw, Copy, Check } from "lucide-react";
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
import { toast } from "sonner";

interface DataQualityBannerProps {
  issues: DataQualityIssue[];
  onRegenerate: () => void;
  onDismiss: () => void;
}

export const DataQualityBanner = ({
  issues,
  onRegenerate,
  onDismiss,
}: DataQualityBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (issues.length === 0) return null;
  
  const isCritical = hasCriticalIssues(issues);
  const summary = getIssuesSummary(issues);
  
  return (
    <div 
      className={`
        hidden md:block relative rounded-xl border p-4 mb-6
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
                className="h-8 gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate Report
              </Button>
            </div>
            
            <CollapsibleContent className="mt-3">
              <div className="space-y-4 pl-0.5">
                {issues.map((issue) => (
                  <IssueDetailCard key={issue.id} issue={issue} />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

// Sub-component for detailed issue display
const IssueDetailCard = ({ issue }: { issue: DataQualityIssue }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };
  
  return (
    <div className="rounded-lg bg-background/50 border border-amber-500/20 p-3">
      {/* Issue message */}
      <div className="flex items-start gap-2 mb-3">
        <span 
          className={`
            inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0
            ${issue.severity === 'warning' ? 'bg-amber-500' : 'bg-amber-400/60'}
          `}
        />
        <span className="text-sm font-medium text-foreground">
          {issue.message}
        </span>
      </div>
      
      {/* Debug info */}
      <div className="ml-3 space-y-1.5 font-mono text-xs">
        {/* JSON Path */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-20">JSON Path:</span>
          <code className="flex-1 bg-background/80 px-2 py-0.5 rounded text-amber-400/90">
            {issue.jsonPath}
          </code>
          <button
            onClick={() => handleCopy(issue.jsonPath, 'jsonPath')}
            className="p-1 hover:bg-amber-500/10 rounded transition-colors"
            title="Copy JSON path"
          >
            {copiedField === 'jsonPath' ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
        
        {/* DB Column */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-20">DB Column:</span>
          <code className="flex-1 bg-background/80 px-2 py-0.5 rounded text-blue-400/90">
            tb_pms_reports.{issue.dbColumn}
          </code>
          <button
            onClick={() => handleCopy(`tb_pms_reports.${issue.dbColumn}`, 'dbColumn')}
            className="p-1 hover:bg-amber-500/10 rounded transition-colors"
            title="Copy column name"
          >
            {copiedField === 'dbColumn' ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
        
        {/* Current Value */}
        <div className="flex items-start gap-2">
          <span className="text-muted-foreground w-20">Current:</span>
          <code className="flex-1 bg-background/80 px-2 py-0.5 rounded text-red-400/70 whitespace-pre-wrap break-all max-h-24 overflow-auto">
            {formatValue(issue.currentValue)}
          </code>
          <button
            onClick={() => handleCopy(formatValue(issue.currentValue), 'currentValue')}
            className="p-1 hover:bg-amber-500/10 rounded transition-colors"
            title="Copy current value"
          >
            {copiedField === 'currentValue' ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataQualityBanner;
