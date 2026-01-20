// ============================================
// useFinancialMetrics Hook
// Extracts and calculates financial metrics from JSONB fields
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
  calculateRealisticBreakEven,
  calculateRealisticROI,
  generateRealisticProjections,
  validateFinancialMetric,
  sanitizeNumericValue,
  MoneyRange,
  PercentageRange,
} from "@/lib/financialParsingUtils";
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
  
  // Data source tracking (NEW)
  dataSources: DataSources;
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

export function useFinancialMetrics(reportData: ReportData | null): FinancialMetrics {
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
    
    // ============================================
    // Extract Growth Targets (handles both new and legacy key formats)
    // ============================================
    const growthTargets = safeGet(growthIntelligence, 'growth_targets', null) as Record<string, unknown> | null;
    
    // Support both new format (6_month/12_month/24_month) and legacy format (six_month_targets/etc)
    const sixMonthTargets = safeGet(growthTargets, '6_month', null) ?? safeGet(growthTargets, 'six_month_targets', null);
    const twelveMonthTargets = safeGet(growthTargets, '12_month', null) ?? safeGet(growthTargets, 'twelve_month_targets', null);
    const twentyFourMonthTargets = safeGet(growthTargets, '24_month', null) ?? safeGet(growthTargets, 'twenty_four_month_targets', null);
    
    // MRR values - smart extraction handles both text and object formats
    const mrr6Months = smartExtractMRR(sixMonthTargets);
    const mrr12Months = smartExtractMRR(twelveMonthTargets);
    const mrr24Months = smartExtractMRR(twentyFourMonthTargets);
    
    // Track MRR data source
    if (mrr12Months) {
      dataSources.mrrMonth12 = 'database';
      debugLogger.logExtraction('mrr12Months', 'growth_targets.12_month', twelveMonthTargets, mrr12Months, true);
    } else {
      debugLogger.logFallback({
        field: 'mrr12Months',
        attemptedSource: 'growth_targets.12_month',
        reason: 'smartExtractMRR returned null',
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
    
    // Churn - smart extraction with fallback (SaaS average ~5% monthly churn)
    let churn6Months = smartExtractChurn(sixMonthTargets);
    let churn12Months = smartExtractChurn(twelveMonthTargets);
    let churn24Months = smartExtractChurn(twentyFourMonthTargets);
    
    // Track churn data source
    if (churn12Months) {
      dataSources.churn12 = 'database';
      debugLogger.logExtraction('churn12Months', 'growth_targets.12_month.churn', twelveMonthTargets, churn12Months, true);
    }
    
    // Fallback: use SaaS industry average if not available
    const SAAS_AVG_CHURN = { min: 3, max: 7, avg: 5 };
    if (!churn12Months) {
      churn12Months = SAAS_AVG_CHURN;
      dataSources.churn12 = 'estimated';
      debugLogger.logFallback({
        field: 'churn12Months',
        attemptedSource: 'growth_targets.12_month.churn',
        reason: 'smartExtractChurn returned null',
        fallbackUsed: 'SaaS industry average (5% monthly)',
        finalValue: SAAS_AVG_CHURN,
      });
    }
    if (!churn6Months) {
      churn6Months = SAAS_AVG_CHURN;
    }
    if (!churn24Months) {
      churn24Months = { min: 2, max: 5, avg: 3.5 }; // Slightly lower for mature product
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
    // Calculate Derived Metrics
    // ============================================
    
    // Ideal Ticket (ARPU) - estimate from MRR / Customers
    let idealTicket: number | null = null;
    if (mrr12Months && customers12Months && customers12Months.avg > 0) {
      idealTicket = Math.round(mrr12Months.avg / customers12Months.avg);
      dataSources.idealTicket = 'calculated';
    }
    
    // LTV calculation: ARPU × (1 / churn rate)
    let ltv: number | null = null;
    if (idealTicket && churn12Months && churn12Months.avg > 0) {
      const monthlyChurnDecimal = churn12Months.avg / 100;
      const avgLifetimeMonths = 1 / monthlyChurnDecimal;
      ltv = Math.round(idealTicket * avgLifetimeMonths);
      dataSources.ltv = 'calculated';
    }
    
    // ============================================
    // Payback Period: Prioritize database value, fallback to calculation
    // ============================================
    const paybackFromInvestment = safeGet(sectionInvestment, 'payback_period', null) as string | null;
    let paybackPeriod: number | null = null;
    if (paybackFromInvestment) {
      // Extract number from strings like "8 months" or "8-12 months"
      const match = paybackFromInvestment.match(/(\d+)/);
      paybackPeriod = match ? parseInt(match[1], 10) : null;
      if (paybackPeriod) {
        dataSources.paybackPeriod = 'database';
        debugLogger.logExtraction('paybackPeriod', 'section_investment.payback_period', paybackFromInvestment, paybackPeriod, true);
      }
    }
    // Fallback: calculate from CAC / ARPU
    if (!paybackPeriod && targetCac && idealTicket && idealTicket > 0) {
      paybackPeriod = Math.round(targetCac.avg / idealTicket);
      dataSources.paybackPeriod = 'calculated';
      debugLogger.logFallback({
        field: 'paybackPeriod',
        attemptedSource: 'section_investment.payback_period',
        reason: 'No payback period in database',
        fallbackUsed: 'Calculated from CAC / ARPU',
        finalValue: paybackPeriod,
      });
    }
    
    // LTV/CAC Calculated: LTV / CAC average (the real calculated value)
    let ltvCacCalculated: number | null = null;
    if (ltv && targetCac && targetCac.avg > 0) {
      ltvCacCalculated = Math.round((ltv / targetCac.avg) * 10) / 10; // 1 decimal place
      dataSources.ltvCacCalculated = 'calculated';
    }
    
    // ============================================
    // Extract margin and operational cost from report (more realistic values)
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
    // REALISTIC Break-even Calculation
    // ALWAYS calculate locally - database value is unreliable (often NULL)
    // ============================================
    let breakEvenMonthsNum: number | null = null;
    if (mvpInvestment && mrr12Months && mrr12Months.avg > 0) {
      breakEvenMonthsNum = calculateRealisticBreakEven(
        mrr12Months.avg,
        mvpInvestment,
        effectiveMarketingBudget,
        operationalCostPercent,
        marginPercent
      );
    }
    
    // ============================================
    // REALISTIC ROI Year 1 Calculation
    // ALWAYS calculate locally - database value is unreliable (often NULL)
    // ============================================
    let roiYear1Num: number | null = null;
    if (mrr12Months && mvpInvestment && mvpInvestment > 0) {
      roiYear1Num = calculateRealisticROI(
        mrr12Months.avg,
        mvpInvestment,
        effectiveMarketingBudget,
        operationalCostPercent
      );
    }
    
    // ============================================
    // Generate Projection Data (12 months) - REALISTIC S-CURVE
    // ============================================
    let projectionData: ProjectionDataPoint[] = [];
    if (mrr12Months && mvpInvestment) {
      projectionData = generateRealisticProjections(
        mrr12Months.avg,
        mvpInvestment,
        effectiveMarketingBudget,
        12
      );
    }
    
    // ============================================
    // Generate Financial Scenarios - BASED ON REAL RANGES
    // ============================================
    const financialScenarios: FinancialScenario[] = [];
    if (mrr12Months && mvpInvestment) {
      // Conservative: use min MRR values
      const conservativeBreakEven = calculateRealisticBreakEven(
        mrr12Months.min,
        mvpInvestment,
        effectiveMarketingBudget
      );
      financialScenarios.push({
        name: "Conservative",
        mrrMonth12: mrr12Months.min,
        arrYear1: mrr12Months.min * 12,
        breakEven: conservativeBreakEven,
        probability: "Lower bound", // Changed from fixed percentage
      });
      
      // Realistic: use avg values
      financialScenarios.push({
        name: "Realistic",
        mrrMonth12: mrr12Months.avg,
        arrYear1: mrr12Months.avg * 12,
        breakEven: breakEvenMonthsNum || 12,
        probability: "Expected", // Changed from fixed percentage
      });
      
      // Optimistic: use max values
      const optimisticBreakEven = calculateRealisticBreakEven(
        mrr12Months.max,
        mvpInvestment,
        effectiveMarketingBudget
      );
      financialScenarios.push({
        name: "Optimistic",
        mrrMonth12: mrr12Months.max,
        arrYear1: mrr12Months.max * 12,
        breakEven: optimisticBreakEven,
        probability: "Upper bound", // Changed from fixed percentage
      });
    }
    
    // ============================================
    // Generate Year Evolution Data
    // ============================================
    const yearEvolution: YearEvolutionData[] = [];
    
    // Year 1
    yearEvolution.push({
      year: "Year 1",
      arr: arr12Months ? formatCurrency(arr12Months.avg) : fallback,
      mrr: mrr12Months ? `${formatCurrency(mrr12Months.avg)} MRR` : `${fallback} MRR`,
    });
    
    // Year 2
    yearEvolution.push({
      year: "Year 2",
      arr: arr24Months ? formatCurrency(arr24Months.avg) : fallback,
      mrr: mrr24Months ? `${formatCurrency(mrr24Months.avg)} MRR` : `${fallback} MRR`,
    });
    
    // Year 3 - Project based on Year 2 with growth
    // Use market growth rate from report, with more conservative 25% fallback
    const marketGrowthRateStr = safeGet(opportunitySection, 'market_growth_rate', null) as string | null;
    const marketGrowth = parsePercentageRange(marketGrowthRateStr);
    const growthMultiplier = marketGrowth ? 1 + (marketGrowth.avg / 100) : 1.25; // Default 25% growth (conservative)
    
    if (arr24Months && mrr24Months) {
      const arr36 = arr24Months.avg * growthMultiplier;
      const mrr36 = mrr24Months.avg * growthMultiplier;
      yearEvolution.push({
        year: "Year 3",
        arr: formatCurrency(arr36),
        mrr: `${formatCurrency(mrr36)} MRR`,
      });
    } else {
      yearEvolution.push({
        year: "Year 3",
        arr: fallback,
        mrr: `${fallback} MRR`,
      });
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
    // Return all metrics
    // ============================================
    return {
      // Key metrics (formatted strings)
      breakEvenMonths: breakEvenMonthsNum ? `${breakEvenMonthsNum} months` : fallback,
      roiYear1: roiYear1Num !== null ? `${roiYear1Num}%` : fallback,
      mrrMonth12: mrr12Months ? formatCurrency(mrr12Months.avg) : fallback,
      arrProjected: arr12Months ? formatCurrency(arr12Months.avg) : fallback,
      ltvCacRatio: ltvCacRatioNum ? `${ltvCacRatioNum}` : fallback,
      
      // Numeric values
      breakEvenMonthsNum,
      roiYear1Num,
      mrrMonth12Num: mrr12Months?.avg || null,
      arrProjectedNum: arr12Months?.avg || null,
      ltvCacRatioNum,
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
      
      // Data source tracking (NEW)
      dataSources,
    };
  }, [reportData]);
}
