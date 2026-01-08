import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const CALCOM_API_KEY = Deno.env.get('CALCOM_API_KEY');

serve(async (req) => {
  console.log('=== calcom-get-booking function called ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, email } = await req.json();
    
    console.log('Request params:', { bookingId, email });

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: 'Booking ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SECURITY: Email is REQUIRED to verify ownership
    if (!email) {
      console.warn('SECURITY: Attempt to get booking without email verification');
      return new Response(
        JSON.stringify({ 
          error: 'Email é obrigatório para verificar seu agendamento',
          message: 'Por favor, informe seu email para que eu possa buscar os detalhes do agendamento.'
        }),
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

    const calcomUrl = `https://api.cal.com/v1/bookings/${bookingId}?apiKey=${CALCOM_API_KEY}`;
    
    console.log('Calling Cal.com API to get booking:', bookingId);

    const response = await fetch(calcomUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ 
            error: 'Agendamento não encontrado',
            message: 'Não encontrei um agendamento com esse ID.'
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Cal.com API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch booking from Cal.com', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const booking = data.booking || data;

    // SECURITY: Verify that the booking belongs to the requested email
    const normalizedEmail = email.toLowerCase().trim();
    const attendeeEmails = booking.attendees?.map((a: any) => a.email?.toLowerCase().trim()) || [];
    
    if (!attendeeEmails.includes(normalizedEmail)) {
      console.warn('SECURITY: Email mismatch - user tried to access booking that does not belong to them');
      console.warn('Requested email:', normalizedEmail);
      console.warn('Booking attendees:', attendeeEmails);
      
      // Return "not found" to avoid revealing that the booking exists
      return new Response(
        JSON.stringify({ 
          error: 'Agendamento não encontrado',
          message: 'Não encontrei um agendamento com esse ID associado ao seu email.'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Booking ownership verified for email:', normalizedEmail);

    // Format booking for the voice agent
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);

    const formattedBooking = {
      id: booking.id,
      uid: booking.uid,
      title: booking.title,
      status: booking.status,
      start_time: booking.startTime,
      end_time: booking.endTime,
      formatted_date: startDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo'
      }),
      formatted_time: startDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      }),
      duration_minutes: Math.round((endDate.getTime() - startDate.getTime()) / 60000),
      attendees: booking.attendees?.map((a: any) => ({
        name: a.name,
        email: a.email,
      })) || [],
      description: booking.description,
      location: booking.location,
    };

    const statusMap: Record<string, string> = {
      'ACCEPTED': 'confirmado',
      'PENDING': 'pendente de confirmação',
      'CANCELLED': 'cancelado',
      'REJECTED': 'rejeitado',
    };
    const statusMessage = statusMap[booking.status as string] || booking.status;

    return new Response(
      JSON.stringify({ 
        success: true,
        booking: formattedBooking,
        message: `Seu agendamento para ${formattedBooking.formatted_date} às ${formattedBooking.formatted_time} está ${statusMessage}. Duração: ${formattedBooking.duration_minutes} minutos.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Exception in calcom-get-booking:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
