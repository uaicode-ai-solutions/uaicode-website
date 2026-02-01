import { useEffect, useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Loader2, Sparkles, AlertCircle, RotateCcw, X } from "lucide-react";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KyleConsultantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageName?: string;
  wizardId?: string;
}

const KyleConsultantDialog = ({ open, onOpenChange, packageName, wizardId }: KyleConsultantDialogProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoStarted = useRef(false);

  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    messages,
    toggleCall,
    endCall,
    restartCall,
  } = useKyleElevenLabs({ wizardId });

  // Auto-start call when dialog opens
  useEffect(() => {
    if (open && wizardId && !isCallActive && !isConnecting && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      const timer = setTimeout(() => {
        toggleCall();
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Reset when dialog closes
    if (!open) {
      hasAutoStarted.current = false;
    }
  }, [open, wizardId, isCallActive, isConnecting, toggleCall]);

  // Timer for call duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = useCallback(() => {
    if (isCallActive) {
      endCall();
    }
    onOpenChange(false);
  }, [isCallActive, endCall, onOpenChange]);

  const handleReset = useCallback(() => {
    restartCall();
  }, [restartCall]);

  const getStatusText = () => {
    if (error) return "Connection error";
    if (isConnecting) return "Connecting...";
    if (!isCallActive) return "Disconnected";
    if (isSpeaking) return "Kyle is speaking...";
    return "Listening...";
  };

  const getStatusColor = () => {
    if (error) return "text-destructive";
    if (isConnecting) return "text-amber-400";
    if (!isCallActive) return "text-muted-foreground";
    if (isSpeaking) return "text-amber-400";
    return "text-green-500";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 glass-card border-amber-500/20 h-[580px] flex flex-col overflow-hidden">
        <DialogTitle className="sr-only">Talk to Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header - Same style as KyleChatDialog */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <div>
                <span className="font-semibold text-foreground">AI Sales Consultant</span>
                <p className="text-xs text-muted-foreground">Voice Chat</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                disabled={isConnecting}
                className="h-8 w-8 p-0 hover:bg-amber-500/10"
              >
                <RotateCcw className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center py-4 px-4 flex-shrink-0 border-b border-border/30">
          <KyleAvatar 
            isActive={isCallActive || isConnecting} 
            isSpeaking={isSpeaking}
            size="lg"
          />
          
          <h3 className="mt-3 text-lg font-semibold text-foreground">Kyle</h3>
          
          {/* Status indicator */}
          <div className="mt-2 flex items-center gap-2">
            {error ? (
              <AlertCircle className="w-3 h-3 text-destructive" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${
                isCallActive 
                  ? isSpeaking 
                    ? 'bg-amber-400 animate-pulse' 
                    : 'bg-green-500'
                  : isConnecting
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-muted-foreground/50'
              }`} />
            )}
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {isCallActive && (
              <span className="text-sm font-mono text-amber-400 ml-2">
                {formatTime(callDuration)}
              </span>
            )}
          </div>
        </div>

        {/* Transcript Area - Same style as KyleChatDialog */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                {isCallActive ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                      <Phone className="h-6 w-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isSpeaking ? "Kyle is speaking..." : "Listening... Start talking!"}
                    </p>
                  </>
                ) : isConnecting ? (
                  <>
                    <Loader2 className="h-8 w-8 text-amber-400 animate-spin mb-3" />
                    <p className="text-sm text-muted-foreground">Connecting to Kyle...</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                      <Phone className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Call will start automatically...
                    </p>
                  </>
                )}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 mt-1">
                      <KyleAvatar size="sm" isActive={true} isSpeaking={false} />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-amber-500/20 text-foreground rounded-br-md"
                      : "bg-secondary/80 text-foreground rounded-bl-md border border-border/50"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Package Info */}
        {packageName && (
          <div className="mx-4 mb-2 text-center py-2 px-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
            <p className="text-xs text-muted-foreground">Interested in:</p>
            <p className="text-sm font-medium text-amber-400">{packageName}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-2 text-center py-2 px-4 rounded-lg bg-destructive/10 border border-destructive/20 flex-shrink-0">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Footer with controls */}
        <div className="p-4 border-t border-border/50 bg-background/50 flex-shrink-0">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={toggleCall}
              disabled={isConnecting || !wizardId}
              className={`w-14 h-14 rounded-full transition-all duration-300 ${
                isCallActive
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                  : isConnecting
                    ? 'bg-amber-500/50'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30'
              }`}
            >
              {isConnecting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isCallActive ? (
                <PhoneOff className="h-5 w-5" />
              ) : (
                <Phone className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">🎤 Voice powered by AI</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-xs text-muted-foreground">Free consultation</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KyleConsultantDialog;
