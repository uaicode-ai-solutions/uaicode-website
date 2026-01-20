import { Badge } from "@/components/ui/badge";
import { Database, Calculator, Sparkles, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type DataSourceType = 'database' | 'calculated' | 'estimated' | 'fallback';

interface DataSourceBadgeProps {
  source: DataSourceType;
  size?: 'sm' | 'xs';
  showTooltip?: boolean;
  className?: string;
}

const sourceConfig: Record<DataSourceType, {
  label: string;
  shortLabel: string;
  icon: typeof Database;
  colorClass: string;
  tooltip: string;
}> = {
  database: {
    label: "Real Data",
    shortLabel: "Real",
    icon: Database,
    colorClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20",
    tooltip: "This value comes directly from research data in the database.",
  },
  calculated: {
    label: "Calculated",
    shortLabel: "Calc",
    icon: Calculator,
    colorClass: "bg-blue-500/10 text-blue-500 border-blue-500/30 hover:bg-blue-500/20",
    tooltip: "This value is calculated from other available data (e.g., ROI from MRR and investment).",
  },
  estimated: {
    label: "Estimated",
    shortLabel: "Est",
    icon: Sparkles,
    colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20",
    tooltip: "This value uses industry average estimates due to missing specific data.",
  },
  fallback: {
    label: "Default",
    shortLabel: "Def",
    icon: HelpCircle,
    colorClass: "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
    tooltip: "This value uses a default placeholder. Original data was not available.",
  },
};

export function DataSourceBadge({ 
  source, 
  size = 'xs', 
  showTooltip = true,
  className 
}: DataSourceBadgeProps) {
  const config = sourceConfig[source];
  const Icon = config.icon;
  
  const badge = (
    <Badge 
      variant="outline"
      className={cn(
        "font-normal transition-colors cursor-help",
        size === 'xs' ? "text-[9px] px-1 py-0 h-4 gap-0.5" : "text-[10px] px-1.5 py-0.5 h-5 gap-1",
        config.colorClass,
        className
      )}
    >
      <Icon className={size === 'xs' ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {size === 'xs' ? config.shortLabel : config.label}
    </Badge>
  );

  if (showTooltip) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent 
            side="top"
            className="max-w-xs bg-card border-border/50 shadow-lg text-xs"
          >
            {config.tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

// Helper hook type for tracking data sources
export interface DataSources {
  breakEven: DataSourceType;
  roiYear1: DataSourceType;
  mrrMonth12: DataSourceType;
  arrProjected: DataSourceType;
  customers12: DataSourceType;
  churn12: DataSourceType;
  targetCac: DataSourceType;
  ltv: DataSourceType;
  paybackPeriod: DataSourceType;
  ltvCacRatio: DataSourceType;
  ltvCacCalculated: DataSourceType;
  marketingBudget: DataSourceType;
  idealTicket: DataSourceType;
}

export const defaultDataSources: DataSources = {
  breakEven: 'calculated',
  roiYear1: 'calculated',
  mrrMonth12: 'fallback',
  arrProjected: 'fallback',
  customers12: 'fallback',
  churn12: 'estimated',
  targetCac: 'fallback',
  ltv: 'calculated',
  paybackPeriod: 'fallback',
  ltvCacRatio: 'fallback',
  ltvCacCalculated: 'calculated',
  marketingBudget: 'estimated',
  idealTicket: 'calculated',
};
