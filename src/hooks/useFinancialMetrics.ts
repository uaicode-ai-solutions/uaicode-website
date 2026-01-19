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
    // Extract Growth Targets (handles both string and object formats)
    // ============================================
    const growthTargets = safeGet(growthIntelligence, 'growth_targets', null) as Record<string, unknown> | null;
    const sixMonthTargets = safeGet(growthTargets, 'six_month_targets', null);
    const twelveMonthTargets = safeGet(growthTargets, 'twelve_month_targets', null);
    const twentyFourMonthTargets = safeGet(growthTargets, 'twenty_four_month_targets', null);
    
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
    
    const marketingBudgetStr = safeGet(budgetStrategy, 'recommended_marketing_budget_monthly', null) as string | null;
    const marketingBudgetMonthly = parseMoneyValue(marketingBudgetStr);
    
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
    
    // Payback Period: CAC / ARPU
    let paybackPeriod: number | null = null;
    if (targetCac && idealTicket && idealTicket > 0) {
      paybackPeriod = Math.round(targetCac.avg / idealTicket);
    }
    
    // Break-even calculation: MVP Investment / (MRR - monthly costs)
    // Estimate monthly costs as 30% of MRR (typical SaaS)
    let breakEvenMonthsNum: number | null = null;
    if (mvpInvestment && mrr12Months && mrr12Months.avg > 0) {
      const netMrrMonthly = mrr12Months.avg * 0.7; // 70% margin
      // Linear interpolation: at month 0 MRR is 0, at month 12 it's mrr12Months
      // Average monthly revenue = mrr12Months / 2
      const avgMonthlyRevenue = mrr12Months.avg / 2;
      const netMonthly = avgMonthlyRevenue * 0.7;
      if (netMonthly > 0) {
        breakEvenMonthsNum = Math.ceil(mvpInvestment / netMonthly);
      }
    }
    
    // ROI Year 1: ((Revenue Year 1 - Investment) / Investment) × 100
    let roiYear1Num: number | null = null;
    if (arr12Months && mvpInvestment && mvpInvestment > 0) {
      // Revenue year 1 = approximately ARR / 2 (ramp up during the year)
      const revenueYear1 = arr12Months.avg / 2;
      roiYear1Num = Math.round(((revenueYear1 - mvpInvestment) / mvpInvestment) * 100);
    }
    
    // ============================================
    // Generate Projection Data (12 months)
    // ============================================
    const projectionData: ProjectionDataPoint[] = [];
    if (mrr12Months && mvpInvestment) {
      const monthlyOperatingCost = (marketingBudgetMonthly || 5000) + (mvpInvestment * 0.01); // Marketing + ~1% of investment as ops
      
      for (let i = 1; i <= 12; i++) {
        // Linear ramp from 0 to MRR_12
        const monthRevenue = (mrr12Months.avg / 12) * i;
        // Front-loaded costs (higher initially)
        const monthCosts = i <= 3 ? monthlyOperatingCost * 1.5 : monthlyOperatingCost;
        
        projectionData.push({
          month: `M${i}`,
          revenue: Math.round(monthRevenue),
          costs: Math.round(monthCosts),
          cumulative: 0, // Will calculate below
        });
      }
      
      // Calculate cumulative
      let cumulative = -mvpInvestment;
      projectionData.forEach(point => {
        cumulative += point.revenue - point.costs;
        point.cumulative = Math.round(cumulative);
      });
    }
    
    // ============================================
    // Generate Financial Scenarios
    // ============================================
    const financialScenarios: FinancialScenario[] = [];
    if (mrr12Months) {
      // Conservative: min values
      financialScenarios.push({
        name: "Conservative",
        mrrMonth12: mrr12Months.min,
        arrYear1: mrr12Months.min * 12,
        breakEven: breakEvenMonthsNum ? Math.ceil(breakEvenMonthsNum * 1.3) : 18,
        probability: "20%",
      });
      
      // Realistic: avg values
      financialScenarios.push({
        name: "Realistic",
        mrrMonth12: mrr12Months.avg,
        arrYear1: mrr12Months.avg * 12,
        breakEven: breakEvenMonthsNum || 12,
        probability: "60%",
      });
      
      // Optimistic: max values
      financialScenarios.push({
        name: "Optimistic",
        mrrMonth12: mrr12Months.max,
        arrYear1: mrr12Months.max * 12,
        breakEven: breakEvenMonthsNum ? Math.ceil(breakEvenMonthsNum * 0.7) : 8,
        probability: "20%",
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
    const marketGrowthRateStr = safeGet(opportunitySection, 'market_growth_rate', null) as string | null;
    const marketGrowth = parsePercentageRange(marketGrowthRateStr);
    const growthMultiplier = marketGrowth ? 1 + (marketGrowth.avg / 100) : 1.3; // Default 30% growth
    
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
    if (idealTicket || ltv || paybackPeriod || ltvCacRatioNum) {
      unitEconomics = {
        idealTicket: idealTicket ? `$${idealTicket}` : fallback,
        paybackPeriod: paybackPeriod ? `${paybackPeriod}` : fallback,
        ltv: ltv ? `$${ltv.toLocaleString()}` : fallback,
        ltvMonths: churn12Months && churn12Months.avg > 0 
          ? `${Math.round(1 / (churn12Months.avg / 100))}` 
          : fallback,
        ltvCacRatio: ltvCacRatioNum ? `${ltvCacRatioNum}` : fallback,
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
