-- Add geographic_region column to tb_pms_wizard
ALTER TABLE public.tb_pms_wizard 
ADD COLUMN IF NOT EXISTS geographic_region TEXT;