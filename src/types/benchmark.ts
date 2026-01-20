// ============================================
// Benchmark Section Types
// Dynamic market benchmarks from n8n pipeline (Perplexity + OpenAI)
// ============================================

export interface BenchmarkARPURange {
  min: number;
  max: number;
}

export interface BenchmarkGrowthRange {
  min: number;
  max: number;
}

export interface BenchmarkMarketContext {
  market_type: string;
  industry: string;
  customer_types: string[];
  target_audience: string;
  market_size: string;
  region: string;
  product_stage: string;
  budget: string;
}

export interface BenchmarkSection {
  // MRR Caps (in dollars)
  mrr_month_6_max: number;
  mrr_month_12_max: number;
  mrr_month_24_max: number;
  
  // ARR Caps (in dollars)
  arr_year_1_max: number;
  arr_year_2_max: number;
  
  // Conversion & ARPU
  user_to_paying_conversion: number;  // e.g., 0.03 = 3%
  default_arpu: number;
  arpu_range: BenchmarkARPURange;
  
  // Churn (monthly percentage)
  churn_monthly_max: number;
  
  // Break-even (months)
  break_even_min_months: number;
  break_even_realistic_months: number;
  
  // ROI Year 1 (percentage, can be negative)
  roi_year_1_min: number;
  roi_year_1_max: number;
  roi_year_1_realistic: number;
  
  // Growth
  max_monthly_growth: number;  // e.g., 0.18 = 18%
  growth_rate_range: BenchmarkGrowthRange;
  
  // Market context from wizard
  market_context: BenchmarkMarketContext;
  
  // Source tracking
  sources: string[];
  sources_urls: string[];
  confidence: 'high' | 'medium' | 'low';
  fields_extracted?: number;
  fallback_used?: boolean;
  extraction_notes?: string;
  generated_at: string;
}

// ============================================
// Normalized benchmarks for internal use
// ============================================

export interface NormalizedBenchmarks {
  // MRR Caps
  MRR_MONTH_6_MAX: number;
  MRR_MONTH_12_MAX: number;
  MRR_MONTH_24_MAX: number;
  
  // ARR Caps
  ARR_YEAR_1_MAX: number;
  ARR_YEAR_2_MAX: number;
  
  // Conversion
  USER_TO_PAYING_CONVERSION: number;
  TRIAL_TO_PAID_CONVERSION: number;
  
  // Growth constraints
  MAX_MONTHLY_GROWTH_RATE: number;
  MAX_6_TO_12_MONTH_GROWTH: number;
  MAX_12_TO_24_MONTH_GROWTH: number;
  
  // ROI constraints
  ROI_YEAR_1_MIN: number;
  ROI_YEAR_1_MAX: number;
  ROI_YEAR_1_REALISTIC_MAX: number;
  
  // Break-even
  BREAK_EVEN_MIN_MONTHS: number;
  BREAK_EVEN_REALISTIC_MONTHS: number;
  BREAK_EVEN_MAX_MONTHS: number;
  
  // Unit Economics
  LTV_CAC_MIN: number;
  LTV_CAC_MAX: number;
  PAYBACK_MIN_MONTHS: number;
  PAYBACK_MAX_MONTHS: number;
  
  // Churn
  CHURN_MIN_MONTHLY: number;
  CHURN_REALISTIC_MONTHLY: number;
  CHURN_MAX_MONTHLY: number;
  
  // Metadata
  isFromResearch: boolean;
  sourceCount: number;
  confidence: 'high' | 'medium' | 'low';
  marketType: string;
  industry: string;
}
