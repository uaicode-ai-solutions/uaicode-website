import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header and extract token
    const authHeader = req.headers.get("Authorization");
    
    // Debug logs (temporary)
    console.log("=== DELETE ACCOUNT REQUEST ===");
    console.log("hasAuthHeader:", !!authHeader);
    console.log("tokenLength:", authHeader ? authHeader.replace("Bearer ", "").length : 0);
    
    let token = "";
    
    // Try Authorization header first
    if (authHeader) {
      token = authHeader.replace("Bearer ", "");
    }
    
    // Fallback: try getting token from body
    if (!token) {
      try {
        const body = await req.json().catch(() => ({}));
        if (body.token) {
          token = body.token;
          console.log("Token obtained from body, length:", token.length);
        }
      } catch {
        // Ignore body parsing errors
      }
    }
    
    if (!token) {
      console.error("No token found in header or body");
      return new Response(
        JSON.stringify({ error: "Missing authorization token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with persistSession: false (required for Edge Functions)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });

    // Get the authenticated user - PASS TOKEN AS PARAMETER
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error("Unauthorized:", userError?.message || "User not found");
      throw new Error("Unauthorized: " + (userError?.message || "User not found"));
    }

    console.log("=== STARTING ACCOUNT DELETION ===");
    console.log("Auth user ID:", user.id);
    console.log("Auth user email:", user.email);

    // Admin client to perform deletions
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get user profile - CRITICAL: we need the tb_pms_users.id (NOT auth.users.id)
    //    because tb_pms_payments.user_id and tb_pms_reports.user_id reference tb_pms_users.id
    const { data: pmsUser, error: pmsUserError } = await supabaseAdmin
      .from("tb_pms_users")
      .select("id, email, full_name")
      .eq("auth_user_id", user.id)
      .single();

    if (pmsUserError) {
      console.log("No tb_pms_users profile found (error):", pmsUserError.message);
    }

    // The pms_user_id is the correct ID to use for deleting payments/reports
    const pmsUserId = pmsUser?.id;
    console.log("PMS User ID (tb_pms_users.id):", pmsUserId || "NOT FOUND");

    // 2. Delete user's payments using the CORRECT ID (pmsUserId, not auth user.id)
    if (pmsUserId) {
      const { data: deletedPayments, error: paymentsError } = await supabaseAdmin
        .from("tb_pms_payments")
        .delete()
        .eq("user_id", pmsUserId)
        .select("id");

      if (paymentsError) {
        console.error("Error deleting payments:", paymentsError.message);
      } else {
        console.log("Deleted payments count:", deletedPayments?.length || 0);
      }

      // 3. Delete user's reports using the CORRECT ID (pmsUserId, not auth user.id)
      const { data: deletedReports, error: reportsError } = await supabaseAdmin
        .from("tb_pms_reports")
        .delete()
        .eq("user_id", pmsUserId)
        .select("id");

      if (reportsError) {
        console.error("Error deleting reports:", reportsError.message);
      } else {
        console.log("Deleted reports count:", deletedReports?.length || 0);
      }
    } else {
      console.log("No pmsUserId found - skipping payments/reports deletion");
    }

    // 4. Delete user profile from tb_pms_users
    const { error: profileError } = await supabaseAdmin
      .from("tb_pms_users")
      .delete()
      .eq("auth_user_id", user.id);

    if (profileError) {
      console.error("Error deleting profile:", profileError.message);
      // Don't throw here - continue to delete auth user even if profile doesn't exist
    } else {
      console.log("Profile deleted successfully");
    }

    // 5. Send goodbye email before deleting auth user
    if (pmsUser?.email && pmsUser?.full_name) {
      try {
        console.log("Sending goodbye email to:", pmsUser.email);
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
    console.log("Deleting auth user:", user.id);
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError.message);
      throw new Error("Failed to delete auth user: " + authDeleteError.message);
    }

    console.log("=== ACCOUNT DELETION COMPLETED SUCCESSFULLY ===");

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("=== ACCOUNT DELETION FAILED ===");
    console.error("Error:", error.message);
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
