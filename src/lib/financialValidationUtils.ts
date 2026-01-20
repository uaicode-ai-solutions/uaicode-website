// ============================================
// Financial Validation Utilities
// Ensures projections align with SaaS B2B market benchmarks
// Now supports dynamic benchmarks from n8n research pipeline
// ============================================

import { MoneyRange, PercentageRange } from "./financialParsingUtils";
import { NormalizedBenchmarks } from "@/types/benchmark";

// ============================================
// Default Market Benchmarks for SaaS B2B
// Used as fallback when no dynamic benchmarks available
// ============================================
export const MARKET_BENCHMARKS: NormalizedBenchmarks = {
  // New SaaS realistic MRR progression
  MRR_MONTH_6_MAX: 100000,      // $100K MRR at 6 months is exceptional
  MRR_MONTH_12_MAX: 300000,     // $300K MRR at 12 months is top decile
  MRR_MONTH_24_MAX: 1000000,    // $1M MRR at 24 months is exceptional
  
  // Annual Revenue caps
  ARR_YEAR_1_MAX: 2500000,      // $2.5M ARR Year 1 is top 5%
  ARR_YEAR_2_MAX: 8000000,      // $8M ARR Year 2 is exceptional
  
  // Conversion benchmarks
  USER_TO_PAYING_CONVERSION: 0.35,    // 35% of users become paying customers
  TRIAL_TO_PAID_CONVERSION: 0.25,     // 25% trial-to-paid for B2B SaaS
  
  // Growth rate constraints
  MAX_MONTHLY_GROWTH_RATE: 0.25,      // Max 25% MoM for new SaaS
  MAX_6_TO_12_MONTH_GROWTH: 2.0,      // Max 2x from 6m to 12m
  MAX_12_TO_24_MONTH_GROWTH: 3.0,     // Max 3x from 12m to 24m
  
  // ROI constraints (Year 1)
  ROI_YEAR_1_MIN: -100,               // Can't lose more than invested
  ROI_YEAR_1_MAX: 150,                // 150% ROI Year 1 is exceptional
  ROI_YEAR_1_REALISTIC_MAX: 80,       // 80% ROI is realistic for strong execution
  
  // Break-even constraints
  BREAK_EVEN_MIN_MONTHS: 8,           // B2B SaaS rarely breaks even < 8 months
  BREAK_EVEN_REALISTIC_MONTHS: 18,    // 18 months is typical
  BREAK_EVEN_MAX_MONTHS: 36,          // 36+ months is concerning
  
  // Unit Economics
  LTV_CAC_MIN: 2.0,                   // Below 2:1 is concerning
  LTV_CAC_MAX: 8.0,                   // Above 8:1 needs verification
  PAYBACK_MIN_MONTHS: 4,              // B2B SaaS rarely has < 4 month payback
  PAYBACK_MAX_MONTHS: 24,             // 24+ months is concerning
  
  // Churn benchmarks (monthly)
  CHURN_MIN_MONTHLY: 0.5,             // 0.5% monthly = 6% annual (exceptional)
  CHURN_REALISTIC_MONTHLY: 3.0,       // 3% monthly = 30% annual (B2B SMB)
  CHURN_MAX_MONTHLY: 8.0,             // 8% monthly = 60% annual (concerning)
  
  // Metadata (static fallback)
  isFromResearch: false,
  sourceCount: 0,
  confidence: 'low',
  marketType: 'b2b',
  industry: 'general',
};

/**
 * Get benchmarks to use for validation
 * Uses dynamic benchmarks if provided, otherwise falls back to defaults
 */
export function getBenchmarks(dynamicBenchmarks?: Partial<NormalizedBenchmarks> | null): NormalizedBenchmarks {
  if (!dynamicBenchmarks) return MARKET_BENCHMARKS;
  
  return {
    ...MARKET_BENCHMARKS,
    ...dynamicBenchmarks,
  };
}

// ============================================
// Validation Result Types
// ============================================
export interface ValidationResult<T> {
  value: T;
  wasAdjusted: boolean;
  originalValue: T;
  adjustmentReason: string | null;
  warnings: string[];
}

export interface FinancialValidationWarnings {
  mrrAdjusted: boolean;
  arrAdjusted: boolean;
  roiAdjusted: boolean;
  growthRateAdjusted: boolean;
  allWarnings: string[];
}

// ============================================
// MRR Validation Functions
// ============================================

/**
 * Validate MRR based on user count and conversion rate
 * Ensures MRR is realistic given the number of users
 */
