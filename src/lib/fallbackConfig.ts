/**
 * Fallback Configuration for Smart Fallback Agent
 * Defines validation rules, search types, and static fallbacks for 50+ fields
 */

export type ExpectedType = "string" | "number" | "array" | "object";
export type Priority = "critical" | "high" | "medium" | "low";
export type PerplexitySearchType = 
  | "market_size" 
  | "market_growth" 
  | "market_timing"
  | "market_opportunity"
  | "market_saturation"
  | "customer_research"
  | "market_trends"
  | "market_risks"
  | "competitor_analysis"
  | "pricing_analysis"
  | "market_gaps"
  | "feature_analysis"
  | "persona_research"
  | "pain_point_research"
  | "budget_research"
  | "market_segment"
  | "market_sizing"
  | "cac_benchmark"
  | "ltv_cac_ratio"
  | "marketing_budget"
  | "pricing_strategy"
  | "pricing_positioning"
  | "pricing_tiers"
  | "arpu_benchmark"
  | "ltv_benchmark"
  | "payback_benchmark"
  | "growth_projection"
  | "acquisition_channels"
  | "gtm_strategy"
  | "viability_assessment"
  | "viability_summary"
  | "viability_tagline"
  | "breakeven_analysis"
  | "roi_projection"
  | "viability_verdict"
  | "executive_summary";

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  mustContain?: string[];
  mustNotContain?: string[];
  reasonableRange?: { min: number; max: number };
  mustBeLessThan?: string; // field path to compare
  mustBeGreaterThan?: string; // field path to compare
  enumValues?: string[];
  minItems?: number;
  maxItems?: number;
  hasRequiredKeys?: string[];
}

export interface FallbackFieldConfig {
  sectionName: string;
  fieldDescription: string;
  fieldPurpose: string;
  expectedType: ExpectedType;
  expectedFormat?: string;
  perplexitySearchType: PerplexitySearchType;
  validationRules: ValidationRules;
  priority: Priority;
  staticFallback: unknown;
}

/**
 * Complete configuration for all dashboard fields that may need intelligent fallbacks
 */
