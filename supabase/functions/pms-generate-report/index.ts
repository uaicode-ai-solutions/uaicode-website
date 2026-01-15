/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Declare EdgeRuntime for background processing
declare const EdgeRuntime: {
  waitUntil(promise: Promise<unknown>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Helper to safely convert values to string
function toStringValue(value: unknown, defaultValue: string): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

interface ReportRequest {
  reportId: string;
}

// Interface for scraped competitor data
interface ScrapedCompetitor {
  url: string;
  domain: string;
  branding: {
    companyName: string;
    tagline: string;
    valueProposition: string;
    brandTone: string;
    ctaTexts: string[];
  } | null;
  pricing: {
    plans: Array<{
      name: string;
      price: string;
      period: string;
      features: string[];
      recommended: boolean;
    }>;
    hasFreeTier: boolean;
    hasTrial: boolean;
    trialDays: number;
    currency: string;
  } | null;
  features: {
    mainFeatures: string[];
    integrations: string[];
    useCases: string[];
    targetAudience: string;
    uniqueSellingPoints: string[];
  } | null;
}

// Helper to call internal edge functions
async function callFunction(functionName: string, body: Record<string, unknown>): Promise<unknown> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  return response.json();
}

// Helper to safely call AI analysis with retry
async function analyzeSection(
  section: string, 
  wizardData: Record<string, unknown>, 
  researchData: Record<string, unknown>,
  schema: object
): Promise<unknown> {
  try {
    const result = await callFunction("pms-ai-analyze", {
      section,
      wizardData,
      researchData,
      schema,
    });
    return result;
  } catch (error) {
    console.error(`[pms-generate-report] Failed to analyze ${section}:`, error);
    return null;
  }
}

// Extract valid competitor URLs from Perplexity citations
function extractCompetitorUrls(citations: unknown): string[] {
  if (!Array.isArray(citations)) return [];
  
  const excludedDomains = [
    'wikipedia.org', 'reddit.com', 'twitter.com', 'x.com',
    'linkedin.com', 'youtube.com', 'medium.com', 'forbes.com',
    'techcrunch.com', 'bloomberg.com', 'crunchbase.com',
    'g2.com', 'capterra.com', 'trustpilot.com', 'google.com',
    'facebook.com', 'instagram.com', 'tiktok.com', 'quora.com',
    'stackoverflow.com', 'github.com', 'news.ycombinator.com',
    'producthunt.com', 'bing.com', 'yahoo.com', 'amazon.com',
    'apple.com', 'microsoft.com', 'oracle.com', 'ibm.com',
    'bbc.com', 'cnn.com', 'nytimes.com', 'wsj.com'
  ];
  
  return citations
    .filter((url: unknown) => {
      if (typeof url !== 'string') return false;
      try {
        const domain = new URL(url).hostname.toLowerCase();
        return !excludedDomains.some(d => domain.includes(d));
      } catch {
        return false;
      }
    })
    .map((url: string) => {
      // Normalize URLs to base domain
      try {
        const parsed = new URL(url);
        return `${parsed.protocol}//${parsed.hostname}`;
      } catch {
        return url;
      }
    })
    .filter((url: string, index: number, self: string[]) => self.indexOf(url) === index) // unique
    .slice(0, 5); // Limit to 5 competitors
}

// Scrape a specific competitor's pages
async function scrapeCompetitor(baseUrl: string): Promise<ScrapedCompetitor> {
  const domain = new URL(baseUrl).hostname;
  
  console.log(`[pms-generate-report] Scraping competitor: ${domain}`);
  
  // Scrape homepage for branding, pricing page, and features page in parallel
  const [brandingResult, pricingResult, featuresResult] = await Promise.allSettled([
    callFunction("pms-firecrawl-scrape", { url: baseUrl, extractType: "branding" }),
    callFunction("pms-firecrawl-scrape", { url: `${baseUrl}/pricing`, extractType: "pricing" }),
    callFunction("pms-firecrawl-scrape", { url: `${baseUrl}/features`, extractType: "features" }),
  ]);
  
  return {
    url: baseUrl,
    domain,
    branding: brandingResult.status === 'fulfilled' && (brandingResult.value as Record<string, unknown>)?.success
      ? (brandingResult.value as Record<string, unknown>).extractedData as ScrapedCompetitor['branding']
      : null,
    pricing: pricingResult.status === 'fulfilled' && (pricingResult.value as Record<string, unknown>)?.success
      ? (pricingResult.value as Record<string, unknown>).extractedData as ScrapedCompetitor['pricing']
      : null,
    features: featuresResult.status === 'fulfilled' && (featuresResult.value as Record<string, unknown>)?.success
      ? (featuresResult.value as Record<string, unknown>).extractedData as ScrapedCompetitor['features']
      : null,
  };
}

// Scrape all competitors in parallel with timeout
async function scrapeAllCompetitors(urls: string[]): Promise<ScrapedCompetitor[]> {
  console.log(`[pms-generate-report] Starting scrape of ${urls.length} competitors...`);
  
  const results = await Promise.allSettled(
    urls.map(url => scrapeCompetitor(url))
  );
  
  const scraped = results
    .filter((r): r is PromiseFulfilledResult<ScrapedCompetitor> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(c => c.branding || c.pricing || c.features); // Keep only those with some data
  
  console.log(`[pms-generate-report] Successfully scraped ${scraped.length}/${urls.length} competitors`);
  
  return scraped;
}

// ============================================================
// MAIN BACKGROUND PROCESSING FUNCTION
// ============================================================
async function processReportGeneration(reportId: string): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`[pms-generate-report] 🚀 Starting background generation for: ${reportId}`);

  try {
    // ============================================================
    // PHASE 1: Fetch wizard data from database
    // ============================================================
    console.log(`[pms-generate-report] Phase 1: Collecting Wizard Data`);
    
    const { data: wizard, error: fetchError } = await supabase
      .from("tb_pms_wizard")
      .select("*")
      .eq("id", reportId)
      .single();

    if (fetchError || !wizard) {
      throw new Error(`Wizard not found: ${reportId}`);
    }

    console.log(`[pms-generate-report] Found wizard: ${wizard.saas_name}`);

    // Prepare wizard data for AI context
    const wizardData = {
      saasName: wizard.saas_name,
      description: wizard.description,
      industry: wizard.industry === "other" ? wizard.industry_other : wizard.industry,
      saasType: wizard.saas_type === "other" ? wizard.saas_type_other : wizard.saas_type,
      productStage: wizard.product_stage,
      customerTypes: wizard.customer_types,
      marketSize: wizard.market_size,
      targetAudience: wizard.target_audience,
      marketType: wizard.market_type,
      selectedFeatures: wizard.selected_features,
      selectedTier: wizard.selected_tier,
      goal: wizard.goal === "other" ? wizard.goal_other : wizard.goal,
      challenge: wizard.challenge,
      budget: wizard.budget,
      timeline: wizard.timeline,
    };

    // ============================================================
    // PHASE 2: Research with Perplexity
    // ============================================================
    console.log(`[pms-generate-report] Phase 2: Market Research with Perplexity`);
    
    const searchContext = `${wizardData.saasName} - ${wizardData.description}. Industry: ${wizardData.industry}. Target: ${wizardData.targetAudience}`;
    
    const [marketResearch, competitorResearch, demandResearch, trendsResearch] = await Promise.all([
      callFunction("pms-perplexity-search", {
        query: `What is the market size (TAM, SAM, SOM) for ${wizardData.industry} SaaS products targeting ${wizardData.targetAudience}? Include growth rates and market trends. Provide specific dollar amounts and percentages.`,
        searchType: "market",
        context: searchContext,
      }),
      callFunction("pms-perplexity-search", {
        // Enhanced query to get competitor URLs
        query: `List the top 5 direct competitors for a ${wizardData.saasType} SaaS in the ${wizardData.industry} industry targeting ${wizardData.targetAudience}. For each competitor, include their official website URL, company name, pricing model (freemium, subscription, etc.), starting price, and key differentiating features. Focus on established SaaS products with active websites.`,
        searchType: "competitors",
        context: searchContext,
      }),
      callFunction("pms-perplexity-search", {
        query: `What is the demand for ${wizardData.saasType} solutions in ${wizardData.industry}? Include search volumes, pain points, customer needs, and willingness to pay. Provide specific numbers and statistics.`,
        searchType: "demand",
        context: searchContext,
      }),
      callFunction("pms-perplexity-search", {
        query: `What are the current trends and future outlook for ${wizardData.industry} ${wizardData.saasType} market? Include regulatory changes, technology shifts, timing analysis, and market dynamics for the next 2-3 years.`,
        searchType: "trends",
        context: searchContext,
      }),
    ]);

    console.log(`[pms-generate-report] Perplexity research complete`);

    // ============================================================
    // PHASE 3: Scrape competitors with Firecrawl
    // ============================================================
    console.log(`[pms-generate-report] Phase 3: Competitor Scraping with Firecrawl`);
    
    // Extract competitor URLs from Perplexity citations
    const competitorCitations = (competitorResearch as Record<string, unknown>)?.citations || [];
    const competitorUrls = extractCompetitorUrls(competitorCitations);
    
    console.log(`[pms-generate-report] Found ${competitorUrls.length} competitor URLs to scrape:`, competitorUrls);

    let scrapedCompetitors: ScrapedCompetitor[] = [];
    
    if (competitorUrls.length > 0) {
      try {
        // Timeout of 60 seconds for scraping (won't block if it fails)
        const scrapePromise = scrapeAllCompetitors(competitorUrls);
        const timeoutPromise = new Promise<ScrapedCompetitor[]>((_, reject) => 
          setTimeout(() => reject(new Error('Scrape timeout after 60s')), 60000)
        );
        
        scrapedCompetitors = await Promise.race([scrapePromise, timeoutPromise]);
        console.log(`[pms-generate-report] Scraping complete: ${scrapedCompetitors.length} competitors with data`);
      } catch (error) {
        console.error(`[pms-generate-report] Scraping failed, continuing without scraped data:`, error);
        scrapedCompetitors = [];
      }
    } else {
      console.log(`[pms-generate-report] No competitor URLs found in citations, skipping scraping`);
    }

    // ============================================================
    // PHASE 4: AI Analysis with enriched data
    // ============================================================
    console.log(`[pms-generate-report] Phase 4: AI Analysis`);
    
    // Combine all research data including scraped competitors
    const researchData = {
      market: marketResearch,
      competitors: competitorResearch,
      demand: demandResearch,
      trends: trendsResearch,
      // NEW: Real scraped data from competitor websites
      scrapedCompetitors: scrapedCompetitors,
    };

    // Log scraped data summary for debugging
    if (scrapedCompetitors.length > 0) {
      console.log(`[pms-generate-report] Scraped data summary:`);
      scrapedCompetitors.forEach(c => {
        console.log(`  - ${c.domain}: branding=${!!c.branding}, pricing=${!!c.pricing}, features=${!!c.features}`);
      });
    }

    // Phase 4a: Core Analysis (parallel)
    console.log(`[pms-generate-report] Phase 4a: Core Analysis`);

    const [
      executiveVerdict,
      marketOpportunity,
      competitors,
      businessModel,
      investmentAnalysis,
      unitEconomics,
      demandValidation,
    ] = await Promise.all([
      analyzeSection("executive_verdict", wizardData, researchData, {
        verdict: "string", 
        verdict_headline: "string", 
        verdict_summary: "string",
        viability_score: "number", 
        complexity_score: "number",
        timing_score: "number", 
        risk_score: "number",
        differentiation_score: "number",
        opportunity_score: "number",
        key_metrics: {
          marketSize: "string",
          marketLabel: "string",
          expectedROI: "string",
          roiLabel: "string",
          paybackMonths: "number",
          paybackLabel: "string",
          mrrMonth12: "string",
          arrProjected: "string"
        }, 
        highlights: "array", 
        risks: "array"
      }),
      analyzeSection("market_opportunity", wizardData, researchData, {
        tam: "object", sam: "object", som: "object", 
        growthRate: "string", growthLabel: "string", conclusion: "string"
      }),
      analyzeSection("competitors", wizardData, researchData, {
        competitors: "array", competitive_advantages: "array"
      }),
      analyzeSection("business_model", wizardData, researchData, {
        primaryModel: "string", modelType: "string", revenueStreams: "array",
        pricingTiers: "array", monetizationTimeline: "array", conclusion: "string"
      }),
      analyzeSection("investment", wizardData, researchData, {
        total: "number", breakdown: "array", included: "array", notIncluded: "array",
        comparison: "object"
      }),
      analyzeSection("unit_economics", wizardData, researchData, {
        idealTicket: "number", paybackPeriod: "number", ltv: "number", ltvMonths: "number",
        cac: "number", ltvCacRatio: "number", monthlyChurn: "string", grossMargin: "string",
        howItWorks: "string"
      }),
      analyzeSection("demand_validation", wizardData, researchData, {
        searchVolume: "number", trendsScore: "number", growthRate: "string",
        painPoints: "array", evidences: "array", validationMethods: "array", conclusion: "string"
      }),
    ]);

    // Phase 4b: Additional Sections (parallel)
    console.log(`[pms-generate-report] Phase 4b: Additional Sections`);

    const [
      financialScenarios,
      executionTimeline,
      goToMarket,
      timingAnalysis,
      pivotScenarios,
      successMetrics,
      resourceRequirements,
      riskQuantification,
      marketBenchmarks,
      quantifiedDifferentiation,
    ] = await Promise.all([
      analyzeSection("financial_scenarios", wizardData, { ...researchData, unitEconomics }, {
        scenarios: "array", projectionData: "array"
      }),
      analyzeSection("execution_timeline", wizardData, researchData, {
        phases: "array", techStack: "array"
      }),
      analyzeSection("go_to_market", wizardData, researchData, {
        primaryChannel: "string", launchStrategy: "string", channels: "array",
        quickWins: "array", first90Days: "array"
      }),
      analyzeSection("timing_analysis", wizardData, researchData, {
        score: "number", first_mover_score: "number", verdict: "string", macroTrends: "array",
        windowOfOpportunity: "object", firstMoverAdvantage: "array"
      }),
      analyzeSection("pivot_scenarios", wizardData, researchData, {
        readinessScore: "number", scenarios: "array"
      }),
      analyzeSection("success_metrics", wizardData, researchData, {
        northStar: "string", metrics: "array"
      }),
      analyzeSection("resource_requirements", wizardData, researchData, {
        founderTimePhases: "array", teamTimeline: "array",
        criticalSkills: "array", externalSupport: "array", totalExternalCost: "string"
      }),
      analyzeSection("risk_quantification", wizardData, researchData, {
        overallRiskScore: "number", risks: "array"
      }),
      analyzeSection("market_benchmarks", wizardData, researchData, {
        benchmarks: "array", conclusion: "string"
      }),
      analyzeSection("quantified_differentiation", wizardData, researchData, {
        metrics: "array", overallAdvantage: "string"
      }),
    ]);

    // Phase 4c: Marketing Analysis (parallel)
    console.log(`[pms-generate-report] Phase 4c: Marketing Analysis`);

    const [
      marketingFourPs,
      marketingPaidMediaDiagnosis,
      marketingPaidMediaAction,
      marketingPricingDiagnosis,
      marketingPricingAction,
      marketingGrowthStrategy,
      marketingVerdict,
    ] = await Promise.all([
      analyzeSection("marketing_four_ps", wizardData, researchData, { competitors: "array" }),
      analyzeSection("marketing_paid_media_diagnosis", wizardData, researchData, {
        competitors: "array", marketGaps: "array", overallAssessment: "string"
      }),
      analyzeSection("marketing_paid_media_action", wizardData, researchData, {
        totalBudget: "string", channels: "array", campaigns: "array",
        creatives: "array", timeline: "array", expectedResults: "object"
      }),
      analyzeSection("marketing_pricing_diagnosis", wizardData, researchData, {
        priceMap: "array", models: "array", gaps: "array", elasticity: "object"
      }),
      analyzeSection("marketing_pricing_action", wizardData, researchData, {
        recommendedModel: "string", rationale: "string", tiers: "array",
        psychologicalPricing: "array", launchStrategy: "array"
      }),
      analyzeSection("marketing_growth_strategy", wizardData, researchData, {
        model: "string", phases: "array", channels: "array", kpis: "array"
      }),
      analyzeSection("marketing_verdict", wizardData, researchData, {
        recommendation: "string", score: "number", riskLevel: "string",
        keyFindings: "array", opportunities: "array", risks: "array"
      }),
    ]);

    // Phase 4d: Brand Assets (parallel)
    console.log(`[pms-generate-report] Phase 4d: Brand Assets`);

    const [
      brandCopy,
      brandIdentity,
      brandLogos,
      landingPage,
      screenMockups,
      nextSteps,
    ] = await Promise.all([
      analyzeSection("brand_copy", wizardData, researchData, {
        brandName: "string", valueProposition: "string", elevatorPitch: "string",
        voiceTone: "array", taglines: "array", keyMessages: "array",
        ctaExamples: "array", emailSubjectLines: "array"
      }),
      analyzeSection("brand_identity", wizardData, researchData, {
        primaryColors: "array", secondaryColors: "array", typography: "object",
        typographyScale: "array", logoUsage: "object", spacing: "object", borderRadius: "array"
      }),
      analyzeSection("brand_logos", wizardData, researchData, { suggestions: "array" }),
      analyzeSection("landing_page", wizardData, researchData, {
        sections: "array", conversionElements: "array", downloadNote: "string"
      }),
      analyzeSection("screen_mockups", wizardData, researchData, { mockups: "array" }),
      analyzeSection("next_steps", wizardData, researchData, {
        verdictSummary: "string", steps: "array", cta: "object", contact: "object"
      }),
    ]);

    // ============================================================
    // PHASE 5: Save to database
    // ============================================================
    console.log(`[pms-generate-report] Phase 5: Saving to Database`);
    
    // Extract scores and key metrics from analyzed data
    const execVerdict = executiveVerdict as Record<string, unknown> || {};
    const timing = timingAnalysis as Record<string, unknown> || {};
    const pivot = pivotScenarios as Record<string, unknown> || {};
    const risk = riskQuantification as Record<string, unknown> || {};
    const unit = unitEconomics as Record<string, unknown> || {};
    const invest = investmentAnalysis as Record<string, unknown> || {};
    const keyMetrics = execVerdict.key_metrics as Record<string, unknown> || {};
    const quantDiff = quantifiedDifferentiation as Record<string, unknown> || {};

    // Prepare update payload - ALL fields populated by AI
    const updatePayload = {
      // Status
      status: "completed",
      
      // Generated timestamp
      generated_at: new Date().toISOString(),
      
      // Scores - ALL extracted from AI responses
      viability_score: toStringValue(execVerdict.viability_score, ""),
      complexity_score: toStringValue(execVerdict.complexity_score, ""),
      timing_score: toStringValue(execVerdict.timing_score || timing.score, ""),
      risk_score: toStringValue(execVerdict.risk_score || risk.overallRiskScore, ""),
      differentiation_score: toStringValue(execVerdict.differentiation_score, ""),
      pivot_readiness_score: toStringValue(pivot.readinessScore, ""),
      opportunity_score: toStringValue(execVerdict.opportunity_score, ""),
      first_mover_score: toStringValue(timing.first_mover_score, ""),
      
      // Verdict
      verdict: toStringValue(execVerdict.verdict, ""),
      verdict_headline: toStringValue(execVerdict.verdict_headline, ""),
      verdict_summary: toStringValue(execVerdict.verdict_summary, ""),
      
      // Financial metrics from key_metrics and other sections
      investment_total_cents: toStringValue(invest.total, ""),
      break_even_months: toStringValue(keyMetrics.paybackMonths || unit.paybackPeriod, ""),
      expected_roi_year1: toStringValue(keyMetrics.expectedROI, ""),
      mrr_month12_cents: toStringValue(keyMetrics.mrrMonth12, ""),
      arr_projected_cents: toStringValue(keyMetrics.arrProjected, ""),
      ltv_cac_ratio: toStringValue(unit.ltvCacRatio, ""),
      
      // JSONB fields - Viability Report
      key_metrics: keyMetrics,
      highlights: execVerdict.highlights || [],
      risks: execVerdict.risks || [],
      market_opportunity: marketOpportunity,
      competitors: (competitors as Record<string, unknown>)?.competitors || [],
      competitive_advantages: (competitors as Record<string, unknown>)?.competitive_advantages || [],
      investment_breakdown: invest.breakdown || [],
      investment_included: invest.included || [],
      investment_not_included: invest.notIncluded || [],
      investment_comparison: invest.comparison || {},
      unit_economics: unitEconomics,
      financial_scenarios: (financialScenarios as Record<string, unknown>)?.scenarios || [],
      projection_data: (financialScenarios as Record<string, unknown>)?.projectionData || [],
      execution_timeline: (executionTimeline as Record<string, unknown>)?.phases || [],
      tech_stack: (executionTimeline as Record<string, unknown>)?.techStack || [],
      demand_validation: demandValidation,
      business_model: businessModel,
      go_to_market_preview: goToMarket,
      quantified_differentiation: {
        metrics: quantDiff.metrics || [],
        overallAdvantage: toStringValue(quantDiff.overallAdvantage, "")
      },
      timing_analysis: timingAnalysis,
      pivot_scenarios: pivotScenarios,
      success_metrics: successMetrics,
      resource_requirements: resourceRequirements,
      risk_quantification: riskQuantification,
      market_benchmarks: marketBenchmarks,
      next_steps: nextSteps,
      
      // Uaicode info (static - business info)
      uaicode_info: {
        successRate: 94,
        projectsDelivered: 150,
        avgDeliveryWeeks: 8,
        differentials: [
          { icon: "Zap", title: "AI-Powered Development", description: "Leverage cutting-edge AI to accelerate development" },
          { icon: "Shield", title: "Enterprise Security", description: "Bank-grade security from day one" },
          { icon: "Users", title: "Dedicated Team", description: "Your own team of senior developers" },
        ],
        testimonials: [],
        guarantees: ["30-day money-back guarantee", "Free post-launch support", "Source code ownership"],
      },
      
      // Marketing Analysis
      marketing_four_ps: marketingFourPs,
      marketing_paid_media_diagnosis: marketingPaidMediaDiagnosis,
      marketing_paid_media_action_plan: marketingPaidMediaAction,
      marketing_pricing_diagnosis: marketingPricingDiagnosis,
      marketing_pricing_action_plan: marketingPricingAction,
      marketing_growth_strategy: marketingGrowthStrategy,
      marketing_competitive_advantages: { advantages: (competitors as Record<string, unknown>)?.competitive_advantages || [] },
      marketing_verdict: marketingVerdict,
      
      // Brand Assets
      assets_brand_copy: brandCopy,
      assets_brand_identity: brandIdentity,
      assets_logos: brandLogos,
      assets_landing_page: landingPage,
      assets_screen_mockups: screenMockups,
      assets_mockup_previews: { previews: [] },
    };

    // TODO: Save to NEW tb_pms_reports table when created
    // For now, just update status on wizard table
    console.log(`[pms-generate-report] Updating wizard status to completed...`);

    const { error: updateError } = await supabase
      .from("tb_pms_wizard")
      .update({ status: "completed" })
      .eq("id", reportId);

    if (updateError) {
      console.error(`[pms-generate-report] Database update error:`, updateError);
      throw updateError;
    }

    console.log(`[pms-generate-report] ✅ Report generation complete for: ${reportId}`);
    console.log(`[pms-generate-report] Summary: scraped ${scrapedCompetitors.length} competitors, generated all sections`);
    console.log(`[pms-generate-report] NOTE: Report data NOT saved yet - waiting for new tb_pms_reports table`);

  } catch (error) {
    console.error(`[pms-generate-report] ❌ Background generation failed for ${reportId}:`, error);
    
    // Update status to failed
    try {
      await supabase
        .from("tb_pms_wizard")
        .update({ status: "failed" })
        .eq("id", reportId);
      console.log(`[pms-generate-report] Status updated to 'failed' for ${reportId}`);
    } catch (dbError) {
      console.error(`[pms-generate-report] Failed to update status:`, dbError);
    }
    
    throw error;
  }
}

