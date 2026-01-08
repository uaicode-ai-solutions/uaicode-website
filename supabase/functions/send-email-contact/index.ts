import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0?target=deno";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

serve(async (req) => {
  console.log("=== SEND EMAIL CONTACT STARTED ===");

  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Form data received:", JSON.stringify({ name: formData.name, email: formData.email }));

    // Client confirmation email
    const clientEmailResult = await resend.emails.send({
      from: "UaiCode <no-reply@uaicode.ai>",
      to: [formData.email],
      subject: "We received your message - UaiCode",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #141414; padding: 0;">
          <div style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); padding: 30px; text-align: center;">
            <h1 style="color: #141414; margin: 0; font-size: 28px; font-weight: bold;">UaiCode</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #FFFFFF; margin: 0 0 20px 0; font-size: 22px;">Hello, ${formData.name}! 👋</h2>
            <p style="color: #E5E5E5; line-height: 1.7; font-size: 16px; margin: 0 0 16px 0;">
              We received your message and we're excited to connect with you!
            </p>
            <p style="color: #E5E5E5; line-height: 1.7; font-size: 16px; margin: 0 0 24px 0;">
              Our team will review your request and get back to you within <span style="color: #FACC15; font-weight: 600;">24-48 business hours</span>.
            </p>
            <div style="background: #22272A; padding: 20px; border-radius: 8px; border-left: 4px solid #FACC15; margin: 24px 0;">
              <p style="color: #B3B3B3; margin: 0; font-style: italic; font-size: 14px;">
                "${formData.message.substring(0, 200)}${formData.message.length > 200 ? '...' : ''}"
              </p>
            </div>
            <p style="color: #E5E5E5; line-height: 1.7; font-size: 16px; margin: 24px 0 0 0;">
              In the meantime, feel free to explore more about our services at 
              <a href="https://uaicode.ai" style="color: #FACC15; text-decoration: none; font-weight: 600;">uaicode.ai</a>
            </p>
          </div>
          <div style="border-top: 1px solid #333; padding: 24px 30px; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              UaiCode - Transforming ideas into digital solutions
            </p>
          </div>
        </div>
      `,
    });
    console.log("Client email sent:", clientEmailResult);

    // Team notification email with Reply-To
    const teamEmailResult = await resend.emails.send({
      from: "Website UaiCode <no-reply@uaicode.ai>",
      to: ["hello@uaicode.ai"],
      reply_to: formData.email,
      subject: `New contact via website - ${formData.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #141414; padding: 0;">
          <div style="background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); padding: 24px; text-align: center;">
            <h2 style="color: #141414; margin: 0; font-size: 20px;">📬 New Contact via Website</h2>
          </div>
          <div style="padding: 30px;">
            <div style="background: #22272A; padding: 24px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 8px 0; color: #E5E5E5;"><strong style="color: #FACC15;">Name:</strong> ${formData.name}</p>
              <p style="margin: 8px 0; color: #E5E5E5;"><strong style="color: #FACC15;">Email:</strong> <a href="mailto:${formData.email}" style="color: #FACC15;">${formData.email}</a></p>
              ${formData.phone ? `<p style="margin: 8px 0; color: #E5E5E5;"><strong style="color: #FACC15;">Phone:</strong> ${formData.phone}</p>` : ''}
              <p style="margin: 8px 0; color: #E5E5E5;"><strong style="color: #FACC15;">Date:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} (UTC)</p>
            </div>
            <div style="background: #1A1A1A; border: 1px solid #333; padding: 24px; border-radius: 8px;">
              <h3 style="color: #FACC15; margin: 0 0 16px 0; font-size: 16px;">Message:</h3>
              <p style="color: #E5E5E5; line-height: 1.7; white-space: pre-wrap; margin: 0;">${formData.message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
              💡 Reply to this email to contact ${formData.name} directly
            </p>
          </div>
        </div>
      `,
    });
    console.log("Team email sent:", teamEmailResult);

    console.log("=== SEND EMAIL CONTACT SUCCESS ===");

    return new Response(
      JSON.stringify({ 
        title: "Success", 
        message: "Message sent successfully!" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("=== SEND EMAIL CONTACT ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : error);
    
    return new Response(
      JSON.stringify({ 
        title: "Error", 
        message: "Failed to send message. Please try again." 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
