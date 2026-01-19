// ============================================
// Financial Parsing Utilities
// Extract numeric values from formatted strings in JSONB fields
// ============================================

export interface MoneyRange {
  min: number;
  max: number;
  avg: number;
}

export interface PercentageRange {
  min: number;
  max: number;
  avg: number;
}

/**
 * Parse a money range string like "$35,000-55,000" or "$35,000-$55,000"
 * Returns { min, max, avg } in dollars
 */
export function parseMoneyRange(value: string | null | undefined): MoneyRange | null {
  if (!value) return null;
  
  // Remove $ signs and commas, handle various formats
  const cleaned = value.replace(/\$/g, '').replace(/,/g, '');
  
  // Try to match range pattern: "35000-55000" or "35000 - 55000"
  const rangeMatch = cleaned.match(/([\d.]+)\s*[-–—]\s*([\d.]+)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: (min + max) / 2 };
    }
  }
  
  // Try single value
  const singleMatch = cleaned.match(/([\d.]+)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    if (!isNaN(val)) {
      return { min: val, max: val, avg: val };
    }
  }
  
  return null;
}

/**
 * Parse a single money value like "$12,000" or "12000"
 * Returns value in dollars
 */
export function parseMoneyValue(value: string | null | undefined): number | null {
  if (!value) return null;
  
  const cleaned = value.replace(/\$/g, '').replace(/,/g, '').trim();
  const match = cleaned.match(/([\d.]+)/);
  if (match) {
    const val = parseFloat(match[1]);
    return isNaN(val) ? null : val;
  }
  return null;
}

/**
 * Parse a percentage range like "<8%", "15-44%", or "30-40%"
 * Returns { min, max, avg }
 */
export function parsePercentageRange(value: string | null | undefined): PercentageRange | null {
  if (!value) return null;
  
  const cleaned = value.replace(/%/g, '').trim();
  
  // Handle "<X" format
  if (cleaned.startsWith('<')) {
    const match = cleaned.match(/<\s*([\d.]+)/);
    if (match) {
      const max = parseFloat(match[1]);
      if (!isNaN(max)) {
        return { min: 0, max, avg: max / 2 };
      }
    }
  }
  
  // Handle ">X" format
  if (cleaned.startsWith('>')) {
    const match = cleaned.match(/>\s*([\d.]+)/);
    if (match) {
      const min = parseFloat(match[1]);
      if (!isNaN(min)) {
        return { min, max: min * 1.5, avg: min * 1.25 };
      }
    }
  }
  
  // Handle range "X-Y"
  const rangeMatch = cleaned.match(/([\d.]+)\s*[-–—]\s*([\d.]+)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: (min + max) / 2 };
    }
  }
  
  // Single value
  const singleMatch = cleaned.match(/([\d.]+)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    if (!isNaN(val)) {
      return { min: val, max: val, avg: val };
    }
  }
  
  return null;
}

/**
 * Parse a single percentage value
 */
export function parsePercentage(value: string | null | undefined): number | null {
  const range = parsePercentageRange(value);
  return range ? range.avg : null;
}

/**
 * Parse a ratio string like "3:1" or "3.5:1"
 * Returns the first number (e.g., 3 from "3:1")
 */
export function parseRatio(value: string | null | undefined): number | null {
  if (!value) return null;
  
  const match = value.match(/([\d.]+)\s*:\s*(\d+)/);
  if (match) {
    const numerator = parseFloat(match[1]);
    return isNaN(numerator) ? null : numerator;
  }
  return null;
}

/**
 * Convert cents to USD dollars
 */
export function parseCentsToUSD(cents: number | null | undefined): number | null {
  if (cents === null || cents === undefined) return null;
  return cents / 100;
}

/**
 * Parse customer count range like "650-1,000" or "1,500-2,500"
 */
