import { useRef, useEffect, useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Send, Mic, MicOff, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";
import kyleAvatarImage from "@/assets/kyle-avatar.webp";

interface KyleChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wizardId?: string;
}

const KyleChatDialog = ({ open, onOpenChange, wizardId }: KyleChatDialogProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState("");
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(16).fill(0));
  const [isLoading, setIsLoading] = useState(false);
  const prevLoadingRef = useRef(isLoading);

  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    messages,
    toggleCall,
    endCall,
    resetMessages,
    sendUserMessage,
    getInputVolume,
    getOutputVolume,
  } = useKyleElevenLabs({ wizardId });

  // Store volume functions in refs to avoid dependency issues
  const getInputVolumeRef = useRef(getInputVolume);
  const getOutputVolumeRef = useRef(getOutputVolume);
  getInputVolumeRef.current = getInputVolume;
  getOutputVolumeRef.current = getOutputVolume;

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-start voice call when dialog opens
  useEffect(() => {
    if (open && !isCallActive && !isConnecting) {
      const timer = setTimeout(() => {
        handleToggleVoice();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (prevLoadingRef.current === true && isLoading === false && inputRef.current) {
      inputRef.current.focus();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  // Voice visualization - frequency bars (identical to Eve)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && isCallActive && sendUserMessage) {
      sendUserMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleReset = useCallback(() => {
    if (isCallActive) {
      endCall();
    }
    resetMessages();
    setInputText("");
  }, [isCallActive, endCall, resetMessages]);

  const handleClose = useCallback(() => {
    if (isCallActive) {
      endCall();
    }
    onOpenChange(false);
  }, [isCallActive, endCall, onOpenChange]);

  const handleToggleVoice = useCallback(async () => {
    try {
      await toggleCall();
    } catch (error) {
      console.error("Voice toggle error:", error);
    }
  }, [toggleCall]);

  const getStatusText = () => {
    if (isConnecting) return "Connecting...";
    if (isSpeaking) return "Kyle is speaking...";
    if (isCallActive) return "Listening...";
    return "Ready";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl p-0 overflow-hidden glass-card border-accent/10 h-[85vh] sm:h-[600px] md:h-[650px] flex flex-col">
        <DialogTitle className="sr-only">Chat with Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header - identical to Eve */}
        <div className="relative bg-gradient-to-r from-secondary/80 via-secondary/60 to-secondary/80 backdrop-blur-xl border-b border-accent/20 p-4 flex items-center justify-between">
          {/* Subtle golden accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          
          <div className="flex items-center gap-3">
            <KyleAvatar isActive={isCallActive} isSpeaking={isSpeaking} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Kyle</h3>
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

        {/* Messages Area - identical to Eve */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl" />
          </div>

          {/* Connecting State - shows while auto-connecting */}
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8 animate-fade-in-up">
              {/* Decorative background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/3 rounded-full blur-3xl" />
              </div>
              
              {/* Avatar with glow */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl scale-150 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                  <img 
                    src={kyleAvatarImage} 
                    alt="Kyle - AI Sales Consultant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Connecting text */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isConnecting ? "Connecting to" : "Starting conversation with"} <span className="text-gradient-gold">Kyle</span>
              </h3>
              <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                {isConnecting ? "Please wait while we establish a connection..." : "Preparing your AI sales consultant..."}
              </p>
              
              {/* Loading indicator */}
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            <div className="relative z-10 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} ${
                    index === messages.length - 1 ? "animate-fade-in-up" : ""
                  }`}
                >
                  {/* Kyle Avatar for assistant messages */}
                  {message.role !== "user" && (
                    <div className="flex-shrink-0 mt-1">
                      <KyleAvatar size="sm" isActive={index === messages.length - 1} isSpeaking={isSpeaking && index === messages.length - 1} />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-accent text-accent-foreground rounded-br-md"
                          : "bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-bl-md border border-border/50"
                      } ${index === messages.length - 1 && message.role !== "user" ? "shadow-[0_0_20px_rgba(250,204,21,0.1)]" : ""}`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 mt-1">
                    <KyleAvatar size="sm" isActive={true} isSpeaking={true} />
                  </div>
                  <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/80 rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Visualization (when call is active) - identical to Eve */}
        {isCallActive && (
          <div className="px-4 py-4 border-t border-border bg-gradient-to-b from-secondary/50 to-secondary/30">
            <div className="flex items-end justify-center gap-1 h-14">
              {frequencyBars.map((height, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full transition-all duration-75 ease-out"
                  style={{
                    height: `${Math.max(height * 100, 12)}%`,
                    background: isSpeaking 
                      ? `linear-gradient(to top, hsl(var(--accent)), hsl(var(--accent) / 0.6))` 
                      : `linear-gradient(to top, hsl(var(--muted-foreground)), hsl(var(--muted-foreground) / 0.4))`,
                    opacity: height > 0.2 ? 1 : 0.5,
                    boxShadow: height > 0.5 && isSpeaking 
                      ? '0 0 10px hsla(var(--accent) / 0.4)' 
                      : 'none',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-accent' : 'bg-green-500'} animate-pulse`} />
              <p className="text-sm text-muted-foreground">
                {isSpeaking ? "Kyle is speaking..." : "Listening..."}
              </p>
            </div>
          </div>
        )}

        {/* Input Area - identical to Eve */}
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
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isCallActive ? "Voice mode active..." : "Type your message..."}
                  disabled={isLoading || isCallActive}
                  className="w-full px-5 py-3 bg-secondary/80 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50 transition-all duration-300"
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!inputText.trim() || isLoading || isCallActive}
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
      </DialogContent>
    </Dialog>
  );
};

export default KyleChatDialog;
