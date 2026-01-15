import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface SearchRequest {
  query: string;
  searchType: "market" | "competitors" | "trends" | "demand" | "general";
  context?: string;
}

interface SearchResponse {
  content: string;
  citations: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, searchType, context } = await req.json() as SearchRequest;
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

    if (!PERPLEXITY_API_KEY) {
      throw new Error("PERPLEXITY_API_KEY is not configured");
    }

    // Build system prompt based on search type
    const systemPrompts: Record<string, string> = {
      market: `You are a market research analyst. Provide detailed, data-driven insights about market size, growth rates, and industry trends. Include specific numbers, percentages, and monetary values when available. Focus on TAM, SAM, SOM analysis. Always cite your sources.`,
      competitors: `You are a competitive intelligence analyst. Identify and analyze direct and indirect competitors, their pricing, features, market positioning, strengths, and weaknesses. Provide specific company names and data. Always cite your sources.`,
      trends: `You are a technology and market trends analyst. Identify macro trends, emerging technologies, regulatory changes, and market shifts that could impact the business. Include timing analysis and window of opportunity insights. Always cite your sources.`,
      demand: `You are a demand validation specialist. Analyze search volumes, social media discussions, Reddit threads, review sites, and other signals of market demand. Identify pain points and customer needs. Include specific data points. Always cite your sources.`,
      general: `You are a business analyst. Provide comprehensive, data-driven insights based on the query. Be specific and include numbers when available. Always cite your sources.`,
    };

    const systemPrompt = systemPrompts[searchType] || systemPrompts.general;
    
    const fullQuery = context 
      ? `Context: ${context}\n\nQuery: ${query}`
      : query;

    console.log(`[pms-perplexity-search] Searching (${searchType}): ${query.substring(0, 100)}...`);

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: fullQuery }
        ],
        search_recency_filter: "month",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[pms-perplexity-search] API Error: ${response.status} - ${errorText}`);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    
    const result: SearchResponse = {
      content: data.choices?.[0]?.message?.content || "",
      citations: data.citations || [],
    };

    console.log(`[pms-perplexity-search] Success: ${result.content.substring(0, 100)}...`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[pms-perplexity-search] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
