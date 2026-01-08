import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Phone, PhoneOff, Mic, MicOff, Sparkles } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";
import EveAvatar from "./EveAvatar";

interface PhoneCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PhoneCallDialog = ({ open, onOpenChange }: PhoneCallDialogProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(12).fill(0.1));

  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    volumeLevel,
    toggleCall,
  } = useVapi();

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // Voice visualization
  useEffect(() => {
    if (!isCallActive) {
      setFrequencyBars(Array(12).fill(0.1));
      return;
    }

    const interval = setInterval(() => {
      const newBars = Array(12).fill(0).map(() => {
        if (isSpeaking) {
          return 0.3 + Math.random() * 0.7;
        }
        return 0.1 + volumeLevel * Math.random() * 0.5;
      });
      setFrequencyBars(newBars);
    }, 100);

    return () => clearInterval(interval);
  }, [isCallActive, isSpeaking, volumeLevel]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    if (error) return "Connection error";
    if (isConnecting) return "Connecting...";
    if (!isCallActive) return "Tap to call Eve";
    if (isSpeaking) return "Eve is speaking...";
    return "Listening...";
  };

  const handleToggleCall = useCallback(async () => {
    try {
      await toggleCall();
    } catch (err) {
      console.error("Call toggle error:", err);
    }
  }, [toggleCall]);

  const handleClose = useCallback(async () => {
    if (isCallActive) {
      await toggleCall();
    }
    onOpenChange(false);
  }, [isCallActive, toggleCall, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-card via-card to-background border-accent/20 p-0 overflow-hidden">
        {/* Header with sparkles */}
        <div className="relative pt-8 pb-4 px-6 text-center">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-xs text-accent font-medium">AI Voice Assistant</span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </div>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center px-6 pb-4">
          <div className="relative">
            <EveAvatar 
              isActive={isCallActive} 
              isSpeaking={isSpeaking} 
              size="lg" 
            />
            {isCallActive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold mt-4 text-foreground">Eve</h3>
          
          {/* Status */}
          <div className="flex items-center gap-2 mt-2">
            <div 
              className={`w-2 h-2 rounded-full ${
                error ? "bg-destructive" :
                isConnecting ? "bg-yellow-500 animate-pulse" :
                isCallActive ? (isSpeaking ? "bg-accent animate-pulse" : "bg-green-500 animate-pulse") :
                "bg-muted-foreground"
              }`} 
            />
            <span className="text-sm text-muted-foreground">{getStatusText()}</span>
          </div>

          {/* Timer */}
          {isCallActive && (
            <div className="mt-2 text-lg font-mono text-accent">
              {formatTime(callDuration)}
            </div>
          )}
        </div>

        {/* Voice Visualization */}
        <div className="px-6 py-4 bg-gradient-to-b from-secondary/30 to-secondary/50">
          <div className="flex items-end justify-center gap-1.5 h-16">
            {frequencyBars.map((height, i) => (
              <div
                key={i}
                className="w-2.5 rounded-full transition-all duration-100 ease-out"
                style={{
                  height: `${Math.max(height * 100, 12)}%`,
                  background: isCallActive
                    ? isSpeaking 
                      ? `linear-gradient(to top, hsl(var(--accent)), hsl(var(--accent) / 0.5))`
                      : `linear-gradient(to top, hsl(142.1 76.2% 36.3%), hsl(142.1 76.2% 36.3% / 0.5))`
                    : `linear-gradient(to top, hsl(var(--muted-foreground)), hsl(var(--muted-foreground) / 0.3))`,
                  opacity: height > 0.2 ? 1 : 0.5,
                  boxShadow: height > 0.5 && isCallActive
                    ? isSpeaking 
                      ? "0 0 12px hsla(var(--accent) / 0.5)"
                      : "0 0 12px hsla(142.1, 76.2%, 36.3%, 0.4)"
                    : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Call Button */}
        <div className="px-6 py-6 flex flex-col items-center gap-4">
          <button
            onClick={handleToggleCall}
            disabled={isConnecting}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isCallActive
                ? "bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/30"
                : "bg-accent hover:bg-accent/90 shadow-lg shadow-accent/30"
            } ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {/* Pulse rings */}
            {isCallActive && (
              <>
                <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
                <span className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse" />
              </>
            )}
            {!isCallActive && !isConnecting && (
              <span className="absolute inset-0 rounded-full bg-accent/20 animate-pulse" />
            )}
            
            {isCallActive ? (
              <PhoneOff className="w-8 h-8 text-destructive-foreground relative z-10" />
            ) : isConnecting ? (
              <div className="w-8 h-8 border-3 border-accent-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Phone className="w-8 h-8 text-accent-foreground relative z-10" />
            )}
          </button>

          <p className="text-sm text-muted-foreground text-center">
            {isCallActive 
              ? "Tap to end the call" 
              : "Tap to start talking with Eve"}
          </p>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground">
            Voice powered by AI • Free consultation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneCallDialog;
