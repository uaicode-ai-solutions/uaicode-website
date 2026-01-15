-- Update Uaicode prices to reach $6,000 total (600,000 cents)

-- Project Manager: $1,000 → $1,200 (120,000 cents)
UPDATE tb_pms_mkt_tier 
SET uaicode_price_cents = 120000 
WHERE service_id = 'project_manager';

-- Paid Media Manager: $1,500 → $1,800 (180,000 cents)
UPDATE tb_pms_mkt_tier 
SET uaicode_price_cents = 180000 
WHERE service_id = 'paid_media';

-- Digital Media: $1,500 → $1,800 (180,000 cents)
UPDATE tb_pms_mkt_tier 
SET uaicode_price_cents = 180000 
WHERE service_id = 'digital_media';

-- Social Media: $750 → $900 (90,000 cents)
UPDATE tb_pms_mkt_tier 
SET uaicode_price_cents = 90000 
WHERE service_id = 'social_media';

-- CRM Pipeline Manager: $250 → $300 (30,000 cents)
UPDATE tb_pms_mkt_tier 
SET uaicode_price_cents = 30000 
WHERE service_id = 'crm_pipeline';