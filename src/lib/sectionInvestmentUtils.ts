/**
 * Utilities for accessing section_investment JSON data from reports
 */

import { ReportData } from "@/types/report";
import { safeNumber } from "@/lib/financialParsingUtils";

// ==========================================
// Section Investment Types
// ==========================================

// NEW: Individual discount item from tb_pms_discount_strategy
export interface DiscountItem {
  name: string;
  percent: number;
  price_cents: number;
  validity_hours: number | null;
  bonus_support_days: number;
}

// NEW: Map of discounts by discount_id (new n8n format)
export interface DiscountStrategyMap {
  flash_24h: DiscountItem;
  week: DiscountItem;
  month: DiscountItem;
  bundle: DiscountItem;
  best_current?: string;
}

// LEGACY: Old flat format (for backward compatibility)
export interface DiscountStrategyLegacy {
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

// Support both old keys (front_cents) and new keys (frontend)
export interface InvestmentBreakdownJson {
  // New n8n keys
  frontend?: number;
  backend?: number;
  integrations?: number;
  infra?: number;
  testing?: number;
  // Legacy keys
  front_cents?: number;
  back_cents?: number;
  integrations_cents?: number;
  infra_cents?: number;
  testing_cents?: number;
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
  // Union type: supports both new DiscountStrategyMap and legacy flat format
  discount_strategy: DiscountStrategyMap | DiscountStrategyLegacy;
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
 * Gets investment breakdown from section_investment JSONB
 * Supports both new keys (frontend, backend) and legacy keys (front_cents, back_cents)
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
  if (sectionInvestment?.investment_breakdown) {
    const breakdown = sectionInvestment.investment_breakdown;
    const onePaymentValue = safeNumber(sectionInvestment.investment_one_payment_cents, 0);
    
    // Support both new keys and legacy keys
    const frontendValue = safeNumber(breakdown.frontend ?? breakdown.front_cents, 0);
    const backendValue = safeNumber(breakdown.backend ?? breakdown.back_cents, 0);
    const integrationsValue = safeNumber(breakdown.integrations ?? breakdown.integrations_cents, 0);
    const infraValue = safeNumber(breakdown.infra ?? breakdown.infra_cents, 0);
    const testingValue = safeNumber(breakdown.testing ?? breakdown.testing_cents, 0);
    
    return {
      onePayment: onePaymentValue > 0 ? onePaymentValue : null,
      frontend: frontendValue > 0 ? frontendValue : null,
      backend: backendValue > 0 ? backendValue : null,
      integrations: integrationsValue > 0 ? integrationsValue : null,
      infra: infraValue > 0 ? infraValue : null,
      testing: testingValue > 0 ? testingValue : null,
    };
  }

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
 * Type guard to check if discount_strategy is the new DiscountStrategyMap format
 */
function isDiscountStrategyMap(ds: DiscountStrategyMap | DiscountStrategyLegacy): ds is DiscountStrategyMap {
  return (ds as DiscountStrategyMap).flash_24h !== undefined;
}

/**
 * Gets discount strategy normalized to DiscountStrategyMap format
 * Supports both new n8n format and legacy flat format
 */
export function getDiscountStrategy(
  sectionInvestment: SectionInvestment | null,
  mvpPriceCents: number
): DiscountStrategyMap {
  const safeMvpPriceCents = safeNumber(mvpPriceCents, 0);
  
  if (sectionInvestment?.discount_strategy) {
    const ds = sectionInvestment.discount_strategy;
    
    // NEW FORMAT: Already has flash_24h, week, month, bundle as objects
    if (isDiscountStrategyMap(ds)) {
      return {
        flash_24h: {
          name: ds.flash_24h.name || "Flash Deal 24h",
          percent: safeNumber(ds.flash_24h.percent, 25),
          price_cents: safeNumber(ds.flash_24h.price_cents, 0),
          validity_hours: ds.flash_24h.validity_hours ?? 24,
          bonus_support_days: safeNumber(ds.flash_24h.bonus_support_days, 15),
        },
        week: {
          name: ds.week.name || "First Week Special",
          percent: safeNumber(ds.week.percent, 15),
          price_cents: safeNumber(ds.week.price_cents, 0),
          validity_hours: ds.week.validity_hours ?? 168,
          bonus_support_days: safeNumber(ds.week.bonus_support_days, 7),
        },
        month: {
          name: ds.month.name || "First Month Offer",
          percent: safeNumber(ds.month.percent, 10),
          price_cents: safeNumber(ds.month.price_cents, 0),
          validity_hours: ds.month.validity_hours ?? 720,
          bonus_support_days: safeNumber(ds.month.bonus_support_days, 0),
        },
        bundle: {
          name: ds.bundle.name || "MVP + Marketing Bundle",
          percent: safeNumber(ds.bundle.percent, 30),
          price_cents: safeNumber(ds.bundle.price_cents, 0),
          validity_hours: ds.bundle.validity_hours,
          bonus_support_days: safeNumber(ds.bundle.bonus_support_days, 30),
        },
        best_current: ds.best_current,
      };
    }
    
    // LEGACY FORMAT: Convert flat keys to new structure
    const legacy = ds as DiscountStrategyLegacy;
    return {
      flash_24h: {
        name: "Flash Deal 24h",
        percent: safeNumber(legacy.discount_24h_percent, 25),
        price_cents: safeNumber(legacy.price_24h_cents, 0),
        validity_hours: 24,
        bonus_support_days: 15,
      },
      week: {
        name: "First Week Special",
        percent: safeNumber(legacy.discount_7d_percent, 15),
        price_cents: safeNumber(legacy.price_7d_cents, 0),
        validity_hours: 168,
        bonus_support_days: 7,
      },
      month: {
        name: "First Month Offer",
        percent: safeNumber(legacy.discount_30d_percent, 10),
        price_cents: safeNumber(legacy.price_30d_cents, 0),
        validity_hours: 720,
        bonus_support_days: 0,
      },
      bundle: {
        name: "MVP + Marketing Bundle",
        percent: safeNumber(legacy.bundle_discount_percent, 30),
        price_cents: safeNumber(legacy.bundle_price_cents, 0),
        validity_hours: null,
        bonus_support_days: 30,
      },
    };
  }

  // FALLBACK: Calculate defaults when no discount_strategy exists
  return {
    flash_24h: {
      name: "Flash Deal 24h",
      percent: 25,
      price_cents: Math.round(safeMvpPriceCents * 0.75),
      validity_hours: 24,
      bonus_support_days: 15,
    },
    week: {
      name: "First Week Special",
      percent: 15,
      price_cents: Math.round(safeMvpPriceCents * 0.85),
      validity_hours: 168,
      bonus_support_days: 7,
    },
    month: {
      name: "First Month Offer",
      percent: 10,
      price_cents: Math.round(safeMvpPriceCents * 0.90),
      validity_hours: 720,
      bonus_support_days: 0,
    },
    bundle: {
      name: "MVP + Marketing Bundle",
      percent: 30,
      price_cents: Math.round(safeMvpPriceCents * 0.70),
      validity_hours: null,
      bonus_support_days: 30,
    },
  };
}

/**
 * Helper to calculate savings for a discount
 */
export function getDiscountSavings(basePrice: number, discountItem: DiscountItem): number {
  return basePrice - discountItem.price_cents;
}
