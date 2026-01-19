import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_RETRIES = 3;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface FallbackRequest {
  wizardId: string;
  reportId: string;
  fieldPath: string;
  sectionName: string;
  fieldDescription: string;
  fieldPurpose?: string;
  expectedType: "string" | "number" | "array" | "object";
  expectedFormat?: string;
  validationRules?: Record<string, unknown>;
  perplexitySearchType?: string;
}

interface FallbackResponse {
  success: boolean;
  value: unknown;
  source: "perplexity" | "ai_estimation" | "static";
  persisted: boolean;
  retryCount: number;
  reasoning?: string;
  error?: string;
}

interface WizardData {
  saas_name: string;
  description: string | null;
  industry: string | null;
  industry_other: string | null;
  target_audience: string | null;
  geographic_region: string | null;
  product_stage: string | null;
  market_type: string | null;
  customer_types: string[] | null;
  goal: string | null;
}

interface ReportData {
  id: string;
  wizard_id: string;
  opportunity_section: Record<string, unknown> | null;
  competitive_analysis_section: Record<string, unknown> | null;
  icp_intelligence_section: Record<string, unknown> | null;
  paid_media_intelligence_section: Record<string, unknown> | null;
  price_intelligence_section: Record<string, unknown> | null;
  growth_intelligence_section: Record<string, unknown> | null;
  section_investment: Record<string, unknown> | null;
  hero_score_section: Record<string, unknown> | null;
  summary_section: Record<string, unknown> | null;
}

// Build system prompt for Perplexity
function buildSystemPrompt(): string {
  return `You are a specialized SaaS market research analyst providing accurate, real-world data for business viability reports.

CRITICAL REQUIREMENTS:
1. Return ONLY factual, current market data (prefer 2024-2025 sources)
2. Ensure consistency with provided report context
3. Use proper formatting as specified
4. If exact data unavailable, provide well-reasoned estimates based on industry benchmarks
5. Never invent fictional company names or fake statistics
6. Include sources when possible

OUTPUT FORMAT: Return ONLY the requested data in the exact format specified. No explanations unless asked.`;
}

// Build user prompt with context
function buildUserPrompt(
  wizard: WizardData,
  report: ReportData | null,
  request: FallbackRequest
): string {
  const existingOpportunity = report?.opportunity_section || {};
  const existingCompetitive = report?.competitive_analysis_section || {};
  const existingICP = report?.icp_intelligence_section || {};
  
  return `## REPORT CONTEXT
SaaS Name: ${wizard.saas_name}
Industry: ${wizard.industry || "Not specified"} ${wizard.industry_other || ""}
Target Audience: ${wizard.target_audience || "Not specified"}
Geographic Region: ${wizard.geographic_region || "Global"}
Description: ${wizard.description || "Not provided"}
Product Stage: ${wizard.product_stage || "Idea"}
Market Type: ${wizard.market_type || "B2B"}
Customer Types: ${(wizard.customer_types || []).join(", ") || "Not specified"}

## EXISTING REPORT DATA (for consistency)
TAM: ${existingOpportunity.tam_value || "Not yet determined"}
SAM: ${existingOpportunity.sam_value || "Not yet determined"}
SOM: ${existingOpportunity.som_value || "Not yet determined"}
Market Growth Rate: ${existingOpportunity.market_growth_rate || "Not yet determined"}
Main Competitors: ${JSON.stringify(existingCompetitive.competitors || "Not yet analyzed").slice(0, 500)}
Primary Personas: ${JSON.stringify(existingICP.primary_personas || "Not yet defined").slice(0, 300)}

## MISSING DATA REQUEST
Section: ${request.sectionName}
Field: ${request.fieldDescription}
Purpose: ${request.fieldPurpose || "Data for viability report"}
Expected Format: ${request.expectedFormat || "As appropriate for the data type"}

## VALIDATION CONSTRAINTS
${request.validationRules ? JSON.stringify(request.validationRules, null, 2) : "Standard validation applies"}

## INSTRUCTIONS
1. Search for real market data about the ${wizard.industry || "software"} industry
2. Consider geographic focus: ${wizard.geographic_region || "Global"}
3. Ensure consistency with existing report data above
4. Return ONLY the value in the specified format

Data:`;
}

