import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_AVATAR = "https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png";

export const useNewsletterPosts = () => {
  return useQuery({
    queryKey: ["newsletter-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_web_newsletter_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        imageUrl: post.cover_image_url || "",
        author: {
          name: post.author_name || "UaiCode Team",
          avatar: post.author_avatar_url || DEFAULT_AVATAR,
        },
        category: post.category || "General",
        publishedAt: post.published_at || post.created_at || "",
        readTime: post.read_time || "5 min read",
        youtubeVideoId: post.youtube_video_id || undefined,
        highlights: post.highlights ? (post.highlights as string[]) : undefined,
        subtitles: post.subtitles ? (post.subtitles as string[]) : undefined,
      }));
    },
  });
};
