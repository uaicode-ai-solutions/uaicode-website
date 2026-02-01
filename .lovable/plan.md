

# Plano: Replicar ChatSection da Eve no KyleChatDialog

## Objetivo

Reescrever o `KyleChatDialog` para ficar **VISUALMENTE IDÊNTICO** ao chat da Eve (`ChatSection.tsx`), adaptando apenas o avatar e o nome para Kyle.

## Análise das Diferenças

### ChatSection (Eve) - O Modelo
| Elemento | Implementação |
|----------|---------------|
| Container | `h-[550px] sm:h-[600px] md:h-[650px]` com `glass-card` |
| Header | Avatar `size="md"`, gradiente `from-secondary/80`, `border-accent/20` |
| Avatar | Usa `EveAvatar` component separado |
| Messages | Usa `ChatMessage` component com avatar inline |
| Empty State | Usa `EmptyState` component separado |
| Quick Replies | Usa `QuickReplies` component separado |
| Voice Viz | Usa `VoiceVisualization` component separado |
| Input | Form com `onSubmit`, input desabilitado quando `isCallActive` |
| Mic Button | Inicia/encerra chamada, mostra `MicOff` quando ativo |
| Helper Text | "Type a message or tap the microphone to speak" |

### KyleChatDialog (Atual) - Problemas
| Elemento | Problema |
|----------|----------|
| Container | Correto após última mudança |
| Header | Cores amber em vez de accent/secondary |
| Avatar | Usa `KyleAvatar` mas com size `sm` |
| Messages | Renderização inline sem component separado |
| Empty State | Inline sem component separado |
| Quick Replies | QUICK_REPLIES inline diferente |
| Voice Viz | Inline com barras de frequência complexas |
| Input | Lógica de mute complicada, sem form |
| Mic Button | Toggle mute ao invés de start/stop call |

## Solução: Reescrever KyleChatDialog

Vou reescrever o componente para replicar **exatamente** a estrutura da Eve:

### Mudanças Principais

1. **Header**: Copiar estrutura exata da Eve, trocar `EveAvatar` por `KyleAvatar`, trocar `accent` por `amber`
2. **Messages Area**: Usar mesma estrutura com background pattern
3. **Empty State**: Criar inline igual ao `EmptyState` da Eve mas com Kyle
4. **Quick Replies**: Remover (Eve mostra QuickReplies mas em um component separado - podemos adicionar depois)
5. **Voice Visualization**: Usar `VoiceVisualization` component (ou criar versão Kyle)
6. **Input Area**: Copiar estrutura exata com form
7. **Mic Button**: Mesmo comportamento da Eve - inicia/encerra chamada (não mute)
8. **Helper Text**: Mesmo texto da Eve

### Estrutura Final

```
┌────────────────────────────────────────────────────────────────────┐
│ [Kyle Avatar MD] Kyle ✨                                     [🔄] │
│                  Ready/Online                                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│         [Avatar grande com glow]                                   │
│         Hi! I'm Kyle                                               │
│         Your AI sales consultant                                   │
│         [💬 Instant chat] [🎤 Smart response]                      │
│                                                                    │
│   ou mensagens...                                                  │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│        ▂ ▄ ▆ █ ▆ ▄ ▂ ▂ ▄ ▆ █ ▆ ▄ ▂                              │
│             ● Kyle is speaking... / Listening...                   │
├────────────────────────────────────────────────────────────────────┤
│ [🎤]  [Type your message...]                              [Send]  │
│       Type a message or tap the microphone to speak                │
└────────────────────────────────────────────────────────────────────┘
```

## Código Proposto

### 1. Imports Simplificados
```tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RotateCcw, Send, Mic, MicOff, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import KyleAvatar from "@/components/chat/KyleAvatar";
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";
import kyleAvatarImage from "@/assets/kyle-avatar.webp";
```

### 2. Header (Idêntico à Eve)
```tsx
<div className="relative bg-gradient-to-r from-secondary/80 via-secondary/60 to-secondary/80 backdrop-blur-xl border-b border-accent/20 p-4 flex items-center justify-between">
  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
  
  <div className="flex items-center gap-3">
    <KyleAvatar isActive={isCallActive} isSpeaking={isSpeaking} size="md" />
    <div>
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-foreground">Kyle</h3>
        <Sparkles className="w-4 h-4 text-accent" />
      </div>
      <Badge 
        variant="secondary" 
        className={`text-xs mt-0.5 ${
          isCallActive 
            ? 'bg-green-500/15 text-green-400 border border-green-500/30' 
            : 'bg-accent/10 text-accent border border-accent/20'
        }`}
      >
        {getStatusText()}
      </Badge>
    </div>
  </div>
  <Button onClick={handleReset} size="icon" variant="ghost" className="h-9 w-9 hover:bg-accent/10 hover:text-accent">
    <RotateCcw className="h-4 w-4" />
  </Button>
</div>
```

