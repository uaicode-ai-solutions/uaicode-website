import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create Supabase client with the user's JWT
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // User client to get user info
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized: " + (userError?.message || "User not found"));
    }

    console.log("Deleting account for user:", user.id);

    // Admin client to perform deletions
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get user profile for goodbye email
    const { data: pmsUser } = await supabaseAdmin
      .from("tb_pln_users")
      .select("email, full_name")
      .eq("auth_user_id", user.id)
      .single();

    // 2. Delete user's payments
    const { error: paymentsError } = await supabaseAdmin
      .from("tb_pln_payments")
      .delete()
      .eq("user_id", user.id);

    if (paymentsError) {
      console.error("Error deleting payments:", paymentsError);
    }

    // 3. Delete user's reports
    const { error: reportsError } = await supabaseAdmin
      .from("tb_pln_reports")
      .delete()
      .eq("user_id", user.id);

    if (reportsError) {
      console.error("Error deleting reports:", reportsError);
    }

    // 4. Delete user profile from tb_pln_users
    const { error: profileError } = await supabaseAdmin
      .from("tb_pln_users")
      .delete()
      .eq("auth_user_id", user.id);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      throw new Error("Failed to delete user profile");
    }

    // 5. Send goodbye email before deleting auth user
    if (pmsUser?.email && pmsUser?.full_name) {
      try {
        const emailResponse = await fetch(
          `${supabaseUrl}/functions/v1/pms-send-goodbye-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              email: pmsUser.email,
              fullName: pmsUser.full_name,
            }),
          }
        );

        if (!emailResponse.ok) {
          console.error("Failed to send goodbye email:", await emailResponse.text());
        } else {
          console.log("Goodbye email sent successfully");
        }
      } catch (emailError) {
        console.error("Error sending goodbye email:", emailError);
        // Don't block deletion if email fails
      }
    }

    // 6. Delete auth user using admin client
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError);
      throw new Error("Failed to delete auth user: " + authDeleteError.message);
    }

    console.log("Account deleted successfully for user:", user.id);

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in pms-delete-account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
