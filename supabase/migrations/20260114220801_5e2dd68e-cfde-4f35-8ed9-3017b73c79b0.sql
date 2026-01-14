-- =====================================================
-- MIGRATION: Add fixed structure fields to tb_pms_reports
-- This creates a standardized report structure for all clients
-- =====================================================

-- SCORES PRINCIPAIS (Individual columns for filtering/sorting)
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS timing_score integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS risk_score integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS differentiation_score integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS pivot_readiness_score integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS opportunity_score integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS first_mover_score integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS verdict text;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS verdict_headline text;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS verdict_summary text;

-- FINANCIAL DATA (Individual columns for queries)
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS investment_total_cents integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS break_even_months integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS expected_roi_year1 integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS mrr_month12_cents integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS arr_projected_cents integer;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS ltv_cac_ratio numeric(4,2);

-- VIABILITY REPORT TAB - Fixed structure JSONBs
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS key_metrics jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS highlights jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS risks jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS market_opportunity jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS competitors jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS competitive_advantages jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS investment_breakdown jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS investment_included jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS investment_not_included jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS investment_comparison jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS unit_economics jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS financial_scenarios jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS projection_data jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS execution_timeline jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS tech_stack jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS demand_validation jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS business_model jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS go_to_market_preview jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS quantified_differentiation jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS timing_analysis jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS pivot_scenarios jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS success_metrics jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS resource_requirements jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS risk_quantification jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS market_benchmarks jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS uaicode_info jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS next_steps jsonb;

-- MARKETING ANALYSIS TAB - Fixed structure JSONBs
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_four_ps jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_paid_media_diagnosis jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_paid_media_action_plan jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_pricing_diagnosis jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_pricing_action_plan jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_growth_strategy jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_competitive_advantages jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS marketing_verdict jsonb;

-- BRAND ASSETS TAB - Fixed structure JSONBs
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS assets_screen_mockups jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS assets_brand_copy jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS assets_brand_identity jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS assets_logos jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS assets_landing_page jsonb;
ALTER TABLE tb_pms_reports ADD COLUMN IF NOT EXISTS assets_mockup_previews jsonb;

-- Add comments for documentation
COMMENT ON COLUMN tb_pms_reports.timing_score IS 'Market timing score (0-100)';
COMMENT ON COLUMN tb_pms_reports.risk_score IS 'Overall risk score (0-100)';
COMMENT ON COLUMN tb_pms_reports.differentiation_score IS 'Competitive differentiation score (0-100)';
COMMENT ON COLUMN tb_pms_reports.pivot_readiness_score IS 'Pivot readiness score (0-100)';
COMMENT ON COLUMN tb_pms_reports.opportunity_score IS 'Market opportunity score (0-100)';
COMMENT ON COLUMN tb_pms_reports.first_mover_score IS 'First mover advantage score (0-100)';
COMMENT ON COLUMN tb_pms_reports.verdict IS 'Final verdict: proceed, caution, or reconsider';
COMMENT ON COLUMN tb_pms_reports.verdict_headline IS 'Main headline for the verdict';
COMMENT ON COLUMN tb_pms_reports.verdict_summary IS 'Executive summary of the verdict';
COMMENT ON COLUMN tb_pms_reports.investment_total_cents IS 'Total investment required in cents';
COMMENT ON COLUMN tb_pms_reports.break_even_months IS 'Months to break even';
COMMENT ON COLUMN tb_pms_reports.expected_roi_year1 IS 'Expected ROI in year 1 (percentage)';
COMMENT ON COLUMN tb_pms_reports.mrr_month12_cents IS 'Projected MRR at month 12 in cents';
COMMENT ON COLUMN tb_pms_reports.arr_projected_cents IS 'Projected ARR in cents';
COMMENT ON COLUMN tb_pms_reports.ltv_cac_ratio IS 'LTV to CAC ratio';