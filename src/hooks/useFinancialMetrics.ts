// ============================================
// useFinancialMetrics Hook
// Extracts and calculates financial metrics from JSONB fields
// With REALISTIC VALIDATION against market benchmarks
// Now supports dynamic benchmarks from n8n research pipeline
// ============================================

import { useMemo } from "react";
import { ReportData } from "@/types/report";
import {
  parseMoneyValue,
  parsePercentageRange,
  parseCentsToUSD,
  formatCurrency,
  safeGet,
  smartExtractMRR,
  smartExtractARR,
  smartExtractChurn,
  smartExtractCustomers,
  extractCACFromText,
  extractRatioFromText,
  extractMarketingBudgetFromText,
  validateFinancialMetric,
  sanitizeNumericValue,
  normalizeChurnToMonthly,
  interpolateMRRFromTargets,
  MoneyRange,
  PercentageRange,
} from "@/lib/financialParsingUtils";
import {
  validateFinancialProjections,
  generateValidatedProjections,
  generateValidatedScenarios,
  MARKET_BENCHMARKS,
  getBenchmarks,
} from "@/lib/financialValidationUtils";
import { useBenchmarks } from "@/hooks/useBenchmarks";
import { debugLogger } from "@/lib/debugLogger";
import { DataSourceType, DataSources, defaultDataSources } from "@/components/planningmysaas/dashboard/ui/DataSourceBadge";

// ============================================
// Types
// ============================================

export interface FinancialMetrics {
  // Key metrics
  breakEvenMonths: string;
  roiYear1: string;
  mrrMonth12: string;
  arrProjected: string;
  ltvCacRatio: string;
  
  // Numeric values for calculations
  breakEvenMonthsNum: number | null;
  roiYear1Num: number | null;
  mrrMonth12Num: number | null;
  arrProjectedNum: number | null;
  ltvCacRatioNum: number | null;
  ltvCacCalculated: number | null;
  
  // MRR Evolution
  mrr6Months: MoneyRange | null;
  mrr12Months: MoneyRange | null;
  mrr24Months: MoneyRange | null;
  
  // ARR Evolution
  arr12Months: MoneyRange | null;
  arr24Months: MoneyRange | null;
  
  // Customers
  customers6Months: MoneyRange | null;
  customers12Months: MoneyRange | null;
  customers24Months: MoneyRange | null;
  
  // Churn
  churn6Months: PercentageRange | null;
  churn12Months: PercentageRange | null;
  churn24Months: PercentageRange | null;
  
  // Investment
  mvpInvestment: number | null;
  marketingBudgetMonthly: number | null;
  
  // Unit Economics
  targetCac: MoneyRange | null;
  ltv: number | null;
  paybackPeriod: number | null;
  idealTicket: number | null;
  
  // For charts
  projectionData: ProjectionDataPoint[];
  financialScenarios: FinancialScenario[];
  yearEvolution: YearEvolutionData[];
  
  // Unit Economics display
  unitEconomics: UnitEconomicsDisplay | null;
  
  // Data source tracking
  dataSources: DataSources;
  
  // Validation warnings (NEW - for realistic projections)
  validationWarnings: string[];
  wasAdjustedForRealism: boolean;
  discrepancyRatio: number | null; // How much raw AI values exceeded validated (e.g., 28x)
}

export interface ProjectionDataPoint {
  month: string;
  revenue: number;
  costs: number;
  cumulative: number;
}

export interface FinancialScenario {
  name: string;
  mrrMonth12: number;
  arrYear1: number;
  breakEven: number;
  probability: string;
}

export interface YearEvolutionData {
  year: string;
  arr: string;
  mrr: string;
  // Numeric values from n8n v1.7.0+
  arrNumeric?: number;
  mrrNumeric?: number;
  customers?: number;
}

export interface UnitEconomicsDisplay {
  idealTicket: string;
  paybackPeriod: string;
  ltv: string;
  ltvMonths: string;
  ltvCacRatio: string;
  ltvCacCalculated: string;
  monthlyChurn: string;
  howItWorks: string;
}

// ============================================
// Main Hook
// ============================================

