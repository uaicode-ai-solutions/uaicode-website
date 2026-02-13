CREATE TABLE public.tb_web_newsletter_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Technical Guide',
  read_time text DEFAULT '5 min read',
  author_name text DEFAULT 'Rafael Luz',
  author_avatar_url text,
  youtube_video_id text,
  highlights jsonb DEFAULT '[]',
  subtitles jsonb DEFAULT '[]',
  is_published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.tb_web_newsletter_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
ON public.tb_web_newsletter_posts FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can insert posts"
ON public.tb_web_newsletter_posts FOR INSERT
WITH CHECK (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can update posts"
ON public.tb_web_newsletter_posts FOR UPDATE
USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can delete posts"
ON public.tb_web_newsletter_posts FOR DELETE
USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_tb_web_newsletter_posts_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.tb_web_newsletter_posts
FOR EACH ROW EXECUTE FUNCTION update_tb_web_newsletter_posts_updated_at();