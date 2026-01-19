-- Fix the scientific notation values in price_intelligence_section.revenue_projections.insights
-- Report ID: e26dd841-17e2-4d86-a4db-a18e286cc6df

UPDATE tb_pms_reports
SET price_intelligence_section = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          price_intelligence_section,
          '{revenue_projections,insights,arpu_numeric}',
          '200'::jsonb
        ),
        '{revenue_projections,insights,ltv_numeric}',
        '7200'::jsonb
      ),
      '{revenue_projections,insights,payback_months}',
      '8'::jsonb
    ),
    '{revenue_projections,insights,year1_revenue_numeric}',
    '5100000'::jsonb
  ),
  '{revenue_projections,insights,ltv_arpu_ratio}',
  '36'::jsonb
)
WHERE id = 'e26dd841-17e2-4d86-a4db-a18e286cc6df';