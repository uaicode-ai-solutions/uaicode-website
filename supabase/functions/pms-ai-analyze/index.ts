import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  section: string;
  wizardData: Record<string, unknown>;
  researchData: Record<string, unknown>;
  schema: object;
}

const SYSTEM_PROMPT = `You are an elite SaaS market analyst and business strategist with expertise in:
- Market viability analysis for software products
- Competitive intelligence and positioning
- Financial modeling and unit economics
- Go-to-market strategy
- Brand development

CRITICAL RULES:
1. Be specific and data-driven. Use concrete numbers, percentages, and monetary values.
2. All monetary values should be in USD cents (integer). Example: $100 = 10000 cents.
3. All scores should be 0-100 (integer).
4. Provide actionable, realistic insights based on the provided research data.
5. Be creative but grounded in market realities.
6. Consider the target audience, industry, and budget constraints.
7. Output ONLY valid JSON matching the exact schema provided. No markdown, no explanations.

CRITICAL - SCRAPED COMPETITOR DATA:
8. When scrapedCompetitors data is available in researchData, PRIORITIZE using this REAL data over estimates.
9. For competitor pricing analysis: if scrapedCompetitors contains pricing data, use the EXACT prices from the scraped data.
10. For competitor features: if scrapedCompetitors contains features data, reference the ACTUAL features listed.
11. For branding analysis: use real taglines, value propositions, and CTAs from scraped data.
12. Always include competitor website URLs when available from scraped data.
13. If scraped data is incomplete or missing for a competitor, use Perplexity research data as fallback.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { section, wizardData, researchData, schema } = await req.json() as AnalyzeRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`[pms-ai-analyze] Analyzing section: ${section}`);

    // Check if we have scraped competitor data
    const hasScrapedData = Array.isArray(researchData.scrapedCompetitors) && researchData.scrapedCompetitors.length > 0;
    if (hasScrapedData) {
      console.log(`[pms-ai-analyze] Using ${(researchData.scrapedCompetitors as unknown[]).length} scraped competitors for enhanced analysis`);
    }

    // Build section-specific prompt
    const sectionPrompts: Record<string, string> = {
      executive_verdict: `Generate an executive verdict for this SaaS idea. Include:
- Overall viability verdict (proceed/caution/reconsider)
- Headline (impactful one-liner)
- Summary (2-3 sentences)
- Viability score (0-100) - overall viability assessment
- Complexity score (0-100) - technical and operational complexity to build
- Timing score (0-100) - how good is the market timing
- Risk score (0-100) - overall risk level (higher = riskier)
- Differentiation score (0-100) - how unique vs competitors
- Opportunity score (0-100) - overall market opportunity
- Key metrics object with: marketSize (string like "$50B"), marketLabel (string), expectedROI (string like "250%"), roiLabel (string), paybackMonths (number), paybackLabel (string), mrrMonth12 (string like "$15,000"), arrProjected (string like "$180,000")
- Top 3 highlights (strengths) with title and description
- Top 3 risks with title, description, priority (high/medium/low), and mitigation

${hasScrapedData ? 'IMPORTANT: Base differentiation score on REAL features and pricing from scrapedCompetitors data.' : ''}`,

      market_opportunity: `Analyze the market opportunity. Include:
- TAM (Total Addressable Market) with value (string like "$50B") and description
- SAM (Serviceable Addressable Market) with value and description  
- SOM (Serviceable Obtainable Market) with value and description
- Growth rate (string like "15%")
- Growth label (string describing the growth)
- Market conclusion`,

      competitors: `Analyze the competitive landscape.
${hasScrapedData ? `
CRITICAL: Use the REAL DATA from scrapedCompetitors for your analysis:
- Use actual website URLs from scraped data
- Use actual pricing from scrapedCompetitors.pricing.plans (exact prices, not estimates)
- Use actual features from scrapedCompetitors.features.mainFeatures
- Use actual taglines/value props from scrapedCompetitors.branding

For each competitor include:
- name: company name (from scraped branding.companyName if available)
- website: the actual URL from scraped data
- pricing: the REAL price from scrapedCompetitors.pricing (e.g., "$29/mo" from actual scraped plans)
- targetMarket: who they target
- features: list actual features from scraped data
- weakness: identify gaps based on their real features
- advantage: how the user's SaaS can compete
` : `Include:
- 3-5 relevant competitors with name, description, pricing, target market, weakness, and your advantage`}
- 3-5 competitive advantages with descriptions and competitor gaps`,

      business_model: `Recommend a business model. Include:
