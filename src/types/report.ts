// ============================================
// Report Types - TypeScript interfaces for database JSONB fields
// ============================================

import { Database } from "@/integrations/supabase/types";

// Type alias for the wizard row from the database
export type WizardRow = Database["public"]["Tables"]["tb_pms_wizard"]["Row"];

// Nested report data from tb_pms_reports (joined via wizard_id)
export interface NestedReportData {
  id: string;
  status: string;
  hero_score_section: {
    score?: number;
    tagline?: string;
    headline?: string;
  } | null;
  summary_section: {
    verdict?: string;
    verdict_headline?: string;
    verdict_summary?: string;
  } | null;
  opportunity_section: {
    tam_value?: string;
    som_value?: string;
    market_type?: string;
    market_growth_rate?: string;
  } | null;
}

// ReportRow extends WizardRow with nested report data and optional AI-generated fields
export type ReportRow = WizardRow & {
  // Nested report data from JOIN
  tb_pms_reports?: NestedReportData[];
  // AI-generated scores
  viability_score?: string | null;
  complexity_score?: string | null;
  timing_score?: string | null;
  risk_score?: string | null;
  differentiation_score?: string | null;
  pivot_readiness_score?: string | null;
  opportunity_score?: string | null;
  first_mover_score?: string | null;
  
  // Verdict
  verdict?: string | null;
  verdict_headline?: string | null;
  verdict_summary?: string | null;
  
  // Financial metrics
  investment_total_cents?: string | null;
  investment_one_payment_cents?: number | null;
  investment_front_cents?: number | null;
  investment_back_cents?: number | null;
  investment_integrations_cents?: number | null;
  investment_infra_cents?: number | null;
  investment_testing_cents?: number | null;
  break_even_months?: string | null;
  expected_roi_year1?: string | null;
  mrr_month12_cents?: string | null;
  arr_projected_cents?: string | null;
  ltv_cac_ratio?: string | null;
  generated_at?: string | null;
  
  // JSONB fields
  report_content?: unknown;
  key_metrics?: unknown;
  highlights?: unknown;
  risks?: unknown;
  market_opportunity?: unknown;
  competitors?: unknown;
  competitive_advantages?: unknown;
  investment_breakdown?: unknown;
  investment_included?: unknown;
  investment_not_included?: unknown;
  investment_comparison?: unknown;
  unit_economics?: unknown;
  financial_scenarios?: unknown;
  projection_data?: unknown;
  execution_timeline?: unknown;
  tech_stack?: unknown;
  demand_validation?: unknown;
  business_model?: unknown;
  go_to_market_preview?: unknown;
  quantified_differentiation?: unknown;
  timing_analysis?: unknown;
  pivot_scenarios?: unknown;
  success_metrics?: unknown;
  resource_requirements?: unknown;
  risk_quantification?: unknown;
  market_benchmarks?: unknown;
  uaicode_info?: unknown;
  next_steps?: unknown;
  marketing_four_ps?: unknown;
  marketing_paid_media_diagnosis?: unknown;
  marketing_paid_media_action_plan?: unknown;
  marketing_pricing_diagnosis?: unknown;
  marketing_pricing_action_plan?: unknown;
  marketing_growth_strategy?: unknown;
  marketing_competitive_advantages?: unknown;
  marketing_verdict?: unknown;
  assets_screen_mockups?: unknown;
  assets_brand_copy?: unknown;
  assets_brand_identity?: unknown;
  assets_logos?: unknown;
  assets_landing_page?: unknown;
  assets_mockup_previews?: unknown;
};

// ==========================================
// Key Metrics & Highlights
// ==========================================

export interface KeyMetrics {
  marketSize: string;
  marketLabel: string;
  expectedROI: string;
  roiLabel: string;
  paybackMonths: number;
  paybackLabel: string;
}

// ==========================================
// Opportunity Section (JSONB from n8n)
// ==========================================

export interface OpportunityHighlight {
  icon: string;
  text: string;
  detail: string;
}

export interface OpportunityRisk {
  risk: string;
  priority: "high" | "medium" | "low";
  mitigation: string;
}

export interface OpportunitySection {
  // === MARKET SIZE (Display Values) ===
  tam_value: string;
  sam_value: string;
  som_value: string;
  tam_description?: string;
  sam_description?: string;
  som_description?: string;
  tam_source?: string;
  tam_growth_rate?: string;
  sam_geographic_focus?: string;
  sam_addressable_percentage?: string;
  som_capture_percentage?: string;
  som_timeframe?: string;
  
  // === MARKET SIZE (Numeric for Calculations) ===
  tam_value_numeric?: number;
  sam_value_numeric?: number;
  som_value_numeric?: number;
  tam_growth_rate_numeric?: number;
  sam_addressable_percentage_numeric?: number;
  som_capture_percentage_numeric?: number;
  
  // === MARKET SIZE INSIGHTS ===
  market_size_insights?: {
    hierarchy_valid: boolean;
    sam_to_tam_ratio: number | null;
    som_to_sam_ratio: number | null;
    market_size_tier: 'massive' | 'large' | 'medium' | 'small';
  };
  
  // === DEMAND SIGNALS (Display) ===
  monthly_searches?: string;
  search_trend?: string;
  market_growth_rate: string;
  trends_score?: string;
  
