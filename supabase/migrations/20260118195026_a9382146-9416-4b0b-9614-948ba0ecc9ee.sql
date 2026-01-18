-- Add marketing_intelligence_section column for marketing intelligence data
ALTER TABLE public.tb_pms_reports
ADD COLUMN IF NOT EXISTS marketing_intelligence_section jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.tb_pms_reports.marketing_intelligence_section IS 'JSON containing marketing intelligence analysis data';