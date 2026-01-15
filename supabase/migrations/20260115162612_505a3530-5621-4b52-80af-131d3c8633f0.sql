-- Add investment breakdown fields to tb_pms_reports
ALTER TABLE public.tb_pms_reports
ADD COLUMN IF NOT EXISTS investment_one_payment_cents integer,
ADD COLUMN IF NOT EXISTS investment_front_cents integer,
ADD COLUMN IF NOT EXISTS investment_back_cents integer,
ADD COLUMN IF NOT EXISTS investment_integrations_cents integer,
ADD COLUMN IF NOT EXISTS investment_infra_cents integer,
ADD COLUMN IF NOT EXISTS investment_testing_cents integer;