  // === DEMAND SIGNALS (Numeric) ===
  monthly_searches_numeric?: number;
  market_growth_rate_numeric?: number;
  trends_score_numeric?: number;
  
  // === DEMAND EVIDENCE ===
  demand_evidence?: {
    online_reviews?: {
      volume: string;
      volume_numeric?: number;
      sentiment: string;
    };
    forum_discussions?: {
      volume: string;
      volume_numeric?: number;
      engagement: string;
    };
    social_mentions?: {
      monthly: string;
      monthly_numeric?: number;
      trend: string;
    };
    job_postings?: {
      monthly: string;
      monthly_numeric?: number;
      growth: string;
    };
  };
  
  // === CUSTOMER PAIN POINTS (Enhanced) ===
  customer_pain_points?: Array<{
    rank?: number;
    pain_point: string;
    intensity_score: string;
    intensity_numeric?: number;  // Pre-parsed 0-100 scale
    market_evidence: string;
  }>;
  
  // === PAIN POINTS STATISTICS ===
  pain_points_statistics?: {
    count: number;
    average_intensity: number;
    max_intensity: number;
    high_intensity_count: number;
  };
  
  // === TIMING ANALYSIS ===
  market_maturity?: string;
  current_trajectory?: string;
  projected_growth?: string;
  projected_growth_numeric?: number;
  saturation_level?: string;
  saturation_level_numeric?: number;
  optimal_window?: string;
  launch_reasoning?: string;
  opportunity_timeframe?: string;
  saturation_risk?: string;
  opportunity_justification?: string;
  
  // === RISK FACTORS ===
  risk_factors?: string[];
  
  // === MACRO TRENDS (Enhanced) ===
  macro_trends?: Array<{
    trend: string;
    impact: string;
    strength: string;
    strength_numeric?: number;  // Pre-parsed 0-100 scale
    evidence?: string;
  }>;
  
  // === TIMING INSIGHTS ===
  timing_insights?: {
    favorable_trends_count: number;
    average_trend_strength: number;
    risk_factors_count: number;
  };
  
  // === METADATA ===
  data_source?: string;
  parser_version?: string;
  analysis_timestamp?: string;
  
  // === DATA QUALITY ===
  data_quality?: {
    reliability_score: number;
    completeness: {
      market_size: boolean;
      demand_signals: boolean;
      pain_points: boolean;
      macro_trends: boolean;
      timing: boolean;
    };
    validation: {
      hierarchy_valid: boolean;
      all_numerics_parsed: boolean;
    };
  };
  
  // === LEGACY COMPATIBILITY ===
  highlights?: OpportunityHighlight[];
  risks?: OpportunityRisk[];
}

// ==========================================
// ICP Intelligence Section (from tb_pms_reports.icp_intelligence_section)
// ==========================================

export interface ICPPainPoint {
  pain_point: string;
  intensity_score: string;
  urgency_level: "high" | "medium" | "low";
  // n8n compatibility fields
  context?: string;
  rank?: number;
}

export interface ICPBuyingBehavior {
  budget_range: string;
  decision_timeframe: string;
  evaluation_criteria: string[];
  preferred_pricing_model: string;
}

export interface ICPPersonaSummary {
  name: string;
  job_title: string;
  company_size: string;
  industry_focus?: string;
  budget_range: string;
  decision_timeframe: string;
  top_pain_points: ICPPainPoint[];
  main_competitors: string[];
  key_features?: string[];
  top_evaluation_criteria?: string[];
  preferred_pricing_model?: string;
}

export interface ICPPersona {
  persona_name: string;
  job_title: string;
  company_size: string;
  industry_focus: string;
  pain_points_priority: ICPPainPoint[];
  buying_behavior: ICPBuyingBehavior;
  competitive_alternatives: string[];
  feature_priorities: string[];
  summary: ICPPersonaSummary;
  // n8n compatibility fields
  geographic_region?: string;
  tech_savviness?: number;
  responsibilities?: string[];
  gender?: string;
}

export interface ICPAggregatedInsights {
  top_pain_points_all: Array<{
    pain_point: string;
    intensity_score: string;
    intensity_numeric?: number;
    urgency_level: string;
  }>;
  budget_ranges: string[];
  decision_timeframes: string[];
  competitive_threats: string[];
  total_personas_identified?: number;
}

export interface ICPMarketInsights {
  highest_value_segment: string;
  total_addressable_personas: string;
  market_size_per_persona?: Record<string, string>;
}

export interface ICPIntelligenceSection {
  primary_personas: ICPPersona[];
  aggregated_insights: ICPAggregatedInsights;
  market_insights: ICPMarketInsights;
  citations?: string[];
  // n8n metadata fields
  data_source?: string;
  generated_at?: string;
  confidence_score?: string;
  // Legacy compatibility fields (n8n sends duplicated flat structure)
  persona?: {
    name?: string;
    persona_name?: string;
    role?: string;
    job_title?: string;
    tech_savviness?: number;
    responsibilities?: string[];
    gender?: string;
    age_range?: string;
    persona_summary?: string;
  };
  demographics?: {
    company_size?: string;
    income_or_company_size?: string;
    industry?: string;
    location?: string;
    geographic_region?: string;
    decision_authority?: string;
    growth_phase?: string;
  };
  pain_points?: Array<{
    pain_point: string;
    intensity_score: string;
    urgency_level: string;
    context?: string;
    rank?: number;
  }>;
  buying_triggers?: string[];
  preferred_channels?: {
    research?: string[];
    social?: string[];
    events?: string[];
  };
  messaging_hooks?: {
    value_propositions?: string[];
    terminology?: string[];
    objections?: string[];
  };
  budget_timeline?: {
    typical_budget?: string;
    decision_timeline?: string;
    stakeholders?: string[];
  };
}

