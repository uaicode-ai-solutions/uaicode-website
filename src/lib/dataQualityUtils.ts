// ============================================
// Data Quality Utils - Check report data for parsing/missing issues
// ============================================

import { ReportData } from "@/types/report";

export interface DataQualityIssue {
  id: string;
  type: 'parsing' | 'missing' | 'incomplete';
  severity: 'warning' | 'info';
  field: string;           // Campo específico (ex: "score")
  jsonPath: string;        // Caminho completo no JSON (ex: "hero_score_section.score")
  dbColumn: string;        // Coluna da tabela tb_pms_reports
  currentValue?: unknown;  // Valor atual encontrado (para debug)
  message: string;
}

/**
 * Helper to check if a JSONB value is empty (null, undefined, empty object, empty array)
 */
function isEmptyJsonb(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.length === 0;
  return Object.keys(value as object).length === 0;
}

/**
 * Safely access nested object properties
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Check if a value has text but its numeric counterpart is zero/missing
 */
function hasParsingIssue(textValue: unknown, numericValue: unknown): boolean {
  const hasText = typeof textValue === 'string' && textValue.trim().length > 0;
  const hasNumeric = typeof numericValue === 'number' && numericValue > 0;
  return hasText && !hasNumeric;
}

/**
 * Check report data quality and return list of issues
 * Verifies all 10 JSONB columns from tb_pms_reports
 */
