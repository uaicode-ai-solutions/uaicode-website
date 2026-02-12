import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("N8N_PMS_GENERATE_LEADS_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("N8N_PMS_GENERATE_LEADS_WEBHOOK_ID not configured");
  }
  return webhookId.startsWith("http")
    ? webhookId
    : `https://n8n.uaicode.dev/webhook/${webhookId}`;
};

interface RequestPayload {
  wizard_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wizard_id }: RequestPayload = await req.json();

    console.log("=== WEBHOOK NEW LEADS ===");
    console.log("Wizard ID:", wizard_id);

    if (!wizard_id) {
      throw new Error("wizard_id is required");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: wizardData, error: fetchError } = await supabaseAdmin
      .from("tb_pms_wizard")
      .select("client_email, client_full_name")
      .eq("id", wizard_id)
      .single();

    if (fetchError) {
      console.error("Error fetching wizard:", fetchError);
      throw new Error(`Failed to fetch wizard data: ${fetchError.message}`);
    }

    if (!wizardData) {
      throw new Error("Wizard not found in tb_pms_wizard");
    }

    console.log("Wizard data found:", JSON.stringify(wizardData));

    const webhookPayload = {
      event: "wizard.created",
      wizard_id,
      client_email: wizardData.client_email,
      client_full_name: wizardData.client_full_name,
      timestamp: new Date().toISOString(),
    };

    const webhookUrl = getWebhookUrl();
    console.log("Sending to webhook:", webhookUrl);
    console.log("Payload:", JSON.stringify(webhookPayload));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    const responseText = await response.text();
    console.log("n8n Response Status:", response.status);
    console.log("n8n Response:", responseText);

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} - ${responseText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error calling webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
