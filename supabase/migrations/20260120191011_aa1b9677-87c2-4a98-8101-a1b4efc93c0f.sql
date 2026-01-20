-- Add benchmark_section column for dynamic market benchmarks from n8n pipeline
ALTER TABLE public.tb_pms_reports 
ADD COLUMN IF NOT EXISTS benchmark_section JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.tb_pms_reports.benchmark_section IS 
  'Market benchmarks from Perplexity research, normalized by OpenAI agent. Contains MRR/ARR caps, conversion rates, churn, ROI ranges, and source citations.';