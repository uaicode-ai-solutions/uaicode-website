// ============================================
// Financial Display Utilities
// Dynamic thresholds and status functions for adaptive UI
// ============================================

import { CheckCircle, AlertCircle, XCircle, TrendingUp, Rocket, Shield, LucideIcon } from "lucide-react";

// ============================================
// Types
// ============================================

export type MetricStatus = 'strong' | 'moderate' | 'attention';

export interface MetricStatusResult {
  status: MetricStatus;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
  label: string;
  textColor: string;
}

export interface BenchmarkBadge {
  label: string;
  variant: 'success' | 'warning' | 'default' | 'attention';
  tooltip: string;
}

export interface InvestmentHighlight {
  metric: string;
  value: string;
  numericValue: number | null;
  status: MetricStatusResult;
  subtitle: string;
  tooltip: string;
}

// ============================================
// Market-Type Aware Thresholds
// ============================================

export const METRIC_THRESHOLDS = {
  ltvCacRatio: {
    b2b: { strong: 3, moderate: 2 },
    b2c: { strong: 2.5, moderate: 1.5 },
    default: { strong: 3, moderate: 2 },
  },
  paybackMonths: {
    b2b: { strong: 12, moderate: 18 }, // lower is better
    b2c: { strong: 6, moderate: 12 },
    default: { strong: 12, moderate: 18 },
  },
  roiYear1: {
    b2b: { strong: 50, moderate: 0 },
    b2c: { strong: 30, moderate: -20 },
    default: { strong: 50, moderate: 0 },
  },
  breakEvenMonths: {
    b2b: { strong: 24, moderate: 48 }, // lower is better
    b2c: { strong: 18, moderate: 36 },
    default: { strong: 24, moderate: 48 },
  },
  growthPercent: {
    b2b: { strong: 100, moderate: 50 },
    b2c: { strong: 150, moderate: 75 },
    default: { strong: 100, moderate: 50 },
  },
};

type MarketType = 'b2b' | 'b2c' | 'default';

function getMarketType(marketType?: string): MarketType {
  if (!marketType) return 'default';
  const normalized = marketType.toLowerCase();
  if (normalized.includes('b2c') || normalized.includes('consumer')) return 'b2c';
  if (normalized.includes('b2b') || normalized.includes('enterprise')) return 'b2b';
  return 'default';
}

// ============================================
// Status Determination Functions
// ============================================

/**
 * Get status for LTV/CAC ratio (higher is better)
 */
export function getLtvCacStatus(value: number | null, marketType?: string): MetricStatusResult {
  const type = getMarketType(marketType);
  const thresholds = METRIC_THRESHOLDS.ltvCacRatio[type];
  
  if (value === null) {
    return {
      status: 'moderate',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/20',
      borderColor: 'border-border/30',
      icon: AlertCircle,
      label: 'Calculating',
      textColor: 'text-muted-foreground',
    };
  }
  
  if (value >= thresholds.strong) {
    return {
      status: 'strong',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: CheckCircle,
      label: 'Healthy',
      textColor: 'text-green-500',
    };
  }
  
  if (value >= thresholds.moderate) {
    return {
      status: 'moderate',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: AlertCircle,
      label: 'Solid',
      textColor: 'text-amber-500',
    };
  }
  
  return {
    status: 'attention',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: XCircle,
    label: 'Needs Improvement',
    textColor: 'text-red-400',
  };
}

/**
 * Get status for Payback Period (lower is better)
 */
export function getPaybackStatus(months: number | null, marketType?: string): MetricStatusResult {
  const type = getMarketType(marketType);
  const thresholds = METRIC_THRESHOLDS.paybackMonths[type];
  
  if (months === null) {
    return {
      status: 'moderate',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/20',
      borderColor: 'border-border/30',
      icon: AlertCircle,
      label: 'Calculating',
      textColor: 'text-muted-foreground',
    };
  }
  
  if (months <= thresholds.strong) {
    return {
      status: 'strong',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: Rocket,
      label: 'Fast Recovery',
      textColor: 'text-green-500',
    };
  }
  
  if (months <= thresholds.moderate) {
    return {
      status: 'moderate',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: AlertCircle,
      label: 'Standard',
      textColor: 'text-amber-500',
    };
  }
  
  return {
    status: 'attention',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: XCircle,
    label: 'Extended',
    textColor: 'text-red-400',
  };
}

/**
 * Get status for Year 1 ROI (higher is better, but negative is normal for Y1)
 */
