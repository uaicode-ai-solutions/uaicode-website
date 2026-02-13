CREATE POLICY "Allow public read of published posts"
ON public.tb_web_newsletter_posts
FOR SELECT USING (is_published = true);