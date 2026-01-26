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
    if (typeof heroScore.score !== 'number' || heroScore.score === 0) {
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
    
    // Check demand signals parsing
    const demandSignals = getNestedValue(opportunity, 'demand_signals') as Record<string, unknown> | undefined;
    if (demandSignals) {
      const monthlySearches = demandSignals.monthly_searches;
      const monthlySearchesNumeric = demandSignals.monthly_searches_numeric;
      
      if (hasParsingIssue(monthlySearches, monthlySearchesNumeric)) {
        issues.push({
          id: 'monthly_searches_parsing',
          type: 'parsing',
          severity: 'info',
          field: 'monthly_searches',
          jsonPath: 'opportunity_section.demand_signals.monthly_searches',
          dbColumn: 'opportunity_section',
          currentValue: { text: monthlySearches, numeric: monthlySearchesNumeric },
          message: 'Monthly searches numeric value could not be parsed'
        });
      }
      
      // Check social mentions parsing
      const socialMentions = demandSignals.social_mentions as Record<string, unknown> | undefined;
      if (socialMentions) {
        const mentions = socialMentions.monthly_mentions;
        const mentionsNumeric = socialMentions.monthly_mentions_numeric;
        
        if (hasParsingIssue(mentions, mentionsNumeric)) {
          issues.push({
            id: 'social_mentions_parsing',
            type: 'parsing',
            severity: 'info',
            field: 'monthly_mentions',
            jsonPath: 'opportunity_section.demand_signals.social_mentions.monthly_mentions',
            dbColumn: 'opportunity_section',
            currentValue: { text: mentions, numeric: mentionsNumeric },
            message: 'Social mentions numeric value could not be parsed'
          });
        }
      }
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
    const competitors = competitive.competitors as unknown[] | undefined;
    if (!competitors || competitors.length === 0) {
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
    const personas = icp.primary_personas as unknown[] | undefined;
    if (!personas || personas.length === 0) {
      issues.push({
        id: 'personas_missing',
        type: 'missing',
        severity: 'info',
        field: 'primary_personas',
        jsonPath: 'icp_intelligence_section.primary_personas',
        dbColumn: 'icp_intelligence_section',
        currentValue: personas ?? null,
        message: 'Customer personas list is empty'
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
    if (!price.pricing_strategy) {
      issues.push({
        id: 'pricing_strategy_missing',
        type: 'missing',
        severity: 'info',
        field: 'pricing_strategy',
        jsonPath: 'price_intelligence_section.pricing_strategy',
        dbColumn: 'price_intelligence_section',
        currentValue: price.pricing_strategy ?? null,
        message: 'Pricing strategy is missing'
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
    const channels = paidMedia.channels as unknown[] | undefined;
    if (!channels || channels.length === 0) {
      issues.push({
        id: 'paid_media_channels_missing',
        type: 'missing',
        severity: 'info',
        field: 'channels',
        jsonPath: 'paid_media_intelligence_section.channels',
        dbColumn: 'paid_media_intelligence_section',
        currentValue: channels ?? null,
        message: 'Paid media channels list is empty'
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
    if (!growth.growth_targets) {
      issues.push({
        id: 'growth_targets_missing',
        type: 'missing',
        severity: 'info',
        field: 'growth_targets',
        jsonPath: 'growth_intelligence_section.growth_targets',
        dbColumn: 'growth_intelligence_section',
        currentValue: growth.growth_targets ?? null,
        message: 'Growth targets are missing'
      });
    }
  }
  
  // ========================================
  // 10. BENCHMARK SECTION
  // ========================================
  const benchmark = reportData.benchmark_section as Record<string, unknown> | null;
  if (isEmptyJsonb(benchmark)) {
    issues.push({
      id: 'benchmark_section_empty',
      type: 'missing',
      severity: 'warning',
      field: 'benchmark_section',
      jsonPath: 'benchmark_section',
      dbColumn: 'benchmark_section',
      currentValue: benchmark,
      message: 'Market benchmarks are missing'
    });
  } else if (benchmark) {
    if (!benchmark.market_benchmarks) {
      issues.push({
        id: 'market_benchmarks_missing',
        type: 'missing',
        severity: 'info',
        field: 'market_benchmarks',
        jsonPath: 'benchmark_section.market_benchmarks',
        dbColumn: 'benchmark_section',
        currentValue: benchmark.market_benchmarks ?? null,
        message: 'Market benchmark data is missing'
      });
    }
  }
  
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