// ==========================================
// Growth Intelligence Section (from tb_pms_reports.growth_intelligence_section)
// ==========================================

export interface GrowthTargetMetrics {
  mrr: string;                    // "$35,000-55,000"
  arr: string;                    // "$420,000-660,000"
  customers: string;              // "650-1,000"
  churn: string;                  // "<8%"
  activation?: string;            // "30-40%"
  nps?: string;                   // "40-50"
  market_share?: string;          // "0.02-0.04%"
  expansion_revenue?: string;     // "$150,000-250,000"
  gross_margins?: string;         // "40-50%"
}

// New format from n8n v1.7.0+ with _raw numeric data
export interface GrowthTargetPeriod extends GrowthTargetMetrics {
  notes?: string;
  _raw?: {
    customer_min?: number;
    customer_max?: number;
    mrr_min?: number;
    mrr_max?: number;
    arr_min?: number;
    arr_max?: number;
    activation_min?: number;
    activation_max?: number;
  };
}

export interface GrowthIntelligenceSection {
  growth_targets?: {
    // Legacy format (for backwards compatibility)
    six_month_targets?: GrowthTargetMetrics;
    twelve_month_targets?: GrowthTargetMetrics;
    twenty_four_month_targets?: GrowthTargetMetrics;
    // New format from n8n (numeric keys)
    "6_month"?: GrowthTargetPeriod;
    "12_month"?: GrowthTargetPeriod;
    "24_month"?: GrowthTargetPeriod;
  };
  monetization?: {
    pricing_strategy: string;
    recommended_model?: string;
    upsell_opportunities?: string[];
  };
  engagement?: {
    activation_metric?: string;
    onboarding_insights?: {
      time_to_value_target: string;
      steps?: Array<{ step: number; action: string; timing: string }>;
    };
    retention_strategies?: string[];
  };
  aemr_framework?: unknown;
  assumptions?: unknown;
  
  // Pre-calculated financial metrics from n8n v1.7.0+
  // v1.8.0+: Includes consolidated unit economics (arpu_used, ltv_used, cac_used, etc.)
  financial_metrics?: {
    mrr_month_6: number;
    mrr_month_12: number;
    mrr_month_24: number;
    arr_year_1: number;
    arr_year_2: number;
    mrr_month_6_formatted: string;
    mrr_month_12_formatted: string;
    mrr_month_24_formatted: string;
    arr_year_1_formatted: string;
    arr_year_2_formatted: string;
    growth_rate_6_to_12: number;
    growth_rate_12_to_24: number;
    customer_growth_y2: number;
    roi_year_1: number;
    roi_year_2: number;
    roi_year_1_formatted: string;
    roi_year_2_formatted: string;
    break_even_months: number;
    payback_months: number;
    ltv_cac_ratio: number;
    // Consolidated from unit_economics_used (v1.8.0+)
    arpu_used: number;
    monthly_churn_used: number;
    ltv_used: number;
    cac_used: number;
    ltv_cac_ratio_target: number;  // Added in v1.8.0
  };
  
  customer_metrics?: {
    customers_month_6: number;
    customers_month_12: number;
    customers_month_24: number;
    customer_growth_rate_y2: number;
  };
  
  // Pre-generated projection data from n8n v1.7.0+
  projection_data?: Array<{
    month: string;
    revenue: number;
    costs: number;
    cumulative: number;
  }>;
  
  // Pre-generated scenarios from n8n v1.7.0+
  financial_scenarios?: Array<{
    name: string;
    mrrMonth12: number;
    arrYear1: number;
    breakEven: number;
    probability: string;
  }>;
  
  // Pre-generated year evolution from n8n v1.7.0+
  year_evolution?: Array<{
    year: string;
    arr: string;
    arrNumeric: number;
    mrr: string;
    mrrNumeric: number;
    customers: number;
  }>;
  
  competitive_advantages?: Array<{
    advantage: string;
    competitor_gap: string;
    impact: string;
  }>;
  
  citations?: string[];
  
  
  benchmark_comparison?: {
    mrr_6_vs_benchmark: string;
    mrr_12_vs_benchmark: string;
    mrr_24_vs_benchmark: string;
    arr_y1_vs_benchmark: string;
    arr_y2_vs_benchmark: string;
    benchmarks_used: Record<string, number>;
  };
  
  _metadata?: {
    parsed_at: string;
    parser_version: string;
    perplexity_model: string;
    input_arpu: number;
    validation_passed: boolean;
    missing_fields: string[];
    raw_inputs_echo: Record<string, unknown>;
    calculator_version: string;
    calculated_at: string;
    investment_used: number;
    marketing_budget_monthly: number;
  };
  
