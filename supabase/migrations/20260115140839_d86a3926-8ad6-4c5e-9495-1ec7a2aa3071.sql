ALTER TABLE tb_pms_reports
ADD COLUMN viability_score integer,
ADD COLUMN total_market text,
ADD COLUMN expected_roi text,
ADD COLUMN payback_period text,
ADD COLUMN verdict_headline text;