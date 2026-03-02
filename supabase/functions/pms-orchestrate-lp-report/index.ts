import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRODUCTION_URL = "https://uaicodewebsite.lovable.app";

const getWebhookUrl = (): string => {
  const webhookSecret = Deno.env.get("WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT");
  if (!webhookSecret) {
    throw new Error("WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT not configured");
  }

  // Direct URL
  if (webhookSecret.startsWith("http")) {
    return webhookSecret;
  }

  // JSON export from n8n
  if (webhookSecret.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(webhookSecret);

      // Try pinData first
      if (parsed.pinData) {
        for (const nodeData of Object.values(parsed.pinData)) {
          if (Array.isArray(nodeData) && (nodeData as any[])[0]?.webhookUrl) {
            return (nodeData as any[])[0].webhookUrl;
          }
        }
      }

      // Try nodes
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

  // Plain path ID
  return `https://n8n.uaicode.dev/webhook/${webhookSecret}`;
};

const generateShareToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};

const TOOLS_SEQUENCE = [
  { step: 1, tool_name: "call_enrich_tb_pms_lp_wizard", label: "Enrich Lead Data" },
  { step: 2, tool_name: "call_new_report_requested", label: "Initialize Report" },
  { step: 3, tool_name: "call_create_new_report", label: "Create Report" },
  { step: 4, tool_name: "call_create_mvp_complexity", label: "MVP Complexity" },
  { step: 5, tool_name: "call_create_mvp_investment", label: "Investment Analysis" },
  { step: 6, tool_name: "call_get_mvp_benchmark", label: "Market Benchmarks" },
  { step: 7, tool_name: "call_get_mvp_competitors", label: "Competitor Research" },
  { step: 8, tool_name: "call_get_mvp_opportunity", label: "Market Opportunity" },
  { step: 9, tool_name: "call_get_mvp_price_intelligence", label: "Pricing Strategy" },
  { step: 10, tool_name: "call_get_mvp_icp_intelligence", label: "Customer Profiling" },
  { step: 11, tool_name: "call_get_mvp_paid_media", label: "Paid Media Analysis" },
  { step: 12, tool_name: "call_get_mvp_growth_intelligence", label: "Growth Projections" },
  { step: 13, tool_name: "call_get_mvp_summary", label: "Executive Summary" },
  { step: 14, tool_name: "call_get_mvp_score", label: "Final Scoring" },
  { step: 15, tool_name: "call_get_mvp_business_plan", label: "Business Plan" },
];

let shutdownRequested = false;

addEventListener("beforeunload", () => {
  shutdownRequested = true;
  console.warn("⚠️ Worker shutdown requested, attempting graceful cleanup...");
});

async function processReportSteps(wizard_id: string): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const webhookUrl = getWebhookUrl();

  console.log(`🚀 LP Report background task started for wizard: ${wizard_id}`);

  try {
    for (let i = 0; i < TOOLS_SEQUENCE.length; i++) {
      if (shutdownRequested) {
        console.error("❌ Worker shutting down, marking as interrupted");
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

      // Steps 1-2 run before report row exists (created at step 3)
      // Status updates will silently fail for those steps
      const { error: updateError } = await supabase
        .from("tb_pms_reports")
        .update({ status: statusInProgress.trim() })
        .eq("wizard_id", wizard_id);

      if (updateError && tool.step <= 2) {
        console.log(`ℹ️ Status update skipped for step ${tool.step} (report row not yet created)`);
      }

      console.log(`📍 ${statusInProgress}`);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 150000);

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool_name: tool.tool_name,
            wizard_id: wizard_id,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const responseBody = await response.text();

        // Log response body for debugging
        console.log(`📦 Step ${tool.step} response (${responseBody.length} chars): ${responseBody.substring(0, 200)}`);

        // Warning if response body suggests an error despite HTTP 200
        if (responseBody && /error|fail|not.found/i.test(responseBody)) {
          console.warn(`⚠️ Step ${tool.step} returned 200 but body suggests error: ${responseBody.substring(0, 300)}`);
        }

        await supabase
          .from("tb_pms_reports")
          .update({ status: statusCompleted.trim() })
          .eq("wizard_id", wizard_id);

        console.log(`✅ ${statusCompleted}`);

        // Delay between steps to allow n8n to finish writing to Supabase
        if (i < TOOLS_SEQUENCE.length - 1) {
          console.log(`⏳ Waiting 3s before next step...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error: unknown) {
        const isTimeout = error instanceof Error && error.name === "AbortError";
        const errorMessage = isTimeout
          ? "Request timeout (150s exceeded)"
          : String(error);

        console.error(`❌ ${statusFailed}:`, errorMessage);

        await supabase
          .from("tb_pms_reports")
          .update({ status: statusFailed.trim() })
          .eq("wizard_id", wizard_id);

        return;
      }
    }

    // =============================================
    // ALL STEPS COMPLETED - Generate Snapshots
    // =============================================
    console.log(`📝 Generating snapshots for wizard: ${wizard_id}`);

    // 1. Fetch wizard data from tb_pms_lp_wizard (NOT tb_pms_wizard)
    const { data: wizardData, error: wizardError } = await supabase
      .from("tb_pms_lp_wizard")
      .select("id, saas_name, industry, description, saas_type, geographic_region, role, email, full_name")
      .eq("id", wizard_id)
      .single();

    if (wizardError) {
      console.error("❌ Failed to fetch wizard data:", wizardError);
    }

    // 2. Fetch marketing tier data
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
        wizard_snapshot: wizardData,
        marketing_snapshot: marketingSnapshot,
      })
      .eq("wizard_id", wizard_id);

    console.log(`🔗 Share URL generated: ${shareUrl}`);
    console.log(`🎉 LP Report completed for wizard: ${wizard_id}`);
  } catch (error) {
    console.error("❌ Background task error:", error);
    await supabase
      .from("tb_pms_reports")
      .update({ status: "Generation Failed" })
      .eq("wizard_id", wizard_id);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wizard_id } = await req.json();

    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🚀 Starting LP orchestration for wizard: ${wizard_id}`);

    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    EdgeRuntime.waitUntil(processReportSteps(wizard_id));

    return new Response(
      JSON.stringify({
        success: true,
        wizard_id,
        message: "LP Report processing started in background",
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
