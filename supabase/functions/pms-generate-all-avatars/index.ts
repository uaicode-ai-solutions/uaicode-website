import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All 12 avatar combinations to generate
const AVATAR_CONFIGS = [
  // US
  { region: "us", gender: "male", prompt: "Professional headshot photograph of a 40-year-old American businessman, clean-shaven with short dark hair, wearing a navy blue suit and tie, confident smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "us", gender: "female", prompt: "Professional headshot photograph of a 38-year-old American businesswoman with blonde shoulder-length hair, wearing a charcoal blazer over a white blouse, warm professional smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "us", gender: "any", prompt: "Professional headshot photograph of a 35-year-old American professional with medium-length brown hair, wearing a modern dark suit jacket, friendly approachable expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  
  // Brazil
  { region: "brazil", gender: "male", prompt: "Professional headshot photograph of a 42-year-old Brazilian businessman with olive skin, short dark wavy hair with light stubble, wearing a modern light gray suit, confident warm smile, neutral studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "brazil", gender: "female", prompt: "Professional headshot photograph of a 36-year-old Brazilian businesswoman with caramel skin, dark brown wavy hair past shoulders, wearing an elegant emerald green blazer, bright genuine smile, neutral studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "brazil", gender: "any", prompt: "Professional headshot photograph of a 38-year-old Brazilian professional with tan skin and dark curly hair, wearing a smart casual navy jacket over light shirt, friendly expression, neutral studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  
  // Europe
  { region: "europe", gender: "male", prompt: "Professional headshot photograph of a 45-year-old European businessman with fair skin, light brown hair with gray temples, wearing a classic charcoal suit with subtle pinstripes, composed professional expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "europe", gender: "female", prompt: "Professional headshot photograph of a 40-year-old European businesswoman with fair skin, auburn hair in an elegant updo, wearing a sophisticated burgundy blazer, confident refined smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "europe", gender: "any", prompt: "Professional headshot photograph of a 37-year-old European professional with light brown hair styled neatly, wearing a modern fitted gray blazer, approachable professional demeanor, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  
  // Asia
  { region: "asia", gender: "male", prompt: "Professional headshot photograph of a 43-year-old East Asian businessman with black hair neatly combed, wearing a tailored black suit with white shirt, poised professional expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "asia", gender: "female", prompt: "Professional headshot photograph of a 35-year-old East Asian businesswoman with straight black hair at shoulder length, wearing a cream-colored silk blouse under a black blazer, graceful confident smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
  { region: "asia", gender: "any", prompt: "Professional headshot photograph of a 38-year-old East Asian professional with short black hair, wearing a modern minimalist dark gray suit, composed approachable expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus" },
];

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting generation of all 12 ICP avatars...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const results: { filename: string; success: boolean; error?: string }[] = [];

    for (const config of AVATAR_CONFIGS) {
      const filename = `${config.region}-${config.gender}.png`;
      console.log(`Generating avatar: ${filename}...`);

      try {
        // Call Lovable AI Gateway for image generation
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: config.prompt
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI Gateway error for ${filename}:`, errorText);
          results.push({ filename, success: false, error: `AI error: ${aiResponse.status}` });
          continue;
        }

        const aiData = await aiResponse.json();
        const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageData) {
          console.error(`No image data in response for ${filename}`);
          results.push({ filename, success: false, error: "No image in AI response" });
          continue;
        }

        // Extract base64 data
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("icp-avatars")
          .upload(filename, imageBytes, {
            contentType: "image/png",
            upsert: true // Overwrite if exists
          });

        if (uploadError) {
          console.error(`Upload error for ${filename}:`, uploadError);
          results.push({ filename, success: false, error: `Upload error: ${uploadError.message}` });
          continue;
        }

        console.log(`Successfully generated and uploaded: ${filename}`);
        results.push({ filename, success: true });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error(`Error processing ${filename}:`, err);
        results.push({ filename, success: false, error: String(err) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Generation complete. Success: ${successCount}, Failed: ${failureCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${successCount} of ${AVATAR_CONFIGS.length} avatars`,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in pms-generate-all-avatars:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
