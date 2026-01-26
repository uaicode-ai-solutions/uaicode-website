import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert SaaS naming consultant with deep knowledge in:
- Brand strategy and positioning
- Tech startup naming conventions
- Linguistic principles (phonetics, memorability)
- Marketing psychology

NAMING RULES (STRICT - FOLLOW EXACTLY):
1. IDEAL: 1 word (e.g., Slack, Zoom, Stripe, Notion, Asana, Figma)
2. ACCEPTABLE: 2 words (e.g., DropBox, HubSpot, MailChimp, BaseCamp)
3. MAXIMUM: 3 words ONLY if absolutely necessary
4. NEVER exceed 3 words under any circumstances

PRINCIPLES:
- Easy to spell and pronounce in English
- Memorable and distinctive
- Evokes the product's value or benefit subtly
- Modern and professional sound
- Avoid generic tech terms as standalone (Cloud, Hub, Pro, App, Tech)
- Consider .com/.io/.app domain availability patterns
- Create unique combinations or invented words when possible

AVOID:
- Names too similar to major existing products
- Hard to pronounce letter combinations
- Numbers or special characters
- Overused suffixes (ly, ify, io) unless truly fitting
- Generic descriptive names

RESPOND WITH ONLY THE SUGGESTED NAME - nothing else, no quotes, no explanation.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, saasType, industry } = await req.json();

    if (!description || description.length < 10) {
      return new Response(
        JSON.stringify({ error: "Description must be at least 10 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Create a short, memorable name for this SaaS product:

DESCRIPTION: ${description}
${saasType ? `TYPE: ${saasType}` : ""}
${industry ? `INDUSTRY: ${industry}` : ""}

Generate ONE perfect name following the naming rules. Prefer 1 word, maximum 3 words.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 50,
        temperature: 0.8,
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
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const suggestedName = result.choices?.[0]?.message?.content?.trim();

    if (!suggestedName) {
      throw new Error("No name generated");
    }

    // Clean up the name - remove quotes, extra spaces, etc.
    const cleanName = suggestedName
      .replace(/^["']|["']$/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50);

    return new Response(
      JSON.stringify({ suggestedName: cleanName }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in pms-suggest-name:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
