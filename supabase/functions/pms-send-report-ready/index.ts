import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportReadyRequest {
  email: string;
  fullName: string;
  reportId: string;
  projectName: string;
  viabilityScore: number;
  complexityScore: number;
  planType: "starter" | "pro" | "enterprise";
  industry: string;
}

const getPlanDisplayName = (plan: string): string => {
  const planNames: Record<string, string> = {
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise"
  };
  return planNames[plan] || plan;
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#FACC15";
  return "#EF4444";
};

const generateReportReadyEmail = (
  userName: string,
  reportId: string,
  projectName: string,
  viabilityScore: number,
  complexityScore: number,
  planType: string,
  industry: string
) => {
  const firstName = userName.split(' ')[0];
  const reportUrl = `https://uaicode.ai/planningmysaas/dashboard/${reportId}`;
  const viabilityColor = getScoreColor(viabilityScore);
  const complexityColor = getScoreColor(100 - complexityScore);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SaaS Validation Report is Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="background-color: #0A0A0A; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #141414; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
      
      <!-- Header with Gold Gradient -->
      <div style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%); padding: 32px 40px; text-align: center;">
        <div style="color: #0A0A0A; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">📊 Your Report is Ready!</div>
        <div style="font-size: 12px; color: #0A0A0A; opacity: 0.8; margin-top: 4px;">PlanningMySaaS by UaiCode</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 48px 40px; color: #FFFFFF;">
        <h1 style="font-size: 28px; font-weight: 700; color: #FFFFFF; margin: 0 0 24px 0; line-height: 1.3;">Great News, ${firstName}! 🎉</h1>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Your <span style="color: #FACC15; font-weight: 600;">SaaS Validation Report</span> for <strong style="color: #FFFFFF;">${projectName}</strong> has been generated and is ready for review!
        </p>
        
        <!-- Report Summary Card -->
        <div style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #FACC15; font-weight: 600; margin: 0 0 20px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">📋 Report Summary</p>
          
          <!-- Project Name -->
          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #2A2A2A;">
            <p style="color: #B3B3B3; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase;">Project Name</p>
            <p style="color: #FFFFFF; font-size: 18px; font-weight: 600; margin: 0;">${projectName}</p>
          </div>
          
          <!-- Scores Row -->
          <div style="display: flex; margin-bottom: 16px;">
            <div style="flex: 1; text-align: center; padding-right: 16px; border-right: 1px solid #2A2A2A;">
              <p style="color: #B3B3B3; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Viability Score</p>
              <p style="color: ${viabilityColor}; font-size: 32px; font-weight: 700; margin: 0;">${viabilityScore}%</p>
            </div>
            <div style="flex: 1; text-align: center; padding-left: 16px;">
              <p style="color: #B3B3B3; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Complexity Score</p>
              <p style="color: ${complexityColor}; font-size: 32px; font-weight: 700; margin: 0;">${complexityScore}%</p>
            </div>
          </div>
          
          <!-- Plan & Industry -->
          <div style="display: flex; gap: 12px;">
            <div style="flex: 1; background-color: #0A0A0A; border-radius: 8px; padding: 12px; text-align: center;">
              <p style="color: #B3B3B3; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase;">Plan</p>
              <p style="color: #FACC15; font-size: 14px; font-weight: 600; margin: 0;">${getPlanDisplayName(planType)}</p>
            </div>
            <div style="flex: 1; background-color: #0A0A0A; border-radius: 8px; padding: 12px; text-align: center;">
              <p style="color: #B3B3B3; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase;">Industry</p>
              <p style="color: #FFFFFF; font-size: 14px; font-weight: 600; margin: 0;">${industry}</p>
            </div>
          </div>
        </div>
        
        <!-- Access Section -->
        <div style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #FFFFFF; font-weight: 600; margin: 0 0 16px 0; font-size: 17px;">🔗 Access Your Report</p>
          
          <p style="color: #B3B3B3; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
            Click the button below to view your complete report with market analysis, financial projections, and actionable recommendations.
          </p>
          
          <!-- Report Link Box -->
          <div style="background-color: #0A0A0A; border-radius: 8px; padding: 12px; margin-bottom: 16px; word-break: break-all;">
            <p style="color: #B3B3B3; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase;">Direct Link</p>
            <a href="${reportUrl}" style="color: #FACC15; font-size: 13px; text-decoration: none;">${reportUrl}</a>
          </div>
          
          <p style="color: #B3B3B3; font-size: 13px; margin: 0;">
            💡 <strong style="color: #FFFFFF;">Tip:</strong> Share this link with your team or investors to get their feedback!
          </p>
        </div>
        
        <!-- CTA Buttons -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #0A0A0A; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.3); margin-bottom: 12px;">View Your Report</a>
        </div>
        
        <!-- What's Inside Card -->
        <div style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #FFFFFF; font-weight: 600; margin: 0 0 16px 0; font-size: 17px;">📈 What's Inside Your Report</p>
          <div style="color: #B3B3B3; font-size: 15px;">
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Market Analysis</strong> - Size, trends, and opportunity assessment</p>
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Competitive Intelligence</strong> - Key players and differentiation strategies</p>
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Financial Projections</strong> - Revenue forecasts and unit economics</p>
            <p style="margin: 0 0 12px 0;">✓ <strong style="color: #FFFFFF;">Technical Feasibility</strong> - Development complexity and requirements</p>
            <p style="margin: 0;">✓ <strong style="color: #FFFFFF;">Brand Identity</strong> - Logo suggestions and marketing recommendations</p>
          </div>
        </div>
        
        <!-- Divider -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent, #2A2A2A, transparent); margin: 32px 0;"></div>
        
        <p style="font-size: 14px; line-height: 1.7; color: #B3B3B3; margin: 0 0 20px 0;">
          Have questions about your report? Need help with next steps? Our team is here to help you succeed. Just reply to this email or schedule a call with our experts.
        </p>
        
        <p style="font-size: 16px; line-height: 1.7; color: #B3B3B3; margin-bottom: 0;">
          To your success,<br>
          <span style="color: #FACC15; font-weight: 600;">Uaicode Team</span>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0A0A0A; padding: 32px 40px; text-align: center; border-top: 1px solid #2A2A2A;">
        <div style="margin: 0 0 20px 0;">
          <a href="https://uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Website</a>
          <span style="color: #2A2A2A;">•</span>
          <a href="https://linkedin.com/company/uaicode" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">LinkedIn</a>
          <span style="color: #2A2A2A;">•</span>
          <a href="mailto:hello@uaicode.ai" style="color: #B3B3B3; text-decoration: none; font-size: 13px; margin: 0 8px;">Support</a>
        </div>
        <p style="color: #B3B3B3; font-size: 13px; line-height: 1.6; margin: 0 0 16px 0;">
          © ${new Date().getFullYear()} UaiCode. All rights reserved.<br>
          You're receiving this email because you generated a report at PlanningMySaaS.
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
    const { 
      email, 
      fullName, 
      reportId, 
      projectName, 
      viabilityScore, 
      complexityScore, 
      planType, 
      industry 
    }: ReportReadyRequest = await req.json();

    if (!email || !fullName || !reportId || !projectName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, fullName, reportId, projectName" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = generateReportReadyEmail(
      fullName,
      reportId,
      projectName,
      viabilityScore || 0,
      complexityScore || 0,
      planType || "starter",
      industry || "Technology"
    );

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PlanningMySaaS <noreply@uaicode.ai>",
        to: [email],
        subject: `📊 Your SaaS Validation Report for "${projectName}" is Ready!`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Report ready email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending report ready email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
