import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Ultra-realistic avatar prompts by region and gender
const AVATAR_PROMPTS: Record<string, Record<string, string>> = {
  us: {
    male: "Ultra-realistic professional headshot photograph of a 38-year-old American businessman. Clean-shaven, confident expression, wearing a navy blue suit with crisp white shirt. Corporate office background with soft bokeh, professional studio lighting, 8K quality, photorealistic, high detail skin texture, natural eye reflection",
    female: "Ultra-realistic professional headshot photograph of a 33-year-old American businesswoman. Warm confident smile, professional makeup, wearing elegant charcoal business blazer. Modern office background with soft focus, natural lighting, 8K quality, photorealistic, high detail skin texture, natural hair",
    any: "Ultra-realistic professional headshot photograph of a 35-year-old American business professional. Confident neutral expression, business casual attire with modern style. Contemporary workspace background, balanced lighting, 8K quality, photorealistic, high detail"
  },
  brazil: {
    male: "Ultra-realistic professional headshot photograph of a 36-year-old Brazilian businessman. Warm genuine smile, light olive tan skin, neatly trimmed dark hair, wearing smart casual business attire with open collar. Modern São Paulo office background, warm natural lighting, 8K quality, photorealistic, high detail skin texture",
    female: "Ultra-realistic professional headshot photograph of a 32-year-old Brazilian businesswoman. Beautiful natural features with warm smile, dark wavy hair, wearing elegant business dress in earth tones. Contemporary Latin American office, golden hour lighting, 8K quality, photorealistic, natural beauty",
    any: "Ultra-realistic professional headshot photograph of a 34-year-old Brazilian business professional. Friendly welcoming expression, Mediterranean features, business casual look. Modern Brazilian office setting, warm natural lighting, 8K quality, photorealistic"
  },
  europe: {
    male: "Ultra-realistic professional headshot photograph of a 42-year-old German businessman. Distinguished professional appearance, light features, wearing classic tailored European business suit in charcoal grey. Frankfurt financial district office, soft professional lighting, 8K quality, photorealistic, refined appearance",
    female: "Ultra-realistic professional headshot photograph of a 34-year-old German businesswoman. Elegant European features, subtle professional makeup, blonde hair in professional style, wearing modern minimalist business attire. Clean Scandinavian-style office, soft natural lighting, 8K quality, photorealistic",
    any: "Ultra-realistic professional headshot photograph of a 37-year-old European business professional. Sophisticated international appearance, modern European business style. Minimalist corporate setting, balanced studio lighting, 8K quality, photorealistic"
  },
  asia: {
    male: "Ultra-realistic professional headshot photograph of a 38-year-old Japanese businessman. Neat professional appearance, confident composed expression, wearing traditional Japanese-style business suit in dark navy. Tokyo corporate office background, professional studio lighting, 8K quality, photorealistic, polished appearance",
    female: "Ultra-realistic professional headshot photograph of a 30-year-old Japanese businesswoman. Professional and approachable expression, elegant simple makeup, dark straight hair in professional style, wearing sophisticated business attire. Modern Tokyo office setting, soft natural lighting, 8K quality, photorealistic, refined elegance",
    any: "Ultra-realistic professional headshot photograph of a 35-year-old Japanese business professional. Professional composed demeanor, smart modern business attire. Contemporary Asian corporate office, balanced professional lighting, 8K quality, photorealistic"
  }
};

// Map geographic regions to prompt keys
function getRegionKey(region: string | null): string {
  if (!region) return "us";
  const regionLower = region.toLowerCase();
  if (regionLower.includes("brazil") || regionLower.includes("latam") || regionLower.includes("south_america")) {
    return "brazil";
  }
  if (regionLower.includes("europe") || regionLower.includes("uk") || regionLower.includes("germany")) {
    return "europe";
  }
  if (regionLower.includes("asia") || regionLower.includes("japan") || regionLower.includes("china") || regionLower.includes("korea")) {
    return "asia";
  }
  return "us";
}

// Map target audience to gender key
function getGenderKey(targetAudience: string | null): string {
  if (!targetAudience) return "any";
  const audienceLower = targetAudience.toLowerCase();
  if (audienceLower.includes("male") && !audienceLower.includes("female")) {
    return "male";
  }
  if (audienceLower.includes("female")) {
    return "female";
  }
  return "any";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { report_id, region, gender } = await req.json();

    if (!report_id) {
      return new Response(
        JSON.stringify({ error: "report_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the appropriate prompt based on region and gender
    const regionKey = getRegionKey(region);
    const genderKey = getGenderKey(gender);
    const prompt = AVATAR_PROMPTS[regionKey]?.[genderKey] || AVATAR_PROMPTS.us.any;

    console.log(`Generating avatar for region: ${regionKey}, gender: ${genderKey}`);
    console.log(`Using prompt: ${prompt.substring(0, 100)}...`);

    // Call Nano Banana model to generate image
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
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI generation failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    // Extract base64 image from response
    const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageData) {
      console.error("No image in AI response:", JSON.stringify(aiData).substring(0, 500));
      throw new Error("No image generated by AI");
    }

    // Extract base64 data (remove data:image/png;base64, prefix if present)
    const base64Match = imageData.match(/^data:image\/\w+;base64,(.+)$/);
    const base64Data = base64Match ? base64Match[1] : imageData;
    
    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Generate unique filename
    const filename = `icp-avatar-${report_id}-${Date.now()}.png`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("icp-avatars")
      .upload(filename, bytes, {
        contentType: "image/png",
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("icp-avatars")
      .getPublicUrl(filename);

    console.log("Avatar uploaded successfully:", publicUrl);

    // Update report with avatar URL
    const { error: updateError } = await supabase
      .from("tb_pms_reports")
      .update({ icp_avatar_url: publicUrl })
      .eq("id", report_id);

    if (updateError) {
      console.error("Failed to update report:", updateError);
      // Don't throw - the image was still generated and uploaded
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        avatar_url: publicUrl,
        region: regionKey,
        gender: genderKey
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating ICP avatar:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
