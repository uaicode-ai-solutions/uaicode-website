-- Create table for discount strategies
CREATE TABLE public.tb_pms_discount_strategy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id TEXT UNIQUE NOT NULL,
  discount_name TEXT NOT NULL,
  discount_percent INTEGER NOT NULL,
  description TEXT,
  validity_hours INTEGER,
  bonus_support_days INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add comment for documentation
COMMENT ON TABLE public.tb_pms_discount_strategy IS 'Stores discount strategies for MVP and bundle pricing, used by n8n workflows and frontend';

-- Create trigger for updated_at
CREATE TRIGGER update_tb_pms_discount_strategy_updated_at
  BEFORE UPDATE ON public.tb_pms_discount_strategy
  FOR EACH ROW EXECUTE FUNCTION public.update_tb_pms_wizard_updated_at();

-- Enable RLS
ALTER TABLE public.tb_pms_discount_strategy ENABLE ROW LEVEL SECURITY;

-- Allow public read access (same pattern as tb_pms_mvp_tier)
CREATE POLICY "Anyone can read discount strategies"
  ON public.tb_pms_discount_strategy 
  FOR SELECT 
  USING (true);

-- Insert initial discount strategies
INSERT INTO public.tb_pms_discount_strategy (discount_id, discount_name, discount_percent, description, validity_hours, bonus_support_days, display_order)
VALUES
  ('flash_24h', 'Flash Deal 24h', 25, 'Limited time offer - 25% off for first 24 hours', 24, 15, 1),
  ('week', 'First Week Special', 15, '15% discount valid for the first week', 168, 7, 2),
  ('month', 'First Month Offer', 10, '10% discount valid for the first month', 720, 0, 3),
  ('bundle', 'MVP + Marketing Bundle', 30, '30% off when purchasing MVP development with marketing services', NULL, 30, 4);