-- =====================================================
-- Add Public Sharing Functionality to tb_pms_reports
-- =====================================================

-- 1. Add new columns for share functionality
ALTER TABLE public.tb_pms_reports
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS share_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_created_at TIMESTAMPTZ;

-- 2. Create partial index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_pms_reports_share_token 
ON public.tb_pms_reports(share_token) 
WHERE share_token IS NOT NULL;

-- 3. Create RLS policy for anonymous access to shared reports
-- This is ADDITIVE - does not affect existing authenticated user policies
CREATE POLICY "Public can view shared reports by token"
ON public.tb_pms_reports FOR SELECT
TO anon
USING (
  share_enabled = true 
  AND share_token IS NOT NULL
);