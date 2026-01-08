import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Função para calcular distância de Levenshtein (similaridade entre strings)
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const CALCOM_API_KEY = Deno.env.get('CALCOM_API_KEY');

serve(async (req) => {
  console.log('=== calcom-get-bookings function called ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, status } = await req.json();
    
    console.log('Request params:', { email, status });

    // SECURITY: Email is REQUIRED to filter bookings - prevents data leakage
    if (!email) {
      console.warn('SECURITY: Attempt to list bookings without email filter');
      return new Response(
        JSON.stringify({ 
          error: 'Email é obrigatório para buscar seus agendamentos',
          message: 'Por favor, informe seu email para que eu possa buscar seus agendamentos.'
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

    // Build query params - ALWAYS filter by attendee email for security
    const queryParams = new URLSearchParams({
      apiKey: CALCOM_API_KEY,
    });

    // Add status filter if provided
    if (status) {
      queryParams.append('status', status);
    }

    const calcomUrl = `https://api.cal.com/v1/bookings?${queryParams.toString()}`;
    
    console.log('Calling Cal.com API to get all bookings...');

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
        JSON.stringify({ error: 'Failed to fetch bookings from Cal.com', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Cal.com returned', data.bookings?.length || 0, 'total bookings');

    // SECURITY: Filter bookings to only show those belonging to the requested email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Primeiro, tenta correspondência exata
    let userBookings = (data.bookings || []).filter((booking: any) => {
      const attendeeEmails = booking.attendees?.map((a: any) => a.email?.toLowerCase().trim()) || [];
      return attendeeEmails.includes(normalizedEmail);
    });

    // Se não encontrou correspondência exata, tenta fuzzy matching
    if (userBookings.length === 0) {
      console.log('No exact match found, trying fuzzy matching...');
      
      userBookings = (data.bookings || []).filter((booking: any) => {
        const attendeeEmails = booking.attendees?.map((a: any) => a.email?.toLowerCase().trim()) || [];
        
        return attendeeEmails.some((attendeeEmail: string) => {
          const distance = levenshteinDistance(normalizedEmail, attendeeEmail);
          // Permite diferença de até 2 caracteres (typos comuns de transcrição)
          const maxDistance = 2;
          const isSimilar = distance <= maxDistance;
          
          if (isSimilar && distance > 0) {
            console.log(`Fuzzy match found: "${normalizedEmail}" ~ "${attendeeEmail}" (distance: ${distance})`);
          }
          
          return isSimilar;
        });
      });
    }

    console.log('Filtered to', userBookings.length, 'bookings for email:', normalizedEmail);

    // Format bookings for the voice agent
    const formattedBookings = userBookings.map((booking: any) => {
      const startDate = new Date(booking.startTime);
      return {
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
          timeZone: 'America/Sao_Paulo'
        }),
        formatted_time: startDate.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        }),
      };
    });

    // Sort by start time (most recent first)
    formattedBookings.sort((a: any, b: any) => 
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

    let message = '';
    if (formattedBookings.length === 0) {
      message = `Não encontrei nenhum agendamento para o email ${email}.`;
    } else if (formattedBookings.length === 1) {
      const b = formattedBookings[0];
      message = `Você tem 1 agendamento: ${b.formatted_date} às ${b.formatted_time}.`;
    } else {
      message = `Você tem ${formattedBookings.length} agendamentos.`;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        email: normalizedEmail,
        bookings: formattedBookings,
        total: formattedBookings.length,
        message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Exception in calcom-get-bookings:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
