// ============================================
// Report Types - TypeScript interfaces for database JSONB fields
// ============================================

import { Database } from "@/integrations/supabase/types";

// Type alias for the wizard row from the database
export type WizardRow = Database["public"]["Tables"]["tb_pms_wizard"]["Row"];

// TEMPORARY: ReportRow extends WizardRow with optional AI-generated fields
// This will be replaced when we create the new tb_pms_reports table
export type ReportRow = WizardRow & {
  // AI-generated scores
  viability_score?: string | null;
  complexity_score?: string | null;
  timing_score?: string | null;
  risk_score?: string | null;
  differentiation_score?: string | null;
  pivot_readiness_score?: string | null;
  opportunity_score?: string | null;
  first_mover_score?: string | null;
  
  // Verdict
  verdict?: string | null;
  verdict_headline?: string | null;
  verdict_summary?: string | null;
  
  // Financial metrics
  investment_total_cents?: string | null;
  investment_one_payment_cents?: number | null;
  investment_front_cents?: number | null;
  investment_back_cents?: number | null;
  investment_integrations_cents?: number | null;
  investment_infra_cents?: number | null;
  investment_testing_cents?: number | null;
  break_even_months?: string | null;
  expected_roi_year1?: string | null;
  mrr_month12_cents?: string | null;
  arr_projected_cents?: string | null;
  ltv_cac_ratio?: string | null;
  generated_at?: string | null;
  
  // JSONB fields
  report_content?: unknown;
  key_metrics?: unknown;
  highlights?: unknown;
  risks?: unknown;
  market_opportunity?: unknown;
  competitors?: unknown;
  competitive_advantages?: unknown;
  investment_breakdown?: unknown;
  investment_included?: unknown;
  investment_not_included?: unknown;
  investment_comparison?: unknown;
  unit_economics?: unknown;
  financial_scenarios?: unknown;
  projection_data?: unknown;
  execution_timeline?: unknown;
  tech_stack?: unknown;
  demand_validation?: unknown;
  business_model?: unknown;
  go_to_market_preview?: unknown;
  quantified_differentiation?: unknown;
  timing_analysis?: unknown;
  pivot_scenarios?: unknown;
  success_metrics?: unknown;
  resource_requirements?: unknown;
  risk_quantification?: unknown;
  market_benchmarks?: unknown;
  uaicode_info?: unknown;
  next_steps?: unknown;
  marketing_four_ps?: unknown;
  marketing_paid_media_diagnosis?: unknown;
  marketing_paid_media_action_plan?: unknown;
  marketing_pricing_diagnosis?: unknown;
  marketing_pricing_action_plan?: unknown;
  marketing_growth_strategy?: unknown;
  marketing_competitive_advantages?: unknown;
  marketing_verdict?: unknown;
  assets_screen_mockups?: unknown;
  assets_brand_copy?: unknown;
  assets_brand_identity?: unknown;
  assets_logos?: unknown;
  assets_landing_page?: unknown;
  assets_mockup_previews?: unknown;
};

// ==========================================
// Key Metrics & Highlights
// ==========================================

export interface KeyMetrics {
  marketSize: string;
  marketLabel: string;
  expectedROI: string;
  roiLabel: string;
  paybackMonths: number;
  paybackLabel: string;
}

// ==========================================
// Opportunity Section (JSONB from n8n)
// ==========================================

export interface OpportunityHighlight {
  icon: string;
  text: string;
  detail: string;
}

export interface OpportunityRisk {
  risk: string;
  priority: "high" | "medium" | "low";
  mitigation: string;
}

export interface OpportunitySection {
  tam: string;
  sam: string;
  som: string;
  year_rate: string;
  market_maturity?: string;
  growth_period?: string;
  conclusion?: string;
  highlights?: OpportunityHighlight[];
  risks?: OpportunityRisk[];
}

// Report data from tb_pms_reports table
export interface ReportData {
  id: string;
  wizard_id: string;
  status: string;
  viability_score: number | null;
  total_market: string | null;
  expected_roi: string | null;
  payback_period: string | null;
  verdict_headline: string | null;
  created_at: string;
  updated_at: string;
  // Opportunity fields (legacy - kept for backwards compatibility)
  opportunity_tam: string | null;
  opportunity_sam: string | null;
  opportunity_som: string | null;
  opportunity_year_rate: string | null;
  // NEW: JSONB field containing opportunity data from n8n
  opportunity_section: unknown | null;
  // Legacy investment fields (kept for backwards compatibility)
  investment_one_payment_cents: number | null;
  investment_front_cents: number | null;
  investment_back_cents: number | null;
  investment_integrations_cents: number | null;
  investment_infra_cents: number | null;
  investment_testing_cents: number | null;
  // Legacy price comparison fields (kept for backwards compatibility)
  investment_one_payment_cents_traditional: number | null;
  savings_percentage: number | null;
  savings_amount_cents: number | null;
  savings_marketing_months: number | null;
  delivery_time_traditional: string | null;
  delivery_time_uaicode: string | null;
  // NEW: JSONB field containing all investment data
  section_investment: unknown | null;
  // NEW: Competitive analysis data from n8n
  competitive_analysis_section: unknown | null;
}

