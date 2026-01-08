import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookId = Deno.env.get("WEB_FORM_WEBHOOK_ID");
    if (!webhookId) {
      throw new Error("Webhook ID not configured");
    }

    const formData = await req.json();
    
    // Detecta se é URL completa ou apenas o ID
    const webhookUrl = webhookId.startsWith("http") 
      ? webhookId 
      : `https://uaicode-n8n.ax5vln.easypanel.host/webhook/${webhookId}`;
    
    console.log("Sending form data to webhook:", webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: "schedule_contact_form",
      }),
    });

    const responseData = await response.json();
    
    console.log("Webhook response:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: response.ok ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to submit form";
    return new Response(
      JSON.stringify({ 
        title: "Error", 
        message: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