// Get nested value from object using dot notation
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  
  const parts = path.split(".");
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  
  return current;
}

// Call Perplexity API
async function callPerplexity(
  systemPrompt: string,
  userPrompt: string,
  searchType: string
): Promise<{ content: string; citations: string[] } | null> {
  const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
  
  if (!PERPLEXITY_API_KEY) {
    console.error("PERPLEXITY_API_KEY not configured");
    return null;
  }

  try {
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
          { role: "user", content: userPrompt }
        ],
        search_recency_filter: "year",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const citations = data.citations || [];

    return { content, citations };
  } catch (error) {
    console.error("Perplexity call failed:", error);
    return null;
  }
}

// Call Lovable AI as fallback
async function callLovableAI(
  wizard: WizardData,
  request: FallbackRequest,
  existingData: Record<string, unknown>
): Promise<string | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not configured");
    return null;
  }

  const prompt = `Based on the SaaS report context below, generate a reasonable estimate for the missing field.

Context:
- SaaS: ${wizard.saas_name}
- Industry: ${wizard.industry || "Software"}
- Target: ${wizard.target_audience || "Not specified"}
- Region: ${wizard.geographic_region || "Global"}
- Stage: ${wizard.product_stage || "Idea"}

Missing Field: ${request.fieldDescription}
Expected Format: ${request.expectedFormat || "Appropriate format"}
Purpose: ${request.fieldPurpose || "Viability analysis"}

Existing Data Summary:
${JSON.stringify(existingData, null, 2).slice(0, 1000)}

Generate a reasonable estimate that:
1. Is consistent with existing data
2. Is realistic for the ${wizard.industry || "software"} industry
3. Follows the exact format specified: ${request.expectedFormat}

Return ONLY the value, no explanation:`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a SaaS market analyst. Return ONLY the requested data value in the exact format specified. No explanations." 
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("Lovable AI call failed:", error);
    return null;
  }
}

// Parse value based on expected type
function parseValue(rawValue: string, expectedType: string): unknown {
  const trimmed = rawValue.trim();
  
  switch (expectedType) {
    case "number":
      const num = parseFloat(trimmed.replace(/[^0-9.-]/g, ""));
      return isNaN(num) ? null : num;
      
    case "array":
      try {
        // Try parsing as JSON array
        if (trimmed.startsWith("[")) {
          return JSON.parse(trimmed);
        }
        // Try splitting by common delimiters
        return trimmed.split(/[,;]/).map(s => s.trim()).filter(Boolean);
      } catch {
        return null;
      }
      
    case "object":
      try {
        if (trimmed.startsWith("{")) {
          return JSON.parse(trimmed);
        }
        return null;
      } catch {
        return null;
      }
      
    case "string":
    default:
      return trimmed;
  }
}

