import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRODUCTION_URL = "https://uaicodewebsite.lovable.app";

const generateShareToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let wizard_id: string | undefined;

    // Parse body robustly - handle empty body, query params, etc.
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const body = await req.text();
        if (body && body.trim().length > 0) {
          const parsed = JSON.parse(body);
          wizard_id = parsed.wizard_id;
        }
      } catch (parseErr) {
        console.warn("⚠️ Failed to parse JSON body:", parseErr);
      }
    } else {
      // Try reading as text anyway (n8n sometimes sends JSON without correct content-type)
      try {
        const body = await req.text();
        if (body && body.trim().length > 0) {
          const parsed = JSON.parse(body);
          wizard_id = parsed.wizard_id;
        }
      } catch {
        // ignore parse errors for non-JSON content types
      }
    }

    // Fallback: check query params
    if (!wizard_id) {
      const url = new URL(req.url);
      wizard_id = url.searchParams.get("wizard_id") || undefined;
    }

    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required. Send as JSON body or query param." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🔧 Finalizing report for wizard: ${wizard_id}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch wizard data and marketing tiers in parallel
    const [wizardResult, marketingResult] = await Promise.all([
      supabase
        .from("tb_pms_lp_wizard")
        .select("id, saas_name, industry, description, saas_type, geographic_region, email, full_name")
        .eq("id", wizard_id)
        .single(),
      supabase
        .from("tb_pms_mkt_tier")
        .select("service_id, service_name, uaicode_price_cents, traditional_min_cents, traditional_max_cents")
        .eq("is_active", true),
    ]);

    if (wizardResult.error) {
      console.error("❌ Failed to fetch wizard data:", wizardResult.error);
    }
    if (marketingResult.error) {
      console.error("❌ Failed to fetch marketing data:", marketingResult.error);
    }

    // Calculate marketing snapshot
    const mktTiers = marketingResult.data || [];
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

    // Generate share token
    const shareToken = generateShareToken();
    const shareUrl = `${PRODUCTION_URL}/planningmysaas/shared/${shareToken}`;

    // Update report
    const { error: updateError } = await supabase
      .from("tb_pms_reports")
      .update({
        status: "completed",
        share_token: shareToken,
        share_url: shareUrl,
        share_enabled: true,
        share_created_at: new Date().toISOString(),
        wizard_snapshot: wizardResult.data || null,
        marketing_snapshot: marketingSnapshot,
      })
      .eq("wizard_id", wizard_id);

    if (updateError) {
      console.error("❌ Failed to update report:", updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update report: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ Report finalized. Share URL: ${shareUrl}`);

    return new Response(
      JSON.stringify({ success: true, share_url: shareUrl, wizard_id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Finalize error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