export function validateMRRVsUsers(
  mrr: number,
  users: number,
  arpu: number = 200,
  benchmarks: NormalizedBenchmarks = MARKET_BENCHMARKS
): ValidationResult<number> {
  const warnings: string[] = [];
  
  // Calculate expected MRR based on users × conversion × ARPU
  const payingCustomers = Math.floor(users * benchmarks.USER_TO_PAYING_CONVERSION);
  const expectedMRR = payingCustomers * arpu;
  
  // If reported MRR is more than 2x expected, cap it
  const maxReasonableMRR = expectedMRR * 2;
  
  if (mrr > maxReasonableMRR && users > 0) {
    warnings.push(
      `MRR $${mrr.toLocaleString()} adjusted to $${maxReasonableMRR.toLocaleString()} ` +
      `based on ${users} users × ${benchmarks.USER_TO_PAYING_CONVERSION * 100}% conversion × $${arpu} ARPU`
    );
    
    return {
      value: maxReasonableMRR,
      wasAdjusted: true,
      originalValue: mrr,
      adjustmentReason: `MRR too high for ${users} users`,
      warnings,
    };
  }
  
  return {
    value: mrr,
    wasAdjusted: false,
    originalValue: mrr,
    adjustmentReason: null,
    warnings,
  };
}

/**
 * Validate MRR progression across time periods
 * Ensures growth rates are realistic
 */
export function validateMRRProgression(
  mrr6: number | null,
  mrr12: number | null,
  mrr24: number | null,
  benchmarks: NormalizedBenchmarks = MARKET_BENCHMARKS
): ValidationResult<{ mrr6: number; mrr12: number; mrr24: number }> {
  const warnings: string[] = [];
  let adjusted = false;
  
  // Start with provided values or estimates
  let validMrr6 = mrr6 ?? 0;
  let validMrr12 = mrr12 ?? 0;
  let validMrr24 = mrr24 ?? 0;
  
  // Cap absolute values using dynamic benchmarks
  if (validMrr6 > benchmarks.MRR_MONTH_6_MAX) {
    warnings.push(`MRR 6m capped from $${validMrr6.toLocaleString()} to $${benchmarks.MRR_MONTH_6_MAX.toLocaleString()}`);
    validMrr6 = benchmarks.MRR_MONTH_6_MAX;
    adjusted = true;
  }
  
  if (validMrr12 > benchmarks.MRR_MONTH_12_MAX) {
    warnings.push(`MRR 12m capped from $${validMrr12.toLocaleString()} to $${benchmarks.MRR_MONTH_12_MAX.toLocaleString()}`);
    validMrr12 = benchmarks.MRR_MONTH_12_MAX;
    adjusted = true;
  }
  
  if (validMrr24 > benchmarks.MRR_MONTH_24_MAX) {
    warnings.push(`MRR 24m capped from $${validMrr24.toLocaleString()} to $${benchmarks.MRR_MONTH_24_MAX.toLocaleString()}`);
    validMrr24 = benchmarks.MRR_MONTH_24_MAX;
    adjusted = true;
  }
  
  // Validate growth rate 6m → 12m (max 2x)
  if (validMrr6 > 0 && validMrr12 > validMrr6 * benchmarks.MAX_6_TO_12_MONTH_GROWTH) {
    const maxMrr12 = validMrr6 * benchmarks.MAX_6_TO_12_MONTH_GROWTH;
    warnings.push(`MRR 12m growth rate adjusted: ${((validMrr12 / validMrr6 - 1) * 100).toFixed(0)}% → ${((maxMrr12 / validMrr6 - 1) * 100).toFixed(0)}%`);
    validMrr12 = maxMrr12;
    adjusted = true;
  }
  
  // Validate growth rate 12m → 24m (max 3x)
  if (validMrr12 > 0 && validMrr24 > validMrr12 * benchmarks.MAX_12_TO_24_MONTH_GROWTH) {
    const maxMrr24 = validMrr12 * benchmarks.MAX_12_TO_24_MONTH_GROWTH;
    warnings.push(`MRR 24m growth rate adjusted: ${((validMrr24 / validMrr12 - 1) * 100).toFixed(0)}% → ${((maxMrr24 / validMrr12 - 1) * 100).toFixed(0)}%`);
    validMrr24 = maxMrr24;
    adjusted = true;
  }
  
  // If 6m is missing, estimate from 12m
  if (validMrr6 === 0 && validMrr12 > 0) {
    validMrr6 = validMrr12 * 0.4; // 6m is typically 40% of 12m
  }
  
  // If 24m is missing, estimate from 12m
  if (validMrr24 === 0 && validMrr12 > 0) {
    validMrr24 = validMrr12 * 2.5; // 24m is typically 2.5x of 12m
  }
  
  return {
    value: { mrr6: validMrr6, mrr12: validMrr12, mrr24: validMrr24 },
    wasAdjusted: adjusted,
    originalValue: { mrr6: mrr6 ?? 0, mrr12: mrr12 ?? 0, mrr24: mrr24 ?? 0 },
    adjustmentReason: adjusted ? 'MRR progression adjusted to realistic growth rates' : null,
    warnings,
  };
}