// Helper function to safely get value with fallback
export const safeValue = (value: string | null | undefined, fallback = "..."): string => {
  return value?.trim() || fallback;
};

export const safeNumber = (value: number | null | undefined, fallback = 0): number => {
  return value ?? fallback;
};

// ==========================================
// Feature Tier Helpers
// ==========================================

export const FEATURE_TIERS = {
  starter: ['auth', 'profiles', 'crud', 'reporting', 'notifications', 'admin', 'responsive', 'security'],
  growth: ['advancedAnalytics', 'apiIntegrations', 'payments', 'roles', 'search', 'fileUpload', 'realtime', 'workflows', 'advancedReporting', 'emailMarketing'],
  enterprise: ['ai', 'dataAnalytics', 'multiTenant', 'sso', 'customIntegrations', 'apiManagement', 'collaboration', 'automation', 'customReporting', 'support']
};

export function countFeaturesByTier(selectedFeatures: string[]): { starter: number; growth: number; enterprise: number } {
  return {
    starter: selectedFeatures.filter(f => FEATURE_TIERS.starter.includes(f)).length,
    growth: selectedFeatures.filter(f => FEATURE_TIERS.growth.includes(f)).length,
    enterprise: selectedFeatures.filter(f => FEATURE_TIERS.enterprise.includes(f)).length,
  };
}

export function determineMvpTier(selectedFeatures: string[]): 'starter' | 'growth' | 'enterprise' {
  const counts = countFeaturesByTier(selectedFeatures);
  if (counts.enterprise > 0) return 'enterprise';
  if (counts.growth > 0) return 'growth';
  return 'starter';
}

export interface Highlight {
  icon: string;
  text: string;
  detail: string;
}

export interface Risk {
  risk: string;
  priority: "high" | "medium" | "low";
  mitigation: string;
}

// ==========================================
// Market Opportunity
// ==========================================

export interface MarketOpportunity {
  tam: { value: string; label: string; description: string };
  sam: { value: string; label: string; description: string };
  som: { value: string; label: string; description: string };
  growthRate: string;
  growthLabel: string;
  conclusion: string;
}

// ==========================================
// Competitors & Competitive Advantages
// ==========================================

export interface Competitor {
  name: string;
  description: string;
  price: number;
  priceModel: string;
  weakness: string;
  yourAdvantage: string;
}

export interface CompetitiveAdvantage {
  advantage: string;
  description: string;
  competitorGap: string;
}

// ==========================================
// Investment
// ==========================================

export interface InvestmentBreakdownItem {
  name: string;
  value: number;
  percentage: number;
}

export interface InvestmentBreakdown {
  total: number;
  currency: string;
  breakdown: InvestmentBreakdownItem[];
  included: string[];
  notIncluded: string[];
  comparison: {
    traditional: number;
    savings: string;
    note: string;
  };
}

export interface InvestmentIncluded {
  items: string[];
}

export interface InvestmentNotIncluded {
  items: string[];
}

export interface InvestmentComparison {
  traditional: number;
  savings: string;
  note: string;
}

// ==========================================
// Unit Economics & Financial Scenarios
// ==========================================

export interface UnitEconomics {
  idealTicket: number;
  paybackPeriod: number;
  ltv: number;
  ltvMonths: number;
  cac: number;
  ltvCacRatio: number;
  monthlyChurn: string;
  grossMargin: string;
  howItWorks: string;
}

export interface FinancialScenario {
  name: string;
  mrrMonth12: number;
  arrYear1: number;
  breakEven: number;
  probability: string;
}

export interface ProjectionDataPoint {
  month: string;
  revenue: number;
  costs: number;
  cumulative: number;
}

// ==========================================
// Execution & Tech Stack
// ==========================================

export interface ExecutionPhase {
  phase: number;
  name: string;
  duration: string;
  description: string;
  deliverables: string[];
  icon?: string;
}

export interface TechStackCategory {
  category: string;
  items: string[];
}

// ==========================================
// Demand Validation
// ==========================================

export interface PainPoint {
  pain: string;
  intensity: number;
  source: string;
}