export function parseCustomerRange(value: string | null | undefined): MoneyRange | null {
  if (!value) return null;
  
  const cleaned = value.replace(/,/g, '');
  const rangeMatch = cleaned.match(/([\d]+)\s*[-–—]\s*([\d]+)/);
  
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: Math.round((min + max) / 2) };
    }
  }
  
  const singleMatch = cleaned.match(/([\d]+)/);
  if (singleMatch) {
    const val = parseInt(singleMatch[1]);
    if (!isNaN(val)) {
      return { min: val, max: val, avg: val };
    }
  }
  
  return null;
}

/**
 * Format number as currency string
 */
export function formatCurrency(value: number | string | null | undefined, fallback = "..."): string {
  if (value === null || value === undefined) return fallback;
  
  // If already formatted string, return it
  if (typeof value === 'string') {
    if (value.includes('$') || value.includes('K') || value.includes('M') || value.includes('B')) {
      return value;
    }
    const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (isNaN(numValue)) return fallback;
    value = numValue;
  }
  
  if (typeof value !== 'number' || isNaN(value)) return fallback;
  
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | null | undefined, fallback = "..."): string {
  if (value === null || value === undefined || isNaN(value)) return fallback;
  return `${value.toFixed(0)}%`;
}

/**
 * Safely extract nested property from unknown object
 */
export function safeGet<T>(obj: unknown, path: string, fallback: T): T {
  if (!obj || typeof obj !== 'object') return fallback;
  
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  return (current as T) ?? fallback;
}

/**
 * Extract MRR value from growth targets object
 */
export function extractMRRFromTargets(targets: unknown): MoneyRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const mrr = (targets as Record<string, unknown>).mrr;
  return typeof mrr === 'string' ? parseMoneyRange(mrr) : null;
}

/**
 * Extract ARR value from growth targets object
 */
export function extractARRFromTargets(targets: unknown): MoneyRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const arr = (targets as Record<string, unknown>).arr;
  return typeof arr === 'string' ? parseMoneyRange(arr) : null;
}

/**
 * Extract churn value from growth targets object
 */
export function extractChurnFromTargets(targets: unknown): PercentageRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const churn = (targets as Record<string, unknown>).churn;
  return typeof churn === 'string' ? parsePercentageRange(churn) : null;
}

/**
 * Extract customers from growth targets object
 */
export function extractCustomersFromTargets(targets: unknown): MoneyRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const customers = (targets as Record<string, unknown>).customers;
  return typeof customers === 'string' ? parseCustomerRange(customers) : null;
}

// ============================================
// TEXT EXTRACTION FUNCTIONS
// For parsing long text strings containing embedded metrics
// ============================================

/**
 * Extract MRR from long text like "Monthly Recurring Revenue (MRR) of $35,000-55,000"
 */
export function extractMRRFromText(text: string | null | undefined): MoneyRange | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match patterns like "MRR of $35,000-55,000" or "MRR) of $90,000-150,000"
  const mrrMatch = text.match(/(?:MRR|Monthly Recurring Revenue)[^$]*\$?([\d,]+)(?:\s*[-–—]\s*\$?([\d,]+))?/i);
  if (mrrMatch) {
    const min = parseInt(mrrMatch[1].replace(/,/g, ''));
    const max = mrrMatch[2] ? parseInt(mrrMatch[2].replace(/,/g, '')) : min;
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: (min + max) / 2 };
    }
  }
  return null;
}

/**
 * Extract ARR from long text like "Annual Recurring Revenue (ARR) of $420,000-660,000"
 */
