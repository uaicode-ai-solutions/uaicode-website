import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CALCOM_API_KEY = Deno.env.get('CALCOM_API_KEY');

serve(async (req) => {
  console.log('=== calcom-cancel-booking function called ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, email, reason } = await req.json();
    
    console.log('Cancel request:', { bookingId, email, reason });

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: 'Booking ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SECURITY: Email is REQUIRED to verify ownership before cancelling
    if (!email) {
      console.warn('SECURITY: Attempt to cancel booking without email verification');
      return new Response(
        JSON.stringify({ 
          error: 'Email é obrigatório para cancelar o agendamento',
          message: 'Por favor, informe seu email para que eu possa verificar e cancelar o agendamento.'
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

    // STEP 1: First, fetch the booking to verify ownership
    const getBookingUrl = `https://api.cal.com/v1/bookings/${bookingId}?apiKey=${CALCOM_API_KEY}`;
    
    console.log('Step 1: Fetching booking to verify ownership...');

    const getResponse = await fetch(getBookingUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      if (getResponse.status === 404) {
        return new Response(
          JSON.stringify({ 
            error: 'Agendamento não encontrado',
            message: 'Não encontrei um agendamento com esse ID.'
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await getResponse.text();
      console.error('Cal.com API error fetching booking:', getResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch booking', details: errorText }),
        { status: getResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const bookingData = await getResponse.json();
    const booking = bookingData.booking || bookingData;

    // SECURITY: Verify that the booking belongs to the requested email
    const normalizedEmail = email.toLowerCase().trim();
    const attendeeEmails = booking.attendees?.map((a: any) => a.email?.toLowerCase().trim()) || [];
    
    if (!attendeeEmails.includes(normalizedEmail)) {
      console.warn('SECURITY: Email mismatch - user tried to cancel booking that does not belong to them');
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

    console.log('Ownership verified. Proceeding with cancellation...');

    // Check if already cancelled
    if (booking.status === 'CANCELLED') {
      return new Response(
        JSON.stringify({ 
          success: true,
          already_cancelled: true,
          message: 'Este agendamento já estava cancelado.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 2: Cancel the booking
    const cancelUrl = `https://api.cal.com/v1/bookings/${bookingId}/cancel?apiKey=${CALCOM_API_KEY}`;
    
    console.log('Step 2: Cancelling booking...');

    const cancelPayload: any = {};
    if (reason) {
      cancelPayload.cancellationReason = reason;
    }

    const cancelResponse = await fetch(cancelUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelPayload),
    });

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      console.error('Cal.com API error cancelling:', cancelResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to cancel booking', details: errorText }),
        { status: cancelResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Booking cancelled successfully');

    // Format the cancelled booking info for the voice agent
    const startDate = new Date(booking.startTime);
    const formattedDate = startDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      timeZone: 'America/Sao_Paulo'
    });
    const formattedTime = startDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        cancelled_booking_id: bookingId,
        cancelled_booking_uid: booking.uid,
        original_date: booking.startTime,
        message: `Seu agendamento de ${formattedDate} às ${formattedTime} foi cancelado com sucesso. Você receberá um email de confirmação do cancelamento.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Exception in calcom-cancel-booking:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