export function getROIStatus(roi: number | null, marketType?: string): MetricStatusResult {
  const type = getMarketType(marketType);
  const thresholds = METRIC_THRESHOLDS.roiYear1[type];
  
  if (roi === null) {
    return {
      status: 'moderate',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/20',
      borderColor: 'border-border/30',
      icon: AlertCircle,
      label: 'Calculating',
      textColor: 'text-muted-foreground',
    };
  }
  
  if (roi >= thresholds.strong) {
    return {
      status: 'strong',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: TrendingUp,
      label: 'Strong Return',
      textColor: 'text-green-500',
    };
  }
  
  if (roi >= thresholds.moderate) {
    return {
      status: 'moderate',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: AlertCircle,
      label: 'Moderate Growth',
      textColor: 'text-amber-500',
    };
  }
  
  // Negative ROI - Investment Phase (normal for Y1)
  return {
    status: 'moderate', // Not "attention" - negative Y1 is normal
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: Shield,
    label: 'Investment Phase',
    textColor: 'text-amber-500',
  };
}

/**
 * Get status for Break-even (lower is better)
 */
export function getBreakEvenStatus(months: number | null, marketType?: string): MetricStatusResult {
  const type = getMarketType(marketType);
  const thresholds = METRIC_THRESHOLDS.breakEvenMonths[type];
  
  if (months === null) {
    return {
      status: 'moderate',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/20',
      borderColor: 'border-border/30',
      icon: AlertCircle,
      label: 'Calculating',
      textColor: 'text-muted-foreground',
    };
  }
  
  if (months <= thresholds.strong) {
    return {
      status: 'strong',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: Rocket,
      label: 'Fast Track',
      textColor: 'text-green-500',
    };
  }
  
  if (months <= thresholds.moderate) {
    return {
      status: 'moderate',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: AlertCircle,
      label: 'Industry Standard',
      textColor: 'text-amber-500',
    };
  }
  
  return {
    status: 'attention',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: Shield,
    label: 'Extended Runway',
    textColor: 'text-amber-600',
  };
}

/**
 * Get status for Growth Percentage (higher is better)
 */
export function getGrowthStatus(growthPercent: number | null, marketType?: string): MetricStatusResult {
  const type = getMarketType(marketType);
  const thresholds = METRIC_THRESHOLDS.growthPercent[type];
  
  if (growthPercent === null) {
    return {
      status: 'moderate',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/20',
      borderColor: 'border-border/30',
      icon: AlertCircle,
      label: 'Calculating',
      textColor: 'text-muted-foreground',
    };
  }
  
  if (growthPercent >= thresholds.strong) {
    return {
      status: 'strong',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: Rocket,
      label: 'High Growth',
      textColor: 'text-green-500',
    };
  }
  
  if (growthPercent >= thresholds.moderate) {
    return {
      status: 'moderate',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      icon: TrendingUp,
      label: 'Solid Growth',
      textColor: 'text-amber-500',
    };
  }
  
  return {
    status: 'attention',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: AlertCircle,
    label: 'Limited Growth',
    textColor: 'text-red-400',
  };
}

// ============================================
// Benchmark Badge Generators
// ============================================

export function getROIBenchmarkBadge(roi: number | null, marketType?: string): BenchmarkBadge {
  if (roi === null) {
    return { label: 'Pending', variant: 'default', tooltip: 'Calculating ROI...' };
  }
  
  if (roi > 100) {
    return { 
      label: 'Exceptional Return', 
      variant: 'success',
      tooltip: 'ROI above 100% indicates exceptional first-year performance'
    };
  }
  
  if (roi > 50) {
    return { 
      label: 'Strong Return', 
      variant: 'success',
      tooltip: 'ROI above 50% is excellent for Year 1 SaaS'
    };
  }
  
  if (roi > 0) {
    return { 
      label: 'Positive Return', 
      variant: 'default',
      tooltip: 'Positive ROI in Year 1 is a good sign of product-market fit'
    };
  }
  
  if (roi > -30) {
    return { 
      label: 'Typical for Y1 SaaS', 
      variant: 'warning',
      tooltip: 'Most SaaS businesses invest in growth during Year 1, resulting in temporarily negative ROI'
    };
  }
  
  return { 
    label: 'Growth Investment', 
    variant: 'warning',
    tooltip: 'Heavy upfront investment in customer acquisition - focus on unit economics health'
  };
}

