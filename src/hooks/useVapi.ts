import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useVapi = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    
    if (publicKey) {
      vapiRef.current = new Vapi(publicKey);

      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        console.log('VAPI: Call started');
        setIsCallActive(true);
        setIsConnecting(false);
      });

      vapiRef.current.on('call-end', () => {
        console.log('VAPI: Call ended');
        setIsCallActive(false);
        setIsConnecting(false);
      });

      vapiRef.current.on('volume-level', (level: number) => {
        setVolumeLevel(level);
      });

      vapiRef.current.on('message', (message: any) => {
        console.log('VAPI: Message received', message);
        
        if (message.type === 'transcript' && message.transcript) {
          setConversation(prev => [
            ...prev,
            {
              role: message.role === 'user' ? 'user' : 'assistant',
              content: message.transcript
            }
          ]);
        }
      });

      vapiRef.current.on('error', (error: any) => {
        console.error('VAPI: Error', error);
        setIsCallActive(false);
        setIsConnecting(false);
      });
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const toggleCall = async () => {
    if (!vapiRef.current) {
      throw new Error('VAPI not initialized. Please check your VAPI credentials.');
    }

    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
    
    if (!assistantId) {
      throw new Error('VAPI Assistant ID not configured.');
    }

    if (isCallActive) {
      vapiRef.current.stop();
      setConversation([]);
    } else {
      setIsConnecting(true);
      setConversation([]);
      try {
        await vapiRef.current.start(assistantId);
      } catch (error) {
        setIsConnecting(false);
        throw error;
      }
    }
  };

  return {
    isCallActive,
    isConnecting,
    conversation,
    volumeLevel,
    toggleCall
  };
};
