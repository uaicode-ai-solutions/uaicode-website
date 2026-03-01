UPDATE public.tb_pms_mvp_tiers SET support_days = 45 WHERE tier_id = 'starter';
UPDATE public.tb_pms_mvp_tiers SET support_days = 90 WHERE tier_id = 'enterprise';
UPDATE public.tb_pms_mvp_tiers SET support_days = 120 WHERE tier_id = 'professional';