import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    // Validate caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Admin client for privileged operations
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // User-scoped client for JWT validation
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: callerUser }, error: userError } = await userClient.auth.getUser();
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerAuthId = callerUser.id;

    // Check caller is hero admin
    const { data: callerProfile } = await adminClient
      .from("tb_hero_users")
      .select("id")
      .eq("auth_user_id", callerAuthId)
      .single();

    if (!callerProfile) {
      return new Response(JSON.stringify({ error: "Not a hero user" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: adminRole } = await adminClient
      .from("tb_hero_roles")
      .select("id")
      .eq("user_id", callerProfile.id)
      .eq("role", "admin")
      .single();

    if (!adminRole) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse body
    const { email, role, team } = await req.json();

    if (!email || !role) {
      return new Response(JSON.stringify({ error: "Email and role are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validRoles = ["admin", "contributor", "viewer"];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user already exists in tb_hero_users
    const { data: existingHero } = await adminClient
      .from("tb_hero_users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingHero) {
      return new Response(JSON.stringify({ error: "User already exists in Hero Ecosystem" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create auth user
    const tempPassword = crypto.randomUUID();
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: tempPassword,
      email_confirm: true,
    });

    if (createError) {
      // User might exist in auth but not in hero
      if (createError.message?.includes("already been registered")) {
        // Get existing auth user
        const { data: { users } } = await adminClient.auth.admin.listUsers();
        const existingAuth = users?.find((u: any) => u.email === email.toLowerCase().trim());
        if (existingAuth) {
          // Create hero profile + role for existing auth user
          const { data: heroProfile, error: profileError } = await adminClient
            .from("tb_hero_users")
            .insert({
              auth_user_id: existingAuth.id,
              email: email.toLowerCase().trim(),
              full_name: "",
              team: team || "none",
            })
            .select("id")
            .single();

          if (profileError) {
            return new Response(JSON.stringify({ error: "Failed to create hero profile: " + profileError.message }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          await adminClient.from("tb_hero_roles").insert({
            user_id: heroProfile.id,
            role,
          });

          // Generate recovery link and send email
          await generateAndSendInvite(adminClient, email.toLowerCase().trim(), RESEND_API_KEY);

          return new Response(JSON.stringify({ success: true, message: "Existing auth user invited to Hero" }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      return new Response(JSON.stringify({ error: "Failed to create user: " + createError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Create hero profile
    const { data: heroProfile, error: profileError } = await adminClient
      .from("tb_hero_users")
      .insert({
        auth_user_id: newUser.user.id,
        email: email.toLowerCase().trim(),
        full_name: "",
        team: team || "none",
      })
      .select("id")
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: "Failed to create hero profile: " + profileError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Create role
    await adminClient.from("tb_hero_roles").insert({
      user_id: heroProfile.id,
      role,
    });

    // 4. Generate recovery link and send invite email
    await generateAndSendInvite(adminClient, email.toLowerCase().trim(), RESEND_API_KEY);

    return new Response(JSON.stringify({ success: true, message: "User invited successfully" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("hero-invite-user error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function generateAndSendInvite(
  adminClient: any,
  email: string,
  resendApiKey: string | undefined
) {
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: "https://uaicode.ai/hero/reset-password",
    },
  });

  if (linkError) {
    console.error("Failed to generate recovery link:", linkError);
    return;
  }

  const recoveryLink = linkData?.properties?.action_link;
  if (!recoveryLink || !resendApiKey) {
    console.warn("No recovery link or Resend API key, skipping email");
    return;
  }

  // Send invite email via Resend
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:16px;border:1px solid #262626;overflow:hidden;">
        <tr><td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #262626;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.3px;">
            UaiCode <span style="color:#FACC15;">Hero</span> Ecosystem
          </h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#FFFFFF;">You've Been Invited! 🎉</h2>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#A3A3A3;">
            You've been invited to join the <strong style="color:#FFFFFF;">UaiCode Hero Ecosystem</strong>. Click the button below to set up your password and complete your profile.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:4px 0 28px;">
              <a href="${recoveryLink}" target="_blank" style="display:inline-block;padding:14px 36px;background-color:#FACC15;color:#000000;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.2px;">
                Set Up Your Account
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#737373;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
          <p style="margin:0;font-size:13px;line-height:1.5;color:#737373;">This link will expire in 24 hours.</p>
        </td></tr>
        <tr><td style="padding:20px 40px 28px;text-align:center;border-top:1px solid #262626;">
          <p style="margin:0;font-size:12px;color:#525252;">&copy; 2025 UaiCode. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "UaiCode Hero <noreply@uaicode.ai>",
        to: [email],
        subject: "You've Been Invited to UaiCode Hero Ecosystem",
        html: emailHtml,
        headers: {
          "List-Unsubscribe": "<mailto:hello@uaicode.ai?subject=Unsubscribe>",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
    }
  } catch (e) {
    console.error("Failed to send invite email:", e);
  }
}
