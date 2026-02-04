import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseEveElevenLabsOptions {
  onMessage?: (message: Message) => void;
}

export const useEveElevenLabs = (options: UseEveElevenLabsOptions = {}) => {
  const { onMessage } = options;
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localIsSpeaking, setLocalIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Store callback in ref to avoid stale closures
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  // Refs for robust restart logic
  const statusRef = useRef<string>("disconnected");
  const isRestartingRef = useRef(false);

  // Memoize the conversation config to prevent re-initialization issues
  const conversationConfig = useMemo(() => ({
    onConnect: () => {
      console.log("Eve ElevenLabs: Connected to agent");
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      console.log("Eve ElevenLabs: Disconnected from agent");
      setIsConnecting(false);
      setLocalIsSpeaking(false);
    },
    onMessage: (payload: { role?: string; message?: string }) => {
      console.log("Eve ElevenLabs message:", payload);
      
      const role = payload.role === "user" ? "user" : "assistant";
      const content = payload.message;
      
      if (content) {
        const message: Message = { role: role as "user" | "assistant", content };
        setMessages(prev => [...prev, message]);
        onMessageRef.current?.(message);
      }
    },
    onError: (message: string, context: unknown) => {
      console.error("Eve ElevenLabs error:", message, context);
      setError(message || "Connection error");
      setIsConnecting(false);
      setLocalIsSpeaking(false);
      toast.error("Voice connection error", {
        description: message || "Failed to connect to Eve"
      });
    },
    onSpeakingChange: (speaking: boolean) => {
      console.log("Eve ElevenLabs speaking state:", speaking);
      setLocalIsSpeaking(speaking);
    },
  }), []);

  const conversationHook = useConversation(conversationConfig);

  // Watchdog: if isSpeaking but not connected, reset
  useEffect(() => {
    if (conversationHook.status !== "connected" && localIsSpeaking) {
      console.log("Eve Watchdog: Resetting stale isSpeaking state");
      setLocalIsSpeaking(false);
    }
  }, [conversationHook.status, localIsSpeaking]);

  // Keep statusRef in sync with conversationHook.status
  useEffect(() => {
    statusRef.current = conversationHook.status;
  }, [conversationHook.status]);

  // Fetch token using supabase.functions.invoke
  const fetchConversationToken = async (mode: "webrtc" | "websocket" = "webrtc") => {
    console.log(`Fetching Eve ElevenLabs token with mode: ${mode}`);
    
    const { data, error } = await supabase.functions.invoke('eve-conversation-token', {
      body: { mode }
    });

    if (error) {
      console.error("Eve edge function invoke error:", error);
      throw new Error(`Eve voice service error: ${error.message}`);
    }

    if (data?.error) {
      console.error("Eve edge function returned error:", data.error);
      throw new Error(data.error);
    }

    console.log("Eve edge function response:", data);

    if (mode === "webrtc" && data?.token) {
      return { type: "webrtc" as const, token: data.token, agentId: data.agent_id };
    }
    
    if (mode === "websocket" && data?.signed_url) {
      return { type: "websocket" as const, signedUrl: data.signed_url, agentId: data.agent_id };
    }

    // Fallback: check if we got either format
    if (data?.token) {
      return { type: "webrtc" as const, token: data.token, agentId: data.agent_id };
    }
    if (data?.signed_url) {
      return { type: "websocket" as const, signedUrl: data.signed_url, agentId: data.agent_id };
    }

    throw new Error("Eve voice service did not return valid credentials.");
  };

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    setMessages([]); // Reset messages on new call

    try {
      // Request microphone permission
      console.log("Eve: Requesting microphone permission...");
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Eve: Microphone permission granted");
      } catch (micError: unknown) {
        console.error("Eve: Microphone permission error:", micError);
        throw new Error("Microphone access denied. Please allow microphone access and try again.");
      }

      // Detect user timezone for dynamic variables
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log("Eve: User timezone detected:", userTimezone);

      // Current date in UTC ISO 8601 format (without milliseconds)
      const currentDateUTC = new Date().toISOString().split('.')[0] + 'Z';
      console.log("Eve: Current date (UTC):", currentDateUTC);

      // Try WebRTC first (recommended by ElevenLabs docs)
      console.log("Eve: Attempting WebRTC connection...");
      try {
        const webrtcData = await fetchConversationToken("webrtc");
        
        if (webrtcData.type === "webrtc" && webrtcData.token) {
          console.log("Eve: Starting ElevenLabs session with WebRTC token");
          await conversationHook.startSession({
            conversationToken: webrtcData.token,
            connectionType: "webrtc",
            dynamicVariables: {
              timezone: userTimezone,
              current_date: currentDateUTC,
            },
          });
          console.log("Eve: ElevenLabs WebRTC session started successfully");
          return;
        }
      } catch (webrtcError: unknown) {
        console.warn("Eve: WebRTC connection failed, trying WebSocket fallback:", 
          webrtcError instanceof Error ? webrtcError.message : String(webrtcError));
      }

      // Fallback to WebSocket with signed URL
      console.log("Eve: Attempting WebSocket connection...");
      const wsData = await fetchConversationToken("websocket");
      
      if (wsData.type === "websocket" && wsData.signedUrl) {
        console.log("Eve: Starting ElevenLabs session with WebSocket signed URL");
        await conversationHook.startSession({
          signedUrl: wsData.signedUrl,
          connectionType: "websocket",
          dynamicVariables: {
            timezone: userTimezone,
            current_date: currentDateUTC,
          },
        });
        console.log("Eve: ElevenLabs WebSocket session started successfully");
        return;
      }

      throw new Error("Could not establish voice connection with Eve. Please try again.");
    } catch (err: unknown) {
      console.error("Eve: Failed to start call:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to Eve voice service";
      setError(errorMessage);
      setIsConnecting(false);
      throw err;
    }
  }, [conversationHook]);

  const endCall = useCallback(async () => {
    try {
      await conversationHook.endSession();
    } catch (err) {
      console.error("Eve: Error ending call:", err);
    }
  }, [conversationHook]);

  const toggleCall = useCallback(async () => {
    if (conversationHook.status === "connected") {
      await endCall();
    } else {
      await startCall();
    }
  }, [conversationHook.status, startCall, endCall]);

  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Robust restart: end → wait for disconnected → start
  const restartCall = useCallback(async () => {
    // Guard against multiple restarts
    if (isRestartingRef.current) {
      console.log("Eve Voice: Restart already in progress, ignoring");
      return;
    }
    isRestartingRef.current = true;

    try {
      // End session if connected
      if (statusRef.current === "connected") {
        console.log("Eve Voice: Ending current session for restart...");
        await endCall();
      }

      // Poll until disconnected (max 3s)
      const maxWait = 60; // 60 * 50ms = 3s
      for (let i = 0; i < maxWait; i++) {
        if (statusRef.current === "disconnected") {
          console.log("Eve Voice: Confirmed disconnected, starting new session...");
          break;
        }
        await new Promise(r => setTimeout(r, 50));
      }

      // Clear messages before reconnecting
      setMessages([]);

      // Start new session
      await startCall();
    } catch (err) {
      console.error("Eve Voice: Restart failed:", err);
    } finally {
      isRestartingRef.current = false;
    }
  }, [endCall, startCall]);

  return {
    isCallActive: conversationHook.status === "connected",
    isConnecting,
    // Use local state that gets reset on disconnect, with fallback that ensures false if not connected
    isSpeaking: conversationHook.status === "connected" 
      ? (localIsSpeaking || conversationHook.isSpeaking) 
      : false,
    error,
    messages,
    toggleCall,
    startCall,
    endCall,
    resetMessages,
    restartCall,
    sendUserMessage: conversationHook.sendUserMessage,
    getInputVolume: () => conversationHook.getInputVolume?.() || 0,
    getOutputVolume: () => conversationHook.getOutputVolume?.() || 0,
  };
};

