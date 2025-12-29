import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Get Supabase URL from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ukuqflaakynzzikuszjl.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdXFmbGFha3luenppa3VzempsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTIzNDcsImV4cCI6MjA3Nzg2ODM0N30.090glE1geyiMbUXxOofu4AZ7OC5Oozgd59iRbONiq-M";

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

  // Direct fetch to edge function (bypasses SDK issues)
  const fetchSignedUrl = async (): Promise<{ signed_url: string; agent_id: string }> => {
    const functionUrl = `${SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`;
    
    console.log("Calling edge function directly:", functionUrl);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({}),
    });

    console.log("Edge function response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge function error response:", errorText);
      
      if (response.status === 404) {
        throw new Error("Voice service not found. Please try again later.");
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error("Authentication error with voice service.");
      }
      
      throw new Error(`Voice service error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    if (!data.signed_url) {
      throw new Error("Voice service did not return required data.");
    }

    return data;
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

      // Get signed URL from edge function using direct fetch
      console.log("Fetching conversation token from edge function...");
      
      const data = await fetchSignedUrl();

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
