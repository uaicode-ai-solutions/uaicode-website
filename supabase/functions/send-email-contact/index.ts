import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  console.log("=== SEND EMAIL CONTACT STARTED ===");
  console.log("Method:", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookId = Deno.env.get("EMAIL_CONTACT_WEBHOOK_ID");
    if (!webhookId) {
      console.error("EMAIL_CONTACT_WEBHOOK_ID not configured");
      throw new Error("Webhook ID not configured");
    }

    const formData = await req.json();
    console.log("Form data received:", JSON.stringify(formData));
    
    const webhookUrl = webhookId.startsWith("http") 
      ? webhookId 
      : `https://uaicode-n8n.ax5vln.easypanel.host/webhook/${webhookId}`;
    
    console.log("Calling webhook:", webhookUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("Timeout triggered - aborting fetch");
      controller.abort();
    }, 15000);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log("Webhook response status:", response.status);
      
      const rawText = await response.text();
      console.log("Webhook raw response:", rawText.substring(0, 500));
      
      let responseData = { title: "Success", message: "Message sent successfully" };
      
      if (rawText.trim()) {
        try {
          responseData = JSON.parse(rawText);
        } catch {
          console.log("Failed to parse as JSON, using default response");
        }
      }
      
      console.log("=== SEND EMAIL CONTACT SUCCESS ===");
      
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("Webhook timeout after 15 seconds");
        throw new Error('Request timeout - please try again');
      }
      
      throw fetchError;
    }
    
  } catch (error: unknown) {
    console.error("=== SEND EMAIL CONTACT ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : error);
    
    return new Response(
      JSON.stringify({ 
        title: "Error", 
        message: error instanceof Error ? error.message : "Failed to send message" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
