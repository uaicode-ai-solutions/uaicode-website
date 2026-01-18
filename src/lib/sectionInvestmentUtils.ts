/**
 * Utilities for accessing section_investment JSON data from reports
 */

import { ReportData } from "@/types/report";

// ==========================================
// Section Investment Types
// ==========================================

export interface DiscountStrategy {
  discount_24h_percent: number;
  discount_7d_percent: number;
  discount_30d_percent: number;
  bundle_discount_percent: number;
  price_24h_cents: number;
  price_7d_cents: number;
  price_30d_cents: number;
  bundle_price_cents: number;
  savings_24h_cents: number;
  savings_7d_cents: number;
  savings_30d_cents: number;
  savings_bundle_cents: number;
  savings_vs_traditional_24h_cents: number;
  savings_vs_traditional_24h_percent: number;
}

export interface InvestmentBreakdownJson {
  front_cents: number;
  back_cents: number;
  integrations_cents: number;
  infra_cents: number;
  testing_cents: number;
}

export interface SectionInvestment {
  wizard_id: string;
  saas_name: string;
  mvp_tier: string;
  selected_features: string[];
  feature_counts: { starter: number; growth: number; enterprise: number };
  investment_one_payment_cents: number;
  investment_one_payment_cents_traditional: number;
  investment_breakdown: InvestmentBreakdownJson;
  savings_amount_cents: number;
  savings_percentage: number;
  savings_marketing_months: number;
  delivery_days_uaicode_min: number;
  delivery_days_uaicode_max: number;
  delivery_days_traditional_min: number;
  delivery_days_traditional_max: number;
  delivery_weeks_uaicode_min: number;
  delivery_weeks_uaicode_max: number;
  delivery_weeks_traditional_min: number;
  delivery_weeks_traditional_max: number;
  discount_strategy: DiscountStrategy;
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Parses section_investment from reportData with fallback to null
 */
export function getSectionInvestment(reportData: ReportData | null | undefined): SectionInvestment | null {
  if (!reportData?.section_investment) return null;

  // If it's already an object, return it
  if (typeof reportData.section_investment === 'object') {
    return reportData.section_investment as SectionInvestment;
  }

  // If it's a string, try to parse it
  if (typeof reportData.section_investment === 'string') {
    try {
      return JSON.parse(reportData.section_investment) as SectionInvestment;
    } catch {
      console.error('Failed to parse section_investment JSON');
      return null;
    }
  }

  return null;
}

/**
 * Formats min-max weeks as a string (e.g., "13-18 weeks")
 */
export function formatDeliveryWeeks(min: number, max: number): string {
  if (min === max) {
    return `${min} weeks`;
  }
  return `${min}-${max} weeks`;
}

/**
 * Gets investment breakdown from section_investment JSONB only (no legacy fallbacks)
 */
export function getInvestmentBreakdown(
  _reportData: ReportData | null | undefined,
  sectionInvestment: SectionInvestment | null
): {
  onePayment: number | null;
  frontend: number | null;
  backend: number | null;
  integrations: number | null;
  infra: number | null;
  testing: number | null;
} {
  // Use section_investment data exclusively
  if (sectionInvestment?.investment_breakdown) {
    return {
      onePayment: sectionInvestment.investment_one_payment_cents,
      frontend: sectionInvestment.investment_breakdown.front_cents,
      backend: sectionInvestment.investment_breakdown.back_cents,
      integrations: sectionInvestment.investment_breakdown.integrations_cents,
      infra: sectionInvestment.investment_breakdown.infra_cents,
      testing: sectionInvestment.investment_breakdown.testing_cents,
    };
  }

  // Return nulls if no section_investment data
  return {
    onePayment: null,
    frontend: null,
    backend: null,
    integrations: null,
    infra: null,
    testing: null,
  };
}

/**
 * Gets pricing comparison data from section_investment JSONB only (no legacy fallbacks)
 */
export function getPricingComparison(
  _reportData: ReportData | null | undefined,
  sectionInvestment: SectionInvestment | null
): {
  uaicodePrice: number;
  traditionalPrice: number;
  savingsPercentage: number;
  savingsAmount: number;
  marketingMonths: number;
  deliveryUaicode: string;
  deliveryTraditional: string;
} {
  // Use section_investment data exclusively
  if (sectionInvestment) {
    return {
      uaicodePrice: sectionInvestment.investment_one_payment_cents,
      traditionalPrice: sectionInvestment.investment_one_payment_cents_traditional,
      savingsPercentage: sectionInvestment.savings_percentage,
      savingsAmount: sectionInvestment.savings_amount_cents,
      marketingMonths: sectionInvestment.savings_marketing_months,
      deliveryUaicode: formatDeliveryWeeks(
        sectionInvestment.delivery_weeks_uaicode_min,
        sectionInvestment.delivery_weeks_uaicode_max
      ),
      deliveryTraditional: formatDeliveryWeeks(
        sectionInvestment.delivery_weeks_traditional_min,
        sectionInvestment.delivery_weeks_traditional_max
      ),
    };
  }

  // Return defaults if no section_investment data
  return {
    uaicodePrice: 0,
    traditionalPrice: 0,
    savingsPercentage: 0,
    savingsAmount: 0,
    marketingMonths: 0,
    deliveryUaicode: "...",
    deliveryTraditional: "...",
  };
}

/**
 * Gets discount strategy with defaults
 */
export function getDiscountStrategy(
  sectionInvestment: SectionInvestment | null,
  mvpPriceCents: number
): DiscountStrategy {
  // If we have discount_strategy from JSON, use it
  if (sectionInvestment?.discount_strategy) {
    return sectionInvestment.discount_strategy;
  }

  // Fallback to calculated defaults (10%, 15%, 20%, 25% bundle)
  const price10 = Math.round(mvpPriceCents * 0.90);
  const price15 = Math.round(mvpPriceCents * 0.85);
  const price20 = Math.round(mvpPriceCents * 0.80);
  const bundle = Math.round(mvpPriceCents * 0.75);

  return {
    discount_24h_percent: 20,
    discount_7d_percent: 15,
    discount_30d_percent: 10,
    bundle_discount_percent: 25,
    price_24h_cents: price20,
    price_7d_cents: price15,
    price_30d_cents: price10,
    bundle_price_cents: bundle,
    savings_24h_cents: mvpPriceCents - price20,
    savings_7d_cents: mvpPriceCents - price15,
    savings_30d_cents: mvpPriceCents - price10,
    savings_bundle_cents: mvpPriceCents - bundle,
    savings_vs_traditional_24h_cents: 0,
    savings_vs_traditional_24h_percent: 0,
  };
}