- Primary model type (SaaS, marketplace, etc.)
- 3-4 revenue streams with percentages and MRR projections
- 3 pricing tiers with features and target customers
- Monetization timeline for first 6 months

${hasScrapedData ? 'IMPORTANT: Base pricing recommendations on REAL competitor pricing from scrapedCompetitors data. Position strategically relative to actual market prices.' : ''}`,

      investment: `Calculate investment requirements. Include:
- Total investment in cents (integer number)
- Breakdown by category (development, marketing, operations, etc.)
- What's included and not included
- Comparison to traditional development approach`,

      unit_economics: `Calculate unit economics. Include:
- Ideal ticket price (number in cents)
- Payback period in months (number)
- LTV in cents (number)
- LTV in months (number) - how many months to reach LTV
- CAC in cents (number)
- LTV/CAC ratio (number like 3.5)
- Monthly churn rate (string like "5%")
- Gross margin percentage (string like "80%")
- How it works (brief explanation of the economics)

${hasScrapedData ? 'IMPORTANT: Base pricing on REAL competitor pricing from scrapedCompetitors. Consider their price points when recommending ideal ticket.' : ''}`,

      financial_scenarios: `Create financial projections. Include:
- 3 scenarios (pessimistic, realistic, optimistic)
- MRR at month 12 for each
- ARR year 1 for each
- Break-even month for each
- 12-month revenue projection data points`,

      execution_timeline: `Create execution timeline. Include:
- 4-6 phases with duration and deliverables
- Tech stack recommendations by category
- Key milestones for each phase`,

      demand_validation: `Analyze demand signals. Include:
- Estimated search volume
- Trends score (0-100)
- Growth rate
- 3-5 pain points with intensity scores
- 3-4 evidence types (reviews, forums, searches)
- Recommended validation methods`,

      go_to_market: `Create go-to-market preview. Include:
- Primary channel recommendation
- Launch strategy
- 4-5 channels with ROI estimates and priority
- 3-4 quick wins for first 90 days
- First 90 days milestone timeline`,

      timing_analysis: `Analyze market timing. Include:
- Timing score (0-100)
- First mover score (0-100) - advantage score for entering the market now
- Verdict on timing (string)
- 3-4 macro trends affecting the market
- Window of opportunity (opens date, closes date, reasoning)
- First mover advantages (array of strings)`,

      pivot_scenarios: `Create pivot scenarios. Include:
- Pivot readiness score (0-100)
- 2-3 pivot scenarios with triggers, new direction, timeline, and success probability`,

      success_metrics: `Define success metrics. Include:
- North star metric
- 6-8 metrics across categories (growth, engagement, revenue, retention)
- Targets and timeframes for each`,

      resource_requirements: `Analyze resource requirements. Include:
- Founder time phases (hours per week)
- Team hiring timeline
- Critical skills needed
- External support services`,

      risk_quantification: `Quantify risks. Include:
- Overall risk score (0-100)
- 4-5 risks with probability, impact, expected loss, mitigation, and mitigation cost`,

      market_benchmarks: `Provide market benchmarks. Include:
- 5-7 key metrics comparing industry average, top quartile, and your target
- Overall conclusion on positioning`,

      quantified_differentiation: `Quantify differentiation vs competitors.
${hasScrapedData ? `
CRITICAL: Use REAL scraped data for comparison:
- Compare against actual features from scrapedCompetitors.features
- Reference actual pricing from scrapedCompetitors.pricing
- Use real competitor names and websites
` : ''}
Include:
- 3-5 metrics comparing your solution vs competitors
- Each metric should have: metric (name), yourValue (string), competitorAvg (string), advantage (percentage string like "+25%"), source (where data comes from)
- Overall advantage summary (string)`,

      marketing_four_ps: `Analyze competitors using 4Ps framework.
${hasScrapedData ? `
CRITICAL: Use REAL scraped data:
- Product: reference actual features from scrapedCompetitors.features
- Price: use EXACT prices from scrapedCompetitors.pricing.plans
- Place: note their website, any integrations from scraped data
- Promotion: reference CTAs and messaging from scrapedCompetitors.branding
` : ''}
Include:
- 2-3 competitors with detailed Product, Price, Place, Promotion analysis
- Scores for each P (0-100)`,

      marketing_paid_media_diagnosis: `Diagnose paid media landscape. Include:
- 2-3 competitors with their platform presence, ad types, budget estimates
- Strengths, weaknesses, opportunities for each
- Market gaps and overall assessment`,

      marketing_paid_media_action: `Create paid media action plan. Include:
