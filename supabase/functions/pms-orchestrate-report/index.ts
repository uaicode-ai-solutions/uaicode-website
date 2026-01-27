import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

// Sequential tools 1→11
const TOOLS_SEQUENCE = [
  { step: 1, tool_name: "Create_Report_Row", label: "Initialize Report" },
  { step: 2, tool_name: "Call_Get_Investment_Tool_", label: "Investment Analysis" },
  { step: 3, tool_name: "Call_Get_Benchmark_Tool_", label: "Market Benchmarks" },
  { step: 4, tool_name: "Call_Get_Competitors_Tool_", label: "Competitor Research" },
  { step: 5, tool_name: "Call_Get_Opportunity_Tool_", label: "Market Opportunity" },
  { step: 6, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling" },
  { step: 7, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy" },
  { step: 8, tool_name: "Call_Get_PaidMedia_Tool_", label: "Paid Media Analysis" },
  { step: 9, tool_name: "Call_Get_Growth_Tool_", label: "Growth Projections" },
  { step: 10, tool_name: "Call_Get_Summary_Tool_", label: "Executive Summary" },
  { step: 11, tool_name: "Call_Get_Hero_Score_Tool_", label: "Final Scoring" },
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const webhookUrl = getWebhookUrl();
    const { wizard_id, resume_from_step } = await req.json();
    
    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine start index (0-based)
    // resume_from_step is 1-based (Step 1 = index 0)
    const startIndex = resume_from_step ? resume_from_step - 1 : 0;
    
    console.log(`🚀 Starting orchestration for wizard: ${wizard_id}, from step: ${startIndex + 1}`);

    // Execute each tool in sequence starting from startIndex
    for (let i = startIndex; i < TOOLS_SEQUENCE.length; i++) {
      const tool = TOOLS_SEQUENCE[i];
      const statusInProgress = `Step ${tool.step} ${tool.label} - In Progress`;
      const statusCompleted = `Step ${tool.step} ${tool.label} - Completed`;
      const statusFailed = `Step ${tool.step} ${tool.label} - Fail`;

      // 1. Update status to "In Progress"
      await supabase
        .from("tb_pms_reports")
        .update({ status: statusInProgress.trim() })
        .eq("wizard_id", wizard_id);

      console.log(`📍 ${statusInProgress}`);

      try {
        // 2. Call n8n webhook with tool_name and wizard_id
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool_name: tool.tool_name,
            wizard_id: wizard_id
          }),
        });

        // 3. Check HTTP response
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Consume response body
        await response.text();

        // 4. Update status to "Completed"
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusCompleted.trim() })
          .eq("wizard_id", wizard_id);

        console.log(`✅ ${statusCompleted}`);

      } catch (error) {
        // 5. On failure, update status and stop execution
        console.error(`❌ ${statusFailed}:`, error);
        
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusFailed.trim() })
          .eq("wizard_id", wizard_id);

        return new Response(
          JSON.stringify({
            success: false,
            failedAt: tool.step,
            tool_name: tool.tool_name,
            error: String(error)
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // All steps completed successfully
    await supabase
      .from("tb_pms_reports")
      .update({ status: "completed" })
      .eq("wizard_id", wizard_id);

    console.log(`🎉 Report completed for wizard: ${wizard_id}`);

    return new Response(
      JSON.stringify({ success: true, wizard_id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Orchestration error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
