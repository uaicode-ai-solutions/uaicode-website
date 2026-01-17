-- Add opportunity_section column to store market opportunity JSON data from n8n
ALTER TABLE public.tb_pms_reports 
ADD COLUMN opportunity_section jsonb DEFAULT '{}'::jsonb;