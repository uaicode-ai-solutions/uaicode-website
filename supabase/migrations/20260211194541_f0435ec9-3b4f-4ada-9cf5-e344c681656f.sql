-- Remove all duplicate emails keeping only the row with the latest updated_at (tie-break by id)
DELETE FROM public.tb_crm_leads
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY email 
      ORDER BY updated_at DESC, created_at DESC, id DESC
    ) AS rn
    FROM public.tb_crm_leads
    WHERE email IS NOT NULL AND email != ''
  ) ranked
  WHERE rn > 1
);

-- Now add the UNIQUE constraint
ALTER TABLE public.tb_crm_leads
  ADD CONSTRAINT tb_crm_leads_email_unique UNIQUE (email);