/**
 * Validate ARR projection
 * Ensures Year 1 ARR is within realistic bounds
 */
export function validateARR(
  arr: number, 
  year: 1 | 2,
  benchmarks: NormalizedBenchmarks = MARKET_BENCHMARKS
): ValidationResult<number> {
  const warnings: string[] = [];
  const maxARR = year === 1 ? benchmarks.ARR_YEAR_1_MAX : benchmarks.ARR_YEAR_2_MAX;
  
  if (arr > maxARR) {
    warnings.push(`Year ${year} ARR $${(arr / 1000000).toFixed(1)}M capped to $${(maxARR / 1000000).toFixed(1)}M (market benchmark)`);
    
    return {
      value: maxARR,
      wasAdjusted: true,
      originalValue: arr,
      adjustmentReason: `Year ${year} ARR exceeds market benchmark`,
      warnings,
    };
  }
  
  return {
    value: arr,
    wasAdjusted: false,
    originalValue: arr,
    adjustmentReason: null,
    warnings,
  };
}

// ============================================
// ROI Validation
// ============================================

/**
 * Calculate and validate realistic ROI
 * Includes S-curve growth and proper cost modeling
 */
export function calculateValidatedROI(
  mrr6: number,
  mrr12: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  marginPercent: number = 0.65,
  benchmarks: NormalizedBenchmarks = MARKET_BENCHMARKS
): ValidationResult<number> {
  const warnings: string[] = [];
  
  // Calculate realistic Year 1 revenue with S-curve interpolation
  let totalRevenue = 0;
  
  for (let month = 1; month <= 12; month++) {
    let monthMRR: number;
    
    if (month <= 6) {
      // Linear interpolation from 0 to mrr6
      monthMRR = mrr6 * (month / 6);
    } else {
      // Linear interpolation from mrr6 to mrr12
      const progress = (month - 6) / 6;
      monthMRR = mrr6 + (mrr12 - mrr6) * progress;
    }
    
    // Apply margin
    totalRevenue += monthMRR * marginPercent;
  }
  
  // Calculate costs
  let totalMarketingCost = 0;
  for (let month = 1; month <= 12; month++) {
    // Marketing ramps down after month 6
    const multiplier = month <= 6 ? 1.0 : 0.75;
    totalMarketingCost += monthlyMarketingBudget * multiplier;
  }
  
  const operationalCost = (mvpInvestment * 0.02) * 12; // 2% monthly
  const totalCosts = mvpInvestment + totalMarketingCost + operationalCost;
  
  // Calculate raw ROI
  let rawROI = totalCosts > 0 
    ? Math.round(((totalRevenue - totalCosts) / totalCosts) * 100)
    : 0;
  
  // Validate and cap ROI using dynamic benchmarks
  const originalROI = rawROI;
  
  if (rawROI > benchmarks.ROI_YEAR_1_MAX) {
    warnings.push(`Year 1 ROI ${rawROI}% capped to ${benchmarks.ROI_YEAR_1_MAX}% (market benchmark)`);
    rawROI = benchmarks.ROI_YEAR_1_MAX;
  }
  
  if (rawROI < benchmarks.ROI_YEAR_1_MIN) {
    warnings.push(`Year 1 ROI ${rawROI}% floored to ${benchmarks.ROI_YEAR_1_MIN}%`);
    rawROI = benchmarks.ROI_YEAR_1_MIN;
  }
  
  // Add warning for high but valid ROI
  if (rawROI > benchmarks.ROI_YEAR_1_REALISTIC_MAX && rawROI <= benchmarks.ROI_YEAR_1_MAX) {
    warnings.push(`High ROI projection (${rawROI}%) - verify assumptions and execution capability`);
  }
  
  return {
    value: rawROI,
    wasAdjusted: originalROI !== rawROI,
    originalValue: originalROI,
    adjustmentReason: originalROI !== rawROI ? 'ROI adjusted to market benchmarks' : null,
    warnings,
  };
}

