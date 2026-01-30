// ============================================
// Report Data Utilities
// Simplified parsing utilities for report JSONB fields
// All data comes 100% from database - no fallback agents
// ============================================

import { ReportRow, ReportData } from "@/types/report";

// Type-safe JSONB field parser
export function parseJsonField<T>(field: unknown, defaultValue: T): T {
  if (!field) return defaultValue;
  if (typeof field === 'object') return field as T;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

// Get nested value from object using dot notation path
export function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  
  const parts = path.split(".");
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  
  return current;
}

// Check if a value is empty/placeholder (for UI display purposes)
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" || trimmed === "..." || trimmed === "N/A" || trimmed === "n/a";
  }
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// Parse numeric score field (stored as string in DB)
export function parseScoreField(field: string | null | undefined, defaultValue: number = 0): number {
  if (!field) return defaultValue;
  const parsed = parseFloat(field);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Parse cents to dollars
export function parseCentsField(field: string | null | undefined, defaultValue: number = 0): number {
  if (!field) return defaultValue;
  const parsed = parseFloat(field);
  return isNaN(parsed) ? defaultValue : parsed / 100;
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Check if report has required data for a section
export function hasReportData(report: ReportRow | null | undefined, fields: (keyof ReportRow)[]): boolean {
  if (!report) return false;
  return fields.some(field => report[field] !== null && report[field] !== undefined);
}

// Default empty states for each section type
export const emptyStates = {
  timingAnalysis: {
    timingScore: 0,
    verdict: "Analysis pending...",
    macroTrends: [],
    windowOfOpportunity: { opens: "Now", closes: "TBD", reason: "Data not available" },
    firstMoverAdvantage: { score: 0, benefits: [] }
  },
  marketOpportunity: {
    tam: { value: "$0", label: "TAM", description: "Data not available" },
    sam: { value: "$0", label: "SAM", description: "Data not available" },
    som: { value: "$0", label: "SOM", description: "Data not available" },
    growthRate: "0%",
    conclusion: "Market data pending analysis..."
  },
  businessModel: {
    primaryModel: "Subscription SaaS",
    revenueStreams: [],
    pricingTiers: [],
    monetizationTimeline: []
  },
  demandValidation: {
    searchVolume: 0,
    trendsScore: 0,
    growthRate: "0%",
    painPoints: [],
    evidences: [],
    validationMethods: []
  },
  competitors: [],
  competitiveAdvantages: [],
  goToMarketPreview: {
    primaryChannel: "Content Marketing",
    channels: [],
    quickWins: [],
    first90Days: []
  },
  investment: {
    total: 0,
    breakdown: [],
    included: [],
    notIncluded: []
  },
  resourceRequirements: {
    founderTime: {
      phase1: { name: "Launch Prep", hoursPerWeek: 0, focus: "" },
      phase2: { name: "Launch", hoursPerWeek: 0, focus: "" },
      phase3: { name: "Growth", hoursPerWeek: 0, focus: "" },
      phase4: { name: "Scale", hoursPerWeek: 0, focus: "" }
    },
    teamTimeline: [],
    criticalSkills: [],
    externalSupport: []
  },
  marketBenchmarks: {
    industryComparison: [],
    successRates: {
      category: "SaaS",
      survivalYear1: "0%",
      survivalYear3: "0%",
      reaching1MARR: "0%",
      yourEstimatedProbability: "0%",
      whyHigher: ""
    },
    fundingBenchmarks: {
      seedRound: { typical: "$0", requires: "" },
      seriesA: { typical: "$0", requires: "" },
      yourReadiness: ""
    },
    exitScenarios: []
  },
  successMetrics: {
    northStar: { metric: "", current: "0", month3Target: "0", month6Target: "0", month12Target: "0", why: "" },
    launchMilestones: [],
    healthIndicators: [],
    warningSigns: []
  },
  pivotScenarios: {
    readinessScore: 0,
    scenarios: [],
    reusableAssets: [],
    decisionTriggers: []
  },
  executionTimeline: [],
  techStack: [],
  uaicodeInfo: {
    successRate: 94,
    projectsDelivered: 47,
    avgDeliveryWeeks: 12,
    differentials: [],
    testimonials: [],
    guarantees: []
  },
  nextSteps: {
    verdictSummary: "",
    steps: [],
    cta: { primary: "", secondary: "" },
    contact: { email: "", whatsapp: "", calendly: "" }
  }
};
