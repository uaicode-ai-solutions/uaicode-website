// ============================================
// Report Types - TypeScript interfaces for database JSONB fields
// ============================================

import { Database } from "@/integrations/supabase/types";

// Type alias for the report row from the database
export type ReportRow = Database["public"]["Tables"]["tb_pms_reports"]["Row"];

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
  targetMarket: string;
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
// Helper function to safely cast JSONB data
// ==========================================

export function safeJsonCast<T>(data: unknown, defaultValue: T): T {
  if (data === null || data === undefined) {
    return defaultValue;
  }
  return data as T;
}
