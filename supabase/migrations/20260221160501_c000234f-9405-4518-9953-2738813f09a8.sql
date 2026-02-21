
-- Fix 1: Remove overly permissive SELECT policy on tb_web_leads
DROP POLICY IF EXISTS "Anyone can read clients by email" ON public.tb_web_leads;

-- Add admin-only SELECT policy
CREATE POLICY "Admins can read leads"
ON public.tb_web_leads
FOR SELECT
USING (has_role(get_pms_user_id(), 'admin'::app_role));

-- Fix 2: Add missing INSERT policy on tb_crm_leads (service role only)
CREATE POLICY "Service role can insert leads"
ON public.tb_crm_leads
FOR INSERT
WITH CHECK (auth.role() = 'service_role');
