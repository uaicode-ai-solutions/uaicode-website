import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ShareReportEmailRequest {
  recipientEmail: string;
  senderName: string;
  projectName: string;
  reportUrl: string;
  personalMessage?: string;
}

const generateShareReportEmail = (
  senderName: string,
  projectName: string,
  reportUrl: string,
  personalMessage?: string
) => {
  const personalMessageSection = personalMessage ? `
    <!-- Personal Message Card -->
    <div style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0; position: relative;">
      <div style="position: absolute; top: 12px; left: 16px; font-size: 32px; color: #FACC15; opacity: 0.3; font-family: Georgia, serif;">"</div>
      <p style="color: #FFFFFF; font-size: 15px; line-height: 1.7; margin: 0; padding: 8px 24px; font-style: italic;">
        ${personalMessage}
      </p>
      <div style="position: absolute; bottom: 8px; right: 16px; font-size: 32px; color: #FACC15; opacity: 0.3; font-family: Georgia, serif;">"</div>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Report Shared with You</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="background-color: #0A0A0A; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #141414; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
      
      <!-- Header with Gold Gradient -->
      <div style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%); padding: 32px 40px; text-align: center;">
        <div style="color: #0A0A0A; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">🔗 SaaS Report Shared</div>
        <div style="font-size: 12px; color: #0A0A0A; opacity: 0.8; margin-top: 4px;">PlanningMySaaS by UaiCode</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 48px 40px; color: #FFFFFF;">
        <h1 style="font-size: 28px; font-weight: 700; color: #FFFFFF; margin: 0 0 24px 0; line-height: 1.3;">Hi there! 👋</h1>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          <span style="color: #FACC15; font-weight: 600;">${senderName}</span> shared a SaaS validation report with you!
        </p>
        
        ${personalMessageSection}
        
        <!-- Report Preview Card -->
        <div style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #FACC15; font-weight: 600; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">📋 Shared Report</p>
          
          <!-- Project Name -->
          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #2A2A2A;">
            <p style="color: #B3B3B3; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase;">Project Name</p>
            <p style="color: #FFFFFF; font-size: 20px; font-weight: 600; margin: 0;">${projectName}</p>
          </div>
          
          <!-- Report Link Box -->
          <div style="background-color: #0A0A0A; border-radius: 8px; padding: 12px; word-break: break-all;">
            <p style="color: #B3B3B3; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase;">Report Link</p>
            <a href="${reportUrl}" style="color: #FACC15; font-size: 13px; text-decoration: none;">${reportUrl}</a>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #0A0A0A; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.3);">View Full Report</a>
        </div>
        
        <!-- What's Inside Card -->
        <div style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #FFFFFF; font-weight: 600; margin: 0 0 16px 0; font-size: 17px;">📈 What's Inside</p>
          <div style="color: #B3B3B3; font-size: 15px;">
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Market Analysis</strong> - Size, trends, and opportunity assessment</p>
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Competitive Intelligence</strong> - Key players and differentiation</p>
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Financial Projections</strong> - Revenue forecasts and economics</p>
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Technical Feasibility</strong> - Development requirements</p>
            <p style="margin: 0;">✓ <strong style="color: #FFFFFF;">Brand Identity</strong> - Logo and marketing recommendations</p>
          </div>
        </div>
        
        <!-- Divider -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent, #2A2A2A, transparent); margin: 32px 0;"></div>
        
        <p style="font-size: 14px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Want to create your own SaaS validation report? Visit <a href="https://uaicode.ai/planningmysaas" style="color: #FACC15; text-decoration: none;">PlanningMySaaS</a> to get started!
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0A0A0A; padding: 32px 40px; text-align: center; border-top: 1px solid #2A2A2A;">
        <div style="margin: 0 0 20px 0;">
          <a href="https://uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Website</a>
          <span style="color: #2A2A2A;">•</span>
          <a href="https://linkedin.com/company/uaicode" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">LinkedIn</a>
          <span style="color: #2A2A2A;">•</span>
          <a href="mailto:hello@uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Contact</a>
        </div>
        <p style="color: #B3B3B3; font-size: 13px; line-height: 1.6; margin: 0 0 16px 0;">
          © ${new Date().getFullYear()} UaiCode. All rights reserved.<br>
          You're receiving this email because someone shared a report with you.
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
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { 
      recipientEmail, 
      senderName, 
      projectName, 
      reportUrl,
      personalMessage 
    }: ShareReportEmailRequest = await req.json();

    // Validate required fields
    if (!recipientEmail || !senderName || !projectName || !reportUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: recipientEmail, senderName, projectName, reportUrl" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = generateShareReportEmail(
      senderName,
      projectName,
      reportUrl,
      personalMessage
    );

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PlanningMySaaS <noreply@uaicode.ai>",
        to: [recipientEmail],
        subject: `🔗 ${senderName} shared a SaaS Report with you`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Share report email sent successfully:", { recipientEmail, projectName, data });

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending share report email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
