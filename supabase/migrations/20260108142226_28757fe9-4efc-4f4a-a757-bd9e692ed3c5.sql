-- 1. Remover políticas antigas permissivas
DROP POLICY IF EXISTS "Anyone can read conversations by session_id" ON chat_conversations;
DROP POLICY IF EXISTS "Anyone can update their conversations by session_id" ON chat_conversations;
DROP POLICY IF EXISTS "Anyone can read messages" ON chat_messages;

-- 2. Criar função para extrair session_id do header
CREATE OR REPLACE FUNCTION public.get_session_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-session-id',
    ''
  )
$$;

-- 3. Novas políticas para chat_conversations
CREATE POLICY "Users can read own conversations"
ON chat_conversations FOR SELECT
USING (session_id = public.get_session_id());

CREATE POLICY "Users can update own conversations"
ON chat_conversations FOR UPDATE
USING (session_id = public.get_session_id());

-- 4. Remover política antiga de insert de mensagens
DROP POLICY IF EXISTS "Anyone can insert messages" ON chat_messages;

-- 5. Novas políticas para chat_messages
CREATE POLICY "Users can read own messages"
ON chat_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE session_id = public.get_session_id()
  )
);

CREATE POLICY "Users can insert own messages"
ON chat_messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM chat_conversations 
    WHERE session_id = public.get_session_id()
  )
);