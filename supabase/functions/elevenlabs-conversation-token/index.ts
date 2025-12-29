import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('=== elevenlabs-conversation-token function called ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request - returning 204');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const ELEVENLABS_AGENT_ID = Deno.env.get('ELEVENLABS_AGENT_ID');

    console.log('Checking environment variables...');
    console.log('ELEVENLABS_API_KEY configured:', !!ELEVENLABS_API_KEY);
    console.log('ELEVENLABS_AGENT_ID configured:', !!ELEVENLABS_AGENT_ID);
    console.log('ELEVENLABS_AGENT_ID value:', ELEVENLABS_AGENT_ID);

    if (!ELEVENLABS_API_KEY) {
      console.error('ERROR: ELEVENLABS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key is not configured. Please add ELEVENLABS_API_KEY to secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!ELEVENLABS_AGENT_ID) {
      console.error('ERROR: ELEVENLABS_AGENT_ID is not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs Agent ID is not configured. Please add ELEVENLABS_AGENT_ID to secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiUrl = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${ELEVENLABS_AGENT_ID}`;
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
      console.error('ElevenLabs API error response:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `ElevenLabs API error (${response.status}): ${errorText}` 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('ElevenLabs API response received, signed_url present:', !!data.signed_url);

    if (!data.signed_url) {
      console.error('No signed_url in ElevenLabs response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'ElevenLabs did not return a signed URL. Please verify your Agent ID.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('=== Returning signed_url successfully ===');

    return new Response(
      JSON.stringify({ 
        signed_url: data.signed_url,
        agent_id: ELEVENLABS_AGENT_ID
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('=== EXCEPTION in elevenlabs-conversation-token ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred in voice service'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
