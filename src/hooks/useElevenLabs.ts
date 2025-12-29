import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useElevenLabs = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const conversationHook = useConversation({
    onConnect: () => {
      console.log("ElevenLabs: Connected to agent");
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      console.log("ElevenLabs: Disconnected from agent");
      setIsConnecting(false);
    },
    onMessage: (payload) => {
      console.log("ElevenLabs message:", payload);
      
      // Map the role from ElevenLabs format to our format
      const role = payload.role === "user" ? "user" : "assistant";
      const content = payload.message;
      
      if (content) {
        setConversation(prev => [...prev, { role, content }]);
      }
    },
    onError: (message, context) => {
      console.error("ElevenLabs error:", message, context);
      setError(message || "Connection error");
      setIsConnecting(false);
    },
  });

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    setConversation([]);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from edge function
      const { data, error: fnError } = await supabase.functions.invoke(
        "elevenlabs-conversation-token"
      );

      if (fnError) {
        throw new Error(fnError.message || "Failed to get conversation token");
      }

      if (!data?.signed_url) {
        throw new Error(data?.error || "No signed URL received. Please configure ELEVENLABS_AGENT_ID in secrets.");
      }

      console.log("Starting ElevenLabs session with signed URL");

      // Start the conversation with WebSocket
      await conversationHook.startSession({
        signedUrl: data.signed_url,
      });
    } catch (err: any) {
      console.error("Failed to start call:", err);
      setError(err.message || "Failed to connect");
      setIsConnecting(false);
      throw err;
    }
  }, [conversationHook]);

  const endCall = useCallback(async () => {
    try {
      await conversationHook.endSession();
    } catch (err) {
      console.error("Error ending call:", err);
    }
  }, [conversationHook]);

  const toggleCall = useCallback(async () => {
    if (conversationHook.status === "connected") {
      await endCall();
    } else {
      await startCall();
    }
  }, [conversationHook.status, startCall, endCall]);

  return {
    isCallActive: conversationHook.status === "connected",
    isConnecting,
    isSpeaking: conversationHook.isSpeaking,
    conversation,
    error,
    toggleCall,
    startCall,
    endCall,
    // Expose volume methods for visualization
    getInputVolume: () => conversationHook.getInputVolume?.() || 0,
    getOutputVolume: () => conversationHook.getOutputVolume?.() || 0,
  };
};
