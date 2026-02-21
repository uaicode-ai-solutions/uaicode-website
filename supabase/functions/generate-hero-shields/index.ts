import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHIELDS = [
  {
    team: "admin",
    animal: "Lobo-guará (maned wolf)",
    prompt:
      "A 2D flat vector-style shield/crest emblem featuring a maned wolf (lobo-guará) in profile. The wolf is stylized in golden amber tones (#FFBF1A, #FF9F00) on a pure black (#000000) background. The shield shape is a classic heraldic crest with clean lines. Minimalist flat design, no gradients, no 3D effects. The word 'ADMIN' at the bottom in small golden letters. Square format, centered composition.",
  },
  {
    team: "marketing",
    animal: "Arara-canindé (macaw)",
    prompt:
      "A 2D flat vector-style shield/crest emblem featuring a macaw (arara-canindé) with spread wings. The bird is stylized in golden amber tones (#FFBF1A, #FF9F00) on a pure black (#000000) background. The shield shape is a classic heraldic crest with clean lines. Minimalist flat design, no gradients, no 3D effects. The word 'MARKETING' at the bottom in small golden letters. Square format, centered composition.",
  },
  {
    team: "sales",
    animal: "Onça-pintada (jaguar)",
    prompt:
      "A 2D flat vector-style shield/crest emblem featuring a jaguar (onça-pintada) in a powerful stance. The jaguar is stylized in golden amber tones (#FFBF1A, #FF9F00) on a pure black (#000000) background. The shield shape is a classic heraldic crest with clean lines. Minimalist flat design, no gradients, no 3D effects. The word 'SALES' at the bottom in small golden letters. Square format, centered composition.",
  },
  {
    team: "product",
    animal: "Tamanduá-bandeira (giant anteater)",
    prompt:
      "A 2D flat vector-style shield/crest emblem featuring a giant anteater (tamanduá-bandeira) in profile. The anteater is stylized in golden amber tones (#FFBF1A, #FF9F00) on a pure black (#000000) background. The shield shape is a classic heraldic crest with clean lines. Minimalist flat design, no gradients, no 3D effects. The word 'PRODUCT' at the bottom in small golden letters. Square format, centered composition.",
  },
  {
    team: "education",
    animal: "Coruja-buraqueira (burrowing owl)",
    prompt:
      "A 2D flat vector-style shield/crest emblem featuring a burrowing owl (coruja-buraqueira) facing forward with piercing eyes. The owl is stylized in golden amber tones (#FFBF1A, #FF9F00) on a pure black (#000000) background. The shield shape is a classic heraldic crest with clean lines. Minimalist flat design, no gradients, no 3D effects. The word 'EDUCATION' at the bottom in small golden letters. Square format, centered composition.",
  },
  {
    team: "tech",
    animal: "Tatu-bola (three-banded armadillo)",
    prompt:
      "A 2D flat vector-style shield/crest emblem featuring a three-banded armadillo (tatu-bola) curled into its iconic ball shape. The armadillo is stylized in golden amber tones (#FFBF1A, #FF9F00) on a pure black (#000000) background. The shield shape is a classic heraldic crest with clean lines. Minimalist flat design, no gradients, no 3D effects. The word 'TECH' at the bottom in small golden letters. Square format, centered composition.",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: { team: string; url: string; error?: string }[] = [];

    for (const shield of SHIELDS) {
      try {
        console.log(`Generating shield for ${shield.team}...`);

        const aiResponse = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [{ role: "user", content: shield.prompt }],
              modalities: ["image", "text"],
            }),
          }
        );

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error(`AI error for ${shield.team}:`, errText);
          results.push({ team: shield.team, url: "", error: errText });
          continue;
        }

        const aiData = await aiResponse.json();
        const imageUrl =
          aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          results.push({
            team: shield.team,
            url: "",
            error: "No image returned",
          });
          continue;
        }

        // Extract base64 data
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = decode(base64Data);

        const filePath = `hero-shields/shield-${shield.team}.png`;

        const { error: uploadError } = await supabase.storage
          .from("uaicode-images")
          .upload(filePath, imageBytes, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${shield.team}:`, uploadError);
          results.push({
            team: shield.team,
            url: "",
            error: uploadError.message,
          });
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("uaicode-images").getPublicUrl(filePath);

        console.log(`Shield for ${shield.team} saved: ${publicUrl}`);
        results.push({ team: shield.team, url: publicUrl });
      } catch (e) {
        console.error(`Error generating ${shield.team}:`, e);
        results.push({
          team: shield.team,
          url: "",
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Shield generation error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
