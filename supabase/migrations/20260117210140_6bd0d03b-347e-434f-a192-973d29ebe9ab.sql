-- Create pricing models table
CREATE TABLE public.tb_pms_price_model (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id TEXT NOT NULL UNIQUE,
  model_name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tb_pms_price_model ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read pricing models"
  ON public.tb_pms_price_model
  FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_tb_pms_price_model_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_tb_pms_price_model_updated_at
  BEFORE UPDATE ON public.tb_pms_price_model
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pms_price_model_updated_at();

-- Populate with initial pricing models
INSERT INTO public.tb_pms_price_model (model_id, model_name, description, icon, display_order) VALUES
  ('flat', 'Flat Pricing', 'Fixed monthly price regardless of usage or features', 'DollarSign', 1),
  ('tiered', 'Tiered Pricing', 'Price varies based on plan tier or feature level', 'Layers', 2),
  ('usage', 'Usage-Based', 'Pay based on consumption, API calls, or transactions', 'Activity', 3),
  ('freemium', 'Freemium', 'Free basic plan with paid premium features', 'Gift', 4),
  ('subscription', 'Subscription', 'Recurring payment for continued platform access', 'RefreshCw', 5),
  ('per-seat', 'Per-Seat', 'Price charged per user or team member', 'Users', 6),
  ('per-user', 'Per-User', 'Price charged per user or team member', 'User', 7),
  ('one-time', 'One-Time', 'Single payment for lifetime or perpetual access', 'CheckCircle', 8),
  ('custom', 'Custom Pricing', 'Tailored pricing based on specific business needs', 'Settings', 9),
  ('enterprise', 'Enterprise', 'Custom enterprise-level pricing with dedicated support', 'Building', 10),
  ('hybrid', 'Hybrid', 'Combination of flat fee plus usage-based charges', 'Combine', 11);