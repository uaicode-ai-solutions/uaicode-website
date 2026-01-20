/**
 * Shared utility functions for marketing budget calculations
 * Used by InvestmentSection and FinancialReturnSection
 */

// Budget map based on current wizard ranges (StepGoals.tsx)
// Maps wizard budget selection to suggested paid media budget in cents
export const BUDGET_TO_PAID_MEDIA_MAP: Record<string, number> = {
  '10k-25k': 250000,    // $2,500 (~14% of $17.5K midpoint)
  '25k-60k': 600000,    // $6,000 (~14% of $42.5K midpoint)
  '60k-160k': 1500000,  // $15,000 (~14% of $110K midpoint)
  '160k+': 3000000,     // $30,000 (~15% of $200K estimated)
  'guidance': 0,        // Calculated dynamically based on uaicodeTotal
};

/**
 * Calculate suggested paid media budget based on wizard budget selection
 * @param budget - User's budget selection from wizard (e.g., '25k-60k')
 * @param uaicodeTotal - Total Uaicode subscription cost in cents
 * @returns Suggested paid media budget in cents
 */
export const calculateSuggestedPaidMedia = (
  budget: string | null | undefined, 
  uaicodeTotal: number
): number => {
  // If user chose a specific budget range (not 'guidance')
  if (budget && BUDGET_TO_PAID_MEDIA_MAP[budget] !== undefined) {
    const mappedValue = BUDGET_TO_PAID_MEDIA_MAP[budget];
    
    // For 'guidance' or zero-mapped budgets, calculate dynamically
    if (mappedValue === 0 && uaicodeTotal > 0) {
      const suggested = Math.round(uaicodeTotal * 0.75);
      const min = 300000;  // $3,000 minimum
      const max = 1500000; // $15,000 maximum
      return Math.min(Math.max(suggested, min), max);
    }
    
    return mappedValue;
  }
  
  // If 'guidance' or not defined, use 75% of uaicodeTotal with min/max caps
  if (uaicodeTotal > 0) {
    const suggested = Math.round(uaicodeTotal * 0.75);
    const min = 300000;  // $3,000 minimum
    const max = 1500000; // $15,000 maximum
    return Math.min(Math.max(suggested, min), max);
  }
  
  // Fallback default
  return 500000; // $5,000
};

/**
 * Calculate marketing efficiency multiplier
 * More marketing investment = faster MRR growth (up to 2.5x)
 * 
 * @param effectiveBudget - Current marketing budget (USD)
 * @param baselineBudget - Baseline marketing budget for comparison (USD)
 * @returns Efficiency multiplier (1.0 to 2.5)
 */
export const calculateMarketingEfficiency = (
  effectiveBudget: number,
  baselineBudget: number
): number => {
  if (baselineBudget <= 0) return 1;
  
  const ratio = effectiveBudget / baselineBudget;
  
  // Increased sensitivity for user-selected budgets
  // At 1x baseline: 1.0 efficiency (0% boost)
  // At 1.5x baseline: 1.25 efficiency (25% boost)
  // At 2x baseline: 1.5 efficiency (50% boost)
  // Capped at 2.5x max
  const efficiency = 1 + (ratio - 1) * 0.5;
  
  return Math.min(2.5, Math.max(1, efficiency));
};

/**
 * Calculate total monthly marketing cost in USD
 * @param uaicodeTotal - Uaicode subscription total in cents
 * @param paidMedia - Paid media budget in cents
 * @returns Total monthly marketing cost in USD
 */
export const calculateTotalMarketingMonthly = (
  uaicodeTotal: number,
  paidMedia: number
): number => {
  return (uaicodeTotal + paidMedia) / 100;
};
