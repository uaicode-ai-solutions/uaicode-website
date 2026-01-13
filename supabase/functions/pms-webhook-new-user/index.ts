import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("LOGIN_NEWUSER_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("LOGIN_NEWUSER_WEBHOOK_ID not configured");
  }
  // Support both full URL or just the webhook ID
  return webhookId.startsWith("http") 
    ? webhookId 
    : `https://uaicode-n8n.ax5vln.easypanel.host/webhook/${webhookId}`;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestPayload {
  auth_user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { auth_user_id }: RequestPayload = await req.json();
    
    console.log("=== WEBHOOK NEW USER ===");
    console.log("Auth User ID:", auth_user_id);

    if (!auth_user_id) {
      throw new Error("auth_user_id is required");
    }

    // Create Supabase admin client to fetch user data
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Fetch complete user data from tb_pms_users
    const { data: pmsUser, error: fetchError } = await supabaseAdmin
      .from("tb_pms_users")
      .select("*")
      .eq("auth_user_id", auth_user_id)
      .single();

    if (fetchError) {
      console.error("Error fetching PMS user:", fetchError);
      throw new Error(`Failed to fetch user data: ${fetchError.message}`);
    }

    if (!pmsUser) {
      throw new Error("User not found in tb_pms_users");
    }

    console.log("PMS User found:", JSON.stringify(pmsUser));

    // Prepare webhook payload with all user data
    const webhookPayload = {
      event: "user.created",
      timestamp: new Date().toISOString(),
      data: {
        id: pmsUser.id,
        auth_user_id: pmsUser.auth_user_id,
        email: pmsUser.email,
        full_name: pmsUser.full_name,
        username: pmsUser.username,
        phone: pmsUser.phone,
        linkedin_profile: pmsUser.linkedin_profile,
        user_role: pmsUser.user_role,
        user_role_other: pmsUser.user_role_other,
        created_at: pmsUser.created_at,
        updated_at: pmsUser.updated_at
      }
    };

    const webhookUrl = getWebhookUrl();
    console.log("Sending to webhook:", webhookUrl);
    console.log("Payload:", JSON.stringify(webhookPayload));

    // Call n8n webhook
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
