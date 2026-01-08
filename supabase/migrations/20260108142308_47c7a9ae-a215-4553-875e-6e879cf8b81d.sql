-- Remover política permissiva de INSERT em chat_conversations
DROP POLICY IF EXISTS "Anyone can insert conversations" ON chat_conversations;

-- Criar nova política de INSERT que vincula ao session_id
CREATE POLICY "Users can insert own conversations"
ON chat_conversations FOR INSERT
WITH CHECK (session_id = public.get_session_id());