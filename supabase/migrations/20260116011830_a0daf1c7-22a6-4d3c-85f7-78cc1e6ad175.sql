-- Update timelines to align with PricingTransparency.tsx values
UPDATE public.tb_pms_mvp_tier SET
  min_days = 45, max_days = 60,
  traditional_min_days = 90, traditional_max_days = 120
WHERE tier_id = 'starter';

UPDATE public.tb_pms_mvp_tier SET
  min_days = 60, max_days = 90,
  traditional_min_days = 120, traditional_max_days = 180
WHERE tier_id = 'growth';

UPDATE public.tb_pms_mvp_tier SET
  min_days = 90, max_days = 120,
  traditional_min_days = 180, traditional_max_days = 240
WHERE tier_id = 'enterprise';