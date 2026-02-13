import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase clients once at module level
const supabaseAnon = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

const supabaseService = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHtml(ogTitle: string, ogDescription: string, ogImage: string, canonicalUrl: string, slug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeAttr(ogTitle)}</title>

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeAttr(ogTitle)}" />
  <meta property="og:description" content="${escapeAttr(ogDescription)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="UaiCode" />

  <!-- Twitter / LinkedIn -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttr(ogTitle)}" />
  <meta name="twitter:description" content="${escapeAttr(ogDescription)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Redirect real users -->
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${canonicalUrl}">${escapeAttr(ogTitle)}</a>...</p>
  <script>window.location.href="${canonicalUrl}";</script>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // GET handler: serve HTML directly for crawlers
  if (req.method === "GET") {
    try {
      const url = new URL(req.url);
      const slug = url.searchParams.get("slug");
      const userAgent = req.headers.get("user-agent") || "unknown";

      console.log(`[og-blog-meta] GET slug="${slug}" UA="${userAgent}"`);

      if (!slug) {
        return new Response("Missing slug parameter", {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        });
      }

      const { data: post, error } = await supabaseAnon
        .from("tb_web_newsletter_posts")
        .select("title, excerpt, cover_image_url, meta_title, meta_description, slug")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        console.error(`[og-blog-meta] DB error for slug="${slug}":`, error);
        return new Response("Post not found", {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        });
      }

      if (!post) {
        console.log(`[og-blog-meta] No post found for slug="${slug}"`);
        return new Response("Post not found", {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        });
      }

      const ogTitle = post.meta_title || post.title;
      const ogDescription = post.meta_description || post.excerpt || "";
      const ogImage = post.cover_image_url || "";
      const canonicalUrl = `https://uaicodewebsite.lovable.app/blog/${post.slug}`;

      const html = buildHtml(ogTitle, ogDescription, ogImage, canonicalUrl, post.slug);

      console.log(`[og-blog-meta] OK slug="${slug}" title="${ogTitle}"`);

      return new Response(html, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (err) {
      console.error("[og-blog-meta] GET error:", err?.message || err, err?.stack || "");
      return new Response("Internal error", {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }
  }

  // POST handler: existing n8n flow (upload to Storage)
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { slug, title, description, image_url, meta_title, meta_description } = await req.json();

    if (!slug || !title) {
      return new Response(JSON.stringify({ error: "slug and title are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ogTitle = meta_title || title;
    const ogDescription = meta_description || description || "";
    const ogImage = image_url || "";
    const canonicalUrl = `https://uaicodewebsite.lovable.app/blog/${slug}`;

    const html = buildHtml(ogTitle, ogDescription, ogImage, canonicalUrl, slug);

    const fileName = `${slug}.html`;
    const fileBody = new Blob([html], { type: "text/html" });

    const { error: uploadError } = await supabaseService.storage
      .from("og-meta")
      .upload(fileName, fileBody, {
        contentType: "text/html",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Upload failed", details: uploadError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: publicUrlData } = supabaseService.storage
      .from("og-meta")
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({ url: publicUrlData.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error", details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
