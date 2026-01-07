import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASSISTANT_ID = '26c9a3fb-ec2d-4dd9-800d-ae1d91ba6962';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, previousChatId } = await req.json();

    const VAPI_PRIVATE_KEY = Deno.env.get('VAPI_PRIVATE_KEY');
    if (!VAPI_PRIVATE_KEY) {
      console.error('VAPI_PRIVATE_KEY is not configured');
      throw new Error('VAPI_PRIVATE_KEY is not configured');
    }

    console.log('VAPI chat - sending message:', message?.substring(0, 50));
    console.log('VAPI chat - previousChatId:', previousChatId || 'none');

    const requestBody: Record<string, unknown> = {
      assistantId: ASSISTANT_ID,
      input: message,
    };

    if (previousChatId) {
      requestBody.previousChatId = previousChatId;
    }

    const response = await fetch('https://api.vapi.ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VAPI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: 'Authentication error with voice service.' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to connect to assistant' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('VAPI chat - response received, chatId:', data.id);
    console.log('VAPI chat - full response structure:', JSON.stringify(data, null, 2));
    
    // Find the last assistant message with content in the output array
    // VAPI returns multiple items: tool_calls, tool responses, and final assistant message
    const assistantMessages = data.output?.filter(
      (item: { role: string; content?: unknown }) => item.role === 'assistant' && item.content
    ) || [];
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

    // Extract text from content - can be string or array of objects with text property
    let outputContent = "Sorry, I couldn't process that.";
    if (lastAssistantMessage?.content) {
      if (typeof lastAssistantMessage.content === 'string') {
        outputContent = lastAssistantMessage.content;
      } else if (Array.isArray(lastAssistantMessage.content)) {
        outputContent = lastAssistantMessage.content[0]?.text || outputContent;
      }
    }
    
    console.log('VAPI chat - extracted content:', outputContent.substring(0, 100));
    
    // Check for scheduling action
    const shouldSchedule = outputContent.includes('[SCHEDULE_MEETING]');
    const cleanMessage = outputContent.replace('[SCHEDULE_MEETING]', '').trim();

    return new Response(
      JSON.stringify({ 
        chatId: data.id,
        output: cleanMessage,
        action: shouldSchedule ? 'schedule' : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in vapi-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
