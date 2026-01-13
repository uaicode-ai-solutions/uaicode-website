-- Atualizar função para chamar edge function ao invés de n8n diretamente
-- A edge function lê o webhook ID do secret LOGIN_NEWUSER_WEBHOOK_ID

CREATE OR REPLACE FUNCTION public.notify_pms_user_created_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  -- Chamar edge function que gerencia o webhook via secret
  PERFORM net.http_post(
    url := 'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-webhook-new-user',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
    ),
    body := jsonb_build_object('auth_user_id', NEW.auth_user_id)
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to call edge function: %', SQLERRM;
  RETURN NEW;
END;
$function$;