export function getBreakEvenBenchmarkBadge(months: number | null, marketType?: string): BenchmarkBadge {
  const type = getMarketType(marketType);
  
  if (months === null) {
    return { label: 'Pending', variant: 'default', tooltip: 'Calculating break-even...' };
  }
  
  if (months <= 18) {
    return { 
      label: 'Fast Track', 
      variant: 'success',
      tooltip: `Break-even in ${months} months is faster than industry average`
    };
  }
  
  if (months <= 36) {
    return { 
      label: 'Standard Timeline', 
      variant: 'default',
      tooltip: `Break-even in ${months} months is within industry norms (24-36mo)`
    };
  }
  
  if (months <= 60) {
    return { 
      label: `Industry Avg ${type === 'b2c' ? '24-48mo' : '36-60mo'}`, 
      variant: 'warning',
      tooltip: `Break-even in ${months} months is typical for ${type === 'b2c' ? 'B2C' : 'B2B'} SaaS with high CAC`
    };
  }
  
  return { 
    label: 'Extended Runway', 
    variant: 'attention',
    tooltip: `Break-even of ${months} months requires longer runway - consider optimizing unit economics`
  };
}

export function getLtvCacBenchmarkBadge(ratio: number | null, marketType?: string): BenchmarkBadge {
  if (ratio === null) {
    return { label: 'Pending', variant: 'default', tooltip: 'Calculating LTV/CAC...' };
  }
  
  if (ratio >= 5) {
    return { 
      label: 'Excellent', 
      variant: 'success',
      tooltip: `LTV/CAC of ${ratio.toFixed(1)}x is excellent - strong unit economics`
    };
  }
  
  if (ratio >= 3) {
    return { 
      label: 'Healthy > 3x', 
      variant: 'success',
      tooltip: `LTV/CAC of ${ratio.toFixed(1)}x indicates healthy, scalable unit economics`
    };
  }
  
  if (ratio >= 2) {
    return { 
      label: 'Solid', 
      variant: 'default',
      tooltip: `LTV/CAC of ${ratio.toFixed(1)}x is acceptable - aim for 3x+ for optimal growth`
    };
  }
  
  return { 
    label: 'Needs Optimization', 
    variant: 'attention',
    tooltip: `LTV/CAC of ${ratio.toFixed(1)}x is below optimal - consider reducing CAC or increasing LTV`
  };
}

export function getPaybackBenchmarkBadge(months: number | null, marketType?: string): BenchmarkBadge {
  if (months === null) {
    return { label: 'Pending', variant: 'default', tooltip: 'Calculating payback...' };
  }
  
  if (months <= 3) {
    return { 
      label: 'Excellent', 
      variant: 'success',
      tooltip: `${months}-month payback is exceptional - very fast cost recovery`
    };
  }
  
  if (months <= 6) {
    return { 
      label: 'Fast Recovery', 
      variant: 'success',
      tooltip: `${months}-month payback is faster than industry average`
    };
  }
  
  if (months <= 12) {
    return { 
      label: 'Industry Standard', 
      variant: 'default',
      tooltip: `${months}-month payback is within typical SaaS range (6-12mo)`
    };
  }
  
  if (months <= 18) {
    return { 
      label: 'Acceptable', 
      variant: 'warning',
      tooltip: `${months}-month payback - consider strategies to improve`
    };
  }
  
  return { 
    label: 'Extended', 
    variant: 'attention',
    tooltip: `${months}-month payback is longer than optimal - review CAC and pricing`
  };
}

// ============================================
// Dynamic Bullet Points Generator
// ============================================

export interface InvestmentBullet {
  icon: LucideIcon;
  color: string;
  text: string;
  highlight?: boolean;
}

