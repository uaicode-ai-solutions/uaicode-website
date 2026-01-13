-- =============================================
-- TABLE 1: tb_pln_users (User profiles)
-- =============================================
CREATE TABLE public.tb_pln_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  linkedin_profile text,
  user_role text,
  user_role_other text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_tb_pln_users_updated_at()
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

CREATE TRIGGER trigger_update_tb_pln_users_updated_at
  BEFORE UPDATE ON public.tb_pln_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pln_users_updated_at();

-- RLS Policies para tb_pln_users
ALTER TABLE public.tb_pln_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.tb_pln_users FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.tb_pln_users FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.tb_pln_users FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid());

-- =============================================
-- TABLE 2: tb_pln_reports (Wizard data + Report results)
-- =============================================
CREATE TABLE public.tb_pln_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.tb_pln_users(id) ON DELETE CASCADE NOT NULL,
  
  -- Status do relatório
  status text DEFAULT 'draft' NOT NULL,
  
  -- Identificação do SaaS
  saas_name text NOT NULL,
  saas_logo_url text,
  
  -- Step 2: Your Idea
  product_stage text,
  saas_type text,
  saas_type_other text,
  industry text,
  industry_other text,
  description text,
  
  -- Step 3: Target Market
  customer_types text[],
  market_size text,
  target_audience text,
  market_type text,
  
  -- Step 4: Features
  selected_features text[],
  selected_tier text,
  
  -- Step 5: Goals
  goal text,
  goal_other text,
  challenge text,
  budget text,
  timeline text,
  
  -- Report Results (preenchido após geração)
  viability_score integer,
  complexity_score integer,
  report_content jsonb,
  generated_at timestamp with time zone,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_tb_pln_reports_updated_at()
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

CREATE TRIGGER trigger_update_tb_pln_reports_updated_at
  BEFORE UPDATE ON public.tb_pln_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pln_reports_updated_at();

-- RLS Policies para tb_pln_reports
ALTER TABLE public.tb_pln_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON public.tb_pln_reports FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM public.tb_pln_users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own reports"
  ON public.tb_pln_reports FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM public.tb_pln_users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own reports"
  ON public.tb_pln_reports FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM public.tb_pln_users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own reports"
  ON public.tb_pln_reports FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM public.tb_pln_users WHERE auth_user_id = auth.uid()
  ));

-- =============================================
-- TABLE 3: tb_pln_payments (Payment records)
-- =============================================
CREATE TABLE public.tb_pln_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES public.tb_pln_reports(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.tb_pln_users(id) ON DELETE CASCADE NOT NULL,
  
  -- Stripe data
  stripe_payment_intent_id text,
  stripe_customer_id text,
  stripe_session_id text,
  
  -- Payment details
  amount_cents integer NOT NULL,
  currency text DEFAULT 'usd' NOT NULL,
  plan_type text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  
  -- Timestamps
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS Policies para tb_pln_payments
ALTER TABLE public.tb_pln_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.tb_pln_payments FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM public.tb_pln_users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own payments"
  ON public.tb_pln_payments FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM public.tb_pln_users WHERE auth_user_id = auth.uid()
  ));