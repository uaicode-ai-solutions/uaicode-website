ALTER TABLE public.tb_media_trends
ADD COLUMN summary text,
ADD COLUMN spiced jsonb DEFAULT '{}'::jsonb,
ADD COLUMN relevance_score integer,
ADD COLUMN source text;