// Validate value against rules
function validateValue(
  value: unknown,
  rules: Record<string, unknown> | undefined,
  report: ReportData | null
): { valid: boolean; reason?: string } {
  if (value === null || value === undefined) {
    return { valid: false, reason: "Value is null or undefined" };
  }

  if (!rules) return { valid: true };

  // MinLength validation
  if (rules.minLength && typeof value === "string") {
    if (value.length < (rules.minLength as number)) {
      return { valid: false, reason: `Value too short (min: ${rules.minLength})` };
    }
  }

  // MaxLength validation
  if (rules.maxLength && typeof value === "string") {
    if (value.length > (rules.maxLength as number)) {
      return { valid: false, reason: `Value too long (max: ${rules.maxLength})` };
    }
  }

  // MustContain validation
  if (rules.mustContain && typeof value === "string") {
    const mustContain = rules.mustContain as string[];
    for (const str of mustContain) {
      if (!value.includes(str)) {
        return { valid: false, reason: `Value must contain: ${str}` };
      }
    }
  }

  // ReasonableRange validation (extract numeric value)
  if (rules.reasonableRange && typeof value === "string") {
    const range = rules.reasonableRange as { min: number; max: number };
    const numericValue = extractNumericValue(value);
    if (numericValue !== null) {
      if (numericValue < range.min || numericValue > range.max) {
        return { valid: false, reason: `Value ${numericValue} outside range ${range.min}-${range.max}` };
      }
    }
  }

  // EnumValues validation
  if (rules.enumValues && typeof value === "string") {
    const enumValues = rules.enumValues as string[];
    if (!enumValues.includes(value.toLowerCase()) && !enumValues.includes(value)) {
      return { valid: false, reason: `Value must be one of: ${enumValues.join(", ")}` };
    }
  }

  // MinItems validation for arrays
  if (rules.minItems && Array.isArray(value)) {
    if (value.length < (rules.minItems as number)) {
      return { valid: false, reason: `Array needs at least ${rules.minItems} items` };
    }
  }

  // MustBeLessThan validation (cross-field)
  if (rules.mustBeLessThan && report && typeof value === "string") {
    const compareFieldPath = rules.mustBeLessThan as string;
    const compareValue = getNestedValue(report, compareFieldPath);
    if (compareValue && typeof compareValue === "string") {
      const thisNum = extractNumericValue(value);
      const compareNum = extractNumericValue(compareValue);
      if (thisNum !== null && compareNum !== null && thisNum >= compareNum) {
        return { valid: false, reason: `Value must be less than ${compareFieldPath}` };
      }
    }
  }

  return { valid: true };
}

