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
7. Output ONLY valid JSON matching the exact schema provided. No markdown, no explanations.`;

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

    // Build section-specific prompt
    const sectionPrompts: Record<string, string> = {
      executive_verdict: `Generate an executive verdict for this SaaS idea. Include:
- Overall viability verdict (proceed/caution/reconsider)
- Headline (impactful one-liner)
- Summary (2-3 sentences)
- Key metrics (market size, expected ROI, payback months)
- Top 3 highlights (strengths)
- Top 3 risks with mitigations`,

      market_opportunity: `Analyze the market opportunity. Include:
- TAM (Total Addressable Market) with value and description
- SAM (Serviceable Addressable Market) with value and description  
- SOM (Serviceable Obtainable Market) with value and description
- Growth rate and market conclusion`,

      competitors: `Analyze the competitive landscape. Include:
- 3-5 relevant competitors with name, description, pricing, target market, weakness, and your advantage
- 3-5 competitive advantages with descriptions and competitor gaps`,

      business_model: `Recommend a business model. Include:
- Primary model type (SaaS, marketplace, etc.)
- 3-4 revenue streams with percentages and MRR projections
- 3 pricing tiers with features and target customers
- Monetization timeline for first 6 months`,

      investment: `Calculate investment requirements. Include:
- Total investment in cents
- Breakdown by category (development, marketing, operations, etc.)
- What's included and not included
- Comparison to traditional development approach`,

      unit_economics: `Calculate unit economics. Include:
- Ideal ticket price
- Payback period in months
- LTV and CAC
- LTV/CAC ratio
- Monthly churn rate
- Gross margin percentage`,

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
- Verdict on timing
- 3-4 macro trends affecting the market
- Window of opportunity (opens, closes, reasoning)
- First mover advantages`,

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

      marketing_four_ps: `Analyze competitors using 4Ps framework. Include:
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

      marketing_pricing_diagnosis: `Diagnose pricing landscape. Include:
- Price map of competitors
- Pricing models used in market
- Pricing gaps and opportunities
- Price elasticity assessment`,

      marketing_pricing_action: `Create pricing action plan. Include:
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
- Email subject line examples`,

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
