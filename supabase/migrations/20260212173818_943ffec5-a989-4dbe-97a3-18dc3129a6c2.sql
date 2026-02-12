CREATE OR REPLACE FUNCTION public.notify_pms_wizard_created_webhook()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-webhook-new-leads',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
    ),
    body := jsonb_build_object('wizard_id', NEW.id)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to call edge function: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_pms_wizard_created
  AFTER INSERT ON public.tb_pms_wizard
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pms_wizard_created_webhook();