-- Remove the legacy trigger that causes duplicate webhook calls
-- The orchestrator is now called directly from frontend code
DROP TRIGGER IF EXISTS on_pms_wizard_created ON public.tb_pms_wizard;

-- Also remove the function since it's no longer needed
DROP FUNCTION IF EXISTS public.notify_pms_wizard_created_webhook();