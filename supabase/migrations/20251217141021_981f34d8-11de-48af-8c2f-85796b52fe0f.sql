-- Create wizard_submissions table for SaaS Planning Wizard
CREATE TABLE public.wizard_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  
  -- Step 1: Lead Capture
  full_name TEXT NOT NULL,
  phone TEXT,
  company_name TEXT NOT NULL,
  
  -- Step 2: Product Definition
  saas_idea TEXT,
  industry TEXT,
  
  -- Step 3: Target Audience
  target_customers TEXT[],
  market_size TEXT,
  competitors TEXT[],
  
  -- Step 4: Features
  starter_features TEXT[],
  growth_features TEXT[],
  enterprise_features TEXT[],
  
  -- Step 5: Goals
  primary_goal TEXT,
  launch_timeline TEXT,
  budget_range TEXT,
  
  -- Calculated Fields
  complexity_score INTEGER,
  recommended_plan TEXT,
  viability_score INTEGER,
  
  -- Report Data (JSON)
  report_data JSONB,
  report_url TEXT UNIQUE,
  
  -- Progress tracking
  current_step INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Create index for faster lookups
CREATE INDEX idx_wizard_submissions_email ON public.wizard_submissions(email);
CREATE INDEX idx_wizard_submissions_report_url ON public.wizard_submissions(report_url);

-- Enable Row Level Security
ALTER TABLE public.wizard_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to insert (lead capture form)
CREATE POLICY "Anyone can create wizard submissions"
ON public.wizard_submissions
FOR INSERT
WITH CHECK (true);

-- RLS Policy: Allow users to read their own submissions by email
CREATE POLICY "Users can view their own submissions by email"
ON public.wizard_submissions
FOR SELECT
USING (true);

-- RLS Policy: Allow users to update their own submissions by email
CREATE POLICY "Users can update their own submissions"
ON public.wizard_submissions
FOR UPDATE
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_wizard_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_wizard_submissions_updated_at
BEFORE UPDATE ON public.wizard_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_wizard_submissions_updated_at();