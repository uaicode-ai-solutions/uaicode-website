import { useState, useRef, useEffect } from "react";
import { RotateCcw, Send, Mic, MicOff, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useElevenLabs } from "@/hooks/useElevenLabs";
import { useConversation } from "@/hooks/useConversation";
import EveAvatar from "@/components/chat/EveAvatar";
import ChatMessage from "@/components/chat/ChatMessage";
import TypingIndicator from "@/components/chat/TypingIndicator";
import QuickReplies from "@/components/chat/QuickReplies";
import EmptyState from "@/components/chat/EmptyState";
import VoiceVisualization from "@/components/chat/VoiceVisualization";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type InterfaceMode = "chat" | "voice";

const ChatSection = () => {
  const [mode, setMode] = useState<InterfaceMode>("chat");
  const { messages, addMessage, resetConversation, isLoadingHistory } = useConversation();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLoadingRef = useRef(isLoading);
  const { toast } = useToast();

  // Callback to save voice messages to database
  const handleVoiceMessage = async (message: Message) => {
    await addMessage(message);
  };

  // ElevenLabs voice hook with message callback
  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error: voiceError,
    toggleCall,
    getInputVolume,
    getOutputVolume,
  } = useElevenLabs({ onVoiceMessage: handleVoiceMessage });

  // Waveform visualization
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(16).fill(0));
  const [callDuration, setCallDuration] = useState(0);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (prevLoadingRef.current === true && isLoading === false && inputRef.current) {
      inputRef.current.focus();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  // Voice error handling
  useEffect(() => {
    if (voiceError) {
      toast({
        title: "Voice Connection Error",
        description: voiceError,
        variant: "destructive",
      });
    }
  }, [voiceError, toast]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Store volume functions in refs to avoid dependency issues
  const getInputVolumeRef = useRef(getInputVolume);
  const getOutputVolumeRef = useRef(getOutputVolume);
  getInputVolumeRef.current = getInputVolume;
  getOutputVolumeRef.current = getOutputVolume;

  // Waveform visualization
  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        const inputVol = getInputVolumeRef.current();
        const outputVol = getOutputVolumeRef.current();
        const volumeLevel = Math.max(inputVol, outputVol);
        
        const newBars = Array(16).fill(0).map((_, index) => {
          const centerDistance = Math.abs(index - 8) / 8;
          const baseHeight = volumeLevel * (1 - centerDistance * 0.5);
          const variation = (Math.random() - 0.5) * 0.3;
          return Math.max(0.1, Math.min(1, baseHeight + variation));
        });
        
        setFrequencyBars(newBars);
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setFrequencyBars(Array(16).fill(0));
    }
  }, [isCallActive]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    await addMessage(userMessage);
    setInputValue("");
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage];
      const { data, error } = await supabase.functions.invoke('eve-chat', {
        body: { messages: allMessages }
      });

      if (error) throw error;

      const assistantContent = data?.output?.[0]?.content || "Sorry, I could not process your request.";
      const assistantMessage = { role: "assistant" as const, content: assistantContent };
      await addMessage(assistantMessage);

      // Handle scheduling action
      if (data?.action === 'schedule') {
        setTimeout(() => {
          document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      toast({
        title: "Error",
        description: error?.message || "Sorry, there was an error connecting to Eve.",
        variant: "destructive",
      });

      const errorMessage = { role: "assistant" as const, content: "Sorry, there was an error connecting to the chat service. Please try again." };
      await addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    resetConversation();
  };

  const handleToggleVoice = async () => {
    try {
      await toggleCall();
      if (!isCallActive) {
        setMode("voice");
      }
    } catch (error: any) {
      console.error("Voice toggle error:", error);
      const errorMessage = error.message || "Failed to connect to Eve.";
      
      // Provide more specific error messages based on error type
      let description = errorMessage;
      
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        description = "Network error connecting to voice service. Please check your connection.";
      } else if (errorMessage.includes("Microphone")) {
        description = "Microphone access required. Please allow it in browser settings.";
      } else if (errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("Unauthorized")) {
        description = "Voice service authentication error. Please try again.";
      } else if (errorMessage.includes("not configured")) {
        description = "Voice service is not configured. Please contact support.";
      } else if (errorMessage.includes("allowlist") || errorMessage.includes("origin")) {
        description = "This domain is not allowed for voice. Please contact support.";
      }
      
      toast({
        title: "Voice Connection Error",
        description,
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (isConnecting) return "Connecting...";
    if (isSpeaking) return "Eve is speaking...";
    if (isCallActive) return `Listening... ${formatDuration(callDuration)}`;
    return "Ready";
  };

  return (
    <section id="chat" className="py-24 bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Talk to <span className="text-gradient-gold">Eve</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Your AI assistant - available via chat or voice
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>English • Português • Español</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl flex flex-col h-[550px] sm:h-[600px] md:h-[650px] overflow-hidden border-accent/10">
          {/* Header with glassmorphism */}
          <div className="relative bg-gradient-to-r from-secondary/80 via-secondary/60 to-secondary/80 backdrop-blur-xl border-b border-accent/20 p-4 flex items-center justify-between">
            {/* Subtle golden accent line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            
            <div className="flex items-center gap-3">
              <EveAvatar isActive={isCallActive} isSpeaking={isSpeaking} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Eve</h3>
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs mt-0.5 ${
                    isCallActive 
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30' 
                      : 'bg-accent/10 text-accent border border-accent/20'
                  }`}
                >
                  {getStatusText()}
                </Badge>
              </div>
            </div>
            <Button
              onClick={handleReset}
              size="icon"
              variant="ghost"
              className="h-9 w-9 hover:bg-accent/10 hover:text-accent transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl" />
            </div>
            
            {messages.length === 0 && !isLoading ? (
              <EmptyState />
            ) : (
              <div className="relative z-10 space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    isLatest={index === messages.length - 1}
                    isSpeaking={isSpeaking && message.role === "assistant" && index === messages.length - 1}
                  />
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Replies */}
          <QuickReplies 
            onSelect={(message) => sendMessage(message)} 
            isVisible={messages.length <= 1 && !isLoading && !isCallActive && !inputValue}
          />

          {/* Voice Visualization (when call is active) */}
          {isCallActive && (
            <VoiceVisualization frequencyBars={frequencyBars} isSpeaking={isSpeaking} />
          )}

          {/* Input Area */}
          <div className="border-t border-accent/10 p-4 bg-gradient-to-t from-secondary/30 to-transparent">
            <div className="flex items-center gap-3">
              {/* Voice Button with premium styling */}
              <div className="relative">
                {/* Pulse ring when inactive */}
                {!isCallActive && !isConnecting && (
                  <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping-slow" />
                )}
                <Button
                  onClick={handleToggleVoice}
                  disabled={isConnecting}
                  size="icon"
                  className={`h-12 w-12 rounded-full shrink-0 transition-all duration-300 relative z-10 ${
                    isCallActive
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                      : isConnecting
                      ? 'bg-accent/50 text-accent-foreground'
                      : 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]'
                  }`}
                >
                  {isCallActive ? (
                    <MicOff className="h-5 w-5" />
                  ) : isConnecting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-foreground border-t-transparent" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Text Input with enhanced styling */}
              <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isCallActive ? "Voice mode active..." : "Type your message..."}
                    disabled={isLoading || isCallActive}
                    className="w-full px-5 py-3 bg-secondary/80 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50 transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading || isCallActive}
                  className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Helper text */}
            <p className="text-xs text-center text-muted-foreground/70 mt-3">
              {isCallActive 
                ? "Tap the microphone to end the call" 
                : "Type a message or tap the microphone to speak"
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
