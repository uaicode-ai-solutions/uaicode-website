import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      full_name, 
      email, 
      phone, 
      country_code,
      project_description,
      booking_id,
      booking_date,
      language,
      session_id 
    } = await req.json();

    console.log('Received lead data:', { full_name, email, phone, booking_id });

    // Basic validation
    if (!full_name || !email || !phone) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, phone' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert({
        full_name,
        email: email.toLowerCase().trim(),
        phone,
        country_code,
        project_description,
        booking_id,
        booking_date: booking_date ? new Date(booking_date).toISOString() : null,
        language,
        session_id,
        source: 'voice_agent'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving lead:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save lead', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Lead saved successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead_id: data.id,
        message: 'Lead saved successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Exception in save-lead:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
