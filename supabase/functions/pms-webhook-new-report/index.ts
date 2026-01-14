import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("REPORT_NEWREPORT_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("REPORT_NEWREPORT_WEBHOOK_ID not configured");
  }
  // Support both full URLs and just the webhook ID
  if (webhookId.startsWith("http")) {
    return webhookId;
  }
  return `https://n8n.uaicode.dev/webhook/${webhookId}`;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestPayload {
  report_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { report_id } = (await req.json()) as RequestPayload;

    if (!report_id) {
      return new Response(
        JSON.stringify({ error: "report_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch report data
    const { data: reportData, error: reportError } = await supabaseAdmin
      .from("tb_pms_reports")
      .select("*")
      .eq("id", report_id)
      .single();

    if (reportError || !reportData) {
      console.error("Error fetching report:", reportError);
      return new Response(
        JSON.stringify({ error: "Report not found", details: reportError?.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from("tb_pms_users")
      .select("*")
      .eq("id", reportData.user_id)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
    }

    // Prepare webhook payload
    const webhookPayload = {
      event: "report.created",
      timestamp: new Date().toISOString(),
      data: {
        report: {
          id: reportData.id,
          status: reportData.status,
          saas_name: reportData.saas_name,
          saas_logo_url: reportData.saas_logo_url,
          product_stage: reportData.product_stage,
          saas_type: reportData.saas_type,
          saas_type_other: reportData.saas_type_other,
          industry: reportData.industry,
          industry_other: reportData.industry_other,
          description: reportData.description,
          customer_types: reportData.customer_types,
          market_size: reportData.market_size,
          target_audience: reportData.target_audience,
          market_type: reportData.market_type,
          selected_features: reportData.selected_features,
          selected_tier: reportData.selected_tier,
          goal: reportData.goal,
          goal_other: reportData.goal_other,
          challenge: reportData.challenge,
          budget: reportData.budget,
          timeline: reportData.timeline,
          viability_score: reportData.viability_score,
          complexity_score: reportData.complexity_score,
          created_at: reportData.created_at,
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

    console.log("Sending webhook payload:", JSON.stringify(webhookPayload, null, 2));

    // Send to external webhook
    const webhookUrl = getWebhookUrl();
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("Webhook call failed:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "Webhook call failed", 
          status: webhookResponse.status,
          details: errorText 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Webhook sent successfully for report:", report_id);

    return new Response(
      JSON.stringify({ success: true, message: "Webhook sent successfully" }),
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
