
-- Function that auto-calls pms-finalize-report when last step completes
CREATE OR REPLACE FUNCTION public.notify_pms_report_finalize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  IF NEW.status ILIKE '%completed%' AND NEW.status ILIKE '%call_get_mvp_business_plan%' THEN
    PERFORM net.http_post(
      url := 'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-finalize-report',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
      ),
      body := jsonb_build_object('wizard_id', NEW.wizard_id)
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to call pms-finalize-report: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Trigger on status column change
CREATE TRIGGER trg_pms_report_auto_finalize
  AFTER UPDATE OF status ON public.tb_pms_reports
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.notify_pms_report_finalize();
