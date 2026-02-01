import { useEffect, useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Loader2, Sparkles, AlertCircle } from "lucide-react";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";

interface KyleConsultantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageName?: string;
  wizardId?: string;
}

const KyleConsultantDialog = ({ open, onOpenChange, packageName, wizardId }: KyleConsultantDialogProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(12).fill(0.1));
  const animationFrameRef = useRef<number>();

  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    toggleCall,
    endCall,
    getInputVolume,
    getOutputVolume,
  } = useKyleElevenLabs({ wizardId });

  // Refs to store current values for animation loop (avoids stale closures)
  const getInputVolumeRef = useRef(getInputVolume);
  const getOutputVolumeRef = useRef(getOutputVolume);
  const isSpeakingRef = useRef(isSpeaking);

  // Keep refs updated with latest values
  useEffect(() => {
    getInputVolumeRef.current = getInputVolume;
    getOutputVolumeRef.current = getOutputVolume;
    isSpeakingRef.current = isSpeaking;
  }, [getInputVolume, getOutputVolume, isSpeaking]);

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

  // Real voice visualization using actual volume levels via refs
  useEffect(() => {
    if (!isCallActive) {
      setFrequencyBars(Array(12).fill(0.1));
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updateVisualization = () => {
      const inputVol = getInputVolumeRef.current();
      const outputVol = getOutputVolumeRef.current();
      
      // Use output volume when speaking, input volume when listening
      const activeVolume = isSpeakingRef.current ? outputVol : inputVol;
      const baseLevel = Math.max(0.1, activeVolume);
      
      // Generate bars with some randomness based on actual volume
      setFrequencyBars(
        Array(12).fill(0).map((_, i) => {
          const variation = Math.sin(Date.now() / 100 + i) * 0.2;
          const level = baseLevel + variation;
          return Math.max(0.1, Math.min(1, level));
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    animationFrameRef.current = requestAnimationFrame(updateVisualization);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCallActive]);

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

  const getStatusText = () => {
    if (error) return "Connection error";
    if (isConnecting) return "Connecting...";
    if (!isCallActive) return "Tap to start talking";
    if (isSpeaking) return "Kyle is speaking...";
    return "Listening...";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md glass-card border-amber-500/20">
        <DialogTitle className="sr-only">Talk to Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">AI Sales Consultant</span>
          <Sparkles className="h-4 w-4 text-amber-400" />
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
            {error ? (
              <AlertCircle className="w-4 h-4 text-destructive" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${
                isCallActive 
                  ? isSpeaking 
                    ? 'bg-amber-400 animate-pulse' 
                    : 'bg-green-500'
                  : 'bg-muted-foreground/50'
              }`} />
            )}
            <span className={`text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
              {getStatusText()}
            </span>
          </div>
          
          {/* Timer */}
          {isCallActive && (
            <div className="mt-2 text-lg font-mono text-amber-400">
              {formatTime(callDuration)}
            </div>
          )}
        </div>

        {/* Voice Visualization */}
        <div className="flex items-center justify-center gap-1 h-12 px-4">
          {frequencyBars.map((height, index) => (
            <div
              key={index}
              className={`w-2 rounded-full transition-all duration-75 ${
                isCallActive 
                  ? isSpeaking 
                    ? 'bg-gradient-to-t from-amber-500 to-yellow-500/60' 
                    : 'bg-amber-500/50'
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
          <div className="text-center py-2 px-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mx-4">
            <p className="text-xs text-muted-foreground">Interested in:</p>
            <p className="text-sm font-medium text-amber-400">{packageName}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center py-2 px-4 rounded-lg bg-destructive/10 border border-destructive/20 mx-4">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Missing wizardId Warning */}
        {!wizardId && (
          <div className="text-center py-2 px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mx-4">
            <p className="text-xs text-yellow-600">Project context not available</p>
          </div>
        )}

        {/* Call Button */}
        <div className="flex flex-col items-center gap-4 py-4">
          <Button
            size="lg"
            onClick={toggleCall}
            disabled={isConnecting || !wizardId}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${
              isCallActive
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                : isConnecting
                  ? 'bg-amber-500/50'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30'
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
