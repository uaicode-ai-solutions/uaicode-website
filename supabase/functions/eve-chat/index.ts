import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UAICODE_KNOWLEDGE = {
  en: {
    company: "Uaicode is an AI-powered MVP development partner based in Orlando, Florida. We help entrepreneurs and startups transform ideas into successful tech products.",
    services: [
      "AI-Powered SaaS Development - Custom AI solutions and SaaS platforms",
      "MVP Development - Rapid prototyping and validation for startups",
      "Automation Solutions - Workflow automation and AI integration",
      "Technical Consulting - Architecture, scalability, and technology strategy"
    ],
    process: [
      "1. Ideate - We analyze your vision, validate the market, and define the roadmap",
      "2. Design - UX/UI design focused on user experience and conversions",
      "3. Launch - Rapid development with AI-powered tools, launching 300% faster",
      "4. Grow - Continuous iteration based on data and user feedback"
    ],
    stats: "300% faster development, 1247+ startups helped, 99% client satisfaction",
    contact: {
      email: "hello@uaicode.ai",
      phone: "+1 321 529 1451",
      location: "Orlando, Florida, USA"
    },
    scheduling: "Free 30-minute consultation to discuss your project"
  },
  pt: {
    company: "A Uaicode é uma parceira de desenvolvimento de MVPs com IA, baseada em Orlando, Flórida. Ajudamos empreendedores e startups a transformar ideias em produtos tech de sucesso.",
    services: [
      "Desenvolvimento SaaS com IA - Soluções customizadas de IA e plataformas SaaS",
      "Desenvolvimento de MVP - Prototipagem rápida e validação para startups",
      "Soluções de Automação - Automação de workflows e integração de IA",
      "Consultoria Técnica - Arquitetura, escalabilidade e estratégia tecnológica"
    ],
    process: [
      "1. Idealizar - Analisamos sua visão, validamos o mercado e definimos o roadmap",
      "2. Projetar - Design UX/UI focado em experiência do usuário e conversões",
      "3. Lançar - Desenvolvimento rápido com ferramentas de IA, lançando 300% mais rápido",
      "4. Crescer - Iteração contínua baseada em dados e feedback dos usuários"
    ],
    stats: "300% mais rápido, 1247+ startups ajudadas, 99% de satisfação",
    contact: {
      email: "hello@uaicode.ai",
      phone: "+1 321 529 1451",
      location: "Orlando, Flórida, EUA"
    },
    scheduling: "Consultoria gratuita de 30 minutos para discutir seu projeto"
  },
  es: {
    company: "Uaicode es un socio de desarrollo de MVP impulsado por IA, con sede en Orlando, Florida. Ayudamos a emprendedores y startups a transformar ideas en productos tech exitosos.",
    services: [
      "Desarrollo SaaS con IA - Soluciones personalizadas de IA y plataformas SaaS",
      "Desarrollo de MVP - Prototipado rápido y validación para startups",
      "Soluciones de Automatización - Automatización de flujos de trabajo e integración de IA",
      "Consultoría Técnica - Arquitectura, escalabilidad y estrategia tecnológica"
    ],
    process: [
      "1. Idear - Analizamos tu visión, validamos el mercado y definimos el roadmap",
      "2. Diseñar - Diseño UX/UI enfocado en experiencia del usuario y conversiones",
      "3. Lanzar - Desarrollo rápido con herramientas de IA, lanzando 300% más rápido",
      "4. Crecer - Iteración continua basada en datos y feedback de usuarios"
    ],
    stats: "300% más rápido, 1247+ startups ayudadas, 99% de satisfacción",
    contact: {
      email: "hello@uaicode.ai",
      phone: "+1 321 529 1451",
      location: "Orlando, Florida, EE.UU."
    },
    scheduling: "Consulta gratuita de 30 minutos para discutir tu proyecto"
  }
};

