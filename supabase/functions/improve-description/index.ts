import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();
    
    if (!description || description.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Description must be at least 10 characters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Improving description:", description.substring(0, 100) + "...");

    const systemPrompt = `You are a professional business writer. Your task is to refine the user's SaaS product description.

STRICT RULES:
1. Fix grammar, spelling, and punctuation errors
2. Improve sentence structure and clarity
3. Keep the EXACT same meaning and scope - do NOT add new features or ideas
4. Write in a formal business tone, NOT marketing/sales language
5. DO NOT invent product names, brand names, or catchy titles
6. DO NOT add superlatives like "revolutionary", "cutting-edge", "sophisticated"
7. DO NOT expand the scope beyond what the user wrote
8. Write as if YOU ARE the user describing their own idea
9. Keep the first-person perspective if the original uses it
10. Maximum output: 1000 characters - this is critical
11. Return ONLY the improved description text, nothing else - no explanations, no quotes, no prefixes
12. Write in the same language as the original text

Your goal is to make the text clearer and more professional while preserving the user's original voice and intent. Only polish what exists, do not embellish or invent.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Improve this SaaS product description:\n\n${description}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let improvedDescription = data.choices?.[0]?.message?.content || "";
    
    // Ensure max 1000 characters
    if (improvedDescription.length > 1000) {
      improvedDescription = improvedDescription.substring(0, 997) + "...";
    }

    console.log("Improved description generated, length:", improvedDescription.length);

    return new Response(
      JSON.stringify({ improvedDescription }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in improve-description function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
