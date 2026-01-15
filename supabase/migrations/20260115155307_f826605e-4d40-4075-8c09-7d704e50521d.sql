-- Create table for MVP tier pricing
CREATE TABLE public.tb_pms_mvp_tier (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id text UNIQUE NOT NULL,
  tier_name text NOT NULL,
  
  -- Preços Uaicode (centavos USD)
  min_price_cents integer NOT NULL,
  max_price_cents integer NOT NULL,
  
  -- Preços Mercado Tradicional US (centavos)
  traditional_min_cents integer NOT NULL,
  traditional_max_cents integer NOT NULL,
  
  -- Prazos Uaicode (dias)
  min_days integer NOT NULL,
  max_days integer NOT NULL,
  
  -- Prazos Tradicional (dias)
  traditional_min_days integer NOT NULL,
  traditional_max_days integer NOT NULL,
  
  -- Preço por feature (centavos USD)
  price_per_essential_cents integer NOT NULL DEFAULT 120000,  -- $1,200
  price_per_advanced_cents integer NOT NULL DEFAULT 250000,   -- $2,500
  price_per_enterprise_cents integer NOT NULL DEFAULT 400000, -- $4,000
  
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Insert tier data with validated values
INSERT INTO public.tb_pms_mvp_tier (
  tier_id, tier_name,
  min_price_cents, max_price_cents,
  traditional_min_cents, traditional_max_cents,
  min_days, max_days,
  traditional_min_days, traditional_max_days,
  price_per_essential_cents, price_per_advanced_cents, price_per_enterprise_cents,
  description
) VALUES
(
  'starter', 'Starter MVP',
  1000000, 1800000,           -- Uaicode: $10K - $18K
  2500000, 5000000,           -- Traditional: $25K - $50K
  30, 75,                     -- Uaicode: 30-75 days
  75, 150,                    -- Traditional: 75-150 days
  120000, 250000, 400000,     -- $1.2K, $2.5K, $4K per feature
  'Ideal for simple MVPs with essential features only. Perfect for validating core ideas quickly.'
),
(
  'growth', 'Growth MVP',
  1800000, 4500000,           -- Uaicode: $18K - $45K
  6000000, 15000000,          -- Traditional: $60K - $150K
  45, 120,                    -- Uaicode: 45-120 days
  120, 210,                   -- Traditional: 120-210 days
  120000, 250000, 400000,     -- $1.2K, $2.5K, $4K per feature
  'For MVPs with advanced features. Suitable for products needing integrations and analytics.'
),
(
  'enterprise', 'Enterprise MVP',
  3500000, 12000000,          -- Uaicode: $35K - $120K
  15000000, 40000000,         -- Traditional: $150K - $400K
  60, 210,                    -- Uaicode: 60-210 days
  180, 365,                   -- Traditional: 180-365 days
  120000, 250000, 400000,     -- $1.2K, $2.5K, $4K per feature
  'Complex MVPs with enterprise-grade features. Multi-tenant, compliance, and advanced security.'
);

-- Enable RLS
ALTER TABLE public.tb_pms_mvp_tier ENABLE ROW LEVEL SECURITY;

-- Public read policy (pricing data is public)
CREATE POLICY "Anyone can read MVP tier pricing"
ON public.tb_pms_mvp_tier
FOR SELECT
USING (true);

-- Add index for tier_id lookups
CREATE INDEX idx_tb_pms_mvp_tier_tier_id ON public.tb_pms_mvp_tier(tier_id);

-- Add comment
COMMENT ON TABLE public.tb_pms_mvp_tier IS 'MVP tier pricing configuration with Uaicode vs Traditional market comparison';