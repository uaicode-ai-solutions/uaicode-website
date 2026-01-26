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

RATIONALE RULES:
- Must be exactly ONE sentence
- Maximum 15 words
- Explain the strategic branding/marketing reasoning
- Focus on what the name evokes or communicates
- Be specific about linguistic or psychological elements used`;

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

Generate ONE perfect name following the naming rules. Prefer 1 word, maximum 3 words.
Also provide a brief branding rationale explaining why this name works.`;

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
              name: "suggest_name",
              description: "Return the suggested SaaS name with branding rationale",
              parameters: {
                type: "object",
                properties: {
                  suggestedName: {
                    type: "string",
                    description: "The suggested name (1-3 words max)",
                  },
                  rationale: {
                    type: "string",
                    description: "Brief branding rationale explaining the name (one sentence, max 15 words)",
                  },
                },
                required: ["suggestedName", "rationale"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_name" } },
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
    console.log("AI Response:", JSON.stringify(data, null, 2));
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let result: { suggestedName: string; rationale: string };
    
    if (toolCall && toolCall.function?.name === "suggest_name") {
      // Standard tool call response
      result = JSON.parse(toolCall.function.arguments);
    } else if (data.choices?.[0]?.message?.content) {
      // Fallback: parse from content if tool call format differs
      const content = data.choices[0].message.content;
      console.log("Fallback parsing from content:", content);
      
      // Try to extract name from content
      const nameMatch = content.match(/(?:name[:\s]+)?["']?([A-Z][a-zA-Z0-9]*(?:\s+[A-Z][a-zA-Z0-9]*)?)["']?/i);
      const suggestedName = nameMatch ? nameMatch[1].trim() : content.split(/[\n.!?]/)[0].trim().slice(0, 30);
      
      result = {
        suggestedName: suggestedName || "Unnamed",
        rationale: "AI-generated name based on your product description."
      };
    } else {
      console.error("Unexpected AI response structure:", JSON.stringify(data));
      throw new Error("Unexpected response format from AI");
    }

    // Clean up the name - remove quotes, extra spaces, etc.
    const cleanName = result.suggestedName
      .replace(/^["']|["']$/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50);

    // Clean up the rationale
    const cleanRationale = result.rationale
      .replace(/^["']|["']$/g, "")
      .trim()
      .slice(0, 150);

    return new Response(
      JSON.stringify({ 
        suggestedName: cleanName,
        rationale: cleanRationale
      }),
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
