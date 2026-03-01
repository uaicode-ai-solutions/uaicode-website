ALTER TABLE public.tb_pms_reports_complexity
  ADD COLUMN selected_feature_ids jsonb NOT NULL DEFAULT '[]'::jsonb;