import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AvatarConfig = {
  region: "us" | "brazil" | "europe" | "asia";
  gender: "male" | "female" | "any";
  prompt: string;
};

const AVATAR_CONFIGS: AvatarConfig[] = [
  // US
  {
    region: "us",
    gender: "male",
    prompt:
      "Professional headshot photograph of a 40-year-old American businessman, clean-shaven with short dark hair, wearing a navy blue suit and tie, confident smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "us",
    gender: "female",
    prompt:
      "Professional headshot photograph of a 38-year-old American businesswoman with blonde shoulder-length hair, wearing a charcoal blazer over a white blouse, warm professional smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "us",
    gender: "any",
    prompt:
      "Professional headshot photograph of a 35-year-old American professional with medium-length brown hair, wearing a modern dark suit jacket, friendly approachable expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },

  // Brazil
  {
    region: "brazil",
    gender: "male",
    prompt:
      "Professional headshot photograph of a 42-year-old Brazilian businessman with olive skin, short dark wavy hair with light stubble, wearing a modern light gray suit, confident warm smile, neutral studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "brazil",
    gender: "female",
    prompt:
      "Professional headshot photograph of a 36-year-old Brazilian businesswoman with caramel skin, dark brown wavy hair past shoulders, wearing an elegant emerald green blazer, bright genuine smile, neutral studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "brazil",
    gender: "any",
    prompt:
      "Professional headshot photograph of a 38-year-old Brazilian professional with tan skin and dark curly hair, wearing a smart casual navy jacket over light shirt, friendly expression, neutral studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },

  // Europe
  {
    region: "europe",
    gender: "male",
    prompt:
      "Professional headshot photograph of a 45-year-old European businessman with fair skin, light brown hair with gray temples, wearing a classic charcoal suit with subtle pinstripes, composed professional expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "europe",
    gender: "female",
    prompt:
      "Professional headshot photograph of a 40-year-old European businesswoman with fair skin, auburn hair in an elegant updo, wearing a sophisticated burgundy blazer, confident refined smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "europe",
    gender: "any",
    prompt:
      "Professional headshot photograph of a 37-year-old European professional with light brown hair styled neatly, wearing a modern fitted gray blazer, approachable professional demeanor, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },

  // Asia
  {
    region: "asia",
    gender: "male",
    prompt:
      "Professional headshot photograph of a 43-year-old East Asian businessman with black hair neatly combed, wearing a tailored black suit with white shirt, poised professional expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "asia",
    gender: "female",
    prompt:
      "Professional headshot photograph of a 35-year-old East Asian businesswoman with straight black hair at shoulder length, wearing a cream-colored silk blouse under a black blazer, graceful confident smile, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
  {
    region: "asia",
    gender: "any",
    prompt:
      "Professional headshot photograph of a 38-year-old East Asian professional with short black hair, wearing a modern minimalist dark gray suit, composed approachable expression, neutral gray studio background, ultra-realistic, 8K, professional corporate portrait photography, natural lighting, sharp focus",
  },
];

const configByFilename = new Map<string, AvatarConfig>(
  AVATAR_CONFIGS.map((c) => [`${c.region}-${c.gender}.png`, c]),
);

type Body = {
  // Optional: generate only these files, e.g. ["asia-male.png"]
  targets?: string[];
  // Optional: limit how many avatars to generate per call (prevents Edge Function timeout)
  maxToGenerate?: number;
  // Optional: if true, do not generate; only return which files are missing
  dryRun?: boolean;
  // Optional: if true, regenerate even if file already exists
  force?: boolean;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let body: Body = {};
    try {
      if (req.method !== "GET") body = (await req.json()) ?? {};
    } catch {
      body = {};
    }

    const allFilenames = [...configByFilename.keys()];
    const requested = (body.targets?.length ? body.targets : allFilenames).filter((f) =>
      configByFilename.has(f),
    );

    // List existing files (bucket root)
    const { data: existingList, error: listError } = await supabase.storage
      .from("icp-avatars")
      .list("", { limit: 100 });

    if (listError) {
      throw new Error(`Failed to list bucket objects: ${listError.message}`);
    }

    const existing = new Set((existingList ?? []).map((o: { name: string }) => o.name));

    const missing = body.force
      ? requested
      : requested.filter((filename) => !existing.has(filename));

    if (body.dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          requested,
          existing: [...existing],
          missing,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const maxToGenerate = Math.max(1, Math.min(body.maxToGenerate ?? 1, 3));
    const toGenerate = missing.slice(0, maxToGenerate);

    console.log(
      `Static ICP avatars: requested=${requested.length}, missing=${missing.length}, generating_now=${toGenerate.length}`,
    );

    const results: { filename: string; success: boolean; error?: string }[] = [];

    for (const filename of toGenerate) {
      const config = configByFilename.get(filename);
      if (!config) continue;

      console.log(`Generating avatar: ${filename}...`);

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: config.prompt }],
          modalities: ["image", "text"],
        }),
      });

      if (!aiResponse.ok) {
        const t = await aiResponse.text();
        console.error(`AI Gateway error for ${filename}:`, t);
        results.push({ filename, success: false, error: `AI error: ${aiResponse.status}` });
        continue;
      }

      const aiData = await aiResponse.json();
      const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (!imageData) {
        results.push({ filename, success: false, error: "No image in AI response" });
        continue;
      }

      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage.from("icp-avatars").upload(
        filename,
        imageBytes,
        {
          contentType: "image/png",
          upsert: true,
        },
      );

      if (uploadError) {
        console.error(`Upload error for ${filename}:`, uploadError);
        results.push({ filename, success: false, error: `Upload error: ${uploadError.message}` });
        continue;
      }

      console.log(`Uploaded: ${filename}`);
      results.push({ filename, success: true });
    }

    const remaining = missing.slice(toGenerate.length);

    return new Response(
      JSON.stringify({
        success: true,
        generated_now: results,
        remaining,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("Error in pms-generate-all-avatars:", e);
    return new Response(
      JSON.stringify({
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
