import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const required = [
      "full_name",
      "email",
      "saas_type",
      "industry",
      "description",
      "saas_name",
      "country",
      "role",
      "geographic_region",
    ];

    for (const field of required) {
      if (!body[field] || String(body[field]).trim().length === 0) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("tb_pms_lp_wizard")
      .insert({
        full_name: String(body.full_name).trim().slice(0, 200),
        email: String(body.email).trim().toLowerCase().slice(0, 255),
        phone: body.phone ? String(body.phone).trim().slice(0, 50) : null,
        linkedin: body.linkedin ? String(body.linkedin).trim().slice(0, 500) : null,
        country: String(body.country).trim().slice(0, 100),
        role: String(body.role).trim().slice(0, 100),
        role_other: body.role_other ? String(body.role_other).trim().slice(0, 200) : null,
        saas_type: String(body.saas_type).trim().slice(0, 100),
        saas_type_other: body.saas_type_other ? String(body.saas_type_other).trim().slice(0, 200) : null,
        industry: String(body.industry).trim().slice(0, 100),
        industry_other: body.industry_other ? String(body.industry_other).trim().slice(0, 200) : null,
        description: String(body.description).trim().slice(0, 5000),
        saas_name: String(body.saas_name).trim().slice(0, 200),
        saas_logo_url: body.saas_logo_url ? String(body.saas_logo_url).trim().slice(0, 1000) : null,
        geographic_region: String(body.geographic_region).trim().slice(0, 100),
        geographic_region_other: body.geographic_region_other ? String(body.geographic_region_other).trim().slice(0, 200) : null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
