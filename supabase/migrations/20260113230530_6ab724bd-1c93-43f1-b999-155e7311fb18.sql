-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create function to call n8n webhook after new user is inserted
CREATE OR REPLACE FUNCTION public.notify_pms_user_created_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  payload jsonb;
  webhook_url text := 'https://rafaelluz.app.n8n.cloud/webhook/9eed39c2-faa0-4949-9cec-03e6bdd0f85d';
BEGIN
  -- Build payload with all user data
  payload := jsonb_build_object(
    'event', 'user.created',
    'timestamp', now(),
    'data', to_jsonb(NEW)
  );
  
  -- Send async HTTP POST to n8n webhook
  PERFORM net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := payload::text
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block user creation
  RAISE WARNING 'Failed to call webhook: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger to fire after new user is inserted
CREATE TRIGGER tb_pms_users_after_insert_webhook
  AFTER INSERT ON public.tb_pms_users
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pms_user_created_webhook();