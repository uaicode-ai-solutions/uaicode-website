import { useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";

interface KyleChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wizardId?: string;
}

const QUICK_REPLIES = [
  "Tell me about pricing",
  "I want to schedule a call",
  "What services do you offer?"
];

const KyleChatDialog = ({ open, onOpenChange, wizardId }: KyleChatDialogProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    messages,
    toggleCall,
    endCall,
    resetMessages,
  } = useKyleElevenLabs({ wizardId });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-connect when dialog opens (if wizardId is available)
  useEffect(() => {
    if (open && wizardId && !isCallActive && !isConnecting) {
      // Small delay to let dialog render
      const timer = setTimeout(() => {
        toggleCall();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open, wizardId]); // Only trigger on open change and wizardId

  const handleReset = useCallback(() => {
    if (isCallActive) {
      endCall();
    }
    resetMessages();
  }, [isCallActive, endCall, resetMessages]);

  const handleClose = useCallback(() => {
    if (isCallActive) {
      endCall();
    }
    onOpenChange(false);
  }, [isCallActive, endCall, onOpenChange]);

  const getStatusBadge = () => {
    if (error) {
      return (
        <Badge variant="outline" className="mt-2 text-xs border-destructive/50 text-destructive">
          <AlertCircle className="w-3 h-3 mr-1.5" />
          Error
        </Badge>
      );
    }
    if (isConnecting) {
      return (
        <Badge variant="outline" className="mt-2 text-xs border-amber-500/50 text-amber-500">
          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
          Connecting...
        </Badge>
      );
    }
    if (isCallActive) {
      return (
        <Badge variant="outline" className="mt-2 text-xs border-green-500/50 text-green-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
          {isSpeaking ? "Kyle is speaking..." : "Listening..."}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="mt-2 text-xs border-muted-foreground/50 text-muted-foreground">
        <MicOff className="w-3 h-3 mr-1.5" />
        Not connected
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden glass-card border-amber-500/20">
        <DialogTitle className="sr-only">Chat with Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="font-semibold text-foreground">AI Sales Consultant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Kyle Info */}
        <div className="flex flex-col items-center py-4 border-b border-border/30">
          <KyleAvatar isActive={isCallActive} isSpeaking={isSpeaking} size="md" />
          <h3 className="mt-2 font-semibold text-foreground">Kyle</h3>
          <p className="text-sm text-muted-foreground">Sales Consultant</p>
          {getStatusBadge()}
        </div>

        {/* Messages Area */}
        <div className="h-[250px] overflow-y-auto p-4 space-y-3">
          {/* Initial prompt when no messages and connected */}
          {messages.length === 0 && isCallActive && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-muted text-foreground rounded-bl-md">
                Hi! I'm Kyle, your sales consultant. How can I help you today?
              </div>
            </div>
          )}

          {/* Not connected state */}
          {messages.length === 0 && !isCallActive && !isConnecting && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Mic className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Tap the microphone to start talking with Kyle</p>
              {!wizardId && (
                <p className="text-xs text-yellow-600 mt-2">Project context not available</p>
              )}
            </div>
          )}

          {/* Connecting state */}
          {isConnecting && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 mb-2 animate-spin text-amber-400" />
              <p className="text-sm">Connecting to Kyle...</p>
            </div>
          )}

          {/* Real messages from ElevenLabs */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
            <div className="flex justify-start">
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
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Say something like:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs hover:bg-amber-500/10 hover:border-amber-500/50 cursor-default"
                >
                  "{reply}"
                </Badge>
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

        {/* Microphone Control Area */}
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <div className="flex flex-col items-center gap-3">
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
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              {isCallActive 
                ? "Tap to end conversation" 
                : "Tap to start voice chat"
              }
            </p>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            🎤 Voice powered by AI • Free consultation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KyleChatDialog;
