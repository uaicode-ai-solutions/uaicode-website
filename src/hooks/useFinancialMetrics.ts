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
    
    // ARR values - smart extraction handles both text and object formats
    let arr12Months = smartExtractARR(twelveMonthTargets);
    let arr24Months = smartExtractARR(twentyFourMonthTargets);
    
    // If ARR not available, calculate from MRR × 12
    if (!arr12Months && mrr12Months) {
      arr12Months = {
        min: mrr12Months.min * 12,
        max: mrr12Months.max * 12,
        avg: mrr12Months.avg * 12,
      };
    }
    if (!arr24Months && mrr24Months) {
      arr24Months = {
        min: mrr24Months.min * 12,
        max: mrr24Months.max * 12,
        avg: mrr24Months.avg * 12,
      };
    }
    
    // Customers - smart extraction
    const customers6Months = smartExtractCustomers(sixMonthTargets);
    const customers12Months = smartExtractCustomers(twelveMonthTargets);
    const customers24Months = smartExtractCustomers(twentyFourMonthTargets);
    
    // Churn - smart extraction
    const churn6Months = smartExtractChurn(sixMonthTargets);
    const churn12Months = smartExtractChurn(twelveMonthTargets);
    const churn24Months = smartExtractChurn(twentyFourMonthTargets);
    
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
    
    // Target CAC - use text extraction for strings like "$60-100 (blended...)"
    const targetCacStr = safeGet(performanceTargets, 'target_cac', null) as string | null;
    const targetCac = extractCACFromText(targetCacStr);
    
    // LTV/CAC Ratio - use text extraction for strings like "3:1 (assuming...)"
    const ltvCacRatioStr = safeGet(performanceTargets, 'ltv_cac_ratio_target', null) as string | null;
    const ltvCacRatioNum = extractRatioFromText(ltvCacRatioStr);
    
    // Marketing budget - try to extract from budget strategy text
    const marketingBudgetStr = safeGet(budgetStrategy, 'recommended_marketing_budget_monthly', null) as string | null;
    let marketingBudgetMonthly = parseMoneyValue(marketingBudgetStr);
    
    // If not found, try text extraction from various fields
    if (!marketingBudgetMonthly) {
      const budgetText = JSON.stringify(budgetStrategy || {});
      marketingBudgetMonthly = extractMarketingBudgetFromText(budgetText);
    }
    
    // Default marketing budget if none found (estimate 8-10% of MRR target)
    if (!marketingBudgetMonthly && mrr12Months) {
      marketingBudgetMonthly = Math.round(mrr12Months.avg * 0.10);
    }
    
    // Fallback to reasonable default
    const effectiveMarketingBudget = marketingBudgetMonthly || 5000;
    
    // ============================================
    // Calculate Derived Metrics
    // ============================================
    
    // Ideal Ticket (ARPU) - estimate from MRR / Customers
    let idealTicket: number | null = null;
    if (mrr12Months && customers12Months && customers12Months.avg > 0) {
      idealTicket = Math.round(mrr12Months.avg / customers12Months.avg);
    }
    
    // LTV calculation: ARPU × (1 / churn rate)
    let ltv: number | null = null;
    if (idealTicket && churn12Months && churn12Months.avg > 0) {
      const monthlyChurnDecimal = churn12Months.avg / 100;
      const avgLifetimeMonths = 1 / monthlyChurnDecimal;
      ltv = Math.round(idealTicket * avgLifetimeMonths);
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
    }
    // Fallback: calculate from CAC / ARPU
    if (!paybackPeriod && targetCac && idealTicket && idealTicket > 0) {
      paybackPeriod = Math.round(targetCac.avg / idealTicket);
    }
    
    // LTV/CAC Calculated: LTV / CAC average (the real calculated value)
    let ltvCacCalculated: number | null = null;
    if (ltv && targetCac && targetCac.avg > 0) {
      ltvCacCalculated = Math.round((ltv / targetCac.avg) * 10) / 10; // 1 decimal place
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
    // Prioritize database value, fallback to calculation
    // ============================================
    const breakEvenFromInvestment = safeGet(sectionInvestment, 'break_even_months', null) as string | null;
    let breakEvenMonthsNum: number | null = null;
    if (breakEvenFromInvestment) {
      const match = breakEvenFromInvestment.match(/(\d+)/);
      breakEvenMonthsNum = match ? parseInt(match[1], 10) : null;
    }
    // Fallback: calculate with realistic assumptions
    if (!breakEvenMonthsNum && mvpInvestment && mrr12Months && mrr12Months.avg > 0) {
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
    // Prioritize database value, fallback to calculation with validation
    // ============================================
    const roiFromInvestment = safeGet(sectionInvestment, 'expected_roi', null) as string | null;
    let roiYear1Num: number | null = null;
    if (roiFromInvestment) {
      // Extract percentage from strings like "150%" or "150-200%"
      const match = roiFromInvestment.match(/(-?\d+)/);
      if (match) {
        const rawRoi = parseInt(match[1], 10);
        // Validate the ROI from DB
        const validated = validateFinancialMetric(rawRoi, 'roi', 'from database');
        roiYear1Num = validated.value;
        if (validated.warning) {
          console.warn(`[useFinancialMetrics] ROI validation: ${validated.warning}`);
        }
      }
    }
    // Fallback: calculate with realistic assumptions
    if (roiYear1Num === null && mrr12Months && mvpInvestment && mvpInvestment > 0) {
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
    };
  }, [reportData]);
}