  _validation?: {
    was_adjusted: boolean;
    warnings: string[];
    validation_passed: boolean;
    benchmark_source: string;
    benchmark_confidence: string;
  };
}

// ==========================================
// Paid Media Intelligence Section (from tb_pms_reports.paid_media_intelligence_section)
// ==========================================

/** Pre-calculated metrics from n8n pipeline */
export interface PaidMediaCalculatedMetrics {
  competitive_position?: {
    label: string;           // "Strong" | "Moderate" | "Emerging"
    percent: number;         // 0-100
    gaps_count: number;      // Number of exploitable gaps
  };
  expected_roas_percent?: number;  // 300 = 3.0x
}

export interface PaidMediaIntelligenceSection {
  performance_targets?: {
    target_cac?: string;                    // "$231"
    ltv_cac_ratio_target?: string;          // "4.5:1"
    target_roas?: string;                   // "3.0x"
    cpc_benchmark?: string;                 // "$3.08"
    ctr_benchmark?: string;                 // "2.0%"
    conversion_rate_benchmark?: string;     // "3.5%"
  };
  budget_strategy?: {
    recommended_marketing_budget_monthly?: string;  // "$12,000"
    budget_rationale?: string;
    channel_allocation?: Record<string, string>;
    scaling_triggers?: string[];
  };
  channel_recommendations?: Array<{
    channel?: string;
    priority?: string;
    expected_cac?: string;
    monthly_budget?: string;                // "$1.2K"
    notes?: string;
  }>;
  competitive_positioning?: {
    market_gaps_to_exploit?: string[];
    messaging_angles?: string[];
    differentiation_hooks?: string[];
  };
  ninety_day_plan?: {
    phase_1?: {
      focus?: string;
      channels?: string[];
      budget_allocation?: string;
      kpis?: string[];
    };
    phase_2?: {
      focus?: string;
      channels?: string[];
      budget_allocation?: string;
      kpis?: string[];
    };
    phase_3?: {
      focus?: string;
      channels?: string[];
      budget_allocation?: string;
      kpis?: string[];
    };
  };
  
  /** Pre-calculated metrics from n8n (eliminates frontend calculations) */
  calculated_metrics?: PaidMediaCalculatedMetrics;
  
  _metadata?: {
    citations?: string[];
    citations_count?: number;
    raw_values?: {
      target_cac?: number;
      ltv_cac_ratio?: number;
      budget_monthly?: number | string;  // Supports "$5,600" or 5600
    };
    // Versioning and provenance
    parser_version?: string;
    calculator_version?: string;
    calculated_at?: string;
    input_type?: string;
    perplexity_model?: string;
    perplexity_cost?: number;
  };
}

// ==========================================
// Hero Score Section (from tb_pms_reports.hero_score_section)
// ==========================================

export interface HeroScoreSection {
  score?: number;           // Score de 0 a 100
  tagline?: string;         // Frase descritiva abaixo do score
  score_label?: string;     // Label opcional (ex: "Viability Score")
  generated_at?: string;    // Timestamp de quando foi gerado
}

// ==========================================
// Summary Section (from tb_pms_reports.summary_section)
// ==========================================

export interface SummarySection {
  verdict?: string;           // Recomendação principal (ex: "Proceed with Development")
  verdict_summary?: string;   // Texto do resumo executivo (parágrafos separados por \n\n)
  generated_at?: string;      // Timestamp de quando foi gerado
}

// ==========================================
// Price Intelligence Section (from Perplexity research via n8n)
// ==========================================

export interface PriceIntelligenceUnitEconomics {
  recommended_arpu: number;
  weighted_arpu: number;
  ltv: number;
  lifetime_months: number;
  monthly_churn: number;
  annual_churn: number;
  ltv_cac_ratio_target: number;
  max_cac: number;
  payback_months: number;
  gross_margin_target: number;
  data_sources: {
    arpu: string;
    churn: string;
    ltv: string;
    ltv_cac: string;
  };
}

export interface PriceIntelligencePricingModel {
  model: string;
  market_share: number;
  trend: 'growing' | 'stable' | 'declining';
  best_for: string;
}

export interface PriceIntelligenceMarketOverview {
  market_average_price: number;
  price_range_observed: { min: number; max: number };
  pricing_models: PriceIntelligencePricingModel[];
  price_elasticity: {
    sensitivity: 'low' | 'medium' | 'high';
    floor: number;
    ceiling: number;
    sweet_spot: number;
    increase_tolerance: number;
    value_drivers: string[];
  };
  annual_vs_monthly: {
    typical_discount: number;
    discount_range: { min: number; max: number };
    annual_adoption_rate: number;
  };
  conversion_benchmarks: {
    trial_to_paid: number;
    freemium_to_paid: number;
    visitor_to_trial: number;
  };
}

export interface PriceIntelligenceTier {
  name: string;
  price_monthly: number;
  price_annually: number;
  features: string[];
  expected_distribution_percent: number;
  target_segment: string;
  recommended: boolean;
}

export interface PriceIntelligenceFreemiumStrategy {
  recommended: boolean;
  conversion_target: number;
  free_features: string[];
  upgrade_triggers: string[];
  limitations: string[];
}

