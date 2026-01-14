-- Alterar todos os campos numéricos para TEXT para aceitar valores formatados da IA
ALTER TABLE tb_pms_reports
  ALTER COLUMN viability_score TYPE text USING viability_score::text,
  ALTER COLUMN complexity_score TYPE text USING complexity_score::text,
  ALTER COLUMN timing_score TYPE text USING timing_score::text,
  ALTER COLUMN risk_score TYPE text USING risk_score::text,
  ALTER COLUMN differentiation_score TYPE text USING differentiation_score::text,
  ALTER COLUMN pivot_readiness_score TYPE text USING pivot_readiness_score::text,
  ALTER COLUMN opportunity_score TYPE text USING opportunity_score::text,
  ALTER COLUMN first_mover_score TYPE text USING first_mover_score::text,
  ALTER COLUMN investment_total_cents TYPE text USING investment_total_cents::text,
  ALTER COLUMN break_even_months TYPE text USING break_even_months::text,
  ALTER COLUMN expected_roi_year1 TYPE text USING expected_roi_year1::text,
  ALTER COLUMN mrr_month12_cents TYPE text USING mrr_month12_cents::text,
  ALTER COLUMN arr_projected_cents TYPE text USING arr_projected_cents::text,
  ALTER COLUMN ltv_cac_ratio TYPE text USING ltv_cac_ratio::text;