export interface Evidence {
  type: string;
  count: number;
  sentiment?: string;
  growth?: string;
  opportunity: string;
}

export interface ValidationMethod {
  method: string;
  cost: string;
  timeframe: string;
  description: string;
}

export interface DemandValidation {
  searchVolume: number;
  trendsScore: number;
  growthRate: string;
  painPoints: PainPoint[];
  evidences: Evidence[];
  validationMethods: ValidationMethod[];
  conclusion: string;
}

// ==========================================
// Business Model
// ==========================================

export interface RevenueStream {
  name: string;
  percentage: number;
  mrr: number;
  type: string;
  icon?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  features: number;
  targetCustomers: string;
  conversionRate?: string;
  recommended?: boolean;
}

export interface MonetizationTimelineItem {
  month: number;
  stream: string;
  status: string;
  note: string;
}

export interface BusinessModel {
  primaryModel: string;
  modelType: string;
  revenueStreams: RevenueStream[];
  pricingTiers: PricingTier[];
  monetizationTimeline: MonetizationTimelineItem[];
  conclusion: string;
}

// ==========================================
// Go-to-Market Preview
// ==========================================

export interface GTMChannel {
  name: string;
  roi: number;
  timeToResults: string;
  priority: number;
  effort: string;
}

export interface QuickWin {
  action: string;
  impact: string;
  effort: string;
  description: string;
}

export interface GoToMarketPreview {
  primaryChannel: string;
  launchStrategy: string;
  channels: GTMChannel[];
  quickWins: QuickWin[];
  first90Days: { day: number; milestone: string; metric: string }[];
}

// ==========================================
// Quantified Differentiation
// ==========================================

export interface DifferentiationMetric {
  metric: string;
  yours: string;
  competitors: string;
  advantage: string;
  source: string;
}

export interface QuantifiedDifferentiation {
  metrics: DifferentiationMetric[];
  overallAdvantage: string;
}

// ==========================================
// Timing Analysis
// ==========================================

export interface MacroTrend {
  trend: string;
  impact: string;
  relevance: string;
}

export interface WindowOfOpportunity {
  opens: string;
  closes: string;
  reasoning: string;
}

export interface TimingAnalysis {
  score: number;
  verdict: string;
  macroTrends: MacroTrend[];
  windowOfOpportunity: WindowOfOpportunity;
  firstMoverAdvantage: string[];
}

// ==========================================
// Pivot Scenarios
// ==========================================

export interface PivotScenario {
  trigger: string;
  description: string;
  newDirection: string;
  estimatedPivotTime: string;
  successProbability: string;
}

export interface PivotScenarios {
  readinessScore: number;
  scenarios: PivotScenario[];
}

// ==========================================
// Success Metrics
// ==========================================

export interface SuccessMetric {
  metric: string;
  target: string;
  timeframe: string;
  priority: string;
  category: string;
}

export interface SuccessMetrics {
  northStar: string;
  metrics: SuccessMetric[];
}

// ==========================================
// Resource Requirements
// ==========================================

export interface FounderTimePhase {
  phase: string;
  hoursPerWeek: number;
  description: string;
}

export interface TeamMember {
  role: string;
  hireMonth: number;
  cost: string;
  critical: boolean;
}

export interface CriticalSkill {
  skill: string;
  importance: string;
  alternative: string;
}

export interface ExternalSupport {
  service: string;
  cost: string;
  when: string;
}

export interface ResourceRequirements {
  founderTimePhases: FounderTimePhase[];
  teamTimeline: TeamMember[];
  criticalSkills: CriticalSkill[];
  externalSupport: ExternalSupport[];
  totalExternalCost: string;
}

// ==========================================
// Risk Quantification
// ==========================================

export interface QuantifiedRisk {
  risk: string;
  probability: string;
  impact: string;
  expectedLoss: string;
  mitigation: string;
  mitigationCost: string;
}

export interface RiskQuantification {
  overallRiskScore: number;
  risks: QuantifiedRisk[];
}

// ==========================================
// Market Benchmarks
// ==========================================

export interface MarketBenchmark {
  metric: string;
  industryAverage: string;
  topQuartile: string;
  yourTarget: string;
  status: string;
}

export interface MarketBenchmarks {
  benchmarks: MarketBenchmark[];
  conclusion: string;
}

// ==========================================
// Uaicode Info
// ==========================================

export interface Testimonial {
  name: string;
  company: string;
  avatar: string;
  quote: string;
  role: string;
}

export interface Differential {
  icon: string;
  title: string;
  description: string;
}

