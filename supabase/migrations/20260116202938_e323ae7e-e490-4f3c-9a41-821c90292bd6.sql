-- Add competitive_analysis_section column to store competitive analysis data from n8n workflow
ALTER TABLE tb_pms_reports 
ADD COLUMN IF NOT EXISTS competitive_analysis_section jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN tb_pms_reports.competitive_analysis_section IS 
'Stores competitive analysis data including 6 competitors with name, description, website, base_price, pricing_type, features, advantages_bonuses, plus your_competitive_advantages and market_positioning';