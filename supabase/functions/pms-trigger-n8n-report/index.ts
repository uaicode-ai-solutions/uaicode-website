import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

    console.log(`🚀 Triggering n8n workflow for wizard: ${wizard_id}`);

    // Get webhook URL from secret
    const webhookUrl = Deno.env.get("REPORT_N8N_MCP_WEBHOOK_ID");

    if (!webhookUrl) {
      console.error("❌ REPORT_N8N_MCP_WEBHOOK_ID not configured");
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fire-and-forget: call n8n webhook
    // n8n is now responsible for ALL operations:
    // - Fetching wizard and user data
    // - Calculating prices and investment breakdown
    // - Creating the report entry in tb_pms_reports
    // - Updating status to completed/failed
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "report.generate",
        timestamp: new Date().toISOString(),
        wizard_id: wizard_id
      }),
    }).catch(err => console.error("❌ Webhook call failed:", err));

    console.log(`✅ Webhook triggered for wizard: ${wizard_id}`);

    // Return immediately - n8n handles everything else
    return new Response(
      JSON.stringify({
        success: true,
        wizard_id: wizard_id,
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
