import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Declare EdgeRuntime for background processing
declare const EdgeRuntime: { waitUntil: (promise: Promise<unknown>) => void };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// ==========================================
// Feature Tier Helpers (duplicated from src/types/report.ts for Deno)
// ==========================================

const FEATURE_TIERS = {
  starter: ['auth', 'profiles', 'crud', 'reporting', 'notifications', 'admin', 'responsive', 'security'],
  growth: ['advancedAnalytics', 'apiIntegrations', 'payments', 'roles', 'search', 'fileUpload', 'realtime', 'workflows', 'advancedReporting', 'emailMarketing'],
  enterprise: ['ai', 'dataAnalytics', 'multiTenant', 'sso', 'customIntegrations', 'apiManagement', 'collaboration', 'automation', 'customReporting', 'support']
};

const INVESTMENT_PERCENTAGES = {
  front: 0.30,
  back: 0.28,
  integrations: 0.20,
  infra: 0.12,
  testing: 0.10
};

function countFeaturesByTier(selectedFeatures: string[]): { starter: number; growth: number; enterprise: number } {
  return {
    starter: selectedFeatures.filter(f => FEATURE_TIERS.starter.includes(f)).length,
    growth: selectedFeatures.filter(f => FEATURE_TIERS.growth.includes(f)).length,
    enterprise: selectedFeatures.filter(f => FEATURE_TIERS.enterprise.includes(f)).length,
  };
}

function determineMvpTier(selectedFeatures: string[]): 'starter' | 'growth' | 'enterprise' {
  const counts = countFeaturesByTier(selectedFeatures);
  if (counts.enterprise > 0) return 'enterprise';
  if (counts.growth > 0) return 'growth';
  return 'starter';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processN8nWebhook(
  supabase: any,
  reportId: string,
  webhookUrl: string,
  payload: Record<string, unknown>
): Promise<void> {
  console.log(`📤 [Background] Sending payload to n8n webhook for report ${reportId}...`);

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`📥 [Background] n8n response status: ${n8nResponse.status}`);

    if (n8nResponse.ok) {
      const { error: completeError } = await supabase
        .from("tb_pms_reports")
        .update({ status: "completed" })
        .eq("id", reportId);

      if (completeError) {
        console.error("⚠️ [Background] Failed to update status to completed:", completeError);
      } else {
        console.log(`✅ [Background] Report ${reportId} marked as completed`);
      }
    } else {
      const errorText = await n8nResponse.text();
      console.error(`❌ [Background] n8n webhook failed: ${n8nResponse.status} - ${errorText}`);

      await supabase
        .from("tb_pms_reports")
        .update({ status: "failed" })
        .eq("id", reportId);
    }
  } catch (webhookError) {
    console.error("❌ [Background] Failed to call n8n webhook:", webhookError);

    await supabase
      .from("tb_pms_reports")
      .update({ status: "failed" })
      .eq("id", reportId);
  }
}