### 3. Empty State (Igual ao da Eve)
```tsx
{messages.length === 0 && !isConnecting && (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8 animate-fade-in-up">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/3 rounded-full blur-3xl" />
    </div>
    
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl scale-150" />
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent shadow-[0_0_30px_rgba(250,204,21,0.4)]">
        <img src={kyleAvatarImage} alt="Kyle" className="w-full h-full object-cover" />
      </div>
    </div>
    
    <h3 className="text-xl font-semibold text-foreground mb-2">
      Hi! I'm <span className="text-gradient-gold">Kyle</span>
    </h3>
    <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
      Your AI sales consultant. I'm here to help you understand our services and answer your questions.
    </p>
    
    <div className="flex flex-wrap gap-2 justify-center">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs text-muted-foreground">
        <MessageCircle className="w-3 h-3" />
        <span>Instant chat</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs text-muted-foreground">
        <Mic className="w-3 h-3" />
        <span>Smart response</span>
      </div>
    </div>
  </div>
)}
```

### 4. Voice Visualization (Igual à Eve)
```tsx
{isCallActive && (
  <div className="px-4 py-4 border-t border-border bg-gradient-to-b from-secondary/50 to-secondary/30">
    <div className="flex items-end justify-center gap-1 h-14">
      {frequencyBars.map((height, i) => (
        <div
          key={i}
          className="w-2 rounded-full transition-all duration-75 ease-out"
          style={{
            height: `${Math.max(height * 100, 12)}%`,
            background: isSpeaking 
              ? `linear-gradient(to top, hsl(var(--accent)), hsl(var(--accent) / 0.6))` 
              : `linear-gradient(to top, hsl(var(--muted-foreground)), hsl(var(--muted-foreground) / 0.4))`,
            opacity: height > 0.2 ? 1 : 0.5,
            boxShadow: height > 0.5 && isSpeaking ? '0 0 10px hsla(var(--accent) / 0.4)' : 'none',
          }}
        />
      ))}
    </div>
    <div className="flex items-center justify-center gap-2 mt-3">
      <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-accent' : 'bg-green-500'} animate-pulse`} />
      <p className="text-sm text-muted-foreground">
        {isSpeaking ? "Kyle is speaking..." : "Listening..."}
      </p>
    </div>
  </div>
)}
```

### 5. Input Area (Igual à Eve)
```tsx
<div className="border-t border-accent/10 p-4 bg-gradient-to-t from-secondary/30 to-transparent">
  <div className="flex items-center gap-3">
    <div className="relative">
      {!isCallActive && !isConnecting && (
        <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping-slow" />
      )}
      <Button
        onClick={handleToggleVoice}
        disabled={isConnecting}
        size="icon"
        className={`h-12 w-12 rounded-full shrink-0 transition-all duration-300 relative z-10 ${
          isCallActive
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
            : isConnecting
            ? 'bg-accent/50 text-accent-foreground'
            : 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]'
        }`}
      >
        {isCallActive ? (
          <MicOff className="h-5 w-5" />
        ) : isConnecting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-foreground border-t-transparent" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
    </div>

    <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={isCallActive ? "Voice mode active..." : "Type your message..."}
        disabled={isLoading || isCallActive}
        className="flex-1 px-5 py-3 bg-secondary/80 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50 transition-all duration-300"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!inputText.trim() || isLoading || isCallActive}
        className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:opacity-50 disabled:shadow-none"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  </div>

  <p className="text-xs text-center text-muted-foreground/70 mt-3">
    {isCallActive 
      ? "Tap the microphone to end the call" 
      : "Type a message or tap the microphone to speak"
    }
  </p>
</div>
```

## Comportamento do Mic (Igual à Eve)

| Estado | Ícone | Cor | Ação ao Clicar |
|--------|-------|-----|----------------|
| Inativo | `Mic` | Dourado com pulse | Iniciar chamada |
| Conectando | Spinner | Dourado 50% | Desabilitado |
| Ativo | `MicOff` | Vermelho | Encerrar chamada |

**NOTA**: Na Eve, quando a chamada está ativa, o input fica desabilitado. O botão do mic encerra a chamada, NÃO muta.

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Reescrever completamente baseado no ChatSection |

## Resumo das Mudanças

1. Remover `QUICK_REPLIES` inline
2. Remover lógica de `toggleMicMute` e `isMicMuted` 
3. Remover Error Display inline
4. Remover Voice Visualization inline complexa
5. Usar cores `accent` e `secondary` (não amber) para ser idêntico à Eve
6. Header com avatar `size="md"`
7. Empty State idêntico à Eve
8. Voice Visualization simples idêntica à Eve
9. Input Area com form e comportamento idêntico
10. Mic button que inicia/encerra chamada (não mute)
11. Helper text idêntico

