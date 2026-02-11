
-- Create trigger function first
CREATE OR REPLACE FUNCTION public.update_tb_crm_leads_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create tb_crm_leads table
CREATE TABLE public.tb_crm_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid,
  wizard_id uuid,
  full_name text,
  email text,
  phone text,
  linkedin_profile text,
  saas_name text,
  industry text,
  budget text,
  timeline text,
  goal text,
  challenge text,
  description text,
  geographic_region text,
  source text DEFAULT 'n8n_workflow',
  status text DEFAULT 'new',
  notes text,
  score integer
);

-- Enable RLS
ALTER TABLE public.tb_crm_leads ENABLE ROW LEVEL SECURITY;

-- Admins can view leads
CREATE POLICY "Admins can view leads"
ON public.tb_crm_leads FOR SELECT
USING (has_role(get_pms_user_id(), 'admin'::app_role));

-- Admins can update leads
CREATE POLICY "Admins can update leads"
ON public.tb_crm_leads FOR UPDATE
USING (has_role(get_pms_user_id(), 'admin'::app_role));

-- Admins can delete leads
CREATE POLICY "Admins can delete leads"
ON public.tb_crm_leads FOR DELETE
USING (has_role(get_pms_user_id(), 'admin'::app_role));

-- Unique index to prevent duplicates
CREATE UNIQUE INDEX idx_crm_leads_user_wizard ON public.tb_crm_leads (user_id, wizard_id);

-- Index for email lookups
CREATE INDEX idx_crm_leads_email ON public.tb_crm_leads (email);

-- Index for status filtering
CREATE INDEX idx_crm_leads_status ON public.tb_crm_leads (status);

-- Trigger for updated_at
CREATE TRIGGER update_tb_crm_leads_updated_at
BEFORE UPDATE ON public.tb_crm_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_tb_crm_leads_updated_at();
