import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface EmailKyleFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  reportId?: string;
  projectName?: string;
}

const sendEmail = async (to: string[], from: string, subject: string, html: string) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const data = await res.json();
  
  if (!res.ok) {
    console.error("[pms-email-kyle] Resend API error:", data);
    throw new Error(data.message || "Failed to send email");
  }
  
  return data;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const body: EmailKyleFormData = await req.json();
    const { name, email, phone, message, reportId, projectName } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 1. Send notification to sales team
    const salesEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #FACC15; font-size: 24px; margin: 0;">New Lead from PlanningMySaaS</h1>
            <p style="color: #A1A1AA; font-size: 14px; margin-top: 8px;">Someone wants to talk about their project!</p>
          </div>
          
          <!-- Lead Info Card -->
          <div style="background: linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%); border: 1px solid #27272A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 16px 0; border-bottom: 1px solid #27272A; padding-bottom: 12px;">Contact Information</h2>
            
            <p style="color: #E4E4E7; margin: 8px 0;"><strong style="color: #FACC15;">Name:</strong> ${name}</p>
            <p style="color: #E4E4E7; margin: 8px 0;"><strong style="color: #FACC15;">Email:</strong> <a href="mailto:${email}" style="color: #60A5FA; text-decoration: none;">${email}</a></p>
            ${phone ? `<p style="color: #E4E4E7; margin: 8px 0;"><strong style="color: #FACC15;">Phone:</strong> ${phone}</p>` : ''}
            ${projectName ? `<p style="color: #E4E4E7; margin: 8px 0;"><strong style="color: #FACC15;">Project:</strong> ${projectName}</p>` : ''}
            ${reportId ? `<p style="color: #E4E4E7; margin: 8px 0;"><strong style="color: #FACC15;">Report ID:</strong> <code style="background: #27272A; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${reportId}</code></p>` : ''}
          </div>
          
          <!-- Message Card -->
          <div style="background: linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%); border: 1px solid #27272A; border-radius: 12px; padding: 24px;">
            <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 16px 0; border-bottom: 1px solid #27272A; padding-bottom: 12px;">Message</h2>
            <p style="color: #E4E4E7; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <!-- CTA -->
          <div style="text-align: center; margin-top: 32px;">
            <a href="mailto:${email}?subject=Re: Your PlanningMySaaS Project" style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #0A0A0A; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #27272A;">
            <p style="color: #71717A; font-size: 12px; margin: 0;">This lead came from the "Email Kyle" button on PlanningMySaaS Report Dashboard</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(
      ["sales@uaicode.ai"],
      "Kyle - UaiCode Sales <noreply@uaicode.ai>",
      `🚀 New Lead from PlanningMySaaS: ${name}`,
      salesEmailHtml
    );

    // 2. Send confirmation to the user
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #FACC15; font-size: 28px; margin: 0;">Hey ${name.split(' ')[0]}!</h1>
            <p style="color: #A1A1AA; font-size: 16px; margin-top: 8px;">Thanks for reaching out</p>
          </div>
          
          <!-- Content Card -->
          <div style="background: linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%); border: 1px solid #27272A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #E4E4E7; line-height: 1.8; margin: 0 0 16px 0;">
              I got your message and I'm excited to learn more about your project${projectName ? ` <strong style="color: #FACC15;">"${projectName}"</strong>` : ''}!
            </p>
            <p style="color: #E4E4E7; line-height: 1.8; margin: 0 0 16px 0;">
              I'll personally review your message and get back to you within <strong style="color: #FACC15;">24 hours</strong> (usually much faster!).
            </p>
            <p style="color: #E4E4E7; line-height: 1.8; margin: 0;">
              In the meantime, feel free to schedule a call if you'd like to chat sooner.
            </p>
          </div>
          
          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://cal.com/uaicode/consultation" style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #0A0A0A; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 16px;">Schedule a Call</a>
          </div>
          
          <!-- Signature -->
          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #27272A;">
            <p style="color: #E4E4E7; font-size: 14px; margin: 0 0 4px 0;">Talk soon! 🚀</p>
            <p style="color: #FACC15; font-weight: 600; margin: 0;">Kyle</p>
            <p style="color: #71717A; font-size: 12px; margin: 4px 0 0 0;">Sales Consultant at UaiCode</p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #52525B; font-size: 11px; margin: 0;">
              UaiCode - AI-Powered Software Development<br>
              <a href="https://uaicode.ai" style="color: #71717A; text-decoration: none;">uaicode.ai</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(
      [email],
      "Kyle from UaiCode <noreply@uaicode.ai>",
      "Thanks for reaching out! 🎯",
      userEmailHtml
    );

    console.log(`[pms-email-kyle] Email sent successfully for ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("[pms-email-kyle] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send email";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