// ============================================
// Break-even Validation
// ============================================

/**
 * Calculate and validate realistic break-even
 */
export function calculateValidatedBreakEven(
  mrr6: number,
  mrr12: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  marginPercent: number = 0.65,
  benchmarks: NormalizedBenchmarks = MARKET_BENCHMARKS
): ValidationResult<number> {
  const warnings: string[] = [];
  
  let cumulativeRevenue = 0;
  let cumulativeCosts = mvpInvestment;
  let breakEvenMonth = 48; // Default if not reached
  
  for (let month = 1; month <= 48; month++) {
    // Interpolate MRR with realistic growth curve
    let monthMRR: number;
    
    if (month <= 6) {
      monthMRR = mrr6 * (month / 6);
    } else if (month <= 12) {
      const progress = (month - 6) / 6;
      monthMRR = mrr6 + (mrr12 - mrr6) * progress;
    } else if (month <= 24) {
      // Assume 100% growth from Y1 to Y2
      const mrr24 = mrr12 * 2;
      const progress = (month - 12) / 12;
      monthMRR = mrr12 + (mrr24 - mrr12) * progress;
    } else {
      // Beyond Y2: 25% annual growth
      const mrr24 = mrr12 * 2;
      monthMRR = mrr24 * Math.pow(1.25, (month - 24) / 12);
    }
    
    // Apply margin
    cumulativeRevenue += monthMRR * marginPercent;
    
    // Monthly costs (marketing + operational)
    const marketingMultiplier = month <= 6 ? 1.0 : 0.8;
    const operationalCost = mvpInvestment * 0.02;
    cumulativeCosts += (monthlyMarketingBudget * marketingMultiplier) + operationalCost;
    
    // Check break-even
    if (cumulativeRevenue >= cumulativeCosts) {
      breakEvenMonth = month;
      break;
    }
  }
  
  // Validate break-even using dynamic benchmarks
  const originalBreakEven = breakEvenMonth;
  
  if (breakEvenMonth < benchmarks.BREAK_EVEN_MIN_MONTHS) {
    warnings.push(`Break-even ${breakEvenMonth} months adjusted to ${benchmarks.BREAK_EVEN_MIN_MONTHS} months (too optimistic)`);
    breakEvenMonth = benchmarks.BREAK_EVEN_MIN_MONTHS;
  }
  
  if (breakEvenMonth > benchmarks.BREAK_EVEN_MAX_MONTHS) {
    warnings.push(`Break-even exceeds ${benchmarks.BREAK_EVEN_MAX_MONTHS} months - extended runway required`);
  }
  
  return {
    value: breakEvenMonth,
    wasAdjusted: originalBreakEven !== breakEvenMonth,
    originalValue: originalBreakEven,
    adjustmentReason: originalBreakEven !== breakEvenMonth ? 'Break-even adjusted to realistic minimum' : null,
    warnings,
  };
}

// ============================================
// Full Validation Pipeline
// ============================================

export interface ValidatedFinancials {
  mrr6: number;
  mrr12: number;
  mrr24: number;
  arr12: number;
  arr24: number;
  roiYear1: number;
  breakEvenMonths: number;
  wasAdjusted: boolean;
  warnings: string[];
}

/**
 * Run full validation pipeline on financial projections
 * Returns validated values with all adjustments and warnings
 */
