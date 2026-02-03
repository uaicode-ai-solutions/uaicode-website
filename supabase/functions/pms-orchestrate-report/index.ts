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

// Format currency with thousands separator
function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "...";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "...";
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Format percentage
function formatPercent(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "...";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "...";
  return `${num.toFixed(0)}%`;
}

// Generate the complete static HTML for the shared report
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

  // Calculate marketing totals
  const marketingUaicodeTotal = marketingData.reduce((sum, s) => sum + (s.uaicode_price_cents || 0), 0) / 100;
  const marketingTraditionalMax = marketingData.reduce((sum, s) => sum + (s.traditional_max_cents || 0), 0) / 100;

  // Extract values with safe defaults
  const saasName = String(bp.title || "SaaS Project");
  const viabilityScore = Number(bp.viability_score || 0);
  const viabilityLabel = String(bp.viability_label || "Pending");
  const executiveNarrative = String(bp.ai_executive_narrative || "");
  const strategicVerdict = String(bp.ai_strategic_verdict || "");
  const recommendations = Array.isArray(bp.ai_key_recommendations) ? bp.ai_key_recommendations : [];

  // Opportunity data - extract as number or null
  const tam = (opp.tam_value || opp.tam) as number | string | null;
  const sam = (opp.sam_value || opp.sam) as number | string | null;
  const som = (opp.som_value || opp.som) as number | string | null;

  // Growth data - extract as number or null
  const projectedRevenue = (growth.projected_revenue_year1 || growth.year1_revenue) as number | string | null;
  const projectedUsers = (growth.projected_users_year1 || growth.year1_users) as number | string | null;

  // Investment data
  const mvpInvestment = Number(investment.investment_one_payment_cents || 0) / 100;
  const bundleTotal = mvpInvestment + (marketingUaicodeTotal * 12);

  // Competitors
  const competitors = Array.isArray(comp.competitors) ? comp.competitors : [];

  // ICP data
  const icpTitle = String(icp.title || icp.persona_title || "Target Customer");
  const icpDescription = String(icp.description || icp.persona_description || "");
  const painPoints = Array.isArray(icp.pain_points) ? icp.pain_points : [];

  // Pricing tiers
  const pricingTiers = Array.isArray(pricing.tiers) ? pricing.tiers : [];

  // CSS inline styles
  const styles = `
    <style>
      .sr-container { font-family: 'Inter', -apple-system, sans-serif; color: #fff; line-height: 1.7; }
      .sr-card { background: rgba(34, 39, 42, 0.8); border: 1px solid rgba(255, 189, 23, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
      .sr-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .sr-card-title { font-size: 18px; font-weight: 600; color: #fff; margin: 0; }
      .sr-icon { width: 20px; height: 20px; color: #FFBD17; }
      .sr-grid { display: grid; gap: 16px; }
      .sr-grid-2 { grid-template-columns: repeat(2, 1fr); }
      .sr-grid-3 { grid-template-columns: repeat(3, 1fr); }
      .sr-grid-4 { grid-template-columns: repeat(4, 1fr); }
      @media (max-width: 768px) { .sr-grid-2, .sr-grid-3, .sr-grid-4 { grid-template-columns: 1fr; } }
      .sr-metric { background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 16px; text-align: center; }
      .sr-metric-value { font-size: 24px; font-weight: 700; color: #FFBD17; margin-bottom: 4px; }
      .sr-metric-label { font-size: 12px; color: rgba(255, 255, 255, 0.7); text-transform: uppercase; letter-spacing: 0.5px; }
      .sr-text { color: rgba(255, 255, 255, 0.8); }
      .sr-insight { background: rgba(255, 189, 23, 0.1); border-left: 4px solid #FFBD17; padding: 16px; border-radius: 0 8px 8px 0; margin-top: 16px; }
      .sr-insight-text { font-style: italic; color: #fff; }
      .sr-badge { display: inline-block; background: rgba(255, 189, 23, 0.2); color: #FFBD17; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
      .sr-score-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; margin: 0 auto; }
      .sr-score-high { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 3px solid #22c55e; }
      .sr-score-medium { background: rgba(234, 179, 8, 0.2); color: #eab308; border: 3px solid #eab308; }
      .sr-score-low { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 3px solid #ef4444; }
      .sr-competitor { background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 16px; }
      .sr-competitor-name { font-weight: 600; color: #fff; margin-bottom: 8px; }
      .sr-competitor-desc { font-size: 14px; color: rgba(255, 255, 255, 0.7); }
      .sr-list { list-style: none; padding: 0; margin: 0; }
      .sr-list-item { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sr-list-item:last-child { border-bottom: none; }
      .sr-list-bullet { width: 6px; height: 6px; background: #FFBD17; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
      .sr-tier-card { background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 16px; text-align: center; }
      .sr-tier-name { font-weight: 600; color: #FFBD17; margin-bottom: 8px; }
      .sr-tier-price { font-size: 20px; font-weight: 700; color: #fff; }
      .sr-investment-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .sr-investment-row:last-child { border-bottom: none; }
      .sr-investment-label { color: rgba(255, 255, 255, 0.8); }
      .sr-investment-value { font-weight: 600; color: #FFBD17; }
      .sr-investment-total { font-size: 24px; color: #22c55e; }
    </style>
  `;

  // Score class based on value
  const scoreClass = viabilityScore >= 70 ? 'sr-score-high' : viabilityScore >= 40 ? 'sr-score-medium' : 'sr-score-low';

  // Build HTML sections
  const html = `
    ${styles}
    <div class="sr-container">
      
      <!-- 1. Executive Snapshot -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <h2 class="sr-card-title">Executive Snapshot</h2>
        </div>
        <div class="sr-grid sr-grid-4">
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(tam)}</div>
            <div class="sr-metric-label">Total Market (TAM)</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(sam)}</div>
            <div class="sr-metric-label">Serviceable Market (SAM)</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(som)}</div>
            <div class="sr-metric-label">Target Market (SOM)</div>
          </div>
          <div class="sr-metric">
            <div class="sr-score-circle ${scoreClass}">${viabilityScore}</div>
            <div class="sr-metric-label" style="margin-top: 8px;">${viabilityLabel}</div>
          </div>
        </div>
      </div>

      <!-- 2. Executive Narrative -->
      ${executiveNarrative ? `
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h2 class="sr-card-title">Executive Summary</h2>
        </div>
        <p class="sr-text">${executiveNarrative}</p>
      </div>
      ` : ''}

      <!-- 3. Market Analysis -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="sr-card-title">Market Analysis</h2>
        </div>
        <div class="sr-grid sr-grid-3">
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(tam)}</div>
            <div class="sr-metric-label">TAM - Total Addressable Market</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(sam)}</div>
            <div class="sr-metric-label">SAM - Serviceable Market</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(som)}</div>
            <div class="sr-metric-label">SOM - Target Obtainable</div>
          </div>
        </div>
      </div>

      <!-- 4. Competitive Landscape -->
      ${competitors.length > 0 ? `
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h2 class="sr-card-title">Competitive Landscape</h2>
        </div>
        <div class="sr-grid sr-grid-2">
          ${competitors.slice(0, 4).map((c: { name?: string; description?: string; differentiator?: string }) => `
            <div class="sr-competitor">
              <div class="sr-competitor-name">${String(c.name || 'Competitor')}</div>
              <div class="sr-competitor-desc">${String(c.description || c.differentiator || '')}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- 5. Target Customer -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <h2 class="sr-card-title">Target Customer</h2>
        </div>
        <div style="margin-bottom: 16px;">
          <span class="sr-badge">${icpTitle}</span>
        </div>
        ${icpDescription ? `<p class="sr-text">${icpDescription}</p>` : ''}
        ${painPoints.length > 0 ? `
        <div style="margin-top: 16px;">
          <h4 style="color: #FFBD17; font-size: 14px; margin-bottom: 12px;">Key Pain Points</h4>
          <ul class="sr-list">
            ${painPoints.slice(0, 5).map((p: string) => `
              <li class="sr-list-item">
                <span class="sr-list-bullet"></span>
                <span class="sr-text">${String(p)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
      </div>

      <!-- 6. Business Model -->
      ${pricingTiers.length > 0 ? `
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="sr-card-title">Business Model</h2>
        </div>
        <div class="sr-grid sr-grid-3">
          ${pricingTiers.slice(0, 3).map((t: { name?: string; price?: number; monthly_price?: number }) => `
            <div class="sr-tier-card">
              <div class="sr-tier-name">${String(t.name || 'Tier')}</div>
              <div class="sr-tier-price">${formatCurrency(t.price || t.monthly_price)}/mo</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- 7. Financial Projections -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          <h2 class="sr-card-title">Financial Projections</h2>
        </div>
        <div class="sr-grid sr-grid-2">
          <div class="sr-metric">
            <div class="sr-metric-value">${formatCurrency(projectedRevenue)}</div>
            <div class="sr-metric-label">Year 1 Revenue</div>
          </div>
          <div class="sr-metric">
            <div class="sr-metric-value">${projectedUsers ? Number(projectedUsers).toLocaleString() : '...'}</div>
            <div class="sr-metric-label">Year 1 Users</div>
          </div>
        </div>
      </div>

      <!-- 8. Investment Ask -->
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h2 class="sr-card-title">Investment Summary</h2>
        </div>
        <div class="sr-investment-row">
          <span class="sr-investment-label">MVP Development (with UaiCode)</span>
          <span class="sr-investment-value">${formatCurrency(mvpInvestment)}</span>
        </div>
        <div class="sr-investment-row">
          <span class="sr-investment-label">Marketing (Annual with UaiCode)</span>
          <span class="sr-investment-value">${formatCurrency(marketingUaicodeTotal * 12)}</span>
        </div>
        <div class="sr-investment-row">
          <span class="sr-investment-label">Traditional Marketing (Annual)</span>
          <span class="sr-investment-value" style="color: rgba(255,255,255,0.5); text-decoration: line-through;">${formatCurrency(marketingTraditionalMax * 12)}</span>
        </div>
        <div class="sr-investment-row" style="margin-top: 16px; padding-top: 16px; border-top: 2px solid rgba(255, 189, 23, 0.3);">
          <span class="sr-investment-label" style="font-weight: 600; font-size: 18px;">Total Bundle (MVP + Marketing)</span>
          <span class="sr-investment-total">${formatCurrency(bundleTotal)}</span>
        </div>
      </div>

      <!-- 9. Strategic Verdict -->
      ${strategicVerdict || recommendations.length > 0 ? `
      <div class="sr-card">
        <div class="sr-card-header">
          <svg class="sr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="sr-card-title">Strategic Verdict</h2>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="sr-score-circle ${scoreClass}" style="width: 100px; height: 100px; font-size: 36px;">${viabilityScore}</div>
          <div style="margin-top: 12px; font-size: 18px; font-weight: 600; color: #fff;">${viabilityLabel}</div>
        </div>
        ${strategicVerdict ? `<p class="sr-text" style="text-align: center; margin-bottom: 24px;">${strategicVerdict}</p>` : ''}
        ${recommendations.length > 0 ? `
        <div>
          <h4 style="color: #FFBD17; font-size: 14px; margin-bottom: 12px;">Key Recommendations</h4>
          <ul class="sr-list">
            ${recommendations.map((r: string) => `
              <li class="sr-list-item">
                <span class="sr-list-bullet"></span>
                <span class="sr-text">${String(r)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
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
