-- Corrigir função get_session_id com search_path
CREATE OR REPLACE FUNCTION public.get_session_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-session-id',
    ''
  )
$$;