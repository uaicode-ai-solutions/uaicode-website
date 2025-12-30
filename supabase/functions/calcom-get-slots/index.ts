import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CALCOM_API_KEY = Deno.env.get('CALCOM_API_KEY');
const CALCOM_EVENT_TYPE_ID = Deno.env.get('CALCOM_EVENT_TYPE_ID');

serve(async (req) => {
  console.log('=== calcom-get-slots function called ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, eventTypeId } = await req.json();
    
    console.log('Request params:', { date, eventTypeId });

    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date is required (format: YYYY-MM-DD)' }),
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
    const typeId = CALCOM_EVENT_TYPE_ID || eventTypeId;
    console.log('Final typeId being used:', typeId);
    
    if (!typeId) {
      console.error('CALCOM_EVENT_TYPE_ID not configured and no eventTypeId provided');
      return new Response(
        JSON.stringify({ error: 'Event type ID is required. Configure CALCOM_EVENT_TYPE_ID or pass eventTypeId.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Using eventTypeId:', typeId);
    
    // Calculate start and end of the requested date
    const startTime = `${date}T00:00:00Z`;
    const endTime = `${date}T23:59:59Z`;

    const calcomUrl = `https://api.cal.com/v1/slots?apiKey=${CALCOM_API_KEY}&eventTypeId=${typeId}&startTime=${startTime}&endTime=${endTime}`;
    
    console.log('Calling Cal.com API for slots...');

    const response = await fetch(calcomUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cal.com API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch slots from Cal.com', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Cal.com response:', JSON.stringify(data));

    // Format slots for the voice agent
    const slots = data.slots || {};
    const formattedSlots = Object.entries(slots).flatMap(([dateKey, times]: [string, any]) => 
      times.map((slot: any) => ({
        date: dateKey,
        time: slot.time,
        formatted: new Date(slot.time).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        })
      }))
    );

    return new Response(
      JSON.stringify({ 
        success: true,
        date,
        available_slots: formattedSlots,
        total_slots: formattedSlots.length,
        message: formattedSlots.length > 0 
          ? `Encontrei ${formattedSlots.length} horários disponíveis para ${date}`
          : `Não há horários disponíveis para ${date}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Exception in calcom-get-slots:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
