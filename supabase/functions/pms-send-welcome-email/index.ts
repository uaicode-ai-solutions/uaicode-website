import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
}

// Premium Email Template - UaiCode Brand Colors
const generateWelcomeEmail = (userName: string, dashboardUrl: string) => {
  const firstName = userName.split(' ')[0];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PlanningMySaaS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="background-color: #0A0A0A; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #141414; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
      
      <!-- Header with Gold Gradient -->
      <div style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%); padding: 32px 40px; text-align: center;">
        <div style="color: #0A0A0A; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">✨ PlanningMySaaS</div>
        <div style="font-size: 12px; color: #0A0A0A; opacity: 0.8; margin-top: 4px;">by UaiCode</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 48px 40px; color: #FFFFFF;">
        <h1 style="font-size: 28px; font-weight: 700; color: #FFFFFF; margin: 0 0 24px 0; line-height: 1.3;">Welcome to the Future of SaaS Planning! 🚀</h1>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Hi <span style="color: #FACC15; font-weight: 600;">${firstName}</span>,
        </p>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Congratulations on taking the first step towards validating and planning your SaaS idea! You've just joined an exclusive community of entrepreneurs who take their vision seriously.
        </p>
        
        <!-- Feature Card -->
        <div style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #FFFFFF; font-weight: 600; margin: 0 0 16px 0; font-size: 17px;">🎯 What you can do now:</p>
          <div style="color: #B3B3B3; font-size: 15px;">
            <p style="margin: 0 0 12px 0;">✓ Create your first <strong style="color: #FFFFFF;">SaaS Validation Report</strong> with AI-powered insights</p>
            <p style="margin: 0 0 12px 0;">✓ Get <strong style="color: #FFFFFF;">market analysis</strong> and competitive intelligence</p>
            <p style="margin: 0 0 12px 0;">✓ Receive <strong style="color: #FFFFFF;">financial projections</strong> and viability scores</p>
            <p style="margin: 0;">✓ Access <strong style="color: #FFFFFF;">brand identity</strong> and marketing recommendations</p>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #0A0A0A; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.3);">Start Your First Report</a>
        </div>
        
        <!-- Divider -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent, #2A2A2A, transparent); margin: 32px 0;"></div>
        
        <p style="font-size: 14px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Have questions? Our team is here to help you succeed. Just reply to this email or schedule a call with our experts.
        </p>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin-bottom: 0;">
          To your success,<br>
          <span style="color: #FACC15; font-weight: 600;">The PlanningMySaaS Team</span>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0A0A0A; padding: 32px 40px; text-align: center; border-top: 1px solid #2A2A2A;">
        <div style="margin: 0 0 20px 0;">
          <a href="https://uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Website</a>
          <span style="color: #2A2A2A;">•</span>
          <a href="https://linkedin.com/company/uaicode" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">LinkedIn</a>
          <span style="color: #2A2A2A;">•</span>
          <a href="mailto:contato@uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Support</a>
        </div>
        <p style="color: #B3B3B3; font-size: 13px; line-height: 1.6; margin: 0 0 16px 0;">
          © ${new Date().getFullYear()} UaiCode. All rights reserved.<br>
          You're receiving this email because you have an account at PlanningMySaaS.
        </p>
        <p style="color: #B3B3B3; font-size: 11px; opacity: 0.7; margin: 0;">
          UaiCode Tecnologia • Brazil
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
    const { email, fullName }: WelcomeEmailRequest = await req.json();

    if (!email || !fullName) {
      return new Response(
        JSON.stringify({ error: "Email and fullName are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const dashboardUrl = "https://uaicode.ai/planningmysaas/reports";
    const emailHtml = generateWelcomeEmail(fullName, dashboardUrl);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PlanningMySaaS <noreply@uaicode.ai>",
        to: [email],
        subject: "🚀 Welcome to PlanningMySaaS - Let's Build Your Vision!",
        html: emailHtml,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Welcome email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
