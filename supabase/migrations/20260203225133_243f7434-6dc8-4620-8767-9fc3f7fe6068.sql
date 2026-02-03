-- Add snapshot columns for public sharing (JSON + React approach)
ALTER TABLE public.tb_pms_reports 
ADD COLUMN IF NOT EXISTS wizard_snapshot JSONB NULL,
ADD COLUMN IF NOT EXISTS marketing_snapshot JSONB NULL;

COMMENT ON COLUMN public.tb_pms_reports.wizard_snapshot IS 
  'Snapshot of wizard data (saas_name, market_type, industry) for public sharing without auth';
COMMENT ON COLUMN public.tb_pms_reports.marketing_snapshot IS 
  'Snapshot of marketingTotals at generation time for public sharing';