export function extractARRFromText(text: string | null | undefined): MoneyRange | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match patterns like "ARR of $420,000" or "Annual Recurring Revenue of $1.08M-1.8M"
  const arrMatch = text.match(/(?:ARR|Annual Recurring Revenue)[^$]*\$?([\d,.]+)([MKB])?(?:\s*[-–—]\s*\$?([\d,.]+)([MKB])?)?/i);
  if (arrMatch) {
    let min = parseFloat(arrMatch[1].replace(/,/g, ''));
    let max = arrMatch[3] ? parseFloat(arrMatch[3].replace(/,/g, '')) : min;
    
    // Handle M/K/B suffixes
    const minSuffix = arrMatch[2]?.toUpperCase();
    const maxSuffix = arrMatch[4]?.toUpperCase() || minSuffix;
    
    if (minSuffix === 'M') min *= 1000000;
    else if (minSuffix === 'K') min *= 1000;
    else if (minSuffix === 'B') min *= 1000000000;
    
    if (maxSuffix === 'M') max *= 1000000;
    else if (maxSuffix === 'K') max *= 1000;
    else if (maxSuffix === 'B') max *= 1000000000;
    
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: (min + max) / 2 };
    }
  }
  return null;
}

/**
 * Extract Churn from text like "Churn rate of <8% monthly" or "churn <6%"
 */
export function extractChurnFromText(text: string | null | undefined): PercentageRange | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match patterns like "Churn rate of <8%" or "churn <6%" or "Churn rate of 3-5%"
  const churnMatch = text.match(/(?:churn|churn rate)[^<\d]*([<>]?\s*[\d.]+)(?:\s*[-–—]\s*([\d.]+))?%?/i);
  if (churnMatch) {
    const value = churnMatch[1].trim();
    if (value.startsWith('<')) {
      const max = parseFloat(value.slice(1).trim());
      if (!isNaN(max)) {
        return { min: 0, max, avg: max / 2 };
      }
    } else if (value.startsWith('>')) {
      const min = parseFloat(value.slice(1).trim());
      if (!isNaN(min)) {
        return { min, max: min * 1.5, avg: min * 1.25 };
      }
    } else {
      const min = parseFloat(value);
      const max = churnMatch[2] ? parseFloat(churnMatch[2]) : min;
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max, avg: (min + max) / 2 };
      }
    }
  }
  return null;
}

/**
 * Extract Customers from text like "650-1,000 total clinic customers" or "2,500-4,000 customers"
 */
export function extractCustomersFromText(text: string | null | undefined): MoneyRange | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match patterns like "650-1,000 total" or "2,500-4,000 customers"
  const custMatch = text.match(/([\d,]+)\s*[-–—]\s*([\d,]+)\s*(?:total|customer|clinic|user|subscriber)/i);
  if (custMatch) {
    const min = parseInt(custMatch[1].replace(/,/g, ''));
    const max = parseInt(custMatch[2].replace(/,/g, ''));
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: Math.round((min + max) / 2) };
    }
  }
  return null;
}

/**
 * Extract Activation Rate from text like "Activation rate of 30-40%"
 */
export function extractActivationFromText(text: string | null | undefined): PercentageRange | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match patterns like "Activation rate of 30-40%" or "activation 45-55%"
  const actMatch = text.match(/activation[^<\d]*([\d.]+)(?:\s*[-–—]\s*([\d.]+))?%?/i);
  if (actMatch) {
    const min = parseFloat(actMatch[1]);
    const max = actMatch[2] ? parseFloat(actMatch[2]) : min;
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: (min + max) / 2 };
    }
  }
  return null;
}

/**
 * Extract CAC from text like "$60-100 (blended; aligns with...)"
 */
export function extractCACFromText(text: string | null | undefined): MoneyRange | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match "$60-100" at the start or after "CAC"
  const cacMatch = text.match(/\$?([\d,]+)\s*[-–—]\s*\$?([\d,]+)/);
  if (cacMatch) {
    const min = parseInt(cacMatch[1].replace(/,/g, ''));
    const max = parseInt(cacMatch[2].replace(/,/g, ''));
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: (min + max) / 2 };
    }
  }
  
  // Try single value
  const singleMatch = text.match(/\$?([\d,]+)/);
  if (singleMatch) {
    const val = parseInt(singleMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) {
      return { min: val, max: val, avg: val };
    }
  }
  
  return null;
}

