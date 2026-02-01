

# Plano: Corrigir Problemas de Áudio do Kyle

## Problemas Identificados

### 1. Loop Infinito no `KyleConsultantDialog.tsx`
O console mostra: "Maximum update depth exceeded" neste componente.

**Causa**: O `useEffect` na linha 45-81 tem `getInputVolume` e `getOutputVolume` nas dependências:

```tsx
useEffect(() => {
  // ...
}, [isCallActive, isSpeaking, getInputVolume, getOutputVolume]); // ❌ Problema aqui!
```

Essas funções são recriadas a cada render, causando o `useEffect` disparar infinitamente, o que quebra a conexão de áudio.

### 2. Auto-Start Mal Configurado no `KyleChatDialog.tsx`
O `useEffect` de auto-start pode estar causando reconexões múltiplas:

```tsx
useEffect(() => {
  if (open && !isCallActive && !isConnecting) {
    const timer = setTimeout(() => {
      handleToggleVoice(); // ← Chamado múltiplas vezes
    }, 300);
    return () => clearTimeout(timer);
  }
}, [open]); // ❌ Faltam dependências e controle de estado
```

## Solução

### Correção 1: `KyleConsultantDialog.tsx`
Usar `useRef` para as funções de volume (igual já foi feito no `KyleChatDialog.tsx`):

```tsx
// Store volume functions in refs to avoid dependency issues
const getInputVolumeRef = useRef(getInputVolume);
const getOutputVolumeRef = useRef(getOutputVolume);
getInputVolumeRef.current = getInputVolume;
getOutputVolumeRef.current = getOutputVolume;

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
    // ... resto do código
  };
  // ...
}, [isCallActive, isSpeaking]); // ← Sem as funções de volume
```

### Correção 2: `KyleChatDialog.tsx`
Adicionar um ref para controlar se já tentou iniciar e prevenir múltiplas tentativas:

```tsx
const hasAutoStarted = useRef(false);

// Auto-start voice call when dialog opens
useEffect(() => {
  if (open && !isCallActive && !isConnecting && !hasAutoStarted.current) {
    hasAutoStarted.current = true;
    const timer = setTimeout(() => {
      handleToggleVoice();
    }, 300);
    return () => clearTimeout(timer);
  }
  
  // Reset when dialog closes
  if (!open) {
    hasAutoStarted.current = false;
  }
}, [open, isCallActive, isConnecting, handleToggleVoice]);
```

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` | Corrigir loop infinito das funções de volume |
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Adicionar controle de auto-start com ref |

## Resultado Esperado

1. O loop infinito será eliminado
2. O áudio do Kyle funcionará corretamente
3. O auto-start iniciará apenas uma vez quando o dialog abrir

