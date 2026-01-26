import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRAND_ANALYST_PROMPT = `You are an expert brand strategist and visual identity designer with 20+ years of experience in SaaS and tech startups. You have deep knowledge of market trends, color psychology, and visual communication.

Your task is to analyze a SaaS product and create a detailed image generation prompt for a 2D flat logo, along with comprehensive branding rationale.

ANALYSIS REQUIREMENTS:

1. BRAND ESSENCE: Identify the core value proposition and emotional appeal
   - What problem does this SaaS solve?
   - What feelings should the brand evoke?

2. COLOR PSYCHOLOGY & MARKET TRENDS: Research and recommend 2-3 colors based on:
   - Current industry standards and competitor analysis
   - Psychological impact on target audience
   - 2024-2025 design trends in the specific niche
   - Cultural associations and trust signals

3. SHAPE LANGUAGE & SYMBOLISM: Recommend geometric elements based on:
   - Brand personality (trustworthy, innovative, friendly, professional)
   - Industry visual conventions and expectations
   - Symbolic meaning (circles = unity/community, triangles = growth/innovation, squares = stability/trust, etc.)
   - Current design trends in logo iconography

4. STYLE DIRECTION: Define visual approach:
   - Minimalist vs detailed
   - Abstract vs literal representation
   - Geometric vs organic shapes

LOGO GENERATION RULES (CRITICAL - MUST FOLLOW):
- MUST be 2D flat design (absolutely NO gradients, NO 3D effects, NO shadows, NO lighting effects)
- NO text, letters, words, or typography - PURE ICONOGRAPHIC SYMBOL ONLY
- Clean vector-style appearance with solid colors
- Simple enough to work at small sizes (favicon)
- Modern and professional aesthetic
- Maximum 3 colors (including white if used)
- Suitable for both light and dark backgrounds
- Icon should be centered in a square composition
- Pure geometric or abstract icon only

RESPONSE REQUIREMENTS:
You must provide:
1. A detailed image generation prompt that strictly follows the rules above
2. A brief logo description (max 15 words stating what the icon represents)
3. A concise market justification (one sentence, max 20 words on trend alignment)`;

const IMPROVE_LOGO_ADDITION = `
EXISTING LOGO ANALYSIS:
I have uploaded the current logo. Please analyze it to identify:
- Current color palette being used
- Shape language and geometric elements
- Overall style and aesthetic
- Strengths to preserve
- Weaknesses to address

Then create an IMPROVED version that:
- Maintains brand recognition (evolves rather than revolutionizes)
- Addresses identified weaknesses
- Aligns better with current market trends
- Improves visual clarity and scalability
- STILL follows all the 2D flat, no-text rules strictly`;

const generateLogoDesignTool = {
  type: "function",
  function: {
    name: "generate_logo_design",
    description: "Generate a complete logo design specification with branding rationale",
    parameters: {
      type: "object",
      properties: {
        imagePrompt: {
          type: "string",
          description: "Detailed prompt for image generation. MUST specify: 2D flat design, no text/letters/typography, solid colors only, no gradients/shadows/3D, vector-style icon, centered in square composition, professional minimalist aesthetic."
        },
        primaryColor: {
          type: "string",
          description: "Primary brand color with hex code (e.g., 'Deep Blue #1E40AF')"
        },
        secondaryColor: {
          type: "string",
          description: "Secondary accent color with hex code (e.g., 'Vibrant Teal #14B8A6')"
        },
        logoDescription: {
          type: "string",
          description: "Brief description of the logo (max 15 words). State what the icon represents."
        },
        marketJustification: {
          type: "string",
          description: "One concise sentence (max 20 words) on why this design aligns with market trends."
        }
      },
      required: ["imagePrompt", "primaryColor", "secondaryColor", "logoDescription", "marketJustification"]
    }
  }
};

