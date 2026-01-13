import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordChangedRequest {
  email: string;
  fullName: string;
}

// Premium Password Changed Email Template
const generatePasswordChangedEmail = (userName: string) => {
  const firstName = userName.split(' ')[0];
  const changeDate = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed - PlanningMySaaS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="background-color: #0A0A0A; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #141414; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%); padding: 32px 40px; text-align: center;">
        <div style="color: #0A0A0A; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">✨ PlanningMySaaS</div>
        <div style="font-size: 12px; color: #0A0A0A; opacity: 0.8; margin-top: 4px;">by UaiCode</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 48px 40px; color: #FFFFFF;">
        <h1 style="font-size: 28px; font-weight: 700; color: #FFFFFF; margin: 0 0 24px 0; line-height: 1.3;">Password Successfully Changed ✅</h1>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Hi <span style="color: #FACC15; font-weight: 600;">${firstName}</span>,
        </p>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Your PlanningMySaaS password was successfully changed on <strong style="color: #FFFFFF;">${changeDate}</strong>.
        </p>
        
        <!-- Success Card -->
        <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid #22C55E; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #22C55E; font-weight: 600; margin: 0 0 8px 0;">✓ Password Updated</p>
          <p style="color: #B3B3B3; margin: 0; font-size: 14px;">
            Your account is now secured with your new password.
          </p>
        </div>
        
        <!-- Security Warning -->
        <div style="background-color: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="color: #FACC15; font-size: 13px; margin: 0;">
            ⚠️ <strong>Didn't make this change?</strong> If you didn't change your password, please contact our support team immediately at <a href="mailto:hello@uaicode.ai" style="color: #FACC15;">hello@uaicode.ai</a>
          </p>
        </div>
        
        <!-- Divider -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent, #2A2A2A, transparent); margin: 32px 0;"></div>
        
        <p style="font-size: 14px; line-height: 1.7; color: #B3B3B3; margin: 0 0 16px 0;">
          For your security, we recommend:
        </p>
        <div style="color: #B3B3B3; font-size: 14px;">
          <p style="margin: 0 0 8px 0;">🔒 Use a unique password for each account</p>
          <p style="margin: 0 0 8px 0;">🔑 Consider using a password manager</p>
          <p style="margin: 0;">📱 Enable two-factor authentication when available</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0A0A0A; padding: 32px 40px; text-align: center; border-top: 1px solid #2A2A2A;">
        <div style="margin: 0 0 20px 0;">
          <a href="https://uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Website</a>
          <span style="color: #2A2A2A;">•</span>
          <a href="mailto:hello@uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Support</a>
        </div>
        <p style="color: #B3B3B3; font-size: 13px; line-height: 1.6; margin: 0;">
          © ${new Date().getFullYear()} UaiCode. All rights reserved.
        </p>
      </div>
      
    </div>
  </div>
</body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: PasswordChangedRequest = await req.json();

    if (!email || !fullName) {
      return new Response(
        JSON.stringify({ error: "Email and fullName are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = generatePasswordChangedEmail(fullName);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PlanningMySaaS <noreply@uaicode.ai>",
        to: [email],
        subject: "✅ Your Password Was Successfully Changed",
        html: emailHtml,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Password changed email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending password changed email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
