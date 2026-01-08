import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  console.log("=== EDGE FUNCTION STARTED ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  if (req.method === "OPTIONS") {
    console.log("Returning CORS preflight response");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookId = Deno.env.get("WEB_FORM_WEBHOOK_ID");
    if (!webhookId) {
      console.error("WEB_FORM_WEBHOOK_ID not configured");
      throw new Error("Webhook ID not configured");
    }

    console.log("Reading request body...");
    const formData = await req.json();
    console.log("Form data received:", JSON.stringify(formData));
    
    const webhookUrl = webhookId.startsWith("http") 
      ? webhookId 
      : `https://uaicode-n8n.ax5vln.easypanel.host/webhook/${webhookId}`;
    
    console.log("Calling webhook:", webhookUrl);
    
    // Add 15 second timeout
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
          source: "schedule_contact_form",
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log("Webhook response status:", response.status);
      
      // Read response as text first
      const rawText = await response.text();
      console.log("Webhook raw response:", rawText.substring(0, 500));
      
      let responseData;
      if (rawText.trim()) {
        try {
          responseData = JSON.parse(rawText);
          console.log("Parsed JSON successfully");
        } catch (parseError) {
          console.log("Failed to parse as JSON, using default response");
          responseData = {
            title: response.ok ? "Success" : "Warning",
            message: response.ok 
              ? "Form submitted successfully" 
              : `Webhook returned: ${rawText.substring(0, 100)}`
          };
        }
      } else {
        console.log("Empty response body, using default response");
        responseData = {
          title: response.ok ? "Success" : "Error",
          message: response.ok 
            ? "Form submitted successfully" 
            : "Webhook returned empty response"
        };
      }
      
      console.log("=== EDGE FUNCTION SUCCESS ===");
      
      return new Response(JSON.stringify({
        title: responseData.title || "Success",
        message: responseData.message || "Form submitted successfully"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("Webhook timeout after 15 seconds");
        throw new Error('Request timeout - please try again');
      }
      
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }
    
  } catch (error: unknown) {
    console.error("=== EDGE FUNCTION ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : error);
    
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