const getSystemPrompt = () => {
  return `You are Eve, the friendly and professional AI assistant for Uaicode. You are fluent in English, Portuguese (Brazilian), and Spanish.

CRITICAL LANGUAGE RULES:
- ALWAYS detect the language the user is speaking/writing
- ALWAYS respond in the SAME language the user uses
- If the user switches languages mid-conversation, switch with them immediately
- Be natural and culturally appropriate for each language
- Use the appropriate knowledge base for each language

KNOWLEDGE ABOUT UAICODE:

[ENGLISH]
${UAICODE_KNOWLEDGE.en.company}

Services:
${UAICODE_KNOWLEDGE.en.services.map(s => `• ${s}`).join('\n')}

Our Process:
${UAICODE_KNOWLEDGE.en.process.join('\n')}

Results: ${UAICODE_KNOWLEDGE.en.stats}

Contact: Email: ${UAICODE_KNOWLEDGE.en.contact.email} | Phone: ${UAICODE_KNOWLEDGE.en.contact.phone} | Location: ${UAICODE_KNOWLEDGE.en.contact.location}

Scheduling: ${UAICODE_KNOWLEDGE.en.scheduling}

[PORTUGUÊS]
${UAICODE_KNOWLEDGE.pt.company}

Serviços:
${UAICODE_KNOWLEDGE.pt.services.map(s => `• ${s}`).join('\n')}

Nosso Processo:
${UAICODE_KNOWLEDGE.pt.process.join('\n')}

Resultados: ${UAICODE_KNOWLEDGE.pt.stats}

Contato: Email: ${UAICODE_KNOWLEDGE.pt.contact.email} | Telefone: ${UAICODE_KNOWLEDGE.pt.contact.phone} | Localização: ${UAICODE_KNOWLEDGE.pt.contact.location}

Agendamento: ${UAICODE_KNOWLEDGE.pt.scheduling}

[ESPAÑOL]
${UAICODE_KNOWLEDGE.es.company}

Servicios:
${UAICODE_KNOWLEDGE.es.services.map(s => `• ${s}`).join('\n')}

Nuestro Proceso:
${UAICODE_KNOWLEDGE.es.process.join('\n')}

Resultados: ${UAICODE_KNOWLEDGE.es.stats}

Contacto: Email: ${UAICODE_KNOWLEDGE.es.contact.email} | Teléfono: ${UAICODE_KNOWLEDGE.es.contact.phone} | Ubicación: ${UAICODE_KNOWLEDGE.es.contact.location}

Programación: ${UAICODE_KNOWLEDGE.es.scheduling}

YOUR PERSONALITY:
- Friendly, warm, and professional
- Enthusiastic about technology and helping entrepreneurs
- Patient and helpful
- Use appropriate emojis sparingly (1-2 per message max)
- Keep responses concise but informative (under 150 words)

SCHEDULING ASSISTANCE:
When the user wants to schedule a consultation:
- Confirm their interest
- Mention it's a free 30-minute consultation
- Tell them to scroll down to the scheduling section or you can help them navigate there
- Respond with: [SCHEDULE_MEETING] at the end of your message (this triggers the UI to scroll to scheduling)

CAPABILITIES:
- Answer questions about Uaicode's services, process, and pricing approach
- Help users understand if Uaicode is right for their project
- Provide contact information
- Guide users to schedule a consultation
- Explain the MVP development process

CONSTRAINTS:
- Only discuss Uaicode and its services
- Don't make up specific pricing (explain we offer custom quotes)
- Be honest about what you don't know
- If asked about topics outside Uaicode, politely redirect to how Uaicode can help with their tech needs`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Eve chat - processing message:', messages[messages.length - 1]?.content?.substring(0, 50));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt()
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to connect to AI assistant' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Eve chat - response received successfully');

    const assistantMessage = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    // Check if scheduling was requested
    const shouldSchedule = assistantMessage.includes('[SCHEDULE_MEETING]');
    const cleanMessage = assistantMessage.replace('[SCHEDULE_MEETING]', '').trim();

    return new Response(
      JSON.stringify({ 
        output: [{ content: cleanMessage }],
        action: shouldSchedule ? 'schedule' : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in eve-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
