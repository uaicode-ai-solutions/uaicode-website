import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailVerificationRequest {
  email: string;
  fullName: string;
  verificationUrl: string;
}

const generateEmailVerificationEmail = (userName: string, verificationUrl: string) => {
  const firstName = userName.split(" ")[0];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - PlanningMySaaS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0A0A0A;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
          
          <!-- Header with Gold Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #0A0A0A; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                ✨ Planning<span style="color: #1a1a1a;">My</span>SaaS
              </h1>
              <p style="margin: 8px 0 0 0; color: #1a1a1a; font-size: 14px; opacity: 0.8;">
                by UaiCode
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background-color: #141414; padding: 48px 40px;">
              <!-- Email Icon -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(250, 204, 21, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%); border-radius: 50%; line-height: 80px;">
                  <span style="font-size: 40px;">📧</span>
                </div>
              </div>
              
              <h2 style="margin: 0 0 24px 0; color: #FFFFFF; font-size: 24px; font-weight: 700; text-align: center;">
                Verify Your Email Address
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #E5E5E5; font-size: 16px; line-height: 1.6;">
                Hi <strong style="color: #FACC15;">${firstName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; color: #B3B3B3; font-size: 16px; line-height: 1.7;">
                Thanks for signing up for PlanningMySaaS! To complete your registration and unlock all features, please verify your email address by clicking the button below.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #0A0A0A; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 24px rgba(250, 204, 21, 0.3);">
                  ✓ Verify My Email
                </a>
              </div>
              
              <!-- Expiration Warning -->
              <div style="background-color: #1E1E1E; border-radius: 12px; padding: 20px; margin: 32px 0; border-left: 4px solid #FACC15;">
                <p style="margin: 0; color: #B3B3B3; font-size: 14px; line-height: 1.6;">
                  ⏳ <strong style="color: #FACC15;">Important:</strong> This verification link will expire in <strong style="color: #FFFFFF;">24 hours</strong>. If you need a new link, you can request one from the login page.
                </p>
              </div>
              
              <!-- Alternative Link -->
              <p style="margin: 24px 0; color: #666666; font-size: 13px; line-height: 1.6; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0; padding: 12px; background-color: #1E1E1E; border-radius: 8px; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #FACC15; font-size: 12px; text-decoration: none;">${verificationUrl}</a>
              </p>
              
              <!-- Security Note -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #2A2A2A;">
                <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6; text-align: center;">
                  🔒 Didn't create an account? You can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0D0D0D; border-radius: 0 0 16px 16px; padding: 32px 40px; text-align: center; border-top: 1px solid #1A1A1A;">
              <p style="margin: 0 0 16px 0; color: #666666; font-size: 14px;">
                Powered by <strong style="color: #FACC15;">UaiCode</strong>
              </p>
              <p style="margin: 0; color: #444444; font-size: 12px;">
                Transform your SaaS ideas into validated business plans
              </p>
              <div style="margin-top: 20px;">
                <a href="https://uaicode.ai" style="color: #FACC15; text-decoration: none; font-size: 13px; margin: 0 12px;">Website</a>
                <span style="color: #333333;">•</span>
                <a href="https://linkedin.com/company/uaicode" style="color: #FACC15; text-decoration: none; font-size: 13px; margin: 0 12px;">LinkedIn</a>
              </div>
              <p style="margin: 24px 0 0 0; color: #333333; font-size: 11px;">
                © ${new Date().getFullYear()} UaiCode. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { email, fullName, verificationUrl }: EmailVerificationRequest = await req.json();

    if (!email || !fullName || !verificationUrl) {
      throw new Error("Missing required fields: email, fullName, verificationUrl");
    }

    const emailHtml = generateEmailVerificationEmail(fullName, verificationUrl);

    const emailResponse = await resend.emails.send({
      from: "PlanningMySaaS <noreply@uaicode.ai>",
      to: [email],
      subject: "📧 Verify Your Email - PlanningMySaaS",
      html: emailHtml,
    });

    console.log("Email verification sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in pms-send-email-verification:", error);
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
