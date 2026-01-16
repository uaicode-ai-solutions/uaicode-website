-- Update tb_pms_mvp_tier with new pricing values (Option 1: 50-60% discount vs market)

-- Starter: $10k-$25k (vs $25k-$50k traditional)
UPDATE public.tb_pms_mvp_tier 
SET 
  min_price_cents = 1000000,
  max_price_cents = 2500000,
  traditional_min_cents = 2500000,
  traditional_max_cents = 5000000
WHERE tier_id = 'starter';

-- Growth: $25k-$60k (vs $60k-$150k traditional)
UPDATE public.tb_pms_mvp_tier 
SET 
  min_price_cents = 2500000,
  max_price_cents = 6000000,
  traditional_min_cents = 6000000,
  traditional_max_cents = 15000000
WHERE tier_id = 'growth';

-- Enterprise: $60k-$160k (vs $150k-$400k traditional)
UPDATE public.tb_pms_mvp_tier 
SET 
  min_price_cents = 6000000,
  max_price_cents = 16000000,
  traditional_min_cents = 15000000,
  traditional_max_cents = 40000000
WHERE tier_id = 'enterprise';

-- Remove obsolete price_per_* columns
ALTER TABLE public.tb_pms_mvp_tier 
DROP COLUMN IF EXISTS price_per_essential_cents,
DROP COLUMN IF EXISTS price_per_advanced_cents,
DROP COLUMN IF EXISTS price_per_enterprise_cents,
DROP COLUMN IF EXISTS traditional_price_per_essential_cents,
DROP COLUMN IF EXISTS traditional_price_per_advanced_cents,
DROP COLUMN IF EXISTS traditional_price_per_enterprise_cents;