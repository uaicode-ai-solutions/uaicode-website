
-- Create tb_pms_lp_wizard table
CREATE TABLE public.tb_pms_lp_wizard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  country TEXT,
  role TEXT,
  role_other TEXT,
  saas_type TEXT,
  saas_type_other TEXT,
  industry TEXT,
  industry_other TEXT,
  description TEXT,
  saas_name TEXT,
  saas_logo_url TEXT,
  geographic_region TEXT,
  geographic_region_other TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.tb_pms_lp_wizard ENABLE ROW LEVEL SECURITY;

-- RLS: Admins can do everything
CREATE POLICY "Admins can view lp_wizard" ON public.tb_pms_lp_wizard
  FOR SELECT USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can update lp_wizard" ON public.tb_pms_lp_wizard
  FOR UPDATE USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can delete lp_wizard" ON public.tb_pms_lp_wizard
  FOR DELETE USING (has_role(get_pms_user_id(), 'admin'::app_role));

-- RLS: Service role can insert (via edge function)
CREATE POLICY "Service role can insert lp_wizard" ON public.tb_pms_lp_wizard
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- RLS: Hero users can view
CREATE POLICY "Hero users can view lp_wizard" ON public.tb_pms_lp_wizard
  FOR SELECT USING (get_hero_user_id() IS NOT NULL);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_tb_pms_lp_wizard_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_tb_pms_lp_wizard_updated_at
  BEFORE UPDATE ON public.tb_pms_lp_wizard
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pms_lp_wizard_updated_at();
