import { Badge } from "@/components/ui/badge";
import { Database, Calculator, Sparkles, HelpCircle, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataSourceType = 'database' | 'calculated' | 'estimated' | 'fallback' | 'benchmark';

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
    colorClass: "bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30",
    tooltip: "This value comes directly from research data in the database.",
  },
  benchmark: {
    label: "Benchmark",
    shortLabel: "Bench",
    icon: FlaskConical,
    colorClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30",
    tooltip: "This value comes from market benchmark research (n8n pipeline).",
  },
  calculated: {
    label: "Calculated",
    shortLabel: "Calc",
    icon: Calculator,
    colorClass: "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25",
    tooltip: "This value is calculated from other available data (e.g., ROI from MRR and investment).",
  },
  estimated: {
    label: "Estimated",
    shortLabel: "Est",
    icon: Sparkles,
    colorClass: "bg-amber-500/10 text-amber-400/80 border-amber-500/20 hover:bg-amber-500/20",
    tooltip: "This value uses industry average estimates due to missing specific data.",
  },
  fallback: {
    label: "Default",
    shortLabel: "Def",
    icon: HelpCircle,
    colorClass: "bg-amber-500/5 text-amber-400/60 border-amber-500/15 hover:bg-amber-500/15",
    tooltip: "This value uses a default placeholder. Original data was not available.",
  },
};

export function DataSourceBadge({ 
  source, 
  size = 'xs', 
  className 
}: Omit<DataSourceBadgeProps, 'showTooltip'>) {
  const config = sourceConfig[source];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-normal transition-colors",
        size === 'xs' ? "text-[9px] px-1 py-0 h-4 gap-0.5" : "text-[10px] px-1.5 py-0.5 h-5 gap-1",
        config.colorClass,
        className
      )}
    >
      <Icon className={size === 'xs' ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {size === 'xs' ? config.shortLabel : config.label}
    </Badge>
  );
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
  // New fields from n8n v1.7.0+
  projectionData: DataSourceType;
  financialScenarios: DataSourceType;
  yearEvolution: DataSourceType;
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
  // New fields from n8n v1.7.0+
  projectionData: 'calculated',
  financialScenarios: 'calculated',
  yearEvolution: 'calculated',
};
