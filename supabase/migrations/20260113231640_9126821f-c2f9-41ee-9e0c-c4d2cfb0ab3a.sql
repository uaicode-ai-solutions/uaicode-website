CREATE OR REPLACE FUNCTION public.notify_pms_user_created_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  payload jsonb;
  webhook_url text;
BEGIN
  -- Buscar URL do webhook das secrets do Vault
  SELECT decrypted_secret INTO webhook_url
  FROM vault.decrypted_secrets
  WHERE name = 'LOGIN_NEWUSER_WEBHOOK_ID';
  
  -- Se não encontrar a secret, apenas retornar sem erro
  IF webhook_url IS NULL THEN
    RAISE WARNING 'LOGIN_NEWUSER_WEBHOOK_ID secret not found';
    RETURN NEW;
  END IF;

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