export interface UaicodeInfo {
  successRate: number;
  projectsDelivered: number;
  avgDeliveryWeeks: number;
  differentials: Differential[];
  testimonials: Testimonial[];
  guarantees: string[];
}

// ==========================================
// Next Steps
// ==========================================

export interface NextStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface NextSteps {
  verdictSummary: string;
  steps: NextStep[];
  cta: {
    primary: string;
    secondary: string;
  };
  contact: {
    email: string;
    whatsapp: string;
    calendly: string;
  };
}

// ==========================================
// Marketing - 4Ps Analysis
// ==========================================

export interface FourPsProduct {
  features: string[];
  quality: string;
  support: string;
  differentiators: string[];
  score: number;
}

export interface FourPsPrice {
  model: string;
  range: string;
  averageTicket: string;
  discounts: string;
  flexibility: string;
  score: number;
}

export interface FourPsPlace {
  channels: string[];
  markets: string[];
  digitalPresence: number;
  distribution: string;
  coverage: string;
  score: number;
}

export interface FourPsPromotion {
  channels: string[];
  estimatedAdSpend: string;
  tone: string;
  socialFollowers: string;
  contentStrategy: string;
  score: number;
}

export interface FourPsCompetitor {
  competitor: string;
  logo: string;
  product: FourPsProduct;
  price: FourPsPrice;
  place: FourPsPlace;
  promotion: FourPsPromotion;
}

export interface MarketingFourPs {
  competitors: FourPsCompetitor[];
}

// ==========================================
// Marketing - Paid Media
// ==========================================

export interface PaidMediaPlatform {
  name: string;
  status: string;
  spend: string;
}

