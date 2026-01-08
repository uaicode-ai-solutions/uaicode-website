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
    
    const webhookUrl = webhookId.startsWith("http") 
      ? webhookId 
      : `https://uaicode-n8n.ax5vln.easypanel.host/webhook/${webhookId}`;
    
    console.log("Sending form data to webhook:", webhookUrl);
    console.log("Form data:", JSON.stringify(formData));
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: "schedule_contact_form",
      }),
    });

    // Tratamento robusto de resposta
    let responseData;
    const contentType = response.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      const textResponse = await response.text();
      console.log("Non-JSON response:", textResponse);
      responseData = {
        title: response.ok ? "Success" : "Warning",
        message: response.ok 
          ? "Form submitted successfully" 
          : `Webhook processed with message: ${textResponse.substring(0, 100)}`
      };
    }
    
    console.log("Webhook response:", responseData);

    return new Response(JSON.stringify({
      title: responseData.title || "Success",
      message: responseData.message || "Form submitted successfully"
    }), {
      status: 200,
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
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