// ============================================================
// MAIN HTTP HANDLER - Responds immediately, processes in background
// ============================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.json() as ReportRequest & { wizardId?: string };
    const reportId = body.reportId || body.wizardId; // Support both
    
    console.log(`[pms-generate-report] 📥 Request received for wizard: ${reportId}`);

    // Validate wizard exists
    const { data: wizard, error: fetchError } = await supabase
      .from("tb_pms_wizard")
      .select("id, status")
      .eq("id", reportId)
      .single();

    if (fetchError || !wizard) {
      console.error(`[pms-generate-report] Wizard not found: ${reportId}`);
      return new Response(
        JSON.stringify({ success: false, error: "Wizard not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update status to "processing" immediately
    await supabase
      .from("tb_pms_wizard")
      .update({ status: "processing" })
      .eq("id", reportId);

    console.log(`[pms-generate-report] ✅ Status updated to 'processing', returning immediate response`);

    // ✅ RETURN IMMEDIATELY to client (prevents timeout!)
    const immediateResponse = new Response(
      JSON.stringify({ 
        success: true, 
        status: "processing",
        message: "Report generation started. Check status via polling."
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

    // ✅ PROCESS IN BACKGROUND with EdgeRuntime.waitUntil
    EdgeRuntime.waitUntil(
      processReportGeneration(reportId!)
        .catch(error => {
          console.error(`[pms-generate-report] Background processing error for ${reportId}:`, error);
        })
    );

    return immediateResponse;

  } catch (error) {
    console.error("[pms-generate-report] Request error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
