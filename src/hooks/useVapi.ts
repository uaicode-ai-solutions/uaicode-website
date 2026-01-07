import { useState, useCallback, useRef, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseVapiOptions {
  onVoiceMessage?: (message: Message) => Promise<void>;
}

// Initialize Vapi with Public Key
const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

export const useVapi = (options: UseVapiOptions = {}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  const onVoiceMessageRef = useRef(options.onVoiceMessage);
  onVoiceMessageRef.current = options.onVoiceMessage;

  useEffect(() => {
    const handleCallStart = () => {
      console.log('VAPI: Call started');
      setIsCallActive(true);
      setIsConnecting(false);
      setError(null);
    };

    const handleCallEnd = () => {
      console.log('VAPI: Call ended');
      setIsCallActive(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    };

    const handleSpeechStart = () => {
      console.log('VAPI: Agent speaking');
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log('VAPI: Agent stopped speaking');
      setIsSpeaking(false);
    };

    const handleVolumeLevel = (level: number) => {
      setVolumeLevel(level);
    };

    const handleMessage = (message: any) => {
      console.log('VAPI message:', message);
      
      // Handle final transcripts
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const role = message.role === 'user' ? 'user' : 'assistant';
        onVoiceMessageRef.current?.({
          role: role as 'user' | 'assistant',
          content: message.transcript
        });
      }
    };

    const handleError = (error: any) => {
      console.error('VAPI error:', error);
      setError(error?.message || 'Voice connection error');
      setIsConnecting(false);
      setIsCallActive(false);
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('speech-start', handleSpeechStart);
    vapi.on('speech-end', handleSpeechEnd);
    vapi.on('volume-level', handleVolumeLevel);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('speech-start', handleSpeechStart);
      vapi.off('speech-end', handleSpeechEnd);
      vapi.off('volume-level', handleVolumeLevel);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
    };
  }, []);

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
      if (!assistantId) {
        throw new Error('VAPI Assistant ID not configured');
      }

      await vapi.start(assistantId);
    } catch (err: any) {
      console.error('Failed to start VAPI call:', err);
      setError(err.message || 'Failed to connect to voice service');
      setIsConnecting(false);
      throw err;
    }
  }, []);

  const endCall = useCallback(async () => {
    try {
      vapi.stop();
    } catch (err) {
      console.error('Error ending VAPI call:', err);
    }
  }, []);

  const toggleCall = useCallback(async () => {
    if (isCallActive) {
      await endCall();
    } else {
      await startCall();
    }
  }, [isCallActive, startCall, endCall]);

  return {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    volumeLevel,
    toggleCall,
    startCall,
    endCall,
    getInputVolume: () => volumeLevel,
    getOutputVolume: () => volumeLevel,
  };
};
