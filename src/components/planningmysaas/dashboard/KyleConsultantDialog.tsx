import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Loader2, Sparkles } from "lucide-react";
import KyleAvatar from "@/components/chat/KyleAvatar";

interface KyleConsultantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageName?: string;
}

const KyleConsultantDialog = ({ open, onOpenChange, packageName }: KyleConsultantDialogProps) => {
  // Mocked states - replace with real useVapi hook when Kyle is configured
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(12).fill(0.1));

  // Timer for call duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  // Simulate voice visualization when speaking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && isSpeaking) {
      interval = setInterval(() => {
        setFrequencyBars(
          Array(12).fill(0).map(() => 0.2 + Math.random() * 0.8)
        );
      }, 100);
    } else if (isCallActive) {
      // Listening state - subtle animation
      interval = setInterval(() => {
        setFrequencyBars(
          Array(12).fill(0).map(() => 0.1 + Math.random() * 0.3)
        );
      }, 150);
    } else {
      setFrequencyBars(Array(12).fill(0.1));
    }
    return () => clearInterval(interval);
  }, [isCallActive, isSpeaking]);

  // Simulate Kyle speaking periodically (MOCK - remove when connecting real VAPI)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setIsSpeaking(prev => !prev);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleCall = useCallback(() => {
    if (isCallActive) {
      // End call
      setIsCallActive(false);
      setIsSpeaking(false);
      setCallDuration(0);
    } else {
      // Start call (simulate connecting)
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsCallActive(true);
      }, 1500);
    }
  }, [isCallActive]);

  const handleClose = useCallback(() => {
    if (isCallActive) {
      setIsCallActive(false);
      setIsSpeaking(false);
      setCallDuration(0);
    }
    onOpenChange(false);
  }, [isCallActive, onOpenChange]);

  const getStatusText = () => {
    if (isConnecting) return "Connecting...";
    if (!isCallActive) return "Tap to start talking";
    if (isSpeaking) return "Kyle is speaking...";
    return "Listening...";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-card via-card to-blue-950/20 border-blue-500/20">
        <DialogTitle className="sr-only">Talk to Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">AI Sales Consultant</span>
          <Sparkles className="h-4 w-4 text-blue-400" />
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6">
          <KyleAvatar 
            isActive={isCallActive || isConnecting} 
            isSpeaking={isSpeaking}
            size="lg"
          />
          
          <h3 className="mt-4 text-xl font-semibold text-foreground">Kyle</h3>
          <p className="text-sm text-muted-foreground">Sales Consultant</p>
          
          {/* Status */}
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isCallActive 
                ? isSpeaking 
                  ? 'bg-blue-400 animate-pulse' 
                  : 'bg-cyan-400'
                : 'bg-muted-foreground/50'
            }`} />
            <span className="text-sm text-muted-foreground">{getStatusText()}</span>
          </div>
          
          {/* Timer */}
          {isCallActive && (
            <div className="mt-2 text-lg font-mono text-blue-400">
              {formatTime(callDuration)}
            </div>
          )}
        </div>

        {/* Voice Visualization */}
        <div className="flex items-center justify-center gap-1 h-12 px-4">
          {frequencyBars.map((height, index) => (
            <div
              key={index}
              className={`w-2 rounded-full transition-all duration-100 ${
                isCallActive 
                  ? isSpeaking 
                    ? 'bg-gradient-to-t from-blue-500 to-cyan-400' 
                    : 'bg-blue-500/50'
                  : 'bg-muted-foreground/20'
              }`}
              style={{
                height: `${height * 40}px`,
                minHeight: '4px'
              }}
            />
          ))}
        </div>

        {/* Package Info */}
        {packageName && (
          <div className="text-center py-2 px-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mx-4">
            <p className="text-xs text-muted-foreground">Interested in:</p>
            <p className="text-sm font-medium text-blue-400">{packageName}</p>
          </div>
        )}

        {/* Call Button */}
        <div className="flex flex-col items-center gap-4 py-4">
          <Button
            size="lg"
            onClick={handleToggleCall}
            disabled={isConnecting}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${
              isCallActive
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                : isConnecting
                  ? 'bg-blue-500/50'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isCallActive ? (
              <PhoneOff className="h-6 w-6" />
            ) : (
              <Phone className="h-6 w-6" />
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            {isCallActive 
              ? "Tap to end the conversation" 
              : "Start a voice conversation with Kyle, our AI sales consultant"
            }
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/30">
          <span className="text-xs text-muted-foreground">🎤 Voice powered by AI</span>
          <span className="text-muted-foreground/30">•</span>
          <span className="text-xs text-muted-foreground">Free consultation</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KyleConsultantDialog;