export function generateInvestmentBullets(
  ltvCacRatio: number | null,
  paybackMonths: number | null,
  marketSize: string | null,
  growthPercent: number | null,
  breakEvenMonths: number | null,
  marketType?: string
): InvestmentBullet[] {
  const bullets: InvestmentBullet[] = [];
  
  // LTV/CAC
  if (ltvCacRatio !== null) {
    const status = getLtvCacStatus(ltvCacRatio, marketType);
    if (status.status === 'strong') {
      bullets.push({
        icon: CheckCircle,
        color: 'text-green-500',
        text: `Healthy unit economics with LTV/CAC ${ltvCacRatio.toFixed(1)}x`,
        highlight: true,
      });
    } else if (status.status === 'moderate') {
      bullets.push({
        icon: AlertCircle,
        color: 'text-amber-500',
        text: `Solid LTV/CAC at ${ltvCacRatio.toFixed(1)}x - room to optimize`,
      });
    }
  }
  
  // Payback
  if (paybackMonths !== null) {
    const status = getPaybackStatus(paybackMonths, marketType);
    if (status.status === 'strong') {
      bullets.push({
        icon: Rocket,
        color: 'text-green-500',
        text: `Fast ${paybackMonths}-month payback on customer acquisition`,
        highlight: true,
      });
    } else if (status.status === 'moderate') {
      bullets.push({
        icon: AlertCircle,
        color: 'text-amber-500',
        text: `${paybackMonths}-month payback period (industry standard)`,
      });
    }
  }
  
  // Market Size
  if (marketSize && marketSize !== '...') {
    bullets.push({
      icon: TrendingUp,
      color: 'text-amber-500',
      text: `Addressing a ${marketSize} market opportunity`,
      highlight: true,
    });
  }
  
  // Growth
  if (growthPercent !== null && growthPercent > 0) {
    const status = getGrowthStatus(growthPercent, marketType);
    if (status.status === 'strong') {
      bullets.push({
        icon: Rocket,
        color: 'text-green-500',
        text: `${growthPercent.toFixed(0)}% projected ARR growth over 3 years`,
        highlight: true,
      });
    } else if (status.status === 'moderate') {
      bullets.push({
        icon: TrendingUp,
        color: 'text-amber-500',
        text: `${growthPercent.toFixed(0)}% projected growth trajectory`,
      });
    }
  }
  
  // Break-even context
  if (breakEvenMonths !== null) {
    const status = getBreakEvenStatus(breakEvenMonths, marketType);
    if (status.status === 'strong') {
      bullets.push({
        icon: CheckCircle,
        color: 'text-green-500',
        text: `Path to profitability in ${breakEvenMonths} months`,
        highlight: true,
      });
    } else if (status.status === 'moderate') {
      bullets.push({
        icon: Shield,
        color: 'text-amber-500',
        text: `Break-even timeline within industry norms`,
      });
    }
  }
  
  return bullets;
}

// ============================================
// Overall Investment Score
// ============================================

export type InvestmentGrade = 'A' | 'B' | 'C' | 'D';

export interface InvestmentAssessment {
  grade: InvestmentGrade;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export function getInvestmentAssessment(
  ltvCacRatio: number | null,
  paybackMonths: number | null,
  roiYear1: number | null,
  breakEvenMonths: number | null,
  marketType?: string
): InvestmentAssessment {
  let score = 0;
  let metrics = 0;
  
  // LTV/CAC (weight: 30%)
  if (ltvCacRatio !== null) {
    metrics++;
    const status = getLtvCacStatus(ltvCacRatio, marketType);
    if (status.status === 'strong') score += 30;
    else if (status.status === 'moderate') score += 20;
    else score += 5;
  }
  
  // Payback (weight: 25%)
  if (paybackMonths !== null) {
    metrics++;
    const status = getPaybackStatus(paybackMonths, marketType);
    if (status.status === 'strong') score += 25;
    else if (status.status === 'moderate') score += 15;
    else score += 5;
  }
  
  // ROI (weight: 25%)
  if (roiYear1 !== null) {
    metrics++;
    const status = getROIStatus(roiYear1, marketType);
    if (status.status === 'strong') score += 25;
    else if (status.status === 'moderate') score += 15;
    else score += 5;
  }
  
  // Break-even (weight: 20%)
  if (breakEvenMonths !== null) {
    metrics++;
    const status = getBreakEvenStatus(breakEvenMonths, marketType);
    if (status.status === 'strong') score += 20;
    else if (status.status === 'moderate') score += 12;
    else score += 5;
  }
  
  // Normalize score if not all metrics available
  if (metrics > 0 && metrics < 4) {
    score = Math.round((score / metrics) * 4);
  }
  
  if (score >= 80) {
    return {
      grade: 'A',
      label: 'Strong Investment',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      description: 'Excellent fundamentals with healthy unit economics',
    };
  }
  
  if (score >= 60) {
    return {
      grade: 'B',
      label: 'Solid Foundation',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      description: 'Good potential with room for optimization',
    };
  }
  
  if (score >= 40) {
    return {
      grade: 'C',
      label: 'Growth Opportunity',
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      description: 'Requires focused execution and metric improvement',
    };
  }
  
  return {
    grade: 'D',
    label: 'High Risk',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    description: 'Significant challenges - consider pivoting strategy',
  };
}
