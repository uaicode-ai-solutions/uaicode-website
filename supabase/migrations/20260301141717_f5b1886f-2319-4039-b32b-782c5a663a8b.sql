
-- 1. Create table
CREATE TABLE public.tb_pms_reports_complexity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.tb_pms_reports(id) ON DELETE CASCADE,
  wizard_id uuid NOT NULL,
  complexity_score integer NOT NULL,
  complexity_classification text NOT NULL CHECK (complexity_classification IN ('Low','Medium','High','Very High')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT tb_pms_reports_complexity_report_id_key UNIQUE (report_id)
);

-- 2. Enable RLS
ALTER TABLE public.tb_pms_reports_complexity ENABLE ROW LEVEL SECURITY;

-- 3. SELECT own reports
CREATE POLICY "Users can view own complexity"
  ON public.tb_pms_reports_complexity FOR SELECT
  USING (
    report_id IN (
      SELECT id FROM public.tb_pms_reports
      WHERE wizard_id IN (
        SELECT id FROM public.tb_pms_wizard
        WHERE user_id IN (
          SELECT id FROM public.tb_pms_users
          WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

-- 4. INSERT own
CREATE POLICY "Users can insert own complexity"
  ON public.tb_pms_reports_complexity FOR INSERT
  WITH CHECK (
    report_id IN (
      SELECT id FROM public.tb_pms_reports
      WHERE wizard_id IN (
        SELECT id FROM public.tb_pms_wizard
        WHERE user_id IN (
          SELECT id FROM public.tb_pms_users
          WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

-- 5. UPDATE own
CREATE POLICY "Users can update own complexity"
  ON public.tb_pms_reports_complexity FOR UPDATE
  USING (
    report_id IN (
      SELECT id FROM public.tb_pms_reports
      WHERE wizard_id IN (
        SELECT id FROM public.tb_pms_wizard
        WHERE user_id IN (
          SELECT id FROM public.tb_pms_users
          WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

-- 6. DELETE own
CREATE POLICY "Users can delete own complexity"
  ON public.tb_pms_reports_complexity FOR DELETE
  USING (
    report_id IN (
      SELECT id FROM public.tb_pms_reports
      WHERE wizard_id IN (
        SELECT id FROM public.tb_pms_wizard
        WHERE user_id IN (
          SELECT id FROM public.tb_pms_users
          WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

-- 7. SELECT shared reports
CREATE POLICY "Public can view shared complexity"
  ON public.tb_pms_reports_complexity FOR SELECT
  USING (
    report_id IN (
      SELECT id FROM public.tb_pms_reports
      WHERE share_enabled = true AND share_token IS NOT NULL
    )
  );

-- 8. SELECT hero users
CREATE POLICY "Hero users can view all complexity"
  ON public.tb_pms_reports_complexity FOR SELECT
  USING (get_hero_user_id() IS NOT NULL);
