import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVapi } from "@/hooks/useVapi";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";


const PhoneInterface = () => {
  const { isCallActive, isConnecting, conversation, volumeLevel, toggleCall } = useVapi();
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(20).fill(0));

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

  // Update frequency bars based on volumeLevel for waveform visualization
  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        const newBars = Array(20).fill(0).map((_, index) => {
          // Create frequency distribution (higher in middle)
          const centerDistance = Math.abs(index - 10) / 10;
          const baseHeight = volumeLevel * (1 - centerDistance * 0.5);
          
          // Add random variation for frequency simulation
          const variation = (Math.random() - 0.5) * 0.3;
          const height = Math.max(0.1, Math.min(1, baseHeight + variation));
          
          return height;
        });
        
        setFrequencyBars(newBars);
      }, 50); // Update every 50ms for smooth animation
      
      return () => clearInterval(interval);
    } else {
      setFrequencyBars(Array(20).fill(0));
    }
  }, [isCallActive, volumeLevel]);

  const handleToggleCall = async () => {
    try {
      await toggleCall();
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to Eve. Please check your settings.",
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
    if (isCallActive) return `Call in progress - ${formatDuration(callDuration)}`;
    return "Ready to Talk";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Card className="w-full max-w-md bg-background/50 backdrop-blur border-border">
        <CardContent className="pt-6 space-y-6">
          {/* Status Display */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {isConnecting && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              )}
              <p className="text-lg font-medium text-foreground">
                {getStatusText()}
              </p>
            </div>
            {isCallActive && (
              <p className="text-sm text-muted-foreground">
                Speak naturally - Eve is listening
              </p>
            )}
          </div>

          {/* Advanced Waveform Visualization */}
          {isCallActive && (
            <div className="space-y-2">
              <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wide">
                Voice Activity
              </p>
              <div className="flex items-end justify-center gap-1 h-24 px-4">
                {frequencyBars.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-full transition-all duration-100 ease-out"
                    style={{
                      height: `${height * 100}%`,
                      minHeight: '4px',
                      background: height > 0.6 
                        ? 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--destructive)))' 
                        : height > 0.3 
                        ? 'linear-gradient(to top, hsl(var(--primary)), hsl(39 100% 50%))'
                        : 'linear-gradient(to top, hsl(var(--primary)), hsl(48 96% 64%))',
                      opacity: height > 0.2 ? 1 : 0.4,
                      boxShadow: height > 0.7 ? '0 0 8px hsla(var(--destructive), 0.5)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Call Button */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              {/* Ripple Container - only show when call is active */}
              <div className="relative">
                {isCallActive && (
                  <>
                    {/* First wave */}
                    <div className="absolute inset-0 rounded-full border-2 border-destructive animate-sound-wave" 
                         style={{ animationDelay: "0s" }} />
                    {/* Second wave */}
                    <div className="absolute inset-0 rounded-full border-2 border-destructive animate-sound-wave" 
                         style={{ animationDelay: "0.5s" }} />
                    {/* Third wave */}
                    <div className="absolute inset-0 rounded-full border-2 border-destructive animate-sound-wave" 
                         style={{ animationDelay: "1s" }} />
                  </>
                )}
                
                <Button
                  onClick={handleToggleCall}
                  disabled={isConnecting}
                  className={`h-20 w-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative z-10 ${
                    isCallActive
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                      : isConnecting
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 animate-pulse-glow'
                  }`}
                >
                {isCallActive ? (
                    <MicOff className="h-12 w-12" />
                  ) : isConnecting ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-[5px] border-gray-900 border-t-transparent" />
                  ) : (
                    <Mic className="h-12 w-12" />
                  )}
                </Button>
              </div>
              
              <p className="text-sm font-medium text-muted-foreground">
                {isCallActive ? 'End Call' : isConnecting ? 'Connecting...' : 'Call Eve Now'}
              </p>
            </div>
          </div>

          {/* Live Transcript */}
          {conversation.length > 0 && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto p-4 bg-muted/30 rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Conversation
              </p>
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm ${
                    msg.role === 'user'
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="font-semibold">
                    {msg.role === 'user' ? 'You: ' : 'Eve: '}
                  </span>
                  {msg.content}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneInterface;
