-- Create tb_pms_reports table to track report generation status
CREATE TABLE public.tb_pms_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wizard_id UUID NOT NULL REFERENCES public.tb_pms_wizard(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster lookups by wizard_id
CREATE INDEX idx_tb_pms_reports_wizard_id ON public.tb_pms_reports(wizard_id);

-- Enable RLS
ALTER TABLE public.tb_pms_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own reports (via wizard's user_id)
CREATE POLICY "Users can view own reports"
ON public.tb_pms_reports
FOR SELECT
USING (
  wizard_id IN (
    SELECT id FROM public.tb_pms_wizard
    WHERE user_id IN (
      SELECT id FROM public.tb_pms_users
      WHERE auth_user_id = auth.uid()
    )
  )
);

-- RLS Policy: Users can insert reports for their own wizards
CREATE POLICY "Users can insert own reports"
ON public.tb_pms_reports
FOR INSERT
WITH CHECK (
  wizard_id IN (
    SELECT id FROM public.tb_pms_wizard
    WHERE user_id IN (
      SELECT id FROM public.tb_pms_users
      WHERE auth_user_id = auth.uid()
    )
  )
);

-- RLS Policy: Users can update their own reports
CREATE POLICY "Users can update own reports"
ON public.tb_pms_reports
FOR UPDATE
USING (
  wizard_id IN (
    SELECT id FROM public.tb_pms_wizard
    WHERE user_id IN (
      SELECT id FROM public.tb_pms_users
      WHERE auth_user_id = auth.uid()
    )
  )
);

-- RLS Policy: Users can delete their own reports
CREATE POLICY "Users can delete own reports"
ON public.tb_pms_reports
FOR DELETE
USING (
  wizard_id IN (
    SELECT id FROM public.tb_pms_wizard
    WHERE user_id IN (
      SELECT id FROM public.tb_pms_users
      WHERE auth_user_id = auth.uid()
    )
  )
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_tb_pms_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
CREATE TRIGGER update_tb_pms_reports_updated_at
  BEFORE UPDATE ON public.tb_pms_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pms_reports_updated_at();