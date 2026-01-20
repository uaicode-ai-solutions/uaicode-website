// ============================================
// useBenchmarks Hook
// Extracts and normalizes benchmark data from report
// ============================================

import { useMemo } from 'react';
import { BenchmarkSection, NormalizedBenchmarks } from '@/types/benchmark';

// Default static benchmarks (fallback when no dynamic data)
const DEFAULT_BENCHMARKS: NormalizedBenchmarks = {
  // MRR Caps
  MRR_MONTH_6_MAX: 100000,
  MRR_MONTH_12_MAX: 300000,
  MRR_MONTH_24_MAX: 1000000,
  
  // ARR Caps
  ARR_YEAR_1_MAX: 2500000,
  ARR_YEAR_2_MAX: 8000000,
  
  // Conversion
  USER_TO_PAYING_CONVERSION: 0.35,
  TRIAL_TO_PAID_CONVERSION: 0.25,
  
  // Growth constraints
  MAX_MONTHLY_GROWTH_RATE: 0.25,
  MAX_6_TO_12_MONTH_GROWTH: 2.0,
  MAX_12_TO_24_MONTH_GROWTH: 3.0,
  
  // ROI constraints
  ROI_YEAR_1_MIN: -100,
  ROI_YEAR_1_MAX: 150,
  ROI_YEAR_1_REALISTIC_MAX: 80,
  
  // Break-even
  BREAK_EVEN_MIN_MONTHS: 8,
  BREAK_EVEN_REALISTIC_MONTHS: 18,
  BREAK_EVEN_MAX_MONTHS: 36,
  
  // Unit Economics
  LTV_CAC_MIN: 2.0,
  LTV_CAC_MAX: 8.0,
  PAYBACK_MIN_MONTHS: 4,
  PAYBACK_MAX_MONTHS: 24,
  
  // Churn
  CHURN_MIN_MONTHLY: 0.5,
  CHURN_REALISTIC_MONTHLY: 3.0,
  CHURN_MAX_MONTHLY: 8.0,
  
  // Metadata
  isFromResearch: false,
  sourceCount: 0,
  confidence: 'low',
  marketType: 'b2b',
  industry: 'general',
};

// Market type specific fallbacks
const MARKET_TYPE_ADJUSTMENTS: Record<string, Partial<NormalizedBenchmarks>> = {
  b2c: {
    USER_TO_PAYING_CONVERSION: 0.03,
    CHURN_REALISTIC_MONTHLY: 5.0,
    CHURN_MAX_MONTHLY: 10.0,
    ROI_YEAR_1_MAX: 100,
    BREAK_EVEN_REALISTIC_MONTHS: 24,
  },
  b2b: {
    USER_TO_PAYING_CONVERSION: 0.35,
    CHURN_REALISTIC_MONTHLY: 3.0,
    CHURN_MAX_MONTHLY: 8.0,
    ROI_YEAR_1_MAX: 150,
    BREAK_EVEN_REALISTIC_MONTHS: 18,
  },
  internal: {
    USER_TO_PAYING_CONVERSION: 0.8,
    CHURN_REALISTIC_MONTHLY: 1.0,
    CHURN_MAX_MONTHLY: 3.0,
    ROI_YEAR_1_MAX: 200,
    BREAK_EVEN_REALISTIC_MONTHS: 12,
  },
};

/**
 * Parse benchmark section from JSONB field
 */
function parseBenchmarkSection(data: unknown): BenchmarkSection | null {
  if (!data || typeof data !== 'object') return null;
  
  const section = data as Record<string, unknown>;
  
  // Check for required fields
  if (
    typeof section.mrr_month_6_max !== 'number' ||
    typeof section.mrr_month_12_max !== 'number'
  ) {
    return null;
  }
  
  return section as unknown as BenchmarkSection;
}

/**
 * Normalize dynamic benchmarks to internal format
 */
