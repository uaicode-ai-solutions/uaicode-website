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
