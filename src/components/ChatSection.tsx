import { useState, useRef, useEffect } from "react";
import { RotateCcw, Send, Mic, MicOff, MessageCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useElevenLabs } from "@/hooks/useElevenLabs";
import logo from "@/assets/uaicode-logo.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type InterfaceMode = "chat" | "voice";

const ChatSection = () => {
  const [mode, setMode] = useState<InterfaceMode>("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 I'm Eve, your AI assistant at Uaicode. I speak English, Português, and Español. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLoadingRef = useRef(isLoading);
  const { toast } = useToast();

  // ElevenLabs voice hook
  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    conversation: voiceConversation,
    error: voiceError,
    toggleCall,
    getInputVolume,
    getOutputVolume,
  } = useElevenLabs();

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
  }, [messages, voiceConversation]);

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

    const newMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('eve-chat', {
        body: { messages: newMessages }
      });

      if (error) throw error;

      const assistantMessage = data?.output?.[0]?.content || "Sorry, I could not process your request.";

      setMessages([
        ...newMessages,
        { role: "assistant", content: assistantMessage },
      ]);

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

      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, there was an error connecting to the chat service. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    setMessages([{
      role: "assistant",
      content: "Hi! 👋 I'm Eve, your AI assistant at Uaicode. I speak English, Português, and Español. How can I help you today?"
    }]);
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

  // Combine chat and voice messages for display
  const displayMessages = mode === "voice" && isCallActive ? voiceConversation : messages;

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

        <div className="bg-background border border-border rounded-xl shadow-xl flex flex-col h-[550px] sm:h-[600px] md:h-[650px] overflow-hidden">
          {/* Header */}
          <div className="bg-secondary/50 border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={logo} alt="Eve" className="w-10 h-10 rounded-full" loading="lazy" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-secondary ${
                  isCallActive ? 'bg-green-500 animate-pulse' : 'bg-green-500'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Eve</h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      isCallActive 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {getStatusText()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleReset}
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {displayMessages.length === 0 && (
              <div className="text-center text-muted-foreground mt-8">
                <p>Start a conversation with Eve</p>
              </div>
            )}
            {displayMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Visualization (when call is active) */}
          {isCallActive && (
            <div className="px-4 py-3 border-t border-border bg-secondary/30">
              <div className="flex items-end justify-center gap-1 h-12">
                {frequencyBars.map((height, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full transition-all duration-75 ease-out"
                    style={{
                      height: `${Math.max(height * 100, 10)}%`,
                      background: isSpeaking 
                        ? 'hsl(var(--accent))' 
                        : 'hsl(var(--muted-foreground))',
                      opacity: height > 0.2 ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                {isSpeaking ? "Eve is speaking..." : "Listening..."}
              </p>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              {/* Voice Button */}
              <Button
                onClick={handleToggleVoice}
                disabled={isConnecting}
                size="icon"
                className={`h-12 w-12 rounded-full shrink-0 transition-all duration-300 ${
                  isCallActive
                    ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                    : isConnecting
                    ? 'bg-accent/50 text-accent-foreground'
                    : 'bg-accent hover:bg-accent/90 text-accent-foreground'
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

              {/* Text Input */}
              <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isCallActive ? "Voice mode active..." : "Type your message..."}
                  disabled={isLoading || isCallActive}
                  className="flex-1 px-4 py-3 bg-secondary border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading || isCallActive}
                  className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Helper text */}
            <p className="text-xs text-center text-muted-foreground mt-3">
              {isCallActive 
                ? "Tap the microphone button to end the call" 
                : "Type a message or tap the microphone to talk"
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
