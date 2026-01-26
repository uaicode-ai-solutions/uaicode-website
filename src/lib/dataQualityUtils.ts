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
 */
export function checkDataQuality(reportData: ReportData | null | undefined): DataQualityIssue[] {
  if (!reportData) return [];
  
  const issues: DataQualityIssue[] = [];
  const opportunity = reportData.opportunity_section as Record<string, unknown> | null;
  
  // 1. Check monthly_searches parsing
  if (opportunity) {
    const demandSignals = getNestedValue(opportunity, 'demand_signals') as Record<string, unknown> | undefined;
    if (demandSignals) {
      const monthlySearches = demandSignals.monthly_searches;
      const monthlySearchesNumeric = demandSignals.monthly_searches_numeric;
      
      if (hasParsingIssue(monthlySearches, monthlySearchesNumeric)) {
        issues.push({
          id: 'monthly_searches_parsing',
          type: 'parsing',
          severity: 'warning',
          field: 'monthly_searches',
          jsonPath: 'opportunity_section.demand_signals.monthly_searches',
          dbColumn: 'opportunity_section',
          currentValue: { text: monthlySearches, numeric: monthlySearchesNumeric },
          message: 'Monthly searches numeric value could not be parsed'
        });
      }
      
      // 2. Check social_mentions parsing
      const socialMentions = demandSignals.social_mentions as Record<string, unknown> | undefined;
      if (socialMentions) {
        const mentions = socialMentions.monthly_mentions;
        const mentionsNumeric = socialMentions.monthly_mentions_numeric;
        
        if (hasParsingIssue(mentions, mentionsNumeric)) {
          issues.push({
            id: 'social_mentions_parsing',
            type: 'parsing',
            severity: 'warning',
            field: 'monthly_mentions',
            jsonPath: 'opportunity_section.demand_signals.social_mentions.monthly_mentions',
            dbColumn: 'opportunity_section',
            currentValue: { text: mentions, numeric: mentionsNumeric },
            message: 'Social mentions numeric value could not be parsed'
          });
        }
      }
    }
    
    // 3. Check macro_trends strength values
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
  
  // 4. Check hero_score_section
  const heroScore = reportData.hero_score_section as Record<string, unknown> | null;
  if (!heroScore || (typeof heroScore.score !== 'number') || heroScore.score === 0) {
    issues.push({
      id: 'hero_score_missing',
      type: 'missing',
      severity: 'warning',
      field: 'score',
      jsonPath: 'hero_score_section.score',
      dbColumn: 'hero_score_section',
      currentValue: heroScore?.score ?? null,
      message: 'Overall viability score is missing'
    });
  }
  
  // 5. Check summary_section
  const summary = reportData.summary_section as Record<string, unknown> | null;
  if (!summary || !summary.verdict || (typeof summary.verdict === 'string' && summary.verdict.trim() === '')) {
    issues.push({
      id: 'summary_verdict_missing',
      type: 'missing',
      severity: 'warning',
      field: 'verdict',
      jsonPath: 'summary_section.verdict',
      dbColumn: 'summary_section',
      currentValue: summary?.verdict ?? null,
      message: 'Executive verdict is missing'
    });
  }
  
  // 6. Check section_investment
  const investment = reportData.section_investment as Record<string, unknown> | null;
  if (!investment || !investment.investment_one_payment_cents) {
    issues.push({
      id: 'investment_missing',
      type: 'missing',
      severity: 'warning',
      field: 'investment_one_payment_cents',
      jsonPath: 'section_investment.investment_one_payment_cents',
      dbColumn: 'section_investment',
      currentValue: investment?.investment_one_payment_cents ?? null,
      message: 'Investment calculation is missing'
    });
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
  const criticalIds = ['hero_score_missing', 'summary_verdict_missing', 'investment_missing'];
  return issues.some(issue => criticalIds.includes(issue.id));
}
