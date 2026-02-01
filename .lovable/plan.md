

# Plano: Remover Animação de Áudio e Mostrar Transcrição

## Resumo

Remover toda a lógica de animação de áudio que não está funcionando e substituir pela exibição da transcrição da conversa em tempo real.

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` | Substituir animação por transcrição |

## Mudanças Técnicas

### O que será REMOVIDO:

1. **Estado e refs de animação:**
   - `frequencyBars` state (linha 17)
   - `animationFrameRef` ref (linha 18)
   - `getInputVolumeRef`, `getOutputVolumeRef`, `isSpeakingRef` refs (linhas 31-34)

2. **useEffects de animação:**
   - useEffect que atualiza refs (linhas 36-41)
   - useEffect de visualização com requestAnimationFrame (linhas 56-93)

3. **Seção de barras de frequência:**
   - Div com `frequencyBars.map()` (linhas 165-183)

4. **Imports não utilizados:**
   - `getInputVolume`, `getOutputVolume` do hook

### O que será ADICIONADO:

1. **Importar `messages` do hook:**
```typescript
const {
  isCallActive,
  isConnecting,
  isSpeaking,
  error,
  messages,  // ADICIONAR
  toggleCall,
  endCall,
} = useKyleElevenLabs({ wizardId });
```

2. **Ref para auto-scroll:**
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);
```

3. **useEffect para auto-scroll:**
```typescript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
```

4. **Área de transcrição** (substituindo as barras de frequência):
```typescript
{/* Conversation Transcript */}
<div className="mx-4 h-32 overflow-y-auto rounded-lg bg-background/50 border border-border/30 p-3">
  {messages.length === 0 ? (
    <p className="text-xs text-muted-foreground text-center py-4">
      {isCallActive ? "Listening..." : "Start a call to see the transcript"}
    </p>
  ) : (
    <div className="space-y-2">
      {messages.map((msg, index) => (
        <div 
          key={index}
          className={`text-xs ${
            msg.role === "user" 
              ? "text-right text-amber-400" 
              : "text-left text-muted-foreground"
          }`}
        >
          <span className="font-medium">
            {msg.role === "user" ? "You: " : "Kyle: "}
          </span>
          {msg.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )}
</div>
```

## Visual Final

```
┌────────────────────────────────────────┐
│     ✨ AI Sales Consultant ✨           │
├────────────────────────────────────────┤
│                                        │
│           [Kyle Avatar]                │
│              Kyle                      │
│         Sales Consultant               │
│            ● Listening...              │
│              2:34                      │
│                                        │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │ Kyle: Hello! How can I help...   │  │
│  │                  You: I want...  │  │
│  │ Kyle: Great choice! Let me...    │  │
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│        [Interested in: Package]        │
├────────────────────────────────────────┤
│           (  📞 Botão  )               │
│      Tap to end the conversation       │
├────────────────────────────────────────┤
│  🎤 Voice powered by AI • Free consult │
└────────────────────────────────────────┘
```

## Resumo das Alterações

- **Remover:** ~40 linhas de código de animação
- **Adicionar:** ~25 linhas de código de transcrição
- **Resultado:** Interface mais simples e funcional com histórico visível da conversa

