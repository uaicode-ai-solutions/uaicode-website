import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Production URL for generating share links
const PRODUCTION_URL = "https://uaicodewebsite.lovable.app";

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

// Generate cryptographically secure share token (32 hex chars)
const generateShareToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};

// Sequential tools 1→12
const TOOLS_SEQUENCE = [
  { step: 1, tool_name: "Create_Report_Row", label: "Initialize Report" },
  { step: 2, tool_name: "Call_Get_Investment_Tool_", label: "Investment Analysis" },
  { step: 3, tool_name: "Call_Get_Benchmark_Tool_", label: "Market Benchmarks" },
  { step: 4, tool_name: "Call_Get_Competitors_Tool_", label: "Competitor Research" },
  { step: 5, tool_name: "Call_Get_Opportunity_Tool_", label: "Market Opportunity" },
  { step: 6, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy" },
  { step: 7, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling" },
  { step: 8, tool_name: "Call_Get_PaidMedia_Tool_", label: "Paid Media Analysis" },
  { step: 9, tool_name: "Call_Get_Growth_Tool_", label: "Growth Projections" },
  { step: 10, tool_name: "Call_Get_Summary_Tool_", label: "Executive Summary" },
  { step: 11, tool_name: "Call_Get_Hero_Score_Tool_", label: "Final Scoring" },
  { step: 12, tool_name: "Call_Get_Business_Plan_Tool_", label: "Business Plan" },
];

// Graceful shutdown detection
let shutdownRequested = false;

addEventListener('beforeunload', () => {
  shutdownRequested = true;
  console.warn('⚠️ Worker shutdown requested, attempting graceful cleanup...');
});

// Background task: Process all report steps sequentially

// Background task: Process all report steps sequentially
async function processReportSteps(
  wizard_id: string, 
  resume_from_step?: number
): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const webhookUrl = getWebhookUrl();
  const startIndex = resume_from_step ? resume_from_step - 1 : 0;

  console.log(`🚀 Background task started for wizard: ${wizard_id}, from step: ${startIndex + 1}`);

  try {
    for (let i = startIndex; i < TOOLS_SEQUENCE.length; i++) {
      // Check for graceful shutdown before each step
      if (shutdownRequested) {
        console.error('❌ Worker shutting down, marking as interrupted');
        await supabase
          .from("tb_pms_reports")
          .update({ status: "Generation interrupted - Please retry" })
          .eq("wizard_id", wizard_id);
        return;
      }

      const tool = TOOLS_SEQUENCE[i];
      const statusInProgress = `Step ${tool.step} ${tool.label} - In Progress`;
      const statusCompleted = `Step ${tool.step} ${tool.label} - Completed`;
      const statusFailed = `Step ${tool.step} ${tool.label} - Fail`;

      // Update to In Progress
      await supabase
        .from("tb_pms_reports")
        .update({ status: statusInProgress.trim() })
        .eq("wizard_id", wizard_id);

      console.log(`📍 ${statusInProgress}`);

      try {
        // AbortController with 150s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 150000);

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool_name: tool.tool_name,
            wizard_id: wizard_id
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Consume response body
        await response.text();

        // Update to Completed
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusCompleted.trim() })
          .eq("wizard_id", wizard_id);

        console.log(`✅ ${statusCompleted}`);

      } catch (error: unknown) {
        const isTimeout = error instanceof Error && error.name === 'AbortError';
        const errorMessage = isTimeout 
          ? 'Request timeout (150s exceeded)' 
          : String(error);
        
        console.error(`❌ ${statusFailed}:`, errorMessage);
        
        // Update to Fail
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusFailed.trim() })
          .eq("wizard_id", wizard_id);

        // Stop processing on failure
        return;
      }
    }

    // =============================================
    // ALL STEPS COMPLETED - Generate Snapshots for Sharing
    // =============================================
    console.log(`📝 Generating snapshots for wizard: ${wizard_id}`);

    // 1. Fetch wizard data for snapshot
    const { data: wizardData, error: wizardError } = await supabase
      .from("tb_pms_wizard")
      .select("id, saas_name, market_type, industry, description")
      .eq("id", wizard_id)
      .single();

    if (wizardError) {
      console.error("❌ Failed to fetch wizard data:", wizardError);
    }

    // 2. Fetch marketing tier data for bundle calculation
    const { data: marketingData, error: mktError } = await supabase
      .from("tb_pms_mkt_tier")
      .select("service_id, service_name, uaicode_price_cents, traditional_min_cents, traditional_max_cents")
      .eq("is_active", true);

    if (mktError) {
      console.error("❌ Failed to fetch marketing data:", mktError);
    }

    // 3. Calculate marketing totals snapshot
    const mktTiers = marketingData || [];
    const uaicodeTotal = mktTiers.reduce((sum, t) => sum + (t.uaicode_price_cents || 0), 0);
    const traditionalMinTotal = mktTiers.reduce((sum, t) => sum + (t.traditional_min_cents || 0), 0);
    const traditionalMaxTotal = mktTiers.reduce((sum, t) => sum + (t.traditional_max_cents || 0), 0);
    
    const savingsMinCents = traditionalMinTotal - uaicodeTotal;
    const savingsMaxCents = traditionalMaxTotal - uaicodeTotal;
    const savingsPercentMin = traditionalMinTotal > 0 ? Math.round((savingsMinCents / traditionalMinTotal) * 100) : 0;
    const savingsPercentMax = traditionalMaxTotal > 0 ? Math.round((savingsMaxCents / traditionalMaxTotal) * 100) : 0;

    const marketingSnapshot = {
      uaicodeTotal,
      traditionalMinTotal,
      traditionalMaxTotal,
      savingsMinCents,
      savingsMaxCents,
      savingsPercentMin,
      savingsPercentMax,
      annualSavingsMin: savingsMinCents * 12,
      annualSavingsMax: savingsMaxCents * 12,
    };

    console.log(`✅ Marketing snapshot calculated: uaicodeTotal=${uaicodeTotal}, traditionalMax=${traditionalMaxTotal}`);

    // 4. Generate share token and save everything
    const shareToken = generateShareToken();
    const shareUrl = `${PRODUCTION_URL}/planningmysaas/shared/${shareToken}`;

    await supabase
      .from("tb_pms_reports")
      .update({ 
        status: "completed",
        share_token: shareToken,
        share_url: shareUrl,
        share_enabled: true,
        share_created_at: new Date().toISOString(),
        // NEW: Save snapshots for public sharing
        wizard_snapshot: wizardData,
        marketing_snapshot: marketingSnapshot,
      })
      .eq("wizard_id", wizard_id);

    console.log(`🔗 Share URL generated: ${shareUrl}`);
    console.log(`🎉 Report completed for wizard: ${wizard_id}`);

  } catch (error) {
    console.error("❌ Background task error:", error);
    // Update to generic fail status
    await supabase
      .from("tb_pms_reports")
      .update({ status: "Generation Failed" })
      .eq("wizard_id", wizard_id);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wizard_id, resume_from_step } = await req.json();
    
    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🚀 Starting orchestration for wizard: ${wizard_id}, resume_from: ${resume_from_step || 'start'}`);

    // Use EdgeRuntime.waitUntil to process steps in background
    // This allows the HTTP response to return immediately while processing continues
    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    EdgeRuntime.waitUntil(
      processReportSteps(wizard_id, resume_from_step)
    );

    // Return immediately with 202 Accepted
    return new Response(
      JSON.stringify({ 
        success: true, 
        wizard_id,
        message: "Processing started in background" 
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