// Extract numeric value from string (handles $1.2B, $500M, 15%, etc.)
function extractNumericValue(value: string): number | null {
  const cleanValue = value.replace(/[,$%]/g, "").trim();
  
  // Handle billions
  if (cleanValue.toLowerCase().includes("b")) {
    const num = parseFloat(cleanValue.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? null : num * 1_000_000_000;
  }
  
  // Handle millions
  if (cleanValue.toLowerCase().includes("m")) {
    const num = parseFloat(cleanValue.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? null : num * 1_000_000;
  }
  
  // Handle thousands
  if (cleanValue.toLowerCase().includes("k")) {
    const num = parseFloat(cleanValue.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? null : num * 1_000;
  }
  
  // Plain number
  const num = parseFloat(cleanValue.replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? null : num;
}

// Update report field in database
async function updateReportField(
  supabaseClient: any,
  reportId: string,
  fieldPath: string,
  value: unknown
): Promise<boolean> {
  try {
    const parts = fieldPath.split(".");
    const sectionName = parts[0];
    const nestedPath = parts.slice(1);
    
    const { data: currentReport, error: fetchError } = await supabaseClient
      .from("tb_pms_reports")
      .select("*")
      .eq("id", reportId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching current report:", fetchError);
      return false;
    }

    const currentSection = currentReport?.[sectionName];
    let sectionData: Record<string, unknown> = (typeof currentSection === 'object' && currentSection !== null) 
      ? { ...currentSection } 
      : {};
    
    if (nestedPath.length === 1) {
      sectionData[nestedPath[0]] = value;
    } else if (nestedPath.length === 2) {
      if (!sectionData[nestedPath[0]] || typeof sectionData[nestedPath[0]] !== 'object') {
        sectionData[nestedPath[0]] = {};
      }
      (sectionData[nestedPath[0]] as Record<string, unknown>)[nestedPath[1]] = value;
    } else if (nestedPath.length > 2) {
      let current = sectionData;
      for (let i = 0; i < nestedPath.length - 1; i++) {
        if (!current[nestedPath[i]] || typeof current[nestedPath[i]] !== 'object') {
          current[nestedPath[i]] = {};
        }
        current = current[nestedPath[i]] as Record<string, unknown>;
      }
      current[nestedPath[nestedPath.length - 1]] = value;
    }

    const { error: updateError } = await supabaseClient
      .from("tb_pms_reports")
      .update({ [sectionName]: sectionData, updated_at: new Date().toISOString() })
      .eq("id", reportId);

    if (updateError) {
      console.error("Error updating report:", updateError);
      return false;
    }

    console.log(`Successfully updated ${fieldPath} with value:`, value);
    return true;
  } catch (error) {
    console.error("Error in updateReportField:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: FallbackRequest = await req.json();
    console.log("Fallback request received:", request.fieldPath);

    // Validate required fields
    if (!request.wizardId || !request.reportId || !request.fieldPath) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: wizardId, reportId, fieldPath" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch wizard data
    const { data: wizard, error: wizardError } = await supabase
      .from("tb_pms_wizard")
      .select("*")
      .eq("id", request.wizardId)
      .single();

    if (wizardError || !wizard) {
      console.error("Wizard not found:", wizardError);
      return new Response(
        JSON.stringify({ success: false, error: "Wizard not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch report data
    const { data: report, error: reportError } = await supabase
      .from("tb_pms_reports")
      .select("*")
      .eq("id", request.reportId)
      .single();

    if (reportError) {
      console.error("Report fetch error:", reportError);
    }

    // Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(wizard as WizardData, report as ReportData | null, request);

    let retryCount = 0;
    let finalValue: unknown = null;
    let source: "perplexity" | "ai_estimation" | "static" = "static";
    let reasoning: string | undefined;

    // Try Perplexity with retries
    while (retryCount < MAX_RETRIES && finalValue === null) {
      console.log(`Attempting Perplexity call (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      
      const perplexityResult = await callPerplexity(
        systemPrompt,
        userPrompt + (retryCount > 0 ? `\n\nPrevious attempt failed validation. Please provide accurate data.` : ""),
        request.perplexitySearchType || "general"
      );

      if (perplexityResult?.content) {
        const parsedValue = parseValue(perplexityResult.content, request.expectedType);
        const validation = validateValue(parsedValue, request.validationRules, report as ReportData | null);

        if (validation.valid) {
          finalValue = parsedValue;
          source = "perplexity";
          reasoning = `Data sourced from Perplexity AI with ${perplexityResult.citations.length} citations`;
          console.log("Perplexity value validated successfully:", finalValue);
        } else {
          console.log(`Validation failed (attempt ${retryCount + 1}):`, validation.reason);
          retryCount++;
        }
      } else {
        console.log("Perplexity returned no content");
        retryCount++;
      }
    }

    // Fallback to Lovable AI if Perplexity failed
    if (finalValue === null) {
      console.log("Perplexity failed, trying Lovable AI estimation");
      
      const existingData = {
        opportunity: report?.opportunity_section || {},
        competitive: report?.competitive_analysis_section || {},
        icp: report?.icp_intelligence_section || {},
      };

      const aiResult = await callLovableAI(wizard as WizardData, request, existingData);
      
      if (aiResult) {
        const parsedValue = parseValue(aiResult, request.expectedType);
        const validation = validateValue(parsedValue, request.validationRules, report as ReportData | null);

        if (validation.valid) {
          finalValue = parsedValue;
          source = "ai_estimation";
          reasoning = "Estimated by AI based on industry benchmarks and report context";
          console.log("Lovable AI value accepted:", finalValue);
        } else {
          console.log("Lovable AI validation also failed:", validation.reason);
        }
      }
    }

    // If all else fails, use static fallback (don't persist)
    let persisted = false;
    if (finalValue !== null && source !== "static") {
      persisted = await updateReportField(supabase, request.reportId, request.fieldPath, finalValue);
    }

    const response: FallbackResponse = {
      success: finalValue !== null,
      value: finalValue,
      source,
      persisted,
      retryCount,
      reasoning,
    };

    console.log("Fallback response:", response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Smart fallback error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        source: "static",
        persisted: false,
        retryCount: 0
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