function normalizeBenchmarks(
  dynamic: BenchmarkSection,
  defaults: NormalizedBenchmarks
): NormalizedBenchmarks {
  return {
    // MRR Caps
    MRR_MONTH_6_MAX: dynamic.mrr_month_6_max || defaults.MRR_MONTH_6_MAX,
    MRR_MONTH_12_MAX: dynamic.mrr_month_12_max || defaults.MRR_MONTH_12_MAX,
    MRR_MONTH_24_MAX: dynamic.mrr_month_24_max || defaults.MRR_MONTH_24_MAX,
    
    // ARR Caps
    ARR_YEAR_1_MAX: dynamic.arr_year_1_max || defaults.ARR_YEAR_1_MAX,
    ARR_YEAR_2_MAX: dynamic.arr_year_2_max || defaults.ARR_YEAR_2_MAX,
    
    // Conversion
    USER_TO_PAYING_CONVERSION: dynamic.user_to_paying_conversion || defaults.USER_TO_PAYING_CONVERSION,
    TRIAL_TO_PAID_CONVERSION: defaults.TRIAL_TO_PAID_CONVERSION,
    
    // Growth constraints
    MAX_MONTHLY_GROWTH_RATE: dynamic.max_monthly_growth || defaults.MAX_MONTHLY_GROWTH_RATE,
    MAX_6_TO_12_MONTH_GROWTH: defaults.MAX_6_TO_12_MONTH_GROWTH,
    MAX_12_TO_24_MONTH_GROWTH: defaults.MAX_12_TO_24_MONTH_GROWTH,
    
    // ROI constraints
    ROI_YEAR_1_MIN: dynamic.roi_year_1_min ?? defaults.ROI_YEAR_1_MIN,
    ROI_YEAR_1_MAX: dynamic.roi_year_1_max ?? defaults.ROI_YEAR_1_MAX,
    ROI_YEAR_1_REALISTIC_MAX: dynamic.roi_year_1_realistic ?? defaults.ROI_YEAR_1_REALISTIC_MAX,
    
    // Break-even
    BREAK_EVEN_MIN_MONTHS: dynamic.break_even_min_months || defaults.BREAK_EVEN_MIN_MONTHS,
    BREAK_EVEN_REALISTIC_MONTHS: dynamic.break_even_realistic_months || defaults.BREAK_EVEN_REALISTIC_MONTHS,
    BREAK_EVEN_MAX_MONTHS: defaults.BREAK_EVEN_MAX_MONTHS,
    
    // Unit Economics (keep defaults as research doesn't provide these)
    LTV_CAC_MIN: defaults.LTV_CAC_MIN,
    LTV_CAC_MAX: defaults.LTV_CAC_MAX,
    PAYBACK_MIN_MONTHS: defaults.PAYBACK_MIN_MONTHS,
    PAYBACK_MAX_MONTHS: defaults.PAYBACK_MAX_MONTHS,
    
    // Churn
    CHURN_MIN_MONTHLY: defaults.CHURN_MIN_MONTHLY,
    CHURN_REALISTIC_MONTHLY: dynamic.churn_monthly_max || defaults.CHURN_REALISTIC_MONTHLY,
    CHURN_MAX_MONTHLY: dynamic.churn_monthly_max || defaults.CHURN_MAX_MONTHLY,
    
    // Metadata
    isFromResearch: true,
    sourceCount: dynamic.sources?.length || 0,
    confidence: dynamic.confidence || 'medium',
    marketType: dynamic.market_context?.market_type || 'b2b',
    industry: dynamic.market_context?.industry || 'general',
  };
}

/**
 * Get static benchmarks based on market type
 */
function getStaticBenchmarks(marketType: string): NormalizedBenchmarks {
  const typeKey = marketType?.toLowerCase() || 'b2b';
  const adjustments = MARKET_TYPE_ADJUSTMENTS[typeKey] || {};
  
  return {
    ...DEFAULT_BENCHMARKS,
    ...adjustments,
    marketType: typeKey,
  };
}

export interface UseBenchmarksResult {
  benchmarks: NormalizedBenchmarks;
  rawBenchmarks: BenchmarkSection | null;
  isFromResearch: boolean;
  sourceCount: number;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Hook to extract and normalize benchmark data from report
 */
export function useBenchmarks(
  benchmarkSection: unknown,
  marketType?: string
): UseBenchmarksResult {
  return useMemo(() => {
    // Try to parse dynamic benchmarks from report
    const parsed = parseBenchmarkSection(benchmarkSection);
    
    if (parsed) {
      // Use dynamic benchmarks from n8n research
      const defaults = getStaticBenchmarks(parsed.market_context?.market_type || marketType || 'b2b');
      const normalized = normalizeBenchmarks(parsed, defaults);
      
      return {
        benchmarks: normalized,
        rawBenchmarks: parsed,
        isFromResearch: true,
        sourceCount: parsed.sources?.length || 0,
        confidence: parsed.confidence || 'medium',
      };
    }
    
    // Fall back to static benchmarks
    const staticBenchmarks = getStaticBenchmarks(marketType || 'b2b');
    
    return {
      benchmarks: staticBenchmarks,
      rawBenchmarks: null,
      isFromResearch: false,
      sourceCount: 0,
      confidence: 'low',
    };
  }, [benchmarkSection, marketType]);
}

// Export default benchmarks for direct use in validation utils
export { DEFAULT_BENCHMARKS };