export interface PriceIntelligenceTrialStrategy {
  duration_days: number;
  require_credit_card: boolean;
  expected_conversion: number;
  tactics: string[];
}

export interface PriceIntelligenceSection {
  unit_economics: PriceIntelligenceUnitEconomics;
  market_overview: PriceIntelligenceMarketOverview;
  recommended_tiers: PriceIntelligenceTier[];
  recommended_model: string;
  price_positioning: 'Value Leader' | 'Market Parity' | 'Premium';
  freemium_strategy: PriceIntelligenceFreemiumStrategy;
  trial_strategy: PriceIntelligenceTrialStrategy;
  annual_discount_recommended: number;
  research_data?: {
    perplexity_arpu?: { min: number; max: number; median: number };
    perplexity_churn?: { low: number; typical: number; high: number };
    competitor_prices?: { min: number; max: number; avg: number };
    icp_budget?: { min: number; max: number; mid: number };
  };
  _metadata?: {
    calculated_at: string;
    calculator_version: string;
    input_completeness: number;
    data_sources: { primary: string; enrichment: string[] };
    citations: string[];
    citations_count: number;
  };
}

// Report data from tb_pms_reports table (simplified - legacy columns removed)
export interface ReportData {
  id: string;
  wizard_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  // JSONB fields containing all data (primary sources)
  section_investment: unknown | null;
  opportunity_section: unknown | null;
  competitive_analysis_section: unknown | null;
  icp_intelligence_section: unknown | null;
  paid_media_intelligence_section: unknown | null;
  price_intelligence_section: unknown | null;
  growth_intelligence_section: unknown | null;
  hero_score_section: unknown | null;
  summary_section: unknown | null;
  // Market benchmarks from n8n research pipeline
  benchmark_section: unknown | null;
  // Business Plan document (from n8n Business Plan AI pipeline)
  business_plan_section: unknown | null;
  // Generated avatar URL
  icp_avatar_url: string | null;
}

// Helper function to safely get value with fallback
export const safeValue = (value: string | null | undefined, fallback = "..."): string => {
  return value?.trim() || fallback;
};

/**
 * Safely convert any value to a number, handling scientific notation strings
 * This is critical for Supabase JSONB which may return large numbers as "1.45e+07"
 */
export const safeNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) return fallback;
  const num = typeof value === 'string' ? Number(value) : Number(value);
  return isNaN(num) ? fallback : num;
};

// ==========================================
// Feature Tier Helpers
// ==========================================

export const FEATURE_TIERS = {
  starter: ['auth', 'profiles', 'crud', 'reporting', 'notifications', 'admin', 'responsive', 'security'],
  growth: ['advancedAnalytics', 'apiIntegrations', 'payments', 'roles', 'search', 'fileUpload', 'realtime', 'workflows', 'advancedReporting', 'emailMarketing'],
  enterprise: ['ai', 'dataAnalytics', 'multiTenant', 'sso', 'customIntegrations', 'apiManagement', 'collaboration', 'automation', 'customReporting', 'support']
};

export function countFeaturesByTier(selectedFeatures: string[]): { starter: number; growth: number; enterprise: number } {
  return {
    starter: selectedFeatures.filter(f => FEATURE_TIERS.starter.includes(f)).length,
    growth: selectedFeatures.filter(f => FEATURE_TIERS.growth.includes(f)).length,
    enterprise: selectedFeatures.filter(f => FEATURE_TIERS.enterprise.includes(f)).length,
  };
}

export function determineMvpTier(selectedFeatures: string[]): 'starter' | 'growth' | 'enterprise' {
  const counts = countFeaturesByTier(selectedFeatures);
  if (counts.enterprise > 0) return 'enterprise';
  if (counts.growth > 0) return 'growth';
  return 'starter';
}

export interface Highlight {
  icon: string;
  text: string;
  detail: string;
}

export interface Risk {
  risk: string;
  priority: "high" | "medium" | "low";
  mitigation: string;
}

// ==========================================
// Market Opportunity
// ==========================================

export interface MarketOpportunity {
  tam: { value: string; label: string; description: string };
  sam: { value: string; label: string; description: string };
  som: { value: string; label: string; description: string };
  growthRate: string;
  growthLabel: string;
  conclusion: string;
}

// ==========================================
// Competitors & Competitive Advantages
// ==========================================

export interface Competitor {
  name: string;
  description: string;
  price: number;
  priceModel: string;
  weakness: string;
  yourAdvantage: string;
}

export interface CompetitiveAdvantage {
  advantage: string;
  description: string;
  competitorGap: string;
}

// ==========================================
// Investment
// ==========================================

export interface InvestmentBreakdownItem {
  name: string;
  value: number;
  percentage: number;
}

export interface InvestmentBreakdown {
  total: number;
  currency: string;
  breakdown: InvestmentBreakdownItem[];
  included: string[];
  notIncluded: string[];
  comparison: {
    traditional: number;
    savings: string;
    note: string;
  };
}

export interface InvestmentIncluded {
  items: string[];
}

export interface InvestmentNotIncluded {
  items: string[];
}

export interface InvestmentComparison {
  traditional: number;
  savings: string;
  note: string;
}

// ==========================================
// Unit Economics & Financial Scenarios
// ==========================================

