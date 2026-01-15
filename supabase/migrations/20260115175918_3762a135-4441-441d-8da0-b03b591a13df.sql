-- Add traditional price per feature columns to tb_pms_mvp_tier
ALTER TABLE tb_pms_mvp_tier
ADD COLUMN IF NOT EXISTS traditional_price_per_essential_cents INTEGER DEFAULT 420000,
ADD COLUMN IF NOT EXISTS traditional_price_per_advanced_cents INTEGER DEFAULT 875000,
ADD COLUMN IF NOT EXISTS traditional_price_per_enterprise_cents INTEGER DEFAULT 1400000;

-- Populate values based on 3.5x multiplier of Uaicode prices
UPDATE tb_pms_mvp_tier SET
  traditional_price_per_essential_cents = 420000,  -- $4,200 (3.5x de $1,200)
  traditional_price_per_advanced_cents = 875000,   -- $8,750 (3.5x de $2,500)
  traditional_price_per_enterprise_cents = 1400000 -- $14,000 (3.5x de $4,000)
WHERE is_active = true;