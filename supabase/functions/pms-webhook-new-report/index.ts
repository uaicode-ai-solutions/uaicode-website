import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestPayload {
  report_id: string;
}

const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("REPORT_NEWREPORT_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("REPORT_NEWREPORT_WEBHOOK_ID not configured");
  }
  if (webhookId.startsWith("http")) {
    return webhookId;
  }
  return `https://n8n.uaicode.dev/webhook/${webhookId}`;
};

const callInternalFunction = async (functionName: string, body: Record<string, unknown>): Promise<void> => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${functionName} failed: ${response.status} - ${errorText}`);
  }
};

const fetchReportAndUserData = async (reportId: string) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: reportData, error: reportError } = await supabaseAdmin
    .from("tb_pms_reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (reportError || !reportData) {
    throw new Error(`Report not found: ${reportError?.message}`);
  }

  const { data: userData, error: userError } = await supabaseAdmin
    .from("tb_pms_users")
    .select("*")
    .eq("id", reportData.user_id)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
  }

  return { reportData, userData };
};

const handler = async (req: Request): Promise<Response> => {
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

    console.log("Processing report:", report_id);

    // Execute BOTH calls in parallel, independently
    const results = await Promise.allSettled([
      // 1. N8N Webhook (external notification) - fire and forget
      (async () => {
        try {
          const { reportData, userData } = await fetchReportAndUserData(report_id);
          
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

          const webhookUrl = getWebhookUrl();
          const webhookResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(webhookPayload),
          });

          if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            throw new Error(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
          }

          console.log("N8N Webhook sent successfully for report:", report_id);
          return { success: true };
        } catch (error) {
          console.error("N8N Webhook failed (non-blocking):", error);
          throw error;
        }
      })(),

      // 2. Report Generation (main process) - must run regardless of webhook
      (async () => {
        try {
          console.log("Starting report generation for:", report_id);
          await callInternalFunction("pms-generate-report", { reportId: report_id });
          console.log("Report generation started successfully for:", report_id);
          return { success: true };
        } catch (error) {
          console.error("Report generation call failed:", error);
          throw error;
        }
      })()
    ]);

    const [webhookResult, generateResult] = results;
    
    console.log("Webhook N8N result:", webhookResult.status, webhookResult.status === "rejected" ? (webhookResult as PromiseRejectedResult).reason : "");
    console.log("Generate Report result:", generateResult.status, generateResult.status === "rejected" ? (generateResult as PromiseRejectedResult).reason : "");

    const generateSuccess = generateResult.status === "fulfilled";

    return new Response(
      JSON.stringify({ 
        success: generateSuccess, 
        webhook_status: webhookResult.status,
        generate_status: generateResult.status,
        message: generateSuccess 
          ? "Report generation started successfully" 
          : "Report generation may have issues, check logs"
      }),
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
