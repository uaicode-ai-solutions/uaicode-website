INSERT INTO storage.buckets (id, name, public) VALUES ('og-meta', 'og-meta', true);

CREATE POLICY "Allow public read og-meta"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-meta');