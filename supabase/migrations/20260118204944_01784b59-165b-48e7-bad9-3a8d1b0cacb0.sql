-- Add paid media, price, and growth intelligence section columns
ALTER TABLE public.tb_pms_reports
ADD COLUMN IF NOT EXISTS paid_media_intelligence_section jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS price_intelligence_section jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS growth_intelligence_section jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.tb_pms_reports.paid_media_intelligence_section IS 'JSON containing paid media/advertising intelligence data';
COMMENT ON COLUMN public.tb_pms_reports.price_intelligence_section IS 'JSON containing pricing strategy intelligence data';
COMMENT ON COLUMN public.tb_pms_reports.growth_intelligence_section IS 'JSON containing growth strategy intelligence data';