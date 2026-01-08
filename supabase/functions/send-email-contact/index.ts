import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

    // Email de confirmação para o cliente
    const clientEmailResult = await resend.emails.send({
      from: "UaiCode <no-reply@uaicode.ai>",
      to: [formData.email],
      subject: "Recebemos sua mensagem - UaiCode",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #9b87f5; margin: 0;">UaiCode</h1>
          </div>
          <h2 style="color: #333;">Olá, ${formData.name}! 👋</h2>
          <p style="color: #555; line-height: 1.6;">
            Recebemos sua mensagem e ficamos muito felizes com seu contato!
          </p>
          <p style="color: #555; line-height: 1.6;">
            Nossa equipe irá analisar sua solicitação e retornaremos em até <strong>24-48 horas úteis</strong>.
          </p>
          <div style="background: #f5f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #6b5b95; margin: 0; font-style: italic;">
              "${formData.message.substring(0, 200)}${formData.message.length > 200 ? '...' : ''}"
            </p>
          </div>
          <p style="color: #555; line-height: 1.6;">
            Enquanto isso, que tal conhecer mais sobre nossos serviços em <a href="https://uaicode.ai" style="color: #9b87f5;">uaicode.ai</a>?
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            UaiCode - Transformando ideias em soluções digitais
          </p>
        </div>
      `,
    });
    console.log("Client email sent:", clientEmailResult);

    // Email de notificação para a equipe com Reply-To do cliente
    const teamEmailResult = await resend.emails.send({
      from: "Website UaiCode <no-reply@uaicode.ai>",
      to: ["hello@uaicode.ai"],
      replyTo: formData.email,
      subject: `Novo contato via site - ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #9b87f5;">📬 Novo Contato via Website</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nome:</strong> ${formData.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            ${formData.phone ? `<p style="margin: 10px 0;"><strong>Telefone:</strong> ${formData.phone}</p>` : ''}
            <p style="margin: 10px 0;"><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          </div>
          <div style="background: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Mensagem:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            💡 Responda este email para contatar diretamente ${formData.name}
          </p>
        </div>
      `,
    });
    console.log("Team email sent:", teamEmailResult);

    console.log("=== SEND EMAIL CONTACT SUCCESS ===");

    return new Response(
      JSON.stringify({ 
        title: "Sucesso", 
        message: "Mensagem enviada com sucesso!" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("=== SEND EMAIL CONTACT ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : error);
    
    return new Response(
      JSON.stringify({ 
        title: "Erro", 
        message: "Falha ao enviar mensagem. Tente novamente." 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
