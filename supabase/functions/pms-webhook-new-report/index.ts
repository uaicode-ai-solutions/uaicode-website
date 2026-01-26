import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface RequestPayload {
  wizard_id?: string;
  report_id?: string; // Legacy support
}

// Mapeamento de IDs técnicos para títulos legíveis
const SAAS_TYPE_TITLES: Record<string, string> = {
  crm: "CRM & Sales",
  project: "Project Management",
  ecommerce: "E-commerce",
  hr: "HR & Recruiting",
  finance: "Financial Management",
  marketing: "Marketing Automation",
  analytics: "Analytics & BI",
  communication: "Communication",
  support: "Customer Support",
  productivity: "Productivity",
  education: "Education & Learning",
  ai: "AI & Automation",
  security: "Cybersecurity & Compliance",
  devtools: "Developer Tools",
  platform: "Platform",
};

const INDUSTRY_TITLES: Record<string, string> = {
  healthcare: "Healthcare",
  education: "Education",
  finance: "Finance",
  realestate: "Real Estate",
  retail: "Retail",
  technology: "Technology",
  marketing: "Marketing",
  logistics: "Logistics & Supply Chain",
  hospitality: "Hospitality & Travel",
  manufacturing: "Manufacturing",
  legal: "Legal & Compliance",
};

const getSaasTypeTitle = (id: string | null, otherValue?: string | null): string => {
  if (!id) return "";
  if (id === "other" && otherValue) {
    return otherValue;
  }
  return SAAS_TYPE_TITLES[id] || id;
};

const getIndustryTitle = (id: string | null, otherValue?: string | null): string => {
  if (!id) return "";
  if (id === "other" && otherValue) {
    return otherValue;
  }
  return INDUSTRY_TITLES[id] || id;
};

const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("REPORT_NEWREPORT_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("REPORT_NEWREPORT_WEBHOOK_ID not configured");
  }
  if (webhookId.startsWith("http")) {
    return webhookId;
  }
  return `https://n8n.uaicode.dev/webhook/${webhookId}`;
};

const callInternalFunction = async (functionName: string, body: Record<string, unknown>): Promise<void> => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${functionName} failed: ${response.status} - ${errorText}`);
  }
};

const fetchWizardAndUserData = async (wizardId: string) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: wizardData, error: wizardError } = await supabaseAdmin
    .from("tb_pms_wizard")
    .select("*")
    .eq("id", wizardId)
    .single();

  if (wizardError || !wizardData) {
    throw new Error(`Wizard not found: ${wizardError?.message}`);
  }

  const { data: userData, error: userError } = await supabaseAdmin
    .from("tb_pms_users")
    .select("*")
    .eq("id", wizardData.user_id)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
  }

  return { wizardData, userData };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as RequestPayload;
    const wizardId = payload.wizard_id || payload.report_id; // Support both

    if (!wizardId) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing wizard:", wizardId);

    // Fetch wizard and user data
    const { wizardData, userData } = await fetchWizardAndUserData(wizardId);
    
    const webhookPayload = {
      event: "wizard.created",
      timestamp: new Date().toISOString(),
      data: {
        wizard: {
          id: wizardData.id,
          status: wizardData.status,
          saas_name: wizardData.saas_name,
          saas_logo_url: wizardData.saas_logo_url,
          product_stage: wizardData.product_stage,
          saas_type: getSaasTypeTitle(wizardData.saas_type, wizardData.saas_type_other),
          industry: getIndustryTitle(wizardData.industry, wizardData.industry_other),
          description: wizardData.description,
          customer_types: wizardData.customer_types,
          market_size: wizardData.market_size,
          target_audience: wizardData.target_audience,
          market_type: wizardData.market_type,
          geographic_region: wizardData.geographic_region,
          selected_features: wizardData.selected_features,
          selected_tier: wizardData.selected_tier,
          goal: wizardData.goal,
          goal_other: wizardData.goal_other,
          challenge: wizardData.challenge,
          budget: wizardData.budget,
          timeline: wizardData.timeline,
          created_at: wizardData.created_at,
        },
        user: userData ? {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          linkedin_profile: userData.linkedin_profile,
          user_role: userData.user_role,
          user_role_other: userData.user_role_other,
        } : null,
      },
    };

    // Send to n8n webhook only - n8n handles all report generation
    const webhookUrl = getWebhookUrl();
    console.log("Sending to n8n webhook:", webhookUrl);
    
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("N8N Webhook failed:", webhookResponse.status, errorText);
      throw new Error(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
    }

    console.log("N8N Webhook sent successfully for wizard:", wizardId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Report generation triggered via n8n"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in pms-webhook-new-report:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
