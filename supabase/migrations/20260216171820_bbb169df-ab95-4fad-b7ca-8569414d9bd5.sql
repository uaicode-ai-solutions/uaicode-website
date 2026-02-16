ALTER TABLE public.tb_media_trends
DROP CONSTRAINT IF EXISTS tb_media_trends_status_check;

ALTER TABLE public.tb_media_trends
ADD CONSTRAINT tb_media_trends_status_check
CHECK (status IN ('pending', 'processed', 'skipped'));