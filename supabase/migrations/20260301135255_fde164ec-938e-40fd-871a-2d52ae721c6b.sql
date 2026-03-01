CREATE TABLE public.tb_pms_mvp_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id TEXT UNIQUE NOT NULL,
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  feature_category TEXT NOT NULL,
  complexity_weight INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tb_pms_mvp_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read mvp features"
  ON public.tb_pms_mvp_features
  FOR SELECT
  USING (true);