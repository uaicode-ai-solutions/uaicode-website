// ============================================
// Unified Currency Formatting Utility
// Single source of truth for monetary value display
// ============================================

/**
 * Format currency as exact values with thousands separators
 * Example: 4580 → "$4,580", 109920 → "$109,920", 1450000 → "$1,450,000"
 * 
 * For values >= 1 billion, uses abbreviation for readability: "$1.5B"
 */
export function formatCurrencyExact(
  value: number | string | null | undefined,
  fallback = "..."
): string {
  if (value === null || value === undefined) return fallback;

  let numValue: number;

  if (typeof value === "string") {
    // If already formatted string with currency symbols, return it
    if (value.includes("$") && (value.includes(",") || value.includes("K") || value.includes("M") || value.includes("B"))) {
      return value;
    }
    // Use Number() to handle scientific notation (e.g., "1.45e+07")
    numValue = Number(value);
    if (isNaN(numValue)) return fallback;
  } else {
    numValue = value;
  }

  if (typeof numValue !== "number" || isNaN(numValue)) return fallback;

  // For very large numbers (billions+), use abbreviation for readability
  if (numValue >= 1_000_000_000) {
    return `$${(numValue / 1_000_000_000).toFixed(1)}B`;
  }

  // Format with thousands separators using Intl.NumberFormat
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Format currency as compact abbreviations
 * Example: 4580 → "$5K", 109920 → "$110K", 1450000 → "$1.5M"
 * 
 * Best for: chart axis labels, tight spaces, quick scanning
 */
export function formatCurrencyCompact(
  value: number | string | null | undefined,
  fallback = "..."
): string {
  if (value === null || value === undefined) return fallback;

  let numValue: number;

  if (typeof value === "string") {
    // If already formatted string with currency symbols, return it
    if (value.includes("$") || value.includes("K") || value.includes("M") || value.includes("B")) {
      return value;
    }
    // Use Number() to handle scientific notation (e.g., "1.45e+07")
    numValue = Number(value);
    if (isNaN(numValue)) return fallback;
  } else {
    numValue = value;
  }

  if (typeof numValue !== "number" || isNaN(numValue)) return fallback;

  if (numValue >= 1_000_000_000) {
    return `$${(numValue / 1_000_000_000).toFixed(1)}B`;
  }
  if (numValue >= 1_000_000) {
    return `$${(numValue / 1_000_000).toFixed(1)}M`;
  }
  if (numValue >= 1_000) {
    return `$${(numValue / 1_000).toFixed(0)}K`;
  }
  return `$${numValue.toFixed(0)}`;
}

/**
 * Default export uses exact formatting for precision
 * This is the standard for investor reports and business plans
 */
export const formatCurrency = formatCurrencyExact;
