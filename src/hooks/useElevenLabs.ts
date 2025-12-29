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

  // Fetch token using supabase.functions.invoke (same pattern as eve-chat)
  const fetchConversationToken = async (mode: "webrtc" | "websocket" = "webrtc") => {
    console.log(`Fetching ElevenLabs token with mode: ${mode}`);
    
    const { data, error } = await supabase.functions.invoke('elevenlabs-conversation-token', {
      body: { mode }
    });

    if (error) {
      console.error("Edge function invoke error:", error);
      throw new Error(`Voice service error: ${error.message}`);
    }

    if (data?.error) {
      console.error("Edge function returned error:", data.error);
      throw new Error(data.error);
    }

    console.log("Edge function response:", data);

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

    throw new Error("Voice service did not return valid credentials.");
  };

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

      // Try WebRTC first (recommended by ElevenLabs docs)
      console.log("Attempting WebRTC connection...");
      try {
        const webrtcData = await fetchConversationToken("webrtc");
        
        if (webrtcData.type === "webrtc" && webrtcData.token) {
          console.log("Starting ElevenLabs session with WebRTC token");
          await conversationHook.startSession({
            conversationToken: webrtcData.token,
            connectionType: "webrtc",
          });
          console.log("ElevenLabs WebRTC session started successfully");
          return;
        }
      } catch (webrtcError: any) {
        console.warn("WebRTC connection failed, trying WebSocket fallback:", webrtcError.message);
      }

      // Fallback to WebSocket with signed URL
      console.log("Attempting WebSocket connection...");
      const wsData = await fetchConversationToken("websocket");
      
      if (wsData.type === "websocket" && wsData.signedUrl) {
        console.log("Starting ElevenLabs session with WebSocket signed URL");
        await conversationHook.startSession({
          signedUrl: wsData.signedUrl,
          connectionType: "websocket",
        });
        console.log("ElevenLabs WebSocket session started successfully");
        return;
      }

      throw new Error("Could not establish voice connection. Please try again.");
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
    getInputVolume: () => conversationHook.getInputVolume?.() || 0,
    getOutputVolume: () => conversationHook.getOutputVolume?.() || 0,
  };
};
