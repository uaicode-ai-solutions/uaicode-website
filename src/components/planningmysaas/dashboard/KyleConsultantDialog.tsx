import { useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertCircle, MessageSquare, X, Phone, PhoneOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";

interface KyleConsultantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageName?: string;
  wizardId?: string;
}

const KyleConsultantDialog = ({ open, onOpenChange, wizardId }: KyleConsultantDialogProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    messages,
    toggleCall,
    endCall,
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
        <MessageSquare className="w-3 h-3 mr-1.5" />
        Not connected
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden glass-card border-amber-500/20 [&>button]:hidden">
        <DialogTitle className="sr-only">Talk to Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="font-semibold text-foreground">AI Sales Consultant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
        <div className="h-[300px] overflow-y-auto p-4 space-y-4">
          {/* Initial prompt when no messages and connected */}
          {messages.length === 0 && isCallActive && (
            <div className="flex gap-3 justify-start animate-fade-in-up">
              <div className="flex-shrink-0 mt-1">
                <KyleAvatar size="sm" isActive={isCallActive} />
              </div>
              <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-2xl rounded-bl-md px-4 py-3 border border-border/50 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  Hi! I'm Kyle, your sales consultant. I'm listening!
                </p>
              </div>
            </div>
          )}

          {/* Not connected state */}
          {messages.length === 0 && !isCallActive && !isConnecting && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Click the button below to start talking with Kyle</p>
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

          {/* Real messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} ${
                index === messages.length - 1 ? "animate-fade-in-up" : ""
              }`}
            >
              {/* Kyle Avatar - só para mensagens do assistente */}
              {message.role === "assistant" && (
                <div className="flex-shrink-0 mt-1">
                  <KyleAvatar size="sm" isActive={isCallActive} />
                </div>
              )}

              {/* Message bubble */}
              <div className="flex flex-col max-w-[80%]">
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-br-md"
                      : "bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-bl-md border border-border/50"
                  } ${index === messages.length - 1 && message.role === "assistant" ? "shadow-[0_0_20px_rgba(250,204,21,0.1)]" : ""}`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Speaking indicator - quando Kyle está falando */}
          {messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="flex gap-3 justify-start animate-fade-in-up">
              <div className="flex-shrink-0 mt-1">
                <KyleAvatar size="sm" isActive />
              </div>
              <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Kyle is speaking</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 pb-2">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Voice Control Area */}
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <div className="flex justify-center">
            <Button
              onClick={toggleCall}
              disabled={isConnecting}
              className={`px-4 ${
                isCallActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30"
              }`}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isCallActive ? (
                <PhoneOff className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            🎤 Voice powered by AI • Free consultation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KyleConsultantDialog;
