ALTER TABLE public.tb_media_content
ADD COLUMN slides_json jsonb DEFAULT '[]'::jsonb;