export interface UnitEconomics {
  idealTicket: number;
  paybackPeriod: number;
  ltv: number;
  ltvMonths: number;
  cac: number;
  ltvCacRatio: number;
  monthlyChurn: string;
  grossMargin: string;
  howItWorks: string;
}

export interface FinancialScenario {
  name: string;
  mrrMonth12: number;
  arrYear1: number;
  breakEven: number;
  probability: string;
}

export interface ProjectionDataPoint {
  month: string;
  revenue: number;
  costs: number;
  cumulative: number;
}

// ==========================================
// Execution & Tech Stack
// ==========================================

export interface ExecutionPhase {
  phase: number;
  name: string;
  duration: string;
  description: string;
  deliverables: string[];
  icon?: string;
}

export interface TechStackCategory {
  category: string;
  items: string[];
}

// ==========================================
// Demand Validation
// ==========================================

export interface PainPoint {
  pain: string;
  intensity: number;
  source: string;
}

export interface Evidence {
  type: string;
  count: number;
  sentiment?: string;
  growth?: string;
  opportunity: string;
}

export interface ValidationMethod {
  method: string;
  cost: string;
  timeframe: string;
  description: string;
}

export interface DemandValidation {
  searchVolume: number;
  trendsScore: number;
  growthRate: string;
  painPoints: PainPoint[];
  evidences: Evidence[];
  validationMethods: ValidationMethod[];
  conclusion: string;
}

// ==========================================
// Business Model
// ==========================================

export interface RevenueStream {
  name: string;
  percentage: number;
  mrr: number;
  type: string;
  icon?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  features: number;
  targetCustomers: string;
  conversionRate?: string;
  recommended?: boolean;
}

export interface MonetizationTimelineItem {
  month: number;
  stream: string;
  status: string;
  note: string;
}

export interface BusinessModel {
  primaryModel: string;
  modelType: string;
  revenueStreams: RevenueStream[];
  pricingTiers: PricingTier[];
  monetizationTimeline: MonetizationTimelineItem[];
  conclusion: string;
}

// ==========================================
// Go-to-Market Preview
// ==========================================

export interface GTMChannel {
  name: string;
  roi: number;
  timeToResults: string;
  priority: number;
  effort: string;
}

export interface QuickWin {
  action: string;
  impact: string;
  effort: string;
  description: string;
}

export interface GoToMarketPreview {
  primaryChannel: string;
  launchStrategy: string;
  channels: GTMChannel[];
  quickWins: QuickWin[];
  first90Days: { day: number; milestone: string; metric: string }[];
}

// ==========================================
// Quantified Differentiation
// ==========================================

export interface DifferentiationMetric {
  metric: string;
  yours: string;
  competitors: string;
  advantage: string;
  source: string;
}

export interface QuantifiedDifferentiation {
  metrics: DifferentiationMetric[];
  overallAdvantage: string;
}

// ==========================================
// Timing Analysis
// ==========================================

export interface MacroTrend {
  trend: string;
  impact: string;
  relevance: string;
}

export interface WindowOfOpportunity {
  opens: string;
  closes: string;
  reasoning: string;
}

export interface TimingAnalysis {
  score: number;
  verdict: string;
  macroTrends: MacroTrend[];
  windowOfOpportunity: WindowOfOpportunity;
  firstMoverAdvantage: string[];
}

// ==========================================
// Pivot Scenarios
// ==========================================

export interface PivotScenario {
  trigger: string;
  description: string;
  newDirection: string;
  estimatedPivotTime: string;
  successProbability: string;
}

export interface PivotScenarios {
  readinessScore: number;
  scenarios: PivotScenario[];
}

// ==========================================
// Success Metrics
// ==========================================

export interface SuccessMetric {
  metric: string;
  target: string;
  timeframe: string;
  priority: string;
  category: string;
}

export interface SuccessMetrics {
  northStar: string;
  metrics: SuccessMetric[];
}

// ==========================================
// Resource Requirements
// ==========================================

export interface FounderTimePhase {
  phase: string;
  hoursPerWeek: number;
  description: string;
}

export interface TeamMember {
  role: string;
  hireMonth: number;
  cost: string;
  critical: boolean;
}

export interface CriticalSkill {
  skill: string;
  importance: string;
  alternative: string;
}

export interface ExternalSupport {
  service: string;
  cost: string;
  when: string;
}

export interface ResourceRequirements {
  founderTimePhases: FounderTimePhase[];
  teamTimeline: TeamMember[];
  criticalSkills: CriticalSkill[];
  externalSupport: ExternalSupport[];
  totalExternalCost: string;
}

// ==========================================
// Risk Quantification
// ==========================================

export interface QuantifiedRisk {
  risk: string;
  probability: string;
  impact: string;
  expectedLoss: string;
  mitigation: string;
  mitigationCost: string;
}

export interface RiskQuantification {
  overallRiskScore: number;
  risks: QuantifiedRisk[];
}

// ==========================================
// Market Benchmarks
// ==========================================

export interface MarketBenchmark {
  metric: string;
  industryAverage: string;
  topQuartile: string;
  yourTarget: string;
  status: string;
}

export interface MarketBenchmarks {
  benchmarks: MarketBenchmark[];
  conclusion: string;
}

// ==========================================
// Uaicode Info
// ==========================================

