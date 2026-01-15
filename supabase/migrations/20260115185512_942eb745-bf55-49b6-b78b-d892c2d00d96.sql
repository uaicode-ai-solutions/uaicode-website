-- Create table for marketing service tiers with pricing
CREATE TABLE public.tb_pms_mkt_tier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT UNIQUE NOT NULL,
  service_name TEXT NOT NULL,
  service_icon TEXT NOT NULL,
  
  -- Prices (USD cents)
  uaicode_price_cents INTEGER NOT NULL,
  traditional_min_cents INTEGER NOT NULL,
  traditional_max_cents INTEGER NOT NULL,
  
  -- Additional fees
  ad_spend_fee_percent INTEGER DEFAULT 0,
  
  -- Descriptions
  service_description TEXT NOT NULL,
  uaicode_differentiator TEXT,
  
  -- Monthly deliverables (JSONB)
  monthly_deliverables JSONB DEFAULT '{}',
  whats_included JSONB DEFAULT '[]',
  whats_not_included JSONB DEFAULT '[]',
  
  -- Market documentation
  market_notes TEXT,
  market_source TEXT,
  research_date DATE DEFAULT CURRENT_DATE,
  
  -- Metadata
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tb_pms_mkt_tier ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can read marketing tier pricing" 
ON public.tb_pms_mkt_tier 
FOR SELECT 
USING (true);

-- Insert initial data with research-based pricing
INSERT INTO public.tb_pms_mkt_tier (service_id, service_name, service_icon, uaicode_price_cents, traditional_min_cents, traditional_max_cents, service_description, uaicode_differentiator, monthly_deliverables, whats_included, display_order, is_recommended) VALUES
(
  'project_manager',
  'Project Manager',
  'briefcase',
  100000,
  600000,
  2500000,
  'Daily email support, weekly calls, quarterly planning sessions',
  'AI-augmented project management with 24/7 availability',
  '{"weekly": ["Strategy call", "Progress report"], "monthly": ["Quarterly planning", "KPI review"], "ongoing": ["Daily email support", "Slack channel", "Priority response"]}',
  '["Dedicated project manager", "Weekly strategy calls", "Quarterly planning", "Priority support"]',
  1,
  true
),
(
  'paid_media',
  'Paid Media Manager',
  'megaphone',
  150000,
  300000,
  1000000,
  'Meta, Google, TikTok, LinkedIn ads management',
  'AI-optimized campaigns with real-time bidding adjustments',
  '{"weekly": ["Campaign optimization", "Budget review"], "monthly": ["New ad creatives", "A/B testing report"], "ongoing": ["Meta Ads", "Google Ads", "TikTok Ads", "LinkedIn Ads"]}',
  '["Multi-platform management", "Campaign optimization", "A/B testing", "Performance reports"]',
  2,
  true
),
(
  'digital_media',
  'Digital Media',
  'palette',
  150000,
  350000,
  1000000,
  'Creatives, copy, videos, landing pages production',
  'AI-accelerated creative production at scale',
  '{"weekly": ["New ad creatives"], "monthly": ["Video production", "Landing page updates"], "ongoing": ["Copywriting", "Graphic design", "Video editing"]}',
  '["Ad creatives", "Video production", "Landing pages", "Copywriting"]',
  3,
  true
),
(
  'social_media',
  'Social Media',
  'share2',
  75000,
  200000,
  1000000,
  'Content research, posts creation, scheduling',
  'AI-powered content calendar and trend analysis',
  '{"weekly": ["Content calendar", "Post scheduling"], "monthly": ["Trend research", "Content strategy"], "ongoing": ["Daily posts", "Community engagement", "Analytics"]}',
  '["Content creation", "Post scheduling", "Community management", "Analytics"]',
  4,
  false
),
(
  'crm_pipeline',
  'CRM Pipeline Manager',
  'users',
  25000,
  200000,
  500000,
  'Lead scoring, automation, sales pipeline management',
  'AI-driven lead scoring with predictive analytics',
  '{"weekly": ["Pipeline review", "Lead follow-up"], "monthly": ["Automation optimization", "Conversion analysis"], "ongoing": ["Lead scoring", "Email sequences", "CRM maintenance"]}',
  '["Lead scoring", "Email automation", "Pipeline management", "Conversion tracking"]',
  5,
  false
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_tb_pms_mkt_tier_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_tb_pms_mkt_tier_updated_at
BEFORE UPDATE ON public.tb_pms_mkt_tier
FOR EACH ROW
EXECUTE FUNCTION public.update_tb_pms_mkt_tier_updated_at();