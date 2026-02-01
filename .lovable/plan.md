
# Plano: Melhorar Visual do KyleChatDialog (Chat + Voice Híbrido)

## Objetivo

Redesenhar o `KyleChatDialog` para deixar **claro que o usuário pode tanto digitar quanto falar**, inspirando-se no visual premium do chat da Eve.

## Elementos Inspirados do Chat da Eve

| Elemento | Eve (Atual) | Kyle (Novo) |
|----------|-------------|-------------|
| Input Area | Mic circular + Input texto + Send | Mesmo padrão |
| Voice Visualization | Barras de frequência animadas | Adicionar igual |
| Helper Text | "Type a message or tap the microphone" | Adicionar similar |
| Quick Replies | Botões com ícones e hover effects | Melhorar design |
| Empty State | Avatar com glow + badges | Adaptar para Kyle |

## Mudanças Visuais Propostas

### 1. Input Area Unificada (Mic + Texto)

**Antes:**
```
┌─────────────────────────────────────┐
│ [Input de texto...........]  [Send] │
└─────────────────────────────────────┘
```

**Depois (Estilo Eve):**
```
┌───────────────────────────────────────────────┐
│ [🎤]  [Input de texto...............] [Send] │
│                                               │
│    "Type a message or tap mic to speak"       │
└───────────────────────────────────────────────┘
```

O botão de microfone terá:
- Estado normal: Gradiente amber com glow
- Estado ativo (chamada): Vermelho com ícone MicOff
- Animação pulse quando inativo (convite para clicar)

### 2. Voice Visualization (Barras de Frequência)

Quando a chamada de voz estiver ativa, mostrar barras de frequência animadas acima do input (como na Eve):

```
┌───────────────────────────────────────┐
│     ▂ ▄ ▆ █ ▆ ▄ ▂ ▂ ▄ ▆ ▄ ▂         │
│           ● Listening...              │
└───────────────────────────────────────┘
```

Reutilizar o componente `VoiceVisualization.tsx` existente.

### 3. Empty State Melhorado

Quando não há mensagens, mostrar:
- Avatar do Kyle com glow amber
- Texto de boas-vindas
- Badges indicando "Chat" e "Voice"

```
┌────────────────────────────────────┐
│                                    │
│         [Kyle Avatar + Glow]       │
│                                    │
│      Hi! I'm Kyle                  │
│   Your AI sales consultant         │
│                                    │
│  [💬 Chat]  [🎤 Voice]             │
│                                    │
└────────────────────────────────────┘
```

### 4. Quick Replies com Ícones

Transformar os badges simples em botões mais elaborados com ícones:

```
┌────────────────────────────────────────────────────┐
│  [💰 Pricing]  [📅 Schedule]  [📦 Services]       │
└────────────────────────────────────────────────────┘
```

### 5. Helper Text Dinâmico

No footer do input, texto que muda conforme o estado:
- Inativo: "Type a message or tap 🎤 to speak"
- Chamada ativa: "Tap microphone to end call"
- Speaking: "Kyle is responding..."

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Modificar - redesign completo da área de input |

## Detalhes Técnicos

### Estados do Microfone

```typescript
// Cores do botão de microfone
const micButtonClasses = isCallActive
  ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
  : isConnecting
    ? 'bg-amber-500/50'
    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.3)]';
```

### Voice Visualization

Reutilizar a lógica existente do `useKyleElevenLabs`:

```typescript
// Já expõe getInputVolume e getOutputVolume
const { getInputVolume, getOutputVolume } = useKyleElevenLabs({ wizardId });

// Criar frequencyBars baseado no volume real
useEffect(() => {
  if (isCallActive) {
    const interval = setInterval(() => {
      const vol = Math.max(getInputVolume(), getOutputVolume());
      // Gerar barras animadas...
    }, 50);
  }
}, [isCallActive]);
```

### Helper Text Dinâmico

```typescript
const getHelperText = () => {
  if (isCallActive) {
    return isSpeaking 
      ? "Kyle is responding..." 
      : "Tap 🎤 to end call";
  }
  return "Type a message or tap 🎤 to speak";
};
```

## Layout Final

```
┌────────────────────────────────────────────────┐
│ ✨ AI Sales Consultant                   [🔄] │  Header
├────────────────────────────────────────────────┤
│                                                │
│              [Kyle Avatar + Glow]              │
│                    Kyle                        │
│             Sales Consultant                   │
│               [🟢 Online]                      │
│                                                │
│         [💬 Chat]    [🎤 Voice]               │  Feature badges
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  [Mensagens aqui...]                           │  Messages
│                                                │
├────────────────────────────────────────────────┤
│  [💰 Pricing] [📅 Schedule] [📦 Services]     │  Quick Replies
├────────────────────────────────────────────────┤
│     ▂ ▄ ▆ █ ▆ ▄ ▂ ▂ ▄ ▆ ▄ ▂                  │  Voice Viz (quando ativo)
│           ● Listening...                       │
├────────────────────────────────────────────────┤
│ [🎤]  [Type your message...]         [Send]   │  Input unificado
│                                                │
│    "Type a message or tap 🎤 to speak"        │  Helper text
└────────────────────────────────────────────────┘
```

## Ordem de Implementação

1. Adicionar botão de microfone na área de input
2. Implementar voice visualization (barras de frequência)
3. Melhorar empty state com badges Chat/Voice
4. Redesenhar quick replies com ícones
5. Adicionar helper text dinâmico
6. Ajustar estados visuais do microfone (normal/ativo/conectando)