export interface Testimonial {
  name: string;
  company: string;
  avatar: string;
  quote: string;
  role: string;
}

export interface Differential {
  icon: string;
  title: string;
  description: string;
}

export interface UaicodeInfo {
  successRate: number;
  projectsDelivered: number;
  avgDeliveryWeeks: number;
  differentials: Differential[];
  testimonials: Testimonial[];
  guarantees: string[];
}

// ==========================================
// Next Steps
// ==========================================

export interface NextStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface NextSteps {
  verdictSummary: string;
  steps: NextStep[];
  cta: {
    primary: string;
    secondary: string;
  };
  contact: {
    email: string;
    whatsapp: string;
    calendly: string;
  };
}

// ==========================================
// Marketing - 4Ps Analysis
// ==========================================

export interface FourPsProduct {
  features: string[];
  quality: string;
  support: string;
  differentiators: string[];
  score: number;
}

export interface FourPsPrice {
  model: string;
  range: string;
  averageTicket: string;
  discounts: string;
  flexibility: string;
  score: number;
}

export interface FourPsPlace {
  channels: string[];
  markets: string[];
  digitalPresence: number;
  distribution: string;
  coverage: string;
  score: number;
}

export interface FourPsPromotion {
  channels: string[];
  estimatedAdSpend: string;
  tone: string;
  socialFollowers: string;
  contentStrategy: string;
  score: number;
}

export interface FourPsCompetitor {
  competitor: string;
  logo: string;
  product: FourPsProduct;
  price: FourPsPrice;
  place: FourPsPlace;
  promotion: FourPsPromotion;
}

export interface MarketingFourPs {
  competitors: FourPsCompetitor[];
}

// ==========================================
// Marketing - Paid Media
// ==========================================

export interface PaidMediaPlatform {
  name: string;
  status: string;
  spend: string;
}