/**
 * Extract LTV/CAC ratio from text like "3:1 (assuming $29-99/mo pricing...)"
 */
export function extractRatioFromText(text: string | null | undefined): number | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match "3:1" or "3.5:1" at the start
  const ratioMatch = text.match(/^([\d.]+)\s*:\s*(\d+)/);
  if (ratioMatch) {
    const numerator = parseFloat(ratioMatch[1]);
    const denominator = parseFloat(ratioMatch[2]);
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }
  
  // Also try "ratio of X:Y" pattern
  const altMatch = text.match(/ratio[^:]*?([\d.]+)\s*:\s*(\d+)/i);
  if (altMatch) {
    const numerator = parseFloat(altMatch[1]);
    const denominator = parseFloat(altMatch[2]);
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }
  
  return null;
}

/**
 * Extract break-even months from text like "Break-even: 12-18 months"
 */
export function extractBreakEvenFromText(text: string | null | undefined): MoneyRange | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match "break-even" followed by months
  const beMatch = text.match(/break[\s-]*even[^:]*:?\s*([\d]+)(?:\s*[-–—]\s*([\d]+))?\s*months?/i);
  if (beMatch) {
    const min = parseInt(beMatch[1]);
    const max = beMatch[2] ? parseInt(beMatch[2]) : min;
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: Math.round((min + max) / 2) };
    }
  }
  return null;
}

/**
 * Smart extract MRR - handles both object and string formats
 */
export function smartExtractMRR(data: unknown): MoneyRange | null {
  if (!data) return null;
  if (typeof data === 'string') return extractMRRFromText(data);
  if (typeof data === 'object') return extractMRRFromTargets(data);
  return null;
}

/**
 * Smart extract ARR - handles both object and string formats
 */
export function smartExtractARR(data: unknown): MoneyRange | null {
  if (!data) return null;
  if (typeof data === 'string') return extractARRFromText(data);
  if (typeof data === 'object') return extractARRFromTargets(data);
  return null;
}

/**
 * Smart extract Churn - handles both object and string formats
 */
export function smartExtractChurn(data: unknown): PercentageRange | null {
  if (!data) return null;
  if (typeof data === 'string') return extractChurnFromText(data);
  if (typeof data === 'object') return extractChurnFromTargets(data);
  return null;
}

/**
 * Smart extract Customers - handles both object and string formats
 */
export function smartExtractCustomers(data: unknown): MoneyRange | null {
  if (!data) return null;
  if (typeof data === 'string') return extractCustomersFromText(data);
  if (typeof data === 'object') return extractCustomersFromTargets(data);
  return null;
}

/**
 * Extract monthly marketing budget from budget strategy text
 * Example: "$12,000/month Meta/Google Ads budget" or "$10k/mo"
 */
export function extractMarketingBudgetFromText(text: string | null | undefined): number | null {
  if (!text || typeof text !== 'string') return null;
  
  // Match patterns like "$12,000/month", "$12k/mo", "$15,000 per month"
  const patterns = [
    /\$?([\d,]+)(?:k)?\s*\/\s*(?:month|mo)/i,
    /\$?([\d,]+)(?:k)?\s*per\s*month/i,
    /recommended[^$]*\$?([\d,]+)(?:k)?/i,
    /budget[^$]*\$?([\d,]+)(?:k)?/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseFloat(match[1].replace(/,/g, ''));
      if (text.toLowerCase().includes('k')) value *= 1000;
      if (!isNaN(value)) return value;
    }
  }
  
  // Try to find any money value as fallback
  const fallbackMatch = text.match(/\$?([\d,]+)/);
  if (fallbackMatch) {
    const value = parseFloat(fallbackMatch[1].replace(/,/g, ''));
    if (!isNaN(value) && value > 100) return value; // Only if reasonable budget
  }
  
  return null;
}

