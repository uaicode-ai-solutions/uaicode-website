-- Add competitors_data column to store full competitor data including pricing
ALTER TABLE wizard_submissions 
ADD COLUMN IF NOT EXISTS competitors_data JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN wizard_submissions.competitors_data IS 
'Full competitor data including pricing from Perplexity search';