export const FALLBACK_CONFIG: Record<string, FallbackFieldConfig> = {
  // ==========================================
  // MARKET OPPORTUNITY SECTION (opportunity_section)
  // ==========================================
  
  "opportunity_section.tam_value": {
    sectionName: "Market Opportunity",
    fieldDescription: "Total Addressable Market (TAM) - the total market demand for a product or service globally",
    fieldPurpose: "Shows the maximum revenue opportunity if 100% market share is achieved",
    expectedType: "string",
    expectedFormat: "$X.XB or $XXX.XM (e.g., '$4.2B' or '$850M')",
    perplexitySearchType: "market_size",
    validationRules: {
      minLength: 3,
      mustContain: ["$"],
      reasonableRange: { min: 1000000, max: 10000000000000 } // $1M to $10T
    },
    priority: "critical",
    staticFallback: "$..."
  },

  "opportunity_section.sam_value": {
    sectionName: "Market Opportunity",
    fieldDescription: "Serviceable Addressable Market (SAM) - the segment of TAM targeted by products/services within geographic reach",
    fieldPurpose: "Shows the realistic market the product can target based on geographic and segment constraints",
    expectedType: "string",
    expectedFormat: "$X.XB or $XXX.XM (e.g., '$1.2B' or '$450M')",
    perplexitySearchType: "market_size",
    validationRules: {
      minLength: 3,
      mustContain: ["$"],
      mustBeLessThan: "opportunity_section.tam_value",
      reasonableRange: { min: 100000, max: 1000000000000 }
    },
    priority: "critical",
    staticFallback: "$..."
  },

  "opportunity_section.som_value": {
    sectionName: "Market Opportunity",
    fieldDescription: "Serviceable Obtainable Market (SOM) - the realistic portion of SAM that can be captured",
    fieldPurpose: "Shows the realistic revenue target considering competition and resources",
    expectedType: "string",
    expectedFormat: "$X.XM or $XXX.XK (e.g., '$120M' or '$25M')",
    perplexitySearchType: "market_size",
    validationRules: {
      minLength: 3,
      mustContain: ["$"],
      mustBeLessThan: "opportunity_section.sam_value",
      reasonableRange: { min: 10000, max: 100000000000 }
    },
    priority: "critical",
    staticFallback: "$..."
  },

  "opportunity_section.market_growth_rate": {
    sectionName: "Market Opportunity",
    fieldDescription: "Annual market growth rate (CAGR) for the target industry",
    fieldPurpose: "Indicates market momentum and future potential",
    expectedType: "string",
    expectedFormat: "X.X% or XX% (e.g., '12.5%' or '8%')",
    perplexitySearchType: "market_growth",
    validationRules: {
      minLength: 2,
      mustContain: ["%"],
      reasonableRange: { min: -20, max: 100 }
    },
    priority: "high",
    staticFallback: "...%"
  },

  "opportunity_section.optimal_window": {
    sectionName: "Market Opportunity",
    fieldDescription: "The optimal time window for market entry based on trends and competition",
    fieldPurpose: "Helps determine the best timing for product launch",
    expectedType: "string",
    expectedFormat: "Text description (e.g., 'Next 6-12 months' or 'Q2 2025')",
    perplexitySearchType: "market_timing",
    validationRules: {
      minLength: 10,
      maxLength: 200
    },
    priority: "medium",
    staticFallback: "Optimal window to be determined"
  },

  "opportunity_section.launch_reasoning": {
    sectionName: "Market Opportunity",
    fieldDescription: "Reasoning for the recommended launch timing based on market conditions",
    fieldPurpose: "Provides strategic context for timing decisions",
    expectedType: "string",
    expectedFormat: "Paragraph explaining timing rationale",
    perplexitySearchType: "market_timing",
    validationRules: {
      minLength: 50,
      maxLength: 500
    },
    priority: "medium",
    staticFallback: "Launch timing rationale pending analysis"
  },

  "opportunity_section.opportunity_justification": {
    sectionName: "Market Opportunity",
    fieldDescription: "Justification for the market opportunity score and assessment",
    fieldPurpose: "Explains why the market presents a good or challenging opportunity",
    expectedType: "string",
    expectedFormat: "Detailed paragraph with market reasoning",
    perplexitySearchType: "market_opportunity",
    validationRules: {
      minLength: 50,
      maxLength: 600
    },
    priority: "high",
    staticFallback: "Market opportunity justification pending analysis"
  },

  "opportunity_section.saturation_level": {
    sectionName: "Market Opportunity",
    fieldDescription: "Current market saturation level indicating competitive density",
    fieldPurpose: "Helps assess ease of market entry and competition level",
    expectedType: "string",
    expectedFormat: "One of: 'low', 'medium', 'high'",
    perplexitySearchType: "market_saturation",
    validationRules: {
      enumValues: ["low", "medium", "high", "Low", "Medium", "High"]
    },
    priority: "high",
    staticFallback: "medium"
  },

  "opportunity_section.customer_pain_points": {
    sectionName: "Market Opportunity",
    fieldDescription: "Key customer pain points with intensity scores and market evidence",
    fieldPurpose: "Identifies primary problems the product should solve",
    expectedType: "array",
    expectedFormat: "[{pain_point: string, intensity_score: number, market_evidence: string}]",
    perplexitySearchType: "customer_research",
    validationRules: {
      minItems: 3,
      maxItems: 10
    },
    priority: "critical",
    staticFallback: []
  },

  "opportunity_section.macro_trends": {
    sectionName: "Market Opportunity",
    fieldDescription: "Macro-level market trends affecting the industry",
    fieldPurpose: "Provides context on external factors influencing the market",
    expectedType: "array",
    expectedFormat: "[{trend: string, impact: string, strength: string, evidence: string}]",
    perplexitySearchType: "market_trends",
    validationRules: {
      minItems: 3,
      maxItems: 8
    },
    priority: "high",
    staticFallback: []
  },

  "opportunity_section.risk_factors": {
    sectionName: "Market Opportunity",
    fieldDescription: "Key risk factors that could affect market success",
    fieldPurpose: "Identifies potential challenges and threats to consider",
    expectedType: "array",
    expectedFormat: "Array of risk description strings",
    perplexitySearchType: "market_risks",
    validationRules: {
      minItems: 2,
      maxItems: 10
    },
    priority: "high",
    staticFallback: []
  },

  // ==========================================
  // COMPETITIVE ANALYSIS SECTION (competitive_analysis_section)
  // ==========================================

  "competitive_analysis_section.competitors": {
    sectionName: "Competitive Analysis",
    fieldDescription: "Detailed analysis of key competitors in the market",
    fieldPurpose: "Maps the competitive landscape for strategic positioning",
    expectedType: "object",
    expectedFormat: "Record<string, {name, website, pricing, strengths[], weaknesses[], marketShare}>",
    perplexitySearchType: "competitor_analysis",
    validationRules: {
      hasRequiredKeys: ["name"]
    },
    priority: "critical",
    staticFallback: {}
  },

  "competitive_analysis_section.average_pricing_range": {
    sectionName: "Competitive Analysis",
    fieldDescription: "Average pricing range in the competitive market",
    fieldPurpose: "Provides benchmark for pricing strategy",
    expectedType: "string",
    expectedFormat: "$X-$Y/month or $X-$Y/year (e.g., '$29-$99/month')",
    perplexitySearchType: "pricing_analysis",
    validationRules: {
      minLength: 5,
      mustContain: ["$"]
    },
    priority: "high",
    staticFallback: "$...-$.../month"
  },

  "competitive_analysis_section.market_gaps_identified": {
    sectionName: "Competitive Analysis",
    fieldDescription: "Gaps in the market not addressed by current competitors",
    fieldPurpose: "Identifies opportunities for differentiation",
    expectedType: "array",
    expectedFormat: "Array of market gap description strings",
    perplexitySearchType: "market_gaps",
    validationRules: {
      minItems: 2,
      maxItems: 8
    },
    priority: "high",
    staticFallback: []
  },

  "competitive_analysis_section.common_features": {
    sectionName: "Competitive Analysis",
    fieldDescription: "Features commonly offered by competitors",
    fieldPurpose: "Establishes baseline feature expectations",
    expectedType: "array",
    expectedFormat: "Array of feature name strings",
    perplexitySearchType: "feature_analysis",
    validationRules: {
      minItems: 3,
      maxItems: 15
    },
    priority: "medium",
    staticFallback: []
  },

  "competitive_analysis_section.market_saturation_level": {
    sectionName: "Competitive Analysis",
    fieldDescription: "Saturation level based on competitive analysis",
    fieldPurpose: "Indicates difficulty of market entry",
    expectedType: "string",
    expectedFormat: "One of: 'low', 'medium', 'high'",
    perplexitySearchType: "market_saturation",
    validationRules: {
      enumValues: ["low", "medium", "high", "Low", "Medium", "High"]
    },
    priority: "medium",
    staticFallback: "medium"
  },

  // ==========================================
  // ICP INTELLIGENCE SECTION (icp_intelligence_section)
  // ==========================================

  "icp_intelligence_section.primary_personas": {
    sectionName: "ICP Intelligence",
    fieldDescription: "Primary customer personas with demographics and behaviors",
    fieldPurpose: "Defines ideal customer profiles for targeting",
    expectedType: "array",
    expectedFormat: "Array of ICPPersona objects with name, role, pain_points, budget, etc.",
    perplexitySearchType: "persona_research",
    validationRules: {
      minItems: 1,
      maxItems: 5
    },
    priority: "critical",
    staticFallback: []
  },

  "icp_intelligence_section.aggregated_insights.top_pain_points_all": {
    sectionName: "ICP Intelligence",
    fieldDescription: "Aggregated top pain points across all personas",
    fieldPurpose: "Prioritizes problems to solve in product development",
    expectedType: "array",
    expectedFormat: "Array of {pain_point: string, frequency: number, severity: string}",
    perplexitySearchType: "pain_point_research",
    validationRules: {
      minItems: 3,
      maxItems: 10
    },
    priority: "high",
    staticFallback: []
  },

  "icp_intelligence_section.aggregated_insights.budget_ranges": {
    sectionName: "ICP Intelligence",
    fieldDescription: "Budget ranges customers are willing to pay",
    fieldPurpose: "Informs pricing tier decisions",
    expectedType: "array",
    expectedFormat: "Array of budget range strings (e.g., '$50-$100/month')",
    perplexitySearchType: "budget_research",
    validationRules: {
      minItems: 1,
      maxItems: 5
    },
    priority: "high",
    staticFallback: []
  },

  "icp_intelligence_section.aggregated_insights.competitive_threats": {
    sectionName: "ICP Intelligence",
    fieldDescription: "Competitive threats identified from ICP research",
    fieldPurpose: "Highlights what competitors are doing well",
    expectedType: "array",
    expectedFormat: "Array of competitive threat description strings",
    perplexitySearchType: "competitor_analysis",
    validationRules: {
      minItems: 2,
      maxItems: 8
    },
    priority: "medium",
    staticFallback: []
  },

  "icp_intelligence_section.market_insights.highest_value_segment": {
    sectionName: "ICP Intelligence",
    fieldDescription: "The highest value customer segment to target",
    fieldPurpose: "Prioritizes which segment to focus marketing on",
    expectedType: "string",
    expectedFormat: "Description of the highest value segment",
    perplexitySearchType: "market_segment",
    validationRules: {
      minLength: 10,
      maxLength: 300
    },
    priority: "high",
    staticFallback: "Highest value segment to be determined"
  },

  "icp_intelligence_section.market_insights.total_addressable_personas": {
    sectionName: "ICP Intelligence",
    fieldDescription: "Estimated total number of addressable personas/customers",
    fieldPurpose: "Quantifies the target market size in terms of customers",
    expectedType: "string",
    expectedFormat: "Number or range (e.g., '500K-1M' or '2.5M')",
    perplexitySearchType: "market_sizing",
    validationRules: {
      minLength: 2
    },
    priority: "medium",
    staticFallback: "..."
  },

  // ==========================================
  // PAID MEDIA INTELLIGENCE SECTION (paid_media_intelligence_section)
  // ==========================================

  "paid_media_intelligence_section.performance_targets.target_cac": {
    sectionName: "Paid Media Intelligence",
    fieldDescription: "Target Customer Acquisition Cost based on industry benchmarks",
    fieldPurpose: "Sets budget expectations for customer acquisition",
    expectedType: "string",
    expectedFormat: "$X-$Y (e.g., '$50-$150')",
    perplexitySearchType: "cac_benchmark",
    validationRules: {
      minLength: 3,
      mustContain: ["$"]
    },
    priority: "high",
    staticFallback: "$...-$..."
  },

  "paid_media_intelligence_section.performance_targets.ltv_cac_ratio_target": {
    sectionName: "Paid Media Intelligence",
    fieldDescription: "Target LTV:CAC ratio for healthy unit economics",
    fieldPurpose: "Ensures sustainable customer economics",
    expectedType: "string",
    expectedFormat: "X:1 (e.g., '3:1' or '4:1')",
    perplexitySearchType: "ltv_cac_ratio",
    validationRules: {
      minLength: 3,
      mustContain: [":"]
    },
    priority: "high",
    staticFallback: "3:1"
  },

  "paid_media_intelligence_section.budget_strategy.recommended_marketing_budget_monthly": {
    sectionName: "Paid Media Intelligence",
    fieldDescription: "Recommended monthly marketing budget",
    fieldPurpose: "Guides initial marketing investment",
    expectedType: "string",
    expectedFormat: "$X,XXX or $XX,XXX (e.g., '$5,000' or '$15,000')",
    perplexitySearchType: "marketing_budget",
    validationRules: {
      minLength: 3,
      mustContain: ["$"]
    },
    priority: "high",
    staticFallback: "$..."
  },

  // ==========================================
  // PRICE INTELLIGENCE SECTION (price_intelligence_section)
  // ==========================================

  "price_intelligence_section.recommended_pricing.pricing_strategy": {
    sectionName: "Price Intelligence",
    fieldDescription: "Recommended pricing strategy based on market analysis",
    fieldPurpose: "Defines the overall pricing approach",
    expectedType: "string",
    expectedFormat: "Strategy description (e.g., 'Value-based tiered pricing with freemium')",
    perplexitySearchType: "pricing_strategy",
    validationRules: {
      minLength: 20,
      maxLength: 300
    },
    priority: "high",
    staticFallback: "Pricing strategy to be determined"
  },

  "price_intelligence_section.recommended_pricing.positioning": {
    sectionName: "Price Intelligence",
    fieldDescription: "Price positioning relative to market",
    fieldPurpose: "Defines competitive price positioning",
    expectedType: "string",
    expectedFormat: "One of: 'low', 'mid', 'premium'",
    perplexitySearchType: "pricing_positioning",
    validationRules: {
      enumValues: ["low", "mid", "premium", "Low", "Mid", "Premium", "budget", "value", "enterprise"]
    },
    priority: "medium",
    staticFallback: "mid"
  },

  "price_intelligence_section.recommended_pricing.tiers": {
    sectionName: "Price Intelligence",
    fieldDescription: "Recommended pricing tiers with features and prices",
    fieldPurpose: "Defines the product pricing structure",
    expectedType: "array",
    expectedFormat: "Array of {name, price, features[], target_segment}",
    perplexitySearchType: "pricing_tiers",
    validationRules: {
      minItems: 2,
      maxItems: 5
    },
    priority: "high",
    staticFallback: []
  },

  "price_intelligence_section.revenue_projections.avg_revenue_per_user": {
    sectionName: "Price Intelligence",
    fieldDescription: "Average Revenue Per User (ARPU)",
    fieldPurpose: "Key metric for revenue forecasting",
    expectedType: "string",
    expectedFormat: "$X or $X.XX (e.g., '$49' or '$129.99')",
    perplexitySearchType: "arpu_benchmark",
    validationRules: {
      minLength: 2,
      mustContain: ["$"]
    },
    priority: "high",
    staticFallback: "$..."
  },

  "price_intelligence_section.revenue_projections.customer_lifetime_value": {
    sectionName: "Price Intelligence",
    fieldDescription: "Customer Lifetime Value (LTV/CLV)",
    fieldPurpose: "Determines how much to invest in customer acquisition",
    expectedType: "string",
    expectedFormat: "$X,XXX (e.g., '$2,500')",
    perplexitySearchType: "ltv_benchmark",
    validationRules: {
      minLength: 3,
      mustContain: ["$"]
    },
    priority: "critical",
    staticFallback: "$..."
  },

  "price_intelligence_section.revenue_projections.payback_period": {
    sectionName: "Price Intelligence",
    fieldDescription: "Customer acquisition payback period",
    fieldPurpose: "Shows how quickly marketing investment is recovered",
    expectedType: "string",
    expectedFormat: "X months (e.g., '3 months' or '6-8 months')",
    perplexitySearchType: "payback_benchmark",
    validationRules: {
      minLength: 3,
      mustContain: ["month"]
    },
    priority: "high",
    staticFallback: "... months"
  },

  // ==========================================
  // GROWTH INTELLIGENCE SECTION (growth_intelligence_section)
  // ==========================================

  "growth_intelligence_section.growth_targets.six_month_targets": {
    sectionName: "Growth Intelligence",
    fieldDescription: "6-month growth targets including users, revenue, and metrics",
    fieldPurpose: "Sets short-term growth milestones",
    expectedType: "object",
    expectedFormat: "{users, mrr, arr, growth_rate}",
    perplexitySearchType: "growth_projection",
    validationRules: {
      hasRequiredKeys: ["users", "mrr"]
    },
    priority: "high",
    staticFallback: { users: "...", mrr: "$...", arr: "$..." }
  },

  "growth_intelligence_section.growth_targets.twelve_month_targets": {
    sectionName: "Growth Intelligence",
    fieldDescription: "12-month growth targets including users, revenue, and metrics",
    fieldPurpose: "Sets medium-term growth milestones",
    expectedType: "object",
    expectedFormat: "{users, mrr, arr, growth_rate}",
    perplexitySearchType: "growth_projection",
    validationRules: {
      hasRequiredKeys: ["users", "mrr"]
    },
    priority: "high",
    staticFallback: { users: "...", mrr: "$...", arr: "$..." }
  },

  "growth_intelligence_section.growth_targets.twenty_four_month_targets": {
    sectionName: "Growth Intelligence",
    fieldDescription: "24-month growth targets including users, revenue, and metrics",
    fieldPurpose: "Sets long-term growth milestones",
    expectedType: "object",
    expectedFormat: "{users, mrr, arr, growth_rate}",
    perplexitySearchType: "growth_projection",
    validationRules: {
      hasRequiredKeys: ["users", "mrr"]
    },
    priority: "medium",
    staticFallback: { users: "...", mrr: "$...", arr: "$..." }
  },

  "growth_intelligence_section.acquisition.primary_channels": {
    sectionName: "Growth Intelligence",
    fieldDescription: "Primary customer acquisition channels recommended",
    fieldPurpose: "Guides marketing channel strategy",
    expectedType: "array",
    expectedFormat: "Array of channel names (e.g., ['SEO', 'Content Marketing', 'LinkedIn Ads'])",
    perplexitySearchType: "acquisition_channels",
    validationRules: {
      minItems: 2,
      maxItems: 8
    },
    priority: "high",
    staticFallback: []
  },

  "growth_intelligence_section.acquisition.go_to_market_phases": {
    sectionName: "Growth Intelligence",
    fieldDescription: "Go-to-market phases with activities and timelines",
    fieldPurpose: "Provides a structured launch and growth plan",
    expectedType: "array",
    expectedFormat: "Array of {phase_name, duration, activities[], goals[]}",
    perplexitySearchType: "gtm_strategy",
    validationRules: {
      minItems: 3,
      maxItems: 6
    },
    priority: "high",
    staticFallback: []
  },

  // ==========================================
  // SECTION INVESTMENT (section_investment)
  // ==========================================

  "section_investment.viability_score": {
    sectionName: "Investment Analysis",
    fieldDescription: "Overall viability score for the SaaS idea (0-100)",
    fieldPurpose: "Summarizes the overall assessment of the business idea",
    expectedType: "number",
    expectedFormat: "Number between 0 and 100",
    perplexitySearchType: "viability_assessment",
    validationRules: {
      reasonableRange: { min: 0, max: 100 }
    },
    priority: "critical",
    staticFallback: 0
  },

  "section_investment.verdict_headline": {
    sectionName: "Investment Analysis",
    fieldDescription: "Headline summarizing the viability verdict",
    fieldPurpose: "Provides a quick summary of the assessment",
    expectedType: "string",
    expectedFormat: "Concise headline (e.g., 'High viability with strong market fit')",
    perplexitySearchType: "viability_summary",
    validationRules: {
      minLength: 20,
      maxLength: 150
    },
    priority: "high",
    staticFallback: "Viability assessment pending"
  },

  "section_investment.break_even_months": {
    sectionName: "Investment Analysis",
    fieldDescription: "Estimated months to break even",
    fieldPurpose: "Shows financial runway expectations",
    expectedType: "string",
    expectedFormat: "X months (e.g., '12 months' or '8-10 months')",
    perplexitySearchType: "breakeven_analysis",
    validationRules: {
      minLength: 3,
      mustContain: ["month"]
    },
    priority: "high",
    staticFallback: "... months"
  },

  "section_investment.expected_roi": {
    sectionName: "Investment Analysis",
    fieldDescription: "Expected Return on Investment",
    fieldPurpose: "Shows potential financial returns",
    expectedType: "string",
    expectedFormat: "X% or X-Y% (e.g., '250%' or '150-300%')",
    perplexitySearchType: "roi_projection",
    validationRules: {
      minLength: 2,
      mustContain: ["%"]
    },
    priority: "high",
    staticFallback: "...%"
  },

  // ==========================================
  // HERO SCORE SECTION (hero_score_section)
  // ==========================================

  "hero_score_section.score": {
    sectionName: "Hero Score",
    fieldDescription: "Main viability score displayed prominently (0-100)",
    fieldPurpose: "Primary visual indicator of business viability",
    expectedType: "number",
    expectedFormat: "Number between 0 and 100",
    perplexitySearchType: "viability_assessment",
    validationRules: {
      reasonableRange: { min: 0, max: 100 }
    },
    priority: "critical",
    staticFallback: 0
  },

  "hero_score_section.tagline": {
    sectionName: "Hero Score",
    fieldDescription: "Tagline summarizing the viability assessment",
    fieldPurpose: "Provides immediate context for the score",
    expectedType: "string",
    expectedFormat: "Short impactful sentence (20-100 characters)",
    perplexitySearchType: "viability_tagline",
    validationRules: {
      minLength: 20,
      maxLength: 100
    },
    priority: "high",
    staticFallback: "Viability assessment in progress"
  },

  // ==========================================
  // SUMMARY SECTION (summary_section)
  // ==========================================

  "summary_section.verdict": {
    sectionName: "Executive Summary",
    fieldDescription: "Final verdict on the SaaS idea",
    fieldPurpose: "Provides the definitive assessment recommendation",
    expectedType: "string",
    expectedFormat: "One of: 'highly_recommended', 'recommended', 'conditional', 'not_recommended'",
    perplexitySearchType: "viability_verdict",
    validationRules: {
      enumValues: ["highly_recommended", "recommended", "conditional", "not_recommended", "go", "caution", "no_go"]
    },
    priority: "critical",
    staticFallback: "conditional"
  },

  "summary_section.verdict_summary": {
    sectionName: "Executive Summary",
    fieldDescription: "Detailed summary of the verdict with key reasoning",
    fieldPurpose: "Provides context and rationale for the verdict",
    expectedType: "string",
    expectedFormat: "Detailed paragraph (100-500 characters)",
    perplexitySearchType: "executive_summary",
    validationRules: {
      minLength: 100,
      maxLength: 600
    },
    priority: "high",
    staticFallback: "Executive summary pending comprehensive analysis"
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get all fields that belong to a specific section
 */
export function getFieldsForSection(sectionName: string): string[] {
  return Object.entries(FALLBACK_CONFIG)
    .filter(([_, config]) => config.sectionName === sectionName)
    .map(([fieldPath]) => fieldPath);
}

/**
 * Get all critical priority fields
 */
export function getCriticalFields(): string[] {
  return Object.entries(FALLBACK_CONFIG)
    .filter(([_, config]) => config.priority === "critical")
    .map(([fieldPath]) => fieldPath);
}

/**
 * Get configuration for a specific field
 */
export function getFieldConfig(fieldPath: string): FallbackFieldConfig | undefined {
  return FALLBACK_CONFIG[fieldPath];
}

/**
 * Check if a value needs a fallback (null, undefined, empty, or placeholder)
 * IMPORTANT: Valid numbers (including 0) do NOT need fallback
 */
export function requiresFallback(value: unknown): boolean {
  // Null/undefined need fallback
  if (value === null || value === undefined) return true;
  
  // Valid numbers do NOT need fallback (including 0)
  if (typeof value === "number" && !isNaN(value)) return false;
  
  // Check strings for placeholder values
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === "..." || trimmed === "$..." || trimmed === "...%") return true;
    if (trimmed.startsWith("...") || trimmed.endsWith("...")) return true;
    // Non-empty, non-placeholder strings don't need fallback
    return false;
  }
  
  // Empty arrays need fallback
  if (Array.isArray(value) && value.length === 0) return true;
  // Non-empty arrays don't need fallback
  if (Array.isArray(value) && value.length > 0) return false;
  
  // Empty objects need fallback
  if (typeof value === "object" && Object.keys(value as object).length === 0) return true;
  // Non-empty objects don't need fallback
  if (typeof value === "object" && Object.keys(value as object).length > 0) return false;
  
  return true;
}

/**
 * Get all field paths grouped by section
 */
export function getFieldsBySection(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  
  Object.entries(FALLBACK_CONFIG).forEach(([fieldPath, config]) => {
    if (!grouped[config.sectionName]) {
      grouped[config.sectionName] = [];
    }
    grouped[config.sectionName].push(fieldPath);
  });
  
  return grouped;
}

/**
 * Get static fallback value for a field
 */
export function getStaticFallback(fieldPath: string): unknown {
  return FALLBACK_CONFIG[fieldPath]?.staticFallback ?? null;
}
