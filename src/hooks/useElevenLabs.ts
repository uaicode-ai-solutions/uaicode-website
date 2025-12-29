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
      console.log("Requesting microphone permission...");
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone permission granted");
      } catch (micError: any) {
        console.error("Microphone permission error:", micError);
        throw new Error("Microphone access denied. Please allow microphone access and try again.");
      }

      // Get signed URL from edge function
      console.log("Fetching conversation token from edge function...");
      
      let data, fnError;
      try {
        const response = await supabase.functions.invoke("elevenlabs-conversation-token");
        data = response.data;
        fnError = response.error;
      } catch (fetchError: any) {
        console.error("Network error calling edge function:", fetchError);
        throw new Error("Network error: Could not reach voice service. Please check your connection and try again.");
      }

      if (fnError) {
        console.error("Edge function error:", fnError);
        throw new Error(fnError.message || "Failed to get conversation token");
      }

      if (data?.error) {
        console.error("API error from edge function:", data.error);
        throw new Error(data.error);
      }

      if (!data?.signed_url) {
        console.error("No signed_url in response:", data);
        throw new Error("Voice service configuration error. Please contact support.");
      }

      console.log("Starting ElevenLabs session with signed URL");

      // Start the conversation with WebSocket
      await conversationHook.startSession({
        signedUrl: data.signed_url,
      });
      
      console.log("ElevenLabs session started successfully");
    } catch (err: any) {
      console.error("Failed to start call:", err);
      setError(err.message || "Failed to connect to voice service");
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
