// ============================================
// Report Data Utilities
// Fallback and parsing utilities for report JSONB fields
// ============================================

import { ReportRow, ReportData } from "@/types/report";
import { requiresFallback as checkNeedsFallback, getFieldConfig, getStaticFallback } from "@/lib/fallbackConfig";
import type { UseFallbackAgentReturn } from "@/hooks/useFallbackAgent";

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

// Check if a value needs a fallback (null, undefined, empty, or placeholder)
export function requiresFallback(value: unknown): boolean {
  return checkNeedsFallback(value);
}

// Smart fallback wrapper - returns direct value or triggers fallback agent
export async function getWithSmartFallback<T>(
  reportData: ReportData | null | undefined,
  fieldPath: string,
  staticFallback: T,
  fallbackAgent?: UseFallbackAgentReturn | null,
  wizardId?: string,
  reportId?: string
): Promise<T> {
  // 1. Try to get direct value from reportData
  if (reportData) {
    const directValue = getNestedValue(reportData, fieldPath);
    if (directValue !== null && directValue !== undefined && !checkNeedsFallback(directValue)) {
      return directValue as T;
    }
  }

  // 2. If fallback agent is available and we have IDs, request intelligent fallback
  if (fallbackAgent && wizardId && reportId) {
    const config = getFieldConfig(fieldPath);
    if (config) {
      try {
        const result = await fallbackAgent.requestFallback({
          reportId,
          wizardId,
          fieldPath,
          sectionName: config.sectionName,
          fieldDescription: config.fieldDescription,
          fieldPurpose: config.fieldPurpose,
          expectedType: config.expectedType,
          expectedFormat: config.expectedFormat,
          validationRules: config.validationRules as Record<string, unknown>,
          perplexitySearchType: config.perplexitySearchType,
        });
        
        if (result?.success && result.value !== null && result.value !== undefined) {
          return result.value as T;
        }
      } catch (error) {
        console.error(`[getWithSmartFallback] Error for ${fieldPath}:`, error);
      }
    }
  }

  // 3. Try config static fallback
  const configFallback = getStaticFallback(fieldPath);
  if (configFallback !== null && configFallback !== undefined) {
    return configFallback as T;
  }

  // 4. Return provided static fallback
  return staticFallback;
}

// Synchronous version that returns cached value or static fallback
export function getWithFallback<T>(
  reportData: ReportData | null | undefined,
  fieldPath: string,
  staticFallback: T,
  fallbackAgent?: UseFallbackAgentReturn | null
): T {
  // 1. Try to get direct value from reportData
  if (reportData) {
    const directValue = getNestedValue(reportData, fieldPath);
    if (directValue !== null && directValue !== undefined && !checkNeedsFallback(directValue)) {
      return directValue as T;
    }
  }

  // 2. Check fallback agent cache
  if (fallbackAgent) {
    const cachedValue = fallbackAgent.getCachedValue(fieldPath);
    if (cachedValue !== null && cachedValue !== undefined) {
      return cachedValue as T;
    }
  }

  // 3. Try config static fallback
  const configFallback = getStaticFallback(fieldPath);
  if (configFallback !== null && configFallback !== undefined) {
    return configFallback as T;
  }

  // 4. Return provided static fallback
  return staticFallback;
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
