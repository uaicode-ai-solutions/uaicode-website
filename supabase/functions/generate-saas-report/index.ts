import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const systemPrompt = `You are a senior SaaS consultant and business analyst with 15+ years of experience. Analyze the provided SaaS idea and generate a comprehensive feasibility study.

Your analysis should be:
- Specific to the SaaS idea provided, not generic advice
- Realistic and actionable with concrete numbers
- Based on current market conditions and industry standards
- Tailored to the budget and timeline constraints mentioned

Consider:
- The target industry and its specific challenges
- The selected features and their technical complexity
- The target customer segments and their needs
- The competitive landscape mentioned
- The budget and timeline constraints

IMPORTANT - Investment Recommendations:
- Monthly marketing budget should average around $1,500 USD
- ADS cost should be between 5-30% of Customer Acquisition Cost (CAC)
- Include these marketing costs in the financial projections and break-even analysis
- Total first year investment should include development + annual marketing costs ($18,000)

IMPORTANT - Pricing Strategy:
- Research and provide the average market price for similar SaaS products in this industry
- The ideal ticket (recommended price) should be 10-20% BELOW market average to be competitive and encourage adoption
- Ensure the ideal ticket price allows LTV (Lifetime Value) to be at least 3x CAC
- The pricing should support achieving break-even within the projected timeline
- Consider customer lifetime of ~24 months when calculating LTV

IMPORTANT - Score Generation Guidelines:
- Viability scores should be ENCOURAGING and OPTIMISTIC (aim for 72-88 range)
- Focus on opportunities and market potential rather than risks
- Present challenges as solvable with the right development team
- Always include a clear path to success
- Be constructive and encouraging - the goal is to help founders see the potential in their ideas

IMPORTANT - Handling Undefined User Inputs:
When the user selects uncertain options, you MUST provide intelligent recommendations in the "recommendations" field:

1. **Primary Goal = "other"**: 
   - Analyze the SaaS idea, industry, target audience, and features to INFER the most likely business goal
   - Provide a clear inferredGoal with detailed justification

2. **Budget Range = "guidance" (user needs guidance)**:
   - Calculate a TOTAL INVESTMENT recommendation based on:
     a) Development costs (based on feature complexity: Starter features ~$3K each, Growth ~$8K each, Enterprise ~$20K each)
     b) Infrastructure costs (hosting, servers, CDN, databases) for the projected period
     c) Third-party services (APIs, tools, integrations) monthly costs
     d) Marketing costs ($1,500/month × period months)
     e) Operational costs (support, maintenance, updates - ~15% of dev costs annually)
     f) 20-30% contingency buffer for unexpected costs
   - Provide a detailed breakdown of all cost categories
   - Calculate for the recommended or selected timeline period

3. **Launch Timeline = "flexible" (user is flexible on timing)**:
   - Recommend an optimal timeline based on feature complexity and budget
   - Use these AI-accelerated development guidelines (UaiCode uses AI to speed up development):
     * Starter MVP (core features) = 30-45 days (1-1.5 months)
     * Growth MVP (full product with growth features) = 45-60 days (1.5-2 months)
     * Enterprise MVP (enterprise-ready with advanced features) = 60-90 days (2-3 months)
   - Provide phase breakdown with justification
   - IMPORTANT: Never recommend timelines longer than 3 months as UaiCode's AI-accelerated process delivers faster

Provide insights that would help a founder make informed decisions about proceeding with their SaaS idea.`;

