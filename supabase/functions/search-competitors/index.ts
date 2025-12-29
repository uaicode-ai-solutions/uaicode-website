import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate if URL is accessible
async function validateUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Fallback to Lovable AI when Perplexity fails
async function searchWithLovableAI(params: {
  saasIdea: string;
  saasCategory: string;
  industry: string;
  targetCustomers: string[];
  marketSize: string;
}): Promise<{ competitors: any[]; averageMarketPrice?: number }> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  const { saasIdea, saasCategory, industry, targetCustomers, marketSize } = params;

  const queryParts = [];
  if (saasIdea) queryParts.push(`SaaS product: "${saasIdea}"`);
  if (saasCategory) queryParts.push(`category: ${saasCategory}`);
  if (industry) queryParts.push(`industry: ${industry}`);
  if (targetCustomers?.length) queryParts.push(`target audience: ${targetCustomers.join(', ')}`);
  if (marketSize) queryParts.push(`market size: ${marketSize}`);

  const prompt = `You are a market research expert. Find up to 6 competitors for a SaaS business with these characteristics: ${queryParts.join('; ')}.

For each competitor, provide realistic pricing based on your knowledge of the market. Return ONLY a valid JSON object in this exact format:
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "https://example.com",
      "description": "Brief description",
      "verified": false,
      "pricing": {
        "startingPrice": 29,
        "pricingModel": "per user",
        "targetSegment": "SMB",
        "priceVerified": false
      }
    }
  ],
  "averageMarketPrice": 49
}

Important:
- Use real companies you know exist in this space
- Estimate realistic pricing based on industry standards
- Set priceVerified to false since these are estimates
- Calculate averageMarketPrice from the competitors`;

  console.log('Calling Lovable AI for competitor search...');

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lovable AI error:', response.status, errorText);
    throw new Error(`Lovable AI error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from Lovable AI');
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Could not parse Lovable AI response');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { saasIdea, saasCategory, industry, targetCustomers, marketSize } = await req.json();

    const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
    let usePerplexity = !!apiKey;
    let parsedResult: any = null;
    let citations: string[] = [];
    let source = 'perplexity';

    if (usePerplexity) {
      try {
        // Build a detailed search query based on the provided data
        const queryParts = [];
        
        if (saasIdea) queryParts.push(`SaaS product: "${saasIdea}"`);
        if (saasCategory) queryParts.push(`category: ${saasCategory}`);
        if (industry) queryParts.push(`industry: ${industry}`);
        if (targetCustomers?.length) queryParts.push(`target audience: ${targetCustomers.join(', ')}`);
        if (marketSize) queryParts.push(`market size: ${marketSize}`);

        const searchQuery = `Find up to 6 direct or indirect competitors for a SaaS business with the following characteristics: ${queryParts.join('; ')}. 
        
        For each competitor found, provide:
        1. Company/product name
        2. Their website URL
        3. A brief description of what they do (1-2 sentences)
        4. Starting price per month (if publicly available)
        5. Pricing model (per user, flat rate, usage-based, tiered, freemium)
        6. Target customer segment (SMB, Mid-Market, Enterprise, or All)
        
        Focus on real, existing companies with verifiable pricing information. If no direct competitors exist, suggest indirect competitors or similar solutions. Return the results in JSON format.`;

        console.log('Searching competitors with Perplexity...');

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              { 
                role: 'system', 
                content: `You are a market research assistant specialized in finding real, verified competitors for SaaS products with their pricing information.

CRITICAL INSTRUCTIONS FOR URLs:
- ONLY include URLs that you have verified exist in your search results
- DO NOT generate, guess, or fabricate URLs
- If you're not 100% sure a URL is correct, use the company's likely domain format but mark it as unverified
- Prefer well-known companies with established web presence
- Double-check spelling of company names and domains

CRITICAL INSTRUCTIONS FOR PRICING:
- Research actual pricing from company websites and pricing pages
- If pricing is not publicly available, estimate based on industry standards and mark priceVerified: false
- Include the pricing model (per user, flat rate, usage-based, tiered, freemium)
- Target segment helps contextualize the pricing

Always respond with a valid JSON object in this exact format:
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "https://example.com",
      "description": "Brief description of what they do",
      "verified": true,
      "pricing": {
        "startingPrice": 29,
        "pricingModel": "per user",
        "targetSegment": "SMB",
        "priceVerified": true
      }
    }
  ],
  "searchContext": "Brief explanation of the competitive landscape",
  "averageMarketPrice": 49
}

Return up to 6 competitors. If you can't find any competitors, return an empty array.
Set "verified": true only if the URL comes directly from your search results.
Set "verified": false if you inferred the URL from the company name.
Set "priceVerified": true only if the price comes from official sources.
Calculate averageMarketPrice from the competitors found.`
              },
              { role: 'user', content: searchQuery }
            ],
            temperature: 0.2,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Perplexity API error:', response.status, errorText);
          throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Perplexity response received');

        const content = data.choices?.[0]?.message?.content;
        citations = data.citations || [];

        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedResult = JSON.parse(jsonMatch[0]);
          }
        }

        // Check if Perplexity returned useful results
        if (!parsedResult || !parsedResult.competitors || parsedResult.competitors.length === 0) {
          console.log('Perplexity returned no competitors, falling back to Lovable AI...');
          usePerplexity = false;
        }
      } catch (perplexityError) {
        console.error('Perplexity search failed:', perplexityError);
        usePerplexity = false;
      }
    }

    // Fallback to Lovable AI if Perplexity is not available or failed
    if (!usePerplexity || !parsedResult) {
      console.log('Using Lovable AI fallback for competitor search...');
      source = 'lovable-ai';
      citations = [];
      
      try {
        parsedResult = await searchWithLovableAI({
          saasIdea,
          saasCategory,
          industry,
          targetCustomers,
          marketSize
        });
      } catch (lovableError) {
        console.error('Lovable AI fallback also failed:', lovableError);
        return new Response(
          JSON.stringify({ success: false, error: 'Both search methods failed. Please try again.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate URLs for each competitor
    if (parsedResult.competitors && parsedResult.competitors.length > 0) {
      console.log('Validating competitor URLs...');
      const validatedCompetitors = await Promise.all(
        parsedResult.competitors.map(async (competitor: any) => {
          if (competitor.website) {
            const isValid = await validateUrl(competitor.website);
            console.log(`URL validation for ${competitor.website}: ${isValid}`);
            return {
              ...competitor,
              urlValid: isValid
            };
          }
          return { ...competitor, urlValid: false };
        })
      );
      parsedResult.competitors = validatedCompetitors;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          ...parsedResult,
          source
        },
        citations,
        warning: source === 'lovable-ai' 
          ? 'Pricing data generated from AI knowledge base. These are estimates based on industry patterns.'
          : 'AI-generated results may contain inaccuracies. Please verify URLs before visiting.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-competitors function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
