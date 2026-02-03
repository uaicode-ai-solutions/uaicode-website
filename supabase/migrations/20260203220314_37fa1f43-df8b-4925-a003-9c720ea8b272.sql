-- Add share_html column for pre-rendered static HTML
ALTER TABLE public.tb_pms_reports 
ADD COLUMN share_html TEXT NULL;

COMMENT ON COLUMN public.tb_pms_reports.share_html IS 
  'Pre-rendered static HTML for public shared report view';