- Total budget recommendation
- Channel allocation with priorities and expected ROAS
- Campaign phases with objectives and KPIs
- Creative requirements
- Weekly timeline for first month`,

      marketing_pricing_diagnosis: `Diagnose pricing landscape.
${hasScrapedData ? `
CRITICAL: Build priceMap using REAL prices from scrapedCompetitors:
- Extract actual plan names and prices from scrapedCompetitors.pricing.plans
- Note which competitors have free tiers (hasFreeTier) and trials (hasTrial, trialDays)
- Use real currency from scraped data

Example: If scrapedCompetitors shows Competitor A has plans at $0, $29, $99/mo - use THESE EXACT values.
` : ''}
Include:
- Price map of competitors (use REAL scraped prices when available)
- Pricing models used in market
- Pricing gaps and opportunities
- Price elasticity assessment`,

      marketing_pricing_action: `Create pricing action plan.
${hasScrapedData ? 'IMPORTANT: Base recommended pricing on REAL competitor prices from scrapedCompetitors to ensure competitive positioning.' : ''}
Include:
- Recommended pricing model with rationale
- 3 pricing tiers with features and targets
- Psychological pricing tactics
- Launch pricing strategy phases`,

      marketing_growth_strategy: `Define growth strategy. Include:
- Growth model recommendation
- 3 phases with focus and goals
- Channel priorities with CAC/LTV estimates
- KPIs by month (3, 6, 12)`,

      marketing_verdict: `Create marketing verdict. Include:
- Overall recommendation
- Marketing score (0-100)
- Risk level
- Key findings with scores
- Top opportunities with scores
- Key risks with mitigation actions`,

      brand_copy: `Create brand copy. Include:
- Value proposition
- Elevator pitch (30 seconds)
- Voice and tone traits
- 5 tagline options
- Key messages
- CTA examples
- Email subject line examples

${hasScrapedData ? 'IMPORTANT: Differentiate from competitor messaging found in scrapedCompetitors.branding (taglines, value propositions, CTAs).' : ''}`,

      brand_identity: `Create brand identity. Include:
- Primary colors (3-4) with hex codes and usage
- Secondary colors (2-3)
- Typography (headings, body, mono)
- Typography scale
- Logo usage guidelines
- Spacing and border radius system`,

      brand_logos: `Create logo suggestions. Include:
- 3-4 logo variant suggestions with descriptions and color recommendations
- Usage guidelines for each variant`,

      landing_page: `Create landing page structure. Include:
- 6-8 sections with descriptions and key elements
- Conversion elements
- Note about customization`,

      screen_mockups: `Create screen mockup specifications. Include:
- 4-6 key screens with descriptions, features, and device type
- Categories (dashboard, onboarding, settings, etc.)`,

      next_steps: `Define next steps. Include:
- Verdict summary
- 4-5 concrete next steps with descriptions
- CTA texts
- Contact information placeholders`,
    };

    const userPrompt = `
WIZARD DATA (User's SaaS idea):
${JSON.stringify(wizardData, null, 2)}

RESEARCH DATA (Market intelligence gathered):
${JSON.stringify(researchData, null, 2)}

${hasScrapedData ? `
SCRAPED COMPETITOR DATA AVAILABLE:
The researchData.scrapedCompetitors array contains REAL data extracted directly from competitor websites.
Each competitor may have:
- branding: companyName, tagline, valueProposition, brandTone, ctaTexts
- pricing: plans (with name, price, period, features), hasFreeTier, hasTrial, trialDays, currency
- features: mainFeatures, integrations, useCases, targetAudience, uniqueSellingPoints

PRIORITIZE using this real scraped data over Perplexity research estimates!
` : ''}

TASK: ${sectionPrompts[section] || `Analyze the ${section} section.`}

OUTPUT SCHEMA (respond with valid JSON matching this exact structure):
${JSON.stringify(schema, null, 2)}

Respond with ONLY the JSON object, no markdown code blocks, no explanations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error(`[pms-ai-analyze] API Error: ${response.status} - ${errorText}`);
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    // Try to parse the JSON response
    let parsedContent;
    try {
      // Remove potential markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedContent = JSON.parse(cleanContent);
    } catch {
      console.error(`[pms-ai-analyze] Failed to parse JSON: ${content.substring(0, 200)}`);
      parsedContent = { error: "Failed to parse AI response", raw: content };
    }

    console.log(`[pms-ai-analyze] Success for section: ${section}`);

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[pms-ai-analyze] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
