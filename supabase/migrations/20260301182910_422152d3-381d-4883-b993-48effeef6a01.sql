-- Create tb_pms_reports_investment table
CREATE TABLE public.tb_pms_reports_investment (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id uuid NOT NULL,
  wizard_id uuid NOT NULL,
  mvp_tier text NOT NULL,
  investment_one_payment_cents integer NOT NULL,
  investment_one_payment_cents_traditional integer NOT NULL,
  investment_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  savings_amount_cents integer NOT NULL DEFAULT 0,
  savings_percentage integer NOT NULL DEFAULT 0,
  savings_marketing_months integer NOT NULL DEFAULT 0,
  discount_strategy jsonb NOT NULL DEFAULT '{}'::jsonb,
  delivery_days_uaicode_min integer NOT NULL,
  delivery_days_uaicode_max integer NOT NULL,
  delivery_days_traditional_min integer NOT NULL,
  delivery_days_traditional_max integer NOT NULL,
  delivery_weeks_uaicode_min integer NOT NULL,
  delivery_weeks_uaicode_max integer NOT NULL,
  delivery_weeks_traditional_min integer NOT NULL,
  delivery_weeks_traditional_max integer NOT NULL,
  feature_counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tb_pms_reports_investment ENABLE ROW LEVEL SECURITY;

-- Unique index on report_id (1 investment per report)
CREATE UNIQUE INDEX idx_tb_pms_reports_investment_report_id ON public.tb_pms_reports_investment (report_id);

-- RLS Policy 1: Users can view own investment
CREATE POLICY "Users can view own investment"
  ON public.tb_pms_reports_investment
  FOR SELECT
  USING (
    report_id IN (
      SELECT tb_pms_reports.id FROM tb_pms_reports
      WHERE tb_pms_reports.wizard_id IN (
        SELECT tb_pms_wizard.id FROM tb_pms_wizard
        WHERE tb_pms_wizard.user_id IN (
          SELECT tb_pms_users.id FROM tb_pms_users
          WHERE tb_pms_users.auth_user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policy 2: Users can insert own investment
CREATE POLICY "Users can insert own investment"
  ON public.tb_pms_reports_investment
  FOR INSERT
  WITH CHECK (
    report_id IN (
      SELECT tb_pms_reports.id FROM tb_pms_reports
      WHERE tb_pms_reports.wizard_id IN (
        SELECT tb_pms_wizard.id FROM tb_pms_wizard
        WHERE tb_pms_wizard.user_id IN (
          SELECT tb_pms_users.id FROM tb_pms_users
          WHERE tb_pms_users.auth_user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policy 3: Users can update own investment
CREATE POLICY "Users can update own investment"
  ON public.tb_pms_reports_investment
  FOR UPDATE
  USING (
    report_id IN (
      SELECT tb_pms_reports.id FROM tb_pms_reports
      WHERE tb_pms_reports.wizard_id IN (
        SELECT tb_pms_wizard.id FROM tb_pms_wizard
        WHERE tb_pms_wizard.user_id IN (
          SELECT tb_pms_users.id FROM tb_pms_users
          WHERE tb_pms_users.auth_user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policy 4: Users can delete own investment
CREATE POLICY "Users can delete own investment"
  ON public.tb_pms_reports_investment
  FOR DELETE
  USING (
    report_id IN (
      SELECT tb_pms_reports.id FROM tb_pms_reports
      WHERE tb_pms_reports.wizard_id IN (
        SELECT tb_pms_wizard.id FROM tb_pms_wizard
        WHERE tb_pms_wizard.user_id IN (
          SELECT tb_pms_users.id FROM tb_pms_users
          WHERE tb_pms_users.auth_user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policy 5: Hero users can view all investment
CREATE POLICY "Hero users can view all investment"
  ON public.tb_pms_reports_investment
  FOR SELECT
  USING (get_hero_user_id() IS NOT NULL);

-- RLS Policy 6: Public can view shared investment
CREATE POLICY "Public can view shared investment"
  ON public.tb_pms_reports_investment
  FOR SELECT
  USING (
    report_id IN (
      SELECT tb_pms_reports.id FROM tb_pms_reports
      WHERE tb_pms_reports.share_enabled = true
        AND tb_pms_reports.share_token IS NOT NULL
    )
  );