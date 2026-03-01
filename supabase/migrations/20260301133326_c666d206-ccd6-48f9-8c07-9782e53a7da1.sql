
INSERT INTO public.tb_pms_mvp_tiers (tier_id, tier_name, description, min_price_cents, max_price_cents, min_days, max_days, traditional_min_cents, traditional_max_cents, traditional_min_days, traditional_max_days, is_active)
VALUES
  ('starter', 'Starter MVP', 'Essential features for launching your first SaaS product with core functionality.', 1700000, 3200000, 45, 60, 5000000, 10000000, 90, 150, true),
  ('enterprise', 'Enterprise MVP', 'Advanced features for scaling your SaaS with integrations and analytics.', 3200000, 6700000, 60, 90, 10000000, 20000000, 120, 210, true),
  ('professional', 'Professional MVP', 'Enterprise-grade features with AI, multi-tenancy, and advanced security.', 6700000, 16700000, 90, 120, 20000000, 50000000, 180, 360, true);