export interface PaidMediaCompetitor {
  name: string;
  platforms: PaidMediaPlatform[];
  adTypes: string[];
  frequency: string;
  estimatedBudget: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export interface MarketGap {
  gap: string;
  opportunity: string;
  priority: string;
}

export interface MarketingPaidMediaDiagnosis {
  competitors: PaidMediaCompetitor[];
  marketGaps: MarketGap[];
  overallAssessment: string;
}

export interface PaidMediaChannel {
  name: string;
  allocation: number;
  budget: string;
  priority: number;
  expectedROAS: string;
  focus: string;
  keyMetrics: string[];
}

export interface PaidMediaCampaign {
  phase: string;
  duration: string;
  budgetAllocation: number;
  objective: string;
  channels: string[];
  kpis: string[];
  creatives: string[];
}

export interface Creative {
  type: string;
  format: string;
  platforms: string[];
  quantity: string;
  themes: string[];
}

export interface MarketingPaidMediaActionPlan {
  totalBudget: string;
  channels: PaidMediaChannel[];
  campaigns: PaidMediaCampaign[];
  creatives: Creative[];
  timeline: { week: string; action: string; deliverables: string[]; milestone: string }[];
  expectedResults: {
    month3: Record<string, string | number>;
    month6: Record<string, string | number>;
  };
}

// ==========================================
// Marketing - Pricing
// ==========================================

export interface PriceMapItem {
  competitor: string;
  position: string;
  price: string;
  model: string;
  targetMarket: string;
  valueProposition: string;
}

export interface PricingModel {
  type: string;
  prevalence: number;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export interface PricingGap {
  range: string;
  description: string;
  opportunity: string;
  priority: string;
}

export interface MarketingPricingDiagnosis {
  priceMap: PriceMapItem[];
  models: PricingModel[];
  gaps: PricingGap[];
  elasticity: {
    assessment: string;
    insight: string;
    recommendations: string[];
  };
  competitorPriceComparison: Record<string, string>[];
}

export interface PricingTierAction {
  name: string;
  price: string;
  annualDiscount: string;
  features: string[];
  targetCustomer: string;
  conversion: string;
  recommended?: boolean;
}

export interface MarketingPricingActionPlan {
  recommendedModel: string;
  rationale: string;
  tiers: PricingTierAction[];
  psychologicalPricing: { tactic: string; application: string; impact: string }[];
  launchStrategy: { phase: string; pricing: string; duration: string; goal: string }[];
}

// ==========================================
// Marketing - Growth Strategy
// ==========================================

export interface GrowthChannel {
  channel: string;
  stage: string;
  priority: number;
  budget: string;
  expectedCAC: string;
  expectedLTV: string;
  tactics: string[];
}

export interface MarketingGrowthStrategy {
  model: string;
  phases: { name: string; focus: string; duration: string; goals: string[] }[];
  channels: GrowthChannel[];
  kpis: { metric: string; month3: string; month6: string; month12: string }[];
}

// ==========================================
// Marketing - Competitive Advantages
// ==========================================

export interface MarketingCompetitiveAdvantage {
  advantage: string;
  description: string;
  competitorGap: string;
  marketingAngle: string;
}

export interface MarketingCompetitiveAdvantages {
  advantages: MarketingCompetitiveAdvantage[];
}

// ==========================================
// Marketing - Verdict
// ==========================================

export interface MarketingVerdict {
  recommendation: string;
  score: number;
  riskLevel: string;
  keyFindings: { finding: string; score: number }[];
  opportunities: { opportunity: string; score: number }[];
  risks: { risk: string; action: string; description: string }[];
}

// ==========================================
// Brand Assets - Screen Mockups
// ==========================================

export interface ScreenMockup {
  name: string;
  description: string;
  category: string;
  features: string[];
  device: string;
  imageUrl?: string;
}

export interface AssetsScreenMockups {
  mockups: ScreenMockup[];
}

// ==========================================
// Brand Assets - Brand Copy
// ==========================================

export interface AssetsBrandCopy {
  brandName: string;
  valueProposition: string;
  elevatorPitch: string;
  voiceTone: { trait: string; description: string }[];
  taglines: string[];
  keyMessages: string[];
  ctaExamples: string[];
  emailSubjectLines: string[];
}

// ==========================================
// Brand Assets - Brand Identity
// ==========================================

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface Typography {
  font: string;
  usage: string;
  weight: string;
}

export interface AssetsBrandIdentity {
  primaryColors: BrandColor[];
  secondaryColors: BrandColor[];
  typography: {
    headings: Typography;
    body: Typography;
    mono: Typography;
  };
  typographyScale: { name: string; size: string }[];
  logoUsage: {
    minSize: string;
    clearSpace: string;
    backgrounds: string[];
  };
  spacing: {
    base: string;
    containerMax: string;
  };
  borderRadius: { name: string; value: string }[];
}

// ==========================================
// Brand Assets - Logos
// ==========================================

export interface LogoVariant {
  variant: string;
  description: string;
  usage: string;
  colors: {
    icon: string;
    text?: string;
  };
}

export interface AssetsLogos {
  suggestions: LogoVariant[];
}

// ==========================================
// Brand Assets - Landing Page
// ==========================================

export interface LandingPageSection {
  name: string;
  description: string;
  keyElements: string[];
}

export interface AssetsLandingPage {
  sections: LandingPageSection[];
  conversionElements: string[];
  downloadNote: string;
}

// ==========================================
// Brand Assets - Mockup Previews
// ==========================================

export interface MockupPreview {
  type: string;
  description: string;
  specs: string;
}

export interface AssetsMockupPreviews {
  previews: MockupPreview[];
}

// ==========================================
// MVP Tier Pricing
// ==========================================

export interface MvpTier {
  id: string;
  tier_id: string;
  tier_name: string;
  min_price_cents: number;
  max_price_cents: number;
  traditional_min_cents: number;
  traditional_max_cents: number;
  min_days: number;
  max_days: number;
  traditional_min_days: number;
  traditional_max_days: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// Note: FEATURE_TIERS, countFeaturesByTier, and determineMvpTier 
// are now defined near the top of this file (after safeNumber)

// Helper to calculate dynamic price based on features using proportional interpolation
export function calculateDynamicPrice(
  selectedFeatures: string[],
  tier: MvpTier
): { min: number; max: number; calculated: number } {
  const tierId = determineMvpTier(selectedFeatures);
  
  // Count features only in the determined tier category
  const tierFeatures = FEATURE_TIERS[tierId];
  const totalFeaturesInTier = tierFeatures.length;
  const selectedInTier = selectedFeatures.filter(f => tierFeatures.includes(f)).length;
  
  // Proportional formula: min when 1 feature, max when all features
  let calculatedCents: number;
  
  if (selectedInTier <= 1) {
    calculatedCents = tier.min_price_cents;
  } else if (selectedInTier >= totalFeaturesInTier) {
    calculatedCents = tier.max_price_cents;
  } else {
    // Linear interpolation
    const ratio = (selectedInTier - 1) / (totalFeaturesInTier - 1);
    calculatedCents = tier.min_price_cents + 
      (tier.max_price_cents - tier.min_price_cents) * ratio;
  }
  
  return {
    min: tier.min_price_cents,
    max: tier.max_price_cents,
    calculated: Math.round(calculatedCents)
  };
}

// ==========================================
// Business Plan Section (from n8n Business Plan AI pipeline)
// ==========================================

export interface BusinessPlanChartsData {
  market_sizing?: {
    tam: string;
    sam: string;
    som: string;
  };
  financial_projections?: {
    month_6_mrr: string;
    year_1_arr: string;
    year_2_arr: string;
  };
  competitor_pricing?: Array<{
    name: string;
    min_price: number;
    max_price: number;
  }>;
  investment_breakdown?: Array<{
    category: string;
    amount: number;
  }>;
  // Roadmap Timeline for Product Strategy section
  roadmap_timeline?: Array<{
    phase: string;      // e.g., "Phase 1: MVP"
    focus: string;      // Brief description of phase focus
    timeline: string;   // e.g., "13-23 weeks"
    outcomes: string[]; // Key outcomes/deliverables
  }>;
}

export interface BusinessPlanSection {
  title: string;
  subtitle: string;
  generated_at: string;
  viability_score: number;
  viability_label: string;
  markdown_content: string;
  charts_data: BusinessPlanChartsData;
  word_count: number;
}

// ==========================================
// Helper function to safely cast JSONB data
// ==========================================

export function safeJsonCast<T>(data: unknown, defaultValue: T): T {
  if (data === null || data === undefined) {
    return defaultValue;
  }
  return data as T;
}
