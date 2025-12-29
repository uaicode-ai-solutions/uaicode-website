-- Add saas_category column to wizard_submissions table
ALTER TABLE public.wizard_submissions 
ADD COLUMN saas_category TEXT;