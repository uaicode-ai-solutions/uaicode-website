import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('=== eve-conversation-token function called ===');
  console.log('Request method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const ELEVENLABS_EVE_AGENT_ID = Deno.env.get('ELEVENLABS_EVE_AGENT_ID');

    console.log('ELEVENLABS_API_KEY configured:', !!ELEVENLABS_API_KEY);
    console.log('ELEVENLABS_EVE_AGENT_ID configured:', !!ELEVENLABS_EVE_AGENT_ID);

    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key is not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!ELEVENLABS_EVE_AGENT_ID) {
      console.error('ELEVENLABS_EVE_AGENT_ID is not configured');
      return new Response(
        JSON.stringify({ error: 'Eve Agent ID is not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body to get mode (webrtc or websocket)
    let mode = "webrtc"; // default to webrtc (recommended)
    try {
      const body = await req.json();
      if (body.mode === "websocket") {
        mode = "websocket";
      }
    } catch {
      // No body or invalid JSON, use default mode
    }

    console.log('Mode:', mode);

    let apiUrl: string;

    if (mode === "webrtc") {
      // WebRTC uses /conversation/token endpoint
      apiUrl = `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_EVE_AGENT_ID}`;
    } else {
      // WebSocket uses /get-signed-url endpoint
      apiUrl = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${ELEVENLABS_EVE_AGENT_ID}`;
    }

    console.log('Calling ElevenLabs API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    console.log('ElevenLabs API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      
      // Parse error for better messages
      let errorMessage = `ElevenLabs API error (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.detail) {
          errorMessage = errorJson.detail;
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('ElevenLabs response keys:', Object.keys(data));

    // Build response based on mode
    const result: Record<string, string> = {
      agent_id: ELEVENLABS_EVE_AGENT_ID,
    };

    if (mode === "webrtc" && data.token) {
      result.token = data.token;
      console.log('Returning WebRTC token for Eve');
    } else if (mode === "websocket" && data.signed_url) {
      result.signed_url = data.signed_url;
      console.log('Returning WebSocket signed_url for Eve');
    } else {
      // Check if we got something anyway
      if (data.token) {
        result.token = data.token;
        console.log('Returning token (fallback) for Eve');
      } else if (data.signed_url) {
        result.signed_url = data.signed_url;
        console.log('Returning signed_url (fallback) for Eve');
      } else {
        console.error('No valid credential in ElevenLabs response:', JSON.stringify(data));
        return new Response(
          JSON.stringify({ error: 'ElevenLabs did not return valid credentials. Check Eve Agent ID.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('=== Returning success response for Eve ===');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('=== EXCEPTION in eve-conversation-token ===');
    console.error('Error:', error instanceof Error ? error.message : String(error));
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error in Eve voice service'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
