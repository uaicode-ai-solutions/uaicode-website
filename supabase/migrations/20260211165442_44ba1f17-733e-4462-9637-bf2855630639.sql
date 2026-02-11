ALTER TABLE public.tb_crm_leads
  ADD COLUMN job_title text,
  ADD COLUMN company_name text,
  ADD COLUMN company_revenue text,
  ADD COLUMN company_size integer,
  ADD COLUMN city text,
  ADD COLUMN state text,
  ADD COLUMN country text;