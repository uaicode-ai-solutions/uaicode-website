import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JourneyStep {
  step: number;
  title: string;
  description: string;
  revenuePoint: boolean;
}

interface GeneratedMockup {
  step: number;
  title: string;
  description: string;
  imageUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, saasIdea, companyName, steps } = await req.json();

    if (!submissionId || !steps || steps.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Starting mockup generation for submission: ${submissionId}`);
    console.log(`SaaS Idea: ${saasIdea}`);
    console.log(`Steps to generate: ${steps.length}`);

    const generatedMockups: GeneratedMockup[] = [];
    const MAX_RETRIES = 2;
    const RETRY_DELAY_MS = 2000;

    for (const step of steps.slice(0, 5) as JourneyStep[]) {
      console.log(`Generating mockup for step ${step.step}: ${step.title}`);

      const prompt = `Create a clean, modern SaaS dashboard screen mockup. 
App name: ${companyName}
App concept: ${saasIdea}
Screen purpose: ${step.title} - ${step.description}
${step.revenuePoint ? 'This is a revenue/conversion point in the user journey.' : ''}

Requirements:
- Modern, minimalist UI design with a professional light theme
- Clear visual hierarchy with the main action/content prominent
- Include realistic placeholder data relevant to the screen purpose
- Show navigation elements, sidebar or top bar as appropriate
- Use a cohesive color scheme (blues, purples, or greens work well)
- Include relevant icons and visual elements
- Make it look like a real production SaaS application
- 16:9 aspect ratio, horizontal layout
- Ultra high resolution`;

      let imageData = null;
      let attempts = 0;

      while (!imageData && attempts < MAX_RETRIES) {
        attempts++;
        console.log(`Attempt ${attempts}/${MAX_RETRIES} for step ${step.step}`);

        try {
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash-image-preview',
              messages: [
                { role: 'user', content: prompt }
              ],
              modalities: ['image', 'text']
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`AI API error for step ${step.step}:`, response.status, errorText);
            
            // Rate limit and payment errors return immediately
            if (response.status === 429) {
              return new Response(
                JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
                { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            if (response.status === 402) {
              return new Response(
                JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }),
                { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            
            // For other errors, retry
            if (attempts < MAX_RETRIES) {
              console.log(`HTTP error ${response.status}, retrying in ${RETRY_DELAY_MS}ms...`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
              continue;
            }
            break;
          }

          const data = await response.json();
          imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (!imageData && attempts < MAX_RETRIES) {
            console.log(`No image returned on attempt ${attempts}, retrying in ${RETRY_DELAY_MS}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          }
        } catch (stepError) {
          console.error(`Error on attempt ${attempts} for step ${step.step}:`, stepError);
          if (attempts < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          }
        }
      }

      if (!imageData) {
        console.error(`Failed to generate image for step ${step.step} after ${MAX_RETRIES} attempts`);
        continue;
      }

      // Extract base64 data and convert to Uint8Array
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Upload to Supabase Storage
      const fileName = `${submissionId}/step-${step.step}-${Date.now()}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('screen-mockups')
        .upload(fileName, binaryData, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error(`Upload error for step ${step.step}:`, uploadError);
        continue;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('screen-mockups')
        .getPublicUrl(fileName);

      generatedMockups.push({
        step: step.step,
        title: step.title,
        description: step.description,
        imageUrl: publicUrlData.publicUrl
      });

      console.log(`Successfully generated mockup for step ${step.step}`);
    }

    // Update the database with generated mockups
    const { error: updateError } = await supabase
      .from('wizard_submissions')
      .update({ screen_mockups: generatedMockups })
      .eq('report_url', submissionId);

    if (updateError) {
      console.error('Error updating database:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save mockups' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully generated ${generatedMockups.length} mockups`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        mockups: generatedMockups,
        generated: generatedMockups.length,
        total: Math.min(steps.length, 5)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-screen-mockups:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
