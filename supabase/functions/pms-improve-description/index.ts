import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert in SaaS product definition and market analysis preparation.

Your task is to improve user-submitted SaaS idea descriptions to make them more suitable for comprehensive market analysis.

CRITICAL REQUIREMENTS:
- Keep the improved description under 400 characters (hard limit)
- Maintain the original idea's essence - DO NOT invent features not mentioned
- Be concise and objective
- Write in English

IDENTIFY AND ADD (if missing):
1. Core problem being solved
2. Specific target audience
3. Competitive advantage/differentiator
4. Clear value proposition

DO NOT include any text outside the JSON object.`;

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

    const userPrompt = `Improve this SaaS idea description for market analysis:

ORIGINAL DESCRIPTION: "${description}"
SAAS TYPE: ${saasType || "Not specified"}
TARGET INDUSTRY: ${industry || "Not specified"}

Analyze the description and return an improved version that is clearer, more complete, and better suited for market analysis. Remember: max 400 characters for the improved description.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "improve_description",
              description: "Return the improved SaaS description and list of improvements made",
              parameters: {
                type: "object",
                properties: {
                  improvedDescription: {
                    type: "string",
                    description: "The enhanced description (max 400 characters)",
                  },
                  improvements: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of improvements made to the original description",
                  },
                },
                required: ["improvedDescription", "improvements"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "improve_description" } },
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

    const data = await response.json();
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "improve_description") {
      throw new Error("Unexpected response format from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);

    // Ensure the description is under 400 characters
    if (result.improvedDescription && result.improvedDescription.length > 400) {
      result.improvedDescription = result.improvedDescription.substring(0, 397) + "...";
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in pms-improve-description:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
