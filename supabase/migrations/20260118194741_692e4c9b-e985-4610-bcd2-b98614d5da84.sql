-- Remove legacy columns from tb_pms_reports that are now stored in JSONB fields
-- These columns have been migrated to section_investment, opportunity_section, and competitive_analysis_section

ALTER TABLE public.tb_pms_reports
DROP COLUMN IF EXISTS viability_score,
DROP COLUMN IF EXISTS total_market,
DROP COLUMN IF EXISTS expected_roi,
DROP COLUMN IF EXISTS payback_period,
DROP COLUMN IF EXISTS verdict_headline,
DROP COLUMN IF EXISTS opportunity_tam,
DROP COLUMN IF EXISTS opportunity_sam,
DROP COLUMN IF EXISTS opportunity_som,
DROP COLUMN IF EXISTS opportunity_year_rate,
DROP COLUMN IF EXISTS investment_one_payment_cents,
DROP COLUMN IF EXISTS investment_front_cents,
DROP COLUMN IF EXISTS investment_back_cents,
DROP COLUMN IF EXISTS investment_integrations_cents,
DROP COLUMN IF EXISTS investment_infra_cents,
DROP COLUMN IF EXISTS investment_testing_cents,
DROP COLUMN IF EXISTS investment_one_payment_cents_traditional,
DROP COLUMN IF EXISTS savings_percentage,
DROP COLUMN IF EXISTS savings_amount_cents,
DROP COLUMN IF EXISTS savings_marketing_months,
DROP COLUMN IF EXISTS delivery_time_traditional,
DROP COLUMN IF EXISTS delivery_time_uaicode;