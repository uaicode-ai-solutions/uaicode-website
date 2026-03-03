import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const getWebhookUrl = (): string => {
  const webhookSecret = Deno.env.get("WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT");
  if (!webhookSecret) {
    throw new Error("WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT not configured");
  }

  if (webhookSecret.startsWith("http")) {
    return webhookSecret;
  }

  if (webhookSecret.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(webhookSecret);

      if (parsed.pinData) {
        for (const nodeData of Object.values(parsed.pinData)) {
          if (Array.isArray(nodeData) && (nodeData as any[])[0]?.webhookUrl) {
            return (nodeData as any[])[0].webhookUrl;
          }
        }
      }

      if (parsed.nodes) {
        for (const node of parsed.nodes) {
          if (node.type === "n8n-nodes-base.webhook" && node.parameters?.path) {
            return `https://n8n.uaicode.dev/webhook/${node.parameters.path}`;
          }
        }
      }

      throw new Error("Could not extract webhook URL from JSON");
    } catch (e) {
      throw new Error(`Failed to parse webhook secret JSON: ${e}`);
    }
  }

  return `https://n8n.uaicode.dev/webhook/${webhookSecret}`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wizard_id, report_id } = await req.json();

    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Reset status to "processing" using service role (bypasses RLS)
    if (report_id) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { error: updateError } = await supabaseAdmin
        .from("tb_pms_reports")
        .update({ status: "processing" })
        .eq("id", report_id);
      if (updateError) {
        console.error("❌ Failed to reset status:", updateError.message);
      } else {
        console.log(`✅ Status reset to processing for report: ${report_id}`);
      }
    }

    const webhookUrl = getWebhookUrl();
    console.log(`🚀 Triggering n8n for wizard: ${wizard_id} → ${webhookUrl}`);

    // Fire-and-forget: n8n controls the entire flow
    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    EdgeRuntime.waitUntil(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizard_id }),
      })
        .then((res) => console.log(`✅ n8n responded: ${res.status}`))
        .catch((err) => console.error(`❌ n8n call failed:`, String(err)))
    );

    return new Response(
      JSON.stringify({
        success: true,
        wizard_id,
        message: "LP Report orchestration triggered",
      }),
      { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Orchestration error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
