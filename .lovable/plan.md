
# Plano: Atualizar Visual do KyleConsultantDialog (Voz)

## Objetivo

Modificar o visual do popup de voz (`KyleConsultantDialog`) para ficar igual ao popup de chat (`KyleChatDialog`), mas mantendo a funcionalidade de voz. Inclui:

1. Mesmo botão de fechar (X no header)
2. Mesmo estilo visual na área de transcripts
3. Auto-iniciar a chamada ao abrir (sem precisar clicar no mic)

## Comparação Visual

| Elemento | Antes (Voz) | Depois (Igual ao Chat) |
|----------|-------------|------------------------|
| Header | Centralizado com Sparkles | Barra com título + ↻ Reset + X Fechar |
| Botão fechar | Padrão do Dialog | Botão X customizado no header |
| Transcripts | Box simples com texto pequeno | Área de mensagens estilizada com bolhas |
| Início | Precisa clicar no mic | Auto-conecta ao abrir |
| Botão principal | Grande no centro | Menor, parte do footer |

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` | Reformular visual |
| `src/hooks/useKyleElevenLabs.ts` | Adicionar `restartCall` (igual ao chat) |

## Mudanças Detalhadas

### 1. Hook useKyleElevenLabs.ts

Adicionar o método `restartCall` (igual ao que fizemos no chat) para suportar o botão de refresh:

```typescript
// Adicionar refs
const statusRef = useRef<string>("disconnected");
const isRestartingRef = useRef(false);

// Sync statusRef
useEffect(() => {
  statusRef.current = conversationHook.status;
}, [conversationHook.status]);

// Método restartCall
const restartCall = useCallback(async () => {
  if (isRestartingRef.current) return;
  isRestartingRef.current = true;

  if (statusRef.current === "connected") await endCall();

  // Poll for disconnected (max 3s)
  for (let i = 0; i < 60; i++) {
    if (statusRef.current === "disconnected") break;
    await new Promise(r => setTimeout(r, 50));
  }

  setMessages([]);
  await startCall();
  isRestartingRef.current = false;
}, [endCall, startCall]);
```

### 2. KyleConsultantDialog.tsx - Novo Layout

**Novo Header (igual ao chat):**
```typescript
<div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Sparkles className="h-5 w-5 text-amber-400" />
      <span className="font-semibold text-foreground">AI Sales Consultant</span>
    </div>
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
</div>
```

**Área de Transcripts (estilo chat com bolhas):**
- Altura fixa igual ao chat: `h-[300px]`
- Mensagens com bolhas estilizadas
- Avatar do Kyle nas mensagens dele
- Indicador de "Kyle is speaking..."

**Footer com controles de voz:**
- Botão de mic (toggle call)
- Timer de duração
- Status visual

**Auto-connect ao abrir:**
```typescript
useEffect(() => {
  if (open && wizardId && !isCallActive && !isConnecting) {
    const timer = setTimeout(() => {
      toggleCall();
    }, 500);
    return () => clearTimeout(timer);
  }
}, [open, wizardId]);
```

## Estrutura Final do Dialog

```
┌─────────────────────────────────────────┐
│ [Sparkles] AI Sales Consultant  [↻] [X] │  ← Header
├─────────────────────────────────────────┤
│        [Avatar Kyle]                    │
│           Kyle                          │  ← Info section
│    Sales Consultant                     │
│      [● Connected]                      │
├─────────────────────────────────────────┤
│                                         │
│  [Avatar] Kyle is speaking...           │  ← Transcript area
│                                         │  (estilo bolhas)
│                        You said X [You] │
│                                         │
│  [Avatar] Response from Kyle            │
│                                         │
├─────────────────────────────────────────┤
│     [🎤 Mic Button]   03:45             │  ← Footer com controles
│   🎤 Voice • Free consultation          │
└─────────────────────────────────────────┘
```

## Comportamento

| Ação | Comportamento |
|------|---------------|
| Abrir dialog | Auto-conecta após 500ms |
| Botão ↻ (refresh) | Reinicia sessão (restartCall) |
| Botão X | Encerra chamada e fecha |
| Botão mic (quando conectado) | Encerra chamada |
| Botão mic (quando desconectado) | Inicia chamada |

## Resultado Final

O popup de voz terá o mesmo visual polido do chat, com:
- Header consistente com botões ↻ e X
- Área de transcripts com bolhas estilizadas
- Auto-conexão ao abrir
- Footer com controles de voz
- Toda a funcionalidade de voz preservada