/**
 * S-curve growth function for realistic SaaS revenue ramp-up
 * Returns a value between 0 and 1 representing growth progress
 * @param month - current month (1-indexed)
 * @param rampMonths - months to reach ~63% of target (default 6)
 */
export function sCurveGrowth(month: number, rampMonths: number = 6): number {
  // Logistic S-curve: 1 / (1 + e^(-k*(t-midpoint)))
  // Simplified: 1 - e^(-month/rampMonths) for exponential approach
  return 1 - Math.exp(-month / rampMonths);
}

/**
 * Calculate cumulative break-even month using realistic cost model
 * Includes MVP investment, marketing costs, and operational costs
 */
export function calculateRealisticBreakEven(
  mrrTarget: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  operationalCostPercent: number = 0.01,
  marginPercent: number = 0.70,
  maxMonths: number = 36
): number {
  let cumulativeRevenue = 0;
  let cumulativeCosts = mvpInvestment; // Start with initial investment
  
  for (let month = 1; month <= maxMonths; month++) {
    // Revenue with S-curve growth (realistic ramp-up)
    const growthFactor = sCurveGrowth(month, 6);
    const monthRevenue = mrrTarget * growthFactor;
    
    // Net revenue after margin (70% typical for SaaS)
    const netMonthRevenue = monthRevenue * marginPercent;
    cumulativeRevenue += netMonthRevenue;
    
    // Monthly costs: marketing + operational
    const monthlyOpCost = mvpInvestment * operationalCostPercent;
    cumulativeCosts += monthlyMarketingBudget + monthlyOpCost;
    
    // Check if break-even reached
    if (cumulativeRevenue >= cumulativeCosts) {
      return month;
    }
  }
  
  // If not reached in maxMonths, return maxMonths
  return maxMonths;
}

/**
 * Calculate realistic Year 1 ROI including all costs
 */
export function calculateRealisticROI(
  mrrTarget: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  operationalCostPercent: number = 0.01
): number {
  // Calculate Year 1 revenue with realistic S-curve ramp-up
  let totalRevenue = 0;
  for (let month = 1; month <= 12; month++) {
    const growthFactor = sCurveGrowth(month, 6);
    totalRevenue += mrrTarget * growthFactor;
  }
  
  // Total costs: MVP + 12 months of marketing + 12 months of operational
  const annualMarketingCost = monthlyMarketingBudget * 12;
  const annualOperationalCost = (mvpInvestment * operationalCostPercent) * 12;
  const totalCosts = mvpInvestment + annualMarketingCost + annualOperationalCost;
  
  // ROI = (Revenue - Costs) / Costs × 100
  if (totalCosts <= 0) return 0;
  return Math.round(((totalRevenue - totalCosts) / totalCosts) * 100);
}

/**
 * Generate realistic projection data with S-curve growth
 */
export function generateRealisticProjections(
  mrrTarget: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  months: number = 12
): { month: string; revenue: number; costs: number; cumulative: number }[] {
  const data: { month: string; revenue: number; costs: number; cumulative: number }[] = [];
  let cumulativeNet = -mvpInvestment; // Start negative with investment
  
  const monthlyOpCost = mvpInvestment * 0.01;
  
  for (let month = 1; month <= months; month++) {
    // S-curve revenue growth
    const growthFactor = sCurveGrowth(month, 6);
    const monthRevenue = Math.round(mrrTarget * growthFactor);
    
    // Costs: marketing + operational (higher in first 3 months for setup)
    const setupMultiplier = month <= 3 ? 1.3 : 1.0;
    const monthCosts = Math.round((monthlyMarketingBudget + monthlyOpCost) * setupMultiplier);
    
    // Update cumulative
    cumulativeNet += monthRevenue - monthCosts;
    
    data.push({
      month: `M${month}`,
      revenue: monthRevenue,
      costs: monthCosts,
      cumulative: Math.round(cumulativeNet),
    });
  }
  
  return data;
}
