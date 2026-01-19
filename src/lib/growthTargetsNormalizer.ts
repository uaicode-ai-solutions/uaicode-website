/**
 * Growth Targets Normalizer
 * Handles both legacy (six_month_targets) and new (6_month) key formats from database
 */

import { GrowthTargetMetrics } from "@/types/report";

export interface NormalizedGrowthTargets {
  sixMonth: GrowthTargetMetrics | null;
  twelveMonth: GrowthTargetMetrics | null;
  twentyFourMonth: GrowthTargetMetrics | null;
}

/**
 * Normalizes growth_targets from database JSONB to consistent format
 * Prioritizes new numeric keys (6_month) over legacy string keys (six_month_targets)
 */
export function normalizeGrowthTargets(growthTargets: unknown): NormalizedGrowthTargets {
  if (!growthTargets || typeof growthTargets !== 'object') {
    return { sixMonth: null, twelveMonth: null, twentyFourMonth: null };
  }
  
  const gt = growthTargets as Record<string, unknown>;
  
  // Priority: new format (6_month) > legacy format (six_month_targets)
  const sixMonth = (gt["6_month"] ?? gt["six_month_targets"] ?? null) as GrowthTargetMetrics | null;
  const twelveMonth = (gt["12_month"] ?? gt["twelve_month_targets"] ?? null) as GrowthTargetMetrics | null;
  const twentyFourMonth = (gt["24_month"] ?? gt["twenty_four_month_targets"] ?? null) as GrowthTargetMetrics | null;
  
  return {
    sixMonth,
    twelveMonth,
    twentyFourMonth,
  };
}

/**
 * Safely extracts a metric value from growth target
 * Handles both string values ("$35,000-55,000") and direct objects
 */
export function extractMetricFromTarget(
  target: GrowthTargetMetrics | null,
  key: keyof GrowthTargetMetrics
): string | null {
  if (!target) return null;
  const value = target[key];
  if (value === undefined || value === null) return null;
  return String(value);
}