function buildAnalysisPrompt(description: string, saasType?: string, industry?: string, isImprove: boolean = false): string {
  const saasTypeDisplay = saasType === "other" ? "custom SaaS" : saasType || "SaaS product";
  const industryDisplay = industry === "other" ? "various industries" : industry || "technology";
  
  let prompt = `Analyze this SaaS product and create a logo design:

PRODUCT DESCRIPTION:
${description}

PRODUCT TYPE: ${saasTypeDisplay}
TARGET INDUSTRY: ${industryDisplay}

Based on this information, research the ideal colors, shapes, and visual elements for this type of product. Consider current market trends in the ${industryDisplay} industry and ${saasTypeDisplay} space.

Generate a detailed image prompt that will create a professional, memorable 2D flat logo icon.

CRITICAL REMINDERS:
- The image prompt MUST explicitly state: "NO text, NO letters, NO typography, NO words"
- The image prompt MUST explicitly state: "2D flat design, solid colors only, no gradients, no shadows, no 3D effects"
- The image prompt MUST describe a pure iconographic symbol only`;

  if (isImprove) {
    prompt += `\n\n${IMPROVE_LOGO_ADDITION}`;
  }

  return prompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, saasType, industry, existingLogo, mode } = await req.json();

    // Validation
    if (!description || description.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Description must be at least 20 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!mode || !["create", "improve"].includes(mode)) {
      return new Response(
        JSON.stringify({ error: "Invalid mode. Must be 'create' or 'improve'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mode === "improve" && !existingLogo) {
      return new Response(
        JSON.stringify({ error: "Existing logo is required for improve mode" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${mode} request for: ${description.substring(0, 50)}...`);

    // STEP 1: Brand Analysis with Gemini Flash
    const analysisPrompt = buildAnalysisPrompt(description, saasType, industry, mode === "improve");
    
    const userContent = mode === "improve" && existingLogo
      ? [
          { type: "text", text: analysisPrompt },
          { type: "image_url", image_url: { url: existingLogo } }
        ]
      : analysisPrompt;

    console.log("Step 1: Running brand analysis...");
    const analysisResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: BRAND_ANALYST_PROMPT },
          { role: "user", content: userContent }
        ],
        tools: [generateLogoDesignTool],
        tool_choice: { type: "function", function: { name: "generate_logo_design" } }
      })
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error("Analysis API error:", analysisResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Analysis failed: ${analysisResponse.status}` }),
        { status: analysisResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysisData = await analysisResponse.json();
    console.log("Analysis response received");

    // Extract tool call arguments
    const toolCall = analysisData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function?.name !== "generate_logo_design") {
      console.error("No valid tool call in response:", JSON.stringify(analysisData));
      return new Response(
        JSON.stringify({ error: "Failed to generate logo specification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let toolArgs;
    try {
      toolArgs = JSON.parse(toolCall.function.arguments);
    } catch (parseError) {
      console.error("Failed to parse tool arguments:", toolCall.function.arguments);
      return new Response(
        JSON.stringify({ error: "Failed to parse logo specification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imagePrompt, logoDescription, marketJustification } = toolArgs;
    console.log("Generated image prompt:", imagePrompt.substring(0, 100) + "...");

    // Enhance the prompt to ensure 2D flat and no text
    const enhancedPrompt = `${imagePrompt}

CRITICAL REQUIREMENTS (MUST FOLLOW):
- This is a LOGO ICON only - absolutely NO text, NO letters, NO words, NO typography
- 2D flat design with solid colors only
- NO gradients, NO shadows, NO 3D effects, NO lighting, NO depth
- Clean vector-style appearance
- Centered in a square composition with clean background
- Professional and modern minimalist aesthetic
- Simple iconic symbol only`;

    // STEP 2: Generate Image with Nano Banana
    console.log("Step 2: Generating image with Nano Banana...");
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: enhancedPrompt }],
        modalities: ["image", "text"]
      })
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Image generation API error:", imageResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Image generation failed: ${imageResponse.status}` }),
        { status: imageResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageData = await imageResponse.json();
    console.log("Image response received");

    const generatedImageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      console.error("No image in response:", JSON.stringify(imageData));
      return new Response(
        JSON.stringify({ error: "Failed to generate logo image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Logo generated successfully!");

    return new Response(
      JSON.stringify({
        logoUrl: generatedImageUrl,
        logoDescription: logoDescription || "A modern, professional logo icon designed for your SaaS product.",
        marketJustification: marketJustification || "This design follows current industry trends for clean, memorable branding."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
