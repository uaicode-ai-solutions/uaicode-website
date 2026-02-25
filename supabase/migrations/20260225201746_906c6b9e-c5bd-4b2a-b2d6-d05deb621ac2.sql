-- 1. Drop existing table (CASCADE removes policies, triggers, indexes)
DROP TABLE IF EXISTS public.tb_crm_leads CASCADE;

-- 2. Recreate with all columns in JSON order
CREATE TABLE public.tb_crm_leads (
  id                     uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at             timestamptz  NOT NULL DEFAULT now(),
  updated_at             timestamptz  NOT NULL DEFAULT now(),
  full_name              text,
  first_name             text,
  last_name              text,
  email                  text         UNIQUE,
  phone                  text,
  job_title              text,
  seniority              text,
  departments            text,
  headline               text,
  photo_url              text,
  years_of_experience    integer,
  city                   text,
  state                  text,
  country                text,
  linkedin_profile       text,
  facebook_url           text,
  twitter_url            text,
  github_url             text,
  instagram_url          text,
  company_name           text,
  company_website        text,
  industry               text,
  company_size           integer,
  company_revenue        text,
  company_description    text,
  company_logo_url       text,
  company_founded_year   integer,
  company_city           text,
  company_state          text,
  company_country        text,
  company_linkedin_url   text,
  company_facebook_url   text,
  company_instagram_url  text,
  company_youtube_url    text,
  company_tiktok_url     text,
  company_phone_enriched text,
  company_email_enriched text,
  company_keywords       jsonb        DEFAULT '[]'::jsonb,
  company_tech_stack     jsonb        DEFAULT '[]'::jsonb,
  source                 text         DEFAULT 'n8n_workflow',
  employment_history     jsonb        DEFAULT '[]'::jsonb
);

-- 3. Recreate updated_at trigger
CREATE TRIGGER set_tb_crm_leads_updated_at
  BEFORE UPDATE ON public.tb_crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_crm_leads_updated_at();

-- 4. Enable RLS
ALTER TABLE public.tb_crm_leads ENABLE ROW LEVEL SECURITY;

-- 5. Recreate RLS policies
CREATE POLICY "Admins can view leads"
  ON public.tb_crm_leads FOR SELECT
  TO authenticated
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can update leads"
  ON public.tb_crm_leads FOR UPDATE
  TO authenticated
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can delete leads"
  ON public.tb_crm_leads FOR DELETE
  TO authenticated
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Service role can insert leads"
  ON public.tb_crm_leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'service_role');

-- 6. Hero users SELECT policy
CREATE POLICY "hero_users_can_view_leads"
  ON public.tb_crm_leads FOR SELECT
  TO authenticated
  USING (get_hero_user_id() IS NOT NULL);