const reportToolDefinition = {
  type: "function",
  function: {
    name: "generate_feasibility_report",
    description: "Generate a comprehensive SaaS feasibility report with all sections",
    parameters: {
      type: "object",
      properties: {
        executiveSummary: {
          type: "object",
          properties: {
            keyHighlights: {
              type: "array",
              items: { type: "string" },
              description: "4-5 key highlights about the SaaS opportunity"
            },
            marketOpportunity: {
              type: "string",
              description: "Brief statement about the market opportunity"
            },
            mainRisks: {
              type: "array",
              items: { type: "string" },
              description: "2-3 main risks to consider"
            }
          },
          required: ["keyHighlights", "marketOpportunity", "mainRisks"]
        },
        marketAnalysis: {
          type: "object",
          properties: {
            overview: {
              type: "string",
              description: "2-3 paragraphs about the market"
            },
            targetAudienceInsights: {
              type: "string",
              description: "Analysis of target customers"
            },
            competitiveLandscape: {
              type: "string",
              description: "Competitor analysis"
            },
            marketTrends: {
              type: "array",
              items: { type: "string" },
              description: "3-4 relevant market trends"
            },
            marketPricing: {
              type: "object",
              properties: {
                averageTicket: { type: "number", description: "Average market price per month for similar SaaS products in this industry" },
                priceRange: {
                  type: "object",
                  properties: {
                    min: { type: "number" },
                    max: { type: "number" }
                  },
                  required: ["min", "max"],
                  description: "Price range in the market (min-max per month)"
                },
                pricingModel: { type: "string", description: "Common pricing model in this market (per user, flat rate, usage-based, tiered)" }
              },
              required: ["averageTicket", "priceRange", "pricingModel"],
              description: "Market pricing intelligence based on competitor research"
            },
            investmentRecommendations: {
              type: "object",
              properties: {
                monthlyMarketingBudget: { type: "number", description: "Recommended monthly marketing budget in USD (should be around $1500)" },
                cacEstimate: { type: "number", description: "Estimated Customer Acquisition Cost based on industry" },
                adsPercentageOfCac: { 
                  type: "object", 
                  properties: { 
                    min: { type: "number" }, 
                    max: { type: "number" } 
                  },
                  required: ["min", "max"],
                  description: "ADS cost as percentage of CAC (should be 5-30%)"
                },
                marketingChannels: { 
                  type: "array", 
                  items: { type: "string" }, 
                  description: "3-4 recommended marketing channels for this SaaS" 
                }
              },
              required: ["monthlyMarketingBudget", "cacEstimate", "adsPercentageOfCac", "marketingChannels"]
            }
          },
          required: ["overview", "targetAudienceInsights", "competitiveLandscape", "marketTrends", "marketPricing", "investmentRecommendations"]
        },
        technicalFeasibility: {
          type: "object",
          properties: {
            overview: {
              type: "string",
              description: "Overall technical assessment"
            },
            recommendedStack: {
              type: "object",
              properties: {
                frontend: { type: "array", items: { type: "string" } },
                backend: { type: "array", items: { type: "string" } },
                infrastructure: { type: "array", items: { type: "string" } },
                thirdParty: { type: "array", items: { type: "string" } }
              },
              required: ["frontend", "backend", "infrastructure", "thirdParty"]
            },
            developmentPhases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  phase: { type: "string" },
                  duration: { type: "string" },
                  deliverables: { type: "array", items: { type: "string" } }
                },
                required: ["phase", "duration", "deliverables"]
              }
            },
            technicalChallenges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  challenge: { type: "string" },
                  solution: { type: "string" },
                  difficulty: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["challenge", "solution", "difficulty"]
              }
            }
          },
          required: ["overview", "recommendedStack", "developmentPhases", "technicalChallenges"]
        },
        financialProjections: {
          type: "object",
          properties: {
            developmentCost: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" },
                breakdown: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      item: { type: "string" },
                      percentage: { type: "number" }
                    },
                    required: ["item", "percentage"]
                  }
                }
              },
              required: ["min", "max", "breakdown"]
            },
            marketingCosts: {
              type: "object",
              properties: {
                monthlyBudget: { type: "number", description: "Monthly marketing budget (~$1500)" },
                yearlyBudget: { type: "number", description: "Annual marketing budget ($1500 * 12 = $18000)" },
                cacEstimate: { type: "number", description: "Customer Acquisition Cost" },
                adsBudgetMin: { type: "number", description: "Minimum ADS budget (5% of CAC)" },
                adsBudgetMax: { type: "number", description: "Maximum ADS budget (30% of CAC)" }
              },
              required: ["monthlyBudget", "yearlyBudget", "cacEstimate", "adsBudgetMin", "adsBudgetMax"]
            },
            revenueProjections: {
              type: "object",
              properties: {
                year1: {
                  type: "object",
                  properties: { mrr: { type: "number" }, arr: { type: "number" } },
                  required: ["mrr", "arr"]
                },
                year2: {
                  type: "object",
                  properties: { mrr: { type: "number" }, arr: { type: "number" } },
                  required: ["mrr", "arr"]
                },
                year3: {
                  type: "object",
                  properties: { mrr: { type: "number" }, arr: { type: "number" } },
                  required: ["mrr", "arr"]
                }
              },
              required: ["year1", "year2", "year3"]
            },
            breakEvenAnalysis: {
              type: "object",
              properties: {
                monthsToBreakEven: { type: "number" },
                assumptions: { type: "array", items: { type: "string" } }
              },
              required: ["monthsToBreakEven", "assumptions"]
            },
            roiEstimate: {
              type: "object",
              properties: {
                percentage: { type: "number" },
                timeframe: { type: "string" }
              },
              required: ["percentage", "timeframe"]
            },
            recommendedPricing: {
              type: "object",
              properties: {
                idealTicket: { type: "number", description: "Recommended monthly price (10-20% below market average to be competitive)" },
                minimumTicket: { type: "number", description: "Minimum viable price to achieve 3x LTV/CAC ratio" },
                competitiveAdvantage: { type: "string", description: "Brief explanation of how this pricing is competitive and encourages adoption" }
              },
              required: ["idealTicket", "minimumTicket", "competitiveAdvantage"],
              description: "Strategic pricing recommendation to achieve ROI and break-even"
            }
          },
          required: ["developmentCost", "marketingCosts", "revenueProjections", "breakEvenAnalysis", "roiEstimate", "recommendedPricing"]
        },
        userJourney: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  revenuePoint: { type: "boolean" }
                },
                required: ["step", "title", "description", "revenuePoint"]
              }
            },
            engagementLoops: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["steps", "engagementLoops"]
        },
        viabilityScore: {
          type: "number",
          description: "Overall viability score from 1-100"
        },
        recommendations: {
          type: "object",
          description: "AI recommendations when user selected uncertain options (other, guidance, flexible)",
          properties: {
            inferredGoal: {
              type: "object",
              properties: {
                goal: { type: "string", description: "The inferred primary business goal" },
                justification: { type: "string", description: "Detailed explanation of why this goal was inferred based on the SaaS idea analysis" }
              },
              required: ["goal", "justification"],
              description: "If user selected 'other' for primary goal"
            },
            recommendedBudget: {
              type: "object",
              properties: {
                totalMin: { type: "number", description: "Minimum total investment recommended" },
                totalMax: { type: "number", description: "Maximum total investment recommended" },
                periodMonths: { type: "number", description: "Period in months this budget covers" },
                breakdown: {
                  type: "object",
                  properties: {
                    development: { type: "number", description: "Development costs" },
                    infrastructure: { type: "number", description: "Infrastructure costs for the period" },
                    thirdPartyServices: { type: "number", description: "Third-party services and APIs" },
                    marketing: { type: "number", description: "Marketing budget for the period" },
                    operational: { type: "number", description: "Operational and maintenance costs" },
                    contingencyBuffer: { type: "number", description: "20-30% buffer for unexpected costs" }
                  },
                  required: ["development", "infrastructure", "thirdPartyServices", "marketing", "operational", "contingencyBuffer"]
                },
                justification: { type: "string", description: "Explanation of how this budget was calculated" }
              },
              required: ["totalMin", "totalMax", "periodMonths", "breakdown", "justification"],
              description: "If user selected 'guidance' for budget range"
            },
            recommendedTimeline: {
              type: "object",
              properties: {
                totalMonths: { type: "number", description: "Total recommended months to launch" },
                breakdown: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      phase: { type: "string" },
                      months: { type: "number" },
                      description: { type: "string" }
                    },
                    required: ["phase", "months", "description"]
                  }
                },
                justification: { type: "string", description: "Explanation of why this timeline is recommended" }
              },
              required: ["totalMonths", "breakdown", "justification"],
              description: "If user selected 'flexible' for launch timeline"
            }
          }
        }
      },
      required: ["executiveSummary", "marketAnalysis", "technicalFeasibility", "financialProjections", "userJourney", "viabilityScore"],
      additionalProperties: false
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId } = await req.json();

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'submissionId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the submission data
    const { data: submission, error: fetchError } = await supabase
      .from('wizard_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      console.error('Error fetching submission:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Submission not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log all submission data for debugging
    console.log('Fetched submission data:', {
      companyName: submission.company_name,
      saasCategory: submission.saas_category,
      saasIdea: submission.saas_idea?.substring(0, 100),
      industry: submission.industry,
      targetCustomers: submission.target_customers?.length || 0,
      marketSize: submission.market_size,
      competitors: submission.competitors?.length || 0,
      competitorsData: submission.competitors_data?.length || 0,
      starterFeatures: submission.starter_features?.length || 0,
      growthFeatures: submission.growth_features?.length || 0,
      enterpriseFeatures: submission.enterprise_features?.length || 0,
      primaryGoal: submission.primary_goal,
      launchTimeline: submission.launch_timeline,
      budgetRange: submission.budget_range
    });

    // Build competitor pricing intelligence from real data
    let competitorPricingInfo = '';
    const competitorsData = submission.competitors_data || [];
    
    if (competitorsData.length > 0) {
      const pricingDetails = competitorsData
        .filter((c: any) => c.pricing?.startingPrice)
        .map((c: any) => {
          const verified = c.pricing.priceVerified ? '(verified)' : '(estimated)';
          return `- ${c.name}: $${c.pricing.startingPrice}/month ${verified} - ${c.pricing.pricingModel || 'unknown model'} - Target: ${c.pricing.targetSegment || 'unknown'}`;
        })
        .join('\n');
      
      if (pricingDetails) {
        const prices = competitorsData
          .map((c: any) => c.pricing?.startingPrice)
          .filter(Boolean) as number[];
        
        const avgPrice = prices.length > 0 
          ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          : 0;
        
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        
        competitorPricingInfo = `
## REAL COMPETITOR PRICING DATA (from market research)
${pricingDetails}

**Market Price Analysis:**
- Average Market Price: $${avgPrice}/month
- Price Range: $${minPrice} - $${maxPrice}/month
- Number of competitors analyzed: ${prices.length}

**CRITICAL PRICING INSTRUCTION:**
- Use these REAL verified prices to calculate market pricing in the report
- The ideal ticket price MUST be 10-20% below the market average ($${avgPrice})
- Suggested ideal ticket: $${Math.round(avgPrice * 0.85)}/month (15% below average)
- This pricing strategy encourages adoption while maintaining profitability
`;
      }
    }
    
    if (!competitorPricingInfo) {
      competitorPricingInfo = `
## COMPETITOR PRICING
No verified competitor pricing data available. Please estimate based on:
- Industry standards for ${submission.saas_category || 'SaaS'} products
- Target customer segment: ${(submission.target_customers || []).join(', ') || 'Not specified'}
- Market size: ${submission.market_size || 'Not specified'}
`;
    }

    // Build the user prompt with all wizard data including competitor pricing
    const userPrompt = `
Analyze this SaaS idea and generate a comprehensive feasibility report:

## Company & Product
- **Company Name**: ${submission.company_name}
- **SaaS Category**: ${submission.saas_category || 'Not specified'}
- **SaaS Idea**: ${submission.saas_idea || 'Not specified'}
- **Industry**: ${submission.industry || 'Not specified'}

## Target Audience
- **Target Customers**: ${(submission.target_customers || []).join(', ') || 'Not specified'}
- **Market Size**: ${submission.market_size || 'Not specified'}
- **Key Competitors**: ${(submission.competitors || []).join(', ') || 'Not specified'}

${competitorPricingInfo}

## Features Planned
- **Starter Features**: ${(submission.starter_features || []).join(', ') || 'None'}
- **Growth Features**: ${(submission.growth_features || []).join(', ') || 'None'}
- **Enterprise Features**: ${(submission.enterprise_features || []).join(', ') || 'None'}

## Goals & Constraints
- **Primary Goal**: ${submission.primary_goal || 'Not specified'}${submission.primary_goal === 'other' ? '\n  ⚠️ USER SELECTED "OTHER" - Please INFER the best primary goal based on the SaaS idea, industry, and features. Include your recommendation in the "recommendations.inferredGoal" field with detailed justification.' : ''}
- **Launch Timeline**: ${submission.launch_timeline || 'Not specified'}${submission.launch_timeline === 'flexible' ? '\n  ⚠️ USER IS FLEXIBLE ON TIMING - Please RECOMMEND an optimal timeline based on feature complexity. Include your recommendation in the "recommendations.recommendedTimeline" field with phase breakdown and justification.' : ''}
- **Budget Range**: ${submission.budget_range || 'Not specified'}${submission.budget_range === 'guidance' ? `\n  ⚠️ USER NEEDS BUDGET GUIDANCE - Please CALCULATE and RECOMMEND a total investment budget. Include ALL costs in the "recommendations.recommendedBudget" field:
  - Development costs (based on ${(submission.starter_features || []).length} starter, ${(submission.growth_features || []).length} growth, ${(submission.enterprise_features || []).length} enterprise features)
  - Infrastructure costs for ${submission.launch_timeline === 'flexible' ? 'the recommended period' : submission.launch_timeline || '6 months'}
  - Third-party services and integrations
  - Marketing budget ($1,500/month)
  - Operational costs (~15% of dev costs)
  - 20-30% contingency buffer
  Provide detailed breakdown and justification.` : ''}

Please provide a detailed, realistic analysis specific to this ${submission.saas_category || 'SaaS'} concept. 
IMPORTANT: Use the REAL competitor pricing data provided above to calculate accurate market pricing and ideal ticket recommendations.
Consider the budget constraints, timeline, and selected features when making recommendations.
${submission.primary_goal === 'other' || submission.budget_range === 'guidance' || submission.launch_timeline === 'flexible' ? '\nCRITICAL: The user has selected uncertain options. You MUST populate the "recommendations" field with your intelligent analysis for each uncertain selection.' : ''}
`;

    console.log('Calling Lovable AI...');

    // Call Lovable AI with tool calling for structured output
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [reportToolDefinition],
        tool_choice: { type: 'function', function: { name: 'generate_feasibility_report' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a few moments.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate report. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    // Extract the tool call result
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'generate_feasibility_report') {
      console.error('Unexpected AI response format:', JSON.stringify(aiData));
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reportData = JSON.parse(toolCall.function.arguments);
    console.log('Report data parsed successfully');

    // ===== RESOLVE UNCERTAIN VALUES FROM AI RECOMMENDATIONS =====
    let resolvedPrimaryGoal = submission.primary_goal;
    let resolvedBudgetRange = submission.budget_range;
    let resolvedLaunchTimeline = submission.launch_timeline;

    // If primary_goal is "other", infer from AI recommendations
    if (submission.primary_goal === 'other' && reportData.recommendations?.inferredGoal) {
      const inferredGoal = reportData.recommendations.inferredGoal.goal.toLowerCase();
      
      if (inferredGoal.includes('automat') || inferredGoal.includes('manual') || inferredGoal.includes('process')) {
        resolvedPrimaryGoal = 'replace';
      } else if (inferredGoal.includes('revenue') || inferredGoal.includes('money') || inferredGoal.includes('income') || inferredGoal.includes('sell')) {
        resolvedPrimaryGoal = 'revenue';
      } else if (inferredGoal.includes('customer') || inferredGoal.includes('serve') || inferredGoal.includes('experience')) {
        resolvedPrimaryGoal = 'serve';
      } else if (inferredGoal.includes('disrupt') || inferredGoal.includes('market') || inferredGoal.includes('industry')) {
        resolvedPrimaryGoal = 'disrupt';
      } else {
        resolvedPrimaryGoal = 'solve';
      }
      console.log(`Resolved primary_goal: "other" → "${resolvedPrimaryGoal}"`);
    }

    // If budget_range is "guidance", calculate from AI recommendations
    if (submission.budget_range === 'guidance' && reportData.recommendations?.recommendedBudget) {
      const avgBudget = (reportData.recommendations.recommendedBudget.totalMin + 
                        reportData.recommendations.recommendedBudget.totalMax) / 2;
      
      if (avgBudget <= 25000) resolvedBudgetRange = '10k-25k';
      else if (avgBudget <= 50000) resolvedBudgetRange = '25k-50k';
      else if (avgBudget <= 100000) resolvedBudgetRange = '50k-100k';
      else resolvedBudgetRange = '100k+';
      
      console.log(`Resolved budget_range: "guidance" → "${resolvedBudgetRange}" (avg: $${avgBudget})`);
    }

    // If launch_timeline is "flexible", use AI recommended months
    if (submission.launch_timeline === 'flexible' && reportData.recommendations?.recommendedTimeline) {
      const totalMonths = reportData.recommendations.recommendedTimeline.totalMonths;
      
      if (totalMonths <= 3) resolvedLaunchTimeline = 'asap';
      else if (totalMonths <= 6) resolvedLaunchTimeline = 'this_year';
      else resolvedLaunchTimeline = 'next_year';
      
      console.log(`Resolved launch_timeline: "flexible" → "${resolvedLaunchTimeline}" (${totalMonths} months)`);
    }

    // Calculate complexity score - SYNCED with frontend Step4Features.tsx
    // Formula: starter * 3 + growth * 7 + enterprise * 15
    const starterCount = (submission.starter_features || []).length;
    const growthCount = (submission.growth_features || []).length;
    const enterpriseCount = (submission.enterprise_features || []).length;
    
    let complexityScore = starterCount * 3 + growthCount * 7 + enterpriseCount * 15;
    
    // Industry complexity bonus
    const complexIndustries = ['fintech', 'healthcare', 'saas', 'finance', 'medical', 'insurance'];
    if (complexIndustries.some(i => (submission.industry || '').toLowerCase().includes(i))) {
      complexityScore += 10;
    }
    
    // Timeline urgency adds perceived complexity (use resolved value)
    if (resolvedLaunchTimeline === 'asap') complexityScore += 5;
    
    // Cap at 100 to match frontend behavior
    complexityScore = Math.min(100, complexityScore);
    
    // Strategic floor for display (minimum 35 to show value)
    const displayComplexityScore = Math.max(35, Math.min(65, complexityScore));

    // Calculate strategic viability score (72-88 range)
    let viabilityScore = reportData.viabilityScore || 70;
    
    // Bonus for having market defined
    if (submission.market_size) viabilityScore += 5;
    
    // Bonus for having competitors (market validation)
    if ((submission.competitors || []).length > 0) viabilityScore += 3;
    
    // Bonus for urgent timeline (use resolved value)
    if (resolvedLaunchTimeline === 'asap') viabilityScore += 4;
    
    // Bonus for defined budget (use resolved value)
    if (resolvedBudgetRange && resolvedBudgetRange !== 'guidance') viabilityScore += 3;
    
    // Ensure strategic range (72-88)
    viabilityScore = Math.max(72, Math.min(88, viabilityScore));

    // Determine recommended plan - SYNCED with frontend Step4Features.tsx
    // Priority: Feature types first, then budget/goal as tiebreakers
    // Use RESOLVED values for calculation
    let recommendedPlan = 'Starter';
    
    // Enterprise: if ANY enterprise feature selected OR high budget
    if (enterpriseCount >= 1 || resolvedBudgetRange === '100k+' || resolvedBudgetRange === '50k-100k') {
      recommendedPlan = 'Enterprise';
    }
    // Growth: if ANY growth feature selected OR medium budget/growth goals
    else if (
      growthCount >= 1 || 
      resolvedBudgetRange === '25k-50k' || 
      resolvedPrimaryGoal === 'revenue' || 
      resolvedPrimaryGoal === 'growth'
    ) {
      recommendedPlan = 'Growth';
    }
    // Starter: only starter features with low budget
    
    console.log('Calculated scores:', {
      starterCount,
      growthCount,
      enterpriseCount,
      rawComplexityScore: complexityScore,
      displayComplexityScore,
      viabilityScore,
      recommendedPlan,
      resolvedBudgetRange,
      resolvedPrimaryGoal,
      resolvedLaunchTimeline
    });

    // Generate report URL
    const reportUrl = submissionId;

    // Update the submission with report data and RESOLVED values
    const { error: updateError } = await supabase
      .from('wizard_submissions')
      .update({
        report_data: reportData,
        complexity_score: displayComplexityScore,
        viability_score: viabilityScore,
        recommended_plan: recommendedPlan,
        report_url: reportUrl,
        completed_at: new Date().toISOString(),
        current_step: 6,
        screen_mockups: [],
        // Save resolved values (overwrites uncertain options)
        primary_goal: resolvedPrimaryGoal,
        budget_range: resolvedBudgetRange,
        launch_timeline: resolvedLaunchTimeline
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Error updating submission:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save report' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Report saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        reportUrl,
        viabilityScore,
        complexityScore: displayComplexityScore,
        recommendedPlan
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-saas-report:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