export function checkDataQuality(reportData: ReportData | null | undefined): DataQualityIssue[] {
  if (!reportData) return [];
  
  const issues: DataQualityIssue[] = [];
  
  // ========================================
  // 1. HERO SCORE SECTION
  // ========================================
  const heroScore = reportData.hero_score_section as Record<string, unknown> | null;
  if (isEmptyJsonb(heroScore)) {
    issues.push({
      id: 'hero_score_section_empty',
      type: 'missing',
      severity: 'warning',
      field: 'hero_score_section',
      jsonPath: 'hero_score_section',
      dbColumn: 'hero_score_section',
      currentValue: heroScore,
      message: 'Viability score section is missing'
    });
  } else if (heroScore) {
    // Check specific critical fields
    if (typeof heroScore.score !== 'number') {
      issues.push({
        id: 'hero_score_missing',
        type: 'missing',
        severity: 'warning',
        field: 'score',
        jsonPath: 'hero_score_section.score',
        dbColumn: 'hero_score_section',
        currentValue: heroScore.score ?? null,
        message: 'Overall viability score is missing'
      });
    }
  }
  
  // ========================================
  // 2. SUMMARY SECTION
  // ========================================
  const summary = reportData.summary_section as Record<string, unknown> | null;
  if (isEmptyJsonb(summary)) {
    issues.push({
      id: 'summary_section_empty',
      type: 'missing',
      severity: 'warning',
      field: 'summary_section',
      jsonPath: 'summary_section',
      dbColumn: 'summary_section',
      currentValue: summary,
      message: 'Executive summary is missing'
    });
  } else if (summary) {
    if (!summary.verdict || (typeof summary.verdict === 'string' && summary.verdict.trim() === '')) {
      issues.push({
        id: 'summary_verdict_missing',
        type: 'missing',
        severity: 'warning',
        field: 'verdict',
        jsonPath: 'summary_section.verdict',
        dbColumn: 'summary_section',
        currentValue: summary.verdict ?? null,
        message: 'Executive verdict is missing'
      });
    }
  }
  
  // ========================================
  // 3. SECTION INVESTMENT
  // ========================================
  const investment = reportData.section_investment as Record<string, unknown> | null;
  if (isEmptyJsonb(investment)) {
    issues.push({
      id: 'section_investment_empty',
      type: 'missing',
      severity: 'warning',
      field: 'section_investment',
      jsonPath: 'section_investment',
      dbColumn: 'section_investment',
      currentValue: investment,
      message: 'Investment breakdown is missing'
    });
  } else if (investment) {
    if (!investment.investment_one_payment_cents) {
      issues.push({
        id: 'investment_missing',
        type: 'missing',
        severity: 'warning',
        field: 'investment_one_payment_cents',
        jsonPath: 'section_investment.investment_one_payment_cents',
        dbColumn: 'section_investment',
        currentValue: investment.investment_one_payment_cents ?? null,
        message: 'Investment calculation is missing'
      });
    }
  }
  
  // ========================================
  // 4. OPPORTUNITY SECTION
  // ========================================
  const opportunity = reportData.opportunity_section as Record<string, unknown> | null;
  if (isEmptyJsonb(opportunity)) {
    issues.push({
      id: 'opportunity_section_empty',
      type: 'missing',
      severity: 'warning',
      field: 'opportunity_section',
      jsonPath: 'opportunity_section',
      dbColumn: 'opportunity_section',
      currentValue: opportunity,
      message: 'Market opportunity data is missing'
    });
  } else if (opportunity) {
    // Check for TAM/SAM/SOM
    const hasTam = opportunity.tam_value && String(opportunity.tam_value).trim() !== '';
    const hasSam = opportunity.sam_value && String(opportunity.sam_value).trim() !== '';
    const hasSom = opportunity.som_value && String(opportunity.som_value).trim() !== '';
    
    if (!hasTam && !hasSam && !hasSom) {
      issues.push({
        id: 'opportunity_market_size_missing',
        type: 'missing',
        severity: 'info',
        field: 'tam_value',
        jsonPath: 'opportunity_section.tam_value',
        dbColumn: 'opportunity_section',
        currentValue: { tam: opportunity.tam_value, sam: opportunity.sam_value, som: opportunity.som_value },
        message: 'Market size values (TAM/SAM/SOM) are missing'
      });
    }
    
    // Check demand signals - simplified validation (text fields are sufficient)
    // Note: monthly_searches_numeric is not always present, so we only check for text values
    const hasMonthlySearches = opportunity.monthly_searches && String(opportunity.monthly_searches).trim() !== '';
    const hasSearchTrend = opportunity.search_trend && String(opportunity.search_trend).trim() !== '';
    const hasDemandEvidence = opportunity.demand_evidence && typeof opportunity.demand_evidence === 'object';
    
    if (!hasMonthlySearches && !hasSearchTrend && !hasDemandEvidence) {
      issues.push({
        id: 'demand_signals_missing',
        type: 'missing',
        severity: 'info',
        field: 'demand_signals',
        jsonPath: 'opportunity_section.monthly_searches',
        dbColumn: 'opportunity_section',
        currentValue: { monthly_searches: opportunity.monthly_searches, search_trend: opportunity.search_trend },
        message: 'Demand signals data is missing'
      });
    }
    
    // Check macro trends strength values
    const macroTrends = opportunity.macro_trends as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(macroTrends) && macroTrends.length > 0) {
      const allInvalidStrength = macroTrends.every(trend => {
        const strengthValid = trend.strength_valid;
        const strengthNumeric = trend.strength_numeric;
        return strengthValid === false || (typeof strengthNumeric === 'number' && strengthNumeric === 0);
      });
      
      if (allInvalidStrength) {
        issues.push({
          id: 'macro_trends_strength',
          type: 'parsing',
          severity: 'info',
          field: 'strength',
          jsonPath: 'opportunity_section.macro_trends[*].strength',
          dbColumn: 'opportunity_section',
          currentValue: macroTrends.map(t => ({ strength: t.strength, strength_numeric: t.strength_numeric })),
          message: 'Macro trends strength values could not be validated'
        });
      }
    }
  }
  
  // ========================================
  // 5. COMPETITIVE ANALYSIS SECTION
  // ========================================
  const competitive = reportData.competitive_analysis_section as Record<string, unknown> | null;
  if (isEmptyJsonb(competitive)) {
    issues.push({
      id: 'competitive_analysis_empty',
      type: 'missing',
      severity: 'warning',
      field: 'competitive_analysis_section',
      jsonPath: 'competitive_analysis_section',
      dbColumn: 'competitive_analysis_section',
      currentValue: competitive,
      message: 'Competitive analysis is missing'
    });
  } else if (competitive) {
    // n8n sends competitors as object {competitor_1: {...}, competitor_2: {...}} OR array
    const competitors = competitive.competitors;
    const hasCompetitors = Array.isArray(competitors)
      ? competitors.length > 0
      : (competitors && typeof competitors === 'object' && Object.keys(competitors).length > 0);
    
    if (!hasCompetitors) {
      issues.push({
        id: 'competitors_missing',
        type: 'missing',
        severity: 'info',
        field: 'competitors',
        jsonPath: 'competitive_analysis_section.competitors',
        dbColumn: 'competitive_analysis_section',
        currentValue: competitors ?? null,
        message: 'Competitor list is empty'
      });
    }
  }
  
  // ========================================
  // 6. ICP INTELLIGENCE SECTION
  // ========================================
  const icp = reportData.icp_intelligence_section as Record<string, unknown> | null;
  if (isEmptyJsonb(icp)) {
    issues.push({
      id: 'icp_intelligence_empty',
      type: 'missing',
      severity: 'warning',
      field: 'icp_intelligence_section',
      jsonPath: 'icp_intelligence_section',
      dbColumn: 'icp_intelligence_section',
      currentValue: icp,
      message: 'Customer persona data is missing'
    });
  } else if (icp) {
    // UI uses persona + demographics (n8n v1.7.0+) OR primary_personas (legacy)
    const hasPersonas = icp.primary_personas && Array.isArray(icp.primary_personas) && (icp.primary_personas as unknown[]).length > 0;
    const hasLegacyPersona = icp.persona && typeof icp.persona === 'object';
    const hasDemographics = icp.demographics && typeof icp.demographics === 'object';
    
    if (!hasPersonas && !hasLegacyPersona && !hasDemographics) {
      issues.push({
        id: 'personas_missing',
        type: 'missing',
        severity: 'info',
        field: 'primary_personas',
        jsonPath: 'icp_intelligence_section.primary_personas',
        dbColumn: 'icp_intelligence_section',
        currentValue: { primary_personas: icp.primary_personas, persona: icp.persona, demographics: icp.demographics },
        message: 'Customer persona data is missing'
      });
    }
  }
  
  // ========================================
  // 7. PRICE INTELLIGENCE SECTION
  // ========================================
  const price = reportData.price_intelligence_section as Record<string, unknown> | null;
  if (isEmptyJsonb(price)) {
    issues.push({
      id: 'price_intelligence_empty',
      type: 'missing',
      severity: 'warning',
      field: 'price_intelligence_section',
      jsonPath: 'price_intelligence_section',
      dbColumn: 'price_intelligence_section',
      currentValue: price,
      message: 'Pricing intelligence is missing'
    });
  } else if (price) {
    // UI uses unit_economics and recommended_model (via useFinancialMetrics)
    const hasUnitEconomics = price.unit_economics && typeof price.unit_economics === 'object';
    const hasRecommendedModel = price.recommended_model && String(price.recommended_model).trim() !== '';
    
    if (!hasUnitEconomics && !hasRecommendedModel) {
      issues.push({
        id: 'pricing_data_missing',
        type: 'missing',
        severity: 'info',
        field: 'unit_economics',
        jsonPath: 'price_intelligence_section.unit_economics',
        dbColumn: 'price_intelligence_section',
        currentValue: { unit_economics: price.unit_economics, recommended_model: price.recommended_model },
        message: 'Pricing unit economics data is missing'
      });
    }
  }
  
  // ========================================
  // 8. PAID MEDIA INTELLIGENCE SECTION
  // ========================================
  const paidMedia = reportData.paid_media_intelligence_section as Record<string, unknown> | null;
  if (isEmptyJsonb(paidMedia)) {
    issues.push({
      id: 'paid_media_empty',
      type: 'missing',
      severity: 'warning',
      field: 'paid_media_intelligence_section',
      jsonPath: 'paid_media_intelligence_section',
      dbColumn: 'paid_media_intelligence_section',
      currentValue: paidMedia,
      message: 'Paid media analysis is missing'
    });
  } else if (paidMedia) {
    // UI uses performance_targets and budget_strategy (via useFinancialMetrics)
    const hasPerformanceTargets = paidMedia.performance_targets && typeof paidMedia.performance_targets === 'object';
    const hasBudgetStrategy = paidMedia.budget_strategy && typeof paidMedia.budget_strategy === 'object';
    
    if (!hasPerformanceTargets && !hasBudgetStrategy) {
      issues.push({
        id: 'paid_media_targets_missing',
        type: 'missing',
        severity: 'info',
        field: 'performance_targets',
        jsonPath: 'paid_media_intelligence_section.performance_targets',
        dbColumn: 'paid_media_intelligence_section',
        currentValue: { performance_targets: paidMedia.performance_targets, budget_strategy: paidMedia.budget_strategy },
        message: 'Paid media targets are missing'
      });
    }
  }
  
  // ========================================
  // 9. GROWTH INTELLIGENCE SECTION
  // ========================================
  const growth = reportData.growth_intelligence_section as Record<string, unknown> | null;
  if (isEmptyJsonb(growth)) {
    issues.push({
      id: 'growth_intelligence_empty',
      type: 'missing',
      severity: 'warning',
      field: 'growth_intelligence_section',
      jsonPath: 'growth_intelligence_section',
      dbColumn: 'growth_intelligence_section',
      currentValue: growth,
      message: 'Growth projections are missing'
    });
  } else if (growth) {
    // UI prioritizes financial_metrics (n8n v1.7.0+) over growth_targets (legacy)
    const hasFinancialMetrics = growth.financial_metrics && typeof growth.financial_metrics === 'object';
    const hasGrowthTargets = growth.growth_targets && typeof growth.growth_targets === 'object';
    
    if (!hasFinancialMetrics && !hasGrowthTargets) {
      issues.push({
        id: 'growth_data_missing',
        type: 'missing',
        severity: 'info',
        field: 'financial_metrics',
        jsonPath: 'growth_intelligence_section.financial_metrics',
        dbColumn: 'growth_intelligence_section',
        currentValue: { financial_metrics: growth.financial_metrics, growth_targets: growth.growth_targets },
        message: 'Financial metrics and growth targets are missing'
      });
    }
  }
  
  // ========================================
  // 10. BENCHMARK SECTION - REMOVED
  // ========================================
  // Note: benchmark_section is 100% internal to n8n workflows
  // It is NOT used in any UI component, only for validation/capping calculations
  // Therefore, we do not validate it here to avoid false positives
  
  
  return issues;
}

/**
 * Get a human-readable summary of issues
 */
export function getIssuesSummary(issues: DataQualityIssue[]): string {
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;
  
  if (warningCount === 0 && infoCount === 0) return '';
  
  const parts: string[] = [];
  if (warningCount > 0) parts.push(`${warningCount} warning${warningCount > 1 ? 's' : ''}`);
  if (infoCount > 0) parts.push(`${infoCount} minor issue${infoCount > 1 ? 's' : ''}`);
  
  return parts.join(' and ');
}

/**
 * Check if issues are critical (affecting key metrics)
 */
export function hasCriticalIssues(issues: DataQualityIssue[]): boolean {
  const criticalIds = [
    // Entire sections empty (critical)
    'hero_score_section_empty',
    'summary_section_empty',
    'section_investment_empty',
    'opportunity_section_empty',
    // Specific critical fields missing
    'hero_score_missing',
    'summary_verdict_missing',
    'investment_missing'
  ];
  return issues.some(issue => criticalIds.includes(issue.id));
}
