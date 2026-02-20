import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate caller is authenticated
    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await callerClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerAuthId = claimsData.claims.sub;

    // Use service role to check admin status and perform operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Get caller's hero user id
    const { data: callerHero } = await adminClient
      .from("tb_hero_users")
      .select("id")
      .eq("auth_user_id", callerAuthId)
      .single();

    if (!callerHero) {
      return new Response(JSON.stringify({ error: "Not a Hero user" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if caller is admin
    const { data: adminRole } = await adminClient
      .from("tb_hero_roles")
      .select("id")
      .eq("user_id", callerHero.id)
      .eq("role", "admin")
      .single();

    if (!adminRole) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { email, role, team } = await req.json();

    if (!email || !role || !team) {
      return new Response(JSON.stringify({ error: "email, role, and team are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validRoles = ["admin", "contributor", "viewer"];
    const validTeams = ["admin", "marketing", "sales"];

    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!validTeams.includes(team)) {
      return new Response(JSON.stringify({ error: "Invalid team" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user already exists in hero_users
    const { data: existingHero } = await adminClient
      .from("tb_hero_users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingHero) {
      return new Response(JSON.stringify({ error: "User already exists in Hero" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Invite user via Supabase Auth
    const origin = req.headers.get("origin") || "https://uaicodewebsite.lovable.app";
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/hero/reset-password`,
    });

    if (inviteError || !inviteData?.user) {
      console.error("Invite error:", inviteError);
      return new Response(JSON.stringify({ error: inviteError?.message || "Failed to invite user" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newAuthUserId = inviteData.user.id;

    // Create hero user record
    const { data: newHeroUser, error: heroInsertError } = await adminClient
      .from("tb_hero_users")
      .insert({
        auth_user_id: newAuthUserId,
        email,
        full_name: "",
        team,
      })
      .select("id")
      .single();

    if (heroInsertError || !newHeroUser) {
      console.error("Hero user insert error:", heroInsertError);
      return new Response(JSON.stringify({ error: "Failed to create Hero user record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Assign role
    const { error: roleError } = await adminClient
      .from("tb_hero_roles")
      .insert({
        user_id: newHeroUser.id,
        role,
      });

    if (roleError) {
      console.error("Role insert error:", roleError);
      return new Response(JSON.stringify({ error: "User created but failed to assign role" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: `Invitation sent to ${email}` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
