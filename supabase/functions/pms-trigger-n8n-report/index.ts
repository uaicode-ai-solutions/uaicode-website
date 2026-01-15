import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Declare EdgeRuntime for background processing
declare const EdgeRuntime: { waitUntil: (promise: Promise<unknown>) => void };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processN8nWebhook(
  supabase: any,
  reportId: string,
  webhookUrl: string,
  payload: Record<string, unknown>
): Promise<void> {
  console.log(`📤 [Background] Sending payload to n8n webhook for report ${reportId}...`);

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`📥 [Background] n8n response status: ${n8nResponse.status}`);

    if (n8nResponse.ok) {
      const { error: completeError } = await supabase
        .from("tb_pms_reports")
        .update({ status: "completed" })
        .eq("id", reportId);

      if (completeError) {
        console.error("⚠️ [Background] Failed to update status to completed:", completeError);
      } else {
        console.log(`✅ [Background] Report ${reportId} marked as completed`);
      }
    } else {
      const errorText = await n8nResponse.text();
      console.error(`❌ [Background] n8n webhook failed: ${n8nResponse.status} - ${errorText}`);

      await supabase
        .from("tb_pms_reports")
        .update({ status: "failed" })
        .eq("id", reportId);
    }
  } catch (webhookError) {
    console.error("❌ [Background] Failed to call n8n webhook:", webhookError);

    await supabase
      .from("tb_pms_reports")
      .update({ status: "failed" })
      .eq("id", reportId);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wizard_id } = await req.json();

    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🚀 Triggering n8n report generation for wizard: ${wizard_id}`);

    // Initialize Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch wizard data
    const { data: wizard, error: wizardError } = await supabase
      .from("tb_pms_wizard")
      .select("*")
      .eq("id", wizard_id)
      .single();

    if (wizardError || !wizard) {
      console.error("❌ Wizard not found:", wizardError);
      return new Response(
        JSON.stringify({ error: "Wizard not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from("tb_pms_users")
      .select("*")
      .eq("id", wizard.user_id)
      .single();

    if (userError || !user) {
      console.error("❌ User not found:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new report entry in tb_pms_reports with status 'pending'
    const { data: report, error: reportError } = await supabase
      .from("tb_pms_reports")
      .insert({
        wizard_id: wizard_id,
        status: "pending",
      })
      .select()
      .single();

    if (reportError || !report) {
      console.error("❌ Failed to create report:", reportError);
      return new Response(
        JSON.stringify({ error: "Failed to create report" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📝 Created report entry: ${report.id}`);

    // Update report status to 'processing'
    const { error: updateError } = await supabase
      .from("tb_pms_reports")
      .update({ status: "processing" })
      .eq("id", report.id);

    if (updateError) {
      console.error("⚠️ Failed to update status to processing:", updateError);
    }

    // Get webhook URL from secret
    const webhookUrl = Deno.env.get("REPORT_N8N_MCP_WEBHOOK_ID");
    
    if (!webhookUrl) {
      console.error("❌ REPORT_N8N_MCP_WEBHOOK_ID secret not configured");
      
      // Update report status to failed
      await supabase
        .from("tb_pms_reports")
        .update({ status: "failed" })
        .eq("id", report.id);
        
      return new Response(
        JSON.stringify({ error: "Webhook URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare payload for n8n
    const payload = {
      event: "report.regenerate",
      timestamp: new Date().toISOString(),
      report_id: report.id,
      wizard: {
        id: wizard.id,
        saas_name: wizard.saas_name,
        saas_logo_url: wizard.saas_logo_url,
        description: wizard.description,
        product_stage: wizard.product_stage,
        saas_type: wizard.saas_type,
        saas_type_other: wizard.saas_type_other,
        industry: wizard.industry,
        industry_other: wizard.industry_other,
        customer_types: wizard.customer_types,
        market_size: wizard.market_size,
        target_audience: wizard.target_audience,
        market_type: wizard.market_type,
        selected_features: wizard.selected_features,
        selected_tier: wizard.selected_tier,
        goal: wizard.goal,
        goal_other: wizard.goal_other,
        challenge: wizard.challenge,
        budget: wizard.budget,
        timeline: wizard.timeline,
        created_at: wizard.created_at,
      },
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        linkedin_profile: user.linkedin_profile,
        user_role: user.user_role,
        user_role_other: user.user_role_other,
      },
    };

    // Process n8n webhook in background using EdgeRuntime.waitUntil
    EdgeRuntime.waitUntil(
      processN8nWebhook(supabase, report.id, webhookUrl, payload)
    );

    console.log(`🚀 Report ${report.id} processing started in background`);

    // Return immediately to frontend
    return new Response(
      JSON.stringify({ 
        success: true, 
        report_id: report.id,
        status: "processing",
        message: "Report generation started" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error in pms-trigger-n8n-report:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
