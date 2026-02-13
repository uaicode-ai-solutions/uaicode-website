import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const BATCH_SIZE = 50;
const SITE_URL = "https://uaicodewebsite.lovable.app";

const DEFAULT_AUTHOR_AVATAR = "https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png";

const generateNewsletterEmail = (post: {
  title: string;
  excerpt: string;
  cover_image_url: string;
  slug: string;
  author_name: string | null;
  author_avatar_url: string | null;
  category: string;
  read_time: string | null;
}) => {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  const readTime = post.read_time || "5 min read";
  const authorName = post.author_name || "UaiCode Team";
  const authorAvatar = post.author_avatar_url || DEFAULT_AUTHOR_AVATAR;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-flex; align-items: center; gap: 8px;">
        <img src="https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/logo-uaicode-fundo-preto.png" alt="Uaicode" style="width: 28px; height: 28px; border-radius: 6px;" />
        <span style="font-size: 24px; font-weight: 700; color: #FACC15; letter-spacing: -0.5px;">Uaicode Insights</span>
      </div>
      <p style="color: #71717A; font-size: 13px; margin-top: 4px;">New Article Published</p>
    </div>

    <!-- Cover Image -->
    <div style="border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <img src="${post.cover_image_url}" alt="${post.title}" style="width: 100%; height: auto; display: block;" />
    </div>

    <!-- Category & Read Time -->
    <div style="margin-bottom: 12px;">
      <span style="display: inline-block; background: rgba(250, 204, 21, 0.15); color: #FACC15; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">${post.category}</span>
      <span style="color: #71717A; font-size: 12px; margin-left: 10px;">📖 ${readTime}</span>
    </div>

    <!-- Title -->
    <h1 style="color: #FFFFFF; font-size: 26px; font-weight: 700; line-height: 1.3; margin: 0 0 16px 0;">${post.title}</h1>

    <!-- Excerpt -->
    <p style="color: #A1A1AA; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">${post.excerpt}</p>

    <!-- Author -->
    <div style="margin: 0 0 28px 0; display: flex; align-items: center;">
      <img src="${authorAvatar}" alt="${authorName}" style="width: 36px; height: 36px; border-radius: 50%; margin-right: 10px; object-fit: cover;" />
      <p style="color: #71717A; font-size: 13px; margin: 0;">By <span style="color: #E4E4E7;">${authorName}</span></p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-bottom: 40px;">
      <a href="${articleUrl}" style="display: inline-block; background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%); color: #0A0A0A; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 700; font-size: 16px;">Read Full Article →</a>
    </div>

    <!-- Divider -->
    <div style="height: 1px; background: linear-gradient(90deg, transparent, #27272A, transparent); margin: 32px 0;"></div>

    <!-- Footer -->
    <div style="text-align: center;">
      <p style="color: #52525B; font-size: 12px; margin: 0 0 8px 0;">
        You're receiving this because you subscribed to the Uaicode Insights.
      </p>
      <p style="color: #52525B; font-size: 12px; margin: 0;">
        <a href="https://uaicode.ai" style="color: #71717A; text-decoration: none;">uaicode.ai</a>
        <span style="color: #3F3F46; margin: 0 6px;">•</span>
        <a href="mailto:hello@uaicode.ai" style="color: #71717A; text-decoration: none;">hello@uaicode.ai</a>
      </p>
      <p style="color: #3F3F46; font-size: 11px; margin-top: 16px;">
        © ${new Date().getFullYear()} UaiCode. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>`;
};

const sendBatch = async (emails: string[], from: string, subject: string, html: string) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from, to: emails, subject, html }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[newsletter-broadcast] Resend batch error:", data);
    throw new Error(data.message || "Failed to send batch");
  }

  return data;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const { post_id } = await req.json();

    if (!post_id) {
      return new Response(
        JSON.stringify({ error: "post_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[newsletter-broadcast] Starting broadcast for post_id: ${post_id}`);

    // Create admin client to bypass RLS
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch the post
    const { data: post, error: postError } = await supabaseAdmin
      .from("tb_web_newsletter_posts")
      .select("title, excerpt, cover_image_url, slug, author_name, author_avatar_url, category, read_time")
      .eq("id", post_id)
      .single();

    if (postError || !post) {
      console.error("[newsletter-broadcast] Post not found:", postError);
      return new Response(
        JSON.stringify({ error: "Post not found", details: postError?.message }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[newsletter-broadcast] Post found: "${post.title}" (slug: ${post.slug})`);

    // 2. Fetch all subscriber emails
    const { data: subscribers, error: subError } = await supabaseAdmin
      .from("tb_web_newsletter")
      .select("email");

    if (subError) {
      console.error("[newsletter-broadcast] Error fetching subscribers:", subError);
      throw new Error("Failed to fetch subscribers");
    }

    const emails = (subscribers || []).map((s) => s.email).filter(Boolean);
    const totalSubscribers = emails.length;

    if (totalSubscribers === 0) {
      console.log("[newsletter-broadcast] No subscribers found, skipping broadcast");
      return new Response(
        JSON.stringify({ success: true, total_subscribers: 0, emails_sent: 0, message: "No subscribers" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[newsletter-broadcast] Found ${totalSubscribers} subscribers`);

    // 3. Generate email HTML
    const html = generateNewsletterEmail(post);
    const subject = `📰 ${post.title}`;
    const from = "Uaicode Insights <noreply@uaicode.ai>";

    // 4. Send in batches of 50
    let emailsSent = 0;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      console.log(`[newsletter-broadcast] Sending batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} emails)`);
      await sendBatch(batch, from, subject, html);
      emailsSent += batch.length;
    }

    console.log(`[newsletter-broadcast] Broadcast complete: ${emailsSent}/${totalSubscribers} emails sent`);

    return new Response(
      JSON.stringify({ success: true, total_subscribers: totalSubscribers, emails_sent: emailsSent }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("[newsletter-broadcast] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to broadcast newsletter";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
