import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CALCOM_API_KEY = Deno.env.get('CALCOM_API_KEY');
const CALCOM_EVENT_TYPE_ID = Deno.env.get('CALCOM_EVENT_TYPE_ID');

serve(async (req) => {
  console.log('=== calcom-create-booking function called ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone,
      start, // ISO datetime string
      eventTypeId,
      notes,
      session_id,
      language = 'pt-BR'
    } = await req.json();
    
    console.log('Booking request:', { name, email, phone, start, eventTypeId, session_id });

    // Validate required fields
    if (!name || !email || !start) {
      return new Response(
        JSON.stringify({ error: 'Required fields: name, email, start (datetime)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!CALCOM_API_KEY) {
      console.error('CALCOM_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Cal.com API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SEMPRE priorizar o secret sobre o valor do request para evitar conflitos
    console.log('CALCOM_EVENT_TYPE_ID from secret:', CALCOM_EVENT_TYPE_ID);
    console.log('eventTypeId from request:', eventTypeId);
    const typeIdStr = CALCOM_EVENT_TYPE_ID || eventTypeId;
    console.log('Final typeId string being used:', typeIdStr);
    
    if (!typeIdStr) {
      console.error('CALCOM_EVENT_TYPE_ID not configured and no eventTypeId provided');
      return new Response(
        JSON.stringify({ error: 'Event type ID is required. Configure CALCOM_EVENT_TYPE_ID or pass eventTypeId.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Converter para número - Cal.com exige eventTypeId como number, não string
    const numericTypeId = parseInt(typeIdStr, 10);
    if (isNaN(numericTypeId)) {
      console.error('Invalid eventTypeId - not a valid number:', typeIdStr);
      return new Response(
        JSON.stringify({ error: 'Invalid eventTypeId: must be a valid number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Using eventTypeId (as number):', numericTypeId);

    // Create booking via Cal.com API
    const calcomUrl = `https://api.cal.com/v1/bookings?apiKey=${CALCOM_API_KEY}`;
    
    const bookingPayload = {
      eventTypeId: numericTypeId,
      start,
      responses: {
        name,
        email,
        attendeePhoneNumber: phone || '',
        notes: notes || '',
      },
      metadata: {
        session_id: session_id || '',
        source: 'voice_agent_eve'
      },
      language,
      timeZone: 'America/Sao_Paulo'
    };

    console.log('Creating Cal.com booking with payload:', JSON.stringify(bookingPayload));

    const response = await fetch(calcomUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingPayload),
    });

    const responseText = await response.text();
    console.log('Cal.com response status:', response.status);
    console.log('Cal.com response:', responseText);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to create booking', details: responseText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const bookingData = JSON.parse(responseText);
    const bookingId = bookingData.id?.toString() || bookingData.uid;

    // Save/update lead in database with booking info
    if (session_id) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check if lead exists for this session
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('session_id', session_id)
          .single();

        if (existingLead) {
          // Update existing lead with booking info
          await supabase
            .from('leads')
            .update({
              booking_id: bookingId,
              booking_date: new Date(start).toISOString(),
            })
            .eq('id', existingLead.id);
          console.log('Updated existing lead with booking info');
        } else {
          // Create new lead with booking info
          await supabase
            .from('leads')
            .insert({
              full_name: name,
              email: email.toLowerCase().trim(),
              phone: phone || '',
              project_description: notes,
              booking_id: bookingId,
              booking_date: new Date(start).toISOString(),
              session_id,
              source: 'voice_agent',
              language
            });
          console.log('Created new lead with booking info');
        }
      } catch (dbError) {
        console.error('Error saving lead:', dbError);
        // Don't fail the booking if lead save fails
      }
    }

    // Format response for the voice agent
    const bookingDate = new Date(start);
    const formattedDate = bookingDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      timeZone: 'America/Sao_Paulo'
    });
    const formattedTime = bookingDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        booking_id: bookingId,
        booking_uid: bookingData.uid,
        start_time: start,
        attendee_name: name,
        attendee_email: email,
        message: `Agendamento confirmado para ${formattedDate} às ${formattedTime}. Você receberá um email de confirmação em ${email}.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Exception in calcom-create-booking:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
