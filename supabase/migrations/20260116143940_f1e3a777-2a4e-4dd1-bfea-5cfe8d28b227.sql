-- Adicionar coluna section_investment para armazenar dados de investimento como JSONB
ALTER TABLE public.tb_pms_reports
ADD COLUMN IF NOT EXISTS section_investment jsonb DEFAULT '{}';

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.tb_pms_reports.section_investment IS 
'Dados de investimento calculados pelo n8n: mvp_tier, preços, prazos, breakdown e economia';