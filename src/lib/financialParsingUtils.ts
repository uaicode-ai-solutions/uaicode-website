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
 * Also handles numbers and scientific notation strings
 * Returns value in dollars
 */
export function parseMoneyValue(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  
  // If it's already a number, return it directly
  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }
  
  // Handle string - could be formatted or scientific notation
  if (typeof value === 'string') {
    // First try Number() to handle scientific notation like "1.45e+07"
    const directNum = Number(value);
    if (!isNaN(directNum) && value.match(/^[\d.e+-]+$/i)) {
      return directNum;
    }
    
    // Otherwise parse formatted string like "$12,000"
    const cleaned = value.replace(/\$/g, '').replace(/,/g, '').trim();
    const match = cleaned.match(/([\d.]+)/);
    if (match) {
      const val = parseFloat(match[1]);
      return isNaN(val) ? null : val;
    }
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
  
  // Handle "<X" format - interpret as "max X, expected ~75% of max"
  // Example: "<6%" becomes min: 3%, max: 6%, avg: 4.5% (more conservative)
  if (cleaned.startsWith('<')) {
    const match = cleaned.match(/<\s*([\d.]+)/);
    if (match) {
      const max = parseFloat(match[1]);
      if (!isNaN(max)) {
        // Conservative interpretation: min = 50% of max, avg = 75% of max
        return { min: max * 0.5, max, avg: max * 0.75 };
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
 * Safely convert any value to a number, handling scientific notation strings
 * This is critical for Supabase JSONB which may return large numbers as "1.45e+07"
 */
export function safeNumber(value: unknown, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const num = typeof value === 'string' ? Number(value) : Number(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Convert cents to USD dollars
 * Handles scientific notation strings from Supabase JSONB (e.g., "1.45e+07")
 */
export function parseCentsToUSD(cents: number | string | null | undefined): number | null {
  if (cents === null || cents === undefined) return null;
  // Handle scientific notation strings from JSONB
  const numValue = typeof cents === 'string' ? Number(cents) : cents;
  if (isNaN(numValue)) return null;
  return numValue / 100;
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
 * Handles scientific notation strings from Supabase JSONB (e.g., "1.45e+07")
 */
export function formatCurrency(value: number | string | null | undefined, fallback = "..."): string {
  if (value === null || value === undefined) return fallback;
  
  let numValue: number;
  
  if (typeof value === 'string') {
    // If already formatted string with currency symbols, return it
    if (value.includes('$') || value.includes('K') || value.includes('M') || value.includes('B')) {
      return value;
    }
    // Use Number() to handle scientific notation (e.g., "1.45e+07")
    // DO NOT use regex replacement as it destroys scientific notation
    numValue = Number(value);
    if (isNaN(numValue)) return fallback;
  } else {
    numValue = value;
  }
  
  if (typeof numValue !== 'number' || isNaN(numValue)) return fallback;
  
  if (numValue >= 1000000000) {
    return `$${(numValue / 1000000000).toFixed(1)}B`;
  }
  if (numValue >= 1000000) {
    return `$${(numValue / 1000000).toFixed(1)}M`;
  }
  if (numValue >= 1000) {
    return `$${(numValue / 1000).toFixed(0)}K`;
  }
  return `$${numValue.toFixed(0)}`;
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
 * Handles both numeric and string formats
 */
export function extractMRRFromTargets(targets: unknown): MoneyRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const mrr = (targets as Record<string, unknown>).mrr;
  
  // Handle direct numeric value
  if (typeof mrr === 'number' && !isNaN(mrr)) {
    return { min: mrr, max: mrr, avg: mrr };
  }
  
  // Handle string (formatted or scientific notation)
  if (typeof mrr === 'string') {
    const numVal = parseMoneyValue(mrr);
    if (numVal !== null) {
      return { min: numVal, max: numVal, avg: numVal };
    }
    return parseMoneyRange(mrr);
  }
  
  return null;
}

/**
 * Extract ARR value from growth targets object
 * Handles both numeric and string formats
 */
export function extractARRFromTargets(targets: unknown): MoneyRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const arr = (targets as Record<string, unknown>).arr;
  
  // Handle direct numeric value
  if (typeof arr === 'number' && !isNaN(arr)) {
    return { min: arr, max: arr, avg: arr };
  }
  
  // Handle string (formatted or scientific notation)
  if (typeof arr === 'string') {
    const numVal = parseMoneyValue(arr);
    if (numVal !== null) {
      return { min: numVal, max: numVal, avg: numVal };
    }
    return parseMoneyRange(arr);
  }
  
  return null;
}

/**
 * Extract churn value from growth targets object
 * Handles both numeric and string formats
 */
export function extractChurnFromTargets(targets: unknown): PercentageRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const churn = (targets as Record<string, unknown>).churn;
  
  // Handle direct numeric value (percentage as decimal or whole number)
  if (typeof churn === 'number' && !isNaN(churn)) {
    // If churn > 1, assume it's already a percentage. Otherwise, convert from decimal
    const val = churn > 1 ? churn : churn * 100;
    return { min: val, max: val, avg: val };
  }
  
  // Handle string
  if (typeof churn === 'string') {
    return parsePercentageRange(churn);
  }
  
  return null;
}

/**
 * Extract customers from growth targets object
 * Handles both numeric and string formats
 */
export function extractCustomersFromTargets(targets: unknown): MoneyRange | null {
  if (!targets || typeof targets !== 'object') return null;
  const customers = (targets as Record<string, unknown>).customers;
  
  // Handle direct numeric value
  if (typeof customers === 'number' && !isNaN(customers)) {
    return { min: customers, max: customers, avg: customers };
  }
  
  // Handle string
  if (typeof customers === 'string') {
    const numVal = parseMoneyValue(customers);
    if (numVal !== null) {
      return { min: numVal, max: numVal, avg: numVal };
    }
    return parseCustomerRange(customers);
  }
  
  return null;
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
        // Conservative interpretation: min = 50% of max, avg = 75% of max
        return { min: max * 0.5, max, avg: max * 0.75 };
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
 * Smart extract MRR - handles number, object, and string formats
 */
export function smartExtractMRR(data: unknown): MoneyRange | null {
  if (!data) return null;
  
  // Direct number
  if (typeof data === 'number' && !isNaN(data)) {
    return { min: data, max: data, avg: data };
  }
  
  // String - try parsing as text with MRR pattern
  if (typeof data === 'string') return extractMRRFromText(data);
  
  // Object - extract from targets
  if (typeof data === 'object') return extractMRRFromTargets(data);
  
  return null;
}

/**
 * Smart extract ARR - handles number, object, and string formats
 */
export function smartExtractARR(data: unknown): MoneyRange | null {
  if (!data) return null;
  
  // Direct number
  if (typeof data === 'number' && !isNaN(data)) {
    return { min: data, max: data, avg: data };
  }
  
  // String - try parsing as text with ARR pattern
  if (typeof data === 'string') return extractARRFromText(data);
  
  // Object - extract from targets
  if (typeof data === 'object') return extractARRFromTargets(data);
  
  return null;
}

/**
 * Smart extract Churn - handles number, object, and string formats
 */
export function smartExtractChurn(data: unknown): PercentageRange | null {
  if (!data) return null;
  
  // Direct number (percentage)
  if (typeof data === 'number' && !isNaN(data)) {
    const val = data > 1 ? data : data * 100;
    return { min: val, max: val, avg: val };
  }
  
  // String - try parsing as text with churn pattern
  if (typeof data === 'string') return extractChurnFromText(data);
  
  // Object - extract from targets
  if (typeof data === 'object') return extractChurnFromTargets(data);
  
  return null;
}

/**
 * Smart extract Customers - handles number, object, and string formats
 */
export function smartExtractCustomers(data: unknown): MoneyRange | null {
  if (!data) return null;
  
  // Direct number
  if (typeof data === 'number' && !isNaN(data)) {
    return { min: data, max: data, avg: data };
  }
  
  // String - try parsing as text with customer pattern
  if (typeof data === 'string') return extractCustomersFromText(data);
  
  // Object - extract from targets
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

// ============================================
// Financial Validation Constants
// ============================================
const VALIDATION_LIMITS = {
  ROI_MIN: -100,
  ROI_MAX: 300, // Cap at 300% - very aggressive but achievable for top SaaS
  ROI_WARNING_THRESHOLD: 250,
  BREAK_EVEN_MIN: 3,
  BREAK_EVEN_MAX: 48,
  LTV_CAC_MIN: 0.5,
  LTV_CAC_MAX: 15,
  PAYBACK_MIN: 1,
  PAYBACK_MAX: 36,
  ARPU_MIN: 5,
  ARPU_MAX: 10000,
};

/**
 * Validate and clamp a financial metric within reasonable bounds
 * Returns the clamped value and a warning if it was adjusted
 */
export function validateFinancialMetric(
  value: number,
  metric: 'roi' | 'breakEven' | 'ltvCac' | 'payback' | 'arpu',
  context?: string
): { value: number; warning: string | null; wasAdjusted: boolean } {
  const limits = {
    roi: { min: VALIDATION_LIMITS.ROI_MIN, max: VALIDATION_LIMITS.ROI_MAX },
    breakEven: { min: VALIDATION_LIMITS.BREAK_EVEN_MIN, max: VALIDATION_LIMITS.BREAK_EVEN_MAX },
    ltvCac: { min: VALIDATION_LIMITS.LTV_CAC_MIN, max: VALIDATION_LIMITS.LTV_CAC_MAX },
    payback: { min: VALIDATION_LIMITS.PAYBACK_MIN, max: VALIDATION_LIMITS.PAYBACK_MAX },
    arpu: { min: VALIDATION_LIMITS.ARPU_MIN, max: VALIDATION_LIMITS.ARPU_MAX },
  };

  const { min, max } = limits[metric];
  
  if (value < min) {
    return {
      value: min,
      warning: `${metric} was ${value}, clamped to minimum ${min}${context ? ` (${context})` : ''}`,
      wasAdjusted: true,
    };
  }
  
  if (value > max) {
    return {
      value: max,
      warning: `${metric} was ${value}, clamped to maximum ${max}${context ? ` (${context})` : ''}`,
      wasAdjusted: true,
    };
  }
  
  // Special warning for ROI approaching threshold
  if (metric === 'roi' && value > VALIDATION_LIMITS.ROI_WARNING_THRESHOLD) {
    return {
      value,
      warning: `High ROI projection (${value}%) - verify assumptions`,
      wasAdjusted: false,
    };
  }
  
  return { value, warning: null, wasAdjusted: false };
}

/**
 * S-curve growth function for realistic SaaS revenue ramp-up
 * Returns a value between 0 and 1 representing growth progress
 * @param month - current month (1-indexed)
 * @param rampMonths - months to reach ~63% of target (default 12 - more conservative)
 */
export function sCurveGrowth(month: number, rampMonths: number = 12): number {
  // Logistic S-curve: 1 / (1 + e^(-k*(t-midpoint)))
  // Simplified: 1 - e^(-month/rampMonths) for exponential approach
  // With ramp=12, month 12 reaches ~63%, month 24 reaches ~87%
  return 1 - Math.exp(-month / rampMonths);
}

/**
 * Calculate cumulative break-even month using realistic cost model
 * Includes MVP investment, marketing costs, and operational costs
 * 
 * IMPORTANT: mrrTarget is the target MRR at month 12, NOT a constant monthly value.
 * The S-curve models the ramp-up from 0 to this target.
 */
export function calculateRealisticBreakEven(
  mrrTarget: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  operationalCostPercent: number = 0.02, // More realistic 2%
  marginPercent: number = 0.65, // Conservative 65% margin
  maxMonths: number = 48
): number {
  let cumulativeRevenue = 0;
  let cumulativeCosts = mvpInvestment; // Start with initial investment
  
  // Use more conservative ramp-up (12 months to 63% maturity)
  const rampMonths = 12;
  
  for (let month = 1; month <= maxMonths; month++) {
    // Revenue with S-curve growth (realistic ramp-up)
    const growthFactor = sCurveGrowth(month, rampMonths);
    const monthRevenue = mrrTarget * growthFactor;
    
    // Net revenue after margin
    const netMonthRevenue = monthRevenue * marginPercent;
    cumulativeRevenue += netMonthRevenue;
    
    // Monthly costs: marketing (scales down over time) + operational
    const marketingDecay = month <= 6 ? 1.0 : 0.8; // Reduce marketing after month 6
    const monthlyOpCost = mvpInvestment * operationalCostPercent;
    cumulativeCosts += (monthlyMarketingBudget * marketingDecay) + monthlyOpCost;
    
    // Check if break-even reached
    if (cumulativeRevenue >= cumulativeCosts) {
      // Validate result
      const validated = validateFinancialMetric(month, 'breakEven');
      return validated.value;
    }
  }
  
  // If not reached in maxMonths, return maxMonths
  return maxMonths;
}

/**
 * Calculate realistic Year 1 ROI including all costs
 * Uses S-curve growth model with conservative assumptions
 * 
 * Formula: ROI = ((Total Revenue - Total Costs) / Total Costs) × 100
 */
export function calculateRealisticROI(
  mrrTarget: number,
  mvpInvestment: number,
  monthlyMarketingBudget: number,
  operationalCostPercent: number = 0.02 // More realistic 2%
): number {
  // Calculate Year 1 revenue with realistic S-curve ramp-up (12 months to 63% maturity)
  let totalRevenue = 0;
  const rampMonths = 12;
  
  for (let month = 1; month <= 12; month++) {
    const growthFactor = sCurveGrowth(month, rampMonths);
    // Apply conservative margin of 65%
    totalRevenue += mrrTarget * growthFactor * 0.65;
  }
  
  // Total costs: MVP + 12 months of marketing + 12 months of operational
  const annualMarketingCost = monthlyMarketingBudget * 12;
  const annualOperationalCost = (mvpInvestment * operationalCostPercent) * 12;
  const totalCosts = mvpInvestment + annualMarketingCost + annualOperationalCost;
  
  // ROI = (Revenue - Costs) / Costs × 100
  if (totalCosts <= 0) return 0;
  
  const rawROI = Math.round(((totalRevenue - totalCosts) / totalCosts) * 100);
  
  // Validate and clamp ROI to reasonable bounds
  const validated = validateFinancialMetric(rawROI, 'roi');
  
  if (validated.warning) {
    console.warn(`[Financial Metrics] ${validated.warning}`);
  }
  
  return validated.value;
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
  
  const monthlyOpCost = mvpInvestment * 0.02; // 2% operational cost
  const rampMonths = 12; // Conservative 12-month ramp
  
  for (let month = 1; month <= months; month++) {
    // S-curve revenue growth
    const growthFactor = sCurveGrowth(month, rampMonths);
    // Apply margin of 65%
    const monthRevenue = Math.round(mrrTarget * growthFactor * 0.65);
    
    // Costs: marketing (higher in first 3 months, decays after 6) + operational
    let setupMultiplier = 1.0;
    if (month <= 3) setupMultiplier = 1.4;
    else if (month > 6) setupMultiplier = 0.8;
    
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

/**
 * Sanitize numeric value from AI response
 * Handles scientific notation, currency strings, and malformed numbers
 */
export function sanitizeNumericValue(
  value: unknown,
  fallback: number | null = null,
  maxReasonable: number = 1000000000 // 1 billion max for most metrics
): number | null {
  if (value === null || value === undefined) return fallback;
  
  // If it's already a reasonable number
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) return fallback;
    if (Math.abs(value) > maxReasonable) return fallback;
    return value;
  }
  
  // If it's a string, try to parse it
  if (typeof value === 'string') {
    // Remove currency symbols and common formatting
    let cleaned = value.replace(/[$,€£¥]/g, '').trim();
    
    // Handle K/M/B suffixes
    let multiplier = 1;
    if (/k$/i.test(cleaned)) {
      multiplier = 1000;
      cleaned = cleaned.replace(/k$/i, '');
    } else if (/m$/i.test(cleaned)) {
      multiplier = 1000000;
      cleaned = cleaned.replace(/m$/i, '');
    } else if (/b$/i.test(cleaned)) {
      multiplier = 1000000000;
      cleaned = cleaned.replace(/b$/i, '');
    }
    
    // Try to parse
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed) || !isFinite(parsed)) return fallback;
    
    const result = parsed * multiplier;
    if (Math.abs(result) > maxReasonable) return fallback;
    
    return result;
  }
  
  return fallback;
}
