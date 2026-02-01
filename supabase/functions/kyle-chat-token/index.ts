import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('=== kyle-chat-token function called ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    // USA O AGENT ID DE CHAT - DIFERENTE DO VOICE!
    const ELEVENLABS_KYLE_AGENT_ID_CHAT = Deno.env.get('ELEVENLABS_KYLE_AGENT_ID_CHAT');

    console.log('Chat Agent ID configured:', !!ELEVENLABS_KYLE_AGENT_ID_CHAT);

    if (!ELEVENLABS_API_KEY || !ELEVENLABS_KYLE_AGENT_ID_CHAT) {
      console.error('Missing configuration - API Key:', !!ELEVENLABS_API_KEY, 'Chat Agent ID:', !!ELEVENLABS_KYLE_AGENT_ID_CHAT);
      return new Response(
        JSON.stringify({ error: 'Chat agent configuration missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sempre WebRTC para chat
    const apiUrl = `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_KYLE_AGENT_ID_CHAT}`;
    console.log('Fetching token from ElevenLabs...');

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Token received successfully');
    
    return new Response(
      JSON.stringify({ 
        token: data.token, 
        agent_id: ELEVENLABS_KYLE_AGENT_ID_CHAT 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('kyle-chat-token error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
