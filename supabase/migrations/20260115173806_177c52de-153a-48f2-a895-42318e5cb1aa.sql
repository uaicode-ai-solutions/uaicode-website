-- Add new columns for Price Comparison card
ALTER TABLE tb_pms_reports
ADD COLUMN IF NOT EXISTS investment_one_payment_cents_traditional INTEGER,
ADD COLUMN IF NOT EXISTS savings_percentage INTEGER,
ADD COLUMN IF NOT EXISTS savings_amount_cents INTEGER,
ADD COLUMN IF NOT EXISTS savings_marketing_months INTEGER,
ADD COLUMN IF NOT EXISTS delivery_time_traditional TEXT,
ADD COLUMN IF NOT EXISTS delivery_time_uaicode TEXT;