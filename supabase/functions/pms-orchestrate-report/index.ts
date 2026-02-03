import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Production URL for generating share links
const PRODUCTION_URL = "https://uaicodewebsite.lovable.app";

const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("REPORT_NEWREPORT_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("REPORT_NEWREPORT_WEBHOOK_ID not configured");
  }
  if (webhookId.startsWith("http")) {
    return webhookId;
  }
  return `https://n8n.uaicode.dev/webhook/${webhookId}`;
};

// Generate cryptographically secure share token (32 hex chars)
const generateShareToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};

// Sequential tools 1→12
const TOOLS_SEQUENCE = [
  { step: 1, tool_name: "Create_Report_Row", label: "Initialize Report" },
  { step: 2, tool_name: "Call_Get_Investment_Tool_", label: "Investment Analysis" },
  { step: 3, tool_name: "Call_Get_Benchmark_Tool_", label: "Market Benchmarks" },
  { step: 4, tool_name: "Call_Get_Competitors_Tool_", label: "Competitor Research" },
  { step: 5, tool_name: "Call_Get_Opportunity_Tool_", label: "Market Opportunity" },
  { step: 6, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy" },
  { step: 7, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling" },
  { step: 8, tool_name: "Call_Get_PaidMedia_Tool_", label: "Paid Media Analysis" },
  { step: 9, tool_name: "Call_Get_Growth_Tool_", label: "Growth Projections" },
  { step: 10, tool_name: "Call_Get_Summary_Tool_", label: "Executive Summary" },
  { step: 11, tool_name: "Call_Get_Hero_Score_Tool_", label: "Final Scoring" },
  { step: 12, tool_name: "Call_Get_Business_Plan_Tool_", label: "Business Plan" },
];

// Graceful shutdown detection
let shutdownRequested = false;

addEventListener('beforeunload', () => {
  shutdownRequested = true;
  console.warn('⚠️ Worker shutdown requested, attempting graceful cleanup...');
});

// ============================================
// STATIC HTML GENERATION FOR PUBLIC SHARING
// Full Business Plan Replica with 9 Cards + SVG Charts
// ============================================

interface MarketingTier {
  service_name: string;
  uaicode_price_cents: number;
  traditional_max_cents: number;
}

interface ReportData {
  business_plan_section: Record<string, unknown> | null;
  opportunity_section: Record<string, unknown> | null;
  competitive_analysis_section: Record<string, unknown> | null;
  icp_intelligence_section: Record<string, unknown> | null;
  price_intelligence_section: Record<string, unknown> | null;
  growth_intelligence_section: Record<string, unknown> | null;
  section_investment: Record<string, unknown> | null;
}

// Format currency - handles both pre-formatted strings and raw numbers
function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "...";
  
  // If already a formatted string with $ sign, return as-is
  if (typeof value === "string") {
    if (value.startsWith("$")) return value;
    // Try to parse as number
    const num = parseFloat(value);
    if (isNaN(num)) return value || "...";
    value = num;
  }
  
  if (typeof value !== "number" || isNaN(value)) return "...";
  
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format percentage - handles both pre-formatted strings and raw numbers
function formatPercent(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "...";
  
  // If already a formatted string with % sign, return as-is
  if (typeof value === "string") {
    if (value.includes("%")) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value || "...";
    value = num;
  }
  
  if (typeof value !== "number" || isNaN(value)) return "...";
  return `${value >= 0 ? "+" : ""}${value.toFixed(0)}%`;
}

// Generate SVG Donut Chart for TAM/SAM/SOM
function generateDonutChartSvg(tam: string, sam: string, som: string): string {
  return `
    <div style="display: flex; flex-direction: column; align-items: center; margin: 24px 0;">
      <svg viewBox="0 0 200 200" style="width: 200px; height: 200px;">
        <defs>
          <linearGradient id="tamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#D97706;stop-opacity:0.3" />
          </linearGradient>
          <linearGradient id="samGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#D97706;stop-opacity:0.6" />
          </linearGradient>
          <linearGradient id="somGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFBD17;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- TAM outer ring -->
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#tamGrad)" stroke-width="15"/>
        <!-- SAM middle ring -->
        <circle cx="100" cy="100" r="70" fill="none" stroke="url(#samGrad)" stroke-width="15"/>
        <!-- SOM inner filled -->
        <circle cx="100" cy="100" r="45" fill="url(#somGrad)"/>
        <!-- Center text -->
        <text x="100" y="95" text-anchor="middle" fill="#fff" font-size="12" font-weight="600">SOM</text>
        <text x="100" y="112" text-anchor="middle" fill="#FFBD17" font-size="11">${som}</text>
      </svg>
      <div style="display: flex; justify-content: center; gap: 20px; margin-top: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: rgba(245,158,11,0.3);"></span>
          <span style="font-size: 13px; color: rgba(255,255,255,0.8);">TAM: ${tam}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: rgba(245,158,11,0.6);"></span>
          <span style="font-size: 13px; color: rgba(255,255,255,0.8);">SAM: ${sam}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #FFBD17;"></span>
          <span style="font-size: 13px; color: rgba(255,255,255,0.8);">SOM: ${som}</span>
        </div>
      </div>
    </div>
  `;
}

// deno-lint-ignore no-explicit-any
type FinancialScenario = { name?: string; breakEvenMonths?: number; break_even_months?: number; mrrMonth12?: number; };

// Generate SVG J-Curve Chart
function generateJCurveSvg(scenarios: FinancialScenario[]): string {
  if (!scenarios || scenarios.length === 0) {
    return '<div style="text-align: center; color: rgba(255,255,255,0.5); padding: 40px;">Financial scenarios not available</div>';
  }
  
  const conservative = scenarios.find(s => s.name === "Conservative");
  const realistic = scenarios.find(s => s.name === "Realistic" || s.name === "Base");
  const optimistic = scenarios.find(s => s.name === "Optimistic");
  
  const getBreakEven = (s: FinancialScenario | undefined) => 
    s?.breakEvenMonths || s?.break_even_months || 0;
  
  return `
    <div style="margin: 24px 0;">
      <svg viewBox="0 0 400 200" style="width: 100%; height: auto; min-height: 180px;">
        <!-- Grid line at zero -->
        <line x1="40" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4"/>
        
        <!-- Y Axis labels -->
        <text x="35" y="30" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="10">+</text>
        <text x="35" y="105" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="10">0</text>
        <text x="35" y="180" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="10">-</text>
        
        <!-- X Axis labels -->
        <text x="40" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M0</text>
        <text x="125" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M12</text>
        <text x="210" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M24</text>
        <text x="295" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M36</text>
        <text x="365" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M60</text>
        
        <!-- Conservative path (dashed gray) -->
        <path d="M40,160 Q150,175 200,120 T380,40" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 2"/>
        
        <!-- Realistic path (solid amber - highlighted) -->
        <path d="M40,160 Q130,170 180,105 T380,25" fill="none" stroke="#F59E0B" stroke-width="3"/>
        
        <!-- Optimistic path (solid green) -->
        <path d="M40,160 Q110,160 150,90 T380,15" fill="none" stroke="#10B981" stroke-width="2"/>
        
        <!-- Legend -->
        <g transform="translate(50, 15)">
          <line x1="0" y1="0" x2="20" y2="0" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 2"/>
          <text x="25" y="4" fill="rgba(255,255,255,0.6)" font-size="9">Conservative</text>
          
          <line x1="100" y1="0" x2="120" y2="0" stroke="#F59E0B" stroke-width="3"/>
          <text x="125" y="4" fill="#F59E0B" font-size="9" font-weight="600">Realistic</text>
          
          <line x1="195" y1="0" x2="215" y2="0" stroke="#10B981" stroke-width="2"/>
          <text x="220" y="4" fill="rgba(255,255,255,0.6)" font-size="9">Optimistic</text>
        </g>
      </svg>
      
      <!-- Scenario cards -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px;">
        <div style="padding: 12px; border-radius: 8px; text-align: center; background: rgba(148,163,184,0.1); border: 1px solid rgba(148,163,184,0.3);">
          <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Conservative</div>
          <div style="font-size: 14px; font-weight: 600; color: #94A3B8;">Break-even M${getBreakEven(conservative)}</div>
        </div>
        <div style="padding: 12px; border-radius: 8px; text-align: center; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4);">
          <div style="font-size: 11px; color: #F59E0B; margin-bottom: 4px;">Realistic</div>
          <div style="font-size: 14px; font-weight: 600; color: #FFBD17;">Break-even M${getBreakEven(realistic)}</div>
        </div>
        <div style="padding: 12px; border-radius: 8px; text-align: center; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);">
          <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Optimistic</div>
          <div style="font-size: 14px; font-weight: 600; color: #10B981;">Break-even M${getBreakEven(optimistic)}</div>
        </div>
      </div>
    </div>
  `;
}

// Generate the complete static HTML for the shared report (9 Cards)
function generateBusinessPlanHtml(
  reportData: ReportData,
  marketingData: MarketingTier[]
): string {
  const bp = reportData.business_plan_section || {};
  const opp = reportData.opportunity_section || {};
  const comp = reportData.competitive_analysis_section || {};
  const icp = reportData.icp_intelligence_section || {};
  const pricing = reportData.price_intelligence_section || {};
  const growth = reportData.growth_intelligence_section || {};
  const investment = reportData.section_investment || {};

  // ===== BUSINESS PLAN DATA =====
  const viabilityScore = Number(bp.viability_score || 0);
  const viabilityLabel = String(bp.viability_label || "Pending");
  const executiveNarrative = String(bp.ai_executive_narrative || "");
  const strategicVerdict = String(bp.ai_strategic_verdict || "");
  const recommendations = Array.isArray(bp.ai_key_recommendations) ? bp.ai_key_recommendations : [];
  const insights = (bp.ai_section_insights || {}) as Record<string, unknown>;
  const marketInsight = String(insights.market_insight || "");

  // ===== OPPORTUNITY DATA (using correct field names) =====
  const tam = String(opp.tam_value || formatCurrency(opp.tam_value_numeric as number));
  const sam = String(opp.sam_value || formatCurrency(opp.sam_value_numeric as number));
  const som = String(opp.som_value || formatCurrency(opp.som_value_numeric as number));
  const cagr = String(opp.market_growth_rate || formatPercent(opp.market_growth_rate_numeric as number));
  const macroTrends = Array.isArray(opp.macro_trends) ? opp.macro_trends : [];

  // ===== GROWTH INTELLIGENCE (nested financial_metrics) =====
  const fm = (growth.financial_metrics || {}) as Record<string, unknown>;
  const cm = (growth.customer_metrics || {}) as Record<string, unknown>;
  const scenarios = Array.isArray(growth.financial_scenarios) ? growth.financial_scenarios : [];
  
  const arrY1 = fm.arr_year_1_formatted || formatCurrency(fm.arr_year_1 as number);
  const arrY2 = fm.arr_year_2_formatted || formatCurrency(fm.arr_year_2 as number);
  const breakEvenMonths = fm.break_even_months ? `${fm.break_even_months} mo` : "...";
  const roiY1 = fm.roi_year_1_formatted || formatPercent(fm.roi_year_1 as number);
  const roiY2 = fm.roi_year_2_formatted || formatPercent(fm.roi_year_2 as number);
  const ltvCac = fm.ltv_cac_ratio ? `${Number(fm.ltv_cac_ratio).toFixed(1)}x` : "...";
  const paybackMonths = fm.payback_months ? `${fm.payback_months} mo` : "...";
  const customersY1 = cm.customers_month_12 ? Number(cm.customers_month_12).toLocaleString() : "...";

  // ===== COMPETITORS (convert object to array) =====
  const competitorsObj = (comp.competitors || {}) as Record<string, unknown>;
  const competitorsList = Object.keys(competitorsObj)
    .filter(k => k.startsWith("competitor_"))
    .map(k => competitorsObj[k] as Record<string, unknown>)
    .slice(0, 4);

  // ===== ICP (nested persona and demographics) =====
  const persona = (icp.persona || (Array.isArray(icp.primary_personas) ? icp.primary_personas[0] : {}) || {}) as Record<string, unknown>;
  const demographics = (icp.demographics || {}) as Record<string, unknown>;
  const budgetTimeline = (icp.budget_timeline || {}) as Record<string, unknown>;
  
  const icpName = String(persona.name || persona.persona_name || "Target Customer");
  const icpJobTitle = String(persona.job_title || persona.role || "");
  const companySize = String(persona.company_size || demographics.company_size || "");
  const industry = String(persona.industry_focus || demographics.industry || "");
  const typicalBudget = String(budgetTimeline.typical_budget || "");
  const decisionTimeline = String(budgetTimeline.decision_timeline || "");

  // Pain points - extract text from objects
  const rawPainPoints = Array.isArray(icp.pain_points) ? icp.pain_points : [];
  // deno-lint-ignore no-explicit-any
  const painPoints = rawPainPoints.map((p: any) => 
    typeof p === "string" ? p : String(p.pain_point || "")
  ).filter(Boolean);

  // Buying triggers
  const buyingTriggers = Array.isArray(icp.buying_triggers) ? icp.buying_triggers : [];

  // ===== PRICING (recommended_tiers) =====
  const pricingTiers = Array.isArray(pricing.recommended_tiers) ? pricing.recommended_tiers : [];
  const recommendedArpu = formatCurrency((pricing.unit_economics as Record<string, unknown>)?.recommended_arpu as number || 0);
  const pricingModel = String(pricing.recommended_model || "");
  const pricePositioning = String(pricing.price_positioning || "");

  // ===== INVESTMENT =====
  const mvpInvestmentCents = Number(investment.investment_one_payment_cents || 0);
  const mvpInvestment = mvpInvestmentCents / 100;
  const traditionalMinCents = Number(investment.traditional_min_cents || 0);
  const traditionalMaxCents = Number(investment.traditional_max_cents || 0);
  const savingsPercent = Number(investment.savings_percentage || 0);

  // Marketing bundle
  const marketingUaicodeTotal = marketingData.reduce((sum, s) => sum + (s.uaicode_price_cents || 0), 0) / 100;
  const marketingTraditionalMax = marketingData.reduce((sum, s) => sum + (s.traditional_max_cents || 0), 0) / 100;
  const bundleTotal = mvpInvestment + (marketingUaicodeTotal * 12);

  // Score class based on value
  const scoreClass = viabilityScore >= 70 ? 'sr-score-high' : viabilityScore >= 40 ? 'sr-score-medium' : 'sr-score-low';

  // ===== CSS STYLES =====
  const styles = `
    <style>
      * { box-sizing: border-box; }
      .sr-container { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #fff; line-height: 1.7; max-width: 1200px; margin: 0 auto; padding: 24px; }
      .sr-card { background: rgba(34, 39, 42, 0.9); border: 1px solid rgba(255, 189, 23, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px; backdrop-filter: blur(10px); }
      .sr-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .sr-card-title { font-size: 18px; font-weight: 600; color: #fff; margin: 0; }
      .sr-icon { width: 22px; height: 22px; color: #FFBD17; flex-shrink: 0; }
      .sr-grid { display: grid; gap: 16px; }
      .sr-grid-2 { grid-template-columns: repeat(2, 1fr); }
      .sr-grid-3 { grid-template-columns: repeat(3, 1fr); }
      .sr-grid-4 { grid-template-columns: repeat(4, 1fr); }
      @media (max-width: 768px) { 
        .sr-grid-2, .sr-grid-3, .sr-grid-4 { grid-template-columns: 1fr; } 
        .sr-container { padding: 16px; }
      }
      .sr-metric { background: rgba(0, 0, 0, 0.3); border-radius: 10px; padding: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
      .sr-metric-value { font-size: 26px; font-weight: 700; color: #FFBD17; margin-bottom: 6px; }
      .sr-metric-label { font-size: 12px; color: rgba(255, 255, 255, 0.7); text-transform: uppercase; letter-spacing: 0.5px; }
      .sr-text { color: rgba(255, 255, 255, 0.85); font-size: 15px; }
      .sr-insight { background: rgba(255, 189, 23, 0.1); border-left: 4px solid #FFBD17; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-top: 20px; }
      .sr-insight-text { font-style: italic; color: #fff; }
      .sr-badge { display: inline-block; background: rgba(255, 189, 23, 0.2); color: #FFBD17; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 500; }
      .sr-badge-priority { padding: 4px 10px; font-size: 11px; border-radius: 6px; text-transform: uppercase; font-weight: 600; }
      .sr-badge-high { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
      .sr-badge-medium { background: rgba(234, 179, 8, 0.2); color: #eab308; }
      .sr-badge-low { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
      .sr-score-circle { width: 90px; height: 90px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; margin: 0 auto; }
      .sr-score-high { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 3px solid #22c55e; }
      .sr-score-medium { background: rgba(234, 179, 8, 0.2); color: #eab308; border: 3px solid #eab308; }
      .sr-score-low { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 3px solid #ef4444; }
      .sr-competitor { background: rgba(0, 0, 0, 0.3); border-radius: 10px; padding: 18px; border: 1px solid rgba(255,255,255,0.05); }
      .sr-competitor-name { font-weight: 600; color: #fff; margin-bottom: 8px; font-size: 15px; }
      .sr-competitor-desc { font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-bottom: 10px; }
      .sr-competitor-price { font-size: 13px; color: #FFBD17; font-weight: 500; }
      .sr-list { list-style: none; padding: 0; margin: 0; }
      .sr-list-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sr-list-item:last-child { border-bottom: none; }
      .sr-list-bullet { width: 6px; height: 6px; background: #FFBD17; border-radius: 50%; margin-top: 9px; flex-shrink: 0; }
      .sr-tier-card { background: rgba(0, 0, 0, 0.3); border-radius: 10px; padding: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
      .sr-tier-name { font-weight: 600; color: #FFBD17; margin-bottom: 10px; font-size: 16px; }
      .sr-tier-price { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 12px; }
      .sr-tier-features { text-align: left; font-size: 13px; color: rgba(255,255,255,0.7); }
      .sr-tier-feature { padding: 4px 0; }
      .sr-investment-card { background: rgba(0, 0, 0, 0.3); border-radius: 10px; padding: 20px; border: 1px solid rgba(255,255,255,0.1); }
      .sr-investment-header { font-weight: 600; color: #FFBD17; font-size: 16px; margin-bottom: 16px; }
      .sr-investment-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
      .sr-investment-row:last-child { border-bottom: none; }
      .sr-investment-label { color: rgba(255, 255, 255, 0.8); font-size: 14px; }
      .sr-investment-value { font-weight: 600; color: #FFBD17; font-size: 15px; }
      .sr-investment-total { font-size: 28px; color: #22c55e; font-weight: 700; }
      .sr-savings { background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
      .sr-section-subtitle { color: #FFBD17; font-size: 14px; font-weight: 600; margin-bottom: 12px; margin-top: 20px; }
      .sr-triggers { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .sr-trigger-badge { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); padding: 6px 12px; border-radius: 20px; font-size: 12px; }
      .sr-demographics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px; }
      @media (max-width: 768px) { .sr-demographics { grid-template-columns: 1fr; } }
      .sr-demo-item { background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; }
      .sr-demo-label { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 4px; }
      .sr-demo-value { font-size: 14px; color: #fff; font-weight: 500; }
    </style>
  `;

  // ===== BUILD HTML =====
  const html = `
    ${styles}
    <div class="sr-container">
      
      <!-- ========== CARD 1: EXECUTIVE SNAPSHOT ========== -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <h2 class="sr-card-title">Executive Snapshot</h2>
          <div style="margin-left: auto;">
            <div class="sr-score-circle ${scoreClass}" style="width: 60px; height: 60px; font-size: 22px;">${viabilityScore}</div>
          </div>
        </div>
        <div class="sr-grid sr-grid-4">
          <div class="sr-metric">
            <div class="sr-metric-value">${tam}</div>
            <div class="sr-metric-label">TAM</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${sam}</div>
            <div class="sr-metric-label">SAM</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${som}</div>
            <div class="sr-metric-label">SOM</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${cagr}</div>
            <div class="sr-metric-label">CAGR</div>
          </div>
        </div>
        <div class="sr-grid sr-grid-4" style="margin-top: 16px;">
          <div class="sr-metric">
            <div class="sr-metric-value">${arrY1}</div>
            <div class="sr-metric-label">Y1 ARR</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${ltvCac}</div>
            <div class="sr-metric-label">LTV/CAC</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${paybackMonths}</div>
            <div class="sr-metric-label">Payback</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${breakEvenMonths}</div>
            <div class="sr-metric-label">Break-even</div>
          </div>
        </div>
        <div class="sr-grid sr-grid-4" style="margin-top: 16px;">
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(mvpInvestment)}</div>
            <div class="sr-metric-label">Investment</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${savingsPercent}%</div>
            <div class="sr-metric-label">Savings</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${roiY1}</div>
            <div class="sr-metric-label">ROI Y1</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${roiY2}</div>
            <div class="sr-metric-label">ROI Y2</div>
          </div>
        </div>
      </div>

      <!-- ========== CARD 2: EXECUTIVE NARRATIVE ========== -->
      ${executiveNarrative ? `
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h2 class="sr-card-title">Executive Summary</h2>
        </div>
        <p class="sr-text">${executiveNarrative}</p>
        ${marketInsight ? `
        <div class="sr-insight">
          <p class="sr-insight-text">"${marketInsight}"</p>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- ========== CARD 3: MARKET ANALYSIS ========== -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="sr-card-title">Market Analysis</h2>
        </div>
        <div class="sr-grid sr-grid-3">
          <div class="sr-metric">
            <div class="sr-metric-value">${tam}</div>
            <div class="sr-metric-label">Total Addressable Market</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${sam}</div>
            <div class="sr-metric-label">Serviceable Available Market</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${som}</div>
            <div class="sr-metric-label">Serviceable Obtainable Market</div>
          </div>
        </div>
        
        <!-- Donut Chart SVG -->
        ${generateDonutChartSvg(tam, sam, som)}
        
        <div style="display: flex; justify-content: center; margin-top: 16px;">
          <div class="sr-metric" style="max-width: 200px;">
            <div class="sr-metric-value">${cagr}</div>
            <div class="sr-metric-label">Market Growth (CAGR)</div>
          </div>
        </div>
        
        ${macroTrends.length > 0 ? `
        <div class="sr-section-subtitle" style="margin-top: 24px;">Macro Trends</div>
        <ul class="sr-list">
          ${macroTrends.slice(0, 4).map((t: { trend?: string; impact?: string }) => `
            <li class="sr-list-item">
              <span class="sr-list-bullet"></span>
              <span class="sr-text"><strong>${String(t.trend || '')}</strong> — ${String(t.impact || '')}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}
      </div>

      <!-- ========== CARD 4: COMPETITIVE LANDSCAPE ========== -->
      ${competitorsList.length > 0 ? `
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h2 class="sr-card-title">Competitive Landscape</h2>
        </div>
        <div class="sr-grid sr-grid-2">
          ${competitorsList.map((c: Record<string, unknown>) => {
            const name = String(c.saas_app_name || c.name || 'Competitor');
            const positioning = String(c.saas_app_positioning || c.positioning || c.description || '');
            const priceRange = String(c.saas_app_price_range || c.price_range || '');
            const priority = String(c.priority_score || c.priority || 'medium').toLowerCase();
            const priorityClass = priority === 'high' ? 'sr-badge-high' : priority === 'low' ? 'sr-badge-low' : 'sr-badge-medium';
            return `
              <div class="sr-competitor">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div class="sr-competitor-name">${name}</div>
                  <span class="sr-badge-priority ${priorityClass}">${priority}</span>
                </div>
                <div class="sr-competitor-desc">${positioning}</div>
                ${priceRange ? `<div class="sr-competitor-price">${priceRange}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      ` : ''}

      <!-- ========== CARD 5: TARGET CUSTOMER ========== -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <h2 class="sr-card-title">Target Customer</h2>
        </div>
        
        <!-- Persona Header -->
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #FFBD17, #F59E0B); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #000;">
            ${icpName.charAt(0)}
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 600; color: #fff;">${icpName}</div>
            ${icpJobTitle ? `<div style="font-size: 14px; color: rgba(255,255,255,0.7);">${icpJobTitle}</div>` : ''}
          </div>
        </div>
        
        <!-- Demographics Grid -->
        <div class="sr-demographics">
          ${companySize ? `
          <div class="sr-demo-item">
            <div class="sr-demo-label">Company Size</div>
            <div class="sr-demo-value">${companySize}</div>
          </div>
          ` : ''}
          ${industry ? `
          <div class="sr-demo-item">
            <div class="sr-demo-label">Industry</div>
            <div class="sr-demo-value">${industry}</div>
          </div>
          ` : ''}
          ${typicalBudget ? `
          <div class="sr-demo-item">
            <div class="sr-demo-label">Typical Budget</div>
            <div class="sr-demo-value">${typicalBudget}</div>
          </div>
          ` : ''}
          ${decisionTimeline ? `
          <div class="sr-demo-item">
            <div class="sr-demo-label">Decision Timeline</div>
            <div class="sr-demo-value">${decisionTimeline}</div>
          </div>
          ` : ''}
        </div>
        
        <!-- Pain Points -->
        ${painPoints.length > 0 ? `
        <div class="sr-section-subtitle">Key Pain Points</div>
        <ul class="sr-list">
          ${painPoints.slice(0, 5).map((p: string) => `
            <li class="sr-list-item">
              <span class="sr-list-bullet"></span>
              <span class="sr-text">${p}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}
        
        <!-- Buying Triggers -->
        ${buyingTriggers.length > 0 ? `
        <div class="sr-section-subtitle">Buying Triggers</div>
        <div class="sr-triggers">
          ${buyingTriggers.slice(0, 6).map((t: string) => `
            <span class="sr-trigger-badge">${String(t)}</span>
          `).join('')}
        </div>
        ` : ''}
      </div>

      <!-- ========== CARD 6: BUSINESS MODEL ========== -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="sr-card-title">Business Model</h2>
        </div>
        
        <!-- Model Overview -->
        <div class="sr-grid sr-grid-3">
          <div class="sr-metric">
            <div class="sr-metric-value">${recommendedArpu}</div>
            <div class="sr-metric-label">Recommended ARPU</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value" style="font-size: 18px;">${pricingModel || 'Subscription'}</div>
            <div class="sr-metric-label">Pricing Model</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value" style="font-size: 18px;">${pricePositioning || 'Mid-market'}</div>
            <div class="sr-metric-label">Market Position</div>
          </div>
        </div>
        
        <!-- Pricing Tiers -->
        ${pricingTiers.length > 0 ? `
        <div class="sr-section-subtitle">Recommended Pricing Tiers</div>
        <div class="sr-grid sr-grid-3">
          ${pricingTiers.slice(0, 3).map((t: { name?: string; price_monthly?: number; monthly_price?: number; price?: number; features?: string[] }) => {
            const tierPrice = t.price_monthly || t.monthly_price || t.price || 0;
            const features = Array.isArray(t.features) ? t.features : [];
            return `
              <div class="sr-tier-card">
                <div class="sr-tier-name">${String(t.name || 'Tier')}</div>
                <div class="sr-tier-price">${formatCurrency(tierPrice)}<span style="font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.6);">/mo</span></div>
                ${features.length > 0 ? `
                <div class="sr-tier-features">
                  ${features.slice(0, 4).map((f: string) => `<div class="sr-tier-feature">• ${String(f)}</div>`).join('')}
                </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
        ` : ''}
      </div>

      <!-- ========== CARD 7: FINANCIAL PROJECTIONS ========== -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          <h2 class="sr-card-title">Financial Projections</h2>
        </div>
        
        <div class="sr-grid sr-grid-4">
          <div class="sr-metric">
            <div class="sr-metric-value">${arrY1}</div>
            <div class="sr-metric-label">Year 1 ARR</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${arrY2}</div>
            <div class="sr-metric-label">Year 2 ARR</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${breakEvenMonths}</div>
            <div class="sr-metric-label">Break-even</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${customersY1}</div>
            <div class="sr-metric-label">Y1 Customers</div>
          </div>
        </div>
        
        <!-- J-Curve Chart -->
        <div class="sr-section-subtitle" style="margin-top: 24px;">J-Curve Projection</div>
        ${generateJCurveSvg(scenarios as FinancialScenario[])}
        
        <!-- ROI Cards -->
        <div class="sr-grid sr-grid-2" style="margin-top: 24px;">
          <div class="sr-metric">
            <div class="sr-metric-value">${roiY1}</div>
            <div class="sr-metric-label">Return on Investment (Year 1)</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${roiY2}</div>
            <div class="sr-metric-label">Return on Investment (Year 2)</div>
          </div>
        </div>
      </div>

      <!-- ========== CARD 8: INVESTMENT ASK ========== -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h2 class="sr-card-title">Investment Summary</h2>
        </div>
        
        <div class="sr-grid sr-grid-2">
          <!-- MVP Only Card -->
          <div class="sr-investment-card">
            <div class="sr-investment-header">MVP Development Only</div>
            <div class="sr-investment-row">
              <span class="sr-investment-label">UaiCode Investment</span>
              <span class="sr-investment-value">${formatCurrency(mvpInvestment)}</span>
            </div>
            <div class="sr-investment-row">
              <span class="sr-investment-label">Traditional Agency</span>
              <span style="color: rgba(255,255,255,0.5); text-decoration: line-through;">${formatCurrency(traditionalMinCents / 100)} - ${formatCurrency(traditionalMaxCents / 100)}</span>
            </div>
            <div class="sr-investment-row" style="margin-top: 12px;">
              <span class="sr-investment-label">You Save</span>
              <span class="sr-savings">${savingsPercent}% savings</span>
            </div>
          </div>
          
          <!-- MVP + Marketing Bundle -->
          <div class="sr-investment-card" style="border-color: rgba(255, 189, 23, 0.4);">
            <div class="sr-investment-header">MVP + Marketing Bundle (Annual)</div>
            <div class="sr-investment-row">
              <span class="sr-investment-label">MVP Development</span>
              <span class="sr-investment-value">${formatCurrency(mvpInvestment)}</span>
            </div>
            <div class="sr-investment-row">
              <span class="sr-investment-label">Marketing (12 months)</span>
              <span class="sr-investment-value">${formatCurrency(marketingUaicodeTotal * 12)}</span>
            </div>
            <div class="sr-investment-row">
              <span class="sr-investment-label">Traditional Marketing</span>
              <span style="color: rgba(255,255,255,0.5); text-decoration: line-through;">${formatCurrency(marketingTraditionalMax * 12)}</span>
            </div>
            <div class="sr-investment-row" style="margin-top: 16px; padding-top: 16px; border-top: 2px solid rgba(255, 189, 23, 0.3);">
              <span class="sr-investment-label" style="font-weight: 600; font-size: 16px;">Total Bundle</span>
              <span class="sr-investment-total">${formatCurrency(bundleTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== CARD 9: STRATEGIC VERDICT ========== -->
      ${strategicVerdict || recommendations.length > 0 ? `
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="sr-card-title">Strategic Verdict</h2>
        </div>
        
        <!-- Score Circle -->
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="sr-score-circle ${scoreClass}" style="width: 110px; height: 110px; font-size: 40px;">${viabilityScore}</div>
          <div style="margin-top: 12px; font-size: 20px; font-weight: 600; color: #fff;">${viabilityLabel}</div>
        </div>
        
        <!-- Verdict Text -->
        ${strategicVerdict ? `
        <p class="sr-text" style="text-align: center; margin-bottom: 28px; font-size: 16px;">${strategicVerdict}</p>
        ` : ''}
        
        <!-- Key Recommendations -->
        ${recommendations.length > 0 ? `
        <div class="sr-section-subtitle">Key Recommendations</div>
        <ul class="sr-list">
          ${recommendations.map((r: string) => `
            <li class="sr-list-item">
              <span class="sr-list-bullet"></span>
              <span class="sr-text">${String(r)}</span>
            </li>
          `).join('')}
        </ul>
        ` : ''}
      </div>
      ` : ''}

    </div>
  `;

  return html;
}

// Background task: Process all report steps sequentially
async function processReportSteps(
  wizard_id: string, 
  resume_from_step?: number
): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const webhookUrl = getWebhookUrl();
  const startIndex = resume_from_step ? resume_from_step - 1 : 0;

  console.log(`🚀 Background task started for wizard: ${wizard_id}, from step: ${startIndex + 1}`);

  try {
    for (let i = startIndex; i < TOOLS_SEQUENCE.length; i++) {
      // Check for graceful shutdown before each step
      if (shutdownRequested) {
        console.error('❌ Worker shutting down, marking as interrupted');
        await supabase
          .from("tb_pms_reports")
          .update({ status: "Generation interrupted - Please retry" })
          .eq("wizard_id", wizard_id);
        return;
      }

      const tool = TOOLS_SEQUENCE[i];
      const statusInProgress = `Step ${tool.step} ${tool.label} - In Progress`;
      const statusCompleted = `Step ${tool.step} ${tool.label} - Completed`;
      const statusFailed = `Step ${tool.step} ${tool.label} - Fail`;

      // Update to In Progress
      await supabase
        .from("tb_pms_reports")
        .update({ status: statusInProgress.trim() })
        .eq("wizard_id", wizard_id);

      console.log(`📍 ${statusInProgress}`);

      try {
        // AbortController with 150s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 150000);

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool_name: tool.tool_name,
            wizard_id: wizard_id
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Consume response body
        await response.text();

        // Update to Completed
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusCompleted.trim() })
          .eq("wizard_id", wizard_id);

        console.log(`✅ ${statusCompleted}`);

      } catch (error: unknown) {
        const isTimeout = error instanceof Error && error.name === 'AbortError';
        const errorMessage = isTimeout 
          ? 'Request timeout (150s exceeded)' 
          : String(error);
        
        console.error(`❌ ${statusFailed}:`, errorMessage);
        
        // Update to Fail
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusFailed.trim() })
          .eq("wizard_id", wizard_id);

        // Stop processing on failure
        return;
      }
    }

    // =============================================
    // ALL STEPS COMPLETED - Generate Share HTML
    // =============================================
    console.log(`📝 Generating share_html for wizard: ${wizard_id}`);

    // 1. Fetch all report data
    const { data: reportData, error: reportError } = await supabase
      .from("tb_pms_reports")
      .select(`
        business_plan_section,
        opportunity_section,
        competitive_analysis_section,
        icp_intelligence_section,
        price_intelligence_section,
        growth_intelligence_section,
        section_investment
      `)
      .eq("wizard_id", wizard_id)
      .single();

    if (reportError) {
      console.error("❌ Failed to fetch report data:", reportError);
    }

    // 2. Fetch marketing tier data for bundle calculation
    const { data: marketingData, error: mktError } = await supabase
      .from("tb_pms_mkt_tier")
      .select("service_name, uaicode_price_cents, traditional_max_cents")
      .eq("is_active", true);

    if (mktError) {
      console.error("❌ Failed to fetch marketing data:", mktError);
    }

    // 3. Generate static HTML
    let shareHtml: string | null = null;
    if (reportData) {
      try {
        shareHtml = generateBusinessPlanHtml(
          reportData as ReportData,
          (marketingData || []) as MarketingTier[]
        );
        console.log(`✅ Generated share_html (${shareHtml.length} chars)`);
      } catch (htmlError) {
        console.error("❌ Failed to generate HTML:", htmlError);
      }
    }

    // 4. Generate share token and save everything
    const shareToken = generateShareToken();
    const shareUrl = `${PRODUCTION_URL}/planningmysaas/shared/${shareToken}`;

    await supabase
      .from("tb_pms_reports")
      .update({ 
        status: "completed",
        share_token: shareToken,
        share_url: shareUrl,
        share_html: shareHtml,
        share_enabled: true,
        share_created_at: new Date().toISOString()
      })
      .eq("wizard_id", wizard_id);

    console.log(`🔗 Share URL generated: ${shareUrl}`);
    console.log(`🎉 Report completed for wizard: ${wizard_id}`);

  } catch (error) {
    console.error("❌ Background task error:", error);
    // Update to generic fail status
    await supabase
      .from("tb_pms_reports")
      .update({ status: "Generation Failed" })
      .eq("wizard_id", wizard_id);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wizard_id, resume_from_step } = await req.json();
    
    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🚀 Starting orchestration for wizard: ${wizard_id}, resume_from: ${resume_from_step || 'start'}`);

    // Use EdgeRuntime.waitUntil to process steps in background
    // This allows the HTTP response to return immediately while processing continues
    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    EdgeRuntime.waitUntil(
      processReportSteps(wizard_id, resume_from_step)
    );

    // Return immediately with 202 Accepted
    return new Response(
      JSON.stringify({ 
        success: true, 
        wizard_id,
        message: "Processing started in background" 
      }),
      { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Orchestration error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
