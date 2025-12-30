-- Create leads table for marketing purposes
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact data
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country_code TEXT,
  
  -- Project data
  project_description TEXT,
  
  -- Booking data
  booking_id TEXT,
  booking_date TIMESTAMPTZ,
  
  -- Metadata
  source TEXT DEFAULT 'voice_agent',
  language TEXT,
  session_id TEXT,
  
  -- Marketing control
  marketing_consent BOOLEAN DEFAULT true,
  enriched BOOLEAN DEFAULT false,
  enriched_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for email search
CREATE INDEX idx_leads_email ON public.leads(email);

-- Index for non-enriched leads (marketing queries)
CREATE INDEX idx_leads_not_enriched ON public.leads(enriched) WHERE enriched = false;

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from voice agent (public endpoint)
CREATE POLICY "Allow insert leads from voice agent" 
  ON public.leads FOR INSERT 
  WITH CHECK (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_leads_updated_at();