export interface PaidMediaCompetitor {
  name: string;
  platforms: PaidMediaPlatform[];
  adTypes: string[];
  frequency: string;
  estimatedBudget: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export interface MarketGap {
  gap: string;
  opportunity: string;
  priority: string;
}

export interface MarketingPaidMediaDiagnosis {
  competitors: PaidMediaCompetitor[];
  marketGaps: MarketGap[];
  overallAssessment: string;
}

export interface PaidMediaChannel {
  name: string;
  allocation: number;
  budget: string;
  priority: number;
  expectedROAS: string;
  focus: string;
  keyMetrics: string[];
}

export interface PaidMediaCampaign {
  phase: string;
  duration: string;
  budgetAllocation: number;
  objective: string;
  channels: string[];
  kpis: string[];
  creatives: string[];
}

export interface Creative {
  type: string;
  format: string;
  platforms: string[];
  quantity: string;
  themes: string[];
}

export interface MarketingPaidMediaActionPlan {
  totalBudget: string;
  channels: PaidMediaChannel[];
  campaigns: PaidMediaCampaign[];
  creatives: Creative[];
  timeline: { week: string; action: string; deliverables: string[]; milestone: string }[];
  expectedResults: {
    month3: Record<string, string | number>;
    month6: Record<string, string | number>;
  };
}

// ==========================================
// Marketing - Pricing
// ==========================================

export interface PriceMapItem {
  competitor: string;
  position: string;
  price: string;
  model: string;
  targetMarket: string;
  valueProposition: string;
}

export interface PricingModel {
  type: string;
  prevalence: number;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export interface PricingGap {
  range: string;
  description: string;
  opportunity: string;
  priority: string;
}

export interface MarketingPricingDiagnosis {
  priceMap: PriceMapItem[];
  models: PricingModel[];
  gaps: PricingGap[];
  elasticity: {
    assessment: string;
    insight: string;
    recommendations: string[];
  };
  competitorPriceComparison: Record<string, string>[];
}

export interface PricingTierAction {
  name: string;
  price: string;
  annualDiscount: string;
  features: string[];
  targetCustomer: string;
  conversion: string;
  recommended?: boolean;
}

export interface MarketingPricingActionPlan {
  recommendedModel: string;
  rationale: string;
  tiers: PricingTierAction[];
  psychologicalPricing: { tactic: string; application: string; impact: string }[];
  launchStrategy: { phase: string; pricing: string; duration: string; goal: string }[];
}

// ==========================================
// Marketing - Growth Strategy
// ==========================================

export interface GrowthChannel {
  channel: string;
  stage: string;
  priority: number;
  budget: string;
  expectedCAC: string;
  expectedLTV: string;
  tactics: string[];
}

export interface MarketingGrowthStrategy {
  model: string;
  phases: { name: string; focus: string; duration: string; goals: string[] }[];
  channels: GrowthChannel[];
  kpis: { metric: string; month3: string; month6: string; month12: string }[];
}

// ==========================================
// Marketing - Competitive Advantages
// ==========================================

export interface MarketingCompetitiveAdvantage {
  advantage: string;
  description: string;
  competitorGap: string;
  marketingAngle: string;
}

export interface MarketingCompetitiveAdvantages {
  advantages: MarketingCompetitiveAdvantage[];
}

// ==========================================
// Marketing - Verdict
// ==========================================

export interface MarketingVerdict {
  recommendation: string;
  score: number;
  riskLevel: string;
  keyFindings: { finding: string; score: number }[];
  opportunities: { opportunity: string; score: number }[];
  risks: { risk: string; action: string; description: string }[];
}

// ==========================================
// Brand Assets - Screen Mockups
// ==========================================

export interface ScreenMockup {
  name: string;
  description: string;
  category: string;
  features: string[];
  device: string;
  imageUrl?: string;
}

export interface AssetsScreenMockups {
  mockups: ScreenMockup[];
}

// ==========================================
// Brand Assets - Brand Copy
// ==========================================

export interface AssetsBrandCopy {
  brandName: string;
  valueProposition: string;
  elevatorPitch: string;
  voiceTone: { trait: string; description: string }[];
  taglines: string[];
  keyMessages: string[];
  ctaExamples: string[];
  emailSubjectLines: string[];
}

// ==========================================
// Brand Assets - Brand Identity
// ==========================================

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface Typography {
  font: string;
  usage: string;
  weight: string;
}

export interface AssetsBrandIdentity {
  primaryColors: BrandColor[];
  secondaryColors: BrandColor[];
  typography: {
    headings: Typography;
    body: Typography;
    mono: Typography;
  };
  typographyScale: { name: string; size: string }[];
  logoUsage: {
    minSize: string;
    clearSpace: string;
    backgrounds: string[];
  };
  spacing: {
    base: string;
    containerMax: string;
  };
  borderRadius: { name: string; value: string }[];
}

// ==========================================
// Brand Assets - Logos
// ==========================================

export interface LogoVariant {
  variant: string;
  description: string;
  usage: string;
  colors: {
    icon: string;
    text?: string;
  };
}

export interface AssetsLogos {
  suggestions: LogoVariant[];
}

// ==========================================
// Brand Assets - Landing Page
// ==========================================

export interface LandingPageSection {
  name: string;
  description: string;
  keyElements: string[];
}

export interface AssetsLandingPage {
  sections: LandingPageSection[];
  conversionElements: string[];
  downloadNote: string;
}

// ==========================================
// Brand Assets - Mockup Previews
// ==========================================

export interface MockupPreview {
  type: string;
  description: string;
  specs: string;
}

export interface AssetsMockupPreviews {
  previews: MockupPreview[];
}

// ==========================================
// MVP Tier Pricing
// ==========================================

export interface MvpTier {
  id: string;
  tier_id: string;
  tier_name: string;
  min_price_cents: number;
  max_price_cents: number;
  traditional_min_cents: number;
  traditional_max_cents: number;
  min_days: number;
  max_days: number;
  traditional_min_days: number;
  traditional_max_days: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// Note: FEATURE_TIERS, countFeaturesByTier, and determineMvpTier 
// are now defined near the top of this file (after safeNumber)

// Helper to calculate dynamic price based on features using proportional interpolation
export function calculateDynamicPrice(
  selectedFeatures: string[],
  tier: MvpTier
): { min: number; max: number; calculated: number } {
  const tierId = determineMvpTier(selectedFeatures);
  
  // Count features only in the determined tier category
  const tierFeatures = FEATURE_TIERS[tierId];
  const totalFeaturesInTier = tierFeatures.length;
  const selectedInTier = selectedFeatures.filter(f => tierFeatures.includes(f)).length;
  
  // Proportional formula: min when 1 feature, max when all features
  let calculatedCents: number;
  
  if (selectedInTier <= 1) {
    calculatedCents = tier.min_price_cents;
  } else if (selectedInTier >= totalFeaturesInTier) {
    calculatedCents = tier.max_price_cents;
  } else {
    // Linear interpolation
    const ratio = (selectedInTier - 1) / (totalFeaturesInTier - 1);
    calculatedCents = tier.min_price_cents + 
      (tier.max_price_cents - tier.min_price_cents) * ratio;
  }
  
  return {
    min: tier.min_price_cents,
    max: tier.max_price_cents,
    calculated: Math.round(calculatedCents)
  };
}

// ==========================================
// Helper function to safely cast JSONB data
// ==========================================

export function safeJsonCast<T>(data: unknown, defaultValue: T): T {
  if (data === null || data === undefined) {
    return defaultValue;
  }
  return data as T;
}
