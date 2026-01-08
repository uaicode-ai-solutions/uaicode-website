-- Renomear as tabelas para o padrão tb_web_*
ALTER TABLE chat_conversations RENAME TO tb_web_chat_conversations;
ALTER TABLE chat_messages RENAME TO tb_web_chat_messages;

-- Atualizar a função de trigger para referenciar a nova tabela
CREATE OR REPLACE FUNCTION public.update_conversation_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    UPDATE public.tb_web_chat_conversations 
    SET updated_at = now() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

-- Recriar políticas RLS para tb_web_chat_conversations
DROP POLICY IF EXISTS "Users can read own conversations" ON public.tb_web_chat_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.tb_web_chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.tb_web_chat_conversations;

CREATE POLICY "Users can read own conversations" 
ON public.tb_web_chat_conversations 
FOR SELECT 
USING (session_id = get_session_id());

CREATE POLICY "Users can insert own conversations" 
ON public.tb_web_chat_conversations 
FOR INSERT 
WITH CHECK (session_id = get_session_id());

CREATE POLICY "Users can update own conversations" 
ON public.tb_web_chat_conversations 
FOR UPDATE 
USING (session_id = get_session_id());

-- Recriar políticas RLS para tb_web_chat_messages
DROP POLICY IF EXISTS "Users can read own messages" ON public.tb_web_chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.tb_web_chat_messages;

CREATE POLICY "Users can read own messages" 
ON public.tb_web_chat_messages 
FOR SELECT 
USING (conversation_id IN (
    SELECT id FROM public.tb_web_chat_conversations 
    WHERE session_id = get_session_id()
));

CREATE POLICY "Users can insert own messages" 
ON public.tb_web_chat_messages 
FOR INSERT 
WITH CHECK (conversation_id IN (
    SELECT id FROM public.tb_web_chat_conversations 
    WHERE session_id = get_session_id()
));