serve(async (req) => {
  // Handle CORS preflight
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

    console.log(`🚀 Triggering n8n report generation for wizard: ${wizard_id}`);

    // Initialize Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch wizard data
    const { data: wizard, error: wizardError } = await supabase
      .from("tb_pms_wizard")
      .select("*")
      .eq("id", wizard_id)
      .single();

    if (wizardError || !wizard) {
      console.error("❌ Wizard not found:", wizardError);
      return new Response(
        JSON.stringify({ error: "Wizard not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from("tb_pms_users")
      .select("*")
      .eq("id", wizard.user_id)
      .single();

    if (userError || !user) {
      console.error("❌ User not found:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ==========================================
    // Calculate Tier and Investment Breakdown
    // ==========================================
    
    const selectedFeatures = wizard.selected_features || [];
    const correctTier = determineMvpTier(selectedFeatures);
    
    console.log(`📊 Calculated tier: ${correctTier} (wizard had: ${wizard.selected_tier})`);
    
    // Update wizard tier if different
    if (wizard.selected_tier !== correctTier) {
      const { error: tierUpdateError } = await supabase
        .from("tb_pms_wizard")
        .update({ selected_tier: correctTier })
        .eq("id", wizard_id);
      
      if (tierUpdateError) {
        console.error("⚠️ Failed to update wizard tier:", tierUpdateError);
      } else {
        console.log(`✅ Updated wizard tier to: ${correctTier}`);
      }
    }
    
    // Fetch tier pricing data
    const { data: tierData, error: tierError } = await supabase
      .from("tb_pms_mvp_tier")
      .select("*")
      .eq("tier_id", correctTier)
      .eq("is_active", true)
      .single();
    
    if (tierError) {
      console.error("⚠️ Failed to fetch tier data:", tierError);
    }
    
    // Calculate dynamic price based on features using proportional interpolation
    const counts = countFeaturesByTier(selectedFeatures);
    let calculatedPrice = 0;
    
    if (tierData) {
      // Use proportional interpolation based on selected features (same as frontend)
      const tierFeatures = FEATURE_TIERS[correctTier];
      const totalFeaturesInTier = tierFeatures.length;
      const selectedInTier = selectedFeatures.filter((f: string) => tierFeatures.includes(f)).length;
      
      if (selectedInTier <= 1) {
        calculatedPrice = tierData.min_price_cents;
      } else if (selectedInTier >= totalFeaturesInTier) {
        calculatedPrice = tierData.max_price_cents;
      } else {
        const ratio = (selectedInTier - 1) / (totalFeaturesInTier - 1);
        calculatedPrice = Math.round(tierData.min_price_cents + 
          (tierData.max_price_cents - tierData.min_price_cents) * ratio);
      }
    }
    
    console.log(`💰 Calculated price: ${calculatedPrice} cents (starter: ${counts.starter}, growth: ${counts.growth}, enterprise: ${counts.enterprise})`);
    
    // Calculate investment breakdown
    const investmentBreakdown = {
      one_payment: calculatedPrice,
      front: Math.round(calculatedPrice * INVESTMENT_PERCENTAGES.front),
      back: Math.round(calculatedPrice * INVESTMENT_PERCENTAGES.back),
      integrations: Math.round(calculatedPrice * INVESTMENT_PERCENTAGES.integrations),
      infra: Math.round(calculatedPrice * INVESTMENT_PERCENTAGES.infra),
      testing: Math.round(calculatedPrice * INVESTMENT_PERCENTAGES.testing),
    };
    
    console.log(`📦 Investment breakdown:`, investmentBreakdown);

    // ==========================================
    // Calculate Price Comparison Fields
    // ==========================================
    
    // Calculate TRADITIONAL price using proportional interpolation (same logic as Uaicode)
    let traditionalPrice = 0;
    
    if (tierData) {
      // Use proportional interpolation for traditional price
      const tierFeatures = FEATURE_TIERS[correctTier];
      const totalFeaturesInTier = tierFeatures.length;
      const selectedInTier = selectedFeatures.filter((f: string) => tierFeatures.includes(f)).length;
      
      if (selectedInTier <= 1) {
        traditionalPrice = tierData.traditional_min_cents;
      } else if (selectedInTier >= totalFeaturesInTier) {
        traditionalPrice = tierData.traditional_max_cents;
      } else {
        const ratio = (selectedInTier - 1) / (totalFeaturesInTier - 1);
        traditionalPrice = Math.round(tierData.traditional_min_cents + 
          (tierData.traditional_max_cents - tierData.traditional_min_cents) * ratio);
      }
    }
    
    console.log(`💰 Traditional price calculated: $${(traditionalPrice / 100).toLocaleString()} (${counts.starter}E + ${counts.growth}A + ${counts.enterprise}Ent features)`);
    
    // Calculate savings
    const savingsAmountCents = traditionalPrice - calculatedPrice;
    const savingsPercentage = traditionalPrice > 0 
      ? Math.round((savingsAmountCents / traditionalPrice) * 100)
      : 0;
    
    // Calculate marketing months ($5,000/month = 500000 cents)
    const MARKETING_MONTHLY_BUDGET_CENTS = 500000;
    const savingsMarketingMonths = Math.floor(savingsAmountCents / MARKETING_MONTHLY_BUDGET_CENTS);
    
    // Convert days to WEEKS for delivery times
    function formatDeliveryTimeInWeeks(minDays: number, maxDays: number): string {
      const minWeeks = Math.round(minDays / 7);
      const maxWeeks = Math.round(maxDays / 7);
      return `${minWeeks}-${maxWeeks} weeks`;
    }
    
    // Traditional: traditional_min_days/traditional_max_days → weeks
    const deliveryTimeTraditional = tierData 
      ? formatDeliveryTimeInWeeks(tierData.traditional_min_days, tierData.traditional_max_days)
      : "13-34 weeks";
    
    // Uaicode: min_days/max_days → weeks
    const deliveryTimeUaicode = tierData
      ? formatDeliveryTimeInWeeks(tierData.min_days, tierData.max_days)
      : "6-17 weeks";
    
    console.log(`💰 Price comparison: Traditional ${traditionalPrice} vs Uaicode ${calculatedPrice} (${savingsPercentage}% savings)`);
    console.log(`📅 Delivery times: Traditional ${deliveryTimeTraditional}, Uaicode ${deliveryTimeUaicode}`);

    // Create new report entry in tb_pms_reports with status 'pending' and all calculated values
    const { data: report, error: reportError } = await supabase
      .from("tb_pms_reports")
      .insert({
        wizard_id: wizard_id,
        status: "pending",
        // Investment breakdown
        investment_one_payment_cents: investmentBreakdown.one_payment,
        investment_front_cents: investmentBreakdown.front,
        investment_back_cents: investmentBreakdown.back,
        investment_integrations_cents: investmentBreakdown.integrations,
        investment_infra_cents: investmentBreakdown.infra,
        investment_testing_cents: investmentBreakdown.testing,
        // Price comparison fields
        investment_one_payment_cents_traditional: traditionalPrice,
        savings_percentage: savingsPercentage,
        savings_amount_cents: savingsAmountCents,
        savings_marketing_months: savingsMarketingMonths,
        delivery_time_traditional: deliveryTimeTraditional,
        delivery_time_uaicode: deliveryTimeUaicode,
      })
      .select()
      .single();

    if (reportError || !report) {
      console.error("❌ Failed to create report:", reportError);
      return new Response(
        JSON.stringify({ error: "Failed to create report" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📝 Created report entry: ${report.id} with investment values`);

    // Update report status to 'processing'
    const { error: updateError } = await supabase
      .from("tb_pms_reports")
      .update({ status: "processing" })
      .eq("id", report.id);

    if (updateError) {
      console.error("⚠️ Failed to update status to processing:", updateError);
    }

    // Get webhook URL from secret
    const webhookUrl = Deno.env.get("REPORT_N8N_MCP_WEBHOOK_ID");
    
    if (!webhookUrl) {
      console.error("❌ REPORT_N8N_MCP_WEBHOOK_ID secret not configured");
      
      // Update report status to failed
      await supabase
        .from("tb_pms_reports")
        .update({ status: "failed" })
        .eq("id", report.id);
        
      return new Response(
        JSON.stringify({ error: "Webhook URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare payload for n8n
    const payload = {
      event: "report.regenerate",
      timestamp: new Date().toISOString(),
      report_id: report.id,
      wizard: {
        id: wizard.id,
        saas_name: wizard.saas_name,
        saas_logo_url: wizard.saas_logo_url,
        description: wizard.description,
        product_stage: wizard.product_stage,
        saas_type: wizard.saas_type,
        saas_type_other: wizard.saas_type_other,
        industry: wizard.industry,
        industry_other: wizard.industry_other,
        customer_types: wizard.customer_types,
        market_size: wizard.market_size,
        target_audience: wizard.target_audience,
        market_type: wizard.market_type,
        selected_features: wizard.selected_features,
        selected_tier: wizard.selected_tier,
        goal: wizard.goal,
        goal_other: wizard.goal_other,
        challenge: wizard.challenge,
        budget: wizard.budget,
        timeline: wizard.timeline,
        created_at: wizard.created_at,
      },
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        linkedin_profile: user.linkedin_profile,
        user_role: user.user_role,
        user_role_other: user.user_role_other,
      },
    };

    // Process n8n webhook in background using EdgeRuntime.waitUntil
    EdgeRuntime.waitUntil(
      processN8nWebhook(supabase, report.id, webhookUrl, payload)
    );

    console.log(`🚀 Report ${report.id} processing started in background`);

    // Return immediately to frontend
    return new Response(
      JSON.stringify({ 
        success: true, 
        report_id: report.id,
        status: "processing",
        message: "Report generation started" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error in pms-trigger-n8n-report:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
