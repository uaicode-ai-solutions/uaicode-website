import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface ScrapeRequest {
  url: string;
  extractType: "pricing" | "features" | "branding" | "general";
}

interface ScrapeResponse {
  url: string;
  title: string;
  content: string;
  extractedData: Record<string, unknown>;
  success: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, extractType } = await req.json() as ScrapeRequest;
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");

    if (!FIRECRAWL_API_KEY) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    console.log(`[pms-firecrawl-scrape] Scraping (${extractType}): ${url}`);

    // Build extraction schema based on type
    const extractionSchemas: Record<string, object> = {
      pricing: {
        type: "object",
        properties: {
          plans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                price: { type: "string" },
                period: { type: "string" },
                features: { type: "array", items: { type: "string" } },
                recommended: { type: "boolean" }
              }
            }
          },
          hasFreeTier: { type: "boolean" },
          hasTrial: { type: "boolean" },
          trialDays: { type: "number" },
          currency: { type: "string" }
        }
      },
      features: {
        type: "object",
        properties: {
          mainFeatures: { type: "array", items: { type: "string" } },
          integrations: { type: "array", items: { type: "string" } },
          useCases: { type: "array", items: { type: "string" } },
          targetAudience: { type: "string" },
          uniqueSellingPoints: { type: "array", items: { type: "string" } }
        }
      },
      branding: {
        type: "object",
        properties: {
          companyName: { type: "string" },
          tagline: { type: "string" },
          valueProposition: { type: "string" },
          brandTone: { type: "string" },
          ctaTexts: { type: "array", items: { type: "string" } }
        }
      },
      general: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          mainContent: { type: "string" },
          links: { type: "array", items: { type: "string" } }
        }
      }
    };

    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "extract"],
        extract: {
          schema: extractionSchemas[extractType] || extractionSchemas.general,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[pms-firecrawl-scrape] API Error: ${response.status} - ${errorText}`);
      throw new Error(`Firecrawl API error: ${response.status}`);
    }

    const data = await response.json();

    const result: ScrapeResponse = {
      url,
      title: data.data?.metadata?.title || "",
      content: data.data?.markdown || "",
      extractedData: data.data?.extract || {},
      success: data.success || false,
    };

    console.log(`[pms-firecrawl-scrape] Success: ${result.title}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[pms-firecrawl-scrape] Error:", error);
    return new Response(
      JSON.stringify({ 
        url: "", 
        title: "", 
        content: "", 
        extractedData: {}, 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
