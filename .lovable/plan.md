

# Plano: Criar Estrutura SEPARADA para Kyle Chat (Text-Only)

## ⚠️ GARANTIA: ZERO ALTERAÇÕES NOS ARQUIVOS EXISTENTES

Os seguintes arquivos **NÃO SERÃO TOCADOS**:
- ❌ `src/hooks/useKyleElevenLabs.ts` - **INTOCÁVEL**
- ❌ `supabase/functions/kyle-conversation-token/index.ts` - **INTOCÁVEL**
- ❌ `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` - **INTOCÁVEL**

## Arquivos a CRIAR (novos, do zero)

| Arquivo | Descrição |
|---------|-----------|
| `supabase/functions/kyle-chat-token/index.ts` | **NOVA** edge function usando `ELEVENLABS_KYLE_AGENT_ID_CHAT` |
| `src/hooks/useKyleChatElevenLabs.ts` | **NOVO** hook para modo text-only (sem microfone) |

## Arquivo a MODIFICAR (apenas 1 linha)

| Arquivo | Mudança |
|---------|---------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Trocar import de `useKyleElevenLabs` para `useKyleChatElevenLabs` |

---

## Detalhes Técnicos

### 1. NOVA Edge Function: `kyle-chat-token/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('=== kyle-chat-token function called ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    // USA O AGENT ID DE CHAT - DIFERENTE DO VOICE!
    const ELEVENLABS_KYLE_AGENT_ID_CHAT = Deno.env.get('ELEVENLABS_KYLE_AGENT_ID_CHAT');

    if (!ELEVENLABS_API_KEY || !ELEVENLABS_KYLE_AGENT_ID_CHAT) {
      return new Response(
        JSON.stringify({ error: 'Chat agent configuration missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sempre WebRTC para chat
    const apiUrl = `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_KYLE_AGENT_ID_CHAT}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        token: data.token, 
        agent_id: ELEVENLABS_KYLE_AGENT_ID_CHAT 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 2. NOVO Hook: `useKyleChatElevenLabs.ts`

```typescript
import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseKyleChatElevenLabsOptions {
  wizardId: string | undefined;
  onMessage?: (message: Message) => void;
}

export const useKyleChatElevenLabs = (options: UseKyleChatElevenLabsOptions) => {
  const { wizardId, onMessage } = options;
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const conversationConfig = useMemo(() => ({
    onConnect: () => {
      console.log("Kyle Chat: Connected");
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      console.log("Kyle Chat: Disconnected");
      setIsConnecting(false);
    },
    onMessage: (payload: { role?: string; message?: string }) => {
      console.log("Kyle Chat message:", payload);
      const role = payload.role === "user" ? "user" : "assistant";
      const content = payload.message;
      if (content) {
        const message: Message = { role, content };
        setMessages(prev => [...prev, message]);
        onMessageRef.current?.(message);
      }
    },
    onError: (message: string) => {
      console.error("Kyle Chat error:", message);
      setError(message || "Connection error");
      setIsConnecting(false);
      toast.error("Chat connection error", {
        description: message || "Failed to connect to Kyle Chat"
      });
    },
  }), []);

  const conversationHook = useConversation(conversationConfig);

  const startChat = useCallback(async () => {
    if (!wizardId) {
      toast.error("Missing project context");
      return;
    }

    setIsConnecting(true);
    setError(null);
    setMessages([]);

    try {
      // NÃO PEDE MICROFONE - É TEXT-ONLY!
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Chama a NOVA edge function de CHAT
      const { data, error: invokeError } = await supabase.functions.invoke('kyle-chat-token');

      if (invokeError || data?.error) {
        throw new Error(data?.error || invokeError?.message || 'Failed to get chat token');
      }

      if (!data?.token) {
        throw new Error('No chat token received');
      }

      // TEXT-ONLY MODE!
      await conversationHook.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
        textOnly: true,  // ← CRÍTICO: modo apenas texto
        dynamicVariables: {
          wizard_id: wizardId,
          timezone: userTimezone,
        },
      });

      console.log("Kyle Chat: Session started (text-only)");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect";
      setError(errorMessage);
      setIsConnecting(false);
      throw err;
    }
  }, [conversationHook, wizardId]);

  const endChat = useCallback(async () => {
    try {
      await conversationHook.endSession();
    } catch (err) {
      console.error("Kyle Chat: Error ending session:", err);
    }
  }, [conversationHook]);

  const toggleChat = useCallback(async () => {
    if (conversationHook.status === "connected") {
      await endChat();
    } else {
      await startChat();
    }
  }, [conversationHook.status, startChat, endChat]);

  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isCallActive: conversationHook.status === "connected",
    isConnecting,
    isSpeaking: false, // Sempre false - é text-only
    error,
    messages,
    toggleCall: toggleChat,
    startCall: startChat,
    endCall: endChat,
    resetMessages,
    sendUserMessage: conversationHook.sendUserMessage,
  };
};
```

### 3. Única Mudança no `KyleChatDialog.tsx`

**APENAS TROCAR O IMPORT** (linha 8):

```typescript
// ANTES
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";

// DEPOIS
import { useKyleChatElevenLabs } from "@/hooks/useKyleChatElevenLabs";
```

**E o uso do hook** (linha 26-36):

```typescript
// ANTES
} = useKyleElevenLabs({ wizardId });

// DEPOIS  
} = useKyleChatElevenLabs({ wizardId });
```

---

## Arquitetura Final (Separação Total)

```
┌─────────────────────────────────────────────────────────────────┐
│                         VOICE (INTOCADO)                        │
├─────────────────────────────────────────────────────────────────┤
│  KyleConsultantDialog                                           │
│         ↓                                                       │
│  useKyleElevenLabs                                              │
│         ↓                                                       │
│  kyle-conversation-token (edge)                                 │
│         ↓                                                       │
│  ELEVENLABS_KYLE_AGENT_ID (voz + microfone)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         CHAT (NOVO)                             │
├─────────────────────────────────────────────────────────────────┤
│  KyleChatDialog                                                 │
│         ↓                                                       │
│  useKyleChatElevenLabs (NOVO)                                   │
│         ↓                                                       │
│  kyle-chat-token (NOVA edge)                                    │
│         ↓                                                       │
│  ELEVENLABS_KYLE_AGENT_ID_CHAT (text-only, sem microfone)       │
└─────────────────────────────────────────────────────────────────┘
```

## Vantagens

1. **Zero risco** - Nenhum código existente é modificado
2. **Sem microfone** - UX melhor para chat puro
3. **Agente dedicado** - `ELEVENLABS_KYLE_AGENT_ID_CHAT` otimizado para texto
4. **Fácil rollback** - Se algo der errado, basta trocar 1 import

## Configuração no config.toml

Adicionar a nova função:

```toml
[functions.kyle-chat-token]
verify_jwt = false
```

