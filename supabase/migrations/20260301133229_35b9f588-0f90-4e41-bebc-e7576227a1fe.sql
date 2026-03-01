
CREATE TABLE public.tb_pms_mvp_tiers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_id text NOT NULL,
  tier_name text NOT NULL,
  description text,
  min_price_cents integer NOT NULL,
  max_price_cents integer NOT NULL,
  min_days integer NOT NULL,
  max_days integer NOT NULL,
  traditional_min_cents integer NOT NULL,
  traditional_max_cents integer NOT NULL,
  traditional_min_days integer NOT NULL,
  traditional_max_days integer NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.tb_pms_mvp_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read MVP tiers pricing"
  ON public.tb_pms_mvp_tiers
  FOR SELECT
  USING (true);
