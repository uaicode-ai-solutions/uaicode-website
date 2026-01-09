import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0?target=deno";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterWelcomeRequest {
  email: string;
  source?: string;
}

const generateWelcomeEmail = (email: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to UaiCode Insights</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0A0A0A;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #141414; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
              
              <!-- Header with Gold Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%); padding: 40px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #141414; letter-spacing: -0.5px;">
                    UaiCode
                  </h1>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #422006; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">
                    AI-Powered Innovation
                  </p>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 48px 40px;">
                  <!-- Welcome Title -->
                  <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #FFFFFF; text-align: center;">
                    Welcome to UaiCode Insights! 🚀
                  </h2>
                  
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.7; color: #B3B3B3; text-align: center;">
                    You're now part of an exclusive community of forward-thinking entrepreneurs and tech innovators who are shaping the future with AI.
                  </p>
                  
                  <!-- Benefits Card -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1F1F1F; border-radius: 12px; border: 1px solid #2A2A2A;">
                    <tr>
                      <td style="padding: 32px;">
                        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #FACC15;">
                          What you'll receive:
                        </h3>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td style="width: 28px; vertical-align: top;">
                                    <span style="color: #FACC15; font-size: 16px;">✓</span>
                                  </td>
                                  <td style="color: #E5E5E5; font-size: 15px; line-height: 1.5;">
                                    Weekly AI & automation insights to transform your business
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td style="width: 28px; vertical-align: top;">
                                    <span style="color: #FACC15; font-size: 16px;">✓</span>
                                  </td>
                                  <td style="color: #E5E5E5; font-size: 15px; line-height: 1.5;">
                                    Exclusive MVP development tips and strategies
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td style="width: 28px; vertical-align: top;">
                                    <span style="color: #FACC15; font-size: 16px;">✓</span>
                                  </td>
                                  <td style="color: #E5E5E5; font-size: 15px; line-height: 1.5;">
                                    Early access to new resources and tools
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td style="width: 28px; vertical-align: top;">
                                    <span style="color: #FACC15; font-size: 16px;">✓</span>
                                  </td>
                                  <td style="color: #E5E5E5; font-size: 15px; line-height: 1.5;">
                                    Industry trends and analysis from AI experts
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px;">
                    <tr>
                      <td align="center">
                        <a href="https://uaicode.ai/newsletter" 
                           style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #141414; text-decoration: none; font-size: 16px; font-weight: 600; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.3);">
                          Explore Our Latest Insights
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Thank You Note -->
                  <p style="margin: 40px 0 0 0; font-size: 15px; line-height: 1.7; color: #808080; text-align: center;">
                    Thank you for joining us on this journey. We're excited to help you unlock the power of AI for your business.
                  </p>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 0 40px;">
                  <hr style="border: none; border-top: 1px solid #2A2A2A; margin: 0;">
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px;">
                  <!-- Social Links -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <a href="https://www.youtube.com/@uaicodeai" style="display: inline-block; margin: 0 8px; color: #808080; text-decoration: none; font-size: 14px;">YouTube</a>
                        <span style="color: #404040;">•</span>
                        <a href="https://www.linkedin.com/company/uaicodeai" style="display: inline-block; margin: 0 8px; color: #808080; text-decoration: none; font-size: 14px;">LinkedIn</a>
                        <span style="color: #404040;">•</span>
                        <a href="https://www.instagram.com/uaicode.ai" style="display: inline-block; margin: 0 8px; color: #808080; text-decoration: none; font-size: 14px;">Instagram</a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 8px 0; font-size: 13px; color: #606060;">
                          © 2025 UaiCode. All rights reserved.
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #505050;">
                          You received this email because you subscribed to UaiCode Insights.
                        </p>
                      </td>
                    </tr>
                  </table>
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
    const { email, source }: NewsletterWelcomeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending welcome email to ${email} (source: ${source || 'unknown'})`);

    const emailResponse = await resend.emails.send({
      from: "UaiCode <no-reply@uaicode.ai>",
      to: [email],
      subject: "Welcome to UaiCode Insights! 🚀",
      html: generateWelcomeEmail(email),
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
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