export function useFinancialMetrics(
  reportData: ReportData | null,
  marketTypeOverride?: string | null
): FinancialMetrics {
  return useMemo(() => {
    const fallback = "...";
    
    // Clear previous logs when processing new report
    debugLogger.clearLogs();
    
    // Initialize data sources tracker
    const dataSources: DataSources = { ...defaultDataSources };
    
    // Extract JSONB sections
    const growthIntelligence = reportData?.growth_intelligence_section as Record<string, unknown> | null;
    const paidMediaIntelligence = reportData?.paid_media_intelligence_section as Record<string, unknown> | null;
    const sectionInvestment = reportData?.section_investment as Record<string, unknown> | null;
    const opportunitySection = reportData?.opportunity_section as Record<string, unknown> | null;
    const benchmarkSectionRaw = reportData?.benchmark_section as Record<string, unknown> | null;
    
    // ============================================
    // EFFECTIVE MARKET TYPE - Priority chain:
    // 1. marketTypeOverride (from wizard data)
    // 2. benchmark_section.market_context.market_type (from n8n research)
    // 3. Fallback to 'b2b'
    // ============================================
    const benchmarkMarketType = (benchmarkSectionRaw?.market_context as Record<string, unknown>)?.market_type as string | undefined;
    const effectiveMarketType = (
      marketTypeOverride?.toLowerCase() ||
      benchmarkMarketType?.toLowerCase() ||
      'b2b'
    );
    
    console.log('[Financial] effectiveMarketType:', effectiveMarketType, '(override:', marketTypeOverride, ', benchmark:', benchmarkMarketType, ')');
    
    // ============================================
    // Extract Growth Targets (handles both new and legacy key formats)
    // ============================================
    const growthTargets = safeGet(growthIntelligence, 'growth_targets', null) as Record<string, unknown> | null;
    
    // ============================================
    // OPTIMIZATION: Extract pre-calculated metrics from n8n pipeline
    // These are available in newer reports generated by Calculate Growth Metrics v1.6.0+
    // ============================================
    const financialMetricsDirect = safeGet(growthIntelligence, 'financial_metrics', null) as Record<string, unknown> | null;
    const unitEconomicsFromN8n = safeGet(growthIntelligence, 'unit_economics_used', null) as Record<string, unknown> | null;
    
    // NOVO: Extrair campos pré-calculados do n8n v1.7.0+
    const projectionDataFromDb = safeGet(growthIntelligence, 'projection_data', null) as ProjectionDataPoint[] | null;
    const financialScenariosFromDb = safeGet(growthIntelligence, 'financial_scenarios', null) as FinancialScenario[] | null;
    const yearEvolutionFromDb = safeGet(growthIntelligence, 'year_evolution', null) as YearEvolutionData[] | null;
    
    if (financialMetricsDirect) {
      console.log('[Financial] ✅ Found pre-calculated financial_metrics from n8n:', Object.keys(financialMetricsDirect));
    }
    
    if (projectionDataFromDb && projectionDataFromDb.length > 0) {
      console.log('[Financial] ✅ Using projection_data from database (n8n v1.7.0+):', projectionDataFromDb.length, 'months');
    }
    if (financialScenariosFromDb && financialScenariosFromDb.length > 0) {
      console.log('[Financial] ✅ Using financial_scenarios from database (n8n v1.7.0+):', financialScenariosFromDb.length, 'scenarios');
    }
    if (yearEvolutionFromDb && yearEvolutionFromDb.length > 0) {
      console.log('[Financial] ✅ Using year_evolution from database (n8n v1.7.0+):', yearEvolutionFromDb.length, 'years');
    }
    
    // Support both new format (6_month/12_month/24_month) and legacy format (six_month_targets/etc)
    const sixMonthTargets = safeGet(growthTargets, '6_month', null) ?? safeGet(growthTargets, 'six_month_targets', null);
    const twelveMonthTargets = safeGet(growthTargets, '12_month', null) ?? safeGet(growthTargets, 'twelve_month_targets', null);
    const twentyFourMonthTargets = safeGet(growthTargets, '24_month', null) ?? safeGet(growthTargets, 'twenty_four_month_targets', null);
    
    // ============================================
    // MRR EXTRACTION - PRIORITY ORDER:
    // 1. Pre-calculated numeric from financial_metrics (most accurate)
    // 2. String parsing from growth_targets (fallback for older data)
    // ============================================
    const mrr6MonthsDirect = sanitizeNumericValue(financialMetricsDirect?.mrr_month_6, null) as number | null;
    const mrr12MonthsDirect = sanitizeNumericValue(financialMetricsDirect?.mrr_month_12, null) as number | null;
    const mrr24MonthsDirect = sanitizeNumericValue(financialMetricsDirect?.mrr_month_24, null) as number | null;
    
    // Use direct values if available, otherwise parse from strings
    const mrr6Months: MoneyRange | null = mrr6MonthsDirect 
      ? { min: mrr6MonthsDirect * 0.8, max: mrr6MonthsDirect * 1.2, avg: mrr6MonthsDirect }
      : smartExtractMRR(sixMonthTargets);
      
    const mrr12Months: MoneyRange | null = mrr12MonthsDirect 
      ? { min: mrr12MonthsDirect * 0.8, max: mrr12MonthsDirect * 1.2, avg: mrr12MonthsDirect }
      : smartExtractMRR(twelveMonthTargets);
      
    const mrr24Months: MoneyRange | null = mrr24MonthsDirect 
      ? { min: mrr24MonthsDirect * 0.8, max: mrr24MonthsDirect * 1.2, avg: mrr24MonthsDirect }
      : smartExtractMRR(twentyFourMonthTargets);
    
    // Track MRR data source
    if (mrr12MonthsDirect) {
      dataSources.mrrMonth12 = 'database';
      debugLogger.logExtraction('mrr12Months', 'financial_metrics.mrr_month_12 (direct)', mrr12MonthsDirect, mrr12Months, true);
    } else if (mrr12Months) {
      dataSources.mrrMonth12 = 'database';
      debugLogger.logExtraction('mrr12Months', 'growth_targets.12_month (parsed)', twelveMonthTargets, mrr12Months, true);
    } else {
      debugLogger.logFallback({
        field: 'mrr12Months',
        attemptedSource: 'financial_metrics.mrr_month_12 + growth_targets.12_month',
        reason: 'No MRR data found',
        fallbackUsed: 'none (will show "...")',
        finalValue: null,
      });
    }
    
    // ARR values - smart extraction handles both text and object formats
    let arr12Months = smartExtractARR(twelveMonthTargets);
    let arr24Months = smartExtractARR(twentyFourMonthTargets);
    
    // Track ARR data source
    if (arr12Months) {
      dataSources.arrProjected = 'database';
      debugLogger.logExtraction('arr12Months', 'growth_targets.12_month.arr', twelveMonthTargets, arr12Months, true);
    }
    
    // If ARR not available, calculate from MRR × 12
    if (!arr12Months && mrr12Months) {
      arr12Months = {
        min: mrr12Months.min * 12,
        max: mrr12Months.max * 12,
        avg: mrr12Months.avg * 12,
      };
      dataSources.arrProjected = 'calculated';
      debugLogger.logFallback({
        field: 'arr12Months',
        attemptedSource: 'growth_targets.12_month.arr',
        reason: 'smartExtractARR returned null',
        fallbackUsed: 'Calculated from MRR × 12',
        finalValue: arr12Months,
      });
    }
    if (!arr24Months && mrr24Months) {
      arr24Months = {
        min: mrr24Months.min * 12,
        max: mrr24Months.max * 12,
        avg: mrr24Months.avg * 12,
      };
    }
    
    // Customers - smart extraction with fallback estimation
    let customers6Months = smartExtractCustomers(sixMonthTargets);
    let customers12Months = smartExtractCustomers(twelveMonthTargets);
    let customers24Months = smartExtractCustomers(twentyFourMonthTargets);
    
    // Track customers data source
    if (customers12Months) {
      dataSources.customers12 = 'database';
      debugLogger.logExtraction('customers12Months', 'growth_targets.12_month.customers', twelveMonthTargets, customers12Months, true);
    }
    
    // Fallback: estimate customers from MRR if not available (assume $150 avg ticket for SaaS B2B)
    const ESTIMATED_TICKET = 150;
    if (!customers12Months && mrr12Months && mrr12Months.avg > 0) {
      customers12Months = {
        min: Math.round(mrr12Months.min / ESTIMATED_TICKET),
        max: Math.round(mrr12Months.max / ESTIMATED_TICKET),
        avg: Math.round(mrr12Months.avg / ESTIMATED_TICKET),
      };
      dataSources.customers12 = 'estimated';
      debugLogger.logFallback({
        field: 'customers12Months',
        attemptedSource: 'growth_targets.12_month.customers',
        reason: 'smartExtractCustomers returned null',
        fallbackUsed: `Estimated from MRR / $${ESTIMATED_TICKET} avg ticket`,
        finalValue: customers12Months,
      });
    }
    if (!customers6Months && mrr6Months && mrr6Months.avg > 0) {
      customers6Months = {
        min: Math.round(mrr6Months.min / ESTIMATED_TICKET),
        max: Math.round(mrr6Months.max / ESTIMATED_TICKET),
        avg: Math.round(mrr6Months.avg / ESTIMATED_TICKET),
      };
    }
    if (!customers24Months && mrr24Months && mrr24Months.avg > 0) {
      customers24Months = {
        min: Math.round(mrr24Months.min / ESTIMATED_TICKET),
        max: Math.round(mrr24Months.max / ESTIMATED_TICKET),
        avg: Math.round(mrr24Months.avg / ESTIMATED_TICKET),
      };
    }
    
    // Churn - smart extraction with NORMALIZATION (annual → monthly)
    let churn6MonthsRaw = smartExtractChurn(sixMonthTargets);
    let churn12MonthsRaw = smartExtractChurn(twelveMonthTargets);
    let churn24MonthsRaw = smartExtractChurn(twentyFourMonthTargets);
    
    // CRITICAL FIX: Normalize churn to monthly
    // AI agents often return annual churn (5%) which we incorrectly used as monthly
    let churn6Months: PercentageRange | null = null;
    let churn12Months: PercentageRange | null = null;
    let churn24Months: PercentageRange | null = null;
    
    if (churn12MonthsRaw) {
      const normalized = normalizeChurnToMonthly(churn12MonthsRaw.avg);
      churn12Months = {
        min: normalized.monthlyChurn * 0.7,
        max: normalized.monthlyChurn * 1.3,
        avg: normalized.monthlyChurn,
      };
      dataSources.churn12 = 'database';
      debugLogger.logExtraction('churn12Months', 'growth_targets.12_month.churn', 
        `${churn12MonthsRaw.avg}% (${normalized.originalInterpretation}) → ${normalized.monthlyChurn}% monthly`, 
        churn12Months, true);
    }
    
    if (churn6MonthsRaw) {
      const normalized = normalizeChurnToMonthly(churn6MonthsRaw.avg);
      churn6Months = {
        min: normalized.monthlyChurn * 0.7,
        max: normalized.monthlyChurn * 1.3,
        avg: normalized.monthlyChurn,
      };
    }
    
    if (churn24MonthsRaw) {
      const normalized = normalizeChurnToMonthly(churn24MonthsRaw.avg);
      churn24Months = {
        min: normalized.monthlyChurn * 0.7,
        max: normalized.monthlyChurn * 1.3,
        avg: normalized.monthlyChurn,
      };
    }
    
    // ============================================
    // CHURN FALLBACK PRIORITY:
    // 1. Database growth_targets churn (already extracted above)
    // 2. Benchmark churn from n8n research (benchmark_section.churn_monthly_max)
    // 3. Market-type based default
    // ============================================
    const benchmarkSectionForChurn = reportData?.benchmark_section as Record<string, unknown> | null;
    const benchmarkChurnMonthly = benchmarkSectionForChurn?.churn_monthly_max as number | undefined;
    
    const getDefaultChurnByMarketType = (type: string): PercentageRange => {
      if (type === 'b2c' || type === 'consumer' || type.includes('b2c')) {
        // B2C healthcare/wellness: 5-10% monthly = 50-80% annual
        return { min: 5.0, max: 10.0, avg: 7.0 };
      } else if (type === 'smb' || type === 'small_business') {
        // SMB SaaS: 3-5% monthly = 30-50% annual
        return { min: 3.0, max: 5.0, avg: 4.0 };
      }
      // B2B/Enterprise: 0.3-0.6% monthly = 4-7% annual
      return { min: 0.3, max: 0.6, avg: 0.42 };
    };
    
    const defaultChurn = getDefaultChurnByMarketType(effectiveMarketType);
    
    if (!churn12Months) {
      // PRIORITY 2: Use benchmark churn if available
      if (benchmarkChurnMonthly && benchmarkChurnMonthly > 0) {
        churn12Months = { 
          min: benchmarkChurnMonthly * 0.8, 
          max: benchmarkChurnMonthly, 
          avg: benchmarkChurnMonthly 
        };
        dataSources.churn12 = 'benchmark';
        console.log('[Financial] ✅ Using BENCHMARK churn:', benchmarkChurnMonthly, '%');
        debugLogger.logExtraction('churn12Months', 'benchmark_section.churn_monthly_max', benchmarkChurnMonthly, churn12Months, true);
      } else {
        // PRIORITY 3: Market-type based fallback
        churn12Months = defaultChurn;
        dataSources.churn12 = 'estimated';
        console.log('[Financial] Using market-type churn for', effectiveMarketType, ':', defaultChurn.avg, '%');
        debugLogger.logFallback({
          field: 'churn12Months',
          attemptedSource: 'growth_targets.12_month.churn + benchmark_section.churn_monthly_max',
          reason: 'No churn data from database or benchmarks',
          fallbackUsed: `Market-type based (${effectiveMarketType}): ${defaultChurn.avg}% monthly`,
          finalValue: defaultChurn,
        });
      }
    }
    if (!churn6Months) {
      churn6Months = churn12Months; // Use same value (already prioritized)
    }
    if (!churn24Months) {
      // Slightly lower for mature product (improved retention)
      churn24Months = { 
        min: churn12Months.min * 0.7, 
        max: churn12Months.max * 0.7, 
        avg: churn12Months.avg * 0.7 
      };
    }
    
    // ============================================
    // Extract Investment Data
    // ============================================
    const investmentCents = safeGet(sectionInvestment, 'investment_one_payment_cents', null) as number | null;
    const mvpInvestment = parseCentsToUSD(investmentCents);
    
    // ============================================
    // Extract Paid Media Intelligence
    // ============================================
    const performanceTargets = safeGet(paidMediaIntelligence, 'performance_targets', null) as Record<string, unknown> | null;
    const budgetStrategy = safeGet(paidMediaIntelligence, 'budget_strategy', null) as Record<string, unknown> | null;
    
    // Target CAC - handle both number and string formats
    const targetCacRaw = safeGet(performanceTargets, 'target_cac', null);
    let targetCac: MoneyRange | null = null;
    if (typeof targetCacRaw === 'number' && targetCacRaw > 0) {
      // If it's a plain number (e.g., 130), use it directly
      targetCac = { min: targetCacRaw, max: targetCacRaw, avg: targetCacRaw };
    } else if (typeof targetCacRaw === 'string') {
      // If it's a string (e.g., "$60-100 (blended...)"), extract it
      targetCac = extractCACFromText(targetCacRaw);
    }
    
    // LTV/CAC Ratio - handle both number and string formats
    const ltvCacRatioRaw = safeGet(performanceTargets, 'ltv_cac_ratio_target', null);
    let ltvCacRatioNum: number | null = null;
    if (typeof ltvCacRatioRaw === 'number' && ltvCacRatioRaw > 0) {
      // If it's a plain number (e.g., 3.5), use it directly
      ltvCacRatioNum = ltvCacRatioRaw;
    } else if (typeof ltvCacRatioRaw === 'string') {
      // Try extractRatioFromText first
      ltvCacRatioNum = extractRatioFromText(ltvCacRatioRaw);
      // Fallback: try parsing formats like "3.5x" or just "3.5"
      if (ltvCacRatioNum === null) {
        const match = ltvCacRatioRaw.match(/(\d+\.?\d*)/);
        if (match) ltvCacRatioNum = parseFloat(match[1]);
      }
    }
    
    // Marketing budget - try to extract from budget strategy text
    const marketingBudgetStr = safeGet(budgetStrategy, 'recommended_marketing_budget_monthly', null) as string | null;
    let marketingBudgetMonthly = parseMoneyValue(marketingBudgetStr);
    
    // Track marketing budget data source
    if (marketingBudgetMonthly) {
      dataSources.marketingBudget = 'database';
      debugLogger.logExtraction('marketingBudgetMonthly', 'budget_strategy.recommended_marketing_budget_monthly', marketingBudgetStr, marketingBudgetMonthly, true);
    }
    
    // If not found, try text extraction from various fields
    if (!marketingBudgetMonthly) {
      const budgetText = JSON.stringify(budgetStrategy || {});
      marketingBudgetMonthly = extractMarketingBudgetFromText(budgetText);
      if (marketingBudgetMonthly) {
        dataSources.marketingBudget = 'database';
      }
    }
    
    // Default marketing budget if none found (estimate 8-10% of MRR target)
    if (!marketingBudgetMonthly && mrr12Months) {
      marketingBudgetMonthly = Math.round(mrr12Months.avg * 0.10);
      dataSources.marketingBudget = 'estimated';
      debugLogger.logFallback({
        field: 'marketingBudgetMonthly',
        attemptedSource: 'budget_strategy.recommended_marketing_budget_monthly',
        reason: 'parseMoneyValue returned null',
        fallbackUsed: '10% of target MRR',
        finalValue: marketingBudgetMonthly,
      });
    }
    
    // Fallback to reasonable default
    const effectiveMarketingBudget = marketingBudgetMonthly || 5000;
    
    // Track target CAC data source
    if (targetCac) {
      dataSources.targetCac = 'database';
      debugLogger.logExtraction('targetCac', 'performance_targets.target_cac', targetCacRaw, targetCac, true);
    } else {
      debugLogger.logFallback({
        field: 'targetCac',
        attemptedSource: 'performance_targets.target_cac',
        reason: 'No CAC data found',
        fallbackUsed: 'none (will show "...")',
        finalValue: null,
      });
    }
    
    // Track LTV/CAC ratio data source
    if (ltvCacRatioNum) {
      dataSources.ltvCacRatio = 'database';
      debugLogger.logExtraction('ltvCacRatioNum', 'performance_targets.ltv_cac_ratio_target', ltvCacRatioRaw, ltvCacRatioNum, true);
    }
    
    // ============================================
    // Extract margin and operational cost from report (more realistic values)
    // MOVED UP: needed for payback calculation
    // ============================================
    const marginFromReport = safeGet(growthIntelligence, 'profit_margin', null) as string | null;
    let marginPercent = 0.65; // 65% default (more conservative than 70%)
    if (marginFromReport) {
      const marginMatch = marginFromReport.match(/(\d+)/);
      if (marginMatch) marginPercent = parseInt(marginMatch[1], 10) / 100;
    }
    
    // Operational cost based on MVP size
    const mvpPriceCents = safeGet(sectionInvestment, 'mvp_price_cents', 0) as number;
    const operationalCostPercent = mvpPriceCents > 5000000 ? 0.03 : 0.02; // 2-3%
    
    // ============================================
    // INITIAL Derived Metrics (will be recalculated after validation)
    // These are PLACEHOLDERS - will be overwritten with validated values
    // ============================================
    
    // Placeholder for ARPU - will be recalculated with validated MRR
    let idealTicket: number | null = null;
    
    // Placeholder for LTV - will be recalculated with validated ARPU
    let ltv: number | null = null;
    
    // Placeholder for payback - will be recalculated with validated values
    let paybackPeriod: number | null = null;
    
    // ============================================
    // LTV/CAC placeholder - will be calculated after MRR validation
    // ============================================
    let ltvCacCalculated: number | null = null;
    
    // (marginPercent and operationalCostPercent already defined above)
    
    // ============================================
    // REALISTIC Break-even & ROI Calculation
    // Uses new validation layer for market-realistic projections
    // Now uses DYNAMIC BENCHMARKS from n8n research when available
    // ============================================
    
    // Use effectiveMarketType already computed at start of hook
    // benchmarkSectionRaw already extracted at start
    const benchmarkSection = benchmarkSectionRaw;
    
    // Normalize benchmark keys from snake_case (database) to UPPER_CASE (internal)
    let dynamicBenchmarks = MARKET_BENCHMARKS;
    if (benchmarkSection && typeof benchmarkSection === 'object') {
      const bs = benchmarkSection as Record<string, unknown>;
      
      // Check if this is valid n8n research data
      if (typeof bs.mrr_month_6_max === 'number' || typeof bs.mrr_month_12_max === 'number') {
        dynamicBenchmarks = {
          ...MARKET_BENCHMARKS,
          // MRR Caps - use research values
          MRR_MONTH_6_MAX: (bs.mrr_month_6_max as number) || MARKET_BENCHMARKS.MRR_MONTH_6_MAX,
          MRR_MONTH_12_MAX: (bs.mrr_month_12_max as number) || MARKET_BENCHMARKS.MRR_MONTH_12_MAX,
          MRR_MONTH_24_MAX: (bs.mrr_month_24_max as number) || MARKET_BENCHMARKS.MRR_MONTH_24_MAX,
          // ARR Caps
          ARR_YEAR_1_MAX: (bs.arr_year_1_max as number) || MARKET_BENCHMARKS.ARR_YEAR_1_MAX,
          ARR_YEAR_2_MAX: (bs.arr_year_2_max as number) || MARKET_BENCHMARKS.ARR_YEAR_2_MAX,
          // Conversion rates
          USER_TO_PAYING_CONVERSION: (bs.user_to_paying_conversion as number) || MARKET_BENCHMARKS.USER_TO_PAYING_CONVERSION,
          // Growth constraints
          MAX_MONTHLY_GROWTH_RATE: (bs.max_monthly_growth as number) || MARKET_BENCHMARKS.MAX_MONTHLY_GROWTH_RATE,
          // ROI constraints
          ROI_YEAR_1_MIN: (bs.roi_year_1_min as number) ?? MARKET_BENCHMARKS.ROI_YEAR_1_MIN,
          ROI_YEAR_1_MAX: (bs.roi_year_1_max as number) ?? MARKET_BENCHMARKS.ROI_YEAR_1_MAX,
          ROI_YEAR_1_REALISTIC_MAX: (bs.roi_year_1_realistic as number) ?? MARKET_BENCHMARKS.ROI_YEAR_1_REALISTIC_MAX,
          // Break-even
          BREAK_EVEN_MIN_MONTHS: (bs.break_even_min_months as number) || MARKET_BENCHMARKS.BREAK_EVEN_MIN_MONTHS,
          BREAK_EVEN_REALISTIC_MONTHS: (bs.break_even_realistic_months as number) || MARKET_BENCHMARKS.BREAK_EVEN_REALISTIC_MONTHS,
          // Churn
          CHURN_REALISTIC_MONTHLY: (bs.churn_monthly_max as number) || MARKET_BENCHMARKS.CHURN_REALISTIC_MONTHLY,
          CHURN_MAX_MONTHLY: (bs.churn_monthly_max as number) || MARKET_BENCHMARKS.CHURN_MAX_MONTHLY,
        };
        
        console.log('[Financial Metrics] ✅ Using DYNAMIC benchmarks from n8n research:', {
          source: 'benchmark_section',
          sourceCount: Array.isArray(bs.sources) ? bs.sources.length : 0,
          confidence: bs.confidence || 'medium',
          caps: {
            MRR_MONTH_6_MAX: dynamicBenchmarks.MRR_MONTH_6_MAX,
            MRR_MONTH_12_MAX: dynamicBenchmarks.MRR_MONTH_12_MAX,
            MRR_MONTH_24_MAX: dynamicBenchmarks.MRR_MONTH_24_MAX,
          }
        });
      } else {
        console.log('[Financial Metrics] ⚠️ benchmark_section exists but missing required fields, using defaults');
      }
    } else {
      console.log('[Financial Metrics] ℹ️ No benchmark_section, using static market benchmarks for:', effectiveMarketType);
    }
    
    // Run full validation pipeline on MRR projections with dynamic benchmarks
    const validatedFinancials = validateFinancialProjections(
      mrr6Months?.avg || null,
      mrr12Months?.avg || null,
      mrr24Months?.avg || null,
      mvpInvestment || 100000, // Default investment if missing
      effectiveMarketingBudget,
      marginPercent,
      dynamicBenchmarks
    );
    
    // Use validated values
    const validatedMrr6 = validatedFinancials.mrr6;
    const validatedMrr12 = validatedFinancials.mrr12;
    const validatedMrr24 = validatedFinancials.mrr24;
    
    // ============================================
    // OPTIMIZATION: Prioritize pre-calculated ROI/Break-even from n8n
    // These values are already validated in the pipeline
    // ============================================
    const roiYear1FromN8n = sanitizeNumericValue(financialMetricsDirect?.roi_year_1, null) as number | null;
    const breakEvenFromN8n = sanitizeNumericValue(financialMetricsDirect?.break_even_months, null) as number | null;
    const paybackFromN8n = sanitizeNumericValue(financialMetricsDirect?.payback_months, null) as number | null;
    
    // Use n8n pre-calculated values if available, otherwise use local validation
    const breakEvenMonthsNum = breakEvenFromN8n ?? validatedFinancials.breakEvenMonths;
    const roiYear1Num = roiYear1FromN8n ?? validatedFinancials.roiYear1;
    
    if (roiYear1FromN8n !== null || breakEvenFromN8n !== null) {
      console.log('[Financial] ✅ Using PRE-CALCULATED values from n8n:', {
        roi_year_1: roiYear1FromN8n,
        break_even_months: breakEvenFromN8n,
        payback_months: paybackFromN8n,
      });
    }
    
    // Track validation warnings
    const validationWarnings = validatedFinancials.warnings;
    const wasAdjustedForRealism = validatedFinancials.wasAdjusted;
    
    if (wasAdjustedForRealism) {
      console.log('[Financial Metrics] 🔄 Projections ADJUSTED for market realism:', validationWarnings);
    }
    
    // ============================================
    // RECALCULATE UNIT ECONOMICS WITH VALIDATED VALUES
    // This is the CRITICAL fix - use validated MRR, not raw AI projections
    // ============================================
    
    // ============================================
    // ARPU EXTRACTION - PRIORITY ORDER:
    // 1. Pre-calculated from n8n unit_economics_used.arpu (most accurate)
    // 2. Benchmark default_arpu
    // 3. Calculated from MRR/customers
    // ============================================
    const arpuFromN8n = sanitizeNumericValue(unitEconomicsFromN8n?.arpu, null) as number | null;
    const ltvFromN8n = sanitizeNumericValue(unitEconomicsFromN8n?.ltv, null) as number | null;
    
    // Get benchmark ARPU values if available
    const benchmarkArpuDefault = benchmarkSection?.default_arpu as number | undefined;
    const benchmarkArpuRange = benchmarkSection?.arpu_range as { min?: number; max?: number } | undefined;
    const benchmarkArpuMin = benchmarkArpuRange?.min || 5;
    const benchmarkArpuMax = benchmarkArpuRange?.max || 200;
    const avgBenchmarkArpu = benchmarkArpuDefault || ((benchmarkArpuMin + benchmarkArpuMax) / 2);
    
    // Calculate validated ARPU (idealTicket) from validated MRR
    if (validatedMrr12 > 0) {
      // PRIORITY 1: Use n8n pre-calculated ARPU if available (from unit_economics_used)
      if (arpuFromN8n && arpuFromN8n > 0) {
        idealTicket = Math.round(arpuFromN8n);
        dataSources.idealTicket = 'database';
        console.log('[Financial] ✅ Using N8N pre-calculated ARPU:', arpuFromN8n);
      }
      // PRIORITY 2: Use benchmark arpu_default if available
      else if (benchmarkArpuDefault && benchmarkArpuDefault > 0) {
        idealTicket = Math.round(benchmarkArpuDefault);
        dataSources.idealTicket = 'benchmark';
        console.log('[Financial] ✅ Using benchmark default_arpu:', benchmarkArpuDefault);
      }
      // PRIORITY 3: If we have customer data, calculate from validated MRR
      else if (customers12Months && customers12Months.avg > 0) {
        const estimatedCustomersFromValidatedMrr = Math.round(validatedMrr12 / avgBenchmarkArpu);
        const effectiveCustomers = Math.min(customers12Months.avg, estimatedCustomersFromValidatedMrr);
        
        if (effectiveCustomers > 0) {
          idealTicket = Math.round(validatedMrr12 / effectiveCustomers);
        } else {
          idealTicket = Math.round(avgBenchmarkArpu);
        }
        dataSources.idealTicket = 'calculated';
      } 
      // PRIORITY 4: Fallback to benchmark average
      else {
        idealTicket = Math.round(avgBenchmarkArpu);
        dataSources.idealTicket = 'estimated';
      }
      
      // Ensure ARPU is within reasonable bounds
      if (idealTicket < benchmarkArpuMin) {
        idealTicket = benchmarkArpuMin;
      } else if (idealTicket > benchmarkArpuMax * 2) {
        idealTicket = Math.round(benchmarkArpuMax * 2);
      }
      
      console.log('[Financial] ✅ Validated ARPU:', {
        validatedMrr12,
        arpuFromN8n,
        benchmarkArpuDefault,
        benchmarkArpuRange: { min: benchmarkArpuMin, max: benchmarkArpuMax },
        idealTicket,
        source: dataSources.idealTicket,
      });
    }
    
    // Calculate LTV using validated ARPU and benchmark churn
    // PRIORITY: 1. n8n pre-calculated LTV, 2. Local calculation
    if (ltvFromN8n && ltvFromN8n > 0) {
      ltv = Math.round(ltvFromN8n);
      dataSources.ltv = 'database';
      console.log('[Financial] ✅ Using N8N pre-calculated LTV:', ltvFromN8n);
    } else if (idealTicket && churn12Months && churn12Months.avg > 0) {
      const monthlyChurnDecimal = churn12Months.avg / 100;
      const avgLifetimeMonths = 1 / monthlyChurnDecimal;
      ltv = Math.round(idealTicket * avgLifetimeMonths);
      dataSources.ltv = 'calculated';
      
      console.log('[Financial] ✅ Calculated LTV:', {
        arpu: idealTicket,
        churnMonthly: churn12Months.avg + '%',
        lifetimeMonths: avgLifetimeMonths.toFixed(1),
        ltv,
      });
    }
    
    // Calculate Payback Period using validated ARPU
    // PRIORITY: 1. Calculated from CAC/ARPU, 2. Database, 3. Benchmark defaults
    const benchmarkBreakEvenRealistic = dynamicBenchmarks.BREAK_EVEN_REALISTIC_MONTHS || 24;
    const benchmarkBreakEvenMin = dynamicBenchmarks.BREAK_EVEN_MIN_MONTHS || 8;
    
    // DYNAMIC PAYBACK FLOOR based on market type
    // B2C/Consumer can have faster payback due to lower CAC and viral growth
    const getPaybackFloor = (marketType: string, benchmarkMin: number): number => {
      if (marketType.includes('b2c') || marketType.includes('consumer')) {
        return Math.min(benchmarkMin, 6); // B2C: max floor of 6 months
      }
      if (marketType.includes('smb')) {
        return Math.min(benchmarkMin, 8); // SMB: max floor of 8 months
      }
      return benchmarkMin; // B2B/Enterprise: use full benchmark
    };
    
    const effectivePaybackFloor = getPaybackFloor(effectiveMarketType, benchmarkBreakEvenMin);
    
    const paybackFromInvestment = safeGet(sectionInvestment, 'payback_period', null) as string | null;
    
    // First try to calculate from CAC/ARPU
    if (targetCac && idealTicket && idealTicket > 0) {
      const netMonthlyRevenue = idealTicket * marginPercent;
      const calculatedPayback = Math.round(targetCac.avg / netMonthlyRevenue);
      
      // Apply market-appropriate floor
      paybackPeriod = Math.max(calculatedPayback, effectivePaybackFloor);
      
      // CONDITIONAL ADJUSTMENT: Only apply aggressive 75% benchmark for B2B/Enterprise
      const shouldApplyAggressiveAdjustment = 
        !effectiveMarketType.includes('b2c') && 
        !effectiveMarketType.includes('consumer') &&
        !effectiveMarketType.includes('smb');
      
      if (shouldApplyAggressiveAdjustment && calculatedPayback < benchmarkBreakEvenRealistic * 0.5) {
        paybackPeriod = Math.max(paybackPeriod, Math.round(benchmarkBreakEvenRealistic * 0.75));
        console.warn(`[Financial] Payback ${calculatedPayback} months adjusted to ${paybackPeriod} (B2B benchmark realistic: ${benchmarkBreakEvenRealistic})`);
      }
      
      dataSources.paybackPeriod = 'calculated';
      console.log('[Financial] ✅ Validated Payback:', {
        marketType: effectiveMarketType,
        cac: targetCac.avg,
        arpu: idealTicket,
        netMonthlyRevenue,
        calculatedPayback,
        effectivePaybackFloor,
        benchmarkRealistic: benchmarkBreakEvenRealistic,
        aggressiveAdjustment: shouldApplyAggressiveAdjustment,
        finalPayback: paybackPeriod,
      });
    } else if (paybackFromInvestment) {
      // Fallback to database value if no CAC
      const match = paybackFromInvestment.match(/(\d+)/);
      const dbPayback = match ? parseInt(match[1], 10) : null;
      if (dbPayback) {
        // Apply market-appropriate floor
        paybackPeriod = Math.max(dbPayback, effectivePaybackFloor);
        dataSources.paybackPeriod = 'database';
      }
    }
    
    // Recalculate LTV/CAC with validated LTV
    if (ltv && targetCac && targetCac.avg > 0) {
      const calculated = Math.round((ltv / targetCac.avg) * 10) / 10;
      
      // B2C typically has lower LTV/CAC due to lower LTV and higher churn
      // These are REALISTIC market caps - not aspirational targets
      const MAX_LTV_CAC_BY_MARKET: Record<string, number> = {
        b2b: 8.0,        // Enterprise B2B with long contracts
        enterprise: 10.0, // Large enterprise deals
        smb: 5.0,         // SMB has moderate retention
        b2c: 6.0,         // B2C subscription apps (Netflix ~5x, Spotify ~4x)
        consumer: 4.0,    // Consumer apps with high churn
        healthcare: 6.0,  // Healthcare B2C can be higher due to sticky services
        internal: 3.0,    // Internal tools typically lower
        default: 6.0,     // Fallback for unknown market types
      };
      
      // Determine market type, checking for healthcare B2C specifically
      const isHealthcareB2C = effectiveMarketType.includes('b2c') && 
        (reportData?.opportunity_section as Record<string, unknown>)?.industry?.toString().toLowerCase().includes('health');
      
      // Use cascading fallback: specific type -> b2c check -> default
      const MAX_LTV_CAC = isHealthcareB2C 
        ? 6.0 
        : (MAX_LTV_CAC_BY_MARKET[effectiveMarketType] || 
          (effectiveMarketType.includes('b2c') ? 6.0 : 
           (effectiveMarketType.includes('smb') ? 5.0 : 
            MAX_LTV_CAC_BY_MARKET.default)));
      
      if (calculated > MAX_LTV_CAC) {
        console.warn(`[Financial] LTV/CAC ${calculated.toFixed(1)}:1 capped at ${MAX_LTV_CAC}:1 (${effectiveMarketType} benchmark)`);
        ltvCacCalculated = MAX_LTV_CAC;
      } else {
        ltvCacCalculated = calculated;
      }
      
      dataSources.ltvCacCalculated = 'calculated';
      console.log('[Financial] ✅ Validated LTV/CAC:', {
        ltv,
        cac: targetCac.avg,
        calculated,
        maxAllowed: MAX_LTV_CAC,
        final: ltvCacCalculated,
      });
    }
    
    // ============================================
    // Generate Projection Data - PRIORIZA BANCO (n8n v1.7.0+)
    // ============================================
    let projectionData: ProjectionDataPoint[] = [];
    if (projectionDataFromDb && projectionDataFromDb.length > 0) {
      // Usar dados pré-calculados do banco
      projectionData = projectionDataFromDb;
      dataSources.projectionData = 'database';
    } else if (validatedMrr12 > 0 && mvpInvestment) {
      // Fallback: calcular localmente
      projectionData = generateValidatedProjections(
        validatedMrr6,
        validatedMrr12,
        mvpInvestment,
        effectiveMarketingBudget,
        marginPercent,
        12
      );
      dataSources.projectionData = 'calculated';
    }
    
    // ============================================
    // Generate Financial Scenarios - PRIORIZA BANCO (n8n v1.7.0+)
    // ============================================
    let financialScenarios: FinancialScenario[] = [];
    if (financialScenariosFromDb && financialScenariosFromDb.length > 0) {
      // Usar cenários pré-calculados do banco
      financialScenarios = financialScenariosFromDb;
      dataSources.financialScenarios = 'database';
    } else if (validatedMrr12 > 0 && mvpInvestment) {
      // Fallback: calcular localmente
      const scenarios = generateValidatedScenarios(
        validatedMrr12,
        mvpInvestment,
        effectiveMarketingBudget,
        marginPercent
      );
      
      financialScenarios.push({
        name: "Conservative",
        mrrMonth12: scenarios.conservative.mrr12,
        arrYear1: scenarios.conservative.arr12,
        breakEven: scenarios.conservative.breakEven,
        probability: scenarios.conservative.probability,
      });
      
      financialScenarios.push({
        name: "Realistic",
        mrrMonth12: scenarios.realistic.mrr12,
        arrYear1: scenarios.realistic.arr12,
        breakEven: scenarios.realistic.breakEven,
        probability: scenarios.realistic.probability,
      });
      
      financialScenarios.push({
        name: "Optimistic",
        mrrMonth12: scenarios.optimistic.mrr12,
        arrYear1: scenarios.optimistic.arr12,
        breakEven: scenarios.optimistic.breakEven,
        probability: scenarios.optimistic.probability,
      });
      
      dataSources.financialScenarios = 'calculated';
    }
    
    // ============================================
    // Generate Year Evolution Data - PRIORIZA BANCO (n8n v1.7.0+)
    // ============================================
    let yearEvolution: YearEvolutionData[] = [];
    
    if (yearEvolutionFromDb && yearEvolutionFromDb.length > 0) {
      // Usar dados pré-calculados do banco
      yearEvolution = yearEvolutionFromDb;
      dataSources.yearEvolution = 'database';
    } else {
      // Fallback: calcular localmente
      // Use VALIDATED ARR values (MRR × 12, capped by benchmarks)
      const validatedArr12 = validatedMrr12 * 12;
      const validatedArr24 = validatedMrr24 * 12;
      
      // Year 1
      yearEvolution.push({
        year: "Year 1",
        arr: validatedArr12 > 0 ? formatCurrency(validatedArr12) : fallback,
        mrr: validatedMrr12 > 0 ? `${formatCurrency(validatedMrr12)} MRR` : `${fallback} MRR`,
        arrNumeric: validatedArr12,
        mrrNumeric: validatedMrr12,
      });
      
      // Year 2 - using validated values
      yearEvolution.push({
        year: "Year 2",
        arr: validatedArr24 > 0 ? formatCurrency(validatedArr24) : fallback,
        mrr: validatedMrr24 > 0 ? `${formatCurrency(validatedMrr24)} MRR` : `${fallback} MRR`,
        arrNumeric: validatedArr24,
        mrrNumeric: validatedMrr24,
      });
      
      // Year 3 - Project based on Year 2 with growth
      // Use market growth rate from report, with more conservative 25% fallback
      const marketGrowthRateStr = safeGet(opportunitySection, 'market_growth_rate', null) as string | null;
      const marketGrowth = parsePercentageRange(marketGrowthRateStr);
      const growthMultiplier = marketGrowth ? 1 + (marketGrowth.avg / 100) : 1.25; // Default 25% growth (conservative)
      
      if (validatedMrr24 > 0) {
        const arr36 = validatedArr24 * growthMultiplier;
        const mrr36 = validatedMrr24 * growthMultiplier;
        yearEvolution.push({
          year: "Year 3",
          arr: formatCurrency(arr36),
          mrr: `${formatCurrency(mrr36)} MRR`,
          arrNumeric: arr36,
          mrrNumeric: mrr36,
        });
      } else {
        yearEvolution.push({
          year: "Year 3",
          arr: fallback,
          mrr: `${fallback} MRR`,
        });
      }
      
      dataSources.yearEvolution = 'calculated';
    }
    
    // ============================================
    // Unit Economics Display
    // ============================================
    let unitEconomics: UnitEconomicsDisplay | null = null;
    if (idealTicket || ltv || paybackPeriod || ltvCacRatioNum || ltvCacCalculated) {
      unitEconomics = {
        idealTicket: idealTicket ? `$${idealTicket}` : fallback,
        paybackPeriod: paybackPeriod ? `${paybackPeriod}` : fallback,
        ltv: ltv ? `$${ltv.toLocaleString()}` : fallback,
        ltvMonths: churn12Months && churn12Months.avg > 0 
          ? `${Math.round(1 / (churn12Months.avg / 100))}` 
          : fallback,
        ltvCacRatio: ltvCacRatioNum ? `${ltvCacRatioNum}` : fallback,
        ltvCacCalculated: ltvCacCalculated ? `${ltvCacCalculated}` : fallback,
        monthlyChurn: churn12Months ? `${churn12Months.avg.toFixed(1)}%` : fallback,
        howItWorks: `With a target CAC of ${targetCac ? `$${targetCac.avg}` : fallback} and monthly ARPU of ${idealTicket ? `$${idealTicket}` : fallback}, each customer pays back acquisition costs in ${paybackPeriod || fallback} months and generates ${ltv ? `$${ltv.toLocaleString()}` : fallback} in lifetime value.`,
      };
    }
    
    // Print debug summary (only in development mode)
    debugLogger.printSummary();
    
    // ============================================
    // DEBUG: Log raw vs validated comparison
    // ============================================
    console.log('[Financial Metrics] 📊 RAW vs VALIDATED comparison:', {
      raw: { 
        mrr6: mrr6Months?.avg, 
        mrr12: mrr12Months?.avg, 
        mrr24: mrr24Months?.avg,
        arr12: arr12Months?.avg,
      },
      validated: { 
        mrr6: validatedMrr6, 
        mrr12: validatedMrr12, 
        mrr24: validatedMrr24,
        arr12: validatedMrr12 * 12,
      },
      caps: { 
        mrr6Max: dynamicBenchmarks.MRR_MONTH_6_MAX, 
        mrr12Max: dynamicBenchmarks.MRR_MONTH_12_MAX,
        mrr24Max: dynamicBenchmarks.MRR_MONTH_24_MAX,
      },
      wasAdjusted: wasAdjustedForRealism,
    });
    
    // Calculate discrepancy ratio for UI display
    const discrepancyRatio = (mrr12Months?.avg && validatedMrr12 > 0) 
      ? Math.round((mrr12Months.avg / validatedMrr12) * 10) / 10 
      : null;
    
    // Calculate validated ARR for return object
    const validatedArrForReturn = validatedMrr12 * 12;
    
    // ============================================
    // Return all metrics - USING VALIDATED VALUES
    // ============================================
    return {
      // Key metrics (formatted strings) - NOW USING VALIDATED VALUES
      breakEvenMonths: breakEvenMonthsNum ? `${breakEvenMonthsNum} months` : fallback,
      roiYear1: roiYear1Num !== null ? `${roiYear1Num}%` : fallback,
      mrrMonth12: validatedMrr12 > 0 ? formatCurrency(validatedMrr12) : fallback,
      arrProjected: validatedArrForReturn > 0 ? formatCurrency(validatedArrForReturn) : fallback,
      // PRIORITIZE calculated LTV/CAC over raw DB value for consistency
      ltvCacRatio: ltvCacCalculated 
        ? `${ltvCacCalculated.toFixed(1)}x` 
        : (ltvCacRatioNum ? `${ltvCacRatioNum}x` : fallback),
      
      // Numeric values - NOW USING VALIDATED VALUES
      breakEvenMonthsNum,
      roiYear1Num,
      mrrMonth12Num: validatedMrr12 > 0 ? validatedMrr12 : null,
      arrProjectedNum: validatedArrForReturn > 0 ? validatedArrForReturn : null,
      ltvCacRatioNum: ltvCacCalculated || ltvCacRatioNum, // Prefer calculated
      ltvCacCalculated,
      
      // MRR Evolution
      mrr6Months,
      mrr12Months,
      mrr24Months,
      
      // ARR Evolution
      arr12Months,
      arr24Months,
      
      // Customers
      customers6Months,
      customers12Months,
      customers24Months,
      
      // Churn
      churn6Months,
      churn12Months,
      churn24Months,
      
      // Investment
      mvpInvestment,
      marketingBudgetMonthly,
      
      // Unit Economics
      targetCac,
      ltv,
      paybackPeriod,
      idealTicket,
      
      // For charts/display
      projectionData,
      financialScenarios,
      yearEvolution,
      unitEconomics,
      
      // Data source tracking
      dataSources,
      
      // Validation info (NEW - for realistic projections)
      validationWarnings,
      wasAdjustedForRealism,
      discrepancyRatio,
    };
  }, [reportData, marketTypeOverride]);
}
