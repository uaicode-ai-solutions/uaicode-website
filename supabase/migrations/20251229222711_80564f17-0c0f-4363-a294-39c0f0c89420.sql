-- Criar tabela de conversas
CREATE TABLE public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar índice para busca por session_id
CREATE INDEX idx_chat_conversations_session_id ON public.chat_conversations(session_id);

-- Criar tabela de mensagens
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar índice para busca por conversation_id
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);

-- Habilitar RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para chat_conversations (acesso público por session_id)
CREATE POLICY "Anyone can read conversations by session_id"
ON public.chat_conversations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their conversations by session_id"
ON public.chat_conversations
FOR UPDATE
USING (true);

-- Políticas para chat_messages (acesso via conversa)
CREATE POLICY "Anyone can read messages"
ON public.chat_messages
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_conversations 
    SET updated_at = now() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para atualizar updated_at quando mensagem é adicionada
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_updated_at();