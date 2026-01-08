import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! 👋 I'm Eve, your AI assistant at Uaicode. How can I help you today?"
};

const getSessionId = (): string => {
  const key = 'eve_session_id';
  
  // Use sessionStorage first to avoid conflicts between tabs
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    // Try to recover from localStorage as fallback
    sessionId = localStorage.getItem(key);
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }
    
    // Sync both storages
    localStorage.setItem(key, sessionId);
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
};

export const useConversation = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [sessionId] = useState(getSessionId);

  // Load or create conversation on mount
  useEffect(() => {
    const initConversation = async () => {
      try {
        // Find existing conversation for this session only
        const { data: existingConversation, error: fetchError } = await supabase
          .from('chat_conversations')
          .select('id, session_id')
          .eq('session_id', sessionId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching conversation:', fetchError);
          setIsLoadingHistory(false);
          return;
        }

        if (existingConversation) {
          // Load messages from existing conversation
          const { data: existingMessages, error: messagesError } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('conversation_id', existingConversation.id)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
          } else if (existingMessages && existingMessages.length > 0) {
            setMessages(existingMessages as Message[]);
          }
          
          setConversationId(existingConversation.id);
        } else {
          // Create new conversation
          const { data: newConversation, error: createError } = await supabase
            .from('chat_conversations')
            .insert({ session_id: sessionId })
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating conversation:', createError);
          } else if (newConversation) {
            setConversationId(newConversation.id);
            // Save initial message
            await supabase.from('chat_messages').insert({
              conversation_id: newConversation.id,
              role: INITIAL_MESSAGE.role,
              content: INITIAL_MESSAGE.content
            });
          }
        }
      } catch (error) {
        console.error('Error initializing conversation:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    initConversation();
  }, [sessionId]);

  // Save a message to the database
  const saveMessage = useCallback(async (message: Message) => {
    if (!conversationId) return;

    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      role: message.role,
      content: message.content
    });

    if (error) {
      console.error('Error saving message:', error);
    }
  }, [conversationId]);

  // Add a message and save to DB
  const addMessage = useCallback(async (message: Message) => {
    setMessages(prev => [...prev, message]);
    await saveMessage(message);
  }, [saveMessage]);

  // Reset conversation - creates a new one
  const resetConversation = useCallback(async () => {
    try {
      const { data: newConversation, error } = await supabase
        .from('chat_conversations')
        .insert({ session_id: sessionId })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating new conversation:', error);
        return;
      }

      if (newConversation) {
        setConversationId(newConversation.id);
        setMessages([INITIAL_MESSAGE]);
        
        // Save initial message to new conversation
        await supabase.from('chat_messages').insert({
          conversation_id: newConversation.id,
          role: INITIAL_MESSAGE.role,
          content: INITIAL_MESSAGE.content
        });
      }
    } catch (error) {
      console.error('Error resetting conversation:', error);
    }
  }, [sessionId]);

  return {
    conversationId,
    messages,
    setMessages,
    addMessage,
    resetConversation,
    isLoadingHistory,
    sessionId
  };
};
