import { useRef, useEffect, useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Loader2, AlertCircle, Send, Mic, MicOff, MessageSquare, Phone, DollarSign, Calendar, Package, PhoneOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";

interface KyleChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wizardId?: string;
}

const QUICK_REPLIES = [
  { label: "Pricing", icon: DollarSign, message: "Tell me about pricing" },
  { label: "Schedule", icon: Calendar, message: "I want to schedule a call" },
  { label: "Services", icon: Package, message: "What services do you offer?" },
];

const KyleChatDialog = ({ open, onOpenChange, wizardId }: KyleChatDialogProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState("");
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(12).fill(0));

  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    messages,
    isMicMuted,
    toggleCall,
    endCall,
    resetMessages,
    toggleMicMute,
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
  }, [messages]);

  // Auto-connect when dialog opens (if wizardId is available)
  useEffect(() => {
    if (open && wizardId && !isCallActive && !isConnecting) {
      const timer = setTimeout(() => {
        toggleCall();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open, wizardId]);

  // Voice visualization - frequency bars
  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        const inputVol = getInputVolumeRef.current();
        const outputVol = getOutputVolumeRef.current();
        const volumeLevel = Math.max(inputVol, outputVol);
        
        const newBars = Array(12).fill(0).map((_, index) => {
          const centerDistance = Math.abs(index - 6) / 6;
          const baseHeight = volumeLevel * (1 - centerDistance * 0.5);
          const variation = (Math.random() - 0.5) * 0.3;
          return Math.max(0.1, Math.min(1, baseHeight + variation));
        });
        
        setFrequencyBars(newBars);
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setFrequencyBars(Array(12).fill(0));
    }
  }, [isCallActive]);

  const handleSend = useCallback(() => {
    if (inputText.trim() && isCallActive && sendUserMessage) {
      sendUserMessage(inputText.trim());
      setInputText("");
    }
  }, [inputText, isCallActive, sendUserMessage]);

  const handleQuickReply = useCallback((reply: string) => {
    if (isCallActive && sendUserMessage) {
      sendUserMessage(reply);
    }
  }, [isCallActive, sendUserMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

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
    if (error) return "Error";
    if (isConnecting) return "Connecting...";
    if (isSpeaking) return "Kyle is speaking...";
    if (isCallActive) return "Online";
    return "Ready";
  };

  const getHelperText = () => {
    if (error) return "Connection error. Try again.";
    if (isConnecting) return "Establishing connection...";
    if (isCallActive) {
      if (isMicMuted) return "Microphone muted. Tap 🎤 to unmute";
      return isSpeaking 
        ? "Kyle is responding..." 
        : "Listening... Tap 🎤 to mute";
    }
    return "Tap 🎤 to start voice or type a message";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl p-0 overflow-hidden glass-card border-amber-500/20 h-[85vh] sm:h-[600px] md:h-[650px] flex flex-col">
        <DialogTitle className="sr-only">Chat with Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 backdrop-blur-xl border-b border-amber-500/20 p-4 flex items-center justify-between">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          
          <div className="flex items-center gap-3">
            <KyleAvatar isActive={isCallActive} isSpeaking={isSpeaking} size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Kyle</h3>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs mt-0.5 ${
                  error
                    ? 'bg-destructive/15 text-destructive border border-destructive/30'
                    : isCallActive 
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {error && <AlertCircle className="w-3 h-3 mr-1" />}
                {getStatusText()}
              </Badge>
            </div>
          </div>
          <Button
            onClick={handleReset}
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-amber-500/3 rounded-full blur-3xl" />
          </div>

          {/* Empty State with Chat/Voice badges */}
          {messages.length === 0 && !isConnecting && (
            <div className="flex flex-col items-center justify-center h-full text-center py-6 relative z-10">
              <KyleAvatar isActive={isCallActive} isSpeaking={isSpeaking} size="lg" />
              <h4 className="mt-4 font-semibold text-foreground">Hi! I'm Kyle</h4>
              <p className="text-sm text-muted-foreground">Your AI sales consultant</p>
              
              {/* Feature badges */}
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/5">
                  <MessageSquare className="w-3 h-3 mr-1.5" />
                  Chat
                </Badge>
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/5">
                  <Phone className="w-3 h-3 mr-1.5" />
                  Voice
                </Badge>
              </div>

              {!wizardId && (
                <p className="text-xs text-yellow-600 mt-3">Project context not available</p>
              )}
            </div>
          )}

          {/* Connecting state */}
          {isConnecting && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-6 relative z-10">
              <div className="relative">
                <KyleAvatar isActive={false} isSpeaking={false} size="lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Connecting to Kyle...</p>
            </div>
          )}

          {/* Real messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} relative z-10`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="flex justify-start relative z-10">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies - only show when connected and no messages yet */}
        {isCallActive && messages.length === 0 && !isSpeaking && (
          <div className="px-4 pb-2 border-t border-border/30 pt-3">
            <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-400 transition-all"
                  onClick={() => handleQuickReply(item.message)}
                >
                  <item.icon className="w-3 h-3 mr-1.5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="px-4 pb-2">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Voice Visualization (when call is active) */}
        {isCallActive && (
          <div className="px-4 py-3 border-t border-border/30 bg-gradient-to-b from-amber-500/5 to-transparent">
            <div className="flex items-end justify-center gap-1 h-10">
              {frequencyBars.map((height, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full transition-all duration-75 ease-out"
                  style={{
                    height: `${Math.max(height * 100, 12)}%`,
                    background: isSpeaking 
                      ? `linear-gradient(to top, hsl(45, 93%, 47%), hsl(45, 93%, 47%, 0.6))` 
                      : `linear-gradient(to top, hsl(45, 93%, 47%, 0.5), hsl(45, 93%, 47%, 0.2))`,
                    opacity: isMicMuted ? 0.3 : (height > 0.2 ? 1 : 0.5),
                    boxShadow: height > 0.5 && isSpeaking 
                      ? '0 0 8px hsla(45, 93%, 47%, 0.4)' 
                      : 'none',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isMicMuted ? 'bg-red-500' : (isSpeaking ? 'bg-amber-500' : 'bg-green-500')
                } animate-pulse`} />
                <p className="text-xs text-muted-foreground">
                  {isMicMuted ? "Muted" : (isSpeaking ? "Kyle is speaking..." : "Listening...")}
                </p>
              </div>
              {/* End Call Button */}
              <Button
                onClick={endCall}
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10"
              >
                <PhoneOff className="h-3 w-3 mr-1" />
                End Call
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-amber-500/10 p-4 bg-gradient-to-t from-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            {/* Voice Button with premium styling */}
            <div className="relative">
              {/* Pulse ring when inactive and not connecting */}
              {!isCallActive && !isConnecting && (
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" style={{ animationDuration: '2s' }} />
              )}
              <Button
                onClick={isCallActive ? toggleMicMute : handleToggleVoice}
                disabled={isConnecting}
                size="icon"
                className={`h-12 w-12 rounded-full shrink-0 transition-all duration-300 relative z-10 ${
                  isCallActive
                    ? isMicMuted
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                    : isConnecting
                    ? 'bg-amber-500/50 text-amber-900'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]'
                }`}
                title={isCallActive ? (isMicMuted ? "Unmute microphone" : "Mute microphone") : "Start voice call"}
              >
                {isCallActive ? (
                  isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />
                ) : isConnecting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isCallActive ? "Type your message..." : "Connecting..."}
                disabled={!isCallActive || isConnecting}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50 transition-all duration-300 text-sm"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!isCallActive || isConnecting || !inputText.trim()}
              size="icon"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {/* Helper text */}
          <p className="text-xs text-center text-muted-foreground/70 mt-3">
            {getHelperText()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KyleChatDialog;
