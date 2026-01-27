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

// Sequência de tools na ordem correta
const TOOLS_SEQUENCE = [
  { 
    id: 0, 
    tool_name: "Create_Report_Row", 
    label: "Initialize Report",
    field: null // Não salva em campo específico
  },
  { 
    id: 1, 
    tool_name: "Call_Get_Investment_Tool_", 
    label: "Investment Analysis",
    field: "section_investment"
  },
  { 
    id: 2, 
    tool_name: "Call_Get_Benchmark_Tool_", 
    label: "Market Benchmarks",
    field: "benchmark_section"
  },
  { 
    id: 3, 
    tool_name: "Call_Get_Competitors_Tool_", 
    label: "Competitor Research",
    field: "competitive_analysis_section"
  },
  { 
    id: 4, 
    tool_name: "Call_Get_Opportunity_Tool_", 
    label: "Market Opportunity",
    field: "opportunity_section"
  },
  { 
    id: 5, 
    tool_name: "Call_Get_ICP_Tool_", 
    label: "Customer Profiling",
    field: "icp_intelligence_section"
  },
  { 
    id: 6, 
    tool_name: "Call_Get_Price_Tool_", 
    label: "Pricing Strategy",
    field: "price_intelligence_section"
  },
  { 
    id: 7, 
    tool_name: "Call_Get_PaidMedia_Tool_", 
    label: "Paid Media Analysis",
    field: "paid_media_intelligence_section"
  },
  { 
    id: 8, 
    tool_name: "Call_Get_Growth_Tool_", 
    label: "Growth Projections",
    field: "growth_intelligence_section"
  },
  { 
    id: 9, 
    tool_name: "Call_Get_Summary_Tool_", 
    label: "Executive Summary",
    field: "summary_section"
  },
  { 
    id: 10, 
    tool_name: "Call_Get_Hero_Score_Tool_", 
    label: "Final Scoring",
    field: "hero_score_section"
  },
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
    const { wizard_id } = await req.json();
    
    if (!wizard_id) {
      return new Response(
        JSON.stringify({ error: "wizard_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🚀 Starting orchestration for wizard: ${wizard_id}`);

    // Executa cada tool em sequência
    for (const tool of TOOLS_SEQUENCE) {
      const stepNum = tool.id;
      const statusInProgress = `Step ${stepNum} ${tool.label} - In Progress`;
      const statusCompleted = `Step ${stepNum} ${tool.label} - Completed`;
      const statusFailed = `Step ${stepNum} ${tool.label} - Fail`;

      // 1. Atualiza status para "In Progress"
      await supabase
        .from("tb_pms_reports")
        .update({ status: statusInProgress })
        .eq("wizard_id", wizard_id);

      console.log(`📍 ${statusInProgress}`);

      try {
        // 2. Chama o webhook n8n com tool_name e wizard_id
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool_name: tool.tool_name,
            wizard_id: wizard_id
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        // 3. Verifica se foi sucesso
        if (!result.success) {
          throw new Error(result.error || "Tool returned failure");
        }

        // 4. Salva o resultado no campo JSONB correspondente (se houver)
        if (tool.field && result.data) {
          await supabase
            .from("tb_pms_reports")
            .update({ 
              [tool.field]: result.data,
              status: statusCompleted
            })
            .eq("wizard_id", wizard_id);
        } else {
          // Para Create_Report_Row que não tem campo específico
          await supabase
            .from("tb_pms_reports")
            .update({ status: statusCompleted })
            .eq("wizard_id", wizard_id);
        }

        console.log(`✅ ${statusCompleted}`);

      } catch (error) {
        // 5. Se falhou, atualiza status e para execução
        console.error(`❌ ${statusFailed}:`, error);
        
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusFailed })
          .eq("wizard_id", wizard_id);

        return new Response(
          JSON.stringify({
            success: false,
            failedAt: stepNum,
            tool_name: tool.tool_name,
            error: String(error)
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Todos os steps completados com sucesso
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