export function validateFinancialProjections(
  rawMrr6: number | null,
  rawMrr12: number | null,
  rawMrr24: number | null,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  marginPercent: number = 0.65,
  benchmarks: NormalizedBenchmarks = MARKET_BENCHMARKS
): ValidatedFinancials {
  const allWarnings: string[] = [];
  let anyAdjusted = false;
  
  // Step 1: Validate MRR progression
  const mrrValidation = validateMRRProgression(rawMrr6, rawMrr12, rawMrr24, benchmarks);
  if (mrrValidation.wasAdjusted) {
    anyAdjusted = true;
    allWarnings.push(...mrrValidation.warnings);
  }
  
  const { mrr6, mrr12, mrr24 } = mrrValidation.value;
  
  // Step 2: Calculate and validate ARR
  const arr12Validation = validateARR(mrr12 * 12, 1, benchmarks);
  const arr24Validation = validateARR(mrr24 * 12, 2, benchmarks);
  
  if (arr12Validation.wasAdjusted) {
    anyAdjusted = true;
    allWarnings.push(...arr12Validation.warnings);
  }
  if (arr24Validation.wasAdjusted) {
    anyAdjusted = true;
    allWarnings.push(...arr24Validation.warnings);
  }
  
  // Step 3: Calculate and validate ROI
  const roiValidation = calculateValidatedROI(
    mrr6,
    mrr12,
    mvpInvestment,
    monthlyMarketingBudget,
    marginPercent,
    benchmarks
  );
  
  if (roiValidation.wasAdjusted) {
    anyAdjusted = true;
  }
  allWarnings.push(...roiValidation.warnings);
  
  // Step 4: Calculate and validate break-even
  const breakEvenValidation = calculateValidatedBreakEven(
    mrr6,
    mrr12,
    mvpInvestment,
    monthlyMarketingBudget,
    marginPercent,
    benchmarks
  );
  
  if (breakEvenValidation.wasAdjusted) {
    anyAdjusted = true;
    allWarnings.push(...breakEvenValidation.warnings);
  }
  
  return {
    mrr6,
    mrr12,
    mrr24,
    arr12: arr12Validation.value,
    arr24: arr24Validation.value,
    roiYear1: roiValidation.value,
    breakEvenMonths: breakEvenValidation.value,
    wasAdjusted: anyAdjusted,
    warnings: allWarnings,
  };
}

/**
 * Generate realistic projection data with validated values
 */
export function generateValidatedProjections(
  mrr6: number,
  mrr12: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  marginPercent: number = 0.65,
  months: number = 12
): { month: string; revenue: number; costs: number; cumulative: number }[] {
  const data: { month: string; revenue: number; costs: number; cumulative: number }[] = [];
  let cumulativeNet = -mvpInvestment;
  
  for (let month = 1; month <= months; month++) {
    // Realistic S-curve growth
    let monthMRR: number;
    
    if (month <= 6) {
      monthMRR = mrr6 * (month / 6);
    } else {
      const progress = (month - 6) / 6;
      monthMRR = mrr6 + (mrr12 - mrr6) * progress;
    }
    
    const revenue = Math.round(monthMRR * marginPercent);
    
    // Costs with realistic breakdown
    const marketingMultiplier = month <= 3 ? 1.2 : month <= 6 ? 1.0 : 0.8;
    const operationalCost = mvpInvestment * 0.02;
    const costs = Math.round((monthlyMarketingBudget * marketingMultiplier) + operationalCost);
    
    cumulativeNet += revenue - costs;
    
    data.push({
      month: `M${month}`,
      revenue,
      costs,
      cumulative: Math.round(cumulativeNet),
    });
  }
  
  return data;
}

/**
 * Generate validated financial scenarios
 */
export function generateValidatedScenarios(
  mrr12: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  marginPercent: number = 0.65
): {
  conservative: { mrr12: number; arr12: number; breakEven: number; probability: string };
  realistic: { mrr12: number; arr12: number; breakEven: number; probability: string };
  optimistic: { mrr12: number; arr12: number; breakEven: number; probability: string };
} {
  // Conservative: 60% of target
  const conservativeMrr = mrr12 * 0.6;
  const conservativeBreakEven = calculateValidatedBreakEven(
    conservativeMrr * 0.4,
    conservativeMrr,
    mvpInvestment,
    monthlyMarketingBudget,
    marginPercent
  );
  
  // Realistic: 80% of target (market is unpredictable)
  const realisticMrr = mrr12 * 0.8;
  const realisticBreakEven = calculateValidatedBreakEven(
    realisticMrr * 0.4,
    realisticMrr,
    mvpInvestment,
    monthlyMarketingBudget,
    marginPercent
  );
  
  // Optimistic: 100% of target
  const optimisticBreakEven = calculateValidatedBreakEven(
    mrr12 * 0.4,
    mrr12,
    mvpInvestment,
    monthlyMarketingBudget,
    marginPercent
  );
  
  return {
    conservative: {
      mrr12: conservativeMrr,
      arr12: conservativeMrr * 12,
      breakEven: conservativeBreakEven.value,
      probability: "25%",
    },
    realistic: {
      mrr12: realisticMrr,
      arr12: realisticMrr * 12,
      breakEven: realisticBreakEven.value,
      probability: "50%",
    },
    optimistic: {
      mrr12: mrr12,
      arr12: mrr12 * 12,
      breakEven: optimisticBreakEven.value,
      probability: "25%",
    },
  };
}
