-- Atualizar função para usar URL diretamente (Vault não permite inserção via migration)
CREATE OR REPLACE FUNCTION public.notify_pms_user_created_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  payload jsonb;
  webhook_url text := 'https://uaicode-n8n.ax5vln.easypanel.host/webhook/23f9689d-c85b-4f83-af2a-b6a46537c4cd';
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
    body := payload
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block user creation
  RAISE WARNING 'Failed to call webhook: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Garantir que o trigger existe
DROP TRIGGER IF EXISTS trigger_pms_user_created_webhook ON public.tb_pms_users;
CREATE TRIGGER trigger_pms_user_created_webhook
  AFTER INSERT ON public.tb_pms_users
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pms_user_created_webhook();