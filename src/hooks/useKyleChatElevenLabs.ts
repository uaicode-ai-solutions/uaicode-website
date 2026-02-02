import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseKyleChatElevenLabsOptions {
  wizardId: string | undefined;
  onMessage?: (message: Message) => void;
}

export const useKyleChatElevenLabs = (options: UseKyleChatElevenLabsOptions) => {
  const { wizardId, onMessage } = options;
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  // Refs for robust restart logic
  const statusRef = useRef<string>("disconnected");
  const isRestartingRef = useRef(false);

  const conversationConfig = useMemo(() => ({
    onConnect: () => {
      console.log("Kyle Chat: Connected");
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      console.log("Kyle Chat: Disconnected");
      setIsConnecting(false);
    },
    onMessage: (payload: { role?: string; message?: string }) => {
      console.log("Kyle Chat message:", payload);
      const role = payload.role === "user" ? "user" : "assistant";
      const content = payload.message;
      if (content) {
        const message: Message = { role, content };
        setMessages(prev => [...prev, message]);
        onMessageRef.current?.(message);
      }
    },
    onError: (message: string) => {
      console.error("Kyle Chat error:", message);
      setError(message || "Connection error");
      setIsConnecting(false);
      toast.error("Chat connection error", {
        description: message || "Failed to connect to Kyle Chat"
      });
    },
  }), []);

  const conversationHook = useConversation(conversationConfig);

  // Keep statusRef in sync with conversationHook.status
  useEffect(() => {
    statusRef.current = conversationHook.status;
  }, [conversationHook.status]);

  const startChat = useCallback(async () => {
    if (!wizardId) {
      toast.error("Missing project context");
      return;
    }

    setIsConnecting(true);
    setError(null);
    setMessages([]);

    try {
      // NÃO PEDE MICROFONE - É TEXT-ONLY!
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Current date in UTC ISO 8601 format (without milliseconds)
      const currentDateUTC = new Date().toISOString().split('.')[0] + 'Z';
      
      console.log("Kyle Chat: Starting text-only session");
      console.log("Kyle Chat: wizard_id:", wizardId);
      console.log("Kyle Chat: timezone:", userTimezone);
      console.log("Kyle Chat: current_date:", currentDateUTC);

      // Chama a NOVA edge function de CHAT
      const { data, error: invokeError } = await supabase.functions.invoke('kyle-chat-token');

      if (invokeError || data?.error) {
        console.error("Kyle Chat: Token error:", invokeError || data?.error);
        throw new Error(data?.error || invokeError?.message || 'Failed to get chat token');
      }

      if (!data?.token) {
        throw new Error('No chat token received');
      }

      console.log("Kyle Chat: Token received, starting session...");

      // TEXT-ONLY MODE!
      await conversationHook.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
        textOnly: true,  // ← CRÍTICO: modo apenas texto
        dynamicVariables: {
          wizard_id: wizardId,
          timezone: userTimezone,
          current_date: currentDateUTC,
        },
      });

      console.log("Kyle Chat: Session started (text-only)");
    } catch (err: unknown) {
      console.error("Kyle Chat: Failed to start:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to connect";
      setError(errorMessage);
      setIsConnecting(false);
      throw err;
    }
  }, [conversationHook, wizardId]);

  const endChat = useCallback(async () => {
    try {
      await conversationHook.endSession();
    } catch (err) {
      console.error("Kyle Chat: Error ending session:", err);
    }
  }, [conversationHook]);

  const toggleChat = useCallback(async () => {
    if (conversationHook.status === "connected") {
      await endChat();
    } else {
      await startChat();
    }
  }, [conversationHook.status, startChat, endChat]);

  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Robust restart: end → wait for disconnected → start
  const restartCall = useCallback(async () => {
    // Guard against multiple restarts
    if (isRestartingRef.current) {
      console.log("Kyle Chat: Restart already in progress, ignoring");
      return;
    }
    isRestartingRef.current = true;

    try {
      // End session if connected
      if (statusRef.current === "connected") {
        console.log("Kyle Chat: Ending current session for restart...");
        await endChat();
      }

      // Poll until disconnected (max 3s)
      const maxWait = 60; // 60 * 50ms = 3s
      for (let i = 0; i < maxWait; i++) {
        if (statusRef.current === "disconnected") {
          console.log("Kyle Chat: Confirmed disconnected, starting new session...");
          break;
        }
        await new Promise(r => setTimeout(r, 50));
      }

      // Clear messages before reconnecting
      setMessages([]);

      // Start new session
      await startChat();
    } catch (err) {
      console.error("Kyle Chat: Restart failed:", err);
    } finally {
      isRestartingRef.current = false;
    }
  }, [endChat, startChat]);

  // Wrapper que adiciona mensagem do usuário IMEDIATAMENTE ao array
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    // Adiciona mensagem do usuário ao array ANTES de enviar
    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    onMessageRef.current?.(userMessage);
    
    // Envia para o ElevenLabs
    conversationHook.sendUserMessage(text.trim());
  }, [conversationHook]);

  return {
    isCallActive: conversationHook.status === "connected",
    isConnecting,
    isSpeaking: false, // Sempre false - é text-only
    error,
    messages,
    toggleCall: toggleChat,
    startCall: startChat,
    endCall: endChat,
    resetMessages,
    restartCall, // New: robust one-click restart
    sendUserMessage: sendMessage, // Usar wrapper ao invés do original
  };
};
